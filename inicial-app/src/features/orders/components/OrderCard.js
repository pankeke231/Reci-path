import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { Card, StatusBadge } from "../../../ui/components";
import { formatDateTime, formatWeight } from "../../../utils/formatters";

export default function OrderCard({ order, onPress }) {
  const wasteName = order.waste_types?.name ?? order.waste_type_id ?? "Residuo";

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{wasteName}</Text>
        <StatusBadge status={order.status} />
      </View>
      <Text style={styles.meta}>
        {formatWeight(order.quantity_kg)} · {formatDateTime(order.created_at)}
      </Text>
      {order.address ? (
        <Text style={styles.address} numberOfLines={2}>
          {order.address}
        </Text>
      ) : (
        <Text style={styles.coords}>
          📍 {order.latitude?.toFixed(4)}, {order.longitude?.toFixed(4)}
        </Text>
      )}
      {order.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {order.notes}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    flex: 1,
  },
  meta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  address: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  coords: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  notes: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontStyle: "italic",
  },
});
