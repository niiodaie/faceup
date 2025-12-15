// hooks/useSession.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

/**
 * ✅ SAFE DEFAULT CONTEXT
 * Prevents blank pages if useSession() is called early
 */
const SessionContext = createContext({
  session: null,
  user: null,
  loading: true,
  isGuest: false,
  guestTrialEnd: null,
  enableGuestMode: () => {},
  disableGuestMode: () => {},
  signOut: async () => {},
});

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("faceup_guest_mode") === "true"
  );

  const [guestTrialEnd, setGuestTrialEnd] = useState(() => {
    const stored = localStorage.getItem("faceup_guest_trial_end");
    return stored ? Number(stored) : null;
  });

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const enableGuestMode = () => {
    const trialEnd = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    localStorage.setItem("faceup_guest_mode", "true");
    localStorage.setItem("faceup_guest_trial_end", String(trialEnd));
    setIsGuest(true);
    setGuestTrialEnd(trialEnd);
  };

  const disableGuestMode = () => {
    localStorage.removeItem("faceup_guest_mode");
    localStorage.removeItem("faceup_guest_trial_end");
    setIsGuest(false);
    setGuestTrialEnd(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    disableGuestMode();
    setSession(null);
    setUser(null);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        user,
        loading,
        isGuest,
        guestTrialEnd,
        enableGuestMode,
        disableGuestMode,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
