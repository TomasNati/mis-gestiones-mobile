import { TipoDeMovimientoGasto } from "@/lib/types/general";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/lib/constants/Colors";

interface TipoDePagoProps {
  tipoDePagoInicial: TipoDeMovimientoGasto;
  onTipoDePagoChange: (tipoDePago: TipoDeMovimientoGasto) => void;
}

export const TipoDePago = ({
  tipoDePagoInicial,
  onTipoDePagoChange,
}: TipoDePagoProps) => {
  const handleTipoDePagoChange = (tipoDePago: TipoDeMovimientoGasto) => {
    onTipoDePagoChange(tipoDePago);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16, marginRight: 10 }}>
        {tipoDePagoInicial === TipoDeMovimientoGasto.Efectivo
          ? "Efectivo"
          : tipoDePagoInicial === TipoDeMovimientoGasto.Debito
          ? "Débito"
          : "Crédito"}
      </Text>
      <TouchableOpacity
        onPress={() => handleTipoDePagoChange(TipoDeMovimientoGasto.Efectivo)}
      >
        <MaterialIcons
          color={
            tipoDePagoInicial === TipoDeMovimientoGasto.Efectivo
              ? Colors.efectivo
              : "grey"
          }
          name="attach-money"
          size={20}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTipoDePagoChange(TipoDeMovimientoGasto.Debito)}
      >
        <MaterialIcons
          color={
            tipoDePagoInicial === TipoDeMovimientoGasto.Debito
              ? Colors.debito
              : "grey"
          }
          name="account-balance"
          size={20}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTipoDePagoChange(TipoDeMovimientoGasto.Credito)}
      >
        <MaterialIcons
          color={
            tipoDePagoInicial === TipoDeMovimientoGasto.Credito
              ? Colors.credito
              : "grey"
          }
          name="credit-card"
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: Colors.icon,
    borderRadius: 5,
  },
});
