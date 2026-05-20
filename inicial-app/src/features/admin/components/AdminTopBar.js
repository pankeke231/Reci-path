import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';

export default function AdminTopBar({ onBack, rightIcon, onRightPress }) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={styles.sideBtn}>
        <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
      </Pressable>
      <View style={styles.brand}>
        <Ionicons name="leaf" size={18} color={COLORS.green} />
        <Text style={styles.brandText}>S.E.A</Text>
      </View>
      <Pressable onPress={onRightPress} style={styles.sideBtn}>
        <Ionicons
          name={rightIcon ?? 'ellipsis-horizontal'}
          size={22}
          color={COLORS.textPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  sideBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
});
