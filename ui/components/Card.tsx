import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import type { ReactNode } from "react";
import COLORS from "../../constants/colors";
import { RADIUS, SPACING } from "../theme/spacing";

export default function Card({ children, onPress, style }: { children: ReactNode; onPress?: (event: GestureResponderEvent) => void; style?: StyleProp<ViewStyle> }) {
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
