import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CategoriaUIMovimiento } from "../../../../types/general";
import { styles } from "./ConceptoPicker.styles";

type CategoriasAgrupadas = {
  group: string;
  categorias: CategoriaUIMovimiento[];
}[];

const emptyPickerItemValue = (
  <Picker.Item
    enabled={false}
    label="Elige un concepto"
    value={null}
    key="empty-value"
    style={styles.placeholder}
  />
);

const agruparCategoriasPorNombre = (
  categorias: CategoriaUIMovimiento[]
): CategoriasAgrupadas => {
  const categoriasAgrupadas: CategoriasAgrupadas = [];

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
  categoriasAgrupadas: CategoriasAgrupadas
) => {
  const items: React.ReactNode[] = [emptyPickerItemValue];

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
  const [categoriasAgrupadas, setCategoriasAgrupadas] =
    useState<CategoriasAgrupadas>([]);

  useEffect(() => {
    setSelectedValue(conceptoInicial || null);
  }, [conceptoInicial]);

  useEffect(() => {
    const groupedCategorias = agruparCategoriasPorNombre(categoriasDeMovimiento)
      .map((group) => ({
        ...group,
        categorias: group.categorias.filter((categoria) =>
          categoria.nombre.toLowerCase().includes(filterText.toLowerCase())
        ),
      }))
      .filter((group) => group.categorias.length > 0)
      .sort((a, b) => a.group.localeCompare(b.group));

    if (
      groupedCategorias.length === 1 &&
      groupedCategorias[0].categorias.length === 1
    ) {
      handleValueChange(groupedCategorias[0].categorias[0]);
    } else {
      setSelectedValue(null);
    }

    setCategoriasAgrupadas(groupedCategorias);
  }, [categoriasDeMovimiento, filterText]);

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
