import { AgendaTomiDia } from "@/lib/types/general";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { calculateDateRange } from "@/lib/helpers";
import { API_URL } from "@/lib/constants/Api";
import { fetch } from "expo/fetch";
import YearMonthPicker from "@/lib/components/YearMonthPicker";
import { FilaDia } from "@/lib/components/agendaTomi/FilaDia/FilaDia";

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
      setDias(dias);
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
            renderItem={({ item }) => (
              <FilaDia dia={item} onEditDia={() => {}} />
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
  header: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space between YearMonthPicker and buttons
    marginBottom: 16,
    marginTop: 16,
  },
  tableContainer: {
    flex: 1, // Allow the FlatList to take up remaining space and enable scrolling
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
  columnEventos: {
    flex: 5,
  },
});
