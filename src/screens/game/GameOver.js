// src/screens/game/GameOver.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function GameOverScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.gameOverText}>Game Over</Text>

      <View style={styles.iconContainer}>
        <MaterialIcons
          name="sentiment-very-dissatisfied"
          size={100}
          color="#ff6b6b"
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Results</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Words Completed:</Text>
          <Text style={styles.statValue}>7</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Points Earned:</Text>
          <Text style={styles.statValue}>120</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Time Remaining:</Text>
          <Text style={styles.totalValue}>0s</Text>
        </View>
      </View>

      <Text style={styles.motivationalText}>Don't give up! Try again and improve your word power!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.lobbyButton]}
          onPress={() => navigation.navigate("Lobby")}
        >
          <Text style={styles.buttonText}>Back to Lobby</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.retryButton]}
          onPress={() => navigation.navigate("Battle")}
        >
          <Text style={styles.buttonText}>Retry Level</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
  },
  gameOverText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginTop: 40,
  },
  iconContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  motivationalText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
    fontStyle: "italic",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  lobbyButton: {
    backgroundColor: "#6c757d",
  },
  retryButton: {
    backgroundColor: "#7d5fff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
