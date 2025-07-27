import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rniewznrqnifzzdnvuct.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ1aWQiOiJuaWV3em5ycW5pZnp6ZG52dWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzE2NDMsImV4cCI6MjA2OTAwNzY0M30.WFk1MX-awkNVR84--ywHdKJLVBiKNsxQMWzc44lPmw8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
});

