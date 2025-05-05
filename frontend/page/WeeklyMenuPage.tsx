import React, { useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { Colors, Fonts } from "../constants/theme";

const meals = [
  "Pancakes",
  "Omelette",
  "Grilled Cheese",
  "Salad",
  "Spaghetti",
  "Sushi",
  "Chicken Rice",
  "Soup",
  "Tacos",
  "Burger",
  "Curry",
  "Fried Noodles",
  "Toast",
  "Fried Rice",
  "Pizza",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DayPlan = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

function getRandomMeal(): string {
  return meals[Math.floor(Math.random() * meals.length)];
}

function generateMenu(): DayPlan[] {
  return days.map((day) => ({
    day,
    breakfast: getRandomMeal(),
    lunch: getRandomMeal(),
    dinner: getRandomMeal(),
  }));
}

export default function WeeklyMenuScreen() {
  const [menu, setMenu] = useState<DayPlan[]>(generateMenu());

  return (
    <View style={styles.container}>
      <Button
        title="🎲 Generate New Menu"
        onPress={() => setMenu(generateMenu())}
        color={Colors.primary}
      />
      <Text style={styles.title}>Your Weekly Menu</Text>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.day}>{item.day}</Text>
            <Text>{item.breakfast}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: Fonts.size.title,
    color: Colors.primary,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  day: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "600",
    marginBottom: 8,
  },
});
