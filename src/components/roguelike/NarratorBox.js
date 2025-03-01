// src/components/roguelike/NarratorBox.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NarratorBox({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  text: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 16,
  },
});
