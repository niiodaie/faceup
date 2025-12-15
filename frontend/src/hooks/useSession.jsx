import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const SessionContext = createContext(null);

const GUEST_TRIAL_DAYS = 7;
const GUEST_TRIAL_KEY = "faceup_guest_trial_start";

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestTrialEnd, setGuestTrialEnd] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);

      const guest = localStorage.getItem("faceup_guest_mode") === "true";
      setIsGuest(guest);

      if (guest) {
        let start = localStorage.getItem(GUEST_TRIAL_KEY);
        if (!start) {
          start = Date.now();
          localStorage.setItem(GUEST_TRIAL_KEY, start);
        }
        setGuestTrialEnd(
          Number(start) + GUEST_TRIAL_DAYS * 24 * 60 * 60 * 1000
        );
      }

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
    localStorage.setItem("faceup_guest_mode", "true");
    localStorage.setItem(GUEST_TRIAL_KEY, Date.now());
    setIsGuest(true);
  };

  const disableGuestMode = () => {
    localStorage.removeItem("faceup_guest_mode");
    localStorage.removeItem(GUEST_TRIAL_KEY);
    setIsGuest(false);
    setGuestTrialEnd(null);
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
        signOut: async () => {
          await supabase.auth.signOut();
          disableGuestMode();
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
};
