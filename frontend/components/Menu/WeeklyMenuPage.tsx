import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import api from "../../api/axios";
import commonMixin from "../../composable/common";
import ChooseMealBox from "./ChooseMealBox";

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

export default function WeeklyMenuScreen() {
  const { getDayAndCurrentTime } = commonMixin();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<MeanPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [regenerateDate, setRegenrateDate] = useState<string>("");

  const generateMenu = async () => {
    try {
      setLoading(true);
      const response = await api.post("/meal-plan/generate", {
        fromDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        toDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
      });

      if (response.data) {
        fetchWeeklyMenuList();
      }
    } catch (error) {
      console.error("Failed to generate menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuList = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/menu`);
      setMenus(response.data);
    } catch (error) {
      console.error("Failed to fetch menu list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyMenuList = async () => {
    try {
      setLoading(true);
      const fromDate = new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0];
      const toDate = new Date(Date.now() + 86400000 * 7)
        .toISOString()
        .split("T")[0];
      const response = await api.get(
        `/meal-plan?fromDate=${fromDate}&toDate=${toDate}`
      );
      setWeeklyMenu(response.data);
    } catch (error) {
      console.error("Failed to fetch menu list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuList();
    fetchWeeklyMenuList();
  }, []);

  const handleRegenerate = async (id: string) => {
    setLoading(true);
    try {
      const payload = {
        date: regenerateDate,
        menus: [id],
      };
      const res = await api.put(`meal-plan/${regenerateDate}`, payload);
      if (res.data) fetchWeeklyMenuList();
    } catch (error) {
      console.error("Failed to fetch menu list:", error);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const handleUpdate = async (date: string) => {
    setRegenrateDate(date);
    setModalVisible(true);
  };

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
              <View style={styles.rowBetween}>
                <Text style={styles.day}>
                  {getDayAndCurrentTime(item.date)} - {item.date}
                </Text>

                <TouchableOpacity
                  onPress={() => handleUpdate(item.date)}
                  style={styles.editButton}
                >
                  <Text style={styles.iconText}>✏️</Text>
                </TouchableOpacity>
              </View>
              {item.menus.map((menu, index) => {
                return (
                  <View key={index} style={styles.menuItem}>
                    <Text>🍛 {menu.meal.name}</Text>
                    <Text>🥬 {menu.vegetable.name}</Text>
                  </View>
                );
              })}
            </View>
          )}
        />
      )}
      <ChooseMealBox
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        isLoading={loading}
        menus={menus}
        handleRegenerate={handleRegenerate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
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
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  iconText: {
    color: "#fff",
    fontWeight: "600",
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
