import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import Mexp from "math-expression-evaluator";

const mexp = new Mexp();

interface MontoProps {
  initialValue?: string; // Optional initial value
  onValueChange: (value: number | null) => void; // Callback to return the decimal value
}

export const Monto = ({ initialValue = "", onValueChange }: MontoProps) => {
  const [inputValue, setInputValue] = useState<string>(initialValue || "");
  const [formulaValue, setFormulaValue] = useState<string>(initialValue || "");
  const [previousInputValue, setPreviousInputValue] = useState<string>(
    initialValue || ""
  );

  useEffect(() => {
    setInputValue(initialValue || "");
    setFormulaValue(initialValue || "");
    setPreviousInputValue(initialValue || "");
  }, [initialValue]);

  const handleChange = (text: string): void => {
    const valueToEval = text.startsWith("#") ? text.slice(1) : text;
    try {
      const result = mexp.eval(valueToEval); // Evaluate the expression
      if (!isNaN(result)) {
        setFormulaValue(result.toFixed(2)); // Update input value with result rounded to two decimals
      }
    } catch (error) {
      setFormulaValue(""); // Display error if evaluation fails
    }
    setInputValue(text);
  };

  const handleBlur = () => {
    setPreviousInputValue(inputValue);
    setInputValue(formulaValue || "");
    onValueChange(formulaValue ? parseFloat(formulaValue) : null);
  };

  const handleFocus = () => {
    setInputValue(previousInputValue);
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === ",") {
      const caretPosition = inputValue.length; // Get the current length of the input
      const newValue =
        inputValue.slice(0, caretPosition) +
        "." +
        inputValue.slice(caretPosition);
      setInputValue(newValue);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el monto"
        value={inputValue}
        onKeyPress={handleKeyPress} // Handle key press
        onChangeText={handleChange}
        keyboardType="phone-pad" // Use phone-pad keyboard
        onBlur={handleBlur} // Handle focus out
        onFocus={handleFocus} // Handle focus in
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
