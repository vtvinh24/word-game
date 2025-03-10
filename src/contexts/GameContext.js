import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadSkills } from "../services/game/skills";

export const GameContext = createContext();

const initialGameState = {
  inProgress: false,
  roomId: null,
  playerStats: {
    name: "Hero",
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    strength: 10,
    intelligence: 10,
    dexterity: 10,
    experience: 0,
    nextLevelExp: 100,
    turns: 0,
    statusEffects: [],
  },
  difficulty: "medium",
  currentEnemy: null,
  score: 0,
  enemiesDefeated: 0,
  words: [],
  gameMode: "classic",

  // Battle-specific state
  battleState: {
    enemies: [],
    selectedEnemy: null,
    skills: [],
    selectedSkill: null,
    narration: "Prepare for battle! Select a skill and target an enemy.",
    turnInProgress: false,
    recentSkills: [],
    statusMessages: [],
    skillCooldowns: {},
    turnCount: 1,
    battleLog: [],
    isLoading: true,
  },
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState);
  const [loading, setLoading] = useState(true);

  // Load saved game state on startup
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("gameState");
        if (savedState) {
          setGameState(JSON.parse(savedState));
        }
      } catch (error) {
        console.error("Failed to load game state:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGameState();
  }, []);

  // Save game state when it changes
  useEffect(() => {
    const saveGameState = async () => {
      try {
        await AsyncStorage.setItem("gameState", JSON.stringify(gameState));
      } catch (error) {
        console.error("Failed to save game state:", error);
      }
    };

    if (!loading) {
      saveGameState();
    }
  }, [gameState, loading]);

  const startNewGame = (settings) => {
    const newState = {
      ...initialGameState,
      inProgress: true,
      roomId: settings.roomId || null,
      difficulty: settings.difficulty || "medium",
      gameMode: settings.gameMode || "classic",
      currentEnemy: generateEnemy(1),
    };
    setGameState(newState);
  };

  const updateGameState = (newState) => {
    setGameState(newState);
  };

  const endGame = () => {
    setGameState({
      ...gameState,
      inProgress: false,
    });
  };

  // Generate a random enemy based on player level
  const generateEnemy = (playerLevel) => {
    const enemies = [
      {
        name: "Goblin",
        health: 50 + playerLevel * 10,
        maxHealth: 50 + playerLevel * 10,
        strength: 5 + playerLevel * 2,
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Orc",
        health: 80 + playerLevel * 15,
        maxHealth: 80 + playerLevel * 15,
        strength: 8 + playerLevel * 3,
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Troll",
        health: 120 + playerLevel * 20,
        maxHealth: 120 + playerLevel * 20,
        strength: 12 + playerLevel * 4,
        imageUrl: "https://via.placeholder.com/150",
      },
    ];

    const randomIndex = Math.floor(Math.random() * enemies.length);
    return enemies[randomIndex];
  };

  // Generate multiple enemies for battle
  const generateBattleEnemies = async (playerLevel) => {
    // Generate enemies based on player level
    const enemyCount = Math.min(3, 1 + Math.floor(playerLevel / 3));
    const generatedEnemies = [];

    for (let i = 0; i < enemyCount; i++) {
      generatedEnemies.push(generateSingleEnemy(playerLevel, i));
    }

    // Also load skills for battle
    const loadedSkills = await loadSkills(playerLevel);

    // Update battle state
    updateGameState({
      ...gameState,
      battleState: {
        ...gameState.battleState,
        enemies: generatedEnemies,
        skills: loadedSkills,
        isLoading: false,
        turnCount: 1,
        battleLog: [],
        recentSkills: [],
        skillCooldowns: {},
        narration: "Prepare for battle! Select a skill and target an enemy.",
      },
    });

    return { enemies: generatedEnemies, skills: loadedSkills };
  };

  // Generate a single enemy for battle
  const generateSingleEnemy = (playerLevel, position) => {
    const enemyTypes = [
      {
        name: "Goblin",
        health: 30 + playerLevel * 8,
        maxHealth: 30 + playerLevel * 8,
        strength: 4 + playerLevel * 1.5,
        intelligence: 2 + playerLevel,
        dexterity: 3 + playerLevel,
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "Orc",
        health: 50 + playerLevel * 10,
        maxHealth: 50 + playerLevel * 10,
        strength: 6 + playerLevel * 2,
        intelligence: 1 + playerLevel * 0.5,
        dexterity: 2 + playerLevel,
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "Troll",
        health: 70 + playerLevel * 15,
        maxHealth: 70 + playerLevel * 15,
        strength: 8 + playerLevel * 2.5,
        intelligence: 1 + playerLevel * 0.3,
        dexterity: 1 + playerLevel * 0.5,
        imageUrl: "https://via.placeholder.com/100",
      },
    ];

    const randomType = Math.floor(Math.random() * enemyTypes.length);
    return {
      ...enemyTypes[randomType],
      id: `enemy-${position}`,
      position: position,
      statusEffects: [], // Initialize empty status effects array
    };
  };

  // Set battle narration
  const setBattleNarration = (message) => {
    updateGameState({
      ...gameState,
      battleState: {
        ...gameState.battleState,
        narration: message,
      },
    });
  };

  // Update battle state - handles changes to battle-specific state
  const updateBattleState = (updates) => {
    updateGameState({
      ...gameState,
      battleState: {
        ...gameState.battleState,
        ...updates,
      },
    });
  };

  // Process entity status effects
  const processEntityStatusEffects = (entity) => {
    const messages = [];
    const updatedEntity = { ...entity };
    const expiredEffects = [];

    if (!updatedEntity.statusEffects) {
      updatedEntity.statusEffects = [];
      return { entity: updatedEntity, messages };
    }

    updatedEntity.statusEffects.forEach((effect, index) => {
      // Apply effect damage/healing
      if (effect.type === "poison") {
        const damage = Math.max(1, Math.floor(updatedEntity.maxHealth * 0.05 * (effect.potency || 1)));
        updatedEntity.health = Math.max(0, updatedEntity.health - damage);
        messages.push(`${updatedEntity.name} takes ${damage} poison damage!`);
      } else if (effect.type === "heal") {
        const healing = Math.floor(updatedEntity.maxHealth * 0.05 * (effect.potency || 1));
        updatedEntity.health = Math.min(updatedEntity.maxHealth, updatedEntity.health + healing);
        messages.push(`${updatedEntity.name} heals for ${healing} health!`);
      } else if (effect.type === "burn") {
        const damage = Math.max(1, Math.floor(updatedEntity.maxHealth * 0.07 * (effect.potency || 1)));
        updatedEntity.health = Math.max(0, updatedEntity.health - damage);
        messages.push(`${updatedEntity.name} takes ${damage} burn damage!`);
      }

      // Decrease duration
      updatedEntity.statusEffects[index].duration--;
      if (updatedEntity.statusEffects[index].duration <= 0) {
        expiredEffects.push(index);
        messages.push(`${effect.name} has worn off from ${updatedEntity.name}.`);
      }
    });

    // Remove expired effects
    updatedEntity.statusEffects = updatedEntity.statusEffects.filter((_, index) => !expiredEffects.includes(index));

    return { entity: updatedEntity, messages };
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        loading,
        startNewGame,
        updateGameState,
        endGame,
        generateEnemy,
        generateBattleEnemies,
        setBattleNarration,
        updateBattleState,
        processEntityStatusEffects,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const useGameContext = () => React.useContext(GameContext);

export { useGameContext };
