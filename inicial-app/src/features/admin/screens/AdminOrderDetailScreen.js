import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { useOrders } from '../../../hooks/useOrders';
import { profileService } from '../../../services/profileService';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { Screen } from '../../../ui/components';
import AdminTopBar from '../components/AdminTopBar';
import {
  formatCompletedDate,
  getWasteTagLabel,
  getWasteTagStyle,
} from '../utils/collectionHelpers';
import {
  formatPickupDateDisplay,
  getCitizenName,
  getCitizenUsername,
  parseCollectorResponse,
} from '../../collector/utils/collectorHelpers';

function InfoBlock({ label, value, children }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>{label}</Text>
      {children ?? <Text style={styles.blockValue}>{value}</Text>}
    </View>
  );
}

export default function AdminOrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orders, fetchOrders } = useOrders({ autoFetch: false });
  const [citizen, setCitizen] = useState(null);

  const order = useMemo(
    () => orders.find((o) => o.id === route.params?.orderId),
    [orders, route.params?.orderId],
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (order?.citizen_id) {
      profileService.getProfile(order.citizen_id).then(setCitizen);
    }
  }, [order?.citizen_id]);

  if (!order) {
    return (
      <Screen>
        <AdminTopBar onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Solicitud no encontrada.</Text>
      </Screen>
    );
  }

  const tag = getWasteTagStyle(order);
  const { pickupDate, description } = parseCollectorResponse(order.notes);
  const isCompleted = order.status === ORDER_STATUS.COLLECTED;
  const { response } = parseCollectorResponse(order.notes);

  return (
    <Screen scroll padded={false}>
      <AdminTopBar onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Información del Usuario</Text>

        <View style={styles.grid}>
          <InfoBlock label="NOMBRE" value={getCitizenName(order, citizen)} />
          <InfoBlock label="USUARIO" value={getCitizenUsername(citizen)} />
        </View>

        <View style={styles.grid}>
          <InfoBlock
            label="FECHA DE RECOGIDA"
            value={formatPickupDateDisplay(pickupDate, order.created_at)}
          />
          <InfoBlock label="CELULAR" value={citizen?.phone ?? '—'} />
        </View>

        <InfoBlock label="DIRECCIÓN DE RECOGIDA">
          <View style={styles.addressRow}>
            <Ionicons name="location" size={16} color={COLORS.green} />
            <Text style={styles.blockValue}>
              {order.address ?? 'Dirección no registrada'}
            </Text>
          </View>
        </InfoBlock>

        <InfoBlock label="TIPO DE RESIDUO">
          <View style={[styles.wasteTag, { backgroundColor: tag.bg }]}>
            <Text style={[styles.wasteTagText, { color: tag.text }]}>
              {getWasteTagLabel(order)}
            </Text>
          </View>
        </InfoBlock>

        <InfoBlock label="DESCRIPCIÓN DE LA RECOGIDA DE RESIDUO">
          <Text style={styles.description}>
            {description ||
              'Sin descripción adicional proporcionada por el ciudadano.'}
          </Text>
        </InfoBlock>

        {isCompleted ? (
          <View style={styles.doneCard}>
            <Text style={styles.doneTitle}>RECOGIDA COMPLETADA</Text>
            <Text style={styles.doneBody}>{response}</Text>
            <Text style={styles.doneDate}>
              {formatCompletedDate(order)}
            </Text>
          </View>
        ) : (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>ESTADO</Text>
            <Text style={styles.statusValue}>{order.status.toUpperCase()}</Text>
          </View>
        )}
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
    color: COLORS.green,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  block: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  blockLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  blockValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  wasteTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  wasteTagText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: `${COLORS.green}15`,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  statusTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  statusValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  doneCard: {
    backgroundColor: `${COLORS.green}15`,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  doneTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  doneBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  doneDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  missing: {
    padding: SPACING.lg,
    color: COLORS.textSecondary,
  },
});