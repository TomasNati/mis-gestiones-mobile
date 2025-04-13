import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import YearMonthPicker from "@/lib/components/YearMonthPicker";

interface MovimientosHeaderProps {
  onYearMonthChanged: (year: number, month: number) => void;
  onAddMovimiento: () => void;
  onSaveUnsavedMovimientos: () => void;
  amountUnsavedMovimientos?: number;
}

export const MovimientosHeader: React.FC<MovimientosHeaderProps> = ({
  onYearMonthChanged,
  onAddMovimiento,
  onSaveUnsavedMovimientos,
  amountUnsavedMovimientos,
}) => {
  const hasUnsavedMovimientos =
    amountUnsavedMovimientos && amountUnsavedMovimientos > 0;

  return (
    <View style={styles.header}>
      <YearMonthPicker onChange={onYearMonthChanged} />
      <View style={styles.buttonContainer}>
        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            !hasUnsavedMovimientos && styles.disabledButton, // Disable styling if no unsaved movimientos
          ]}
          onPress={onSaveUnsavedMovimientos}
          disabled={!hasUnsavedMovimientos} // Disable button if no unsaved movimientos
        >
          {hasUnsavedMovimientos && (
            <Text style={styles.saveButtonText}>
              ({amountUnsavedMovimientos})
            </Text>
          )}
          <MaterialIcons
            name="save"
            size={18}
            color={hasUnsavedMovimientos ? "#fff" : "#aaa"} // Gray icon if disabled
          />
        </TouchableOpacity>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButtonBackground}
          onPress={onAddMovimiento}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space between YearMonthPicker and buttons
    marginBottom: 16,
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: "row", // Arrange buttons in a row
    alignItems: "center", // Center buttons vertically
  },
  saveButton: {
    flexDirection: "row", // Arrange text and icon in a row
    alignItems: "center", // Center text and icon vertically
    backgroundColor: "#28a745", // Green background for the Save button
    borderRadius: 50, // Make it circular
    paddingHorizontal: 12, // Add horizontal padding
    paddingVertical: 8, // Add vertical padding
    marginRight: 8, // Add spacing between Save and Add buttons
  },
  saveButtonText: {
    color: "#fff", // White text color
    fontSize: 14,
    marginRight: 4, // Add spacing between text and icon
  },
  disabledButton: {
    backgroundColor: "#ccc", // Gray background for disabled button
  },
  addButtonBackground: {
    backgroundColor: "#007BFF", // Blue background for the Add button
    borderRadius: 50, // Make it circular
    padding: 12, // Add padding around the icon
    alignItems: "center", // Center the icon
    justifyContent: "center", // Center the icon
  },
});
