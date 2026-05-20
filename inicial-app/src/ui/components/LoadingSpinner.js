import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import COLORS from '../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../theme/spacing';

export default function LoadingSpinner({ message = 'Cargando…' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.green} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
    padding: SPACING.xl,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});
