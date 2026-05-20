import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { EmptyState, LoadingSpinner, Screen } from '../../../ui/components';
import { formatDate } from '../../../utils/formatters';
import { useRoutes } from '../../../hooks/useRoutes';
import AdminTopBar from '../../admin/components/AdminTopBar';

export default function CollectorRoutesScreen() {
  const navigation = useNavigation();
  const { routes, loading, fetchRoutes } = useRoutes();

  useFocusEffect(
    useCallback(() => {
      fetchRoutes();
    }, [fetchRoutes]),
  );

  if (loading && !routes.length) {
    return <LoadingSpinner message="Cargando rutas…" />;
  }

  return (
    <Screen padded={false}>
      <AdminTopBar onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>OPTIMIZACIÓN DE TRAYECTO</Text>
        <Text style={styles.title}>Rutas del día</Text>
        <Text style={styles.hint}>
          Próximamente: mapa interactivo y algoritmo Dijkstra para rutas
          óptimas en Cali.
        </Text>

        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="navigate-outline" size={20} color={COLORS.green} />
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
              <Text style={styles.cardMeta}>
                Estado: {item.status} ·{' '}
                {item.scheduled_date
                  ? formatDate(item.scheduled_date)
                  : 'Sin fecha'}
              </Text>
              {item.estimated_distance_km != null ? (
                <Text style={styles.cardDist}>
                  ~{item.estimated_distance_km} km estimados
                </Text>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="map-outline"
              title="Sin rutas planificadas"
              description="El administrador puede asignarte rutas desde el panel."
            />
          }
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
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    fontWeight: '800',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    flex: 1,
  },
  cardMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  cardDist: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    marginTop: SPACING.xs,
  },
});
