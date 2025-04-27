import { AgendaTomiDia, TipoEventoSuenio } from "@/lib/types/general";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { calculateDateRange, ordenarDias } from "@/lib/helpers";
import { API_URL } from "@/lib/constants/Api";
import { fetch } from "expo/fetch";
import YearMonthPicker from "@/lib/components/YearMonthPicker";
import { FilaDia } from "@/lib/components/agendaTomi/FilaDia/FilaDia";
import { styles } from "../styles/tomi.styles";

export default function Tomi() {
  const [loading, setLoading] = useState(true);
  const [desdeDias, setDesdeDias] = useState<Date>(new Date());
  const [dias, setDias] = useState<AgendaTomiDia[]>([]);

  const refreshDias = async () => {
    setLoading(true);
    const { desde, hasta } = calculateDateRange(desdeDias);
    try {
      const response = await fetch(
        `${API_URL}/agenda-tomi/dias?desde=${desde}&hasta=${hasta}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const dias: AgendaTomiDia[] = await response.json();
      const diasOrdenados = ordenarDias(dias);
      setDias(diasOrdenados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await refreshDias();
    };

    fetchData();
  }, [desdeDias]);

  const onYearMonthChanged = (year: number, month: number) => {
    const newDate = new Date(year, month - 1, 1); // month is 0-indexed
    setDesdeDias(newDate);
  };

  const obtenerEstadoSuenioDiaAnterior = (index: number): TipoEventoSuenio => {
    if (index === dias.length - 1) {
      return "Despierto";
    }
    const diaAnterior = dias[index + 1];

    return diaAnterior?.eventos[diaAnterior.eventos.length - 1]?.tipo;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <YearMonthPicker onChange={onYearMonthChanged} />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {/* Table Headers */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.columnDia]}>Día</Text>
            <Text style={[styles.tableHeaderText, styles.columnEventos]} />
          </View>

          {/* Table Rows */}
          <FlatList
            data={dias}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <FilaDia
                dia={item}
                onEditDia={() => {}}
                estadoPrevioSuenio={obtenerEstadoSuenioDiaAnterior(index)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}
