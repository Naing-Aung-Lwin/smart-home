import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import api from "../../api/axios";
import commonMixin from "../../composable/common";

interface Curry {
  type: string;
  name: string;
}

interface Menu {
  _id: string;
  meal: Curry;
  vegetable: Curry;
}

interface MeanPlan {
  _id: string;
  date: string;
  menus: Menu[];
}

interface DayPlan {
  _id: string;
  date: string;
  menus: string[];
}

export default function WeeklyMenuScreen() {
  const { getDayAndCurrentTime } = commonMixin();
  const [menu, setMenu] = useState<MeanPlan[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const generateMenu = async () => {
    try {
      setLoading(true);
      const response = await api.post("/meal-plan/generate", {
        fromDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        toDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
      });

      if (response.data) {
        setWeeklyMenu(response.data);
      }
    } catch (error) {
      console.error("Failed to generate menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuList = async () => {
    try {
      const response = await api.get("/meal-plan");
      setMenu(response.data);
    } catch (error) {
      console.error("Failed to fetch menu list:", error);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  const getMenuList = useCallback(
    (id: string) => {
      for (const item of menu) {
        const found = item.menus.find((data) => data._id === id);
        if (found) return found;
      }
      return {
        meal: {
          type: "",
          name: "",
        },
        vegetable: {
          type: "",
          name: "",
        },
      };
    },
    [menu]
  );

  return (
    <View style={styles.container}>
      <Button
        title="🎲 Generate New Menu"
        onPress={generateMenu}
        color={Colors.primary}
      />
      <Text style={styles.title}>Your Weekly Menu</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={weeklyMenu}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.day}>
                {getDayAndCurrentTime(item.date)} - {item.date}
              </Text>
              {item.menus.map((menuId) => {
                const menuItem = getMenuList(menuId);
                return (
                  <View key={menuId} style={styles.menuItem}>
                    <Text>🍛 {menuItem.meal.name}</Text>
                    <Text>🥬 {menuItem.vegetable.name}</Text>
                  </View>
                );
              })}
            </View>
          )}
        />
      )}
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
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  menuItem: {
    marginBottom: 6,
    paddingLeft: 10,
  },
});
