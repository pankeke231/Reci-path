import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '../constants/colors';
import CitizenHomeScreen from '../features/citizen/screens/CitizenHomeScreen';
import CitizenHistoryScreen from '../features/citizen/screens/CitizenHistoryScreen';
import CitizenRequestScreen from '../features/citizen/screens/CitizenRequestScreen';
import CitizenOrderDetailScreen from '../features/citizen/screens/CitizenOrderDetailScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function CitizenNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="CitizenHome" component={CitizenHomeScreen} />
      <Stack.Screen name="CitizenHistory" component={CitizenHistoryScreen} />
      <Stack.Screen name="CitizenRequest" component={CitizenRequestScreen} />
      <Stack.Screen
        name="CitizenOrderDetail"
        component={CitizenOrderDetailScreen}
      />
      <Stack.Screen name="CitizenProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
