import { useEffect, useState } from 'react';

export function useEntitlements(user) {
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/entitlements/${user?.id || ''}`
      );
      const data = await res.json();
      setEntitlements(data);
      setLoading(false);
    }
    load();
  }, [user]);

  return { entitlements, loading };
}
