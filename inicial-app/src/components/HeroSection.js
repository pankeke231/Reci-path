import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/colors";

export default function HeroSection() {
  return (
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>
        Superando la Ineficiencia en la{" "}
        <Text style={styles.heroHighlight}>Gestión de Residuos</Text>
      </Text>

      <Text style={styles.heroSubtitle}>
        La gestión tradicional de rutas de la basura y reciclaje es ineficiente.
        Nuestra S.E.A soluciona esto con herramientas de apoyo que conectan la
        generación y recolección de residuos inteligentes, data a tiempo real,
        facilitando una operación más conectada y eficiente.
      </Text>

      <TouchableOpacity style={styles.heroBtnPrimary}>
        <LinearGradient
          colors={[COLORS.green, COLORS.greenDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroBtnGradient}
        >
          <Text style={styles.heroBtnPrimaryText}>Solicitar Acceso</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.heroBtnSecondary}>
        <Text style={styles.heroBtnSecondaryText}>Revisar Mapa de Guía</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroHighlight: {
    color: COLORS.green,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 16,
  },
  heroBtnPrimary: {
    marginTop: 28,
    borderRadius: 14,
    overflow: "hidden",
  },
  heroBtnGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    borderRadius: 14,
  },
  heroBtnPrimaryText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: "700",
  },
  heroBtnSecondary: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  heroBtnSecondaryText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
});
