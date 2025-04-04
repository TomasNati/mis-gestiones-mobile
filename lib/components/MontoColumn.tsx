import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MovimientoGastoGrilla } from "@/lib/types/general";
import { TipoDePagoVista } from "@/lib/components/TipoDePagoVista";
import { transformNumberToCurrenty } from "@/lib/helpers";

interface MontoColumnProps {
  movimiento: MovimientoGastoGrilla;
}

export default function ConceptoColumn({ movimiento }: MontoColumnProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.monto}>
        {transformNumberToCurrenty(movimiento.monto)}
      </Text>
      <TipoDePagoVista tipoDePago={movimiento.tipoDeGasto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Stack description and TipoDePagoVista vertically
    justifyContent: "flex-end",
    paddingVertical: 0,
  },
  monto: {
    fontSize: 14,
    marginRight: 4,
  },
});
