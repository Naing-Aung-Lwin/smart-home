import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors, Fonts } from "../constants/theme";

// --- Define the menu item type ---
type MenuItem = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// --- Define your navigation type ---
type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
};

type HomePageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomePageNavigationProp;
};

// --- Menu Data ---
const menus: MenuItem[] = [
  { id: "1", name: "Menu", icon: "fast-food-outline" },
  { id: "2", name: "Money", icon: "cash-outline" },
];

// --- Component ---
const HomePage: React.FC<Props> = ({ navigation }) => {
  const handleMenuPress = (name: string) => {
    navigation.navigate(name);
  };

  const renderItem: ListRenderItem<MenuItem> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleMenuPress(item.name)}
      style={styles.card}
    >
      <Ionicons name={item.icon} size={40} color={Colors.primary} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Home</Text>
      <FlatList
        data={menus}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
      />
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 100,
  },
  title: {
    fontSize: Fonts.size.title,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  grid: {
    justifyContent: "center",
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    elevation: 4,
  },
  cardText: {
    marginTop: 12,
    fontSize: Fonts.size.text,
    color: Colors.primary,
    fontWeight: "600",
  },
});

export default HomePage;
