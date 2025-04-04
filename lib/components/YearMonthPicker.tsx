import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface YearMonthPickerProps {
  onChange: (year: number, month: number) => void; // Callback to pass selected year and month
}

export default function YearMonthPicker({ onChange }: YearMonthPickerProps) {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // Months are 0-indexed, so add 1

  // Generate years from 2023 to the current year
  const years = Array.from(
    { length: today.getFullYear() - 2023 + 1 },
    (_, i) => 2023 + i
  );

  // Months in Spanish
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const onYearChange = (year: number) => {
    setSelectedYear(year);
    onChange(year, selectedMonth); // Call the callback with the new year and current month
  };
  const onMonthChange = (month: number) => {
    setSelectedMonth(month);
    onChange(selectedYear, month); // Call the callback with the current year and new month
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedYear}
        onValueChange={onYearChange}
        style={styles.yearPicker}
      >
        {years.map((year) => (
          <Picker.Item key={year} label={year.toString()} value={year} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={onMonthChange}
        style={styles.monthPicker}
      >
        {months.map((month, index) => (
          <Picker.Item key={index} label={month} value={index + 1} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Distribute space evenly
    padding: 16,
    gap: 8,
    backgroundColor: "#fff",
  },
  yearPicker: {
    width: 120, // Fixed width for the year picker
    height: 55,
  },
  monthPicker: {
    flex: 1, // Allow the month picker to take up remaining space
    height: 55,
  },
});
