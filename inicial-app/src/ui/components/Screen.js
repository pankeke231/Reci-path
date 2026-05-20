import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../constants/colors';
import { SPACING } from '../theme/spacing';

export default function Screen({
  children,
  scroll = false,
  padded = true,
  style,
  contentStyle,
}) {
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? {
        contentContainerStyle: [
          padded && styles.padded,
          styles.scrollContent,
          contentStyle,
        ],
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled',
      }
    : { style: [styles.flex, padded && styles.padded, contentStyle] };

  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
      <Container style={scroll ? styles.flex : undefined} {...containerProps}>
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.md,
  },
});
