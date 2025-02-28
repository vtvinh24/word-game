// src/screens/game/Victory.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function VictoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.victoryText}>Victory!</Text>

      <View style={styles.trophyContainer}>
        <MaterialIcons
          name="emoji-events"
          size={120}
          color="#FFD700"
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Battle Results</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Words Completed:</Text>
          <Text style={styles.statValue}>12</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Points Earned:</Text>
          <Text style={styles.statValue}>340</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Time Bonus:</Text>
          <Text style={styles.statValue}>+50</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Score:</Text>
          <Text style={styles.totalValue}>390</Text>
        </View>

        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>Rewards</Text>
          <View style={styles.rewardItems}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>🪙</Text>
              <Text style={styles.rewardValue}>+75</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>⭐</Text>
              <Text style={styles.rewardValue}>+3</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.mapButton]}
          onPress={() => navigation.navigate("Map")}
        >
          <Text style={styles.buttonText}>Return to Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={() => {
            /* Next level logic */
          }}
        >
          <Text style={styles.buttonText}>Next Level</Text>
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
  victoryText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#7d5fff",
    marginTop: 40,
  },
  trophyContainer: {
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
    color: "#7d5fff",
  },
  rewardsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  rewardItems: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rewardItem: {
    alignItems: "center",
  },
  rewardIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  rewardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a9216",
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
  mapButton: {
    backgroundColor: "#6c757d",
  },
  nextButton: {
    backgroundColor: "#7d5fff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
