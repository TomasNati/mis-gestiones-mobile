import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trashButton: {
    backgroundColor: "#FF3B30", // Red background
    padding: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
