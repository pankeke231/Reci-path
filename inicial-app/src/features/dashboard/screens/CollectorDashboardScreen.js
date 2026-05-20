import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { getProfileFirstName } from '../../../models/user';
import { useOrders } from '../../../hooks/useOrders';
import { useRoutes } from '../../../hooks/useRoutes';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import {
  Card,
  Screen,
  SectionHeader,
  StatCard,
} from '../../../ui/components';

export default function CollectorDashboardScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { orders, fetchOrders } = useOrders();
  const { routes, fetchRoutes } = useRoutes();
  const [assigned, setAssigned] = useState(0);

  useEffect(() => {
    fetchOrders();
    fetchRoutes();
  }, [fetchOrders, fetchRoutes]);

  useEffect(() => {
    setAssigned(
      orders.filter((o) =>
        [ORDER_STATUS.ASSIGNED, ORDER_STATUS.IN_ROUTE].includes(o.status),
      ).length,
    );
  }, [orders]);

  return (
    <Screen scroll>
      <SectionHeader
        title={`Operaciones — ${getProfileFirstName(profile) || 'Recolector'}`}
        subtitle="Pedidos y rutas del día"
      />

      <View style={styles.statsRow}>
        <StatCard
          icon="navigate-outline"
          label="Rutas activas"
          value={routes.length}
          color={COLORS.info}
        />
        <View style={styles.gap} />
        <StatCard
          icon="bicycle-outline"
          label="En curso"
          value={assigned}
          color={COLORS.warning}
        />
      </View>

      <Card onPress={() => navigation.navigate('CollectorRoutes')}>
        <Text style={styles.cardTitle}>Mapa de rutas</Text>
        <Text style={styles.cardDesc}>
          Visualiza rutas planificadas. Próximamente: mapa interactivo y
          optimización con Dijkstra.
        </Text>
      </Card>

      <Card onPress={() => navigation.navigate('CollectorOrders')}>
        <Text style={styles.cardTitle}>Pedidos asignados</Text>
        <Text style={styles.cardDesc}>
          {orders.length
            ? `${orders.length} pedido(s) en tu historial`
            : 'Sin pedidos asignados aún'}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  gap: { width: SPACING.md },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});
