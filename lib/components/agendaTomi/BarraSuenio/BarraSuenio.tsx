import React from "react";
import { View } from "react-native";
import LinearProgressBar from "../../LInearProgressBar/LinearProgressBar";
import { ResultSegment } from "../FilaDia/FilaDia";
import {
  barraSuenioStyles,
  linearProgressBarWithLabelStyles,
} from "./BarraSuenio.styles";

const LinearProgressWithLabel = ({
  tipo,
  start,
  end,
  duracion,
}: ResultSegment) => {
  const progressWidth = ((end - start) / 1440) * 100; // Calculate width as a percentage

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
          textContent={tipo === "Dormido" ? duracion : undefined}
        />
      </View>
    </View>
  );
};

type Props = {
  segmentos: ResultSegment[];
};

const BarraSuenio: React.FC<Props> = ({ segmentos }) => {
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

export default BarraSuenio;
