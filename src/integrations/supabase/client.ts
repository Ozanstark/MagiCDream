import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://trglajrtkmquwnuxwckk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZ2xhanJ0a21xdXdudXh3Y2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4MjcxODksImV4cCI6MjAyMDQwMzE4OX0.0_KQby1zcn5_rU_TQpqk4tVsgcYvYWWTn3OG1mrqrQE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});