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
  MovimientoGastoGrilla,
  TipoDeMovimientoGasto,
} from "../types/general";
import { ConceptoPicker } from "./Editores/ConceptoPicker";
import { TipoDePago } from "./Editores/TipoDePago";
import { Monto } from "./Editores/Monto";

interface AddMovimientoModalProps {
  visible: boolean;
  categoriasDeMovimiento: CategoriaUIMovimiento[];
  movimiento: MovimientoGastoGrilla | null;
  onClose: () => void;
  onSave: (data: {
    concepto: CategoriaUIMovimiento;
    monto: string;
    tipoDePago: TipoDeMovimientoGasto;
    comentarios: string;
  }) => void;
}

export const EditarMovimientoModal = ({
  visible,
  categoriasDeMovimiento,
  movimiento,
  onClose,
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
  ); // New state for Comentarios

  const handleSave = () => {
    if (!concepto || !monto) {
      alert("Por favor completa todos los campos.");
      return;
    }
    onSave({ concepto, monto, tipoDePago, comentarios }); // Include comentarios in the save data
    setConcepto(null);
    setTipoDePago(TipoDeMovimientoGasto.Efectivo);
    setMonto("");
    setComentarios(""); // Reset comentarios
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
          <Text style={styles.title}>Agregar Movimiento</Text>

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
              style={[styles.input, styles.textArea]} // Add textArea style
              placeholder="Comentarios"
              value={comentarios}
              onChangeText={setComentarios}
              multiline={true} // Enable multiline for text area
              numberOfLines={4} // Set the number of visible lines
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16, // Add spacing between inputs
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textArea: {
    height: 80, // Set height for the text area
    textAlignVertical: "top", // Align text to the top
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
