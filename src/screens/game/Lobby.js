// src/screens/game/Lobby.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

const mockGames = [
  { id: "1", name: "Quick Match", players: "2/2", difficulty: "Easy" },
  { id: "2", name: "Word Masters", players: "1/4", difficulty: "Hard" },
  { id: "3", name: "Vocabulary Battle", players: "0/2", difficulty: "Medium" },
];

export default function LobbyScreen({ navigation }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const renderGameItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.gameItem, selectedGame === item.id && styles.selectedGame]}
      onPress={() => setSelectedGame(item.id)}
    >
      <Text style={styles.gameName}>{item.name}</Text>
      <Text style={styles.gameInfo}>Players: {item.players}</Text>
      <Text style={styles.gameInfo}>Difficulty: {item.difficulty}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Lobby</Text>

      <View style={styles.gamesContainer}>
        <Text style={styles.sectionTitle}>Available Games</Text>
        <FlatList
          data={mockGames}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id}
          style={styles.gamesList}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            /* Create game logic */
          }}
        >
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.joinButton, !selectedGame && styles.disabledButton]}
          disabled={!selectedGame}
          onPress={() => navigation.navigate("Battle")}
        >
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7d5fff",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  gamesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gamesList: {
    flex: 1,
  },
  gameItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedGame: {
    borderColor: "#7d5fff",
    borderWidth: 2,
    backgroundColor: "#f0eaff",
  },
  gameName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  gameInfo: {
    fontSize: 14,
    color: "#666",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: "#7d5fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#5a9216",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
