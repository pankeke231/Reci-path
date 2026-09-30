import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../../../hooks/useAuth";
import { useOrders } from "../../../../hooks/useOrders";
import { getProfileDisplayName } from "../../../../models/user";
import {
  getWasteContainerColor,
  type WasteType,
  type WasteTypeSelection,
} from "../../../../models/waste";
import { wasteService } from "../../../../services/wasteService";
import COLORS from "../../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../../ui/theme/spacing";
import { Screen } from "../../../../ui/components";
import { getErrorMessage } from "../../../../utils/errors";
import type { ReactNode } from "react";
import { imageStorageService } from "../../../../services/imageStorageService";

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function CitizenRequestScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { createOrder } = useOrders({ autoFetch: false });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [selectedWasteTypeIds, setSelectedWasteTypeIds] = useState<string[]>(
    [],
  );
  const selectedWasteTypes = wasteTypes.filter((type) =>
    selectedWasteTypeIds.includes(type.id),
  );
  const [description, setDescription] = useState("");
  const [wastePhoto, setWastePhoto] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [wasteTypesLoading, setWasteTypesLoading] = useState(true);
  const [wasteTypesError, setWasteTypesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(getProfileDisplayName(profile));
    setPhone(profile?.phone ?? "");
    setAddress(profile?.address ?? "");
    setWasteTypesLoading(true);
    setWasteTypesError(null);
    let active = true;
    wasteService
      .listTypes()
      .then((types) => {
        if (!active) return;
        setWasteTypes(types);
        setSelectedWasteTypeIds((selected) =>
          selected.filter((id) => types.some((type) => type.id === id)),
        );
      })
      .catch((error) => {
        if (active) {
          const message = getErrorMessage(error);
          setWasteTypesError(message);
          Alert.alert("Error al cargar residuos", message);
        }
      })
      .finally(() => {
        if (active) setWasteTypesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [profile]);

  const validateDate = (value: string): string | null => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const iso = `${yyyy}-${mm}-${dd}`;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return iso;
  };

  const handleChooseWastePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Permite el acceso a tus fotos para adjuntar una imagen del residuo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled) setWastePhoto(result.assets[0]);
    } catch (error) {
      Alert.alert("Error al seleccionar la foto", getErrorMessage(error));
    }
  };

  const handleSubmit = async () => {
    const isoDate = validateDate(pickupDate);
    if (!fullName.trim()) {
      Alert.alert("Validación", "El nombre es obligatorio");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Validación", "El celular es obligatorio");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Validación", "La dirección es obligatoria");
      return;
    }
    if (!isoDate) {
      Alert.alert("Validación", "Ingresa la fecha como dd/mm/aaaa");
      return;
    }
    if (selectedWasteTypes.length === 0) {
      Alert.alert("Validación", "Selecciona una categoría");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Validación", "Agrega una descripción breve");
      return;
    }

    setLoading(true);
    let uploadedPhotoPath: string | null = null;
    try {
      if (!profile?.id) {
        throw new Error("Debes iniciar sesión para crear un pedido.");
      }

      if (wastePhoto) {
        uploadedPhotoPath = await imageStorageService.upload(
          "Residue",
          profile.id,
          {
            uri: wastePhoto.uri,
            mimeType: wastePhoto.mimeType,
            fileName: wastePhoto.fileName,
          },
        );
      }

      await createOrder({
        waste_type_id: selectedWasteTypes[0].id,
        address: address.trim(),
        detalles: {
          pickup_date: isoDate,
          description: description.trim(),
          categories: selectedWasteTypes.map<WasteTypeSelection>((type) => ({
            id: type.id,
            name: type.name,
            color_code: type.color_code,
          })),
        },
        photos: uploadedPhotoPath,
      });
      Alert.alert(
        "Solicitud enviada",
        "Tu recogida fue registrada correctamente.",
        [
          {
            text: "Ver historial",
            onPress: () => {
              navigation.replace("CitizenHistory");
            },
          },
        ],
      );
    } catch (error) {
      if (uploadedPhotoPath) {
        try {
          await imageStorageService.remove(uploadedPhotoPath);
        } catch (cleanupError) {
          Alert.alert(
            "Error al limpiar la imagen",
            getErrorMessage(cleanupError),
          );
        }
      }
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>
        <View style={styles.brand}>
          <Ionicons name="leaf" size={18} color={COLORS.green} />
          <Text style={styles.brandText}>Reci-path</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Solicitar recogida</Text>

        <FormField label="Nombre de Usuario">
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Ej: Juan Pérez"
            placeholderTextColor={COLORS.textMuted}
          />
        </FormField>

        <FormField label="Nº de Celular">
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+57 300 000 0000"
            placeholderTextColor={COLORS.textMuted}
          />
        </FormField>

        <FormField label="Dirección de Residencia">
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Calle 10 # 5-20, Cali"
            placeholderTextColor={COLORS.textMuted}
          />
        </FormField>

        <FormField label="Fecha de Recogida">
          <TextInput
            style={styles.input}
            value={pickupDate}
            onChangeText={setPickupDate}
            placeholder="dd/mm/aaaa"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numbers-and-punctuation"
          />
        </FormField>

        <FormField label="Seleccione una Categoría">
          <Pressable
            style={styles.select}
            onPress={() => setShowCategoryOptions((visible) => !visible)}
          >
            <Text
              style={[
                styles.selectText,
                selectedWasteTypes.length === 0 && styles.selectPlaceholder,
              ]}
            >
              {selectedWasteTypes.length > 0
                ? selectedWasteTypes.map((type) => type.name).join(", ")
                : "Elegir una o más categorías"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
          </Pressable>
          {selectedWasteTypes.length > 0 ? (
            <View style={styles.categoryInfo}>
              {selectedWasteTypes.map((type) => {
                const color = getWasteContainerColor(type.color_code);
                return (
                  <View
                    key={type.id}
                    style={[
                      styles.colorBadge,
                      {
                        backgroundColor: color.backgroundColor,
                        borderColor: color.borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.colorBadgeText, { color: color.textColor }]}
                    >
                      {type.name}: {color.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.categoryDescription}>
              {wasteTypes.length === 0
                ? "No hay residuos disponibles para recoger."
                : "Elige un residuo."}
            </Text>
          )}
          {showCategoryOptions ? (
            <View style={styles.categoryOptionsPanel}>
              <Text style={styles.modalSubtitle}>
                Puedes seleccionar varias categorías. El color corresponde al
                contenedor de cada residuo.
              </Text>
              {wasteTypesLoading ? (
                <Text style={styles.categoryEmptyMessage}>
                  Cargando categorías…
                </Text>
              ) : wasteTypesError ? (
                <Text style={styles.categoryEmptyMessage}>
                  No se pudieron cargar las categorías: {wasteTypesError}
                </Text>
              ) : wasteTypes.length === 0 ? (
                <Text style={styles.categoryEmptyMessage}>
                  No hay residuos activos para recoger.
                </Text>
              ) : (
                <ScrollView
                  style={styles.categoryOptionsList}
                  contentContainerStyle={styles.categoryOptionsContent}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator
                >
                  {wasteTypes.map((type) => {
                    const selected = selectedWasteTypeIds.includes(type.id);
                    const color = getWasteContainerColor(type.color_code);
                    return (
                      <Pressable
                        key={type.id}
                        style={[
                          styles.modalItem,
                          selected && styles.modalItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedWasteTypeIds((current) =>
                            selected
                              ? current.filter((id) => id !== type.id)
                              : [...current, type.id],
                          );
                        }}
                      >
                        <View style={styles.modalItemContent}>
                          <View
                            style={[
                              styles.colorDot,
                              {
                                backgroundColor: color.backgroundColor,
                                borderColor: color.borderColor,
                              },
                            ]}
                          />
                          <View style={styles.modalItemTextContainer}>
                            <Text style={styles.modalItemText}>
                              {type.name}
                            </Text>
                          </View>
                          <Text style={styles.modalColorName}>
                            {color.name}
                          </Text>
                          <Ionicons
                            name={selected ? "checkbox" : "square-outline"}
                            size={22}
                            color={selected ? COLORS.green : COLORS.textMuted}
                          />
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          ) : null}
        </FormField>

        <FormField label="Ingrese brevemente descripción">
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Ej: Dos cajas de cartón corrugado..."
            placeholderTextColor={COLORS.textMuted}
          />
        </FormField>

        <FormField label="Foto del residuo (opcional)">
          {wastePhoto ? (
            <View style={styles.photoPreviewWrap}>
              <Image source={{ uri: wastePhoto.uri }} style={styles.photoPreview} />
              <Pressable
                onPress={() => setWastePhoto(null)}
                style={styles.removePhotoButton}
                accessibilityLabel="Quitar foto"
              >
                <Ionicons name="close" size={18} color={COLORS.textPrimary} />
              </Pressable>
            </View>
          ) : null}
          <Pressable
            style={styles.photoButton}
            onPress={handleChooseWastePhoto}
            disabled={loading}
          >
            <Ionicons
              name={wastePhoto ? "image-outline" : "camera-outline"}
              size={20}
              color={COLORS.green}
            />
            <Text style={styles.photoButtonText}>
              {wastePhoto ? "Cambiar foto" : "Seleccionar foto"}
            </Text>
          </Pressable>
        </FormField>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitWrap}
        >
          <LinearGradient
            colors={[COLORS.green, COLORS.greenDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>
              {loading ? "Enviando…" : "Enviar solicitud"}
            </Text>
            <Ionicons name="paper-plane-outline" size={20} color={COLORS.bg} />
          </LinearGradient>
        </Pressable>
      </ScrollView>

    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.green,
    fontSize: 30,
    marginBottom: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  textArea: {
    minHeight: 110,
  },
  photoButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.inputBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  photoButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.green,
  },
  photoPreviewWrap: {
    position: "relative",
    marginBottom: SPACING.sm,
  },
  photoPreview: {
    width: "100%",
    height: 190,
    borderRadius: RADIUS.md,
  },
  removePhotoButton: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  select: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  selectPlaceholder: {
    color: COLORS.textMuted,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  categoryDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    flex: 1,
    marginTop: SPACING.xs,
  },
  colorBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  colorBadgeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "700",
  },
  submitWrap: {
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
  },
  submitText: {
    ...TYPOGRAPHY.label,
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: "700",
  },
  categoryOptionsPanel: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryOptionsList: {
    height: 220,
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.sm,
  },
  categoryOptionsContent: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  categoryEmptyMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    paddingVertical: SPACING.lg,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  modalItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  modalItemSelected: {
    backgroundColor: `${COLORS.green}14`,
  },
  modalItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 9,
  },
  modalItemTextContainer: {
    flex: 1,
  },
  modalColorName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },
});
