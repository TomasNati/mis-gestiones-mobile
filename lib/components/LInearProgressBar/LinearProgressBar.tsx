import React from "react";
import { View, Text } from "react-native";
import { styles } from "./LinearProgressBar.styles";

interface LinearProgressBarProps {
  progress: number;
  color: string;
  textContent?: string;
}
const LinearProgressBar = ({
  progress,
  color,
  textContent,
}: LinearProgressBarProps) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progress,
          {
            width: `${progress * 100}%`,
            backgroundColor: color,
          },
        ]}
      >
        {textContent ? <Text style={styles.text}>{textContent}</Text> : null}
      </View>
    </View>
  );
};

export default LinearProgressBar;
