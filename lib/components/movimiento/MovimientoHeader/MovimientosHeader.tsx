import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import YearMonthPicker from "@/lib/components/YearMonthPicker";
import { styles } from "./MovimientoHeader.styles";

interface MovimientosHeaderProps {
  onYearMonthChanged: (year: number, month: number) => void;
  onAddMovimiento: () => void;
  onSaveUnsavedMovimientos: () => void;
  onDiscardUnsavedMovimientos: () => void;
  amountUnsavedMovimientos?: number;
}

export const MovimientosHeader: React.FC<MovimientosHeaderProps> = ({
  onYearMonthChanged,
  onAddMovimiento,
  onSaveUnsavedMovimientos,
  onDiscardUnsavedMovimientos,
  amountUnsavedMovimientos,
}) => {
  const hasUnsavedMovimientos =
    amountUnsavedMovimientos && amountUnsavedMovimientos > 0;

  return (
    <View style={styles.header}>
      <YearMonthPicker onChange={onYearMonthChanged} />
      <View style={styles.buttonContainer}>
        {/* Discard Button */}
        {hasUnsavedMovimientos ? (
          <TouchableOpacity
            style={styles.discardButton}
            onPress={onDiscardUnsavedMovimientos}
          >
            <MaterialIcons name="undo" size={18} color="#fff" />
          </TouchableOpacity>
        ) : null}

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            !hasUnsavedMovimientos && styles.disabledButton, // Disable styling if no unsaved movimientos
          ]}
          onPress={onSaveUnsavedMovimientos}
          disabled={!hasUnsavedMovimientos} // Disable button if no unsaved movimientos
        >
          {hasUnsavedMovimientos ? (
            <Text style={styles.saveButtonText}>
              ({amountUnsavedMovimientos})
            </Text>
          ) : null}
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
