import { DarkTheme } from "@react-navigation/native";
import COLORS from "../constants/colors";

/** Extiende DarkTheme para conservar `fonts` requerido por React Navigation 7 */
export const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.green,
    background: COLORS.bg,
    card: COLORS.cardBg,
    text: COLORS.textPrimary,
    border: COLORS.cardBorder,
    notification: COLORS.accent,
  },
};

export const screenOptions = {
  headerStyle: { backgroundColor: COLORS.bg },
  headerTintColor: COLORS.textPrimary,
  headerTitleStyle: { fontWeight: "700" },
  contentStyle: { backgroundColor: COLORS.bg },
};

export const tabScreenOptions = {
  tabBarStyle: {
    backgroundColor: COLORS.cardBg,
    borderTopColor: COLORS.cardBorder,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarActiveTintColor: COLORS.green,
  tabBarInactiveTintColor: COLORS.textMuted,
  headerShown: false,
};
