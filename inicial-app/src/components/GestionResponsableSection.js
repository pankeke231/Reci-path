import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function GestionResponsableSection() {
  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['#0D2818', '#0B1120']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gestionCard}
      >
        <Text style={styles.gestionLabel}>SOSTENIBILIDAD</Text>
        <Text style={styles.gestionTitle}>
          Hacia una Gestión{'\n'}
          <Text style={styles.gestionHighlight}>Responsable</Text>
        </Text>
        <Text style={styles.gestionSubtitle}>
          La tecnología como aliada de los procesos logísticos, reduciendo
          huella ecológica y maximizando resultados.
        </Text>

        {/* Impacto Ambiental */}
        <View style={styles.gestionItem}>
          <View style={styles.gestionItemIcon}>
            <Ionicons name="leaf" size={22} color={COLORS.green} />
          </View>
          <View style={styles.gestionItemContent}>
            <Text style={styles.gestionItemTitle}>
              Impacto Ambiental reducido
            </Text>
            <Text style={styles.gestionItemDesc}>
              Al reducir la huella de carbono reducimos el impacto ambiental de
              los procesos de recolección, contribuyendo a un proceso de un 25%
              menos de emisiones.
            </Text>
          </View>
        </View>

        {/* Eficiencia Operativa */}
        <View style={styles.gestionItem}>
          <View style={styles.gestionItemIcon}>
            <MaterialCommunityIcons
              name="chart-timeline-variant-shimmer"
              size={22}
              color={COLORS.green}
            />
          </View>
          <View style={styles.gestionItemContent}>
            <Text style={styles.gestionItemTitle}>Eficiencia Operativa</Text>
            <Text style={styles.gestionItemDesc}>
              La optimización de rutas de recolección nos permite una mejor
              planificación de personal y una eficiencia operativa de un 40%
              mayor.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  gestionCard: {
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  gestionLabel: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  gestionTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 12,
  },
  gestionHighlight: {
    color: COLORS.green,
  },
  gestionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  gestionItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  gestionItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  gestionItemContent: {
    flex: 1,
  },
  gestionItemTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  gestionItemDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
