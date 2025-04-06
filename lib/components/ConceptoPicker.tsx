import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  CategoriaUIMovimiento,
  CategoriaUIMovimientoGroup,
} from "../types/general";

const agruparCategoriasPorNombre = (
  categorias: CategoriaUIMovimiento[]
): CategoriaUIMovimientoGroup[] => {
  const categoriasAgrupadas: CategoriaUIMovimientoGroup[] = [];

  categorias.forEach((categoria) => {
    const grupoExistente = categoriasAgrupadas.find(
      (grupo) => grupo.group === categoria.categoriaNombre
    );

    if (grupoExistente) {
      grupoExistente.categorias.push(categoria);
    } else {
      categoriasAgrupadas.push({
        group: categoria.categoriaNombre,
        categorias: [categoria],
      });
    }
  });

  return categoriasAgrupadas;
};

const createConceptoPickerItems = (
  categoriasAgrupadas: CategoriaUIMovimientoGroup[]
) => {
  const items: React.ReactNode[] = [];

  categoriasAgrupadas.forEach((group) => {
    items.push(
      <Picker.Item
        key={group.group}
        label={`-------- ${group.group.toUpperCase()} --------`}
        value={null}
        enabled={false} // Disable selection for the header
        style={styles.groupHeader}
      />
    );

    group.categorias.forEach((categoria) => {
      items.push(
        <Picker.Item
          key={categoria.id}
          label={categoria.nombre}
          value={categoria}
        />
      );
    });
  });
  return items;
};

interface ConceptoPickerProps {
  categoriasDeMovimiento: CategoriaUIMovimiento[];
  conceptoInicial?: CategoriaUIMovimiento | null;
  onConceptoModificado: (concepto: CategoriaUIMovimiento) => void;
}

export const ConceptoPicker = ({
  categoriasDeMovimiento,
  conceptoInicial,
  onConceptoModificado,
}: ConceptoPickerProps) => {
  const [selectedValue, setSelectedValue] =
    React.useState<CategoriaUIMovimiento | null>(conceptoInicial || null);
  const [filterText, setFilterText] = useState("");

  const categoriasAgrupadas = agruparCategoriasPorNombre(categoriasDeMovimiento)
    .map((group) => ({
      ...group,
      categorias: group.categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(filterText.toLowerCase())
      ),
    }))
    .filter((group) => group.categorias.length > 0) // Remove empty groups
    .sort((a, b) => a.group.localeCompare(b.group));

  const handleValueChange = (itemValue: CategoriaUIMovimiento) => {
    setSelectedValue(itemValue);
    onConceptoModificado(itemValue);
  };

  return (
    <View style={styles.pickerContainer}>
      {/* Text Filter */}
      <TextInput
        style={styles.filterInput}
        placeholder="Filtrar conceptos..."
        value={filterText}
        onChangeText={setFilterText}
      />
      <Picker
        selectedValue={selectedValue || undefined}
        onValueChange={handleValueChange}
        style={styles.picker}
      >
        {createConceptoPickerItems(categoriasAgrupadas)}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 16,
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
});
