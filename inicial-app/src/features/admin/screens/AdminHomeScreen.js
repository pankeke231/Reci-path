import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { Screen } from '../../../ui/components';
import AdminHeader from '../components/AdminHeader';
import HomeActionCard from '../../citizen/components/HomeActionCard';

export default function AdminHomeScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Deseas salir de la aplicación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <Screen scroll padded={false}>
      <AdminHeader
        title="Bienvenido, Administrador"
        subtitle="Administrador"
        onNotifications={() =>
          Alert.alert('Notificaciones', 'Próximamente disponibles.')
        }
        onProfile={() => navigation.navigate('AdminProfile')}
      />

      <View style={styles.content}>
        <HomeActionCard
          variant="primary"
          icon="people-outline"
          title="Gestionar usuarios"
          subtitle="Gestionar recicladores"
          onPress={() => navigation.navigate('CollectorsList')}
        />

        <HomeActionCard
          variant="secondary"
          icon="reload-outline"
          title="Ver recogidas"
          subtitle="Ver recogidas de residuos"
          onPress={() => navigation.navigate('AdminCollections')}
        />

        <View style={styles.footerActions}>
          <Pressable
            style={styles.footerBtn}
            onPress={() => navigation.navigate('AdminProfile')}
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
    marginTop: SPACING.md,
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
