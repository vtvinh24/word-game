import StatusEffect from "../StatusEffect";

export default class PoisonEffect extends StatusEffect {
  constructor(config = {}) {
    super({
      ...config,
      name: config.name || "Poison",
      type: "poison",
      description: config.description || "Taking damage over time",
      iconPath: config.iconPath || "/icons/poison.png",
    });
  }

  applyEffect(entity) {
    const damage = Math.max(1, Math.floor(entity.maxHealth * 0.05 * this.potency));
    entity.takeDamage(damage);
    return {
      type: "damage_over_time",
      damage: damage,
      description: `${entity.name} takes ${damage} poison damage!`,
    };
  }
}
