import Entity from "./Entity";

/**
 * Base class for characters (players, enemies, NPCs)
 */
export default class Character extends Entity {
  constructor(config = {}) {
    super(config);

    // Character-specific properties
    this.level = config.level || 1;
    this.strength = config.strength || 10;
    this.intelligence = config.intelligence || 10;
    this.dexterity = config.dexterity || 10;
    this.mana = config.mana || 50;
    this.maxMana = config.maxMana || 50;
  }

  useMana(amount) {
    if (this.mana >= amount) {
      this.mana -= amount;
      return true;
    }
    return false;
  }

  restoreMana(amount) {
    this.mana = Math.min(this.maxMana, this.mana + amount);
    return this.mana;
  }

  // Calculate damage output based on stats
  calculateDamage(baseDamage) {
    const strengthMultiplier = 1 + this.strength / 100;
    return Math.floor(baseDamage * strengthMultiplier);
  }
}
