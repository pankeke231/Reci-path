import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useOrders } from '../../../hooks/useOrders';
import COLORS from '../../../constants/colors';
import { SPACING } from '../../../ui/theme/spacing';
import { EmptyState, LoadingSpinner, Screen } from '../../../ui/components';
import { COLLECTION_TABS } from '../../admin/constants';
import CitizenHeader from '../../citizen/components/CitizenHeader';
import SegmentedTabs from '../../citizen/components/SegmentedTabs';
import ReceivedCollectionCard from '../../admin/components/ReceivedCollectionCard';
import CompletedCollectionCard from '../../admin/components/CompletedCollectionCard';
import {
  filterCollectorCompleted,
  filterReceivedOrders,
} from '../utils/collectorHelpers';

const TABS = [
  { key: COLLECTION_TABS.RECEIVED, label: 'RECIBIDAS' },
  { key: COLLECTION_TABS.COMPLETED, label: 'COMPLETADAS' },
];

export default function CollectorHistoryScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { orders, loading, fetchOrders } = useOrders();
  const [tab, setTab] = useState(COLLECTION_TABS.RECEIVED);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const data =
    tab === COLLECTION_TABS.RECEIVED
      ? filterReceivedOrders(orders)
      : filterCollectorCompleted(orders, profile?.id);

  if (loading && !orders.length) {
    return <LoadingSpinner message="Cargando recogidas…" />;
  }

  return (
    <Screen padded={false}>
      <CitizenHeader
        title="Historial de recogidas"
        showBack
        onBack={() => navigation.goBack()}
        onProfile={() => navigation.navigate('CollectorProfile')}
      />

      <View style={styles.content}>
        <SegmentedTabs tabs={TABS} activeKey={tab} onChange={setTab} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOrders}
              tintColor={COLORS.green}
            />
          }
          renderItem={({ item }) =>
            tab === COLLECTION_TABS.RECEIVED ? (
              <ReceivedCollectionCard
                order={item}
                showChevron
                onPress={() =>
                  navigation.navigate('CollectorOrderDetail', {
                    orderId: item.id,
                  })
                }
              />
            ) : (
              <CompletedCollectionCard
                order={item}
                onPress={() =>
                  navigation.navigate('CollectorOrderDetail', {
                    orderId: item.id,
                  })
                }
              />
            )
          }
          ListEmptyComponent={
            <EmptyState
              icon="reload-outline"
              title={
                tab === COLLECTION_TABS.RECEIVED
                  ? 'Sin recogidas recibidas'
                  : 'Sin recogidas completadas'
              }
              description={
                tab === COLLECTION_TABS.RECEIVED
                  ? 'Las solicitudes pendientes aparecerán aquí.'
                  : 'Tus recolecciones finalizadas se listarán aquí.'
              }
            />
          }
          contentContainerStyle={styles.list}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  list: {
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
});
