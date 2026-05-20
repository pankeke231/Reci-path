import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';

export default function CollectorStatsCard({ isActive, impactKg }) {
  return (
    <View style={styles.card}>
      <View style={styles.col}>
        <Text style={styles.label}>Estado Hoy</Text>
        <Text style={[styles.value, isActive && styles.valueActive]}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.col}>
        <Text style={styles.label}>Impacto</Text>
        <Text style={styles.impact}>{impactKg} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  value: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
  },
  valueActive: {
    color: COLORS.green,
  },
  impact: {
    ...TYPOGRAPHY.h3,
    color: COLORS.green,
  },
});
