import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  CategoriaUIMovimiento,
  MovimientoAEditar,
  MovimientoGastoGrilla,
  TipoDeMovimientoGasto,
} from "../../types/general";
import { ConceptoPicker } from "../Editores/ConceptoPicker/ConceptoPicker";
import { TipoDePago } from "../Editores/TipoDePago";
import { Monto } from "../Editores/Monto";
import { obtenerDiasEnElMes } from "@/lib/helpers";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./EditarMovimiento.styles";
import { MaterialIcons } from "@expo/vector-icons";

const diaDefault = new Date().getDate();

interface AddMovimientoModalProps {
  visible: boolean;
  categoriasDeMovimiento: CategoriaUIMovimiento[];
  movimiento: MovimientoGastoGrilla | null;
  date: Date;
  onClose: () => void;
  onAdd: (data: MovimientoAEditar) => void;
  onSave: (data: MovimientoAEditar) => void;
}

export const EditarMovimientoModal = ({
  visible,
  categoriasDeMovimiento,
  movimiento,
  date,
  onClose,
  onAdd,
  onSave,
}: AddMovimientoModalProps) => {
  const [concepto, setConcepto] = React.useState<CategoriaUIMovimiento | null>(
    movimiento?.concepto || null
  );
  const [monto, setMonto] = React.useState(movimiento?.monto?.toString() || ""); // Initialize with movimiento value
  const [tipoDePago, setTipoDePago] = React.useState<TipoDeMovimientoGasto>(
    movimiento?.tipoDeGasto || TipoDeMovimientoGasto.Efectivo
  );
  const [comentarios, setComentarios] = React.useState(
    movimiento?.comentarios || ""
  );
  const [dia, setDia] = React.useState<number>(
    movimiento?.fecha ? new Date(movimiento.fecha).getDate() : diaDefault
  );

  const diasEnElMes = obtenerDiasEnElMes(date); // Get the number of days in the month

  React.useEffect(() => {
    if (movimiento?.concepto) {
      const conceptoElegido = categoriasDeMovimiento.find(
        (cat) => cat.id === movimiento.concepto.id
      );
      if (conceptoElegido) {
        setConcepto(conceptoElegido);
      }
    } else {
      setConcepto(null);
    }
    setMonto(movimiento?.monto?.toString() || "");
    setTipoDePago(movimiento?.tipoDeGasto || TipoDeMovimientoGasto.Efectivo);
    setComentarios(movimiento?.comentarios || "");
    setDia(
      movimiento?.fecha ? new Date(movimiento.fecha).getDate() : diaDefault
    );
  }, [movimiento]);

  const clearMovimientoProperties = () => {
    setConcepto(null);
    setMonto("");
    setTipoDePago(TipoDeMovimientoGasto.Efectivo);
    setComentarios("");
    setDia(diaDefault);
  };

  const handleSave = (add: boolean = true) => {
    if (!concepto || !monto) {
      alert("Por favor completa todos los campos.");
      return;
    }
    const movimientoAEditar: MovimientoAEditar = {
      concepto,
      monto,
      tipoDePago,
      comentarios,
      dia,
    };
    if (add) {
      onAdd(movimientoAEditar);
    } else {
      onSave(movimientoAEditar);
    }
    clearMovimientoProperties();
    onClose();
  };

  const handleCancel = () => {
    clearMovimientoProperties();
    onClose();
  };

  const onConceptoChanged = (itemValue: CategoriaUIMovimiento) => {
    setConcepto(itemValue);
  };

  const onTipoDePagoChanged = (tipoDePago: TipoDeMovimientoGasto) => {
    setTipoDePago(tipoDePago);
  };

  const onMontoChanged = (monto: number | null) => {
    setMonto(monto?.toString() || ""); // Convert to string for TextInput
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Movimiento</Text>

          {/* Concepto Picker */}
          <View style={styles.inputContainer}>
            <ConceptoPicker
              categoriasDeMovimiento={categoriasDeMovimiento}
              conceptoInicial={concepto}
              onConceptoModificado={onConceptoChanged}
            />
          </View>

          {/* Tipo de Pago */}
          <View style={styles.inputContainer}>
            <TipoDePago
              tipoDePagoInicial={tipoDePago}
              onTipoDePagoChange={onTipoDePagoChanged}
            />
          </View>

          {/* Monto Input */}
          <View style={styles.inputContainer}>
            <Monto
              initialValue={monto}
              onValueChange={onMontoChanged} // Pass the callback to handle changes
            />
          </View>

          {/* Comentarios Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Comentarios"
              value={comentarios}
              onChangeText={setComentarios}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          {/* Number Picker for Day */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Día del Movimiento</Text>
            <Picker
              selectedValue={dia}
              onValueChange={(itemValue) => setDia(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: diasEnElMes }, (_, i) => i + 1).map(
                (day) => (
                  <Picker.Item key={day} label={day.toString()} value={day} />
                )
              )}
            </Picker>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Agregar Button */}
            <TouchableOpacity
              style={[styles.button, styles.addButtonBackground]}
              onPress={() => handleSave(true)}
            >
              <MaterialIcons name="save-alt" size={18} color="#fff" />
              <Text style={styles.buttonText}>Agregar</Text>
            </TouchableOpacity>

            {/* Cancelar Button */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButtonBackground]}
              onPress={handleCancel}
            >
              <MaterialIcons name="cancel" size={18} color="#fff" />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            {/* Guardar Button */}
            <TouchableOpacity
              style={[styles.button, styles.saveButtonBackground]}
              onPress={() => handleSave(false)}
            >
              <MaterialIcons name="save" size={18} color="#fff" />
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
