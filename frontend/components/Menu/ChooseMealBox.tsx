import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors, Fonts } from "../../constants/theme";
import { useState } from "react";

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  isLoading: boolean;
  menus: Menu[];
  handleRegenerate: (id: string) => void;
}
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

export default function ChooseMealBox({
  modalVisible,
  setModalVisible,
  isLoading,
  menus,
  handleRegenerate,
}: Props) {
  const handleSubmit = () => {
    handleRegenerate(selectedMenuId);
  };
  const [selectedMenuId, setSelectedMenuId] = useState("");

  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Menu</Text>

          <Text>Choose Meal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMenuId}
              onValueChange={(itemValue: string) =>
                setSelectedMenuId(itemValue)
              }
              style={styles.picker}
              dropdownIconColor={Colors.primary}
            >
              {menus.map(
                (item: Menu) =>
                  item._id &&
                  item.meal &&
                  item.vegetable && (
                    <Picker.Item
                      key={`${item._id}`}
                      label={`🍛 ${item?.meal?.name} + 🥬 ${item?.vegetable?.name}`}
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
