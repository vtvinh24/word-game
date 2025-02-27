import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  },
  difficulty: "medium",
  currentEnemy: null,
  score: 0,
  enemiesDefeated: 0,
  words: [],
  gameMode: "classic",
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

  return (
    <GameContext.Provider
      value={{
        gameState,
        loading,
        startNewGame,
        updateGameState,
        endGame,
        generateEnemy,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
