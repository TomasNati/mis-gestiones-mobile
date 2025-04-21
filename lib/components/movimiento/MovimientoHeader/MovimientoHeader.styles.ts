import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  discardButton: {
    backgroundColor: "#FF3B30", // Red background for the Discard button
    borderRadius: 50, // Make it circular
    padding: 12, // Add padding around the icon
    alignItems: "center", // Center the icon
    justifyContent: "center", // Center the icon
    marginRight: 8, // Add spacing between Discard and Save buttons
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
