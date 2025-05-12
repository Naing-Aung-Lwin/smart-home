import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";

type Menu = {
  _id: string;
  name: string;
  type: string;
};

export default function MenuPage() {
  const [loading, setLoading] = useState(false);
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
  const [viewAll, setViewAll] = useState(false);

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
    <View style={styles.menuItem}>
      <Text style={styles.menuName}>{item.name}</Text>
    </View>
  );

  const menusToDisplay = viewAll ? menus : menus.slice(-4);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await api.get("/curry");
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>🍽️ Create Your Menu</Text>

        {!viewAll && (
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
              placeholder="Menu Name"
              value={formData.name}
              onChangeText={(value) =>
                setFormData({ ...formData, name: value })
              }
            />
            <Text style={styles.errorText}>{error.name}</Text>

            <TouchableOpacity
              style={[styles.addButton, adding && styles.disabledButton]}
              onPress={handleAddMenu}
              disabled={adding}
            >
              <Text style={styles.addButtonText}>
                {adding ? "Adding..." : "Add Menu"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.menuHeader}>
          <Text style={styles.menusTitle}>All Menus</Text>
          {!viewAll ? (
            <TouchableOpacity onPress={() => setViewAll(true)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setViewAll(false)}>
              <Text style={styles.viewAllText}>Back</Text>
            </TouchableOpacity>
          )}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.primary,
  },
  input: {
    height: 35,
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
    borderRadius: 10,
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
});
