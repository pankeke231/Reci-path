import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../../../hooks/useProfile";
import { getProfileDisplayName } from "../../../models/user";
import { ROLE_LABELS } from "../../../constants/roles";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY, RADIUS } from "../../../ui/theme/spacing";
import {
  Button,
  Card,
  Input,
  Screen,
  SectionHeader,
} from "../../../ui/components";
import { getErrorMessage } from "../../../utils/errors";
import { isValidCellPhone } from "../../../utils/validators";

function ProfileHeader({ onBack }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </Pressable>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const [firstNames, setFirstNames] = useState(profile?.first_names ?? "");
  const [lastNames, setLastNames] = useState(profile?.last_names ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  useEffect(() => {
    setFirstNames(profile?.first_names ?? "");
    setLastNames(profile?.last_names ?? "");
    setAddress(profile?.address ?? "");
    setPhone(profile?.phone ?? "");
  }, [
    profile?.first_names,
    profile?.last_names,
    profile?.address,
    profile?.phone,
  ]);

  const handleSave = async () => {
    if (!isValidCellPhone(phone)) {
      Alert.alert("Validación", "Ingresa un número de celular válido");
      return;
    }
    try {
      const first_names = firstNames.trim();
      const last_names = lastNames.trim();
      await updateProfile({
        first_names,
        last_names,
        full_name: `${first_names} ${last_names}`.trim(),
        address: address.trim() || null,
        phone: phone.trim(),
      });
      Alert.alert(
        "Perfil actualizado",
        "Tus datos se guardaron correctamente.",
      );
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    }
  };

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Deseas salir de la aplicación?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <Screen scroll>
      <ProfileHeader onBack={() => navigation.goBack()} />
      <SectionHeader title="Mi perfil" subtitle="Datos de tu cuenta S.E.A" />

      <View style={styles.avatar}>
        <Ionicons name="person" size={40} color={COLORS.green} />
      </View>
      <Text style={styles.displayName}>
        {getProfileDisplayName(profile) || "Usuario"}
      </Text>
      <Text style={styles.role}>
        {ROLE_LABELS[profile?.role] ?? profile?.role}
      </Text>

      <Card>
        <Input
          label="Nº de identidad"
          value={profile?.document_id ?? ""}
          editable={false}
          style={styles.readOnly}
        />
        <Input
          label="Nombres completos"
          value={firstNames}
          onChangeText={setFirstNames}
          autoCapitalize="words"
        />
        <Input
          label="Apellidos completos"
          value={lastNames}
          onChangeText={setLastNames}
          autoCapitalize="words"
        />
        <Input
          label="Dirección de residencia"
          value={address}
          onChangeText={setAddress}
        />
        <Input
          label="Número de celular"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          label="Correo electrónico"
          value={profile?.email ?? ""}
          editable={false}
          style={styles.readOnly}
        />
        <Button
          title="Guardar cambios"
          onPress={handleSave}
          loading={loading}
        />
      </Card>

      <Button
        title="Cerrar sesión"
        variant="secondary"
        onPress={handleSignOut}
        style={styles.logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  displayName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  role: {
    ...TYPOGRAPHY.label,
    color: COLORS.green,
    textAlign: "center",
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  readOnly: {
    opacity: 0.7,
  },
  logout: {
    marginTop: SPACING.md,
  },
});
