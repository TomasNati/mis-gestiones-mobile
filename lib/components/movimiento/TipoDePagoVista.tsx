import { TipoDeMovimientoGasto } from "@/lib/types/general";
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/lib/constants/Colors";

export const TipoDePagoVista = ({
  tipoDePago,
}: {
  tipoDePago: TipoDeMovimientoGasto;
}) => {
  return (
    <View style={styles.container}>
      {tipoDePago === TipoDeMovimientoGasto.Efectivo && (
        <MaterialIcons color={Colors.efectivo} name="attach-money" size={20} />
      )}
      {tipoDePago === TipoDeMovimientoGasto.Debito && (
        <MaterialIcons color={Colors.debito} name="account-balance" size={20} />
      )}
      {tipoDePago === TipoDeMovimientoGasto.Credito && (
        <MaterialIcons color={Colors.credito} name="credit-card" size={20} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
