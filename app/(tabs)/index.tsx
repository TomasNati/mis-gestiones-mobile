import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  CategoriaUIMovimiento,
  MovimientoGastoGrilla,
  MovimientoAEditar,
} from "@/lib/types/general";
import { PersistirMovimientoGasto } from "@/lib/types/api";
import { API_URL } from "@/lib/constants/Api";
import { fetch } from "expo/fetch";
import { FilaMovimiento } from "@/lib/components/FilaMovimiento";
import { EditarMovimientoModal } from "@/lib/components/EditarMovimiento/EditarMovimiento";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoriasDeMovimientos, setCategoriasDeMovimientos] = useState<
    CategoriaUIMovimiento[]
  >([]);
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientoGastoGrilla | null>(null);
  const [originalUpdatedMovimientos, setOriginalUpdatedMovimientos] = useState<
    MovimientoGastoGrilla[]
  >([]);

  const refreshMovimientos = async () => {
    setLoading(true);
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
      setOriginalUpdatedMovimientos([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const consolidateErrors = (result: PersistirMovimientoGasto): string[] => {
    const errors: string[] = [];

    if (result.added && !result.added.exitoso) {
      errors.push(...result.added.errores);
    }

    if (result.updated) {
      result.updated.forEach((updateResult) => {
        if (!updateResult.exitoso) {
          errors.push(...updateResult.errores);
        }
      });
    }

    if (result.deleted && !result.deleted.exitoso) {
      errors.push(...result.deleted.errores);
    }

    return errors;
  };

  useEffect(() => {
    const fetchData = async () => {
      await refreshMovimientos();
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

  const crearMovimientoAActualizar = (data: MovimientoAEditar) => {
    const movimientoAActualizar: MovimientoGastoGrilla = {
      ...(selectedMovimiento || {}),
      id: selectedMovimiento?.id || generateUUID(),
      state:
        selectedMovimiento?.state || (selectedMovimiento ? "updated" : "added"),
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
    };
    return movimientoAActualizar;
  };

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

  const handleAddMovimiento = async (data: MovimientoAEditar) => {
    const movimientoAActualizar: MovimientoGastoGrilla =
      crearMovimientoAActualizar(data);

    let nuevosMovimientos = [];

    if (selectedMovimiento) {
      if (
        !(movimientoAActualizar.state == "added") &&
        !originalUpdatedMovimientos.find(
          (mov) => mov.id === selectedMovimiento.id
        )
      ) {
        setOriginalUpdatedMovimientos((prev) => [
          ...prev,
          { ...selectedMovimiento },
        ]);
      }

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
  };

  const handleEditarMovimiento = (movimiento: MovimientoGastoGrilla) => {
    setSelectedMovimiento(movimiento);
    setIsModalVisible(true);
  };

  const handleDeleteMovimiento = (movimiento: MovimientoGastoGrilla) => {
    const updatedMovimiento = movimientos.find(
      (mov) => mov.id === movimiento.id
    );
    if (updatedMovimiento) {
      if (!originalUpdatedMovimientos.find((mov) => mov.id === movimiento.id)) {
        setOriginalUpdatedMovimientos((prev) => [
          ...prev,
          { ...updatedMovimiento },
        ]);
      }

      updatedMovimiento.state = "deleted";
      const newMovimientos = movimientos.map((mov) =>
        mov.id === movimiento.id ? updatedMovimiento : mov
      );
      setMovimientos(newMovimientos);
      setFilteredMovimientos(newMovimientos);
    }
  };

  const handleSaveUnsavedMovimientos = async (
    movimientosAActualizar?: MovimientoGastoGrilla[]
  ) => {
    setLoading(true);
    try {
      const movimientosConEstado =
        movimientosAActualizar ||
        movimientos.filter((movimiento) => movimiento.state);
      const response = await fetch(`${API_URL}/finanzas/movimiento-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movimientosConEstado),
      });

      if (!response.ok) {
        throw new Error(
          "Error al guardar los movimientos. Inténtalo de nuevo."
        );
      }

      const result: PersistirMovimientoGasto = await response.json();
      const errors = consolidateErrors(result);

      if (errors.length > 0) {
        alert(`Errores al guardar los movimientos:\n${errors.join("\n")}`);
        return;
      }

      await refreshMovimientos();
    } catch (error) {
      console.error("Error saving movimiento:", error);
      alert("Ocurrió un error al guardar el movimiento. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardUnsavedMovimientos = () => {
    let updatedMovimientos = movimientos.filter(
      (movimiento) => movimiento.state !== "added"
    );

    updatedMovimientos = updatedMovimientos.map((movimiento) => {
      const originalMovimiento = originalUpdatedMovimientos.find(
        (mov) => mov.id === movimiento.id
      );
      return originalMovimiento || movimiento;
    });

    setOriginalUpdatedMovimientos([]);
    setMovimientos(updatedMovimientos);
    setFilteredMovimientos(updatedMovimientos);
  };

  const handleSaveMovimiento = (data: MovimientoAEditar) => {
    const movimientoAActualizar: MovimientoGastoGrilla =
      crearMovimientoAActualizar(data);

    handleSaveUnsavedMovimientos([movimientoAActualizar]);
  };

  const movimientosSinGuardar = movimientos.filter(
    (movimiento) => movimiento.state
  ).length;

  return (
    <View style={styles.container}>
      <MovimientosHeader
        onAddMovimiento={handleAgregarMovimiento}
        onYearMonthChanged={onYearMonthChanged}
        onSaveUnsavedMovimientos={() => handleSaveUnsavedMovimientos()}
        onDiscardUnsavedMovimientos={handleDiscardUnsavedMovimientos}
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
        onAdd={handleAddMovimiento}
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
