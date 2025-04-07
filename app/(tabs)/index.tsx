import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  CategoriaUIMovimiento,
  MovimientoGastoGrilla,
  TipoDeMovimientoGasto,
} from "@/lib/types/general";
import { API_URL } from "@/lib/constants/Api";
import YearMonthPicker from "@/lib/components/YearMonthPicker";
import { fetch } from "expo/fetch";
import { FilaMovimiento } from "@/lib/components/FilaMovimiento";
import { MaterialIcons } from "@expo/vector-icons";
import { EditarMovimientoModal } from "@/lib/components/EditarMovimiento";

// Helper function to calculate "desde" and "hasta"
const calculateDateRange = (date: Date) => {
  const desde = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`;

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const hasta = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(lastDay).padStart(2, "0")}`;

  return { desde, hasta };
};

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [desdeMovimientos, setDesdeMovimientos] = useState<Date>(new Date());
  const [movimientos, setMovimientos] = useState<MovimientoGastoGrilla[]>([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState<
    MovimientoGastoGrilla[]
  >([]);
  const [filter, setFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [categoriasDeMovimientos, setCategoriasDeMovimientos] = useState<
    CategoriaUIMovimiento[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Use the helper function to calculate "desde" and "hasta"
      const { desde, hasta } = calculateDateRange(desdeMovimientos);

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
        const movimientos: MovimientoGastoGrilla[] = await response.json();
        const movimientosNoCredito = movimientos.filter(
          (movimiento) => movimiento.tipoDeGasto.toString() !== "Credito"
        );
        const movimientosCredito = movimientos.filter(
          (movimiento) => movimiento.tipoDeGasto.toString() === "Credito"
        );
        const movimientosOrdenados = [
          ...movimientosNoCredito,
          ...movimientosCredito,
        ];
        setMovimientos(movimientosOrdenados);
        setFilteredMovimientos(movimientosOrdenados);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [desdeMovimientos]);

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/conceptos-movimientos`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categorias");
        }

        const categorias: CategoriaUIMovimiento[] = await response.json();
        setCategoriasDeMovimientos(categorias);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const onChange = (year: number, month: number) => {
    const newDate = new Date(year, month - 1, 1); // month is 0-indexed
    setDesdeMovimientos(newDate);
  };

  const handleFilterChange = (text: string) => {
    setFilter(text);
    const filtered = movimientos.filter(
      (item) =>
        getMovimientoDescription(item)
          .toLowerCase()
          .includes(text.toLowerCase()) ||
        item.tipoDeGasto.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMovimientos(filtered);
  };

  const getMovimientoDescription = (movimiento: MovimientoGastoGrilla) => {
    const { categoria, concepto, tipoDeGasto } = movimiento;
    const categoriaPrefix = categoria.slice(0, 2).toUpperCase();
    return `(${categoriaPrefix}) ${concepto.nombre}`;
  };

  const handleAddPress = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSaveMovimiento = (data: {
    concepto: CategoriaUIMovimiento;
    tipoDePago: TipoDeMovimientoGasto;
    monto: string;
    comentarios: string;
  }) => {
    console.log("New Movimiento:", data);
    // Add logic to save the new movimiento
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <YearMonthPicker onChange={onChange} />
        <TouchableOpacity onPress={handleAddPress}>
          <MaterialIcons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FilaMovimiento
                movimiento={item}
                getMovimientoDescription={getMovimientoDescription}
              />
            )}
          />
        </View>
      )}
      <EditarMovimientoModal
        visible={isModalVisible}
        categoriasDeMovimiento={categoriasDeMovimientos}
        onClose={handleModalClose}
        onSave={handleSaveMovimiento}
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
  header: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space between YearMonthPicker and Add icon
    marginBottom: 16,
    marginTop: 16,
  },
  yearMonthPicker: {
    flex: 1, // Take up all remaining space
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
  columnDia: {
    flex: 1, // Adjust width for category column
  },
  columnConcepto: {
    flex: 5, // Adjust width for concept column
  },
  columnMonto: {
    flex: 2.8, // Adjust width for amount column
    textAlign: "right",
  },
});
