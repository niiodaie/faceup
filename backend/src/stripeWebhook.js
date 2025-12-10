import Stripe from 'stripe';
import dotenv from 'dotenv';
import { updateSubscription } from './supabaseService.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Handle Stripe webhook events
 * POST /stripe/webhook
 */
export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received Stripe event: ${event.type}`);

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);

  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const userId = session.client_reference_id; // Pass user ID when creating checkout

  if (!userId) {
    console.error('No user ID in checkout session');
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await updateSubscription(userId, {
    customerId,
    subscriptionId,
    status: subscription.status,
    planType: getPlanType(subscription),
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
  });

  console.log(`Subscription created for user ${userId}`);
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);

  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  await updateSubscription(userId, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: subscription.status,
    planType: getPlanType(subscription),
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
  });
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);

  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  await updateSubscription(userId, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: subscription.status,
    planType: getPlanType(subscription),
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
  });
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);

  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  await updateSubscription(userId, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: 'canceled',
    planType: getPlanType(subscription),
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
  });
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded:', invoice.id);

  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  // Update subscription status
  await updateSubscription(userId, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: 'active',
    planType: getPlanType(subscription),
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
  });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  console.log('Payment failed:', invoice.id);

  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  // Update subscription status to past_due or unpaid
  await updateSubscription(userId, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: subscription.status, // Will be 'past_due' or 'unpaid'
    planType: getPlanType(subscription),
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
  });
}

/**
 * Get plan type from subscription
 */
function getPlanType(subscription) {
  const priceId = subscription.items.data[0]?.price.id;
  
  // Map price IDs to plan types
  // These should match your Stripe price IDs
  const planMapping = {
    'price_monthly': 'monthly',
    'price_yearly': 'yearly',
    'price_faceup_monthly': 'monthly',
    'price_faceup_yearly': 'yearly'
  };

  return planMapping[priceId] || 'monthly';
}

/**
 * Create checkout session
 * POST /stripe/create-checkout
 */
export async function createCheckoutSession(req, res) {
  try {
    const { userId, priceId, successUrl, cancelUrl } = req.body;

    if (!userId || !priceId) {
      return res.status(400).json({
        error: 'Missing required fields: userId, priceId'
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing`,
      client_reference_id: userId,
      metadata: {
        userId
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
}

/**
 * Get subscription status
 * GET /stripe/subscription/:userId
 */
export async function getSubscriptionStatus(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId parameter'
      });
    }

    const { getUserSubscription } = await import('./supabaseService.js');
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return res.json({
        hasSubscription: false,
        status: 'none'
      });
    }

    res.json({
      hasSubscription: true,
      status: subscription.status,
      planType: subscription.plan_type,
      currentPeriodEnd: subscription.current_period_end
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      error: 'Failed to get subscription status',
      message: error.message
    });
  }
}
