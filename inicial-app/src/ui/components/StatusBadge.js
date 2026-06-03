import { StyleSheet, Text, View } from "react-native";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "../../constants/orderStatus";
import { RADIUS, SPACING, TYPOGRAPHY } from "../theme/spacing";

export default function StatusBadge({ status }) {
  const color = ORDER_STATUS_COLORS[status] ?? "#64748B";
  const label = ORDER_STATUS_LABELS[status] ?? status;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}22`, borderColor: color },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
});
