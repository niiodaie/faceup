// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = https://rniewznrqnifzzdnvuct.supabase.co;
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaWV3em5ycW5pZnp6ZG52dWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzE2NDMsImV4cCI6MjA2OTAwNzY0M30.WFk1MX-awkNVR84--ywHdKJLVBiKNsxQMWzc44lPmw8;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
