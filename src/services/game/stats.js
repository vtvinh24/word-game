export const calculateWordScore = (word, difficulty, timeSpent) => {
  const baseScore = word.length * 10;
  const timeBonus = Math.max(0, 100 - timeSpent) / 2;
  const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;

  return Math.floor((baseScore + timeBonus) * difficultyMultiplier);
};

export const calculateGameStats = (gameData) => {
  return {
    totalScore: gameData.words.reduce((sum, wordData) => sum + wordData.score, 0),
    wordsGuessed: gameData.words.filter((word) => word.won).length,
    totalWords: gameData.words.length,
    accuracy: gameData.words.length > 0 ? (gameData.words.filter((word) => word.won).length / gameData.words.length) * 100 : 0,
  };
};
