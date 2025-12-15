import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const GUEST_TRIAL_DAYS = 7;
const GUEST_TRIAL_KEY = "faceup_guest_trial_start";
const GUEST_FLAG_KEY = "faceup_guest_mode";

// Single, safe default shape so nothing is ever undefined
const defaultSessionValue = {
  session: null,
  user: null,
  loading: true,
  isGuest: false,
  guestTrialEnd: null,
  enableGuestMode: () => {},
  disableGuestMode: () => {},
  signOut: async () => {},
};

const SessionContext = createContext(defaultSessionValue);

function readGuestFromStorage() {
  try {
    const enabled = localStorage.getItem(GUEST_FLAG_KEY) === "true";
    if (!enabled) return { isGuest: false, guestTrialEnd: null };

    let start = localStorage.getItem(GUEST_TRIAL_KEY);
    if (!start) {
      // if somehow enabled but no start, reset cleanly
      const now = Date.now();
      localStorage.setItem(GUEST_TRIAL_KEY, String(now));
      start = String(now);
    }

    const startedAt = Number(start);
    const guestTrialEnd =
      startedAt + GUEST_TRIAL_DAYS * 24 * 60 * 60 * 1000;

    // Expired → clear guest mode
    if (!Number.isFinite(guestTrialEnd) || guestTrialEnd <= Date.now()) {
      localStorage.removeItem(GUEST_FLAG_KEY);
      localStorage.removeItem(GUEST_TRIAL_KEY);
      return { isGuest: false, guestTrialEnd: null };
    }

    return { isGuest: true, guestTrialEnd };
  } catch {
    return { isGuest: false, guestTrialEnd: null };
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestTrialEnd, setGuestTrialEnd] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // Safely handle missing / misconfigured Supabase
      let currentSession = null;
      let currentUser = null;

      if (supabase) {
        const { data } = await supabase.auth.getSession();
        currentSession = data?.session ?? null;
        currentUser = currentSession?.user ?? null;
      }

      const guestInfo = readGuestFromStorage();

      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentUser);
      setIsGuest(guestInfo.isGuest);
      setGuestTrialEnd(guestInfo.guestTrialEnd);
      setLoading(false);
    };

    init();

    if (!supabase) {
      // No auth listener if supabase is not available
      return () => {
        isMounted = false;
      };
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!isMounted) return;
        setSession(nextSession);
        setUser(nextSession?.user ?? null);

        // Authenticated session takes precedence over guest mode
        if (nextSession?.user) {
          localStorage.removeItem(GUEST_FLAG_KEY);
          localStorage.removeItem(GUEST_TRIAL_KEY);
          setIsGuest(false);
          setGuestTrialEnd(null);
        }
      }
    );

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const enableGuestMode = () => {
    try {
      const now = Date.now();
      localStorage.setItem(GUEST_FLAG_KEY, "true");
      localStorage.setItem(GUEST_TRIAL_KEY, String(now));
      setIsGuest(true);
      setGuestTrialEnd(
        now + GUEST_TRIAL_DAYS * 24 * 60 * 60 * 1000
      );
    } catch {
      // Fail silently – just don't crash the app
    }
  };

  const disableGuestMode = () => {
    try {
      localStorage.removeItem(GUEST_FLAG_KEY);
      localStorage.removeItem(GUEST_TRIAL_KEY);
    } catch {
      // ignore
    }
    setIsGuest(false);
    setGuestTrialEnd(null);
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
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

export const useSession = () => {
  // Never throws, always returns a complete object shape
  const ctx = useContext(SessionContext);
  return ctx || defaultSessionValue;
};
