import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { Button, Input, Screen } from "../../../ui/components";
import { getErrorMessage } from "../../../utils/errors";
import { isValidEmail, isValidPassword } from "../../../utils/validators";

export default function LoginScreen({ navigation }) {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!isValidEmail(email)) next.email = "Correo inválido";
    if (!isValidPassword(password)) next.password = "Mínimo 6 caracteres";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await signIn({ email, password });
    } catch (error) {
      Alert.alert("Error de acceso", getErrorMessage(error));
    }
  };

  return (
    <Screen scroll>
      <View style={styles.brand}>
        <View style={styles.logoCircle}>
          <Ionicons name="leaf" size={28} color={COLORS.green} />
        </View>
        <Text style={styles.brandTitle}>Reci-path</Text>
        <Text style={styles.brandSubtitle}>
          Sistema Inteligente de Gestión y Recolección de Residuos Urbanos
        </Text>
      </View>

      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.subtitle}>
        Accede como ciudadano, recolector o administrador
      </Text>

      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="tu@correo.com"
        error={errors.email}
      />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        error={errors.password}
      />

      <Button title="Entrar" onPress={handleLogin} loading={loading} />

      <Button
        title="Crear cuenta nueva"
        variant="secondary"
        onPress={() => navigation.navigate("Register")}
        style={styles.secondaryBtn}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.green,
    letterSpacing: 2,
  },
  brandSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
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
  },
  secondaryBtn: {
    marginTop: SPACING.sm,
  },
});
