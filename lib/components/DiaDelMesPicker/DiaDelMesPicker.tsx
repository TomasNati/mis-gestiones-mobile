import { Picker } from "@react-native-picker/picker";
import { styles } from "./DiaDelMesPicker.styles";

interface DiaDelMesPickerProps {
  dia: number;
  onDiaChange: (dia: number) => void;
  diasEnElMes: number;
}

export const DiaDelMesPicker = ({
  dia,
  diasEnElMes,
  onDiaChange,
}: DiaDelMesPickerProps) => {
  return (
    <Picker
      selectedValue={dia}
      onValueChange={onDiaChange}
      style={styles.picker}
    >
      {Array.from({ length: diasEnElMes }, (_, i) => i + 1).map((day) => (
        <Picker.Item key={day} label={day.toString()} value={day} />
      ))}
    </Picker>
  );
};
