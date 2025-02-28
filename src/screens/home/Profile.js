import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { GameContext } from "../../contexts/GameContext";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const { gameState } = useContext(GameContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch the profile data from an API
    setStats({
      totalGames: 42,
      victories: 28,
      winRate: "66.7%",
      highestScore: 1250,
      wordsPlayed: 876,
      longestWord: "extraordinary",
    });
  }, []);

  if (!stats)
    return (
      <View style={styles.loading}>
        <Text>Loading profile data...</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{gameState.playerName || "Player"}</Text>
        <Text style={styles.level}>Level {gameState.playerStats?.level || 1}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Game Statistics</Text>

        <View style={styles.statRow}>
          <MaterialIcons
            name="sports-esports"
            size={24}
            color="#7d5fff"
          />
          <Text style={styles.statLabel}>Total Games</Text>
          <Text style={styles.statValue}>{stats.totalGames}</Text>
        </View>

        <View style={styles.statRow}>
          <MaterialIcons
            name="emoji-events"
            size={24}
            color="#7d5fff"
          />
          <Text style={styles.statLabel}>Victories</Text>
          <Text style={styles.statValue}>{stats.victories}</Text>
        </View>

        <View style={styles.statRow}>
          <MaterialIcons
            name="trending-up"
            size={24}
            color="#7d5fff"
          />
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={styles.statValue}>{stats.winRate}</Text>
        </View>

        <View style={styles.statRow}>
          <MaterialIcons
            name="stars"
            size={24}
            color="#7d5fff"
          />
          <Text style={styles.statLabel}>Highest Score</Text>
          <Text style={styles.statValue}>{stats.highestScore}</Text>
        </View>

        <View style={styles.statRow}>
          <MaterialIcons
            name="text-fields"
            size={24}
            color="#7d5fff"
          />
          <Text style={styles.statLabel}>Words Played</Text>
          <Text style={styles.statValue}>{stats.wordsPlayed}</Text>
        </View>

        <View style={styles.statRow}>
          <MaterialIcons
            name="format-size"
            size={24}
            color="#7d5fff"
          />
          <Text style={styles.statLabel}>Longest Word</Text>
          <Text style={styles.statValue}>{stats.longestWord}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  level: {
    fontSize: 18,
    color: "#7d5fff",
    fontWeight: "500",
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#7d5fff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
