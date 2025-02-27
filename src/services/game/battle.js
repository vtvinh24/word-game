import { calculateWordScore } from "./stats";

export const processTurn = (playerWord, enemyStats, playerStats) => {
  const damage = calculateDamage(playerWord, playerStats);

  // Apply damage to enemy
  const updatedEnemyStats = {
    ...enemyStats,
    health: Math.max(0, enemyStats.health - damage),
  };

  // If enemy still alive, they counter-attack
  let updatedPlayerStats = { ...playerStats };
  if (updatedEnemyStats.health > 0) {
    const enemyDamage = calculateEnemyDamage(enemyStats);
    updatedPlayerStats.health = Math.max(0, playerStats.health - enemyDamage);
  }

  return {
    playerStats: updatedPlayerStats,
    enemyStats: updatedEnemyStats,
    turnResults: {
      playerDamage: damage,
      enemyDamage: updatedEnemyStats.health > 0 ? calculateEnemyDamage(enemyStats) : 0,
      isCritical: damage > playerWord.length * 15,
      turnNumber: playerStats.turns + 1,
    },
  };
};

const calculateDamage = (word, playerStats) => {
  const baseWordPower = calculateWordScore(word.text, "medium", word.timeSpent);
  const intelligenceBonus = playerStats.intelligence * 0.5;
  return Math.floor(baseWordPower * (1 + intelligenceBonus / 100));
};

const calculateEnemyDamage = (enemyStats) => {
  return Math.floor(enemyStats.strength * 2.5 + Math.random() * 10);
};
