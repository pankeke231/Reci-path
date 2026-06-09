import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";

const InputField = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "sentences",
  showPassword,
  onTogglePassword,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#64748B" style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        autoComplete="off"
        editable={true}
      />

      {label === "CONTRASEÑA" && (
        <TouchableOpacity onPress={onTogglePassword}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default function RegisterScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, loading } = useAuth();

  const [form, setForm] = useState({
    document: "",
    names: "",
    lastNames: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    if (!Object.values(form).every((v) => v)) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    try {
      await signUp({
        documentId: form.document,
        firstNames: form.names,
        lastNames: form.lastNames,
        address: form.address,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo registrar");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="leaf" size={28} color="#10B981" />

            <Text style={styles.logo}>Reci-path</Text>
          </View>

          <Text style={styles.title}>Registro</Text>

          <Text style={styles.subtitle}>
            Únete a nuestra comunidad y comienza a transformar residuos en
            recursos.
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <InputField
            label="Nº IDENTIDAD"
            icon="card-outline"
            placeholder="Ej: 1005678901"
            value={form.document}
            onChangeText={(text) => updateField("document", text)}
            autoCapitalize="none"
            keyboardType="number-pad"
          />

          <InputField
            label="NOMBRES COMPLETOS"
            icon="person-outline"
            placeholder="Tus nombres"
            value={form.names}
            onChangeText={(text) => updateField("names", text)}
            autoCapitalize="words"
          />

          <InputField
            label="APELLIDOS COMPLETOS"
            icon="person-outline"
            placeholder="Tus apellidos"
            value={form.lastNames}
            onChangeText={(text) => updateField("lastNames", text)}
            autoCapitalize="words"
          />

          <InputField
            label="DIRECCIÓN DE RESIDENCIA"
            icon="home-outline"
            placeholder="Ej: Calle 5 #24-10"
            value={form.address}
            onChangeText={(text) => updateField("address", text)}
            autoCapitalize="sentences"
          />

          <InputField
            label="Nº DE CELULAR"
            icon="phone-portrait-outline"
            placeholder="3101234567"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => updateField("phone", text)}
            autoCapitalize="none"
          />

          <InputField
            label="CORREO ELECTRÓNICO"
            icon="mail-outline"
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => updateField("email", text)}
            autoCapitalize="none"
          />

          <InputField
            label="CONTRASEÑA"
            icon="lock-closed-outline"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(text) => updateField("password", text)}
            autoCapitalize="none"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerText}>
              {loading ? "Registrando..." : "Crear cuenta"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿Ya tienes una cuenta?
            <Text style={styles.loginLink} onPress={() => navigation.goBack()}>
              {" "}
              Iniciar sesión
            </Text>
          </Text>

          <View style={styles.linksRow}>
            <Text style={styles.link}>Privacidad</Text>

            <Text style={styles.link}>Términos</Text>

            <Text style={styles.link}>Ayuda</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  scroll: {
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    maxWidth: 320,
  },

  card: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  fieldContainer: {
    marginBottom: 16,
  },

  label: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 14,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },

  registerButton: {
    marginTop: 12,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    marginTop: 28,
    alignItems: "center",
  },

  footerText: {
    color: "#94A3B8",
    textAlign: "center",
  },

  loginLink: {
    color: "#10B981",
    fontWeight: "700",
  },

  linksRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 20,
  },

  link: {
    color: "#64748B",
    fontSize: 12,
  },
});
