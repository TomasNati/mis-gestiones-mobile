import { StyleSheet } from "react-native";

export const barraSuenioStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 30,
  },
  segment: {
    height: "100%",
  },
});

export const linearProgressBarWithLabelStyles = StyleSheet.create({
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
