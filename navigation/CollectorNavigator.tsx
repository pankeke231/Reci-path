import { createNativeStackNavigator } from "@react-navigation/native-stack";
import COLORS from "../constants/colors";
import CollectorHomeScreen from "@/features/collector/screens/CollectorHomeScreen";
import CollectorHistoryScreen from "@/features/collector/screens/CollectorHistoryScreen";
import CollectorOrderDetailScreen from "@/features/collector/screens/CollectorOrderDetailScreen";
import CollectorRoutesScreen from "@/features/collector/screens/CollectorRoutesScreen";
import ProfileScreen from "@/features/profile/ProfileScreen";
import MapScreen from "../app/(tabs)/map";
import CollectorViewRouteScreen from "@/features/collector/screens/CollectorViewRouteScreen";

const Stack = createNativeStackNavigator();

export default function CollectorNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="CollectorHome" component={CollectorHomeScreen} />
      <Stack.Screen
        name="CollectorHistory"
        component={CollectorHistoryScreen}
      />
      <Stack.Screen
        name="CollectorOrderDetail"
        component={CollectorOrderDetailScreen}
      />
      <Stack.Screen name="CollectorRoutes" component={CollectorRoutesScreen} />
      <Stack.Screen
        name="CollectorViewRoute"
        component={CollectorViewRouteScreen}
      />
      <Stack.Screen name="CollectorProfile" component={ProfileScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
}
