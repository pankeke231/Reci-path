import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '@/constants/colors';
import AdminCollectionsScreen from '@/app/(tabs)/admin/screens/AdminCollectionsScreen';
import AdminOrderDetailScreen from '@/app/(tabs)/admin/screens/AdminOrderDetailScreen';
import CitizenHistoryScreen from '@/app/(tabs)/citizen/screens/CitizenHistoryScreen';
import CitizenOrderDetailScreen from '@/app/(tabs)/citizen/screens/CitizenOrderDetailScreen';
import CollectorOrderDetailScreen from '@/app/(tabs)/collector/screens/CollectorOrderDetailScreen';
import CollectorRoutesScreen from '@/app/(tabs)/collector/screens/CollectorRoutesScreen';

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
