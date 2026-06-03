import { createNativeStackNavigator } from "@react-navigation/native-stack";
import COLORS from "../constants/colors";
import AdminHomeScreen from "../features/admin/screens/AdminHomeScreen";
import CollectorsListScreen from "../features/admin/screens/CollectorsListScreen";
import RegisterCollectorScreen from "../features/admin/screens/RegisterCollectorScreen";
import CollectorDetailScreen from "../features/admin/screens/CollectorDetailScreen";
import CollectorEditScreen from "../features/admin/screens/CollectorEditScreen";
import AdminCollectionsScreen from "../features/admin/screens/AdminCollectionsScreen";
import AdminOrderDetailScreen from "../features/admin/screens/AdminOrderDetailScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
      <Stack.Screen name="CollectorsList" component={CollectorsListScreen} />
      <Stack.Screen
        name="RegisterCollector"
        component={RegisterCollectorScreen}
      />
      <Stack.Screen name="CollectorDetail" component={CollectorDetailScreen} />
      <Stack.Screen name="CollectorEdit" component={CollectorEditScreen} />
      <Stack.Screen
        name="AdminCollections"
        component={AdminCollectionsScreen}
      />
      <Stack.Screen
        name="AdminOrderDetail"
        component={AdminOrderDetailScreen}
      />
      <Stack.Screen name="AdminProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
