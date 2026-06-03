import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { RADIUS, SPACING, TYPOGRAPHY } from "../../../ui/theme/spacing";
import { Button, Screen } from "../../../ui/components";
import { useCollectors } from "../../../hooks/useCollectors";
import { getProfileDisplayName } from "../../../models/user";
import AdminTopBar from "../components/AdminTopBar";

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || "—"}</Text>
    </View>
  );
}

export default function CollectorDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { collectors } = useCollectors();

  const collector = useMemo(
    () => collectors.find((c) => c.id === route.params?.collectorId),
    [collectors, route.params?.collectorId],
  );

  if (!collector) {
    return (
      <Screen>
        <AdminTopBar onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Recolector no encontrado.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll padded={false}>
      <AdminTopBar onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={COLORS.green} />
        </View>
        <Text style={styles.name}>{getProfileDisplayName(collector)}</Text>

        <View style={styles.card}>
          <Row label="Nº IDENTIDAD" value={collector.document_id} />
          <Row label="CORREO" value={collector.email} />
          <Row label="CELULAR" value={collector.phone} />
          <Row label="DIRECCIÓN" value={collector.address} />
        </View>

        <Button
          title="Editar recolector"
          onPress={() =>
            navigation.navigate("CollectorEdit", { collectorId: collector.id })
          }
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  row: {
    gap: 4,
  },
  rowLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  rowValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  missing: {
    padding: SPACING.lg,
    color: COLORS.textSecondary,
  },
});
