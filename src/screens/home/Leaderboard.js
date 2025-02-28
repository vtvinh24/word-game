import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("weekly"); // weekly, monthly, allTime

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const fetchLeaderboardData = async () => {
      setLoading(true);

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const data = [
        { id: "1", username: "WordMaster", score: 12458, rank: 1, avatar: "https://via.placeholder.com/60" },
        { id: "2", username: "LexiconPro", score: 10299, rank: 2, avatar: "https://via.placeholder.com/60" },
        { id: "3", username: "VocabNinja", score: 9877, rank: 3, avatar: "https://via.placeholder.com/60" },
        { id: "4", username: "SpellKing", score: 8654, rank: 4, avatar: "https://via.placeholder.com/60" },
        { id: "5", username: "WordSmith", score: 7552, rank: 5, avatar: "https://via.placeholder.com/60" },
        { id: "6", username: "LetterLord", score: 6789, rank: 6, avatar: "https://via.placeholder.com/60" },
        { id: "7", username: "SyntaxWhiz", score: 5642, rank: 7, avatar: "https://via.placeholder.com/60" },
        { id: "8", username: "GrammarGuru", score: 4532, rank: 8, avatar: "https://via.placeholder.com/60" },
        { id: "9", username: "PhraseMaster", score: 3210, rank: 9, avatar: "https://via.placeholder.com/60" },
        { id: "10", username: "VerbVictor", score: 2105, rank: 10, avatar: "https://via.placeholder.com/60" },
      ];

      setLeaderboardData(data);
      setLoading(false);
    };

    fetchLeaderboardData();
  }, [timeFrame]);

  const renderItem = ({ item }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>

      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
      />

      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.scoreText}>{item.score.toLocaleString()} pts</Text>
      </View>

      {item.rank <= 3 && (
        <MaterialIcons
          name="emoji-events"
          size={24}
          color={item.rank === 1 ? "gold" : item.rank === 2 ? "silver" : "#CD7F32"}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
      </View>

      <View style={styles.timeFrameContainer}>
        <TouchableOpacity
          style={[styles.timeFrameButton, timeFrame === "weekly" && styles.activeTimeFrame]}
          onPress={() => setTimeFrame("weekly")}
        >
          <Text style={[styles.timeFrameText, timeFrame === "weekly" && styles.activeTimeFrameText]}>Weekly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeFrameButton, timeFrame === "monthly" && styles.activeTimeFrame]}
          onPress={() => setTimeFrame("monthly")}
        >
          <Text style={[styles.timeFrameText, timeFrame === "monthly" && styles.activeTimeFrameText]}>Monthly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeFrameButton, timeFrame === "allTime" && styles.activeTimeFrame]}
          onPress={() => setTimeFrame("allTime")}
        >
          <Text style={[styles.timeFrameText, timeFrame === "allTime" && styles.activeTimeFrameText]}>All Time</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#7d5fff"
          />
        </View>
      ) : (
        <FlatList
          data={leaderboardData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#7d5fff",
    paddingVertical: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  timeFrameContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 2,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTimeFrame: {
    borderBottomWidth: 3,
    borderBottomColor: "#7d5fff",
  },
  timeFrameText: {
    fontSize: 16,
    color: "#666",
  },
  activeTimeFrameText: {
    color: "#7d5fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#7d5fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    color: "white",
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 14,
    color: "#666",
  },
});

export default LeaderboardScreen;
