import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../app/(tabs)/auth/screens/LoginScreen";
import RegisterScreen from "../app/(tabs)/auth/screens/RegisterScreen";
import { screenOptions } from "./navigationTheme";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Crear cuenta" }}
      />
    </Stack.Navigator>
  );
}
