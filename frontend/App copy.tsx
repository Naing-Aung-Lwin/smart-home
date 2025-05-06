import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WeeklyMenuPage from "./page/WeeklyMenuPage";
import ShoppingListPage from "./page/ShoppingListPage";
import CreateMenuPage from "./page/CreateMenuPage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "./constants/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "list";

            if (route.name === "Weekly Menu") iconName = "restaurant";
            else if (route.name === "Shopping") iconName = "cart";
            else if (route.name === "Recipes") iconName = "book";
            else if (route.name === "Menu List") iconName = "menu";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.lightGray,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.primary,
            color: Colors.primary,
            height: 60,
            paddingBottom: 5,
          },
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen name="Weekly Menu" component={WeeklyMenuPage} />
        <Tab.Screen name="Shopping" component={ShoppingListPage} />
        <Tab.Screen name="Menu List" component={CreateMenuPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
