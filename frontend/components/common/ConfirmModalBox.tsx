import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts } from "../../constants/theme";

interface Props {
  isLoading: boolean;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  handleSubmit: () => void;
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

export default function ConfirmModalBox({
  isLoading,
  isModalVisible,
  setIsModalVisible,
  handleSubmit,
}: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Are you sure you want to confirm?
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.regenerateButton}
            >
              {isLoading ? (
                <Text style={styles.buttonText}>Loading...</Text> // Loading spinner text while regenerating
              ) : (
                <Text style={styles.buttonText}>Yes, Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: Fonts.size.title,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  cancelButton: {
    padding: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
  },
  regenerateButton: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  iconText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
