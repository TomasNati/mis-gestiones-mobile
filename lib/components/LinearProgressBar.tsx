import React from "react";
import { View, StyleSheet, Text } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 22,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    fontSize: 12, // Smaller font size
    color: "#fff", // White text color
    fontWeight: "bold", // Optional: Make the text bold
    marginLeft: 4, // Optional: Add some left margin for better spacing
  },
});

export default LinearProgressBar;
