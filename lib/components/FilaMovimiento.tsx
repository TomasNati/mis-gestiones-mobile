import { MovimientoGastoGrilla } from "@/lib/types/general";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MontoColumn from "@/lib/components/MontoColumn";

interface FilaMovimientoProps {
  movimiento: MovimientoGastoGrilla;
  getMovimientoDescription: (movimiento: MovimientoGastoGrilla) => string;
}
export const FilaMovimiento = ({
  movimiento,
  getMovimientoDescription,
}: FilaMovimientoProps) => {
  const [expandedRow, setExpandedRow] = useState(false);

  const handleRowPress = () => {
    setExpandedRow((prev) => !prev);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => handleRowPress()}
        style={styles.tableRow}
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
  },
  comentarios: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
});
