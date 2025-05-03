import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "./EditarDia.styles";
import { MaterialIcons } from "@expo/vector-icons";
import { AgendaTomiDia } from "@/lib/types/general";
import { DormidoDespiertoPicker } from "../DormidoDespiertoPicker/DormidoDespiertoPIcker";

interface AddDiaModalProps {
  onClose: () => void;
  visible: boolean;
  dia: AgendaTomiDia;
}

export const EditarDiaModal = ({ visible, onClose, dia }: AddDiaModalProps) => {
  const [comentarios, setComentarios] = React.useState<string | null>(
    dia.comentarios || null
  );

  const clearDiaProperties = () => {
    setComentarios("");
  };

  const handleSave = (add: boolean = true) => {
    clearDiaProperties();
    onClose();
  };

  const handleCancel = () => {
    clearDiaProperties();
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Dia</Text>

          <ScrollView style={styles.scrollContainer}>
            {/* Render DormidoDespiertoPickers */}
            {dia.eventos.map((evento) => (
              <DormidoDespiertoPicker
                key={evento.id}
                evento={evento}
                onEventoChange={() => {}}
                onDelete={() => {}}
              />
            ))}
          </ScrollView>
          {/* Comentarios Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Comentarios"
              value={comentarios || ""}
              onChangeText={setComentarios}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Guardar Button */}
            <TouchableOpacity
              style={[styles.button, styles.saveButtonBackground]}
              onPress={() => handleSave(false)}
            >
              <MaterialIcons name="save" size={18} color="#fff" />
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            {/* Cancelar Button */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButtonBackground]}
              onPress={handleCancel}
            >
              <MaterialIcons name="cancel" size={18} color="#fff" />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
