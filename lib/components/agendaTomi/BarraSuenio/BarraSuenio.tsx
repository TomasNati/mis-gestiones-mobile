import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { minutesToTimeString, timeStringToMinutes } from "@/lib/helpers";
import { TipoEventoSuenio, EventoSuenio } from "@/lib/types/general";
import LinearProgressBar from "../../LinearProgressBar";

interface ResultSegment {
  tipo: TipoEventoSuenio;
  start: number;
  end: number;
  hora: string;
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

  return result;
};

const LinearProgressWithLabel = ({ tipo, start, end, hora }: ResultSegment) => {
  const showLabel = end < 1440;

  let durationLabel = "";
  if (tipo === "Dormido") {
    const durationMinutes = end - start;
    durationLabel = minutesToTimeString(durationMinutes);
  }

  const progressWidth = ((end - start) / 1440) * 100; // Calculate width as a percentage
  const progressStart = (start / 1440) * 100; // Calculate start position as a percentage

  const radius = 5;
  const borders = {
    borderTopLeftRadius: start === 0 ? radius : 0,
    borderBottomLeftRadius: start === 0 ? radius : 0,
    borderTopRightRadius: end === 1440 ? radius : 0,
    borderBottomRightRadius: end === 1440 ? radius : 0,
  };
  return (
    <View style={linearProgressBarWithLabelStyles.container}>
      {/* Progress Bar */}
      <View
        style={[linearProgressBarWithLabelStyles.progressBarContainer, borders]}
      >
        <LinearProgressBar
          progress={progressWidth}
          color={tipo === "Despierto" ? "#4caf50" : "#28749a"}
          textContent={tipo === "Dormido" ? durationLabel : undefined}
        />
      </View>
    </View>
  );
};

type Props = {
  data: EventoSuenio[];
  estadoSuenioPrevio: TipoEventoSuenio;
};

const BarraSuenio: React.FC<Props> = ({ data, estadoSuenioPrevio }) => {
  const segmentos = transformSegments(data, estadoSuenioPrevio);

  return (
    <View style={barraSuenioStyles.container}>
      {segmentos.map((segment, index) => (
        <View
          key={index}
          style={[
            barraSuenioStyles.segment,
            { width: `${((segment.end - segment.start) / 1440) * 100}%` },
          ]}
        >
          <LinearProgressWithLabel {...segment} />
        </View>
      ))}
    </View>
  );
};

const barraSuenioStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 30,
  },
  segment: {
    height: "100%",
  },
});

const linearProgressBarWithLabelStyles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    marginBottom: 16,
  },
  progressBarContainer: {
    width: "100%",
    height: 22,
    backgroundColor: "#e0e0e0",
    borderRadius: 1,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    height: "100%",
  },
  label: {
    position: "absolute",
    top: -20,
    fontSize: 12,
    color: "#000",
  },
});

export default BarraSuenio;
