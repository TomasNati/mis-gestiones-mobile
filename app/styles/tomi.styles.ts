import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space between YearMonthPicker and buttons
    marginBottom: 16,
    marginTop: 16,
  },
  tableContainer: {
    flex: 1, // Allow the FlatList to take up remaining space and enable scrolling
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  columnDia: {
    flex: 1,
  },
  columnEventos: {
    flex: 6,
  },
});
