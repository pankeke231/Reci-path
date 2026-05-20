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
import CitizenHeader from '../components/CitizenHeader';
import ImpactWeeklyCard from '../components/ImpactWeeklyCard';
import HomeActionCard from '../components/HomeActionCard';
import {
  calculateWeeklyCo2Saved,
  hasActiveRequests,
} from '../utils/orderHelpers';

export default function CitizenHomeScreen() {
  const navigation = useNavigation();
  const { profile, signOut } = useAuth();
  const { orders, fetchOrders } = useOrders();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchOrders);
    return unsubscribe;
  }, [navigation, fetchOrders]);

  const firstName = getProfileFirstName(profile) || 'Ciudadano';
  const co2 = calculateWeeklyCo2Saved(orders);
  const active = hasActiveRequests(orders);

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Deseas salir de la aplicación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <Screen scroll padded={false}>
      <CitizenHeader
        title={`Bienvenida, ${firstName}`}
        subtitle="Ciudadano"
        onNotifications={() =>
          Alert.alert('Notificaciones', 'Próximamente disponibles.')
        }
        onProfile={() => navigation.navigate('CitizenProfile')}
      />

      <View style={styles.content}>
        <ImpactWeeklyCard isActive={active} co2Kg={co2} />

        <HomeActionCard
          variant="primary"
          icon="reload-outline"
          title="Gestionar residuos"
          subtitle="Inicia un nuevo reporte de reciclaje"
          onPress={() => navigation.navigate('CitizenRequest')}
        />

        <HomeActionCard
          variant="secondary"
          icon="time-outline"
          title="Historial"
          subtitle="Revisa tus contribuciones pasadas"
          onPress={() => navigation.navigate('CitizenHistory')}
        />

        <Text style={styles.footerQuote}>
          Cali es más limpia gracias a ti.
        </Text>

        <View style={styles.footerActions}>
          <Pressable
            style={styles.footerBtn}
            onPress={() => navigation.navigate('CitizenProfile')}
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
  footerQuote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
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
