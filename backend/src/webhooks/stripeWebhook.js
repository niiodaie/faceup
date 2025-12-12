import Stripe from 'stripe';
import dotenv from 'dotenv';
import { updateSubscription } from '../supabaseService.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * STRIPE WEBHOOK HANDLER
 * POST /stripe/webhook
 */
export async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('❌ Stripe signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`✅ Stripe Event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await onCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await onSubscriptionUpsert(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await onSubscriptionCanceled(event.data.object);
        break;

      case 'invoice.payment_failed':
        await onPaymentFailed(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        // informational — subscription already updated
        break;

      default:
        console.log(`ℹ️ Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('❌ Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook failed' });
  }
}

/* =========================================================
   HANDLERS
   ========================================================= */

async function onCheckoutCompleted(session) {
  if (!session.subscription || !session.client_reference_id) return;

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  await persistSubscription(subscription, session.client_reference_id);
}

async function onSubscriptionUpsert(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await persistSubscription(subscription, userId);
}

async function onSubscriptionCanceled(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await updateSubscription(userId, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: 'canceled',
    planType: getPlanType(subscription),
    currentPeriodStart: toISO(subscription.current_period_start),
    currentPeriodEnd: toISO(subscription.current_period_end)
  });
}

async function onPaymentFailed(invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription
  );

  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await persistSubscription(subscription, userId);
}

/* =========================================================
   HELPERS
   ========================================================= */

async function persistSubscription(subscription, userId) {
  await updateSubscription(userId, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: subscription.status,
    planType: getPlanType(subscription),
    currentPeriodStart: toISO(subscription.current_period_start),
    currentPeriodEnd: toISO(subscription.current_period_end)
  });
}

function toISO(unix) {
  return new Date(unix * 1000).toISOString();
}

function getPlanType(subscription) {
  const priceId = subscription.items.data[0]?.price.id;

  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return 'pro';
  if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) return 'pro';

  return 'free';
}
