import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";

export default function AdminHomeScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const handleUsers = () => {
    navigation.navigate("CollectorsList");
  };

  const handleCollections = () => {
    navigation.navigate("AdminCollections");
  };

  const handleProfile = () => {
    navigation.navigate("AdminProfile");
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
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bienvenido, Administrador</Text>

          <Text style={styles.adminTitle}>Administrador</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={22} color="#10B981" />
          </View>

          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#FFF" />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={handleUsers}
          activeOpacity={0.9}
        >
          <View style={styles.cardContent}>
            <MaterialIcons name="groups" size={42} color="#065F46" />

            <Text style={styles.primaryTitle}>Gestionar usuarios</Text>

            <Text style={styles.primarySubtitle}>Gestionar recicladores</Text>
          </View>

          <Ionicons name="chevron-forward" size={32} color="#065F46" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryCard}
          onPress={handleCollections}
          activeOpacity={0.9}
        >
          <View>
            <MaterialIcons name="recycling" size={42} color="#10B981" />

            <Text style={styles.secondaryTitle}>Ver recogidas</Text>

            <Text style={styles.secondarySubtitle}>
              Ver recogidas de residuos
            </Text>
          </View>

          <MaterialIcons name="list-alt" size={30} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleProfile}>
          <Ionicons name="person-outline" size={22} color="#94A3B8" />

          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#94A3B8" />

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
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  welcome: {
    color: "#94A3B8",
    fontSize: 12,
  },

  adminTitle: {
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

  primaryCard: {
    backgroundColor: "#22C55E",
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardContent: {
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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  secondaryTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },

  secondarySubtitle: {
    color: "#94A3B8",
    marginTop: 4,
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
