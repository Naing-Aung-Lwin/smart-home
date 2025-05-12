import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";

interface Expense {
  id: string;
  date?: string;
  reason: string;
  amount: number;
}

const ExpensePage: React.FC = () => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [monthlyBudget] = useState<number>(2000); // Set your budget here

  useEffect(() => {
    const total = expenses.reduce((acc, item) => acc + item.amount, 0);
    setTotalExpense(total);
  }, [expenses]);

  const handleAddExpense = () => {
    if (!reason || !amount) return;
    const newExpense = {
      id: Math.random().toString(),
      date: "2025-05-05",
      reason,
      amount: parseFloat(amount),
    };
    setExpenses((prev) => [...prev, newExpense]);
    setDate("");
    setReason("");
    setAmount("");
  };

  const remaining = monthlyBudget - totalExpense;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Amount"
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Reason"
          style={styles.input}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total: {totalExpense} MMK</Text>
        <Text
          style={[
            styles.summaryText,
            { color: remaining < 0 ? "red" : "green" },
          ]}
        >
          Remaining: {remaining} MMK
        </Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.expenseReason}>{item.reason}</Text>
              <Text style={styles.expenseDate}>{item.date}</Text>
            </View>
            <Text style={styles.expenseAmount}>- {item.amount} MMK</Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 8,
    marginBottom: 10,
    fontSize: Fonts.size.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 2,
  },
  expenseReason: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "500",
    color: "#1F2937",
  },
  expenseDate: {
    fontSize: Fonts.size.text,
    color: "#6B7280",
  },
  expenseAmount: {
    fontSize: Fonts.size.text,
    fontWeight: "600",
    color: "#DC2626",
    alignSelf: "center",
  },
});

export default ExpensePage;
