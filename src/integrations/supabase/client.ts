import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://trglajrtkmquwnuxwckk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZ2xhanJ0a21xdXdudXh3Y2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMjQ3ODcsImV4cCI6MjA1MTcwMDc4N30.4AToQ0KIy_2XfurcP8S2o32NyLp0cN7qkMdGv8PzXt4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});