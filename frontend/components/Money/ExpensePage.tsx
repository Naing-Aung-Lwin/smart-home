import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import ConfirmModalBox from "../common/ConfirmModalBox";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import commonMixin from "../../composable/common";
interface Category {
  _id: string;
  name: string;
}
interface Expense {
  _id: string;
  date: string;
  categoryId: Category;
  categoryType: string;
  amount: number;
  budgetId: string;
}

interface Budget {
  _id: string;
  month: string;
  totalIncome: number;
  totalExpense: number;
}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [
  new Date().getFullYear() - 2,
  new Date().getFullYear() - 1,
  new Date().getFullYear(),
];

const ExpensePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [budgets, setBudgets] = useState<Budget>({
    _id: "",
    month: "",
    totalIncome: 0,
    totalExpense: 0,
  });
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const getMonthNumber = (monthName: string): string => {
    const monthIndex = months.findIndex(
      (month) => month.toLowerCase() === monthName.toLowerCase()
    );
    return monthIndex + 1 < 10 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;
  };

  const { formatDate } = commonMixin();

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth, selectedYear]);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const formattedDate = `${selectedYear}-${getMonthNumber(selectedMonth)}`;
      const response = await api.get(`/budget?month=${formattedDate}`);
      if (response.data && response.data.length > 0) {
        setBudgets(response.data[0]);
      } else {
        setExpenses([]);
        setTotalExpense(0);
      }
    } catch (error) {
      console.error("Failed to fetch budget", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (budgets._id) fetchExpenses();
  }, [budgets]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/cash-flows?categoryType=ExpenseCategory&budgetId=${budgets._id}`
      );
      setExpenses(response.data);
      setTotalExpense(
        response.data.reduce(
          (total: number, income: Expense) => total + income.amount,
          0
        )
      );
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  const handleAddExpense = async () => {
    if (!reason || !amount) return;

    setLoading(true);
    const payload = {
      category: reason,
      categoryType: "ExpenseCategory",
      amount: Number(amount),
      date: date.toISOString(),
    };
    try {
      const response = await api.post("/cash-flows", payload);

      if (response) {
        setAmount("");
        setReason("");
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
    setModalVisible(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/cash-flows/${selectedId}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting menu:", error);
    } finally {
      setSelectedId("");
      setConfirmModal(false);
      setLoading(false);
    }
  };

  const deleteFunc = (id: string) => {
    setSelectedId(id);
    setConfirmModal(true);
  };

  const handleAdd = () => {
    setSelectedId("");
    setAmount("");
    setReason("");
    setModalVisible(true);
  };

  const handleUpdateExpense = async () => {
    if (!reason || !amount) return;

    setLoading(true);
    const payload = {
      category: reason,
      categoryType: "ExpenseCategory",
      amount: Number(amount),
      date: date.toISOString(),
    };
    try {
      const response = await api.put(`/cash-flows/${selectedId}`, payload);
      if (response) {
        setAmount("");
        setReason("");
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
    setModalVisible(false);
    setLoading(false);
  };

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

  const updateFunc = (data: Expense) => {
    setAmount(data.amount.toString());
    setReason(data.categoryId.name);
    setSelectedId(data._id);
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.filterContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>Month</Text>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          >
            {months.map((month) => (
              <Picker.Item label={month} value={month} key={month} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>Year</Text>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
          >
            {years.map((year) => (
              <Picker.Item label={year.toString()} value={year} key={year} />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <View style={styles.summary}>
            <Text style={[styles.summaryText, { color: "red" }]}>
              Total: {totalExpense} MMK
            </Text>

            <TouchableOpacity
              style={[styles.actionButton, styles.addNewButton]}
              onPress={handleAdd}
            >
              <Text style={styles.buttonText}>Add New</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={expenses}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                  <Text style={[styles.summaryText, { color: "red" }]}>
                    -{item.amount} MMK
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.expenseReason}>
                      {item?.categoryId?.name}
                    </Text>
                    <Text style={styles.expenseDate}>
                      {formatDate(new Date(item.date))}
                    </Text>
                  </View>
                </View>
                <View style={styles.expenseActions}>
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
            <View style={styles.card}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Amount"
                keyboardType="numeric"
                inputMode="numeric"
                style={styles.input}
                placeholderTextColor={Colors.black}
              />
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Reason"
                style={styles.input}
                placeholderTextColor={Colors.black}
              />

              <TouchableOpacity
                style={[styles.input, { justifyContent: "center" }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: "#1F2937" }}>
                  {date ? date.toLocaleString() : "Select Date"}
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

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.halfButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.halfButton, styles.addButton]}
                  onPress={selectedId ? handleUpdateExpense : handleAddExpense}
                >
                  <Text style={styles.addButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  expenseReason: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "500",
    color: "#1F2937",
  },
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
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  expenseInfo: {
    width: "70%",
  },
  expenseActions: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseDescription: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "500",
    color: "#1F2937",
  },
  expenseDate: {
    fontSize: Fonts.size.text,
    color: "#6B7280",
  },
  expenseAmount: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "600",
    color: Colors.primary,
    alignSelf: "center",
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
});

export default ExpensePage;
