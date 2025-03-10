export default class Skill {
  constructor(config = {}) {
    // Basic properties
    this.id = config.id || `skill-${(config.name || "").toLowerCase().replace(/\s+/g, "-")}`;
    this.name = config.name || "Unknown Skill";
    this.description = config.description || "";
    this.manaCost = config.manaCost || 10;
    this.cooldown = config.cooldown || 0;
    this.currentCooldown = 0;

    // Target and effect properties
    this.targetType = config.targetType || config.target || "enemy";
    this.type = config.type || "damage";
    this.basePower = config.basePower || config.effectMax * 10 || 10;
    this.effects = config.effects || [];

    // Word validation properties
    this.cost = config.cost || "";
    this.pattern = config.pattern || "";
    this.iconId = config.iconId || "";
    this.conditions = config.conditions || [];
  }

  canUse(character, word = null) {
    // Basic requirements check
    const hasEnoughMana = character.mana >= this.manaCost;
    const isOffCooldown = this.currentCooldown === 0;

    // If word validation is required and a word is provided
    if (word && this.cost) {
      return hasEnoughMana && isOffCooldown && this.validateWord(word);
    }

    return hasEnoughMana && isOffCooldown;
  }

  validateWord(word) {
    if (!word || word.length < 3) return false;

    const cost = this.cost || "";
    const words = word.trim().split(/\s+/);

    // Parse cost requirements
    const requirements = {
      n: 0, // nouns
      v: 0, // verbs
      a: 0, // adjectives
      S: false, // sentence flag
      m: false, // meaningful sentence flag
    };

    // Extract number requirements (e.g., "2a1n" -> 2 adjectives, 1 noun)
    let currentNum = "";
    for (let i = 0; i < cost.length; i++) {
      const char = cost[i];
      if (char >= "0" && char <= "9") {
        currentNum += char;
      } else if (char === "n" || char === "v" || char === "a") {
        requirements[char] = parseInt(currentNum || "1");
        currentNum = "";
      } else if (char === "S" || char === "m") {
        requirements[char] = true;
        currentNum = "";
      }
    }

    // Validate sentence requirement
    if (requirements.S && words.length < 2) {
      return false;
    }

    // Simplified part-of-speech validation
    // Count actual parts of speech in the input
    let nounCount = 0;
    let verbCount = 0;
    let adjCount = 0;

    // Placeholder for NLP processing
    for (const w of words) {
      // Simplified assumptions - in a real app, use NLP
      if (requirements.n > 0) nounCount++;
      if (requirements.v > 0) verbCount++;
      if (requirements.a > 0) adjCount++;
    }

    // Validate counts
    if (requirements.n > 0 && nounCount < requirements.n) return false;
    if (requirements.v > 0 && verbCount < requirements.v) return false;
    if (requirements.a > 0 && adjCount < requirements.a) return false;

    // If all checks pass
    return true;
  }

  use(caster, targets, word = null) {
    if (!this.canUse(caster, word)) {
      return {
        success: false,
        message: "Cannot use skill now",
      };
    }

    // Use mana (checking if the method exists first)
    if (typeof caster.useMana === "function") {
      caster.useMana(this.manaCost);
    } else {
      // Don't modify caster directly as it should be handled by the caller
      // In SinglePlayerBattle.js, mana is already being updated separately
    }

    // Set cooldown
    this.currentCooldown = this.cooldown;

    // Results to return
    const results = [];

    // Apply skill effects based on type
    if (Array.isArray(targets)) {
      targets.forEach((target) => {
        const result = this.applyEffectTo(caster, target);
        results.push(result);
      });
    } else {
      const result = this.applyEffectTo(caster, targets);
      results.push(result);
    }

    return {
      success: true,
      results: results,
    };
  }

  applyEffectTo(caster, target) {
    // Calculate base outcome
    let outcome = {
      target: target.name,
      effects: [],
    };

    // Apply primary effect based on skill type
    switch (this.type) {
      case "damage":
        const damage = this.calculateDamage(caster, target);
        target.takeDamage ? target.takeDamage(damage) : (target.health -= damage);
        outcome.effects.push({
          type: "damage",
          value: damage,
          message: `${target.name} takes ${damage} damage!`,
        });
        break;

      case "heal":
        const healing = this.calculateHealing(caster, target);
        target.heal ? target.heal(healing) : (target.health = Math.min(target.maxHealth, target.health + healing));
        outcome.effects.push({
          type: "heal",
          value: healing,
          message: `${target.name} heals for ${healing} health!`,
        });
        break;

      // Handle status effects
      case "status":
        const statusEffects = this.effects || [];
        statusEffects.forEach((effectConfig) => {
          // Apply status effect with its own logic
          const effect = {
            name: effectConfig.name || this.name,
            type: effectConfig.type || "buff",
            duration: effectConfig.duration || 3,
            potency: effectConfig.potency || 1,
          };

          // Add status effect to target
          if (!target.statusEffects) target.statusEffects = [];
          target.statusEffects.push(effect);

          outcome.effects.push({
            type: "status",
            effect: effect.name,
            message: `${target.name} is affected by ${effect.name}!`,
          });
        });
        break;
    }

    // Apply secondary effects
    if (this.effects && this.type !== "status") {
      this.effects.forEach((effectConfig) => {
        // Check probability
        if (Math.random() <= (effectConfig.chance || 1)) {
          // Create and apply status effect
          const effect = {
            name: effectConfig.name || "Status Effect",
            type: effectConfig.type || "buff",
            duration: effectConfig.duration || 3,
            potency: effectConfig.potency || 1,
          };

          if (!target.statusEffects) target.statusEffects = [];
          target.addStatusEffect ? target.addStatusEffect(effect) : target.statusEffects.push(effect);

          outcome.effects.push({
            type: "status",
            effect: effect.name,
            message: `${target.name} is affected by ${effect.name}!`,
          });
        }
      });
    }

    return outcome;
  }

  calculateDamage(caster, target) {
    const baseDamage = this.basePower;
    const intelligenceBonus = (caster.intelligence || 10) / 10;
    return Math.floor(baseDamage * (1 + intelligenceBonus));
  }

  calculateHealing(caster, target) {
    const baseHealing = this.basePower;
    const intelligenceBonus = (caster.intelligence || 8) / 8;
    return Math.floor(baseHealing * (1 + intelligenceBonus));
  }

  decrementCooldown() {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }
  }
}
