import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import {
  formatCompletedDate,
  getCollectionAddress,
  getCompletedTagLabel,
  getWasteTagStyle,
} from "../utils/collectionHelpers";

export default function CompletedCollectionCard({ order, onPress }) {
  const tag = getWasteTagStyle(order);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.tag, { backgroundColor: tag.bg }]}>
        <Text style={[styles.tagText, { color: tag.text }]}>
          {getCompletedTagLabel(order)}
        </Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.address} numberOfLines={2}>
          {getCollectionAddress(order)}
        </Text>
      </View>
      <Text style={styles.date}>{formatCompletedDate(order)}</Text>
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
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  address: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
