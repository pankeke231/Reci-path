import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { isAdmin, isCitizen, isCollector } from "../models/user";
import LoadingSpinner from "../ui/components/LoadingSpinner";
import AdminNavigator from "./AdminNavigator";
import AuthNavigator from "./AuthNavigator";
import CitizenNavigator from "./CitizenNavigator";
import CollectorNavigator from "./CollectorNavigator";
import { navigationTheme } from "./navigationTheme";
import type { UserProfile } from "../models/user";

function RoleNavigator({ profile }: { profile: UserProfile }) {
  if (isAdmin(profile)) return <AdminNavigator />;
  if (isCollector(profile)) return <CollectorNavigator />;
  if (isCitizen(profile)) return <CitizenNavigator />;
  return <CitizenNavigator />;
}

export default function RootNavigator() {
  const { isAuthenticated, profile, initializing, loading } = useAuth();

  if (initializing || (isAuthenticated && !profile && loading)) {
    return <LoadingSpinner message="Iniciando S.E.A…" />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated && profile ? (
        <RoleNavigator profile={profile} />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
