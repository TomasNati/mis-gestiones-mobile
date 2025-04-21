import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableRowExpanded: {
    backgroundColor: "rgb(185 214 243);",
  },
  tableCell: {
    fontSize: 14,
  },
  columnDia: {
    flex: 1,
  },
  columnConcepto: {
    flex: 5,
  },
  columnMonto: {
    flex: 2.8,
    textAlign: "right",
  },
  expandedRow: {
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "column",
  },
  comentarios: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  editButton: {
    marginRight: 8,
  },
  editButtonBackground: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {},
  deleteButtonBackground: {
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
