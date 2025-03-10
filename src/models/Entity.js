/**
 * Base class for all game entities that can have health, take damage, etc.
 */
export default class Entity {
  constructor(config = {}) {
    this.id = config.id || Math.random().toString(36).substring(2, 9);
    this.name = config.name || "Unknown Entity";
    this.health = config.health || 100;
    this.maxHealth = config.maxHealth || 100;
    this.statusEffects = config.statusEffects || [];
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    return this.health;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    return this.health;
  }

  isDead() {
    return this.health <= 0;
  }

  addStatusEffect(effect) {
    this.statusEffects.push(effect);
  }

  removeStatusEffect(effectId) {
    this.statusEffects = this.statusEffects.filter((effect) => effect.id !== effectId);
  }

  // Process all active status effects (called each turn)
  processStatusEffects() {
    const expiredEffects = [];

    this.statusEffects.forEach((effect) => {
      // Apply effect's per-turn impact
      effect.applyEffect(this);

      // Decrease duration
      effect.duration--;
      if (effect.duration <= 0) {
        expiredEffects.push(effect.id);
      }
    });

    // Remove expired effects
    expiredEffects.forEach((id) => this.removeStatusEffect(id));
  }
}
