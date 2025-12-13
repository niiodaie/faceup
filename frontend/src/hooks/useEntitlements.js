import { useEffect, useState } from 'react';
import { useSession } from './useSession';

export function useEntitlements() {
  const { user, isGuest } = useSession();
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      setEntitlements({
        role: 'guest',
        features: {
          faceScan: true,
          suggestions: true,
          adsEnabled: true,
        },
        limits: {
          scansRemaining: 3,
          trialEndsAt: null,
        },
      });
      setLoading(false);
      return;
    }

    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/entitlements/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setEntitlements(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Entitlement fetch failed', err);
        setLoading(false);
      });
  }, [user, isGuest]);

  return { entitlements, loading };
}
