import "./global.css";
import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "./screens/SingIn";
import SignUp from "./screens/SingUp";
import Home from "./screens/Home";
import Historico from "./screens/Historico";
import { obterToken } from "./services/auth";
import { useSyncSenhas } from "./hooks/useSyncSenhas";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  useSyncSenhas();

  useEffect(() => {
    async function carregarSessao() {
      const token = await obterToken();
      setInitialRoute(token ? "Home" : "SignIn");
    }

    carregarSessao();
  }, []);

  if (!initialRoute) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Historico" component={Historico} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
