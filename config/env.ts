import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export const ENV = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? "",
  supabaseApiKey:
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    extra.supabasePublishableKey ??
    extra.supabaseAnonKey ??
    "",
};

export function assertSupabaseConfig() {
  if (!ENV.supabaseUrl || !ENV.supabaseApiKey) {
    console.warn(
      "[S.E.A] Faltan EXPO_PUBLIC_SUPABASE_URL o una clave pública de Supabase. " +
        "Copia .env.example a .env y reinicia Expo.",
    );
    return false;
  }
  return true;
}
