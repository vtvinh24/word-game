import React, { createContext, useState, useEffect, useContext } from "react";
import { GameContext } from "./GameContext";

// Create the AI context
export const AIContext = createContext();

// Initial state for AI features
const initialAIState = {
  enabled: false,
  difficulty: "medium", // easy, medium, hard
  thinking: false,
  suggestion: null,
  lastMove: null,
  aiCharacter: "assistant", // assistant, opponent, challenger
};

export const AIProvider = ({ children }) => {
  const [aiState, setAIState] = useState(initialAIState);
  const { gameState } = useContext(GameContext);

  // Effect to adjust AI behavior based on game state changes
  useEffect(() => {
    if (gameState?.inProgress && aiState.enabled) {
      // AI logic based on game progress
      if (gameState.difficulty !== aiState.difficulty) {
        setAIState((prev) => ({
          ...prev,
          difficulty: gameState.difficulty,
        }));
      }
    }
  }, [gameState, aiState.enabled]);

  // Enable or disable AI features
  const toggleAI = () => {
    setAIState((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  // Change AI difficulty
  const setAIDifficulty = (difficulty) => {
    setAIState((prev) => ({
      ...prev,
      difficulty,
    }));
  };

  // Get word suggestion from AI
  const getWordSuggestion = () => {
    setAIState((prev) => ({ ...prev, thinking: true }));

    // Simulate AI thinking with timeout
    setTimeout(() => {
      // Here you would implement actual AI logic to generate word suggestions
      // This is just placeholder logic
      const suggestions = {
        easy: ["simple", "basic", "start"],
        medium: ["challenge", "advance", "improve"],
        hard: ["complex", "difficult", "expert"],
      };

      const suggestion = suggestions[aiState.difficulty][Math.floor(Math.random() * suggestions[aiState.difficulty].length)];

      setAIState((prev) => ({
        ...prev,
        thinking: false,
        suggestion,
      }));
    }, 1000);
  };

  // Record AI's last move
  const recordAIMove = (move) => {
    setAIState((prev) => ({
      ...prev,
      lastMove: move,
    }));
  };

  // Change AI character/personality
  const setAICharacter = (character) => {
    setAIState((prev) => ({
      ...prev,
      aiCharacter: character,
    }));
  };

  // Reset AI state
  const resetAI = () => {
    setAIState(initialAIState);
  };

  return (
    <AIContext.Provider
      value={{
        aiState,
        toggleAI,
        setAIDifficulty,
        getWordSuggestion,
        recordAIMove,
        setAICharacter,
        resetAI,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
