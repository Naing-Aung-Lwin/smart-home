import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const BudgetPage: React.FC = () => {
  const [totalIncome, setTotalIncome] = useState<number>(3000); // Example total income for the month
  const [totalExpense, setTotalExpense] = useState<number>(0); // Total expense will be dynamic

  useEffect(() => {
    // Calculate the remaining balance
    const remainingBalance = totalIncome - totalExpense;
    // You can fetch the total expense from the ExpenseList or calculate here.
  }, [totalIncome, totalExpense]);

  const remainingBalance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Current Monthly Budget</Text>
      <Text>Total Income: ${totalIncome}</Text>
      <Text>Total Expenses: ${totalExpense}</Text>
      <Text>Remaining Balance: ${remainingBalance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default BudgetPage;
