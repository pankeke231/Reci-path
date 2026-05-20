import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { Screen } from '../../../ui/components';
import { formatDate } from '../../../utils/formatters';
import { useAuth } from '../../../hooks/useAuth';
import { useOrders } from '../../../hooks/useOrders';
import CitizenHeader from '../components/CitizenHeader';
import {
  getPickupDisplayDate,
  getRecyclerLabel,
  getWasteLabel,
  parseOrderNotes,
} from '../utils/orderHelpers';

function InfoCell({ label, value }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

export default function CitizenOrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { profile } = useAuth();
  const { orders } = useOrders();

  const orderId = route.params?.orderId;
  const order = useMemo(
    () => orders.find((o) => o.id === orderId),
    [orders, orderId],
  );

  if (!order) {
    return (
      <Screen>
        <CitizenHeader
          title="Información del Usuario"
          showBack
          onBack={() => navigation.goBack()}
          showActions={false}
        />
        <Text style={styles.missing}>No se encontró la solicitud.</Text>
      </Screen>
    );
  }

  const { pickupDate, description } = parseOrderNotes(order.notes);
  const pickupDisplay = pickupDate
    ? formatDate(
        /^\d{4}-\d{2}-\d{2}$/.test(pickupDate)
          ? pickupDate
          : getPickupDisplayDate(order),
      )
    : formatDate(order.created_at);

  const isCollected = order.status === ORDER_STATUS.COLLECTED;
  const recyclerResponse = isCollected
    ? `"Recolección exitosa. Gracias por separar tus residuos correctamente."`
    : null;

  return (
    <Screen scroll padded={false}>
      <CitizenHeader
        title="Información del Usuario"
        showBack
        onBack={() => navigation.goBack()}
        showActions={false}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          <InfoCell label="FECHA DE RECOGIDA" value={pickupDisplay} />
          <InfoCell label="TIPO DE RESIDUO" value={getWasteLabel(order)} />
        </View>

        <View style={styles.fullCell}>
          <Text style={styles.cellLabel}>DIRECCIÓN DE RECOGIDA</Text>
          <Text style={styles.cellValue}>
            {order.address ?? 'Dirección no registrada'}
          </Text>
        </View>

        <View style={styles.fullCell}>
          <Text style={styles.cellLabel}>CELULAR</Text>
          <Text style={styles.cellValue}>
            {profile?.phone ?? '—'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPCIÓN DE LA RECOGIDA</Text>
          <Text style={styles.sectionBody}>
            {description ||
              'Sin descripción adicional. El ciudadano registró la solicitud desde la app S.E.A.'}
          </Text>
        </View>

        {isCollected ? (
          <View style={styles.responseCard}>
            <Text style={styles.responseTitle}>RESPUESTA DEL RECICLADOR</Text>
            <Text style={styles.responseQuote}>{recyclerResponse}</Text>
            <View style={styles.recyclerRow}>
              <View style={styles.recyclerAvatar}>
                <Ionicons name="person" size={18} color={COLORS.green} />
              </View>
              <Text style={styles.recyclerName}>{getRecyclerLabel(order)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.pendingCard}>
            <Text style={styles.pendingText}>
              Estado actual: {order.status.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.pendingSub}>
              Un recolector confirmará la recogida próximamente.
            </Text>
          </View>
        )}

        <Pressable onPress={() => navigation.goBack()} style={styles.closeWrap}>
          <LinearGradient
            colors={[COLORS.green, COLORS.greenDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>CERRAR</Text>
            <Ionicons name="close" size={20} color={COLORS.bg} />
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  grid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  cell: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  fullCell: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cellLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  cellValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  sectionBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  responseCard: {
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    backgroundColor: `${COLORS.green}10`,
    marginBottom: SPACING.lg,
  },
  responseTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  responseQuote: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  recyclerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  recyclerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recyclerName: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  pendingCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  pendingText: {
    ...TYPOGRAPHY.label,
    color: COLORS.warning,
    marginBottom: SPACING.xs,
  },
  pendingSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  closeWrap: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
  },
  closeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.bg,
    fontWeight: '800',
    letterSpacing: 1,
  },
  missing: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    padding: SPACING.lg,
  },
});
