import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import MenuForm from "./MenuForm";
import ConfirmModalBox from "../common/ConfirmModalBox";

type Menu = {
  _id: string;
  name: string;
  type: string;
};

type MenlPlan = {
  _id: string;
  meal: Menu;
  vegetable: Menu;
};

export default function MenuPage() {
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [menus, setMenus] = useState<MenlPlan[]>([]);
  const [mealCurry, setMealCurry] = useState<Menu[]>([]);
  const [vegetableCurry, setVegetableCurry] = useState<Menu[]>([]);
  const [error, setError] = useState({
    _id: "",
    meal: "",
    vegetable: "",
  });
  const [formData, setFormData] = useState({
    _id: "",
    meal: "",
    vegetable: "",
  });

  const fetchMealsAndVegetables = async () => {
    try {
      const [mealRes, vegRes] = await Promise.all([
        api.get("/curry?type=meal"),
        api.get("/curry?type=vegetable"),
      ]);
      setMealCurry(mealRes.data);
      setVegetableCurry(vegRes.data);
    } catch (err) {
      console.error("Error loading meals/vegetables", err);
    }
  };

  const handleAddMenu = async () => {
    if (!!formData.meal && !!formData.vegetable) {
      try {
        setLoading(true);
        await api.post("/menu", {
          meal: formData.meal,
          vegetable: formData.vegetable,
        });
        fetchMenu();
        setFormData({
          _id: "",
          meal: "",
          vegetable: "",
        });
        setError({
          _id: "",
          meal: "",
          vegetable: "",
        });
      } catch (error) {
        console.error("Failed to generate menu:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setError({
        _id: "",
        meal: !!formData.meal.trim() ? "" : "Meal is required",
        vegetable: !!formData.vegetable.trim() ? "" : "Vegetable is required",
      });
    }
  };

  const handleUpdateMenu = async () => {
    if (!!formData.meal && !!formData.vegetable) {
      try {
        setLoading(true);
        const isUpdate = !!formData._id;
        if (isUpdate) {
          await api.put(`/menu/${formData._id}`, formData);
        } else {
          await api.post("/menu", {
            meal: formData.meal,
            vegetable: formData.vegetable,
          });
        }
        fetchMenu();
        setFormData({
          _id: "",
          meal: "",
          vegetable: "",
        });
        setError({
          _id: "",
          meal: "",
          vegetable: "",
        });
      } catch (error) {
        console.error("Failed to generate menu:", error);
      } finally {
        setLoading(false);
        setModalVisible(false);
      }
    } else {
      setError({
        _id: "",
        meal: !!formData.meal.trim() ? "" : "Meal is required",
        vegetable: !!formData.vegetable.trim() ? "" : "Vegetable is required",
      });
    }
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);
      let search = "";
      if (searchName) search = `name=${searchName}`;
      const response = await api.get(`/menu?${search}`);
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsAndVegetables();
    fetchMenu();
  }, []);

  const handleUpdate = (menu: MenlPlan) => {
    setFormData({
      _id: menu._id,
      meal: menu.meal._id,
      vegetable: menu.vegetable._id,
    });
    setError({ _id: "", meal: "", vegetable: "" });
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/menu/${selectedId}`);
      fetchMenu();
    } catch (error) {
      console.error("Error deleting menu:", error);
    } finally {
      setSelectedId("");
      setConfirmModal(false);
    }
  };

  const handleAdd = () => {
    setFormData({ _id: "", meal: "", vegetable: "" });
    setError({ _id: "", meal: "", vegetable: "" });
    setModalVisible(true);
  };

  const onSearch = () => {
    fetchMenu();
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={searchName}
            placeholder="Meal or Vegetable"
            onChangeText={setSearchName}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={onSearch} style={styles.iconWrapper}>
            <Ionicons name="search" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <View style={styles.menuHeader}>
          <Text style={styles.menusTitle}>All Menus</Text>
          <TouchableOpacity
            style={[styles.actionButton, styles.addNewButton]}
            onPress={handleAdd}
          >
            <Text style={styles.buttonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <FlatList
            data={menus}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) =>
              item &&
              item.meal &&
              item.vegetable &&
              item.meal.name &&
              item.vegetable.name ? (
                <View key={index} style={styles.menuItem}>
                  <Text>🍛 {item.meal.name}</Text>
                  <Text>🥬 {item.vegetable.name}</Text>

                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.updateButton]}
                      onPress={() => handleUpdate(item)}
                    >
                      <Text style={styles.buttonText}>✏️ Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => {
                        setSelectedId(item._id);
                        setConfirmModal(true);
                      }}
                    >
                      <Text style={styles.buttonText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            }
          />
        )}
      </KeyboardAvoidingView>
      <ConfirmModalBox
        isModalVisible={confirmModal}
        setIsModalVisible={setConfirmModal}
        isLoading={loading}
        handleSubmit={handleDelete}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MenuForm
              error={error}
              formData={formData}
              setFormData={setFormData}
              mealCurry={mealCurry}
              vegetableCurry={vegetableCurry}
              handleAddMenu={handleUpdateMenu}
              adding={loading}
              setModalVisible={setModalVisible}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  title: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.primary,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  menusTitle: {
    fontSize: Fonts.size.title,
    fontWeight: "bold",
    color: Colors.primary,
  },
  viewAllText: {
    fontSize: Fonts.size.text,
    color: Colors.primary,
  },
  menuList: {
    paddingBottom: 50,
  },
  menuItem: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  menuName: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "600",
    color: Colors.primary,
  },
  typeName: {
    fontSize: Fonts.size.text,
    color: Colors.lightGray,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
    gap: 10, // or use marginRight on buttons if your RN version doesn’t support gap
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  addNewButton: {
    backgroundColor: Colors.primary,
  },
  updateButton: {
    backgroundColor: "#4caf50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: Fonts.size.button,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F2937",
    height: 50,
  },
  iconWrapper: {
    paddingLeft: 10,
  },
});
