import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { useCollectors } from "../../../hooks/useCollectors";
import { getProfileDisplayName } from "../../../models/user";

export default function CollectorsListScreen() {
  const navigation = useNavigation();
  const { collectors, loading, fetchCollectors } = useCollectors();
  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchCollectors();
    }, [fetchCollectors]),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return collectors;
    return collectors.filter((c) => {
      const name = getProfileDisplayName(c).toLowerCase();
      const doc = (c.document_id ?? "").toLowerCase();
      return name.includes(q) || doc.includes(q);
    });
  }, [collectors, query]);

  const renderItem = ({ item }) => {
    const name = getProfileDisplayName(item);
    return (
      <View style={styles.card}>
        <View style={styles.leftSection}>
          {item.avatar_url ? (
            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={30} color="#94A3B8" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name}</Text>

            <View style={styles.row}>
              <MaterialIcons name="badge" size={16} color="#94A3B8" />
              <Text style={styles.document}>{item.document_id || "—"}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.info}>📞 {item.phone || "—"}</Text>
              {(item.license_plate || item.vehicle_type) && (
                <Text style={styles.info}>
                  🚗 {item.license_plate || "—"} - {item.vehicle_type || "—"}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.iconButton}
            onPress={() =>
              navigation.navigate("CollectorDetail", { collectorId: item.id })
            }
          >
            <MaterialIcons name="visibility" size={22} color="#10B981" />
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={() =>
              navigation.navigate("CollectorEdit", { collectorId: item.id })
            }
          >
            <MaterialIcons name="edit" size={22} color="#10B981" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={22} color="#10B981" />
        </Pressable>

        <View>
          <Text style={styles.logo}>Reci-path</Text>
          <Text style={styles.subtitle}>Administración de Usuarios</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.sectionLabel}>RECICLADORES</Text>
        <Text style={styles.title}>Listado de recicladores</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#94A3B8" />
        <TextInput
          placeholder="Buscar por nombre o ID..."
          placeholderTextColor="#64748B"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Sin recicladores registrados</Text>
            </View>
          ) : null
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate("RegisterCollector")}
      >
        <MaterialIcons name="add" size={34} color="#FFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  logo: {
    color: "#10B981",
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 12,
  },

  titleContainer: {
    marginBottom: 20,
  },

  sectionLabel: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },

  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    color: "#FFF",
    height: 52,
    marginLeft: 10,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  leftSection: {
    flexDirection: "row",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 14,
  },

  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  name: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  document: {
    color: "#94A3B8",
    marginLeft: 5,
  },

  infoContainer: {
    marginTop: 10,
    gap: 4,
  },

  info: {
    color: "#CBD5E1",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 12,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 30,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
  },
});
