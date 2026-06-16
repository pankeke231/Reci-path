import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { adminService } from "../../../services/adminService";
import { getErrorMessage } from "../../../utils/errors";

const VEHICLE_TYPES = [
  "Motocarro",
  "Bicicleta de carga",
  "Camión",
  "Carro",
  "Moto",
];

export default function RegisterVehicleScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const step1Data = route.params || {};
  const {
    documentId = "",
    firstNames = "",
    lastNames = "",
    address = "",
    phone = "",
    email = "",
    password = "",
  } = step1Data;

  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [brandModel, setBrandModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const handleFinish = async () => {
    if (!plate.trim()) {
      Alert.alert("Validación", "La placa es obligatoria");
      return;
    }
    if (!vehicleType) {
      Alert.alert("Validación", "Selecciona el tipo de vehículo");
      return;
    }
    if (capacity && (isNaN(capacity) || parseFloat(capacity) <= 0)) {
      Alert.alert("Validación", "Ingresa una capacidad válida (toneladas)");
      return;
    }

    setLoading(true);
    try {
      const profile = await adminService.registerCollector({
        documentId,
        firstNames,
        lastNames,
        address,
        phone,
        email,
        password,
      });

      await adminService.registerVehicle(profile.id, {
        plate: plate.trim().toUpperCase(),
        vehicleType,
        brandModel: brandModel.trim() || null,
        capacity: capacity ? parseFloat(capacity) : null,
      });

      Alert.alert(
        "Registro completado",
        "El recolector y su vehículo fueron registrados correctamente.",
        [{ text: "OK", onPress: () => navigation.replace("CollectorsList") }],
      );
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="leaf" size={22} color="#2ECC71" />
          <Text style={styles.logoText}>ReciPath</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Datos del Vehículo</Text>
          <Text style={styles.subtitle}>
            Ingrese los detalles del vehículo para completar el registro.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>PLACA DEL VEHÍCULO</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="badge" size={20} color="#64748B" />
            <TextInput
              value={plate}
              onChangeText={setPlate}
              placeholder="ABC-123"
              placeholderTextColor="#64748B"
              style={styles.input}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>TIPO DE VEHÍCULO</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowTypePicker(!showTypePicker)}
          >
            <MaterialIcons name="local-shipping" size={20} color="#64748B" />
            <Text
              style={[
                styles.input,
                { color: vehicleType ? "#FFF" : "#64748B" },
              ]}
            >
              {vehicleType || "Seleccione el tipo"}
            </Text>
            <MaterialIcons
              name={
                showTypePicker ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={22}
              color="#64748B"
            />
          </TouchableOpacity>

          {showTypePicker && (
            <View style={styles.pickerContainer}>
              {VEHICLE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerItem,
                    vehicleType === type && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setVehicleType(type);
                    setShowTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      vehicleType === type && styles.pickerItemTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <View style={styles.optionalRow}>
            <Text style={styles.label}>MARCA / MODELO</Text>
            <Text style={styles.optional}>OPCIONAL</Text>
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons name="directions-car" size={20} color="#64748B" />
            <TextInput
              value={brandModel}
              onChangeText={setBrandModel}
              placeholder="Ej. AKT / 2023"
              placeholderTextColor="#64748B"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>CAPACIDAD (TONELADAS)</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="scale" size={20} color="#64748B" />
            <TextInput
              value={capacity}
              onChangeText={setCapacity}
              placeholder="Ej. 0.5"
              placeholderTextColor="#64748B"
              style={styles.input}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.divider} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleFinish}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "GUARDANDO..." : "FINALIZAR REGISTRO"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  hero: {
    marginBottom: 40,
  },
  title: {
    color: "#2ECC71",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 24,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  optionalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  optional: {
    color: "#64748B",
    fontSize: 10,
    fontStyle: "italic",
    fontWeight: "600",
  },
  inputContainer: {
    height: 58,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  pickerItemActive: {
    backgroundColor: "#2ECC7118",
  },
  pickerItemText: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "600",
  },
  pickerItemTextActive: {
    color: "#2ECC71",
  },
  divider: {
    height: 2,
    marginTop: 12,
    backgroundColor: "rgba(46,204,113,0.25)",
    borderRadius: 999,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  primaryButton: {
    height: 58,
    backgroundColor: "#2ECC71",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#00381C",
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 14,
  },
  secondaryButton: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#CBD5E1",
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 12,
  },
  topGlow: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(46,204,113,0.08)",
  },
  bottomGlow: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(59,130,246,0.05)",
  },
});
