import { supabase } from './supabaseService.js';

export async function resolveEntitlements(userId) {
  if (!userId) {
    return {
      plan: 'guest',
      isTrialActive: false,
      features: {
        scan: true,
        save: false,
        history: false,
        advancedAI: false,
        ads: true
      },
      limits: { scans: 3 }
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, trial_ends_at')
    .eq('id', userId)
    .single();

  let plan = profile?.plan || 'free';
  let isTrialActive = false;

  // Trial expiration enforcement
  if (plan === 'trial') {
    if (profile.trial_ends_at && new Date(profile.trial_ends_at) > new Date()) {
      isTrialActive = true;
    } else {
      // Auto-downgrade expired trial
      await supabase
        .from('profiles')
        .update({ plan: 'free', ads_enabled: true })
        .eq('id', userId);
      plan = 'free';
    }
  }

  return {
    plan,
    isTrialActive,
    features: {
      scan: true,
      save: plan !== 'free',
      history: plan !== 'free',
      advancedAI: plan === 'pro' || isTrialActive,
      ads: plan === 'free'
    },
    limits: {
      scans: plan === 'free' ? 5 : null
    }
  };
}
