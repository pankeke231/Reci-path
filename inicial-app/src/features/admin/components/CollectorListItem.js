import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { getProfileDisplayName } from "../../../models/user";

export default function CollectorListItem({ collector, onView, onEdit }) {
  const name = getProfileDisplayName(collector);

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color={COLORS.green} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          Nº identidad: {collector.document_id || "—"}
        </Text>
        <Text style={styles.meta}>TELÉFONO: {collector.phone || "—"}</Text>
        {collector.vehicle_type && (
          <Text style={styles.meta}>
            VEHÍCULO: {collector.vehicle_type || "—"}
          </Text>
        )}
        {collector.license_plate && (
          <Text style={styles.meta}>
            PLACA: {collector.license_plate || "—"}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={onView}>
          <Ionicons name="eye-outline" size={18} color={COLORS.textPrimary} />
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onEdit}>
          <Ionicons
            name="create-outline"
            size={18}
            color={COLORS.textPrimary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  actions: {
    gap: SPACING.sm,
    justifyContent: "center",
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
