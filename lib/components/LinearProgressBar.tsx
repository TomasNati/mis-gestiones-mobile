import React from "react";
import { View, StyleSheet } from "react-native";

const CustomLinearProgress = ({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progress,
          { width: `${progress * 100}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 22,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 5,
  },
});

export default CustomLinearProgress;
