import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { AgendaTomiDia } from "@/lib/types/general";
import { styles } from "./FilaDia.styles";

interface FilaDiaProps {
  dia: AgendaTomiDia;
  onEditDia: (dia: AgendaTomiDia) => void;
}

export const FilaDia: React.FC<FilaDiaProps> = ({ dia }) => {
  const [expandedRow, setExpandedRow] = useState(false);

  const handleRowPress = () => {
    setExpandedRow((prev) => !prev);
  };

  const getDiaDescripcion = (dia: AgendaTomiDia): string => {
    const descripcion = dia.eventos.map(
      (evento) => `${evento.tipo} - ${evento.hora}`
    );
    return descripcion.join(", ");
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => handleRowPress()}
        style={[styles.tableRow]}
      >
        <Text style={[styles.tableCell, styles.columnDia]}>
          {new Date(dia.fecha).getDate()}
        </Text>
        <Text style={[styles.tableCell, styles.columnConcepto]}>
          {getDiaDescripcion(dia)}
        </Text>
      </TouchableOpacity>
    </>
  );
};
