import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { ActivityIndicator, StyleSheet } from "react-native";
import { MovimientoGastoGrilla } from "@/lib/types/general";
import { API_DOMAIN, API_URL } from "@/lib/constants/Api";
import YearMonthPicker from "@/lib/components/YearMonthPicker";
import { transformNumberToCurrenty } from "@/lib/helpers";
import { fetch } from "expo/fetch";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [desdeMovimientos, setDesdeMovimientos] = useState<Date>(new Date());
  const [movimientos, setMovimientos] = useState<MovimientoGastoGrilla[]>([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState<
    MovimientoGastoGrilla[]
  >([]);
  const [filter, setFilter] = useState("");

  const onChange = (year: number, month: number) => {
    // Create a new date object for the first day of the selected month
    const newDate = new Date(year, month - 1, 1); // month is 0-indexed
    setDesdeMovimientos(newDate);
  };

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
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const json: MovimientoGastoGrilla[] = await response.json();
        setMovimientos(json); // Set the fetched data
        setFilteredMovimientos(json); // Initialize filtered data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [desdeMovimientos]);

  const handleFilterChange = (text: string) => {
    setFilter(text);
    const filtered = movimientos.filter(
      (item) =>
        item.categoria.toLowerCase().includes(text.toLowerCase()) ||
        item.concepto.nombre.toLowerCase().includes(text.toLowerCase()) ||
        item.tipoDeGasto.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMovimientos(filtered);
  };

  return (
    <View style={styles.container}>
      <YearMonthPicker onChange={onChange} />
      <TextInput
        style={styles.filterInput}
        placeholder="Filtrar por categoría, concepto o tipo de gasto"
        value={filter}
        onChangeText={handleFilterChange}
      />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {/* Table Headers */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.columnDia]}>Día</Text>
            <Text style={[styles.tableHeaderText, styles.columnConcepto]}>
              Concepto
            </Text>
            <Text style={[styles.tableHeaderText, styles.columnMonto]}>
              Monto
            </Text>
          </View>

          {/* Table Rows */}
          <FlatList
            data={filteredMovimientos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.columnDia]}>
                  {new Date(item.fecha).getDate()}
                </Text>
                <Text style={[styles.tableCell, styles.columnConcepto]}>
                  {item.concepto.nombre}
                </Text>
                <Text style={[styles.tableCell, styles.columnMonto]}>
                  {transformNumberToCurrenty(item.monto)}
                </Text>
              </View>
            )}
          />
        </View>
      )}
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
  tableContainer: {
    flex: 1, // Allow the FlatList to take up remaining space and enable scrolling
  },
  filterInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    fontSize: 14,
  },
  columnDia: {
    flex: 0.5, // Adjust width for category column
  },
  columnConcepto: {
    flex: 2.5, // Adjust width for concept column
  },
  columnMonto: {
    flex: 2, // Adjust width for amount column
    textAlign: "right",
  },
});
