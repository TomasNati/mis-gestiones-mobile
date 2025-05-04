import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./TimePicker.styles";

interface TimePickerProps {
  time?: string;
  onTimeChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  time,
  onTimeChange,
}) => {
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");

  useEffect(() => {
    if (time && /^\d{2}:\d{2}$/.test(time)) {
      const [hh, mm] = time.split(":");
      setHours(hh);
      setMinutes(mm);
    }
  }, [time]);

  const onTimeChangeHandler = () => {
    if (hours.length === 2 && minutes.length === 2) {
      const hh = parseInt(hours, 10);
      const mm = parseInt(minutes, 10);

      if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
        onTimeChange(`${hours}:${minutes}`);
      }
    }
  };

  const handleHoursChange = (text: string) => {
    if (/^\d{0,2}$/.test(text)) {
      setHours(text);
      onTimeChangeHandler();
    }
  };
  const handleMinutesChange = (text: string) => {
    if (/^\d{0,2}$/.test(text)) {
      setMinutes(text);
      onTimeChangeHandler();
    }
  };

  return (
    <View style={styles.container}>
      {/* Hours Input */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={2}
        placeholder="hh"
        value={hours}
        onChangeText={handleHoursChange}
      />
      <Text style={styles.colon}>:</Text>
      {/* Minutes Input */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={2}
        placeholder="mm"
        value={minutes}
        onChangeText={handleMinutesChange}
      />
    </View>
  );
};
