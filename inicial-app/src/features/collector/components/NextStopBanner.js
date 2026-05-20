import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';

export default function NextStopBanner({ address, time }) {
  if (!address) return null;

  return (
    <View style={styles.wrap}>
      <Ionicons name="time-outline" size={16} color={COLORS.green} />
      <Text style={styles.text}>
        Siguiente parada: {address}
        {time ? ` • ${time}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  text: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
