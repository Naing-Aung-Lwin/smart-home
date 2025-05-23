import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import api from "../../api/axios";
import commonMixin from "../../composable/common";
import ChooseMealBox from "./ChooseMealBox";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface Curry {
  _id: string;
  type: string;
  name: string;
}

interface Menu {
  _id: string;
  meal: Curry;
  vegetable: Curry;
}

interface MealPlan {
  _id: string;
  date: string;
  menus: Menu[];
}

export default function WeeklyMenuScreen() {
  const { getDayAndCurrentTime } = commonMixin();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [regenerateDate, setRegenrateDate] = useState<string>("");
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [fromDate, setFromDate] = useState(getCurrentWeekRange().start);
  const [toDate, setToDate] = useState(getCurrentWeekRange().end);
  const [selectedMenu, setSelectedMenu] = useState<MealPlan | null>(null);

  function getCurrentWeekRange() {
    const today = new Date();

    const day = today.getDay();

    const diffToMonday = day === 0 ? -6 : 1 - day;

    // Get Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    // Get Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format helper: dd-mm-yyyy
    const formatDate = (date: any) => {
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear();
      return `${y}-${m}-${d}`;
    };

    return {
      start: formatDate(monday),
      end: formatDate(sunday),
    };
  }

  const generateMenu = async () => {
    try {
      setLoading(true);
      const response = await api.post("/meal-plan/generate", {
        fromDate,
        toDate,
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

  const handleUpdate = async (data: MealPlan) => {
    setRegenrateDate(data.date);
    setModalVisible(true);
    setSelectedMenu(data);
  };

  const onChangeFromDate = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    setShowFromDate(Platform.OS === "ios");
    if (selectedDate) {
      setFromDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const onChangeToDate = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    setShowToDate(Platform.OS === "ios");
    if (selectedDate) {
      setToDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>From</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setShowFromDate(true)}
          >
            <Text style={{ color: "#1F2937" }}>
              {fromDate ? fromDate.toString().slice(0, 10) : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showFromDate && (
            <DateTimePicker
              value={fromDate ? new Date(fromDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowFromDate(false);
                if (date) onChangeFromDate(event, date);
              }}
            />
          )}
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>To</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setShowToDate(true)}
          >
            <Text style={{ color: "#1F2937" }}>
              {toDate ? toDate.toString().slice(0, 10) : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showToDate && (
            <DateTimePicker
              value={toDate ? new Date(toDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowToDate(false);
                if (date) onChangeToDate(event, date);
              }}
            />
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <View style={{ flex: 1, marginHorizontal: 5 }}>
          <Button
            title="🎲 Generate"
            onPress={generateMenu}
            color={Colors.primary}
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 5 }}>
          <Button
            title="Search"
            onPress={fetchWeeklyMenuList}
            color={Colors.primary}
          />
        </View>
      </View>

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
                  onPress={() => handleUpdate(item)}
                  style={styles.editButton}
                >
                  <Text style={styles.iconText}>✏️</Text>
                </TouchableOpacity>
              </View>
              {item.menus.map((menu, index) => {
                return (
                  <View key={index} style={styles.menuItem}>
                    <Text>🍛 {menu?.meal?.name}</Text>
                    <Text>🥬 {menu?.vegetable?.name}</Text>
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
        handleRegenerate={handleRegenerate}
        selectedMenu={selectedMenu}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F1F5F9",
    padding: 8,
    marginBottom: 10,
    fontSize: Fonts.size.text,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: Fonts.size.text,
    color: "#6B7280",
    marginBottom: 4,
  },
  picker: {
    height: 55,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
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
