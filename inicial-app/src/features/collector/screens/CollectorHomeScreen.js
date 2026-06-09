import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { useOrders } from "../../../hooks/useOrders";
import { getProfileFirstName } from "../../../models/user";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import {
  calculateCollectorImpactKg,
  getNextStop,
  isCollectorActiveToday,
} from "../utils/collectorHelpers";

export default function CollectorHomeScreen() {
  const navigation = useNavigation();
  const { profile, signOut } = useAuth();
  const { orders, fetchOrders } = useOrders();

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", fetchOrders);
    return unsub;
  }, [navigation, fetchOrders]);

  const firstName = getProfileFirstName(profile) || "Recolector";
  const impactKg = Math.round(calculateCollectorImpactKg(orders));
  const isActive = isCollectorActiveToday(orders);
  const nextStop = getNextStop(orders);

  const handleManageWaste = () => {
    navigation.navigate("CollectorHistory");
  };

  const handleRoutes = () => {
    navigation.navigate("CollectorRoutes");
  };

  const handleProfile = () => {
    navigation.navigate("CollectorProfile");
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Deseas salir de la aplicación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert("Error", error.message || "No se pudo cerrar sesión");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bienvenido, {firstName}</Text>
          <Text style={styles.role}>Recolector</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="recycle" size={22} color="#2ECC71" />
          </View>

          <View style={styles.avatar}>
            <MaterialIcons name="person" size={20} color="#FFF" />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.cardLabel}>Estado Hoy</Text>
            <Text style={styles.cardTitle}>{isActive ? "Activo" : "Inactivo"}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.cardLabel}>Impacto</Text>
            <Text style={styles.impactText}>{impactKg} kg</Text>
          </View>
        </View>

        {/* Recolectar */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryButton}
          onPress={handleManageWaste}
        >
          <View>
            <MaterialCommunityIcons name="recycle" size={42} color="#00381C" />
            <Text style={styles.primaryTitle}>Recoger residuos</Text>
            <Text style={styles.primarySubtitle}>Iniciar nueva recolección</Text>
          </View>

          <MaterialIcons name="chevron-right" size={34} color="#00381C" />
        </TouchableOpacity>

        {/* Ruta */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.secondaryButton}
          onPress={handleRoutes}
        >
          <View>
            <MaterialIcons name="alt-route" size={42} color="#2ECC71" />
            <Text style={styles.secondaryTitle}>Ver ruta</Text>
            <Text style={styles.secondarySubtitle}>Optimizar trayecto hoy</Text>
          </View>

          <MaterialIcons name="map" size={30} color="#64748B" />
        </TouchableOpacity>

        {/* Próxima parada */}
        {nextStop && (
          <View style={styles.nextStop}>
            <Feather name="clock" size={14} color="#64748B" />
            <Text style={styles.nextStopText}>
              Siguiente parada: {nextStop.address} • {nextStop.time}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
          <MaterialIcons name="person" size={24} color="#94A3B8" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#94A3B8" />
          <Text style={styles.navText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },

  welcome: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },

  role: {
    color: "#2ECC71",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 2,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  logoContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  statusCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  cardLabel: {
    color: "#2ECC71",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
  },

  impactText: {
    color: "#2ECC71",
    fontSize: 24,
    fontWeight: "700",
  },

  primaryButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 24,
    padding: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  primaryTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#00381C",
    marginTop: 10,
  },

  primarySubtitle: {
    color: "#00381C",
    opacity: 0.8,
    marginTop: 4,
  },

  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  secondaryTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  secondarySubtitle: {
    color: "#94A3B8",
    marginTop: 4,
  },

  nextStop: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  nextStopText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    backgroundColor: "#0F172A",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
});