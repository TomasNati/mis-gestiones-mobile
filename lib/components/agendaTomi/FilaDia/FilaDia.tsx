import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { AgendaTomiDia, TipoEventoSuenio } from "@/lib/types/general";
import { styles } from "./FilaDia.styles";
import BarraSuenio from "../BarraSuenio/BarraSuenio";

interface FilaDiaProps {
  dia: AgendaTomiDia;
  onEditDia: (dia: AgendaTomiDia) => void;
  estadoPrevioSuenio: TipoEventoSuenio;
}

export const FilaDia: React.FC<FilaDiaProps> = ({
  dia,
  estadoPrevioSuenio,
}) => {
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
          {new Date(dia.fecha).getUTCDate()}
        </Text>
        <Text style={[styles.tableCell, styles.columnConcepto]}>
          <BarraSuenio
            key={dia.id}
            data={dia.eventos}
            estadoSuenioPrevio={estadoPrevioSuenio}
          />
        </Text>
      </TouchableOpacity>
    </>
  );
};
