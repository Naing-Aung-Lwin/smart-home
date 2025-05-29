import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import api from "../../api/axios";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

interface Budget {
  _id: string;
  month: string;
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
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

const BudgetPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<Budget>({
    _id: "",
    month: "",
    totalIncome: 0,
    totalExpense: 0,
  });
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" }); // e.g., "May"
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const getMonthNumber = (monthName: string): string => {
    const monthIndex = months.findIndex(
      (month) => month.toLowerCase() === monthName.toLowerCase()
    );
    return monthIndex + 1 < 10 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;
  };

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth, selectedYear]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBudget();
    }, [])
  );

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const formattedDate = `${selectedYear}-${getMonthNumber(selectedMonth)}`;
      const response = await api.get(`/budget?month=${formattedDate}`);
      if (response.data && response.data.length > 0) {
        setBudgets(response.data[0]);
      } else {
        setBudgets({ _id: "", month: "", totalIncome: 0, totalExpense: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch budget", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Monthly Budget</Text>

      {/* Filter UI */}
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
          {/* Budget Cards */}
          <View style={styles.card}>
            <Text style={styles.label}>Total Income</Text>
            <Text style={[styles.amount, { color: "#16A34A" }]}>
              + {budgets.totalIncome} MMK
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Total Saving</Text>
            <Text style={[styles.amount, { color: "#DC2626" }]}>
              - {budgets.totalSaving} MMK
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
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#F7F8FA",
    flexGrow: 1,
  },
  title: {
    fontSize: Fonts.size.title,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
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
