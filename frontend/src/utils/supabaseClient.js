import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rniewznrqnifzzdnvuct.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ1aWQiOiJuaWV3em5ycW5pZnp6ZG52dWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzE2NDMsImV4cCI6MjA2OTAwNzY0M30.WFk1MX-awkNVR84--ywHdKJLVBiKNsxQMWzc44lPmw8';

// Enhanced Supabase client with Remember Me support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage, // Default to localStorage for "Remember me"
  },
});

// Function to switch storage type based on "Remember me" preference
export const configureSessionStorage = (rememberMe = true) => {
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  
  // Create a new client with the desired storage
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: storage,
    },
  });
};

// Helper functions for authentication
export const authHelpers = {
  // Sign up with email verification
  signUpWithEmail: async (email, password, options = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        ...options,
      },
    });
  },

  // Sign in with email and password
  signInWithEmail: async (email, password, rememberMe = true) => {
    const client = configureSessionStorage(rememberMe);
    return await client.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Sign in with Google OAuth
  signInWithGoogle: async (rememberMe = true) => {
    const client = configureSessionStorage(rememberMe);
    return await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  // Sign in with Magic Link
  signInWithMagicLink: async (email, rememberMe = true) => {
    const client = configureSessionStorage(rememberMe);
    return await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  // Sign in with Phone OTP
  signInWithPhone: async (phone) => {
    return await supabase.auth.signInWithOtp({
      phone,
    });
  },

  // Verify Phone OTP
  verifyPhoneOtp: async (phone, token) => {
    return await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
  },

  // Resend email verification
  resendEmailVerification: async (email) => {
    return await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  // Reset password
  resetPassword: async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
  },

  // Update password
  updatePassword: async (password) => {
    return await supabase.auth.updateUser({
      password,
    });
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  // Get current user
  getUser: async () => {
    return await supabase.auth.getUser();
  },
};

export default supabase;
