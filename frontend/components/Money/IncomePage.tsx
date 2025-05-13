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

interface Income {
  id: string;
  date: string;
  description: string;
  amount: number;
}

const IncomePage: React.FC = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  useEffect(() => {
    const total = incomes.reduce((acc, item) => acc + item.amount, 0);
    setTotalIncome(total);
  }, [incomes]);

  const handleAddIncome = () => {
    if (!description || !amount) return;
    const newIncome: Income = {
      id: Math.random().toString(),
      date: new Date().toISOString().split("T")[0],
      description,
      amount: parseFloat(amount),
    };
    setIncomes((prev) => [...prev, newIncome]);
    setDescription("");
    setAmount("");
  };

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
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          style={styles.input}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
          <Text style={styles.addButtonText}>Add Income</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total: {totalIncome} MMK</Text>
      </View>

      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.incomeItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.incomeDescription}>{item.description}</Text>
              <Text style={styles.incomeDate}>{item.date}</Text>
            </View>
            <Text style={styles.incomeAmount}>+ {item.amount} MMK</Text>
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
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
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
    justifyContent: "flex-start",
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
});

export default IncomePage;
