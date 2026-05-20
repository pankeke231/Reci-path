import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';
import { ENV, assertSupabaseConfig } from '../../config/env';

assertSupabaseConfig();

export const supabase = createClient(
  ENV.supabaseUrl || 'https://placeholder.supabase.co',
  ENV.supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
