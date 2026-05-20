import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { formatWeight } from '../../../utils/formatters';
import { CITIZEN_BADGE } from '../constants';
import {
  formatHistorySchedule,
  getPickupDisplayDate,
  getWasteLabel,
} from '../utils/orderHelpers';

export default function ActiveOrderCard({ order, onPress }) {
  const badge = CITIZEN_BADGE[order.status] ?? CITIZEN_BADGE.pending;
  const isActive = badge.tone === 'active';

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{getWasteLabel(order)}</Text>
          <Text style={styles.weight}>{formatWeight(order.quantity_kg)}</Text>
        </View>
        <View
          style={[
            styles.badge,
            isActive ? styles.badgeActive : styles.badgeMuted,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isActive ? styles.badgeTextActive : styles.badgeTextMuted,
            ]}
          >
            {badge.label}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.meta} numberOfLines={1}>
          {order.address ?? 'Ubicación registrada en Cali'}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.meta}>
          {formatHistorySchedule(getPickupDisplayDate(order))}
        </Text>
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
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  weight: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeActive: {
    backgroundColor: COLORS.green,
  },
  badgeMuted: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  badgeTextActive: {
    color: COLORS.bg,
  },
  badgeTextMuted: {
    color: COLORS.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  meta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    flex: 1,
  },
});
