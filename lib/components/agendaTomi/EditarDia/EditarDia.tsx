import React, { useEffect, useState } from "react";
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
import { AgendaTomiDia, EventoSuenio } from "@/lib/types/general";
import { DormidoDespiertoPicker } from "@/lib/components/agendaTomi/DormidoDespiertoPicker/DormidoDespiertoPIcker";
import { generateUUID, obtenerDiasEnElMes } from "@/lib/helpers";
import { DiaDelMesPicker } from "@/lib/components/DiaDelMesPicker/DiaDelMesPicker";

interface AddDiaModalProps {
  onClose: () => void;
  onSave: (dia: AgendaTomiDia) => void;
  visible: boolean;
  diaAEditar: AgendaTomiDia;
  date: Date;
}

export const EditarDiaModal = ({
  visible,
  onClose,
  onSave,
  diaAEditar,
  date,
}: AddDiaModalProps) => {
  const [diaAgenda, setDiaAgenda] = useState<AgendaTomiDia>(diaAEditar);
  const [dia, setDia] = React.useState<number>(
    diaAEditar?.fecha ? new Date(diaAEditar.fecha).getDate() : 1
  );

  const diasEnElMes = obtenerDiasEnElMes(date);

  useEffect(() => {
    setDiaAgenda(diaAEditar);
  }, [diaAEditar]);

  const handleSave = () => {
    onSave(diaAgenda);
  };

  const handleCancel = () => {
    onClose();
  };

  const onEventoChange = (evento: EventoSuenio) => {
    const eventoModificado = diaAgenda.eventos.find((e) => e.id === evento.id);
    if (eventoModificado) {
      eventoModificado.hora = evento.hora;
      eventoModificado.tipo = evento.tipo;
      if (eventoModificado.tipoDeActualizacion != "nuevo") {
        eventoModificado.tipoDeActualizacion = "modificado";
      }
      setDiaAgenda({ ...diaAgenda });
    }
  };

  const onAddEvento = () => {
    const ultimoEvento = diaAgenda.eventos[diaAgenda.eventos.length - 1];
    const newEvento: EventoSuenio = {
      id: generateUUID(),
      hora: ultimoEvento?.hora || "00:00",
      tipo: ultimoEvento?.tipo === "Dormido" ? "Despierto" : "Dormido",
      tipoDeActualizacion: "nuevo",
    };
    setDiaAgenda({ ...diaAgenda, eventos: [...diaAgenda.eventos, newEvento] });
  };

  const onDeleteEvento = (evento: EventoSuenio) => {
    const eventoAEliminar = diaAgenda.eventos.find((e) => e.id === evento.id);
    if (!eventoAEliminar) {
      return;
    }
    if (eventoAEliminar.tipoDeActualizacion === "nuevo") {
      setDiaAgenda({
        ...diaAgenda,
        eventos: diaAgenda.eventos.filter((e) => e.id !== evento.id),
      });
      return;
    }
    eventoAEliminar.tipoDeActualizacion = "eliminado";
    setDiaAgenda({ ...diaAgenda });
  };

  const onComentariosChanged = (comentarios: string) => {
    setDiaAgenda({ ...diaAgenda, comentarios });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Dia</Text>
          {/* Plus Button */}
          <TouchableOpacity style={styles.plusButton} onPress={onAddEvento}>
            <MaterialIcons name="add" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* DiaDelMesPicker */}
          <DiaDelMesPicker
            dia={dia}
            diasEnElMes={diasEnElMes}
            onDiaChange={setDia}
          />

          <ScrollView style={styles.scrollContainer}>
            {/* Render DormidoDespiertoPickers */}
            {diaAgenda.eventos
              .filter(
                ({ tipoDeActualizacion }) => tipoDeActualizacion != "eliminado"
              )
              .map((evento) => (
                <DormidoDespiertoPicker
                  key={evento.id}
                  evento={evento}
                  onEventoChange={onEventoChange}
                  onDelete={onDeleteEvento}
                />
              ))}
          </ScrollView>
          {/* Comentarios Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Comentarios"
              value={diaAgenda.comentarios || ""}
              onChangeText={onComentariosChanged}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Guardar Button */}
            <TouchableOpacity
              style={[styles.button, styles.saveButtonBackground]}
              onPress={handleSave}
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
