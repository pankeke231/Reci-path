import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ORDER_STATUS, ORDER_STATUS_LABELS } from "../../../../constants/orderStatus";
import { useAuth } from "../../../../hooks/useAuth";
import { useOrders } from "../../../../hooks/useOrders";
import type { CollectionOrder } from "../../../../models/order";
import COLORS from "../../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../../ui/theme/spacing";
import {
  EmptyState,
  LoadingSpinner,
  Screen,
} from "../../../../ui/components";
import { getCollectionAddress } from "../../../../utils/collectionHelpers";
import { getErrorMessage } from "../../../../utils/errors";
import AdminTopBar from "../../admin/components/AdminTopBar";

const ROUTE_ORDER_STATUSES = new Set([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.ASSIGNED,
  ORDER_STATUS.IN_ROUTE,
]);

export default function CollectorRoutesScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { orders, loading, fetchOrders } = useOrders({ autoFetch: false });
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshOrders = useCallback(
    async (isActive: () => boolean = () => true) => {
      setLoadError(null);
      try {
        await fetchOrders();
      } catch (error) {
        console.error("No se pudieron cargar las órdenes asignadas:", error);
        if (isActive()) setLoadError(getErrorMessage(error));
      }
    },
    [fetchOrders],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void refreshOrders(() => active);

      return () => {
        active = false;
      };
    }, [refreshOrders]),
  );

  const assignedOrders = orders.filter(
    (order) =>
      order.collector_id === profile?.id &&
      ROUTE_ORDER_STATUSES.has(order.status),
  );

  if (loading && !orders.length) {
    return <LoadingSpinner message="Cargando órdenes asignadas…" />;
  }

  return (
    <Screen padded={false}>
      <AdminTopBar onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>OPTIMIZACIÓN DE TRAYECTO</Text>
        <Text style={styles.title}>Rutas del día</Text>
        <Text style={styles.hint}>
          Las rutas se forman con tus solicitudes asignadas. Marca una solicitud
          en ruta para comenzar el seguimiento en el mapa.
        </Text>
        <Pressable
          onPress={() => navigation.navigate("CollectorViewRoute")}
          style={styles.mapButton}
        >
          <Ionicons name="map-outline" size={20} color={COLORS.bg} />
          <Text style={styles.mapButtonText}>Ver recorrido en el mapa</Text>
        </Pressable>

        {loadError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{loadError}</Text>
            <Pressable onPress={() => void refreshOrders()}>
              <Text style={styles.retry}>Reintentar</Text>
            </Pressable>
          </View>
        ) : null}

        <FlatList
          data={assignedOrders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={() => void refreshOrders()}
          renderItem={({ item }) => <AssignedOrderCard
            order={item}
            onPress={() =>
              navigation.navigate("CollectorOrderDetail", {
                orderId: item.id,
              })
            }
          />}
          ListEmptyComponent={
            <EmptyState
              icon="map-outline"
              title="Sin solicitudes asignadas"
              description="Las solicitudes asignadas a tu cuenta aparecerán aquí."
            />
          }
        />
      </View>
    </Screen>
  );
}

function AssignedOrderCard({
  order,
  onPress,
}: {
  order: CollectionOrder;
  onPress: () => void;
}) {
  const inRoute = order.status === ORDER_STATUS.IN_ROUTE;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons
          name={inRoute ? "navigate" : "navigate-outline"}
          size={20}
          color={inRoute ? COLORS.green : COLORS.info}
        />
        <Text style={styles.cardTitle} numberOfLines={2}>
          {getCollectionAddress(order)}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textMuted}
        />
      </View>
      <Text style={[styles.cardMeta, inRoute && styles.activeStatus]}>
        {ORDER_STATUS_LABELS[
          order.status as keyof typeof ORDER_STATUS_LABELS
        ] ?? order.status}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  hint: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.green,
  },
  mapButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.bg,
  },
  list: {
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    flex: 1,
  },
  cardMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  activeStatus: {
    color: COLORS.green,
  },
  errorCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
  },
  retry: {
    ...TYPOGRAPHY.label,
    color: COLORS.green,
    marginTop: SPACING.sm,
  },
});
