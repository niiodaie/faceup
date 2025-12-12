// hooks/useSession.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("faceup_guest_mode") === "true"
  );

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const enableGuestMode = () => {
    localStorage.setItem("faceup_guest_mode", "true");
    setIsGuest(true);
  };

  const disableGuestMode = () => {
    localStorage.removeItem("faceup_guest_mode");
    setIsGuest(false);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        user,
        loading,
        isGuest,
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

export const useSession = () => useContext(SessionContext);
