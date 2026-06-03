import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";

export default function ImpactWeeklyCard({ isActive, co2Kg }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Impacto Semanal</Text>
        <View style={[styles.badge, isActive && styles.badgeActive]}>
          <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
            {isActive ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <Ionicons name="leaf-outline" size={18} color={COLORS.green} />
        <Text style={styles.co2}>CO₂ Ahorrado: {co2Kg} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.inputBg,
  },
  badgeActive: {
    backgroundColor: `${COLORS.green}22`,
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  badgeTextActive: {
    color: COLORS.green,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  co2: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});
