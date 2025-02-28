import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from "react-native";
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
  const [wordHistory, setWordHistory] = useState([]);
  const [battleTimer, setBattleTimer] = useState(60); // 60 second timer

  // Decrement battle timer
  useEffect(() => {
    if (battleTimer <= 0 || !gameState.inProgress) return;

    const timer = setTimeout(() => {
      setBattleTimer(battleTimer - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [battleTimer, gameState.inProgress]);

  // Handle timer running out
  useEffect(() => {
    if (battleTimer <= 0 && gameState.inProgress) {
      handleDefeat();
    }
  }, [battleTimer]);

  const handleWordSubmit = (word) => {
    if (turnInProgress || !word) return;

    setTurnInProgress(true);

    // Add to word history
    setWordHistory((prev) => [word, ...prev.slice(0, 4)]);

    // Calculate player damage based on word
    const wordScore = calculateWordScore(word);

    // Get enemy attack value
    const enemyAttack = Math.floor(currentEnemy.strength * (0.8 + Math.random() * 0.4));

    // Update health values
    const updatedEnemyHealth = Math.max(0, currentEnemy.health - wordScore);
    const updatedPlayerHealth = Math.max(0, playerStats.health - enemyAttack);

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
    ]).start();

    // Update turn results for display
    setTurnResults({
      playerDamage: wordScore,
      enemyDamage: enemyAttack,
      word: word,
    });

    // Update state
    const updatedEnemy = {
      ...currentEnemy,
      health: updatedEnemyHealth,
    };

    const updatedPlayerStats = {
      ...playerStats,
      health: updatedPlayerHealth,
    };

    setCurrentEnemy(updatedEnemy);
    setPlayerStats(updatedPlayerStats);

    // Update global game state
    updateGameState({
      ...gameState,
      currentEnemy: updatedEnemy,
      playerStats: updatedPlayerStats,
    });

    // Check battle outcome after a short delay
    setTimeout(() => {
      setTurnInProgress(false);

      if (updatedEnemyHealth <= 0) {
        handleVictory();
      } else if (updatedPlayerHealth <= 0) {
        handleDefeat();
      }
    }, 1000);
  };

  const handleVictory = () => {
    // In a real game you would calculate rewards, XP, etc.
    const xpGained = currentEnemy.maxHealth / 2;

    const updatedPlayerStats = {
      ...playerStats,
      xp: playerStats.xp + xpGained,
      gold: playerStats.gold + Math.floor(currentEnemy.maxHealth / 3),
    };

    // Check for level up
    if (updatedPlayerStats.xp >= 100) {
      updatedPlayerStats.level += 1;
      updatedPlayerStats.xp -= 100;
      updatedPlayerStats.maxHealth += 20;
      updatedPlayerStats.health = updatedPlayerStats.maxHealth;
    }

    updateGameState({
      ...gameState,
      playerStats: updatedPlayerStats,
      victories: gameState.victories + 1,
    });

    navigation.navigate("Victory");
  };

  const handleDefeat = () => {
    updateGameState({
      ...gameState,
      inProgress: false,
    });

    navigation.navigate("GameOver");
  };

  const playerShakeAnimation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });

  const enemyShakeAnimation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>Time: {battleTimer}s</Text>
      </View>

      <View style={styles.battleContainer}>
        <View style={styles.statsContainer}>
          <CharacterStats
            title="Player"
            health={playerStats.health}
            maxHealth={playerStats.maxHealth}
            level={playerStats.level}
          />
        </View>

        <View style={styles.battleField}>
          <Animated.View style={[styles.playerContainer, { transform: [{ translateX: playerShakeAnimation }] }]}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.characterImage}
            />
            {turnResults && (
              <View style={styles.damageIndicator}>
                <Text style={styles.damageText}>{turnResults.enemyDamage}</Text>
              </View>
            )}
          </Animated.View>

          <View style={styles.versus}>
            <Text style={styles.versusText}>VS</Text>
          </View>

          <Animated.View style={[styles.enemyContainer, { transform: [{ translateX: enemyShakeAnimation }] }]}>
            <Image
              source={{ uri: currentEnemy.imageUrl }}
              style={styles.characterImage}
            />
            <Text style={styles.enemyName}>{currentEnemy.name}</Text>
            {turnResults && (
              <View style={[styles.damageIndicator, styles.enemyDamage]}>
                <Text style={styles.damageText}>{turnResults.playerDamage}</Text>
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.statsContainer}>
          <CharacterStats
            title={currentEnemy.name}
            health={currentEnemy.health}
            maxHealth={currentEnemy.maxHealth}
            isEnemy={true}
          />
        </View>
      </View>

      <View style={styles.wordHistoryContainer}>
        {wordHistory.map((word, index) => (
          <Text
            key={index}
            style={styles.historyWord}
          >
            {word}
          </Text>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <WordInput
          onSubmit={handleWordSubmit}
          disabled={turnInProgress}
        />
      </View>

      <TouchableOpacity
        style={styles.fleeButton}
        onPress={() => navigation.navigate("Lobby")}
      >
        <Text style={styles.fleeButtonText}>Flee Battle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7d5fff",
  },
  battleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  statsContainer: {
    marginVertical: 10,
  },
  battleField: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 200,
  },
  playerContainer: {
    alignItems: "center",
  },
  enemyContainer: {
    alignItems: "center",
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#7d5fff",
  },
  enemyName: {
    marginTop: 5,
    fontWeight: "bold",
  },
  versus: {
    backgroundColor: "#7d5fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  versusText: {
    color: "white",
    fontWeight: "bold",
  },
  damageIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  enemyDamage: {
    backgroundColor: "green",
  },
  damageText: {
    color: "white",
    fontWeight: "bold",
  },
  wordHistoryContainer: {
    height: 100,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  historyWord: {
    fontSize: 16,
    color: "#666",
    marginVertical: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  fleeButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  fleeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BattleScreen;
