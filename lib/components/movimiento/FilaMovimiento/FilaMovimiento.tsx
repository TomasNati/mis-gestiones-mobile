import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MovimientoGastoGrilla } from "@/lib/types/general";
import MontoColumn from "@/lib/components/movimiento/MontoColumn";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./FilaMovimiento.styles";

interface FilaMovimientoProps {
  movimiento: MovimientoGastoGrilla;
  getMovimientoDescription: (movimiento: MovimientoGastoGrilla) => string;
  onEditMovimiento: (movimiento: MovimientoGastoGrilla) => void;
  onDeleteMovimiento: (movimiento: MovimientoGastoGrilla) => void;
}

export const FilaMovimiento: React.FC<FilaMovimientoProps> = ({
  movimiento,
  getMovimientoDescription,
  onEditMovimiento,
  onDeleteMovimiento,
}) => {
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
          onPress: () => onDeleteMovimiento(movimiento),
        },
      ]
    );
  };

  const getBorderColor = () => {
    switch (movimiento.state) {
      case "deleted":
        return "#FF3B30";
      case "updated":
        return "#FFCC00";
      case "added":
        return "#4CD964";
      default:
        return "transparent";
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => handleRowPress()}
        style={[
          styles.tableRow,
          expandedRow && styles.tableRowExpanded,
          {
            borderColor: getBorderColor(),
            borderWidth: movimiento.state ? 2 : 0,
          },
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
            <TouchableOpacity
              style={[styles.editButton, styles.editButtonBackground]}
              onPress={() => onEditMovimiento(movimiento)}
            >
              <MaterialIcons name="edit" size={18} color="#fff" />
            </TouchableOpacity>
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
