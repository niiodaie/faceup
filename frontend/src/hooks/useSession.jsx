// frontend/src/hooks/useSession.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("faceup_guest") === "true"
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const enableGuest = () => {
    localStorage.setItem("faceup_guest", "true");
    localStorage.setItem(
      "faceup_guest_expires",
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    setIsGuest(true);
  };

  const disableGuest = () => {
    localStorage.removeItem("faceup_guest");
    localStorage.removeItem("faceup_guest_expires");
    setIsGuest(false);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        user,
        isAuthenticated: !!user,
        isGuest,
        loading,
        enableGuest,
        disableGuest,
        signOut: async () => {
          await supabase.auth.signOut();
          disableGuest();
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
