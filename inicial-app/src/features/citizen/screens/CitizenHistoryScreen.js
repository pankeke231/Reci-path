import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { EmptyState, LoadingSpinner, Screen } from "../../../ui/components";
import { useOrders } from "../../../hooks/useOrders";
import CitizenHeader from "../components/CitizenHeader";
import SegmentedTabs from "../components/SegmentedTabs";
import ActiveOrderCard from "../components/ActiveOrderCard";
import CompletedOrderCard from "../components/CompletedOrderCard";
import { HISTORY_TABS } from "../constants";
import {
  filterActiveOrders,
  filterCompletedOrders,
} from "../utils/orderHelpers";

const TABS = [
  { key: HISTORY_TABS.SENT, label: "Enviadas" },
  { key: HISTORY_TABS.COMPLETED, label: "Completadas" },
];

export default function CitizenHistoryScreen() {
  const navigation = useNavigation();
  const { orders, loading, fetchOrders } = useOrders();
  const [tab, setTab] = useState(HISTORY_TABS.SENT);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const data =
    tab === HISTORY_TABS.SENT
      ? filterActiveOrders(orders)
      : filterCompletedOrders(orders);

  const openDetail = (order) => {
    navigation.navigate("CitizenOrderDetail", { orderId: order.id });
  };

  if (loading && !orders.length) {
    return <LoadingSpinner message="Cargando historial…" />;
  }

  return (
    <Screen padded={false}>
      <CitizenHeader
        title="Historial"
        showBack
        onBack={() => navigation.goBack()}
        showActions={false}
      />

      <View style={styles.content}>
        <SegmentedTabs tabs={TABS} activeKey={tab} onChange={setTab} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOrders}
              tintColor={COLORS.green}
            />
          }
          renderItem={({ item }) =>
            tab === HISTORY_TABS.SENT ? (
              <ActiveOrderCard order={item} onPress={() => openDetail(item)} />
            ) : (
              <CompletedOrderCard
                order={item}
                onPress={() => openDetail(item)}
              />
            )
          }
          ListEmptyComponent={
            <EmptyState
              icon="file-tray-outline"
              title={
                tab === HISTORY_TABS.SENT
                  ? "Sin solicitudes activas"
                  : "Sin solicitudes completadas"
              }
              description={
                tab === HISTORY_TABS.SENT
                  ? "Tus pedidos pendientes o en curso aparecerán aquí."
                  : "Cuando se recolecten tus residuos los verás en esta pestaña."
              }
              actionLabel={
                tab === HISTORY_TABS.SENT ? "Solicitar recogida" : undefined
              }
              onAction={
                tab === HISTORY_TABS.SENT
                  ? () => navigation.navigate("CitizenRequest")
                  : undefined
              }
            />
          }
          ListFooterComponent={<View style={styles.footerSpace} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  footerSpace: {
    height: SPACING.xl,
  },
});
