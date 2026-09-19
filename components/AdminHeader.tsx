import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import COLORS from "../constants/colors";
import { SPACING, TYPOGRAPHY } from "../ui/theme/spacing";

type AdminHeaderProps = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onProfile?: () => void;
};

export default function AdminHeader({
  title,
  showBack = false,
  onBack,
  onProfile,
}: AdminHeaderProps) {
  return (
    <View style={styles.wrap}>
      {showBack ? (
        <Pressable onPress={onBack} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.iconSpacer} />
      )}

      <View style={styles.titleWrap}>
        <Ionicons name="leaf" size={18} color={COLORS.green} />
        <Text style={styles.title}>{title ?? "Reci-path"}</Text>
      </View>

      <Pressable onPress={onProfile} style={styles.iconBtn} hitSlop={8}>
        <Ionicons name="person-outline" size={22} color={COLORS.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSpacer: {
    width: 40,
  },
  titleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
});