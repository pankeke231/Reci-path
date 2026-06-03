import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const pilares = [
  {
    icon: "git-network-outline",
    title: "Rutas Inteligentes",
    description:
      "Optimización automática de las rutas de recolección basada en datos en tiempo real, reduciendo costos y emisiones.",
  },
  {
    icon: "people-outline",
    title: "Colaboración Social",
    description:
      "Conectamos a comunidades, recicladores y empresas en un ecosistema colaborativo para maximizar el impacto del reciclaje.",
  },
  {
    icon: "map-outline",
    title: "Mapa Interactivo",
    description:
      "Visualiza puntos de recolección, rutas activas y centros de reciclaje en un mapa dinámico e intuitivo.",
  },
];

function PilarCard({ icon, title, description }) {
  return (
    <View style={styles.pilarCard}>
      <View style={styles.pilarIconContainer}>
        <Ionicons name={icon} size={24} color={COLORS.green} />
      </View>
      <Text style={styles.pilarTitle}>{title}</Text>
      <Text style={styles.pilarDescription}>{description}</Text>
    </View>
  );
}

export default function PilaresSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>NUESTRA PROPUESTA</Text>
      <Text style={styles.sectionTitle}>Pilares de Nuestra{"\n"}Solución</Text>
      {pilares.map((pilar, index) => (
        <PilarCard key={index} {...pilar} />
      ))}
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
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 24,
  },
  pilarCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  pilarIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  pilarTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  pilarDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
