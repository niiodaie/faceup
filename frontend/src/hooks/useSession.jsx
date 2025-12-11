import { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '../utils/supabaseClient';

// Create Session Context
const SessionContext = createContext();

// Session Provider Component
export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Error fetching session:', error);
          }
          
          setSession(session);
          setUser(session?.user || null);
          
          // Check for guest mode
          const guestMode = localStorage.getItem('faceup_guest_mode') === 'true';
          setIsGuest(guestMode && !session);
          
          // Fetch user role if authenticated
          if (session?.user) {
            await fetchUserRole(session.user.id);
          } else {
            setUserRole(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const fetchUserRole = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (mounted) {
          if (error) {
            console.error('Error fetching user role:', error);
            setUserRole('user'); // Default role
          } else {
            setUserRole(data?.role || 'user');
          }
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        if (mounted) {
          setUserRole('user'); // Default role
        }
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user || null);
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            setIsGuest(false);
            localStorage.removeItem('faceup_guest_mode');
            if (session?.user) {
              await fetchUserRole(session.user.id);
            }
            break;
            
          case 'SIGNED_OUT':
            setUserRole(null);
            // Check if switching to guest mode
            const guestMode = localStorage.getItem('faceup_guest_mode') === 'true';
            setIsGuest(guestMode);
            break;
            
          case 'TOKEN_REFRESHED':
            // Session refreshed, user remains the same
            break;
            
          default:
            break;
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Session management functions
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }
      
      // Clear guest mode
      localStorage.removeItem('faceup_guest_mode');
      localStorage.removeItem('faceup_guest_demo');
      
      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
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

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return { error };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error in refreshSession:', error);
      return { error };
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) {
        console.error('Error updating user profile:', error);
        return { error };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return { error };
    }
  };

  const value = {
    session,
    user,
    loading,
    isGuest,
    userRole,
    signOut,
    enableGuestMode,
    disableGuestMode,
    refreshSession,
    updateUserProfile,
    isAuthenticated: !!session || isGuest,
    isFullyAuthenticated: !!session,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Legacy hook for backward compatibility
export default function useSessionLegacy() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
