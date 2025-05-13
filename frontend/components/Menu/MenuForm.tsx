import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors, Fonts } from "../../constants/theme";
import { useState } from "react";

interface dataForm {
  _id: string;
  meal: string;
  vegetable: string;
}

interface Props {
  error: dataForm;
  formData: dataForm;
  setFormData: (value: dataForm) => void;
  mealCurry: Curry[];
  vegetableCurry: Curry[];
  handleAddMenu: () => void;
  adding: boolean;
  setModalVisible: (visible: boolean) => void;
}
interface Curry {
  _id: string;
  type: string;
  name: string;
}

export default function MenuForm({
  error,
  formData,
  setFormData,
  mealCurry,
  vegetableCurry,
  handleAddMenu,
  adding,
  setModalVisible,
}: Props) {
  return (
    <>
      <Text style={styles.label}>Select Meal</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.meal}
          onValueChange={(itemValue) =>
            setFormData({ ...formData, meal: itemValue })
          }
          style={styles.picker}
        >
          <Picker.Item label="-- Select Meal --" value="" />
          {mealCurry.map((meal) => (
            <Picker.Item key={meal._id} label={meal.name} value={meal._id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.errorText}>{error.meal}</Text>

      <Text style={styles.label}>Select Vegetable</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.vegetable}
          onValueChange={(itemValue) =>
            setFormData({ ...formData, vegetable: itemValue })
          }
          style={styles.picker}
        >
          <Picker.Item label="-- Select Vegetable --" value="" />
          {vegetableCurry.map((veg) => (
            <Picker.Item key={veg._id} label={veg.name} value={veg._id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.errorText}>{error.meal}</Text>

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
            {adding ? "loading..." : "Add Menu"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f0f4ff",
    overflow: "hidden",
  },
  picker: {
    height: 40,
    color: "#333",
    fontSize: Fonts.size.text,
  },
  label: {
    fontSize: Fonts.size.text,
    fontWeight: "600",
    marginBottom: 5,
  },
  errorText: {
    color: Colors.danger,
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10, // If your React Native version doesn’t support gap, use marginRight on the first button
    marginTop: 15,
    marginBottom: 30,
  },

  halfButton: {
    flex: 1,
    paddingVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: Fonts.size.button,
    color: Colors.primary,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: Fonts.size.button,
  },
});
