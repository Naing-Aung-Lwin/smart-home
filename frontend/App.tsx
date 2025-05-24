import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./page/HomePage";
import ManageMenuPage from "./page/ManageMenuPage";
import ManageMoneyPage from "./page/ManageMoneyPage";
import { Colors, Fonts } from "./constants/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Menu"
            component={ManageMenuPage}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white, // 💚 Your desired color
              },
              headerTintColor: Colors.primary, // 🏷 Text & icon color (white)
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: Fonts.size.header,
              },
            }}
          />
          <Stack.Screen
            name="Money"
            component={ManageMoneyPage}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white, // 💚 Your desired color
              },
              headerTintColor: Colors.primary, // 🏷 Text & icon color (white)
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: Fonts.size.header,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
