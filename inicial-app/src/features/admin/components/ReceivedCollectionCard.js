import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import {
  getCollectionAddress,
  getReceivedSchedule,
  getWasteTagLabel,
  getWasteTagStyle,
} from "../utils/collectionHelpers";

export default function ReceivedCollectionCard({
  order,
  onPress,
  showChevron = true,
}) {
  const tag = getWasteTagStyle(order);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.tag, { backgroundColor: tag.bg }]}>
        <Text style={[styles.tagText, { color: tag.text }]}>
          {getWasteTagLabel(order)}
        </Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.address} numberOfLines={2}>
          {getCollectionAddress(order)}
        </Text>
      </View>
      <View style={styles.chevronRow}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.time}>{getReceivedSchedule(order)}</Text>
        </View>
        {showChevron ? (
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  chevronRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  address: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  time: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
});
