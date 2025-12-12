import Stripe from 'stripe';
import dotenv from 'dotenv';
import { getUserSubscription } from './supabaseService.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * CREATE CHECKOUT SESSION
 * POST /stripe/create-checkout
 */
export async function createCheckoutSession(req, res) {
  try {
    const { userId, priceId } = req.body;

    if (!userId || !priceId) {
      return res.status(400).json({ error: 'Missing userId or priceId' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],

      // 🔐 Trial configuration
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId,
          plan: 'pro',
          access: 'trial'
        }
      },

      // 🔐 Session-level metadata (webhook-safe)
      metadata: {
        userId,
        plan: 'pro',
        access: 'trial'
      },

      client_reference_id: userId,

      success_url: `${process.env.FRONTEND_URL}/app?checkout=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
}

/**
 * GET SUBSCRIPTION STATUS
 * GET /stripe/subscription/:userId
 */
export async function getSubscriptionStatus(req, res) {
  try {
    const subscription = await getUserSubscription(req.params.userId);

    if (!subscription) {
      return res.json({
        plan: 'free',
        status: 'inactive',
        isTrial: false
      });
    }

    const isTrial =
      subscription.status === 'trialing' ||
      (subscription.current_period_end &&
        new Date(subscription.current_period_end) > new Date() &&
        subscription.plan_type === 'pro');

    res.json({
      plan: subscription.plan_type,
      status: subscription.status,
      isTrial,
      trialEndsAt: subscription.current_period_end
    });

  } catch (err) {
    console.error('Status lookup error:', err);
    res.status(500).json({ error: 'Status lookup failed' });
  }
}
