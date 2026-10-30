import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project.supabase.co')
);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured && supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.info('CivicAI: Connected to Supabase Cloud Database');
  } catch (err) {
    console.warn('CivicAI: Failed to initialize Supabase client, falling back to local persistent store', err);
    supabase = null;
  }
} else {
  console.info('CivicAI: Running in Local Persistent Demo Mode (No Supabase credentials in .env)');
}
