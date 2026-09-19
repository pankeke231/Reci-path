import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/store/AuthContext";
import { hasCompletedOnboarding } from "@/lib/onboardingStorage";

export const unstable_settings = {
  initialRouteName: "(onboarding)/index",
};

function NavigationGate() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, initializing } = useAuth();
  const routeGroup = segments[0];
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    setOnboardingCompleted(hasCompletedOnboarding());
  }, []);

  useEffect(() => {
    if (initializing || onboardingCompleted === null) return;

    const inAuth = routeGroup === "(auth)";
    const inOnboarding = routeGroup === "(onboarding)";
    const inRoleApp = routeGroup === "(tabs)";

    if (isAuthenticated && (inAuth || inOnboarding)) {
      router.replace("/home");
    } else if (!isAuthenticated && inOnboarding && onboardingCompleted) {
      router.replace("/(auth)/auth");
    } else if (!isAuthenticated && inRoleApp) {
      router.replace("/(onboarding)/index");
    }
  }, [
    initializing,
    isAuthenticated,
    onboardingCompleted,
    routeGroup,
    router,
  ]);

  return null;
}

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(onboarding)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <NavigationGate />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
