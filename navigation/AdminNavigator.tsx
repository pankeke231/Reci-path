import { createNativeStackNavigator } from "@react-navigation/native-stack";
import COLORS from "../constants/colors";
import AdminHomeScreen from "../app/(tabs)/admin/screens/AdminHomeScreen";
import CollectorsListScreen from "../app/(tabs)/admin/screens/CollectorsListScreen";
import RegisterCollectorScreen from "../app/(tabs)/admin/screens/RegisterCollectorScreen";
import RegisterVehicleScreen from "../app/(tabs)/admin/screens/RegisterVehicle";
import CollectorDetailScreen from "../app/(tabs)/admin/screens/CollectorDetailScreen";
import CollectorEditScreen from "../app/(tabs)/admin/screens/CollectorEditScreen";
import AdminCollectionsScreen from "../app/(tabs)/admin/screens/AdminCollectionsScreen";
import AdminOrderDetailScreen from "../app/(tabs)/admin/screens/AdminOrderDetailScreen";
import ProfileScreen from "../app/(tabs)/profile/ProfileScreen";

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
      <Stack.Screen name="RegisterVehicle" component={RegisterVehicleScreen} />
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
