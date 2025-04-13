import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  CategoriaUIMovimiento,
  MovimientoGastoGrilla,
  TipoDeMovimientoGasto,
} from "@/lib/types/general";
import { API_URL } from "@/lib/constants/Api";
import { fetch } from "expo/fetch";
import { FilaMovimiento } from "@/lib/components/FilaMovimiento";
import { EditarMovimientoModal } from "@/lib/components/EditarMovimiento";
import { MovimientoPayload } from "@/lib/types/api";
import { MovimientosHeader } from "@/lib/components/MovimientosHeader";
import { generateUUID } from "@/lib/helpers";

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

const orderarMovimientos = (
  movimientos: MovimientoGastoGrilla[]
): MovimientoGastoGrilla[] => {
  // Order by fecha descending
  movimientos.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return fechaB.getTime() - fechaA.getTime();
  });

  const movimientosNoCredito = movimientos.filter(
    (movimiento) => movimiento.tipoDeGasto.toString() !== "Credito"
  );
  const movimientosCredito = movimientos.filter(
    (movimiento) => movimiento.tipoDeGasto.toString() === "Credito"
  );
  const movimientosOrdenados = [...movimientosNoCredito, ...movimientosCredito];
  return movimientosOrdenados;
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
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientoGastoGrilla | null>(null); // State for selected movimiento

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
        const movimientosOrdenados = orderarMovimientos(movimientos);
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

  const onYearMonthChanged = (year: number, month: number) => {
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

  const handleAgregarMovimiento = () => {
    setSelectedMovimiento(null);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSaveMovimiento = async (data: {
    concepto: CategoriaUIMovimiento;
    tipoDePago: TipoDeMovimientoGasto;
    monto: string;
    comentarios: string;
    dia: number;
  }) => {
    const movimientoAActualizar: MovimientoGastoGrilla = {
      ...(selectedMovimiento || {}),
      id: selectedMovimiento?.id || generateUUID(),
      state: selectedMovimiento?.state || "added",
      categoria: data.concepto.categoriaNombre,
      tipoDeGasto: data.tipoDePago,
      concepto: data.concepto,
      monto: parseFloat(data.monto.replace(",", ".")),
      comentarios: data.comentarios,
      fecha: new Date(
        desdeMovimientos.getFullYear(),
        desdeMovimientos.getMonth(),
        data.dia
      ),
      updated: true,
    };

    let nuevosMovimientos = [];

    if (selectedMovimiento) {
      nuevosMovimientos = movimientos.map((movimiento) =>
        movimiento.id === movimientoAActualizar.id
          ? movimientoAActualizar
          : movimiento
      );
    } else {
      nuevosMovimientos = [movimientoAActualizar, ...movimientos];
    }

    nuevosMovimientos = orderarMovimientos(nuevosMovimientos);
    setMovimientos(nuevosMovimientos);
    setFilteredMovimientos(nuevosMovimientos);
    /*
    setLoading(true); // Set loading to true while waiting for the response
    try {
      const method = selectedMovimiento ? "PUT" : "POST"; // Use PUT for update, POST for create
      const response = await fetch(`${API_URL}/finanzas/movimiento`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${method === "POST" ? "create" : "update"} movimiento`
        );
      }

      const result = await response.json();
      console.log(
        `${method === "POST" ? "Created" : "Updated"} Movimiento:`,
        result
      );

      // Refresh the list of movimientos after saving
      const { desde, hasta } = calculateDateRange(desdeMovimientos);
      const refreshResponse = await fetch(
        `${API_URL}/movimientos?desde=${desde}&hasta=${hasta}`,
        {
          method: "GET",
        }
      );
      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh movimientos");
      }
      const refreshedMovimientos: MovimientoGastoGrilla[] =
        await refreshResponse.json();
      setMovimientos(refreshedMovimientos);
      setFilteredMovimientos(refreshedMovimientos);

      setIsModalVisible(false); // Close the modal after saving
      setSelectedMovimiento(null); // Clear selected movimiento after saving
    } catch (error) {
      console.error("Error saving movimiento:", error);
      alert("Ocurrió un error al guardar el movimiento. Inténtalo de nuevo.");
    } finally {
      setLoading(false); // Set loading to false after the operation
    }*/
  };

  const handleEditarMovimiento = (movimiento: MovimientoGastoGrilla) => {
    setSelectedMovimiento(movimiento);
    setIsModalVisible(true);
  };

  const handleDeleteMovimiento = (movimiento: MovimientoGastoGrilla) => {
    // Logic to delete the movimiento
    console.log("Delete Movimiento:", movimiento);
  };

  const handleSaveUnsavedMovimientos = () => {
    console.log("Save unsaved movimientos");
    // Logic to save unsaved movimientos
  };

  const movimientosSinGuardar = movimientos.filter(
    (movimiento) => movimiento.state
  ).length;

  return (
    <View style={styles.container}>
      <MovimientosHeader
        onAddMovimiento={handleAgregarMovimiento}
        onYearMonthChanged={onYearMonthChanged}
        onSaveUnsavedMovimientos={handleSaveUnsavedMovimientos}
        amountUnsavedMovimientos={movimientosSinGuardar}
      />
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
                onEditMovimiento={handleEditarMovimiento}
                onDeleteMovimiento={handleDeleteMovimiento}
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
        movimiento={selectedMovimiento}
        date={desdeMovimientos}
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
  addButtonBackground: {
    backgroundColor: "#007BFF", // Blue background for the Add button
    borderRadius: 50, // Make it circular
    padding: 12, // Add padding around the icon
    alignItems: "center", // Center the icon
    justifyContent: "center", // Center the icon
  },
});
