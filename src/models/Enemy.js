import Character from "./Character";

export default class Enemy extends Character {
  constructor(config = {}) {
    super(config);

    // Enemy-specific properties
    this.experienceValue = config.experienceValue || this.level * 10;
    this.goldValue = config.goldValue || this.level * 5;
    this.imageUrl = config.imageUrl || "https://via.placeholder.com/150";
    this.attackPattern = config.attackPattern || "basic";
  }

  selectAttack(player) {
    // Different enemies could have different attack patterns
    switch (this.attackPattern) {
      case "aggressive":
        return this.aggressiveAttack(player);
      case "defensive":
        return this.defensiveAttack(player);
      default:
        return this.basicAttack(player);
    }
  }

  basicAttack(player) {
    const damage = this.calculateDamage(this.strength);
    return {
      type: "attack",
      damage: damage,
      description: `${this.name} attacks for ${damage} damage!`,
    };
  }

  // More complex attack patterns...
  aggressiveAttack(player) {
    const damage = this.calculateDamage(this.strength * 1.5);
    this.takeDamage(this.strength * 0.2); // Self damage from reckless attack

    return {
      type: "aggressive_attack",
      damage: damage,
      description: `${this.name} attacks recklessly for ${damage} damage!`,
    };
  }

  defensiveAttack(player) {
    const damage = this.calculateDamage(this.strength * 0.7);
    this.heal(damage * 0.3); // Heals for portion of damage

    return {
      type: "defensive_attack",
      damage: damage,
      healAmount: damage * 0.3,
      description: `${this.name} attacks defensively for ${damage} damage and heals for ${Math.floor(damage * 0.3)}!`,
    };
  }
}
