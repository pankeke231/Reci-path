import { createNativeStackNavigator } from "@react-navigation/native-stack";
import COLORS from "../constants/colors";
import CollectorHomeScreen from "../app/(tabs)/collector/screens/CollectorHomeScreen";
import CollectorHistoryScreen from "../app/(tabs)/collector/screens/CollectorHistoryScreen";
import CollectorOrderDetailScreen from "../app/(tabs)/collector/screens/CollectorOrderDetailScreen";
import CollectorRoutesScreen from "../app/(tabs)/collector/screens/CollectorRoutesScreen";
import ProfileScreen from "../app/(tabs)/profile/ProfileScreen";

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
      <Stack.Screen name="CollectorProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
