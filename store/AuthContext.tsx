import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";
import { getErrorMessage } from "../utils/errors";
import type { PropsWithChildren } from "react";
import type { Session } from "@supabase/supabase-js";
import type { UserProfile } from "../models/user";
import type { SignUpInput } from "../services/authService";

interface AuthContextValue {
  session: Session | null;
  profile: UserProfile | null;
  user: Session["user"] | null;
  isAuthenticated: boolean;
  initializing: boolean;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<unknown>;
  signUp: (input: SignUpInput) => Promise<unknown>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    const data = await authService.fetchProfile(userId);
    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const currentSession = await authService.getSession();
        if (!mounted) return;
        setSession(currentSession);
        if (currentSession?.user?.id) {
          await loadProfile(currentSession.user.id);
        }
      } catch (error) {
        console.warn("[Auth] bootstrap:", getErrorMessage(error));
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    bootstrap();

    const subscription = authService.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user?.id) {
          await loadProfile(nextSession.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await authService.signIn(credentials);
      setSession(result.session);
      setProfile(result.profile);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    setLoading(true);
    try {
      const result = await authService.signUp(input);
      setSession(result.session);
      setProfile(result.profile);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) return null;
    return loadProfile(session.user.id);
  }, [session?.user?.id, loadProfile]);

  const value: AuthContextValue = useMemo(
    () => ({
      session,
      profile,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      initializing,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [
      session,
      profile,
      initializing,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
