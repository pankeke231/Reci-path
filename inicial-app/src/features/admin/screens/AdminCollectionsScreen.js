import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import COLORS from '../../../constants/colors';
import { SPACING } from '../../../ui/theme/spacing';
import { EmptyState, LoadingSpinner, Screen } from '../../../ui/components';
import { useOrders } from '../../../hooks/useOrders';
import AdminHeader from '../components/AdminHeader';
import SegmentedTabs from '../../citizen/components/SegmentedTabs';
import ReceivedCollectionCard from '../components/ReceivedCollectionCard';
import CompletedCollectionCard from '../components/CompletedCollectionCard';
import { COLLECTION_TABS } from '../constants';
import {
  filterCompletedOrders,
  filterReceivedOrders,
} from '../utils/collectionHelpers';

const TABS = [
  { key: COLLECTION_TABS.RECEIVED, label: 'RECIBIDAS' },
  { key: COLLECTION_TABS.COMPLETED, label: 'COMPLETADAS' },
];

export default function AdminCollectionsScreen() {
  const navigation = useNavigation();
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
      : filterCompletedOrders(orders);

  if (loading && !orders.length) {
    return <LoadingSpinner message="Cargando recogidas…" />;
  }

  return (
    <Screen padded={false}>
      <AdminHeader
        title="Historial de recogidas"
        showBack
        onBack={() => navigation.goBack()}
        onProfile={() => navigation.navigate('AdminProfile')}
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
                onPress={() => navigation.navigate('AdminOrderDetail', { orderId: item.id })}
              />
            ) : (
              <CompletedCollectionCard
                order={item}
                onPress={() => navigation.navigate('AdminOrderDetail', { orderId: item.id })}
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
              description="Las solicitudes de ciudadanos aparecerán aquí."
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
