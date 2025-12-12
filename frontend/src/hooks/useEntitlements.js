import { useEffect, useState } from 'react';
import { useSession } from './useSession';

export function useEntitlements() {
  const { user } = useSession();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) {
      setData({ plan: 'guest' });
      return;
    }

    fetch(`/entitlements/${user.id}`)
      .then(res => res.json())
      .then(setData);
  }, [user]);

  return data;
}
