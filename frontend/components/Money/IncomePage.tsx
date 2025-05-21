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
  Platform,
  Modal,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import ConfirmModalBox from "../common/ConfirmModalBox";

interface Category {
  _id: string;
  name: string;
}
interface Income {
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

const IncomePage: React.FC = () => {
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
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  const fetchIncomes = async () => {
    setLoading(true);
    const response = await api.get(
      `/cash-flows?categoryType=IncomeSource&budgetId=${budgets._id}`
    );
    setIncomes(response.data);
    setTotalIncome(
      response.data.reduce(
        (total: number, income: Income) => total + income.amount,
        0
      )
    );
    setLoading(false);
  };

  const handleAddIncome = async () => {
    if (!description || !amount) return;

    if (budgets._id) {
      setLoading(true);
      const payload = {
        category: description,
        categoryType: "IncomeSource",
        amount: Number(amount),
        date: new Date(Date.now()).toISOString().split("T")[0],
        budgetId: budgets._id || "",
      };
      const response = await api.post("/cash-flows", payload);

      if (response) {
        setAmount("");
        setDescription("");
        fetchIncomes();
      }
      setModalVisible(false);
      setLoading(false);
    }
  };

  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" }); // e.g., "May"
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const getMonthNumber = (monthName: string): string => {
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth() + 1; // Jan=0, so add 1
    return monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
  };
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
  const years = [2023, 2024, 2025];

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (budgets._id) fetchIncomes();
  }, [budgets]);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const formattedDate = `${selectedYear}-${getMonthNumber(selectedMonth)}`;
      const response = await api.get(`/budget?month=${formattedDate}`);
      if (response.data && response.data.length > 0) {
        setBudgets(response.data[0]);
      } else {
        const budgetData = await api.post(`/budget`, {
          month: formattedDate,
          totalIncome: 0,
          totalExpense: 0,
        });
        if (budgetData.data && budgetData.data.length > 0) {
          setBudgets(budgetData.data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch budget", error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/cash-flows/${selectedId}`);
      fetchIncomes();
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
    setModalVisible(true);
  };

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      const updatedDate = new Date(date);
      updatedDate.setFullYear(selectedDate.getFullYear());
      updatedDate.setMonth(selectedDate.getMonth());
      updatedDate.setDate(selectedDate.getDate());
      setDate(updatedDate);
    }
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

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total: {totalIncome} MMK</Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.addNewButton]}
          onPress={handleAdd}
        >
          <Text style={styles.buttonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={incomes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.incomeItem}>
            <View>
              <Text style={styles.incomeAmount}>+ {item.amount} MMK</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.incomeDescription}>
                  {item?.categoryId?.name}
                </Text>
                <Text style={styles.incomeDate}>{item.date}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() => deleteFunc(item._id)}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
                style={styles.input}
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                style={styles.input}
              />

              {/* Choose Date Picker  */}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.halfButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.halfButton, styles.addButton]}
                  onPress={handleAddIncome}
                >
                  <Text style={styles.addButtonText}>Add Income</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 5,
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
    fontSize: Fonts.size.text,
    fontWeight: "bold",
    color: Colors.primary,
  },
  listContainer: {
    paddingBottom: 80,
  },
  incomeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  incomeDescription: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "500",
    color: "#1F2937",
  },
  incomeDate: {
    fontSize: Fonts.size.text,
    color: "#6B7280",
  },
  incomeAmount: {
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

export default IncomePage;
