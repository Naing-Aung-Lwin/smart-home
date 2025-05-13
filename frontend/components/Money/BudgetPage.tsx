import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import api from "../../api/axios";

interface Budget {
  _id: string;
  month: string;
  totalIncome: number;
  totalExpense: number;
}

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget>({
    _id: "",
    month: "",
    totalIncome: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    const response = await api.get("/budget");
    if (response.data && response.data.length > 0) {
      setBudgets(response.data[0]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Total Income</Text>
        <Text style={[styles.amount, { color: "#16A34A" }]}>
          + {budgets.totalIncome} MMK
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Expenses</Text>
        <Text style={[styles.amount, { color: "#DC2626" }]}>
          - {budgets.totalExpense} MMK
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Remaining Balance</Text>
        <Text
          style={[
            styles.amount,
            {
              color:
                budgets.totalIncome - budgets.totalExpense >= 0
                  ? "#0F766E"
                  : "#DC2626",
            },
          ]}
        >
          {budgets.totalIncome - budgets.totalExpense >= 0 ? "+ " : "- "}
          {Math.abs(budgets.totalIncome - budgets.totalExpense)} MMK
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: "#F7F8FA",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
  },
  label: {
    fontSize: Fonts.size.text,
    color: "#6B7280",
    marginBottom: 4,
  },
  amount: {
    fontSize: Fonts.size.subTitle,
    fontWeight: "bold",
  },
});

export default BudgetPage;
