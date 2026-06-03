import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { Button, Input, Screen } from "../../../ui/components";
import { useCollectors } from "../../../hooks/useCollectors";
import { adminService } from "../../../services/adminService";
import { getErrorMessage } from "../../../utils/errors";
import { isValidCellPhone } from "../../../utils/validators";
import AdminTopBar from "../components/AdminTopBar";
import { ACCOUNT_STATUS } from "../constants";

export default function CollectorEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { collectors, fetchCollectors } = useCollectors();

  const collector = useMemo(
    () => collectors.find((c) => c.id === route.params?.collectorId),
    [collectors, route.params?.collectorId],
  );

  const [firstNames, setFirstNames] = useState("");
  const [lastNames, setLastNames] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [status, setStatus] = useState(ACCOUNT_STATUS.ACTIVE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (collector) {
      setFirstNames(collector.first_names ?? "");
      setLastNames(collector.last_names ?? "");
      setAddress(collector.address ?? "");
      setPhone(collector.phone ?? "");
      setVehicleType(collector.vehicle_type ?? "");
      setLicensePlate(collector.license_plate ?? "");
      setStatus(collector.account_status ?? ACCOUNT_STATUS.ACTIVE);
    }
  }, [collector]);

  const handleSave = async () => {
    if (!collector) return;
    if (!isValidCellPhone(phone)) {
      Alert.alert("Validación", "Celular inválido");
      return;
    }

    setLoading(true);
    try {
      await adminService.updateCollector(collector.id, {
        first_names: firstNames.trim(),
        last_names: lastNames.trim(),
        full_name: `${firstNames.trim()} ${lastNames.trim()}`.trim(),
        address: address.trim(),
        phone: phone.trim(),
        vehicle_type: vehicleType?.trim() || null,
        license_plate: licensePlate?.trim() || null,
        account_status: status,
      });
      await fetchCollectors();
      Alert.alert("Actualizado", "Datos del recolector guardados.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!collector) {
    return (
      <Screen>
        <AdminTopBar onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Recolector no encontrado.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll padded={false}>
      <AdminTopBar onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Editar reciclador</Text>

        <Input
          label="NOMBRES COMPLETOS"
          value={firstNames}
          onChangeText={setFirstNames}
        />
        <Input
          label="APELLIDOS COMPLETOS"
          value={lastNames}
          onChangeText={setLastNames}
        />
        <Input
          label="DIRECCIÓN DE RESIDENCIA"
          value={address}
          onChangeText={setAddress}
        />
        <Input
          label="Nº DE CELULAR"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          label="TIPO DE VEHÍCULO"
          value={vehicleType}
          onChangeText={setVehicleType}
          placeholder="Ej: Motocarro, Bicicleta"
        />
        <Input
          label="PLACA"
          value={licensePlate}
          onChangeText={setLicensePlate}
          placeholder="Ej: ABC-123"
          autoCapitalize="characters"
        />

        <Text style={styles.statusLabel}>ESTADO DE CUENTA</Text>
        <View style={styles.statusRow}>
          {[ACCOUNT_STATUS.ACTIVE, ACCOUNT_STATUS.PENDING].map((s) => (
            <Button
              key={s}
              title={s === ACCOUNT_STATUS.ACTIVE ? "Activo" : "Pendiente"}
              variant={status === s ? "primary" : "secondary"}
              onPress={() => setStatus(s)}
              style={styles.statusBtn}
            />
          ))}
        </View>

        <Button
          title="Guardar cambios"
          onPress={handleSave}
          loading={loading}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  statusLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  statusRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statusBtn: {
    flex: 1,
  },
  missing: {
    padding: SPACING.lg,
    color: COLORS.textSecondary,
  },
});
