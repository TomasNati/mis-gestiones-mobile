import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { ActivityIndicator, StyleSheet } from "react-native";
import { MovimientoGastoGrilla } from "@/types/general";
import { API_DOMAIN, API_URL } from "@/constants/Api";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [desdeMovimientos, setDesdeMovimientos] = useState<Date>(new Date());
  const [movimientos, setMovimientos] = useState<MovimientoGastoGrilla[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading

      // Create the "desde" string for the first day of the month
      const desde = `${desdeMovimientos.getFullYear()}-${String(
        desdeMovimientos.getMonth() + 1
      ).padStart(2, "0")}-01`;

      // Create the "hasta" string for the last day of the month
      const lastDay = new Date(
        desdeMovimientos.getFullYear(),
        desdeMovimientos.getMonth() + 1,
        0
      ).getDate();
      const hasta = `${desdeMovimientos.getFullYear()}-${String(
        desdeMovimientos.getMonth() + 1
      ).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      try {
        const response = await fetch(
          `${API_URL}/movimientos?desde=${desde}&hasta=${hasta}`,
          {
            method: "GET",
            headers: {
              host: API_DOMAIN,
              accept: "*/*",
            },
          }
        );
        const json: MovimientoGastoGrilla[] = await response.json();
        setMovimientos(json); // Set the fetched data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [desdeMovimientos]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fetched Data:</Text>
      <FlatList
        data={movimientos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text
              style={styles.itemTitle}
            >{`${item.categoria} - ${item.concepto.nombre}`}</Text>
            <Text>{item.monto}</Text>
            <Text>{item.tipoDeGasto}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
