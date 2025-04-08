import { MovimientoGastoGrilla } from "@/lib/types/general";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import MontoColumn from "@/lib/components/MontoColumn";
import { MaterialIcons } from "@expo/vector-icons"; // Import Material Icons

interface FilaMovimientoProps {
  movimiento: MovimientoGastoGrilla;
  getMovimientoDescription: (movimiento: MovimientoGastoGrilla) => string;
  onEditMovimiento: (movimiento: MovimientoGastoGrilla) => void; // New prop for editing
  onDeleteMovimiento: (movimiento: MovimientoGastoGrilla) => void; // New prop for deletion
}

export const FilaMovimiento = ({
  movimiento,
  getMovimientoDescription,
  onEditMovimiento,
  onDeleteMovimiento,
}: FilaMovimientoProps) => {
  const [expandedRow, setExpandedRow] = useState(false);

  const handleRowPress = () => {
    setExpandedRow((prev) => !prev);
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este movimiento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDeleteMovimiento(movimiento), // Call the delete prop
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => handleRowPress()}
        style={[
          styles.tableRow,
          expandedRow && styles.tableRowExpanded, // Apply expanded style if expandedRow is true
        ]}
      >
        <Text style={[styles.tableCell, styles.columnDia]}>
          {new Date(movimiento.fecha).getDate()}
        </Text>
        <Text style={[styles.tableCell, styles.columnConcepto]}>
          {getMovimientoDescription(movimiento)}
        </Text>
        <View style={[styles.columnMonto]}>
          <MontoColumn movimiento={movimiento} />
        </View>
      </TouchableOpacity>
      {expandedRow && (
        <View style={styles.expandedRow}>
          <Text>{`${movimiento.categoria} - ${movimiento.tipoDeGasto}`}</Text>
          <Text style={styles.comentarios}>{movimiento.comentarios}</Text>
          <View style={styles.actionButtons}>
            {/* Edit Button */}
            <TouchableOpacity
              style={[styles.editButton, styles.editButtonBackground]}
              onPress={() => onEditMovimiento(movimiento)}
            >
              <MaterialIcons name="edit" size={18} color="#fff" />
            </TouchableOpacity>
            {/* Delete Button */}
            <TouchableOpacity
              style={[styles.deleteButton, styles.deleteButtonBackground]}
              onPress={handleDeletePress}
            >
              <MaterialIcons name="delete" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableRowExpanded: {
    backgroundColor: "rgb(185 214 243);", // Highlighted background color when expanded
  },
  tableCell: {
    fontSize: 14,
  },
  columnDia: {
    flex: 1, // Adjust width for category column
  },
  columnConcepto: {
    flex: 5, // Adjust width for concept column
  },
  columnMonto: {
    flex: 2.8, // Adjust width for amount column
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
    flexDirection: "row", // Arrange buttons in a row
    justifyContent: "flex-end", // Align buttons to the right
    marginTop: 8,
  },
  editButton: {
    marginRight: 8, // Add spacing between buttons
  },
  editButtonBackground: {
    backgroundColor: "#007BFF", // Blue background for the edit button
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {},
  deleteButtonBackground: {
    backgroundColor: "#FF3B30", // Red background for the delete button
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
