import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ORDER_STATUS } from "../../../../constants/orderStatus";
import type { CollectionOrder } from "../../../../models/order";
import { ordersService } from "../../../../services/ordersService";
import { getErrorMessage } from "../../../../utils/errors";
import { getCollectionAddress } from "../../../../utils/collectionHelpers";
import { Button, Screen } from "../../../../ui/components";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../../ui/theme/spacing";
import COLORS from "../../../../constants/colors";
import AdminTopBar from "../components/AdminTopBar";
import { supabase } from "../../../../lib/supabase";

type CollectorVehicle = {
  id: number;
  placa: string | null;
  modelo_name: string | null;
};

type CollectorWithVehicle = {
  id: string;
  full_name: string | null;
  email: string;
  vehicles: CollectorVehicle[] | CollectorVehicle | null;
};

export default function AssignOrdersScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<CollectionOrder[]>([]);
  const [collectors, setCollectors] = useState<CollectorWithVehicle[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedCollectorId, setSelectedCollectorId] = useState("");
  const [selectedVehicle, setSelectedVehicle] =
    useState<CollectorVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === ORDER_STATUS.PENDING && order.collector_id === null,
      ),
    [orders],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const [allOrders, collectorsResult] = await Promise.all([
        ordersService.listAll(),
        supabase
          .from("profiles")
          .select(
            "id, full_name, email, vehicles:vehicles!vehicles_collector_id_fkey(id, placa, modelo_name)",
          )
          .eq("role", "collector"),
      ]);

      if (collectorsResult.error) throw collectorsResult.error;

      setOrders(allOrders);
      setCollectors((collectorsResult.data ?? []) as CollectorWithVehicle[]);
      setSelectedOrderIds([]);
      setSelectedCollectorId("");
      setSelectedVehicle(null);
    } catch (error) {
      const message = getErrorMessage(error);
      setLoadError(message);
      console.error("No se pudieron cargar órdenes y recolectores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const toggleOrder = (orderId: string) => {
    setSelectedOrderIds((current) =>
      current.includes(orderId)
        ? current.filter((id) => id !== orderId)
        : [...current, orderId],
    );
  };

  const selectCollector = (collector: CollectorWithVehicle) => {
    setSelectedCollectorId(collector.id);
    setSelectedVehicle(
      Array.isArray(collector.vehicles)
        ? (collector.vehicles[0] ?? null)
        : (collector.vehicles ?? null),
    );
  };

  const handleAssign = async () => {
    if (
      !selectedCollectorId ||
      !selectedVehicle ||
      selectedOrderIds.length === 0
    ) {
      return;
    }

    const selectedCollector = collectors.find(
      (collector) => collector.id === selectedCollectorId,
    );
    const selectedCollectorName =
      selectedCollector?.full_name || selectedCollector?.email || "Recolector";
    const vehicleModel = selectedVehicle.modelo_name || "modelo no registrado";
    const vehiclePlate = selectedVehicle.placa || "placa no registrada";

    setAssigning(true);
    try {
      const assignedIds = await ordersService.assignPendingOrders(
        selectedOrderIds,
        selectedCollectorId,
      );
      const notAssignedCount = selectedOrderIds.length - assignedIds.length;

      setSelectedOrderIds([]);
      await loadData();

      if (notAssignedCount > 0) {
        Alert.alert(
          "Asignación parcial",
          `${assignedIds.length} solicitud(es) asignada(s). ${notAssignedCount} ya no estaban pendientes o fueron modificadas; actualicé la lista.`,
        );
      } else {
        Alert.alert(
          "Asignación Exitosa",
          `Se han asignado ${selectedOrderIds.length} órdenes al recolector ${selectedCollectorName}. Las recolecciones serán realizadas en el vehículo ${vehicleModel} con placa [${vehiclePlate}].`,
        );
      }
    } catch (error) {
      Alert.alert("No se pudo asignar", getErrorMessage(error));
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Screen padded={false}>
      <AdminTopBar
        onBack={() => navigation.goBack()}
        rightIcon="refresh-outline"
        onRightPress={() => void loadData()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Asignar solicitudes</Text>
        <Text style={styles.subtitle}>
          Elige un recolector y una o más solicitudes pendientes sin asignar.
        </Text>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={COLORS.green} />
            <Text style={styles.muted}>Cargando información...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{loadError}</Text>
            <Pressable onPress={() => void loadData()}>
              <Text style={styles.retry}>Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>1. Selecciona recolector</Text>
            {collectors.length ? (
              collectors.map((collector) => {
                const selected = selectedCollectorId === collector.id;
                const name =
                  collector.full_name || collector.email;

                return (
                  <Pressable
                    key={collector.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => selectCollector(collector)}
                    style={[styles.option, selected && styles.selectedOption]}
                  >
                    <View style={styles.optionIcon}>
                      <Ionicons
                        name="person"
                        size={18}
                        color={selected ? COLORS.green : COLORS.textSecondary}
                      />
                    </View>
                    <View style={styles.optionBody}>
                      <Text style={styles.optionTitle}>{name}</Text>
                      <Text style={styles.optionDetail}>{collector.email}</Text>
                    </View>
                    <Ionicons
                      name={selected ? "radio-button-on" : "radio-button-off"}
                      size={21}
                      color={selected ? COLORS.green : COLORS.textMuted}
                    />
                  </Pressable>
                );
              })
            ) : (
              <Text style={styles.empty}>
                No hay recolectores activos disponibles.
              </Text>
            )}

            {selectedCollectorId && !selectedVehicle ? (
              <Text style={styles.warning}>
                Este recolector no tiene un vehículo asignado. Por favor,
                asígnale un camión antes de confirmar la ruta
              </Text>
            ) : selectedVehicle ? (
              <Text style={styles.vehicleInfo}>
                Vehículo: {selectedVehicle.modelo_name || "Modelo no registrado"} ·
                Placa: {selectedVehicle.placa || "No registrada"}
              </Text>
            ) : null}

            <View style={styles.orderHeading}>
              <Text style={styles.sectionTitle}>2. Selecciona solicitudes</Text>
              <Text style={styles.counter}>
                {selectedOrderIds.length} seleccionada(s)
              </Text>
            </View>

            {pendingOrders.length ? (
              pendingOrders.map((order) => {
                const selected = selectedOrderIds.includes(order.id);
                return (
                  <Pressable
                    key={order.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    onPress={() => toggleOrder(order.id)}
                    style={[styles.option, selected && styles.selectedOption]}
                  >
                    <View style={styles.orderIcon}>
                      <Ionicons
                        name="location"
                        size={18}
                        color={COLORS.green}
                      />
                    </View>
                    <View style={styles.optionBody}>
                      <Text style={styles.optionTitle} numberOfLines={2}>
                        {getCollectionAddress(order)}
                      </Text>
                      <Text style={styles.optionDetail}>
                        Solicitud {order.id.slice(0, 8)} · Pendiente
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? "checkbox" : "square-outline"}
                      size={22}
                      color={selected ? COLORS.green : COLORS.textMuted}
                    />
                  </Pressable>
                );
              })
            ) : (
              <Text style={styles.empty}>
                No hay solicitudes pendientes sin asignar.
              </Text>
            )}

            <Button
              title={`Asignar ${selectedOrderIds.length || ""} solicitud${selectedOrderIds.length === 1 ? "" : "es"}`}
              onPress={handleAssign}
              loading={assigning}
              disabled={
                assigning ||
                !selectedCollectorId ||
                !selectedVehicle ||
                selectedOrderIds.length === 0
              }
              style={styles.assignButton}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
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
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.green,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  orderHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counter: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  selectedOption: {
    borderColor: COLORS.green,
    backgroundColor: "#10B98114",
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bg,
    marginRight: SPACING.md,
  },
  orderIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bg,
    marginRight: SPACING.md,
  },
  optionBody: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  optionTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  optionDetail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  empty: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    paddingVertical: SPACING.md,
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
  },
  muted: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  errorCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardBg,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
  },
  retry: {
    ...TYPOGRAPHY.label,
    color: COLORS.green,
    marginTop: SPACING.md,
  },
  warning: {
    ...TYPOGRAPHY.caption,
    color: COLORS.warning,
    marginBottom: SPACING.sm,
  },
  vehicleInfo: {
    ...TYPOGRAPHY.caption,
    color: COLORS.greenLight,
    marginBottom: SPACING.sm,
  },
  assignButton: {
    marginTop: SPACING.lg,
  },
});
