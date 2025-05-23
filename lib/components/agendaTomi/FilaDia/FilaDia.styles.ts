import { StyleSheet } from "react-native";
import tomiStyles from "@/app/styles/tomi.styles";

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
    ...tomiStyles.columnDia,
    textTransform: "lowercase",
  },
  columnEventos: {
    ...tomiStyles.columnEventos,
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
  bulletItem: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  totalMinutes: {
    fontSize: 14,
    marginTop: 8,
    color: "#333",
  },
});
