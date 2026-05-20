import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../hooks/useAuth';
import { useOrders } from '../../../hooks/useOrders';
import { profileService } from '../../../services/profileService';
import { ordersService } from '../../../services/ordersService';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { Screen } from '../../../ui/components';
import { getErrorMessage } from '../../../utils/errors';
import AdminTopBar from '../../admin/components/AdminTopBar';
import { getWasteTagLabel, getWasteTagStyle } from '../../admin/utils/collectionHelpers';
import {
  formatPickupDateDisplay,
  getCitizenName,
  getCitizenUsername,
  parseCollectorResponse,
} from '../utils/collectorHelpers';

function InfoBlock({ label, value, children }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>{label}</Text>
      {children ?? <Text style={styles.blockValue}>{value}</Text>}
    </View>
  );
}

export default function CollectorOrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { profile } = useAuth();
  const { orders, fetchOrders } = useOrders({ autoFetch: false });
  const [citizen, setCitizen] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (order?.notes) {
      const { response: existing } = parseCollectorResponse(order.notes);
      if (existing) setResponse(existing);
    }
  }, [order?.notes]);

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

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      Alert.alert('Validación', 'Escribe una respuesta para el ciudadano');
      return;
    }
    if (!profile?.id) return;

    setLoading(true);
    try {
      await ordersService.completeWithResponse(
        order.id,
        profile.id,
        response,
        order.notes,
      );
      await fetchOrders();
      Alert.alert('Recogida completada', 'Tu respuesta fue enviada al ciudadano.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleStartRoute = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      await ordersService.updateByCollector(order.id, profile.id, {
        status: ORDER_STATUS.IN_ROUTE,
      });
      await fetchOrders();
      Alert.alert('En ruta', 'Recogida marcada como en curso.');
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

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

        {!isCompleted ? (
          <>
            <Text style={styles.responseLabel}>TU RESPUESTA AL CIUDADANO</Text>
            <TextInput
              style={styles.responseInput}
              value={response}
              onChangeText={setResponse}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Ej: Recolección exitosa. Materiales en buen estado."
              placeholderTextColor={COLORS.textMuted}
            />

            {order.status === ORDER_STATUS.PENDING ||
            order.status === ORDER_STATUS.ASSIGNED ? (
              <Pressable onPress={handleStartRoute} disabled={loading}>
                <View style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>Marcar en ruta</Text>
                </View>
              </Pressable>
            ) : null}

            <Pressable onPress={handleSubmitResponse} disabled={loading}>
              <LinearGradient
                colors={[COLORS.green, COLORS.greenDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                <Text style={styles.submitText}>
                  {loading ? 'Enviando…' : 'ENVIAR RESPUESTA'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => navigation.goBack()} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>CANCELAR</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.doneCard}>
            <Text style={styles.doneTitle}>RECOGIDA COMPLETADA</Text>
            <Text style={styles.doneBody}>
              {parseCollectorResponse(order.notes).response}
            </Text>
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
  responseLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  responseInput: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    marginBottom: SPACING.md,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  secondaryBtnText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  submitText: {
    ...TYPOGRAPHY.label,
    color: COLORS.bg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  cancelText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textMuted,
    letterSpacing: 1,
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
  },
  missing: {
    padding: SPACING.lg,
    color: COLORS.textSecondary,
  },
});
