import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../../hooks/useAuth";
import { useOrders } from "../../../hooks/useOrders";
import { getProfileDisplayName } from "../../../models/user";
import { wasteService } from "../../../services/wasteService";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { Screen } from "../../../ui/components";
import { getErrorMessage } from "../../../utils/errors";

function FormField({ label, children }) {
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
  const [wasteTypes, setWasteTypes] = useState([]);
  const [wasteTypeId, setWasteTypeId] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [description, setDescription] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(getProfileDisplayName(profile));
    setPhone(profile?.phone ?? "");
    setAddress(profile?.address ?? "");
    wasteService.listTypes().then((types) => {
      setWasteTypes(types);
      if (types[0]) {
        setWasteTypeId(types[0].id);
        setCategoryLabel(types[0].name);
      }
    });
  }, [profile]);

  const validateDate = (value) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const iso = `${yyyy}-${mm}-${dd}`;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return iso;
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
    if (!wasteTypeId) {
      Alert.alert("Validación", "Selecciona una categoría");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Validación", "Agrega una descripción breve");
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        waste_type_id: wasteTypeId,
        address: address.trim(),
        detalles: {
          pickup_date: isoDate,
          description: description.trim(),
        },
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
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll padded={false}>
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
            onPress={() => setShowCategoryModal(true)}
          >
            <Text
              style={[
                styles.selectText,
                !categoryLabel && styles.selectPlaceholder,
              ]}
            >
              {categoryLabel || "Elegir categoría"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
          </Pressable>
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

      <Modal visible={showCategoryModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Categoría de residuo</Text>
            {wasteTypes.map((type) => (
              <Pressable
                key={type.id}
                style={styles.modalItem}
                onPress={() => {
                  setWasteTypeId(type.id);
                  setCategoryLabel(type.name);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{type.name}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  modalItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  modalItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
});
