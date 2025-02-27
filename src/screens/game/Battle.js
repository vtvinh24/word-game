import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { GameContext } from "../../contexts/GameContext";
import WordInput from "../../components/game/WordInput";
import CharacterStats from "../../components/roguelike/CharacterStats";
import { processTurn } from "../../services/game/battle";
import { calculateWordScore } from "../../services/game/stats";

const BattleScreen = ({ navigation }) => {
  const { gameState, updateGameState } = useContext(GameContext);
  const [currentEnemy, setCurrentEnemy] = useState(gameState.currentEnemy);
  const [playerStats, setPlayerStats] = useState(gameState.playerStats);
  const [turnResults, setTurnResults] = useState(null);
  const [turnInProgress, setTurnInProgress] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const handleWordSubmit = (word) => {
    if (turnInProgress) return;

    setTurnInProgress(true);

    // Simulate word validation (in a real app, this would check with the server)
    setTimeout(() => {
      const wordData = {
        text: word,
        timeSpent: 10, // This would be tracked in a real app
        isValid: true, // This would be validated by the server
      };

      if (wordData.isValid) {
        const result = processTurn(wordData, currentEnemy, playerStats);
        setTurnResults(result.turnResults);
        setPlayerStats(result.playerStats);
        setCurrentEnemy(result.enemyStats);

        // Animate attack
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Check battle outcome
          if (result.enemyStats.health <= 0) {
            // Enemy defeated
            setTimeout(() => {
              updateGameState({
                ...gameState,
                playerStats: result.playerStats,
                score: gameState.score + calculateWordScore(word, gameState.difficulty, 10),
                enemiesDefeated: gameState.enemiesDefeated + 1,
              });
              navigation.navigate("Victory");
            }, 1000);
          } else if (result.playerStats.health <= 0) {
            // Player defeated
            setTimeout(() => {
              navigation.navigate("GameOver");
            }, 1000);
          } else {
            setTurnInProgress(false);
          }
        });
      } else {
        // Invalid word
        setTurnInProgress(false);
      }
    }, 500);
  };

  // Player attack animation
  const playerAttackAnimation = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 50, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.battleArea}>
        <View style={styles.enemyContainer}>
          <Text style={styles.enemyName}>{currentEnemy.name}</Text>
          <View style={styles.healthBar}>
            <View style={[styles.healthFill, { width: `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` }]} />
          </View>
          <Text style={styles.healthText}>
            {currentEnemy.health}/{currentEnemy.maxHealth}
          </Text>
          <Image
            source={{ uri: currentEnemy.imageUrl || "https://via.placeholder.com/150" }}
            style={styles.enemyImage}
          />
        </View>

        <Animated.View style={[styles.playerContainer, playerAttackAnimation]}>
          <CharacterStats character={playerStats} />
        </Animated.View>
      </View>

      {turnResults && (
        <View style={styles.turnResults}>
          <Text style={styles.turnText}>
            You dealt {turnResults.playerDamage} damage
            {turnResults.isCritical && " (Critical!)"}
          </Text>
          {turnResults.enemyDamage > 0 && <Text style={styles.turnText}>Enemy dealt {turnResults.enemyDamage} damage</Text>}
        </View>
      )}

      <WordInput
        onSubmit={handleWordSubmit}
        disabled={turnInProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  battleArea: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  enemyContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  enemyName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  healthBar: {
    width: "100%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 5,
  },
  healthFill: {
    height: "100%",
    backgroundColor: "#ff5555",
  },
  healthText: {
    fontSize: 16,
    marginBottom: 20,
  },
  enemyImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  playerContainer: {
    width: "100%",
  },
  turnResults: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  turnText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BattleScreen;
