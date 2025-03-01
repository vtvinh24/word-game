// src/screens/home/Home.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGameContext } from "../../contexts/GameContext";

// Game Mode component that expands/collapses
const GameModeSection = ({ title, description, icon, stats, onPlay, isLocked = false }) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0]; // Ensure animation value persists between renders

  const toggleExpand = () => {
    if (isLocked) return;

    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Change the height range to ensure content is visible when expanded
  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // Increased to accommodate all content
  });

  return (
    <View style={styles.modeContainer}>
      <TouchableOpacity
        style={[styles.modeBreadcrumb, expanded && styles.modeBreadcrumbActive, isLocked && styles.modeBreadcrumbLocked]}
        onPress={toggleExpand}
        activeOpacity={0.7} // Add feedback when pressing
      >
        <View style={styles.modeHeaderLeft}>
          <MaterialIcons
            name={icon}
            size={24}
            color={isLocked ? "#aaa" : "#7d5fff"}
          />
          <Text style={[styles.modeTitle, isLocked && styles.modeTitleLocked]}>
            {title}
            {isLocked && " (Locked)"}
          </Text>
        </View>

        <MaterialIcons
          name={expanded ? "expand-less" : "expand-more"}
          size={24}
          color={isLocked ? "#aaa" : "#666"}
        />
      </TouchableOpacity>

      {/* This is the key fix - render content conditionally rather than just hiding it */}
      {expanded && (
        <Animated.View style={[styles.modeContent, { maxHeight }]}>
          <Text style={styles.modeDescription}>{description}</Text>

          {stats && (
            <View style={styles.modeStats}>
              {Object.entries(stats).map(([key, value]) => (
                <View
                  key={key}
                  style={styles.statItem}
                >
                  <Text style={styles.statLabel}>{key}: </Text>
                  <Text style={styles.statValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.playButton}
            onPress={onPlay}
          >
            <Text style={styles.playButtonText}>Play</Text>
            <MaterialIcons
              name="play-arrow"
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const { gameState } = useGameContext();

  // Game mode definitions
  const gameModes = [
    {
      id: "singleplayer",
      title: "Singleplayer",
      description: "Test your word skills against AI opponents in this engaging single-player adventure. Defeat enemies using clever wordplay and strategic thinking.",
      icon: "person",
      stats: {
        "Games Played": gameState?.singleplayerStats?.gamesPlayed || 0,
        "Victories": gameState?.singleplayerStats?.victories || 0,
        "Win Rate": gameState?.singleplayerStats?.gamesPlayed ? `${Math.round((gameState.singleplayerStats.victories / gameState.singleplayerStats.gamesPlayed) * 100)}%` : "0%",
      },
      onPlay: () => navigation.navigate("Game", { screen: "Singleplayer" }),
      isLocked: false,
    },
    {
      id: "multiplayer",
      title: "Multiplayer",
      description: "Challenge friends or random opponents in word duels. Craft the most impressive words to claim victory in real-time battles.",
      icon: "groups",
      stats: {
        "Games Played": gameState?.multiplayerStats?.gamesPlayed || 0,
        "Victories": gameState?.multiplayerStats?.victories || 0,
        "Win Rate": gameState?.multiplayerStats?.gamesPlayed ? `${Math.round((gameState.multiplayerStats.victories / gameState.multiplayerStats.gamesPlayed) * 100)}%` : "0%",
      },
      onPlay: () => navigation.navigate("Battle"),
      isLocked: false,
    },
    {
      id: "campaign",
      title: "Campaign",
      description: "Embark on an epic word adventure through multiple levels with increasing difficulty and unique challenges.",
      icon: "auto-stories",
      stats: {
        "Level": gameState?.campaignStats?.level || 1,
        "Chapters Completed": gameState?.campaignStats?.chaptersCompleted || 0,
        "Total Score": gameState?.campaignStats?.totalScore || 0,
      },
      onPlay: () => navigation.navigate("Map"),
      isLocked: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Word Game</Text>
        <Text style={styles.subtitle}>Select a Game Mode</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {gameModes.map((mode) => (
          <GameModeSection
            key={mode.id}
            title={mode.title}
            description={mode.description}
            icon={mode.icon}
            stats={mode.stats}
            onPlay={mode.onPlay}
            isLocked={mode.isLocked}
          />
        ))}

        <View style={styles.dailyChallenge}>
          <View style={styles.dailyChallengeHeader}>
            <MaterialIcons
              name="event"
              size={24}
              color="white"
            />
            <Text style={styles.dailyChallengeTitle}>Daily Challenge</Text>
          </View>
          <Text style={styles.dailyChallengeDescription}>A new word challenge every day. Complete today's challenge to earn bonus rewards!</Text>
          <TouchableOpacity style={styles.dailyChallengeButton}>
            <Text style={styles.dailyChallengeButtonText}>Play Today's Challenge</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#7d5fff",
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollView: {
    padding: 15,
  },
  modeContainer: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modeBreadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modeBreadcrumbActive: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "rgba(125, 95, 255, 0.1)",
  },
  modeBreadcrumbLocked: {
    backgroundColor: "#f7f7f7",
  },
  modeHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  modeTitleLocked: {
    color: "#aaa",
  },
  modeContent: {
    overflow: "hidden",
    paddingHorizontal: 15,
  },
  modeDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    marginBottom: 15,
    lineHeight: 20,
  },
  modeStats: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
  },
  statItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  playButton: {
    backgroundColor: "#7d5fff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  playButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  dailyChallenge: {
    backgroundColor: "#5a9216",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dailyChallengeHeader: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  dailyChallengeTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  dailyChallengeDescription: {
    padding: 15,
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  dailyChallengeButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    margin: 15,
    marginTop: 0,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  dailyChallengeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
