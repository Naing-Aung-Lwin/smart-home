import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import ConfirmModalBox from "../common/ConfirmModalBox";

type Menu = {
  _id: string;
  name: string;
  type: string;
};

export default function MenuPage() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [searchName, setSearchName] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState({
    name: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const handleAddMenu = async () => {
    if (formData && !!formData.name.trim() && !!formData.type.trim()) {
      try {
        setAdding(true);
        await api.post("/curry", formData);
        fetchMenu();
        setFormData({
          name: "",
          type: "",
        });
        setError({
          name: "",
          type: "",
        });
      } catch (error) {
        console.error("Failed to generate menu:", error);
      } finally {
        setAdding(false);
      }
    } else {
      setError({
        name: !!formData.name.trim() ? "" : "Name is required",
        type: !!formData.type.trim() ? "" : "Type is required",
      });
    }
  };
  const renderMenuItem = ({ item }: { item: Menu }) => (
    <View style={styles.menuItemRow}>
      <View style={styles.menuTextGroup}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.typeName}>{item.type}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteFunc(item._id)}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const menusToDisplay = [...menus].reverse();

  const fetchMenu = async () => {
    try {
      setLoading(true);
      let search = "";
      if (searchName && searchType)
        search = `type=${searchType}&name=${searchName}`;

      if (searchType) search = `type=${searchType}`;

      if (searchName) search = `name=${searchName}`;

      if (searchName) {
        const response = await api.get(`/curry?${search}`);
        setMenus(response.data);
      } else {
        const response = await api.get("/curry");
        setMenus(response.data);
      }
      const response = await api.get(
        `/curry?type=${searchType}&name=${searchName}`
      );
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const typeOptions = ["meal", "vegetable"];

  const searchTypeOptions = [
    { key: "", value: "All" },
    ...typeOptions.map((type) => ({ key: type, value: type })),
  ];

  const handleDelete = async () => {
    try {
      await api.delete(`/curry/${selectedId}`);
      fetchMenu();
    } catch (error) {
      console.error("Error deleting menu:", error);
    } finally {
      setSelectedId("");
      setConfirmModal(false);
    }
  };

  const deleteFunc = (id: string) => {
    setSelectedId(id);
    setConfirmModal(true);
  };

  const onSearch = () => {
    fetchMenu();
  };

  useEffect(() => {
    fetchMenu();
  }, [searchType]);

  const handleAdd = () => {
    setFormData({ name: "", type: "" });
    setError({ name: "", type: "" });
    setModalVisible(true);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.radioGroup}>
          {searchTypeOptions.map((option) => {
            const isSelected = searchType === option.key;

            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.radioButton]}
                onPress={() => setSearchType(option.key)}
              >
                <View style={styles.circleWrapper}>
                  <View
                    style={[styles.circle, isSelected && styles.circleSelected]}
                  />
                </View>
                <Text style={[styles.radioLabel]}>{option.value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchName}
            placeholder="Name"
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
            data={menusToDisplay}
            keyExtractor={(item) => item._id}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.menuList}
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
            <>
              <View style={styles.radioGroup}>
                {typeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioButton}
                    onPress={() => setFormData({ ...formData, type: option })}
                  >
                    <View style={styles.radioOuter}>
                      {formData.type === option && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.errorText}>{error.type}</Text>
              <TextInput
                style={styles.input}
                placeholder="Curry Name"
                value={formData.name}
                onChangeText={(value) =>
                  setFormData({ ...formData, name: value })
                }
              />
              <Text style={styles.errorText}>{error.name}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.halfButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.halfButton,
                    styles.addButton,
                    adding && styles.disabledButton,
                  ]}
                  onPress={handleAddMenu}
                  disabled={adding}
                >
                  <Text style={styles.addButtonText}>
                    {adding ? "Adding..." : "Add Curry"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
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
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  addNewButton: {
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.primary,
  },
  input: {
    height: 50,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: Fonts.size.text,
    marginTop: 15,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 7,
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: 30,
    marginTop: 15,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: Fonts.size.button,
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
  radioGroup: {
    flexDirection: "row",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioOuter: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#555",
  },
  radioLabel: {
    fontSize: Fonts.size.text,
  },
  errorText: {
    color: Colors.danger,
    width: "100%",
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  menuTextGroup: {
    flexDirection: "column",
  },
  deleteIcon: {
    fontSize: 18,
    color: Colors.danger,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F2937",
    height: 50,
  },
  iconWrapper: {
    paddingLeft: 10,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10, // If your React Native version doesn’t support gap, use marginRight on the first button
    marginTop: 15,
  },
  halfButton: {
    flex: 1,
    paddingVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: 30,
    marginTop: 15,
  },
  cancelButtonText: {
    fontSize: Fonts.size.button,
    color: Colors.primary,
  },
  circleWrapper: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  circleSelected: {
    backgroundColor: "#6B7280",
  },
});
