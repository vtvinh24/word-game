export default class StatusEffect {
  constructor(config = {}) {
    this.id = config.id || Math.random().toString(36).substring(2, 9);
    this.name = config.name || "Unknown Effect";
    this.duration = config.duration || 3; // Turns
    this.potency = config.potency || 1;
    this.type = config.type || "neutral"; // poison, burn, heal, buff, debuff
    this.description = config.description || "";
    this.iconPath = config.iconPath || "";
  }

  // Called each turn the effect is active
  applyEffect(entity) {
    // Override this in subclasses
  }
}
