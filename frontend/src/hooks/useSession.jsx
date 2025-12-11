import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../utils/supabaseClient";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guest mode
  const [isGuest, setIsGuest] = useState(false);

  // Role from database (free, pro)
  const [userRole, setUserRole] = useState("free");

  // ─────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Check Supabase session
        const { data } = await supabase.auth.getSession();
        const activeSession = data?.session;

        setSession(activeSession);
        setUser(activeSession?.user ?? null);

        // Check Guest Mode
        const isGuestStored = localStorage.getItem("faceup_guest_mode") === "true";
        if (!activeSession && isGuestStored) {
          setIsGuest(true);
        }

        // Load user role from DB if logged in
        if (activeSession?.user) {
          await loadUserRole(activeSession.user.id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Session init failed:", err);
        setLoading(false);
      }
    };

    init();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === "SIGNED_IN") {
          localStorage.removeItem("faceup_guest_mode");
          setIsGuest(false);
          if (newSession?.user) {
            await loadUserRole(newSession.user.id);
          }
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setUserRole("free");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ─────────────────────────────────────────────
  // LOAD USER ROLE FROM SUPABASE
  // ─────────────────────────────────────────────
  const loadUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setUserRole("free");
      } else {
        setUserRole(data.role ?? "free");
      }
    } catch (err) {
      console.error("Role fetch failed:", err);
      setUserRole("free");
    }
  };

  // ─────────────────────────────────────────────
  // GUEST MODE CONTROLS
  // ─────────────────────────────────────────────
  const enableGuestMode = () => {
    setIsGuest(true);
    localStorage.setItem("faceup_guest_mode", "true");
  };

  const disableGuestMode = () => {
    setIsGuest(false);
    localStorage.removeItem("faceup_guest_mode");
    localStorage.removeItem("faceup_guest_demo");
  };

  // ─────────────────────────────────────────────
  // SIGN OUT
  // ─────────────────────────────────────────────
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      disableGuestMode();
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        user,
        loading,

        // Guest
        isGuest,
        enableGuestMode,
        disableGuestMode,

        // Roles
        userRole,
        setUserRole,

        // Auth
        signOut,

        // Derived states
        isAuthenticated: !!session || isGuest,
        isFullyAuthenticated: !!session,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
