import Character from "./Character";

/**
 * Player class with player-specific functionality
 */
export default class Player extends Character {
  constructor(config = {}) {
    super(config);

    // Player-specific properties
    this.experience = config.experience || 0;
    this.nextLevelExp = config.nextLevelExp || 100;
    this.turns = config.turns || 0;
    this.inventory = config.inventory || [];
    this.gold = config.gold || 0;
  }

  gainExperience(amount) {
    this.experience += amount;

    if (this.experience >= this.nextLevelExp) {
      this.levelUp();
      return true;
    }

    return false;
  }

  levelUp() {
    this.level += 1;
    this.experience = this.experience - this.nextLevelExp;
    this.nextLevelExp = Math.floor(this.nextLevelExp * 1.5);

    // Increase stats
    this.maxHealth += 20;
    this.health = this.maxHealth;
    this.maxMana += 10;
    this.mana = this.maxMana;
    this.strength += 2;
    this.intelligence += 2;
    this.dexterity += 2;

    return this.level;
  }

  incrementTurn() {
    this.turns += 1;
    return this.turns;
  }

  // For serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      health: this.health,
      maxHealth: this.maxHealth,
      mana: this.mana,
      maxMana: this.maxMana,
      strength: this.strength,
      intelligence: this.intelligence,
      dexterity: this.dexterity,
      experience: this.experience,
      nextLevelExp: this.nextLevelExp,
      turns: this.turns,
      inventory: this.inventory,
      gold: this.gold,
      statusEffects: this.statusEffects,
    };
  }

  static fromJSON(data) {
    return new Player(data);
  }
}
