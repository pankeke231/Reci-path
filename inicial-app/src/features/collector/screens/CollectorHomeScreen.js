import { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { useOrders } from '../../../hooks/useOrders';
import { getProfileFirstName } from '../../../models/user';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { Screen } from '../../../ui/components';
import CitizenHeader from '../../citizen/components/CitizenHeader';
import HomeActionCard from '../../citizen/components/HomeActionCard';
import CollectorStatsCard from '../components/CollectorStatsCard';
import NextStopBanner from '../components/NextStopBanner';
import {
  calculateCollectorImpactKg,
  getNextStop,
  isCollectorActiveToday,
} from '../utils/collectorHelpers';

export default function CollectorHomeScreen() {
  const navigation = useNavigation();
  const { profile, signOut } = useAuth();
  const { orders, fetchOrders } = useOrders();

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchOrders);
    return unsub;
  }, [navigation, fetchOrders]);

  const firstName = getProfileFirstName(profile) || 'Recolector';
  const impactKg = Math.round(calculateCollectorImpactKg(orders));
  const isActive = isCollectorActiveToday(orders);
  const nextStop = getNextStop(orders);

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Deseas salir de la aplicación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <Screen scroll padded={false}>
      <CitizenHeader
        title={`Bienvenido, ${firstName}`}
        subtitle="Recolector"
        onNotifications={() =>
          Alert.alert('Notificaciones', 'Próximamente disponibles.')
        }
        onProfile={() => navigation.navigate('CollectorProfile')}
      />

      <View style={styles.content}>
        <CollectorStatsCard isActive={isActive} impactKg={impactKg} />

        <HomeActionCard
          variant="primary"
          icon="reload-outline"
          title="Recoger residuos"
          subtitle="Iniciar nueva recolección"
          onPress={() => navigation.navigate('CollectorHistory')}
        />

        <HomeActionCard
          variant="secondary"
          icon="map-outline"
          title="Ver ruta"
          subtitle="Optimizar trayecto hoy"
          onPress={() => navigation.navigate('CollectorRoutes')}
        />

        <NextStopBanner address={nextStop?.address} time={nextStop?.time} />

        <View style={styles.footerActions}>
          <Pressable
            style={styles.footerBtn}
            onPress={() => navigation.navigate('CollectorProfile')}
          >
            <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.footerBtnText}>Perfil</Text>
          </Pressable>
          <Pressable style={styles.footerBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.footerBtnText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.lg,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  footerBtnText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
});
