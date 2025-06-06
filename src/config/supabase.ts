import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to demo values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vusdncuduzoudxrimdjs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1c2RuY3VkdXpvdWR4cmltZGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzkwNTQsImV4cCI6MjA2NDExNTA1NH0.SLp5pYDXO7Lk7Oqzwb_G2piCSf9e6e4fExCpYwK074A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Add error handling for Supabase connection
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});