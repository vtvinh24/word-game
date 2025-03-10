import React, { useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated, ActivityIndicator } from "react-native";
import { useGameContext } from "../../contexts/GameContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function SinglePlayerBattle({ navigation }) {
  const { gameState, updateGameState, endGame, generateBattleEnemies, updateBattleState, setBattleNarration, processEntityStatusEffects } = useGameContext();

  // const {
  //   playerStats,
  //   battleState = {
  //     enemies: [],
  //     selectedEnemy: null,
  //     skills: [],
  //     selectedSkill: null,
  //     narration: "Prepare for battle! Select a skill and target an enemy.",
  //     turnInProgress: false,
  //     recentSkills: [],
  //     statusMessages: [],
  //     skillCooldowns: {},
  //     turnCount: 1,
  //     battleLog: [],
  //     isLoading: true,
  //   },
  // } = gameState;
  const { playerStats, battleState } = gameState;

  const { enemies, selectedEnemy, skills, selectedSkill, narration, turnInProgress, recentSkills, statusMessages, skillCooldowns, turnCount, battleLog, isLoading } = battleState || {};

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize battle when component mounts
    const initBattle = async () => {
      try {
        await generateBattleEnemies(playerStats.level);
      } catch (error) {
        console.error("Error initializing battle:", error);
        setBattleNarration("Error loading battle resources!");
      }
    };

    if (battleState.isLoading) {
      initBattle();
    }
  }, []);

  const handleSkillSelect = (skill) => {
    // If skill is on cooldown, show message
    if (skillCooldowns[skill.id] && skillCooldowns[skill.id] > 0) {
      setBattleNarration(`${skill.name} is on cooldown for ${skillCooldowns[skill.id]} more turns.`);
      return;
    }

    // If not enough mana, show message
    if (skill.manaCost && playerStats.mana < skill.manaCost) {
      setBattleNarration(`Not enough mana to use ${skill.name}. Need ${skill.manaCost} mana.`);
      return;
    }

    // Store the selected skill in a local variable for immediate use
    const newSelectedSkill = skill;

    updateBattleState({ selectedSkill: newSelectedSkill });
    setBattleNarration(`Selected skill: ${newSelectedSkill.name}. Now choose a target.`);

    // If skill targets all enemies or doesn't need a target, execute immediately
    if (newSelectedSkill.targetType === "all_enemies") {
      executeSkill(
        newSelectedSkill,
        enemies.filter((e) => e.health > 0)
      );
    } else if (newSelectedSkill.targetType === "self") {
      executeSkill(newSelectedSkill, playerStats);
    }
    console.log(`Selected ${skill.name}`);
  };

  const handleEnemySelect = (enemy) => {
    // Use the battle state's selectedSkill directly and make sure it exists
    const currentSelectedSkill = battleState.selectedSkill;
    console.log(`Current selected skill: ${currentSelectedSkill}`);

    if (!currentSelectedSkill) {
      setBattleNarration("Select a skill first!");
      return;
    }

    if (enemy.health <= 0) {
      setBattleNarration("This enemy has already been defeated!");
      return;
    }

    updateBattleState({ selectedEnemy: enemy });
    executeSkill(currentSelectedSkill, enemy);
  };

  // Helper function to update recent skills
  const updateRecentSkills = (usedSkill) => {
    // Keep track of recently used skills (for quick casting)
    const skillExists = recentSkills.find((s) => s.id === usedSkill.id);
    if (!skillExists) {
      // Add to recent skills (up to 3)
      const updated = [usedSkill, ...recentSkills.slice(0, 2)];
      updateBattleState({ recentSkills: updated });
    }
  };

  // Process turn for all entities (player and enemies)
  const processTurn = () => {
    const messages = [];
    const updatedEnemies = [...enemies];
    let updatedPlayerStats = { ...playerStats };

    // 1. Process player status effects
    if (Array.isArray(playerStats.statusEffects) && playerStats.statusEffects.length > 0) {
      const playerEffectResults = processEntityStatusEffects(playerStats);
      updatedPlayerStats = playerEffectResults.entity;
      messages.push(...playerEffectResults.messages);
    }

    // 2. Process enemy status effects
    updatedEnemies.forEach((enemy, index) => {
      if (enemy.health <= 0) return; // Skip dead enemies

      if (Array.isArray(enemy.statusEffects) && enemy.statusEffects.length > 0) {
        const enemyEffectResults = processEntityStatusEffects(enemy);
        updatedEnemies[index] = enemyEffectResults.entity;
        messages.push(...enemyEffectResults.messages);
      }
    });

    // 3. Decrement skill cooldowns
    const updatedCooldowns = { ...skillCooldowns };
    Object.keys(updatedCooldowns).forEach((skillId) => {
      if (updatedCooldowns[skillId] > 0) {
        updatedCooldowns[skillId]--;
      }
    });

    // 4. Update game state with processed entities
    updateGameState({
      ...gameState,
      playerStats: updatedPlayerStats,
      battleState: {
        ...battleState,
        enemies: updatedEnemies,
        skillCooldowns: updatedCooldowns,
        statusMessages: messages,
      },
    });

    // 5. Check for any deaths from status effects
    const defeatedFromEffects = updatedEnemies.filter((e) => e.health <= 0 && e.health > 0);
    if (defeatedFromEffects.length > 0) {
      const defeatMessage = `${defeatedFromEffects.map((e) => e.name).join(", ")} ${defeatedFromEffects.length === 1 ? "was" : "were"} defeated by status effects!`;
      messages.push(defeatMessage);

      // Check if all enemies are defeated
      if (updatedEnemies.every((e) => e.health <= 0)) {
        handleVictory();
        return;
      }
    }

    // If player died from status effects
    if (updatedPlayerStats.health <= 0 && playerStats.health > 0) {
      messages.push("You succumbed to your wounds!");
      handleDefeat();
      return;
    }

    // Update narration and battle log
    if (messages.length > 0) {
      setBattleNarration(messages.join(" "));

      const updatedLog = [...battleLog, { turn: turnCount, messages }];

      updateBattleState({
        battleLog: updatedLog,
        turnCount: turnCount + 1,
        turnInProgress: false,
      });
    } else {
      updateBattleState({
        turnCount: turnCount + 1,
        turnInProgress: false,
      });
    }
  };

  const executeSkill = (skill, target) => {
    updateBattleState({ turnInProgress: true });

    // Use the Skill class methods directly
    const result = skill.use(playerStats, target);

    if (!result.success) {
      setBattleNarration(result.message || "Could not use that skill!");
      updateBattleState({ turnInProgress: false });
      return;
    }

    // Update player stats
    updateGameState({
      ...gameState,
      playerStats: {
        ...playerStats,
        mana: Math.max(0, playerStats.mana - skill.manaCost),
      },
    });

    // Set skill on cooldown
    updateBattleState({
      skillCooldowns: {
        ...skillCooldowns,
        [skill.id]: skill.cooldown,
      },
    });

    // Update recent skills
    updateRecentSkills(skill);

    // Process results
    const narrativeText = result.results.map((r) => r.effects.map((e) => e.message).join(" ")).join(" ");
    setBattleNarration(narrativeText);

    // Animate attack
    animateAttack(() => {
      // Check if any enemies defeated
      const updatedEnemies = [...enemies];
      const defeatedEnemies = updatedEnemies.filter((e) => e.health <= 0);

      if (defeatedEnemies.length > 0) {
        const defeatedNames = defeatedEnemies.map((e) => e.name).join(", ");
        setBattleNarration((prev) => `${prev} ${defeatedNames} has been defeated!`);

        // Check if all enemies defeated
        if (updatedEnemies.every((e) => e.health <= 0)) {
          handleVictory();
          return;
        }
      }

      // Process turn and enemy attacks
      processTurn();
      setTimeout(() => {
        handleEnemyTurn(updatedEnemies.filter((e) => e.health > 0));
      }, 1000);
    });
  };

  const animateAttack = (callback) => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(callback);
  };

  const handleEnemyTurn = (activeEnemies) => {
    if (activeEnemies.length === 0) {
      updateBattleState({ turnInProgress: false });
      return;
    }

    // Each enemy attacks
    let totalDamage = 0;
    const attackMessages = [];
    activeEnemies.forEach((enemy) => {
      const enemyDamage = Math.floor(enemy.strength * (0.8 + Math.random() * 0.4));
      totalDamage += enemyDamage;
      attackMessages.push(`${enemy.name} attacks for ${enemyDamage} damage!`);
    });

    // Update player health
    const updatedHealth = Math.max(0, playerStats.health - totalDamage);
    updateGameState({
      ...gameState,
      playerStats: {
        ...playerStats,
        health: updatedHealth,
      },
    });

    setBattleNarration(attackMessages.join(" "));

    // Check if player defeated
    if (updatedHealth <= 0) {
      handleDefeat();
    } else {
      // Process status effects at the end of enemy turn
      setTimeout(() => {
        processTurn();
        updateBattleState({
          selectedSkill: null,
          selectedEnemy: null,
        });
      }, 1000);
    }
  };

  const handleVictory = () => {
    setBattleNarration("Victory! All enemies defeated.");

    // Experience gain based on enemy levels
    const expGain = enemies.reduce((total, enemy) => {
      return total + (enemy.level || 1) * 10;
    }, 50);

    // Check if player levels up
    const updatedPlayerStats = { ...playerStats };
    updatedPlayerStats.experience += expGain;

    // Level up check
    if (updatedPlayerStats.experience >= updatedPlayerStats.nextLevelExp) {
      updatedPlayerStats.level += 1;
      updatedPlayerStats.experience -= updatedPlayerStats.nextLevelExp;
      updatedPlayerStats.nextLevelExp = Math.floor(updatedPlayerStats.nextLevelExp * 1.5);
      updatedPlayerStats.maxHealth += 20;
      updatedPlayerStats.health = updatedPlayerStats.maxHealth;
      updatedPlayerStats.maxMana += 10;
      updatedPlayerStats.mana = updatedPlayerStats.maxMana;
      updatedPlayerStats.strength += 2;
      updatedPlayerStats.intelligence += 2;
      updatedPlayerStats.dexterity += 2;

      setBattleNarration(`Victory! Gained ${expGain} XP. Level Up! You are now level ${updatedPlayerStats.level}!`);
    } else {
      setBattleNarration(`Victory! Gained ${expGain} XP.`);
    }

    updateGameState({
      ...gameState,
      playerStats: updatedPlayerStats,
      score: gameState.score + 100,
      enemiesDefeated: (gameState.enemiesDefeated || 0) + enemies.length,
    });

    setTimeout(() => {
      navigation.navigate("Victory");
    }, 2000);
  };

  const handleDefeat = () => {
    setBattleNarration("You have been defeated!");

    updateGameState({
      ...gameState,
      playerStats: {
        ...playerStats,
        health: 0,
      },
    });

    setTimeout(() => {
      endGame();
      navigation.navigate("GameOver");
    }, 2000);
  };

  // Render status effects in the UI
  const renderStatusEffects = (entity) => {
    if (!entity.statusEffects || entity.statusEffects.length === 0) return null;

    return (
      <View style={styles.statusEffectsContainer}>
        {entity.statusEffects.map((effect, idx) => (
          <View
            key={idx}
            style={[styles.statusEffect, effect.type === "poison" && styles.poisonEffect, effect.type === "heal" && styles.healEffect, effect.type === "burn" && styles.burnEffect]}
          >
            <Text style={styles.statusEffectText}>
              {effect.name} ({effect.duration})
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const enemyShakeAnimation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, 0],
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#7d5fff"
        />
        <Text>Preparing for battle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Player Stats Section */}
      <View style={styles.playerSection}>
        <Text style={styles.playerName}>
          {playerStats.name} - Level {playerStats.level}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statBar}>
            <View style={[styles.healthBar, { width: "100%" }]}>
              <View style={[styles.healthFill, { width: `${(playerStats.health / playerStats.maxHealth) * 100}%` }]} />
            </View>
            <Text style={styles.statText}>
              HP: {playerStats.health}/{playerStats.maxHealth}
            </Text>
          </View>
          <View style={styles.statBar}>
            <View style={[styles.manaBar, { width: "100%" }]}>
              <View style={[styles.manaFill, { width: `${(playerStats.mana / playerStats.maxMana) * 100}%` }]} />
            </View>
            <Text style={styles.statText}>
              MP: {playerStats.mana}/{playerStats.maxMana}
            </Text>
          </View>
        </View>
        {renderStatusEffects(playerStats)}
      </View>

      {/* Enemy Section */}
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
              {renderStatusEffects(enemy)}
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Narrator Section */}
      <View style={styles.narratorSection}>
        <Text style={styles.narratorText}>{narration}</Text>
      </View>

      {/* Skills Section */}
      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <ScrollView
          horizontal
          style={styles.skillsScrollView}
          showsHorizontalScrollIndicator={false}
        >
          {skills.length > 0 ? (
            skills.map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={[
                  styles.skillButton,
                  selectedSkill?.id === skill.id && styles.selectedSkill,
                  skillCooldowns[skill.id] > 0 && styles.cooldownSkill,
                  skill.manaCost > playerStats.mana && styles.unavailableSkill,
                ]}
                onPress={() => !turnInProgress && handleSkillSelect(skill)}
                disabled={turnInProgress || skillCooldowns[skill.id] > 0 || skill.manaCost > playerStats.mana}
              >
                <Text style={styles.skillName}>{skill.name}</Text>
                {skill.manaCost > 0 && <Text style={styles.skillCost}>MP: {skill.manaCost}</Text>}
                {skillCooldowns[skill.id] > 0 && (
                  <View style={styles.cooldownOverlay}>
                    <Text style={styles.cooldownText}>{skillCooldowns[skill.id]}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noSkillsText}>No skills available</Text>
          )}
        </ScrollView>
      </View>

      {/* Quick Skills (Recent) */}
      {recentSkills.length > 0 && (
        <View style={styles.quickSkillsSection}>
          <Text style={styles.sectionTitle}>Quick Cast</Text>
          <View style={styles.quickSkillsContainer}>
            {recentSkills.map((skill) => (
              <TouchableOpacity
                key={`quick-${skill.id}`}
                style={[styles.quickSkillButton, skillCooldowns[skill.id] > 0 && styles.cooldownSkill, skill.manaCost > playerStats.mana && styles.unavailableSkill]}
                onPress={() => !turnInProgress && handleSkillSelect(skill)}
                disabled={turnInProgress || skillCooldowns[skill.id] > 0 || skill.manaCost > playerStats.mana}
              >
                <Text style={styles.quickSkillName}>{skill.name}</Text>
                {skillCooldowns[skill.id] > 0 && (
                  <View style={styles.cooldownOverlay}>
                    <Text style={styles.cooldownText}>{skillCooldowns[skill.id]}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Battle Controls */}
      <View style={styles.gameNavigation}>
        <TouchableOpacity
          style={[styles.navButton, styles.inventoryButton]}
          onPress={() => navigation.navigate("Inventory")}
          disabled={turnInProgress}
        >
          <Icon
            name="backpack"
            size={16}
            color="white"
          />
          <Text style={styles.navButtonText}>Items</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.skillsButton]}
          onPress={() => navigation.navigate("Skills")}
          disabled={turnInProgress}
        >
          <Icon
            name="sword"
            size={16}
            color="white"
          />
          <Text style={styles.navButtonText}>Skills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.statsButton]}
          onPress={() => navigation.navigate("CharacterStats")}
          disabled={turnInProgress}
        >
          <Icon
            name="account"
            size={16}
            color="white"
          />
          <Text style={styles.navButtonText}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.fleeButton, turnInProgress && styles.disabledButton]}
          onPress={() => navigation.navigate("Map")}
          disabled={turnInProgress}
        >
          <Icon
            name="run-fast"
            size={16}
            color="white"
          />
          <Text style={styles.navButtonText}>Flee</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
    justifyContent: "space-between",
  },
  playerSection: {
    marginBottom: 10,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBar: {
    flex: 1,
    marginHorizontal: 4,
  },
  healthBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  manaBar: {
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
  manaFill: {
    height: "100%",
    backgroundColor: "#5555ff",
  },
  statText: {
    fontSize: 12,
    marginTop: 2,
  },
  enemiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
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
  healthText: {
    fontSize: 12,
    marginTop: 2,
  },
  narratorSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    // NARRATOR SECTION - Centered
    // narratorSection: {
    //   flex: 1,
    //   justifyContent: "center",
    //   marginVertical: 10,
  },
  // SKILLS SECTION - Smaller with quick cast
  skillsSection: {
    marginVertical: 10,
    maxHeight: 130,
  },
  skillsScrollView: {
    maxHeight: 90,
  },
  skillButton: {
    backgroundColor: "#7d5fff",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedSkill: {
    backgroundColor: "#4922c9",
    borderWidth: 2,
    borderColor: "#ffdd00",
  },
  cooldownSkill: {
    backgroundColor: "#9e9e9e",
    opacity: 0.7,
  },
  unavailableSkill: {
    backgroundColor: "#c55a5a",
    opacity: 0.7,
  },
  skillName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  skillCost: {
    color: "#e0e0ff",
    fontSize: 12,
    marginTop: 4,
  },
  cooldownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cooldownText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  // Quick skills section
  quickSkillsSection: {
    marginTop: 5,
    marginBottom: 10,
  },
  quickSkillsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  quickSkillButton: {
    backgroundColor: "#9c27b0",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  quickSkillName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },

  // Status effects styling
  statusEffectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  statusEffect: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: "#e0e0e0",
  },
  statusEffectText: {
    fontSize: 10,
    fontWeight: "500",
  },
  poisonEffect: {
    backgroundColor: "#a5d6a7",
  },
  healEffect: {
    backgroundColor: "#90caf9",
  },
  burnEffect: {
    backgroundColor: "#ffab91",
  },

  narratorText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    color: "#333",
    lineHeight: 20,
  },
  skillsScrollView: {
    maxHeight: 90,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#7d5fff",
  },
  noSkillsText: {
    padding: 20,
    fontStyle: "italic",
    color: "#666",
  },
  // GAME NAVIGATION - Bottom controls with Skills button
  gameNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 4, // Reduced from 5 to fit 4 buttons
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 12, // Smaller text for 4 buttons
  },
  inventoryButton: {
    backgroundColor: "#4CAF50", // Green
  },
  skillsButton: {
    backgroundColor: "#9C27B0", // Purple
  },
  fleeButton: {
    backgroundColor: "#ff5252", // Red
  },
  statsButton: {
    backgroundColor: "#2196F3", // Blue
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
