import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl !== 'your-supabase-url' &&
  supabaseAnonKey !== 'your-supabase-anon-key';

const isClient = typeof window !== 'undefined';

// Initialize the Supabase client. If keys are missing, we export null to avoid runtime crashes.
// The service layer will fall back to local storage / memory storage in development.
export const supabase = isSupabaseConfigured
  ? isClient 
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase keys are missing. Project Atlas is running in Local Storage / Memory Mock Mode.'
  );
}
