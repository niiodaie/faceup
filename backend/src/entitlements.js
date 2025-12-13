import { getUserSubscription, checkUsageLimit } from './supabaseService.js';

export async function resolveEntitlements(userId) {
  // Guest
  if (!userId) {
    return {
      role: 'guest',
      features: {
        faceScan: true,
        scansPerMonth: 3,
        aiSuggestions: true,
        saveHistory: false,
        adsEnabled: true,
        priorityQueue: false,
        arTryOn: false
      },
      limits: {
        scansRemaining: 3,
        trialEndsAt: null
      }
    };
  }

  const subscription = await getUserSubscription(userId);
  const usage = await checkUsageLimit(userId);

  // Free (registered, no subscription)
  if (!subscription) {
    return {
      role: 'free',
      features: {
        faceScan: true,
        scansPerMonth: 5,
        aiSuggestions: true,
        saveHistory: false,
        adsEnabled: true,
        priorityQueue: false,
        arTryOn: false
      },
      limits: {
        scansRemaining: Math.max(0, 5 - (usage?.scan_count || 0)),
        trialEndsAt: null
      }
    };
  }

  // Trial
  if (subscription.status === 'trialing') {
    return {
      role: 'trial',
      features: {
        faceScan: true,
        scansPerMonth: 'unlimited',
        aiSuggestions: true,
        saveHistory: true,
        adsEnabled: false,
        priorityQueue: true,
        arTryOn: true
      },
      limits: {
        scansRemaining: null,
        trialEndsAt: subscription.current_period_end
      }
    };
  }

  // Pro (paid)
  if (subscription.status === 'active') {
    return {
      role: 'pro',
      features: {
        faceScan: true,
        scansPerMonth: 'unlimited',
        aiSuggestions: true,
        saveHistory: true,
        adsEnabled: false,
        priorityQueue: true,
        arTryOn: true
      },
      limits: {
        scansRemaining: null,
        trialEndsAt: null
      }
    };
  }

  // Fallback (expired / unpaid)
  return {
    role: 'free',
    features: {
      faceScan: true,
      scansPerMonth: 3,
      aiSuggestions: true,
      saveHistory: false,
      adsEnabled: true,
      priorityQueue: false,
      arTryOn: false
    },
    limits: {
      scansRemaining: 3,
      trialEndsAt: null
    }
  };
}
