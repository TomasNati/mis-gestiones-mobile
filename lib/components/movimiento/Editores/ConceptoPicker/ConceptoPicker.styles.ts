import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  filterInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  groupHeader: {
    fontWeight: "bold",
    color: "#555",
    textAlign: "center", // Center the text
    paddingVertical: 4, // Add vertical padding
    textTransform: "uppercase", // Optional: Make the text uppercase
  },
  placeholder: {
    color: "#aaa",
    fontStyle: "italic",
  },
});
