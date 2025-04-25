import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  AgendaTomiDia,
  EventoSuenio,
  TipoEventoSuenio,
} from "@/lib/types/general";
import { styles } from "./FilaDia.styles";
import BarraSuenio from "../BarraSuenio/BarraSuenio";
import { minutesToTimeString, timeStringToMinutes } from "@/lib/helpers";

export interface ResultSegment {
  tipo: TipoEventoSuenio;
  start: number;
  end: number;
  hora: string;
  duracion?: string;
}

const transformSegments = (
  segments: EventoSuenio[],
  estadoSuenioPrevio: TipoEventoSuenio
): ResultSegment[] => {
  if (segments.length === 0) return [];

  let start = 0;
  const result: ResultSegment[] = [];

  segments.forEach((segment, index) => {
    const end = timeStringToMinutes(segment.hora);
    result.push({
      tipo: index === 0 ? estadoSuenioPrevio : segments[index - 1].tipo,
      start,
      end,
      hora: segment.hora.slice(0, 5),
    });
    start = end;
  });

  // Add the last segment
  result.push({
    tipo: segments[segments.length - 1].tipo,
    start,
    end: timeStringToMinutes("23:59:59") + 1,
    hora: segments[segments.length - 1].hora.slice(0, 5),
  });
  // Calculate duration
  result.forEach((segment) => {
    const durationMinutes = segment.end - segment.start;
    segment.duracion = minutesToTimeString(durationMinutes);
  });

  return result;
};

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

  const segmentos = transformSegments(dia.eventos, estadoPrevioSuenio);

  const getDescripcionSegmento = (segmento: ResultSegment) => {
    const eventoType = segmento.tipo === "Despierto" ? "Duerme" : "Despierta";
    return `${eventoType} - hora: ${segmento.hora}`;
  };

  // Method to calculate total minutes for a specific tipo
  const getTotalMinutesByTipo = (tipo: TipoEventoSuenio): number => {
    return segmentos
      .filter((segmento) => segmento.tipo === tipo)
      .reduce((total, segmento) => total + (segmento.end - segmento.start), 0);
  };

  const totalDespierto = getTotalMinutesByTipo("Despierto");
  const totalDormido = getTotalMinutesByTipo("Dormido");

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
          <BarraSuenio key={dia.id} segmentos={segmentos} />
        </Text>
      </TouchableOpacity>
      {expandedRow && (
        <View style={styles.expandedRow}>
          {/* Bullet List for Segmentos */}
          {segmentos.map((segmento, index) =>
            index != segmentos.length - 1 ? (
              <Text key={index} style={styles.bulletItem}>
                • {getDescripcionSegmento(segmento)}
              </Text>
            ) : null
          )}

          {/* Dia Comentarios */}
          {dia.comentarios ? (
            <Text style={styles.comentarios}>
              Comentarios: {dia.comentarios}
            </Text>
          ) : null}

          {/* Total Minutes */}
          <Text style={styles.totalMinutes}>
            Total Despierto: {minutesToTimeString(totalDespierto)}
          </Text>
          <Text style={styles.totalMinutes}>
            Total Dormido: {minutesToTimeString(totalDormido)}
          </Text>
        </View>
      )}
    </>
  );
};
