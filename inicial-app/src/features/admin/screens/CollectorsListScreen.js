import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { EmptyState, LoadingSpinner, Screen } from '../../../ui/components';
import { useCollectors } from '../../../hooks/useCollectors';
import { getProfileDisplayName } from '../../../models/user';
import AdminTopBar from '../components/AdminTopBar';
import CollectorListItem from '../components/CollectorListItem';

export default function CollectorsListScreen() {
  const navigation = useNavigation();
  const { collectors, loading, fetchCollectors } = useCollectors();
  const [query, setQuery] = useState('');

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
      const doc = (c.document_id ?? '').toLowerCase();
      return name.includes(q) || doc.includes(q);
    });
  }, [collectors, query]);

  if (loading && !collectors.length) {
    return <LoadingSpinner message="Cargando recicladores…" />;
  }

  return (
    <Screen padded={false}>
      <AdminTopBar onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>ADMINISTRACIÓN DE USUARIOS</Text>
        <Text style={styles.title}>Listado de recicladores</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nombre o ID..."
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CollectorListItem
              collector={item}
              onView={() =>
                navigation.navigate('CollectorDetail', { collectorId: item.id })
              }
              onEdit={() =>
                navigation.navigate('CollectorEdit', { collectorId: item.id })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="Sin recicladores"
              description="Registra el primer recolector con el botón +"
              actionLabel="Registrar reciclador"
              onAction={() => navigation.navigate('RegisterCollector')}
            />
          }
        />
      </View>

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('RegisterCollector')}
      >
        <Ionicons name="add" size={28} color={COLORS.bg} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    fontSize: 26,
    marginBottom: SPACING.lg,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  search: {
    flex: 1,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
    fontSize: 15,
  },
  list: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.green,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
