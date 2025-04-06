import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CategoriaUIMovimiento } from "../types/general";
import { ConceptoPicker } from "./ConceptoPicker";

interface AddMovimientoModalProps {
  visible: boolean;
  categoriasDeMovimiento: CategoriaUIMovimiento[];
  onClose: () => void;
  onSave: (data: { concepto: CategoriaUIMovimiento; monto: string }) => void;
}

export const EditarMovimientoModal = ({
  visible,
  categoriasDeMovimiento,
  onClose,
  onSave,
}: AddMovimientoModalProps) => {
  const [concepto, setConcepto] = React.useState<CategoriaUIMovimiento | null>(
    null
  );
  const [monto, setMonto] = React.useState("");

  const handleSave = () => {
    if (!concepto || !monto) {
      alert("Por favor completa todos los campos.");
      return;
    }
    onSave({ concepto, monto });
    setConcepto(null);
    setMonto("");
    onClose();
  };

  const onConceptoChanged = (itemValue: CategoriaUIMovimiento) => {
    setConcepto(itemValue);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Agregar Movimiento</Text>
          <ConceptoPicker
            categoriasDeMovimiento={categoriasDeMovimiento}
            conceptoInicial={concepto}
            onConceptoModificado={onConceptoChanged}
          />
          <TextInput
            style={styles.input}
            placeholder="Monto"
            value={monto}
            onChangeText={setMonto}
            keyboardType="numeric"
          />
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
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
