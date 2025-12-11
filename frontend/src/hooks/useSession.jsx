import { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '../utils/supabaseClient';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [userRole, setUserRole] = useState('free');

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      setSession(data?.session || null);
      setUser(data?.session?.user || null);

      const guest = localStorage.getItem('faceup_guest_mode') === 'true';
      setIsGuest(guest && !data?.session);

      if (data?.session?.user?.id) {
        await loadUserRole(data.session.user.id);
      }

      setLoading(false);
    };

    const loadUserRole = async (userId) => {
      try {
        // Try NEW TABLE
        let { data: roleRow } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', userId)
          .single();

        // Fallback to OLD TABLE
        if (!roleRow) {
          const { data: fallback } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

          roleRow = fallback;
        }

        setUserRole(roleRow?.role || 'free');
      } catch (e) {
        console.error('Role fetch failed:', e);
        setUserRole('free');
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);

        setSession(session);
        setUser(session?.user || null);

        if (event === 'SIGNED_IN') {
          localStorage.removeItem('faceup_guest_mode');
          setIsGuest(false);

          if (session?.user?.id) {
            await loadUserRole(session.user.id);
          }
        }

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setUserRole('free');

          const guest = localStorage.getItem('faceup_guest_mode') === 'true';
          setIsGuest(guest);
        }

        setLoading(false);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem('faceup_guest_mode');
    localStorage.removeItem('faceup_guest_demo');
    return { error };
  };

  const enableGuestMode = () => {
    localStorage.setItem('faceup_guest_mode', 'true');
    setIsGuest(true);
  };

  const disableGuestMode = () => {
    localStorage.removeItem('faceup_guest_mode');
    localStorage.removeItem('faceup_guest_demo');
    setIsGuest(false);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        user,
        loading,
        isGuest,
        userRole,
        signOut,
        enableGuestMode,
        disableGuestMode,
        isAuthenticated: !!session || isGuest,
        isFullyAuthenticated: !!session,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be inside SessionProvider');
  return ctx;
};
