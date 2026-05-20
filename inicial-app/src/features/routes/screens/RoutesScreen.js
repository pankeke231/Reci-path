import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRoutes } from '../../../hooks/useRoutes';
import { ROUTE_STATUS } from '../../../models/route';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import {
  Card,
  EmptyState,
  LoadingSpinner,
  Screen,
  SectionHeader,
} from '../../../ui/components';
import { formatDate } from '../../../utils/formatters';

const STATUS_LABELS = {
  [ROUTE_STATUS.PLANNED]: 'Planificada',
  [ROUTE_STATUS.ACTIVE]: 'Activa',
  [ROUTE_STATUS.COMPLETED]: 'Completada',
  [ROUTE_STATUS.CANCELLED]: 'Cancelada',
};

function RouteCard({ route }) {
  return (
    <Card>
      <Text style={styles.routeName}>{route.name}</Text>
      <Text style={styles.routeMeta}>
        {STATUS_LABELS[route.status] ?? route.status}
        {route.scheduled_date
          ? ` · ${formatDate(route.scheduled_date)}`
          : ''}
      </Text>
      {route.estimated_distance_km != null ? (
        <Text style={styles.routeDist}>
          ~{route.estimated_distance_km} km estimados
        </Text>
      ) : (
        <Text style={styles.routeHint}>
          Geometría de ruta pendiente (GeoJSON / mapa)
        </Text>
      )}
    </Card>
  );
}

export default function RoutesScreen() {
  const { routes, loading, fetchRoutes } = useRoutes();

  if (loading && !routes.length) {
    return <LoadingSpinner message="Cargando rutas…" />;
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <SectionHeader
          title="Rutas de recolección"
          subtitle="Visualización y planificación logística"
        />
      </View>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchRoutes}
            tintColor={COLORS.green}
          />
        }
        renderItem={({ item }) => <RouteCard route={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="map-outline"
            title="Sin rutas"
            description="Las rutas asignadas aparecerán aquí. El administrador puede crearlas desde el backend."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  routeName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  routeMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  routeDist: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    marginTop: SPACING.sm,
  },
  routeHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
});
