import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { authService } from "../../../services/authService";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { Button, Input, Screen } from "../../../ui/components";
import { getErrorMessage } from "../../../utils/errors";
import { isValidPassword } from "../../../utils/validators";

type Props = {
  code?: string | null;
  error?: string | null;
  errorDescription?: string | null;
  onFinished: () => void;
  onRequestNewLink: () => void;
};

type Status = "checking" | "ready" | "invalid";

export default function ResetPasswordScreen({
  code,
  error,
  errorDescription,
  onFinished,
  onRequestNewLink,
}: Props) {
  const { signOut } = useAuth();
  const [status, setStatus] = useState<Status>("checking");
  const [statusError, setStatusError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmation?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const prepareSession = async () => {
      if (error || errorDescription) {
        if (!active) return;
        setStatusError(
          errorDescription ||
            "El enlace de recuperación expiró o ya fue utilizado.",
        );
        setStatus("invalid");
        return;
      }

      try {
        if (code) {
          try {
            await authService.exchangeRecoveryCode(code);
          } catch (exchangeError) {
            // Si el código ya fue canjeado (doble montaje o reintento),
            // la sesión de recuperación ya existe y podemos continuar.
            const { data } = await supabase.auth.getSession();
            if (!data.session) throw exchangeError;
          }
        } else {
          const initialUrl = await Linking.getInitialURL();
          const restored = initialUrl
            ? await authService.restoreSessionFromUrl(initialUrl)
            : null;

          if (!restored) {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
              throw new Error(
                "Abre el enlace que enviamos a tu correo para cambiar la contraseña.",
              );
            }
          }
        }

        if (active) setStatus("ready");
      } catch (prepareError) {
        if (!active) return;
        const message = getErrorMessage(prepareError);
        setStatusError(
          /code verifier/i.test(message)
            ? "Abre el enlace desde el mismo dispositivo donde solicitaste el cambio de contraseña."
            : message,
        );
        setStatus("invalid");
      }
    };

    void prepareSession();

    return () => {
      active = false;
    };
  }, [code, error, errorDescription]);

  const handleSubmit = async () => {
    const nextErrors: { password?: string; confirmation?: string } = {};

    if (!isValidPassword(password)) {
      nextErrors.password = "Mínimo 6 caracteres";
    }
    if (confirmation !== password) {
      nextErrors.confirmation = "Las contraseñas no coinciden";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await authService.updatePassword(password);
      Alert.alert(
        "Contraseña actualizada",
        "Ya puedes iniciar sesión con tu nueva contraseña.",
        [
          {
            text: "Iniciar sesión",
            onPress: () => {
              void (async () => {
                try {
                  await signOut();
                } catch {
                  // La sesión de recuperación pudo expirar; continuamos.
                }
                onFinished();
              })();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (updateError) {
      Alert.alert(
        "No pudimos actualizar la contraseña",
        getErrorMessage(updateError),
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "checking") {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.green} size="large" />
          <Text style={styles.checkingText}>Validando enlace...</Text>
        </View>
      </Screen>
    );
  }

  if (status === "invalid") {
    return (
      <Screen scroll>
        <View style={styles.centered}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={COLORS.warning}
            />
          </View>
          <Text style={styles.stateTitle}>Enlace no válido</Text>
          <Text style={styles.stateText}>
            {statusError ??
              "El enlace de recuperación expiró o ya fue utilizado."}
          </Text>
          <Button
            title="Solicitar nuevo enlace"
            onPress={onRequestNewLink}
            style={styles.action}
          />
          <Button
            title="Volver al inicio de sesión"
            variant="ghost"
            onPress={onFinished}
            style={styles.action}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Pressable
        onPress={onFinished}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Volver al inicio de sesión"
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
      </Pressable>

      <View style={styles.brand}>
        <View style={styles.iconCircle}>
          <Ionicons name="key-outline" size={30} color={COLORS.green} />
        </View>
      </View>

      <Text style={styles.title}>Nueva contraseña</Text>
      <Text style={styles.subtitle}>
        Elige una contraseña segura de al menos 6 caracteres.
      </Text>

      <Input
        label="Nueva contraseña"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        secureTextEntry
        autoCapitalize="none"
        placeholder="••••••••"
        error={errors.password}
      />
      <Input
        label="Confirmar contraseña"
        value={confirmation}
        onChangeText={(value) => {
          setConfirmation(value);
          if (errors.confirmation) {
            setErrors((prev) => ({ ...prev, confirmation: undefined }));
          }
        }}
        secureTextEntry
        autoCapitalize="none"
        placeholder="••••••••"
        error={errors.confirmation}
      />

      <Button
        title="Guardar contraseña"
        onPress={handleSubmit}
        loading={loading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xl,
  },
  checkingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
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
  action: {
    alignSelf: "stretch",
    marginTop: SPACING.sm,
  },
});
