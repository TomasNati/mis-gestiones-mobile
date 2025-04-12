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
import { obtenerDiasEnElMes } from "@/lib/helpers";
import { Picker } from "@react-native-picker/picker";

interface AddMovimientoModalProps {
  visible: boolean;
  categoriasDeMovimiento: CategoriaUIMovimiento[];
  movimiento: MovimientoGastoGrilla | null;
  date: Date;
  onClose: () => void;
  onSave: (data: {
    concepto: CategoriaUIMovimiento;
    monto: string;
    tipoDePago: TipoDeMovimientoGasto;
    comentarios: string;
    dia: number; // Add the selected day
  }) => void;
}

export const EditarMovimientoModal = ({
  visible,
  categoriasDeMovimiento,
  movimiento,
  date,
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
  );
  const [dia, setDia] = React.useState<number>(
    movimiento?.fecha ? new Date(movimiento.fecha).getDate() : 1
  ); // Default to the first day of the month

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
    setDia(movimiento?.fecha ? new Date(movimiento.fecha).getDate() : 1);
  }, [movimiento]);

  const clearMovimientoProperties = () => {
    setConcepto(null);
    setMonto("");
    setTipoDePago(TipoDeMovimientoGasto.Efectivo);
    setComentarios("");
    setDia(1);
  };

  const handleSave = () => {
    if (!concepto || !monto) {
      alert("Por favor completa todos los campos.");
      return;
    }
    onSave({ concepto, monto, tipoDePago, comentarios, dia }); // Include the selected day
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
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
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
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
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
