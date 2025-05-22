import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WeeklyMenuPage from "../components/Menu/WeeklyMenuPage";
import MenuPage from "../components/Menu/MenuPage";
import CurryPage from "../components/Menu/CurryPage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

const Tab = createBottomTabNavigator();

export default function MainMenuPage() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "list";

          if (route.name === "Weekly Menu") iconName = "restaurant";
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
      <Tab.Screen
        name="Weekly Menu"
        component={WeeklyMenuPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Menu List"
        component={MenuPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Curry List"
        component={CurryPage}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
