import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors, Fonts } from "../constants/theme";

type Menu = {
  id: string;
  name: string;
  description: string;
  ingredients: string;
};

export default function CreateMenuScreen() {
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: "1",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
    {
      id: "2",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
    {
      id: "3",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
    {
      id: "4",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
    {
      id: "5",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
    {
      id: "6",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
    {
      id: "7",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
    {
      id: "8",
      name: "Pasta Carbonara",
      description: "A classic Italian dish with bacon, eggs, and cheese.",
      ingredients: "Pasta, bacon, eggs, cheese",
    },
  ]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [viewAll, setViewAll] = useState(false);

  const handleAddMenu = () => {
    if (!name || !description || !ingredients) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const newMenu: Menu = {
      id: Math.random().toString(),
      name,
      description,
      ingredients,
    };

    setMenus((prevMenus) => [...prevMenus, newMenu]);
    setName("");
    setDescription("");
    setIngredients("");
  };

  const renderMenuItem = ({ item }: { item: Menu }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuName}>{item.name}</Text>
      <Text style={styles.menuDescription}>{item.description}</Text>
      <Text style={styles.menuIngredients}>
        Ingredients: {item.ingredients}
      </Text>
    </View>
  );

  const menusToDisplay = viewAll ? menus : menus.slice(-2);

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
            <TextInput
              style={styles.input}
              placeholder="Menu Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Menu Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingredients (comma separated)"
              value={ingredients}
              onChangeText={setIngredients}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddMenu}>
              <Text style={styles.addButtonText}> Add Menu</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.menuHeader}>
          <Text style={styles.menusTitle}>All Menus</Text>
          {!viewAll && menus.length > 2 ? (
            <TouchableOpacity onPress={() => setViewAll(true)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setViewAll(false)}>
              <Text style={styles.viewAllText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={menusToDisplay}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.menuList}
        />
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
  title: {
    fontSize: Fonts.size.header,
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
    marginBottom: 15,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 7,
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 30,
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
  menuDescription: {
    fontSize: Fonts.size.text,
    color: Colors.primary,
    marginVertical: 4,
  },
  menuIngredients: {
    fontSize: Fonts.size.text,
    color: Colors.primary,
  },
});
