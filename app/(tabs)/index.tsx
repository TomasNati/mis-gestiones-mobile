import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/lib/constants/Colors";

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Finanzas Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/finanzas")}
      >
        <MaterialIcons name="attach-money" size={48} color={Colors.black} />
        <Text style={styles.cardText}>Finanzas</Text>
      </TouchableOpacity>

      {/* Tomi Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/tomi")}
      >
        <MaterialIcons name="face" size={48} color={Colors.black} />
        <Text style={styles.cardText}>Tomi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  card: {
    width: "90%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  cardText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
  },
});

export default Index;
