import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CharacterStats from "../../components/roguelike/CharacterStats";
import SkillCard from "../../components/roguelike/SkillCard";
import NarratorBox from "../../components/roguelike/NarratorBox";
import { useGameContext } from "../../contexts/GameContext";

export default function SinglePlayerBattle({ navigation }) {
  const { gameState, updateGameState, endGame } = useGameContext();
  const [playerStats, setPlayerStats] = useState(
    gameState.playerStats || {
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      name: "Player",
    }
  );

  const [enemies, setEnemies] = useState([]);
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [narration, setNarration] = useState("Prepare for battle! Select a skill and target an enemy.");
  const [turnInProgress, setTurnInProgress] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsLoading(true);

    try {
      // Load enemies based on game level
      const gameLevel = gameState.currentLevel || 1;
      const enemyCount = Math.min(1 + Math.floor(gameLevel / 2), 6);

      const generatedEnemies = Array(enemyCount)
        .fill()
        .map((_, index) => {
          return generateEnemy(gameState.playerStats?.level || 1, index);
        });

      setEnemies(generatedEnemies);

      // Load skills from factory
      const availableSkills = loadSkills();
      if (Array.isArray(availableSkills) && availableSkills.length > 0) {
        setSkills(availableSkills);
      } else {
        // Fallback skills if loadSkills fails
        setSkills([
          {
            id: "basic-attack",
            name: "Basic Attack",
            description: "A simple attack",
            cost: "word",
            effectMin: 5,
            effectMax: 10,
            type: "damage",
          },
        ]);
        console.warn("Failed to load skills, using fallback");
      }
    } catch (error) {
      console.error("Error loading battle data:", error);
      setNarration("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }

    return () => {
      // Cleanup
    };
  }, []);

  // Generate a single enemy
  const generateEnemy = (playerLevel, position) => {
    const enemyTypes = [
      {
        name: "Goblin",
        health: 30 + playerLevel * 8,
        maxHealth: 30 + playerLevel * 8,
        strength: 4 + playerLevel * 1.5,
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "Orc",
        health: 60 + playerLevel * 12,
        maxHealth: 60 + playerLevel * 12,
        strength: 6 + playerLevel * 2,
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "Troll",
        health: 100 + playerLevel * 15,
        maxHealth: 100 + playerLevel * 15,
        strength: 8 + playerLevel * 3,
        imageUrl: "https://via.placeholder.com/100",
      },
    ];

    const randomType = Math.floor(Math.random() * enemyTypes.length);
    return {
      ...enemyTypes[randomType],
      id: `enemy-${position}`,
      position: position,
    };
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setNarration(`Selected ${skill.name}. Now choose a target.`);
  };

  const handleEnemySelect = (enemy) => {
    if (!selectedSkill) {
      setNarration("Select a skill first!");
      return;
    }

    setSelectedEnemy(enemy);
    executeSkill(selectedSkill, enemy);
  };

  const executeSkill = (skill, target) => {
    setTurnInProgress(true);

    // Calculate damage based on skill and word input
    setNarration(`Enter a ${skill.cost} to execute ${skill.name}!`);

    // This would be replaced with actual word input validation
    const damageDealt = Math.floor(Math.random() * (skill.effectMax - skill.effectMin) + skill.effectMin) * 10;

    // Apply damage to target
    const updatedEnemies = enemies.map((e) => {
      if (e.id === target.id) {
        return {
          ...e,
          health: Math.max(0, e.health - damageDealt),
        };
      }
      return e;
    });

    // Animate attack
    animateAttack(() => {
      setEnemies(updatedEnemies);
      setNarration(`You used ${skill.name} and dealt ${damageDealt} damage!`);

      // Check if enemy defeated
      const targetEnemy = updatedEnemies.find((e) => e.id === target.id);
      if (targetEnemy.health <= 0) {
        setNarration(`${target.name} has been defeated!`);

        // Check if all enemies defeated
        const remainingEnemies = updatedEnemies.filter((e) => e.health > 0);
        if (remainingEnemies.length === 0) {
          handleVictory();
          return;
        }
      }

      // Enemy turn
      setTimeout(() => {
        handleEnemyTurn(updatedEnemies.filter((e) => e.health > 0));
      }, 1000);
    });
  };

  const animateAttack = (callback) => {
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
    ]).start(callback);
  };

  const handleEnemyTurn = (activeEnemies) => {
    if (activeEnemies.length === 0) {
      setTurnInProgress(false);
      return;
    }

    // Each enemy attacks
    let totalDamage = 0;
    activeEnemies.forEach((enemy) => {
      const enemyDamage = Math.floor(enemy.strength * (0.8 + Math.random() * 0.4));
      totalDamage += enemyDamage;
    });

    // Apply damage to player
    const updatedHealth = Math.max(0, playerStats.health - totalDamage);
    setPlayerStats({
      ...playerStats,
      health: updatedHealth,
    });

    setNarration(`Enemies attack! You take ${totalDamage} damage.`);

    // Check if player defeated
    if (updatedHealth <= 0) {
      handleDefeat();
    } else {
      setTurnInProgress(false);
      setSelectedSkill(null);
      setSelectedEnemy(null);
    }
  };

  const handleVictory = () => {
    setNarration("Victory! All enemies defeated.");

    // Update game state
    updateGameState({
      ...gameState,
      victories: (gameState.victories || 0) + 1,
      playerStats: {
        ...playerStats,
        experience: playerStats.experience + 50,
      },
    });

    // Check for level up
    if (playerStats.experience + 50 >= playerStats.nextLevelExp) {
      handleLevelUp();
    }

    setTimeout(() => {
      navigation.navigate("Victory");
    }, 2000);
  };

  const handleDefeat = () => {
    setNarration("Defeat! You have been overwhelmed.");

    endGame();

    setTimeout(() => {
      navigation.navigate("GameOver");
    }, 2000);
  };

  const handleLevelUp = () => {
    const newLevel = playerStats.level + 1;
    const newMaxHealth = playerStats.maxHealth + 20;
    const newMaxMana = playerStats.maxMana + 10;

    setPlayerStats({
      ...playerStats,
      level: newLevel,
      maxHealth: newMaxHealth,
      health: newMaxHealth,
      maxMana: newMaxMana,
      mana: newMaxMana,
      experience: 0,
      nextLevelExp: playerStats.nextLevelExp + 50,
    });

    setNarration(`Level Up! You are now level ${newLevel}!`);
  };

  const enemyShakeAnimation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, 0],
  });

  // Function to load skills - would typically come from a service
  const loadSkills = () => {
    return [
      {
        id: "skill-1",
        name: "Fireball",
        description: "Launch a ball of fire at your enemy",
        cost: "long word",
        effectMin: 8,
        effectMax: 15,
        type: "damage",
        icon: "🔥",
      },
      {
        id: "skill-2",
        name: "Quick Strike",
        description: "A fast attack with moderate damage",
        cost: "short word",
        effectMin: 5,
        effectMax: 10,
        type: "damage",
        icon: "⚔️",
      },
      {
        id: "skill-3",
        name: "Heal",
        description: "Restore some health points",
        cost: "health word",
        effectMin: 10,
        effectMax: 20,
        type: "heal",
        icon: "❤️",
      },
    ];
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerSection}>
        <CharacterStats character={playerStats} />
      </View>

      <View style={styles.battleSection}>
        <NarratorBox message={narration} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#7d5fff"
            />
            <Text>Preparing battle...</Text>
          </View>
        ) : (
          <View style={styles.enemiesContainer}>
            {enemies.map((enemy, index) => (
              <TouchableOpacity
                key={enemy.id}
                onPress={() => !turnInProgress && handleEnemySelect(enemy)}
                disabled={turnInProgress || enemy.health <= 0}
              >
                <Animated.View
                  style={[
                    styles.enemyCard,
                    enemy.health <= 0 && styles.defeatedEnemy,
                    selectedEnemy?.id === enemy.id && {
                      transform: [{ translateX: enemyShakeAnimation }],
                    },
                  ]}
                >
                  <Image
                    source={{ uri: enemy.imageUrl }}
                    style={styles.enemyImage}
                  />
                  <Text style={styles.enemyName}>{enemy.name}</Text>
                  <View style={styles.healthBar}>
                    <View style={[styles.healthFill, { width: `${(enemy.health / enemy.maxHealth) * 100}%` }]} />
                  </View>
                  <Text style={styles.healthText}>
                    {enemy.health}/{enemy.maxHealth}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>Skills</Text>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="#7d5fff"
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {skills.length > 0 ? (
              skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onSelect={() => !turnInProgress && handleSkillSelect(skill)}
                  isSelected={selectedSkill?.id === skill.id}
                  disabled={turnInProgress}
                />
              ))
            ) : (
              <Text style={styles.noSkillsText}>No skills available</Text>
            )}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity
        style={[styles.fleeButton, isLoading && styles.disabledButton]}
        onPress={() => navigation.navigate("Lobby")}
        disabled={isLoading || turnInProgress}
      >
        <Text style={styles.fleeButtonText}>Flee Battle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  playerSection: {
    marginVertical: 10,
  },
  battleSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  enemiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  enemyCard: {
    width: 100,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  defeatedEnemy: {
    opacity: 0.5,
  },
  enemyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  enemyName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  healthBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  healthFill: {
    height: "100%",
    backgroundColor: "#ff5555",
  },
  healthText: {
    fontSize: 12,
    marginTop: 2,
  },
  skillsSection: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#7d5fff",
  },
  fleeButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 10,
  },
  fleeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noSkillsText: {
    padding: 20,
    fontStyle: "italic",
    color: "#666",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
