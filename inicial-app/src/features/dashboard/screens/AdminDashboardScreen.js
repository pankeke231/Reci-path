import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ordersService } from "../../../services/ordersService";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import {
  Card,
  LoadingSpinner,
  Screen,
  SectionHeader,
  StatCard,
} from "../../../ui/components";
import { getErrorMessage } from "../../../utils/errors";

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordersService
      .getStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (!stats && !error) {
    return <LoadingSpinner message="Cargando métricas…" />;
  }

  return (
    <Screen scroll>
      <SectionHeader
        title="Panel administrativo"
        subtitle="Monitoreo operativo del sistema S.E.A"
      />

      {error ? (
        <Card>
          <Text style={styles.error}>{error}</Text>
          <Text style={styles.hint}>
            Ejecuta el script SQL en Supabase y verifica las políticas RLS.
          </Text>
        </Card>
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatCard
              icon="layers-outline"
              label="Total pedidos"
              value={stats.total}
            />
            <View style={styles.gap} />
            <StatCard
              icon="hourglass-outline"
              label="Pendientes"
              value={stats.pending}
              color={COLORS.warning}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon="sync-outline"
              label="En proceso"
              value={stats.inProgress}
              color={COLORS.info}
            />
            <View style={styles.gap} />
            <StatCard
              icon="checkmark-done-outline"
              label="Recolectados"
              value={stats.collected}
              color={COLORS.green}
            />
          </View>
        </>
      )}

      <Card>
        <Text style={styles.cardTitle}>Próximas integraciones</Text>
        <Text style={styles.cardDesc}>
          • Realtime con Supabase Channels{"\n"}• Notificaciones push (Expo
          Notifications){"\n"}• Analytics y reportes exportables
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  gap: { width: SPACING.md },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  cardDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  error: {
    ...TYPOGRAPHY.label,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  hint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
});
