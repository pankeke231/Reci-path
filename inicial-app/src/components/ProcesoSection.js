import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const pasos = [
  {
    number: '01',
    icon: 'document-text-outline',
    title: 'Reporte de Datos',
    description:
      'Los usuarios y sensores reportan el estado de los contenedores y puntos de recolección en tiempo real.',
  },
  {
    number: '02',
    icon: 'navigate-outline',
    title: 'Asignación de Rutas',
    description:
      'El sistema asigna rutas óptimas de recolección basándose en la carga, proximidad y prioridad.',
  },
  {
    number: '03',
    icon: 'pulse-outline',
    title: 'Seguimiento en Tiempo Real',
    description:
      'Monitorea el recorrido de los recolectores y recibe actualizaciones sobre el estado de la recolección.',
  },
];

function ProcesoStep({ number, icon, title, description, isLast }) {
  return (
    <View style={styles.procesoStepContainer}>
      <View style={styles.procesoTimeline}>
        <View style={styles.procesoNumberCircle}>
          <Text style={styles.procesoNumber}>{number}</Text>
        </View>
        {!isLast && <View style={styles.procesoLine} />}
      </View>
      <View style={styles.procesoContent}>
        <View style={styles.procesoIconBadge}>
          <Ionicons name={icon} size={20} color={COLORS.green} />
        </View>
        <Text style={styles.procesoTitle}>{title}</Text>
        <Text style={styles.procesoDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function ProcesoSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>CÓMO FUNCIONA</Text>
      <Text style={styles.sectionTitle}>Proceso Logístico</Text>
      <View style={styles.procesoWrapper}>
        {pasos.map((paso, index) => (
          <ProcesoStep
            key={index}
            {...paso}
            isLast={index === pasos.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  sectionLabel: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 24,
  },
  procesoWrapper: {
    marginTop: 4,
  },
  procesoStepContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  procesoTimeline: {
    width: 44,
    alignItems: 'center',
  },
  procesoNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1.5,
    borderColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  procesoNumber: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: '800',
  },
  procesoLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 4,
  },
  procesoContent: {
    flex: 1,
    marginLeft: 16,
    paddingBottom: 28,
  },
  procesoIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  procesoTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  procesoDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
