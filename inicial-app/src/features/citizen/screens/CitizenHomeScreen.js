import { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../../../hooks/useAuth";
import { useOrders } from "../../../hooks/useOrders";

import { getProfileFirstName } from "../../../models/user";

import { Screen } from "../../../ui/components";

import {
  calculateWeeklyCo2Saved,
  hasActiveRequests,
} from "../utils/orderHelpers";

export default function CitizenHomeScreen() {
  const navigation = useNavigation();

  const { profile, signOut } = useAuth();
  const { orders, fetchOrders } = useOrders();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchOrders);
    return unsubscribe;
  }, [navigation, fetchOrders]);

  const firstName = getProfileFirstName(profile) || "Ciudadano";

  const co2 = calculateWeeklyCo2Saved(orders);
  const active = hasActiveRequests(orders);

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Deseas salir de la aplicación?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Salir",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  return (
    <Screen padded={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bienvenida, {firstName}</Text>

          <Text style={styles.citizenTitle}>Ciudadano</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={22} color="#10B981" />
          </View>

          <Pressable
            style={styles.avatar}
            onPress={() => navigation.navigate("CitizenProfile")}
          >
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* IMPACT CARD */}
        <View style={styles.impactCard}>
          <View>
            <Text style={styles.impactLabel}>Impacto Semanal</Text>

            <Text style={styles.impactStatus}>
              {active ? "Activo" : "Sin actividad"}
            </Text>
          </View>

          <View style={styles.impactRight}>
            <Text style={styles.impactLabelSecondary}>CO₂ Ahorrado</Text>

            <Text style={styles.co2Value}>{co2} kg</Text>
          </View>
        </View>

        {/* GESTIONAR RESIDUOS */}
        <Pressable
          style={styles.primaryCard}
          onPress={() => navigation.navigate("CitizenRequest")}
        >
          <View style={styles.cardInfo}>
            <MaterialIcons name="recycling" size={42} color="#065F46" />

            <Text style={styles.primaryTitle}>Gestionar residuos</Text>

            <Text style={styles.primarySubtitle}>
              Inicia un nuevo reporte de reciclaje
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={30} color="#065F46" />
        </Pressable>

        {/* HISTORIAL */}
        <Pressable
          style={styles.secondaryCard}
          onPress={() => navigation.navigate("CitizenHistory")}
        >
          <View>
            <Ionicons name="time-outline" size={42} color="#10B981" />

            <Text style={styles.secondaryTitle}>Historial</Text>

            <Text style={styles.secondarySubtitle}>
              Revisa tus contribuciones pasadas
            </Text>
          </View>

          <MaterialIcons name="list-alt" size={28} color="#64748B" />
        </Pressable>

        {/* FOOTER TEXT */}
        <View style={styles.quoteContainer}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color="#64748B"
          />

          <Text style={styles.quote}>Cali es más limpia gracias a ti</Text>
        </View>
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navButton}
          onPress={() => navigation.navigate("CitizenProfile")}
        >
          <Ionicons name="person-outline" size={22} color="#94A3B8" />

          <Text style={styles.navText}>Perfil</Text>
        </Pressable>

        <Pressable style={styles.navButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#94A3B8" />

          <Text style={styles.navText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 24,
    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  welcome: {
    color: "#94A3B8",
    fontSize: 12,
  },

  citizenTitle: {
    color: "#10B981",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 2,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "#1E293B",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,

    borderWidth: 2,
    borderColor: "#10B981",

    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  impactCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    borderRadius: 20,

    padding: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 24,
  },

  impactLabel: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  impactStatus: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },

  impactRight: {
    alignItems: "flex-end",
  },

  impactLabelSecondary: {
    color: "#94A3B8",
    fontSize: 12,
    textTransform: "uppercase",
  },

  co2Value: {
    color: "#10B981",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },

  primaryCard: {
    backgroundColor: "#22C55E",

    borderRadius: 24,
    padding: 28,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 20,
  },

  cardInfo: {
    flex: 1,
  },

  primaryTitle: {
    color: "#064E3B",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },

  primarySubtitle: {
    color: "#065F46",
    marginTop: 4,
  },

  secondaryCard: {
    backgroundColor: "rgba(255,255,255,0.04)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    borderRadius: 24,
    padding: 28,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  secondaryTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },

  secondarySubtitle: {
    color: "#94A3B8",
    marginTop: 4,
  },

  quoteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 24,
    gap: 6,
  },

  quote: {
    color: "#64748B",
    fontSize: 12,
    textTransform: "uppercase",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",

    paddingTop: 16,
    paddingBottom: 30,

    borderTopWidth: 1,
    borderTopColor: "#1E293B",

    backgroundColor: "#111827",
  },

  navButton: {
    alignItems: "center",
  },

  navText: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
});
