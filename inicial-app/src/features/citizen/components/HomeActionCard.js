import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";

export default function HomeActionCard({
  title,
  subtitle,
  icon,
  variant = "primary",
  onPress,
}) {
  if (variant === "primary") {
    return (
      <Pressable onPress={onPress} style={styles.primaryWrap}>
        <LinearGradient
          colors={[COLORS.green, COLORS.greenDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryCard}
        >
          <View style={styles.primaryIcon}>
            <Ionicons name={icon} size={28} color={COLORS.bg} />
          </View>
          <Text style={styles.primaryTitle}>{title}</Text>
          <Text style={styles.primarySubtitle}>{subtitle}</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={COLORS.bg}
            style={styles.chevron}
          />
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.secondaryCard}>
      <View style={styles.secondaryIcon}>
        <Ionicons name={icon} size={24} color={COLORS.green} />
      </View>
      <View style={styles.secondaryText}>
        <Text style={styles.secondaryTitle}>{title}</Text>
        <Text style={styles.secondarySubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryWrap: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  primaryCard: {
    padding: SPACING.lg,
    minHeight: 140,
    borderRadius: RADIUS.xl,
  },
  primaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  primaryTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.bg,
    fontSize: 22,
  },
  primarySubtitle: {
    ...TYPOGRAPHY.body,
    color: "rgba(11, 17, 32, 0.75)",
    marginTop: SPACING.xs,
    maxWidth: "85%",
  },
  chevron: {
    position: "absolute",
    right: SPACING.lg,
    top: SPACING.lg,
  },
  secondaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  secondaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${COLORS.green}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    flex: 1,
  },
  secondaryTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  secondarySubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
