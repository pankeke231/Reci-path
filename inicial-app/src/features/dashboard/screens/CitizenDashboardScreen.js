import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import { getProfileFirstName } from "../../../models/user";
import { useOrders } from "../../../hooks/useOrders";
import { ORDER_STATUS } from "../../../constants/orderStatus";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY, RADIUS } from "../../../ui/theme/spacing";
import {
  Button,
  Card,
  Screen,
  SectionHeader,
  StatCard,
} from "../../../ui/components";

export default function CitizenDashboardScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { orders, fetchOrders } = useOrders();
  const [stats, setStats] = useState({ total: 0, pending: 0, collected: 0 });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setStats({
      total: orders.length,
      pending: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
      collected: orders.filter((o) => o.status === ORDER_STATUS.COLLECTED)
        .length,
    });
  }, [orders]);

  return (
    <Screen scroll>
      <SectionHeader
        title={`Hola, ${getProfileFirstName(profile) || "Ciudadano"}`}
        subtitle="Gestiona tus solicitudes de recolección"
      />

      <View style={styles.statsRow}>
        <StatCard
          icon="cube-outline"
          label="Total pedidos"
          value={stats.total}
        />
        <View style={styles.gap} />
        <StatCard
          icon="time-outline"
          label="Pendientes"
          value={stats.pending}
          color={COLORS.warning}
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          icon="checkmark-circle-outline"
          label="Recolectados"
          value={stats.collected}
          color={COLORS.green}
        />
      </View>

      <Card style={styles.actionCard}>
        <Ionicons name="add-circle-outline" size={32} color={COLORS.green} />
        <Text style={styles.actionTitle}>Nueva solicitud</Text>
        <Text style={styles.actionDesc}>
          Programa la recolección de residuos con geolocalización
        </Text>
        <Button
          title="Crear pedido"
          onPress={() =>
            navigation.navigate("CitizenOrders", { screen: "CreateOrder" })
          }
          style={styles.actionBtn}
        />
      </Card>

      <Card onPress={() => navigation.navigate("CitizenOrders")}>
        <View style={styles.linkRow}>
          <Ionicons name="list-outline" size={22} color={COLORS.green} />
          <Text style={styles.linkText}>Ver todos mis pedidos</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  gap: {
    width: SPACING.md,
  },
  actionCard: {
    alignItems: "flex-start",
    marginTop: SPACING.md,
  },
  actionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  actionDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  actionBtn: {
    alignSelf: "stretch",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  linkText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    flex: 1,
    fontSize: 16,
  },
});
