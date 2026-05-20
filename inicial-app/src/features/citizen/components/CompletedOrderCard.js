import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { formatWeight } from '../../../utils/formatters';
import {
  estimatePoints,
  formatCompletedHeader,
  getRecyclerLabel,
  getWasteLabel,
} from '../utils/orderHelpers';

export default function CompletedOrderCard({ order, onPress }) {
  const points = estimatePoints(order.quantity_kg);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.header}>
        {formatCompletedHeader(order.updated_at ?? order.created_at)}
      </Text>
      <View style={styles.body}>
        <Text style={styles.amount}>{formatWeight(order.quantity_kg)}</Text>
        <Text style={styles.waste}>{getWasteLabel(order)}</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{points} pts</Text>
        </View>
      </View>
      <Text style={styles.footer}>
        Recolectado por: {getRecyclerLabel(order)}
      </Text>
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
  header: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  amount: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  waste: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: `${COLORS.green}22`,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  pointsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    fontWeight: '800',
  },
  footer: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
});
