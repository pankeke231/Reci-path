import { Pressable, StyleSheet, View } from "react-native";
import COLORS from "../../constants/colors";
import { RADIUS, SPACING } from "../theme/spacing";

export default function Card({ children, onPress, style }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        onPress && pressed && styles.pressed,
        style,
      ]}
    >
      {children}
    </Wrapper>
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
  pressed: {
    opacity: 0.9,
  },
});
