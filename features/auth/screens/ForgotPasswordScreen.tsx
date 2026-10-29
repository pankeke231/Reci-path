import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { authService } from "../../../services/authService";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { Button, Input, Screen } from "../../../ui/components";
import { getErrorMessage } from "../../../utils/errors";
import { isValidEmail } from "../../../utils/validators";

interface Navigation {
  goBack: () => void;
}

export default function ForgotPasswordScreen({
  navigation,
}: {
  navigation: Navigation;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError("Ingresa un correo válido");
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      const redirectTo = Linking.createURL("reset-password");
      if (__DEV__) console.log("[auth] redirectTo:", redirectTo);
      await authService.requestPasswordReset(email, redirectTo);
      setSentTo(email.trim().toLowerCase());
    } catch (requestError) {
      Alert.alert(
        "No pudimos enviar el correo",
        getErrorMessage(requestError),
      );
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <Screen scroll>
        <View style={styles.stateContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-open-outline" size={30} color={COLORS.green} />
          </View>
          <Text style={styles.stateTitle}>Revisa tu correo</Text>
          <Text style={styles.stateText}>
            Enviamos un enlace de recuperación a{" "}
            <Text style={styles.stateEmail}>{sentTo}</Text>. Ábrelo desde este
            dispositivo para crear una nueva contraseña.
          </Text>
          <Text style={styles.stateHint}>
            Si no llega en unos minutos, revisa la carpeta de spam o vuelve a
            solicitarlo.
          </Text>

          <Button
            title="Reenviar enlace"
            variant="secondary"
            loading={loading}
            onPress={handleSubmit}
            style={styles.action}
          />
          <Button
            title="Volver a iniciar sesión"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.action}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Volver"
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
      </Pressable>

      <View style={styles.brand}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-open-outline" size={30} color={COLORS.green} />
        </View>
      </View>

      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>
        Escribe el correo con el que te registraste y te enviaremos un enlace
        para crear una nueva contraseña.
      </Text>

      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (error) setError(undefined);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="tu@correo.com"
        error={error}
      />

      <Button
        title="Enviar enlace"
        onPress={handleSubmit}
        loading={loading}
      />

      <Button
        title="Cancelar"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.action}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: SPACING.lg,
  },
  brand: {
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 21,
  },
  action: {
    marginTop: SPACING.sm,
  },
  stateContainer: {
    alignItems: "center",
    paddingTop: SPACING.xl,
  },
  stateTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  stateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  stateEmail: {
    color: COLORS.green,
    fontWeight: "600",
  },
  stateHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
});
