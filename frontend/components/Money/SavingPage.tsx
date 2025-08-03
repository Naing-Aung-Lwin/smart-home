import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import ConfirmModalBox from "../common/ConfirmModalBox";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import commonMixin from "../../composable/common";

interface Saving {
  _id: string;
  amount: number;
  date: string;
  description: string;
  budgetId?: string;
}

interface Budget {
  _id: string;
  month: string;
  totalIncome: number;
  totalSaving: number;
  totalExpense: number;
}

const SavingPage: React.FC = () => {
  const { formatMoney } = commonMixin();

  const [loading, setLoading] = useState(false);

  const [saveFromIncome, setSaveFromIncome] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [selectedId, setSelectedId] = useState<string>("");
  const [saving, setSaving] = useState<Saving[]>([]);
  const [totalSaving, setTotalSaving] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);

  const [budgets, setBudgets] = useState<Budget>({
    _id: "",
    month: "",
    totalIncome: 0,
    totalSaving: 0,
    totalExpense: 0,
  });

  const fetchSaving = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/saving`);
      setSaving(response.data);
      setTotalSaving(
        response.data.reduce(
          (total: number, saving: Saving) => total + saving.amount,
          0
        )
      );
    } catch (error) {
      console.error("Failed to fetch Saving", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setDate(new Date());
        setSaveFromIncome(false);
        setAmount("");
        setDescription("");
      };
    }, [])
  );

  useEffect(() => {
    fetchSaving();
  }, []);

  useEffect(() => {
    fetchBudget();
  }, [saveFromIncome, date]);

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
      setShowTimePicker(true);
    }
  };

  const onTimeChange = (
    event: DateTimePickerEvent,
    selectedTime: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }
    const currentTime = selectedTime || date;
    const finalDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds()
    );
    setDate(finalDate);
    setShowTimePicker(false);
  };

  const handleAdd = () => {
    setSelectedId("");
    setAmount("");
    setDescription("");
    setModalVisible(true);
  };

  const handleAddSaving = async () => {
    if (!description || !amount) return;

    setLoading(true);
    let payload: {
      description: string;
      amount: number;
      date: string;
      budgetId?: string;
    } = {
      description: description,
      amount: Number(amount),
      date: date.toISOString(),
    };
    if (saveFromIncome) {
      if (!budgets || !budgets._id) {
        setLoading(false);
        return;
      }
      const available = calculateAvailableSaving(budgets);
      if (available < Number(amount)) {
        setLoading(false);
        return;
      }
      payload.budgetId = budgets._id;
    }
    try {
      const response = await api.post("/saving", payload);

      if (response) {
        setAmount("");
        setDescription("");
        fetchSaving();
        setSaveFromIncome(false);
      }
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error("Error adding income:", error);
      setLoading(false);
    }
  };

  const handleUpdateSaving = async () => {
    if (!description || !amount) return;
    setLoading(true);
    let payload: {
      description: string;
      amount: number;
      date: string;
      budgetId?: string;
    } = {
      description: description,
      amount: Number(amount),
      date: date.toISOString(),
    };
    if (saveFromIncome) {
      if (!budgets || !budgets._id) {
        setLoading(false);
        return;
      }
      const available = calculateAvailableSaving(budgets);
      if (available < Number(amount)) {
        setLoading(false);
        return;
      }
      payload.budgetId = budgets._id;
    }
    try {
      const response = await api.put(`/saving/${selectedId}`, payload);

      if (response) {
        setAmount("");
        setDescription("");
        setSaveFromIncome(false);
        fetchSaving();
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating income:", error);
    }
    setLoading(false);
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/saving/${selectedId}`);
      fetchSaving();
    } catch (error) {
      console.error("Error deleting menu:", error);
    } finally {
      setSelectedId("");
      setConfirmModal(false);
      setLoading(false);
    }
  };

  const updateFunc = (data: Saving) => {
    setAmount(data.amount.toString());
    setDescription(data.description);
    setSelectedId(data._id);
    setModalVisible(true);
    if (data?.budgetId) {
      setSaveFromIncome(true);
      fetchBudget();
    }
  };

  const deleteFunc = (id: string) => {
    setSelectedId(id);
    setConfirmModal(true);
  };

  const formatDate = (itemDate: string) => {
    const pad = (n: number) => n.toString().padStart(2, "0");

    const date = new Date(itemDate);
    const year = new Date(date).getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
  };

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const formattedDate = new Date(date).toISOString().slice(0, 7);
      const response = await api.get(`/budget?month=${formattedDate}`);
      if (response.data && response.data.length > 0) {
        setBudgets(response.data[0]);
      } else {
        setSaving([]);
        setTotalSaving(0);
        setBudgets({
          _id: "",
          month: "",
          totalIncome: 0,
          totalSaving: 0,
          totalExpense: 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch budget", error);
    }
    setLoading(false);
  };

  const calculateAvailableSaving = (budgets: Budget) => {
    if (!budgets || !budgets.totalIncome) return 0;
    return budgets.totalIncome - budgets.totalSaving - budgets.totalExpense;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Total: {formatMoney(totalSaving)} MMK</Text>

            <TouchableOpacity
              style={[styles.actionButton, styles.addNewButton]}
              onPress={handleAdd}
            >
              <Text style={styles.buttonText}>Add New</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={saving}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.savingItem}>
                <View style={styles.savingInfo}>
                  <Text style={styles.savingAmount}>+{formatMoney(item.amount)} MMK</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.savingDescription}>
                      {item?.description}
                    </Text>
                    {item?.budgetId &&
                    <Text style={styles.savingFromIncome}>
                      (From Income)
                    </Text>
                    }
                    <Text style={styles.savingDate}>
                      {item.date && formatDate(item.date)}
                    </Text>
                  </View>
                </View>
                <View style={styles.savingActions}>
                  <TouchableOpacity onPress={() => updateFunc(item)}>
                    <Text style={styles.deleteIcon}>✏️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteFunc(item._id)}>
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.card}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Amount"
                style={styles.input}
                placeholderTextColor={Colors.black}
                keyboardType="numeric"
                inputMode="numeric"
              />
              {saveFromIncome &&
              budgets &&
              budgets.totalIncome &&
              budgets.totalIncome < Number(amount) ? (
                <Text style={styles.errorText}>
                  Saving is greater than your income
                </Text>
              ) : null}
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                style={styles.input}
                placeholderTextColor={Colors.black}
              />

              <TouchableOpacity
                style={[styles.input, { justifyContent: "center" }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: "#1F2937" }}>
                  {date ? date.toLocaleString() : "Select Date & Time"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}

              <View style={styles.checkboxGroup}>
                <TouchableOpacity
                  style={styles.checkboxButton}
                  onPress={() => setSaveFromIncome(!saveFromIncome)}
                >
                  <View style={styles.checkboxOuter}>
                    <View style={saveFromIncome && styles.checkboxInner} />
                  </View>
                  <Text style={styles.checkboxLabel}>Save From Income</Text>
                </TouchableOpacity>
                {saveFromIncome && (
                  <>
                    <Text style={styles.incomeLabel}>
                      Available for saving: {formatMoney(calculateAvailableSaving(budgets))}{" "}
                      MMK
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.halfButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setSaveFromIncome(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.halfButton, styles.addButton]}
                  onPress={selectedId ? handleUpdateSaving : handleAddSaving}
                >
                  <Text style={styles.addButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModalBox
        isModalVisible={confirmModal}
        setIsModalVisible={setConfirmModal}
        isLoading={loading}
        handleSubmit={handleDelete}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 15,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: Fonts.size.text,
    color: "#6B7280",
    marginBottom: 4,
  },
  picker: {
    height: 55,
    backgroundColor: Colors.white,
    color: Colors.black,
    borderRadius: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    elevation: 4,
  },
  input: {
    backgroundColor: "#F1F5F9",
    color: Colors.black,
    padding: 8,
    marginBottom: 10,
    fontSize: Fonts.size.text,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  summaryText: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "bold",
    color: Colors.primary,
  },
  listContainer: {
    paddingBottom: 80,
  },
  savingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  savingInfo: {
    width: "70%",
  },
  savingActions: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  savingDescription: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "500",
    color: "#1F2937",
  },
  savingFromIncome: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "500",
    color: "#1e53d9ff",
  },
  savingDate: {
    fontSize: Fonts.size.text,
    color: "#6B7280",
  },
  savingAmount: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "600",
    color: Colors.primary,
  },
  deleteIcon: {
    fontSize: 18,
    color: Colors.danger,
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
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  addNewButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: "#fff",
    fontSize: Fonts.size.button,
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

  checkboxGroup: {
    flexDirection: "column",
    gap: 10,
  },
  checkboxButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#555",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  incomeLabel: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  errorText: {
    color: Colors.danger,
  },
});

export default SavingPage;
