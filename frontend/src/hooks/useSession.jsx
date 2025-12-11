import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../utils/supabaseClient";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  // Guest mode flags
  const [isGuest, setIsGuest] = useState(false);
  const [guestTrialEnd, setGuestTrialEnd] = useState(null);

  // Load guest mode from storage on boot
  useEffect(() => {
    const storedGuest = localStorage.getItem("faceup_guest_mode");
    const storedTrial = localStorage.getItem("faceup_trial_end");

    if (storedGuest === "true") {
      setIsGuest(true);
      setGuestTrialEnd(parseInt(storedTrial, 10));
    }
  }, []);

  // Watch for trial expiration
  useEffect(() => {
    if (!isGuest || !guestTrialEnd) return;

    const now = Date.now();
    if (now >= guestTrialEnd) {
      disableGuestMode(); // auto-expire
    }
  }, [isGuest, guestTrialEnd]);

  // Supabase session listener
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Enable guest trial
  const enableGuestMode = () => {
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    setIsGuest(true);
    setGuestTrialEnd(expiry);

    localStorage.setItem("faceup_guest_mode", "true");
    localStorage.setItem("faceup_trial_end", expiry.toString());
  };

  // Disable guest mode → becomes free tier
  const disableGuestMode = () => {
    setIsGuest(false);
    setGuestTrialEnd(null);
    localStorage.removeItem("faceup_guest_mode");
    localStorage.removeItem("faceup_trial_end");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    disableGuestMode();
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        user,
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
};

export const useSession = () => useContext(SessionContext);
