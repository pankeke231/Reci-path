import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useOrders } from "../../../hooks/useOrders";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constants/roles";
import COLORS from "../../../constants/colors";
import { SPACING } from "../../../ui/theme/spacing";
import {
  EmptyState,
  LoadingSpinner,
  Screen,
  SectionHeader,
} from "../../../ui/components";
import OrderCard from "../components/OrderCard";

export default function OrdersListScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { orders, loading, fetchOrders } = useOrders();
  const isCitizen = profile?.role === ROLES.CITIZEN;

  if (loading && !orders.length) {
    return <LoadingSpinner message="Cargando pedidos…" />;
  }

  return (
    <Screen padded={false}>
      <View style={styles.headerWrap}>
        <SectionHeader
          title={isCitizen ? "Mis pedidos" : "Pedidos"}
          subtitle={
            isCitizen
              ? "Historial de solicitudes de recolección"
              : "Pedidos asignados y pendientes"
          }
        />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchOrders}
            tintColor={COLORS.green}
          />
        }
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            title="Sin pedidos"
            description="Aún no hay solicitudes de recolección registradas."
            actionLabel={isCitizen ? "Crear pedido" : undefined}
            onAction={
              isCitizen ? () => navigation.navigate("CreateOrder") : undefined
            }
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
});
