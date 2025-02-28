import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { startVoiceRecognition, stopVoiceRecognition } from "../../services/ai/speechRecognition";

const WordInput = ({ onSubmit, disabled }) => {
  const [word, setWord] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = () => {
    if (word.trim().length > 0) {
      onSubmit(word.trim().toLowerCase());
      setWord("");
    }
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      setIsListening(false);
      await stopVoiceRecognition();
    } else {
      setIsListening(true);
      const started = await startVoiceRecognition(
        (text) => {
          setWord(text);
          setIsListening(false);
        },
        (error) => {
          console.error(error);
          setIsListening(false);
        }
      );
      if (!started) setIsListening(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={word}
        onChangeText={setWord}
        placeholder="Enter your word..."
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.micButton, isListening && styles.listeningButton]}
        onPress={toggleVoiceInput}
        disabled={disabled}
      >
        <MaterialIcons
          name={isListening ? "mic" : "mic-none"}
          size={24}
          color={isListening ? "#fff" : "#333"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={disabled || word.trim().length === 0}
      >
        <MaterialIcons
          name="send"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  micButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  listeningButton: {
    backgroundColor: "#ff4c4c",
  },
  submitButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#4c6bff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WordInput;
