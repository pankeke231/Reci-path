import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../../../hooks/useProfile";
import { getProfileDisplayName } from "../../../models/user";
import { ROLE_LABELS, ROLES } from "../../../constants/roles";
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
import {
  isValidCellPhone,
  normalizeDocumentId,
} from "../../../utils/validators";
import { imageStorageService } from "../../../services/imageStorageService";

function ProfileHeader({ onBack }: { onBack: () => void }) {
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
  const [document_id, setDocumentId] = useState(profile?.document_id ?? "");
  const [firstNames, setFirstNames] = useState(profile?.first_names ?? "");
  const [lastNames, setLastNames] = useState(profile?.last_names ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [avatarDisplayUrl, setAvatarDisplayUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const canChangeAvatar =
    profile?.role === ROLES.CITIZEN || profile?.role === ROLES.COLLECTOR;

  useEffect(() => {
    setDocumentId(profile?.document_id ?? "");
    setFirstNames(profile?.first_names ?? "");
    setLastNames(profile?.last_names ?? "");
    setAddress(profile?.address ?? "");
    setPhone(profile?.phone ?? "");
  }, [
    profile?.document_id,
    profile?.first_names,
    profile?.last_names,
    profile?.address,
    profile?.phone,
  ]);

  useEffect(() => {
    let active = true;
    const avatarPath = profile?.avatar_url;

    if (!avatarPath) {
      setAvatarDisplayUrl(null);
      return;
    }

    const resolveUrl = avatarPath.startsWith("http")
      ? Promise.resolve(avatarPath)
      : imageStorageService.createSignedUrl(avatarPath);

    resolveUrl
      .then((url) => {
        if (active) setAvatarDisplayUrl(url);
      })
      .catch((error) => {
        if (active) Alert.alert("Error", getErrorMessage(error));
      });

    return () => {
      active = false;
    };
  }, [profile?.avatar_url]);

  const handleChooseAvatar = async () => {
    if (!profile?.id || !canChangeAvatar) return;

    let uploadedPath: string | null = null;
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Permite el acceso a tus fotos para elegir una imagen de perfil.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled) return;

      setAvatarLoading(true);
      const asset = result.assets[0];
      uploadedPath = await imageStorageService.upload("Profile", profile.id, {
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });
      const displayUrl =
        await imageStorageService.createSignedUrl(uploadedPath);
      await updateProfile({ avatar_url: uploadedPath });
      setAvatarDisplayUrl(displayUrl);
      const oldAvatarPath = profile.avatar_url;
      if (
        oldAvatarPath &&
        !oldAvatarPath.startsWith("http") &&
        oldAvatarPath !== uploadedPath
      ) {
        try {
          await imageStorageService.remove(oldAvatarPath);
        } catch (error) {
          Alert.alert(
            "Foto actualizada",
            `Se guardó la nueva foto, pero no se pudo eliminar la anterior: ${getErrorMessage(error)}`,
          );
        }
      }
    } catch (error) {
      if (uploadedPath) {
        try {
          await imageStorageService.remove(uploadedPath);
        } catch (cleanupError) {
          Alert.alert(
            "Error al limpiar la imagen",
            getErrorMessage(cleanupError),
          );
        }
      }
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isValidCellPhone(phone)) {
      Alert.alert("Validación", "Ingresa un número de celular válido");
      return;
    }
    try {
      const first_names = firstNames.trim();
      const last_names = lastNames.trim();
      await updateProfile({
        document_id: normalizeDocumentId(document_id),
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

      {canChangeAvatar ? (
        <Pressable
          onPress={handleChooseAvatar}
          disabled={avatarLoading}
          accessibilityRole="button"
          accessibilityLabel="Cambiar foto de perfil"
          style={styles.avatarButton}
        >
          <View style={styles.avatar}>
            {avatarDisplayUrl ? (
              <Image source={{ uri: avatarDisplayUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color={COLORS.green} />
            )}
            <View style={styles.avatarEditBadge}>
              {avatarLoading ? (
                <ActivityIndicator size="small" color={COLORS.bg} />
              ) : (
                <Ionicons name="camera" size={16} color={COLORS.bg} />
              )}
            </View>
          </View>
          <Text style={styles.changeAvatarText}>Cambiar foto</Text>
        </Pressable>
      ) : (
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={COLORS.green} />
        </View>
      )}
      <Text style={styles.displayName}>
        {getProfileDisplayName(profile) || "Usuario"}
      </Text>
      <Text style={styles.role}>
        {profile?.role ? ROLE_LABELS[profile.role] ?? profile.role : ""}
      </Text>

      <Card>
        <Input
          label="Nº de identidad"
          value={document_id}
          onChangeText={setDocumentId}
          style={styles.readOnly}
          keyboardType="default"
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
    overflow: "visible",
  },
  avatarButton: {
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.xl,
  },
  avatarEditBadge: {
    position: "absolute",
    right: -5,
    bottom: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  changeAvatarText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
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
