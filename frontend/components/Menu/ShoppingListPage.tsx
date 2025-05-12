import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import Checkbox from "expo-checkbox";

type Item = {
  id: string;
  name: string;
  category: string;
  checked: boolean;
};

const initialItems: Item[] = [
  { id: "1", name: "Tomatoes", category: "Vegetables", checked: false },
  { id: "2", name: "Onions", category: "Vegetables", checked: false },
  { id: "3", name: "Chicken Breast", category: "Meat", checked: false },
  { id: "4", name: "Milk", category: "Dairy", checked: false },
  { id: "5", name: "Eggs", category: "Dairy", checked: false },
  { id: "6", name: "Rice", category: "Grains", checked: false },
];

export default function ShoppingListScreen() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const toggleCheck = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updated);
  };

  const groupedItems = items.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleShare = () => {
    Alert.alert(
      "🛒 Share List",
      "This would export your list to PDF or share via WhatsApp (coming soon)."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Shopping List</Text>

      <FlatList
        data={Object.keys(groupedItems)}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => (
          <View style={styles.categoryGroup}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {groupedItems[category].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemRow}
                onPress={() => toggleCheck(item.id)}
              >
                <Checkbox
                  value={item.checked}
                  onValueChange={() => toggleCheck(item.id)}
                  style={styles.checkbox}
                />
                <Text
                  style={[styles.itemText, item.checked && styles.checkedText]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: Fonts.size.header, fontWeight: "bold", marginBottom: 20 },
  categoryGroup: { marginBottom: 20 },
  categoryTitle: {
    fontSize: Fonts.size.title,
    fontWeight: "600",
    marginBottom: 10,
  },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { marginRight: 10 },
  itemText: { fontSize: Fonts.size.subTitle },
  checkedText: { textDecorationLine: "line-through", color: "gray" },
});
