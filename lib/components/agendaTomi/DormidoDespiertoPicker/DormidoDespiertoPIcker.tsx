import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { styles } from "./DormidoDespiertoPicker.styles";
import { EventoSuenio } from "@/lib/types/general";
import { MaterialIcons } from "@expo/vector-icons";
import { TimePicker } from "../../TimePicker/TimePicket";

interface DormidoDespiertoPickerProps {
  evento: EventoSuenio;
  onEventoChange: (evento: EventoSuenio) => void;
  onDelete: (event: EventoSuenio) => void;
}

export const DormidoDespiertoPicker = ({
  evento,
  onEventoChange,
  onDelete,
}: DormidoDespiertoPickerProps) => {
  const [isDespierto, setIsDespierto] = useState(evento.tipo === "Despierto");

  const onDormidoDespierdoChange = () => {
    const newTipo = isDespierto ? "Dormido" : "Despierto";
    evento.tipo = newTipo;
    onEventoChange(evento);
    setIsDespierto((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TimePicker
        time={evento.hora}
        onTimeChange={(time) => {
          evento.hora = time;
          onEventoChange(evento);
        }}
      />
      <Text style={styles.label}>{isDespierto ? "Despierto" : "Dormido"}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDespierto ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={onDormidoDespierdoChange}
        value={isDespierto}
      />
      <TouchableOpacity
        style={styles.trashButton}
        onPress={() => onDelete(evento)}
      >
        <MaterialIcons name="delete" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
