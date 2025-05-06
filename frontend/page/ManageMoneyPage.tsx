import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExpensePage from "../components/Money/ExpensePage";
import BudgetPage from "../components/Money/BudgetPage";
import IncomePage from "../components/Money/IncomePage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

const Tab = createBottomTabNavigator();

export default function MainMenuPage() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "list";

          if (route.name === "income") iconName = "cash";
          else if (route.name === "budget") iconName = "wallet";
          else if (route.name === "expense") iconName = "card";

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
        name="income"
        component={IncomePage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="expense"
        component={ExpensePage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="budget"
        component={BudgetPage}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
