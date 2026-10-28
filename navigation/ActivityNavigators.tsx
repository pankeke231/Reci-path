import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '@/constants/colors';
import AdminCollectionsScreen from '@/features/admin/screens/AdminCollectionsScreen';
import AdminOrderDetailScreen from '@/features/admin/screens/AdminOrderDetailScreen';
import CitizenHistoryScreen from '@/features/citizen/screens/CitizenHistoryScreen';
import CitizenOrderDetailScreen from '@/features/citizen/screens/CitizenOrderDetailScreen';
import CollectorOrderDetailScreen from '@/features/collector/screens/CollectorOrderDetailScreen';
import CollectorRoutesScreen from '@/features/collector/screens/CollectorRoutesScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: COLORS.bg },
  animation: 'slide_from_right' as const,
};

export function CitizenActivityNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="CitizenHistory" component={CitizenHistoryScreen} />
      <Stack.Screen name="CitizenOrderDetail" component={CitizenOrderDetailScreen} />
    </Stack.Navigator>
  );
}

export function CollectorActivityNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="CollectorRoutes" component={CollectorRoutesScreen} />
      <Stack.Screen name="CollectorOrderDetail" component={CollectorOrderDetailScreen} />
    </Stack.Navigator>
  );
}

export function AdminActivityNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="AdminCollections" component={AdminCollectionsScreen} />
      <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} />
    </Stack.Navigator>
  );
}
