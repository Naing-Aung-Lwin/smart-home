import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors, Fonts } from "../../constants/theme";

const BudgetPage: React.FC = () => {
  const [totalIncome, setTotalIncome] = useState<number>(3000); // Example income
  const [totalExpense, setTotalExpense] = useState<number>(1200); // Example expense

  const remainingBalance = totalIncome - totalExpense;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Total Income</Text>
        <Text style={[styles.amount, { color: "#16A34A" }]}>
          + {totalIncome} MMK
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Expenses</Text>
        <Text style={[styles.amount, { color: "#DC2626" }]}>
          - {totalExpense} MMK
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Remaining Balance</Text>
        <Text
          style={[
            styles.amount,
            { color: remainingBalance >= 0 ? "#0F766E" : "#DC2626" },
          ]}
        >
          {remainingBalance >= 0 ? "+ " : "- "}
          {Math.abs(remainingBalance)} MMK
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
