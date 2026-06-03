import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export const ENV = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? "",
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? "",
};

export function assertSupabaseConfig() {
  if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
    console.warn(
      "[S.E.A] Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copia .env.example a .env y reinicia Expo.",
    );
    return false;
  }
  return true;
}
