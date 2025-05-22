import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors, Fonts } from "../../constants/theme";
import { useState, useEffect } from "react";
import api from "../../api/axios";

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  isLoading: boolean;
  handleRegenerate: (id: string) => void;
  selectedMenu: MealPlan | null;
}

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

export default function ChooseMealBox({
  modalVisible,
  setModalVisible,
  isLoading,
  handleRegenerate,
  selectedMenu,
}: Props) {
  const handleSubmit = async () => {
    const response = await api.post("/menu", {
      meal: selectedMealId,
      vegetable: selectedVegeId,
    });
    if (response.data._id) {
      handleRegenerate(response.data._id);
    }
  };
  const [loading, setLoading] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [selectedMealId, setSelectedMealId] = useState("");
  const [selectedVegeId, setSelectedVegeId] = useState("");
  const [mealList, setMealList] = useState<Curry[]>([]);
  const [vegeList, setVegeList] = useState<Curry[]>([]);

  const fetchMeal = async () => {
    try {
      setLoading(true);
      const response = await api.get("/curry?type=meal");
      setMealList(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVegetable = async () => {
    try {
      setLoading(true);
      const response = await api.get("/curry?type=vegetable");
      setVegeList(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
    fetchVegetable();
    if (selectedMenu && selectedMenu?.menus && selectedMenu?.menus.length > 0) {
      setUpdateId(selectedMenu.menus[0]._id);
      setSelectedMealId(selectedMenu.menus[0].meal._id);
      setSelectedVegeId(selectedMenu.menus[0].vegetable._id);
    }
  }, [selectedMenu]);

  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Menu</Text>
          <Text>Choose Meal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMealId}
              onValueChange={(itemValue: string) =>
                setSelectedMealId(itemValue)
              }
              style={styles.picker}
              dropdownIconColor={Colors.primary}
            >
              {mealList.map(
                (item: Curry) =>
                  item._id &&
                  item.name && (
                    <Picker.Item
                      key={`${item._id}`}
                      label={`🍛 ${item?.name}`}
                      value={item._id}
                    />
                  )
              )}
            </Picker>
          </View>

          <Text>Choose Vegetable</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVegeId}
              onValueChange={(itemValue: string) =>
                setSelectedVegeId(itemValue)
              }
              style={styles.picker}
              dropdownIconColor={Colors.primary}
            >
              {vegeList.map(
                (item: Curry) =>
                  item._id &&
                  item.name && (
                    <Picker.Item
                      key={`${item._id}`}
                      label={`🥬 ${item?.name}`}
                      value={item._id}
                    />
                  )
              )}
            </Picker>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color={Colors.primary}
            />
            {isLoading ? (
              <Button
                color={Colors.primary}
                title="Loading..."
                onPress={() => setModalVisible(false)}
              />
            ) : (
              <Button
                title="Save"
                color={Colors.primary}
                onPress={() => handleSubmit()}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: Fonts.size.title,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "#f0f4ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    marginVertical: 10,
  },
  picker: {
    color: "#333",
    fontSize: 16,
    paddingHorizontal: 10,
    height: 60,
  },
  button: {
    marginTop: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
});
