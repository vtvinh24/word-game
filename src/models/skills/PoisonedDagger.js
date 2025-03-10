import Skill from "../Skill";
import PoisonEffect from "../effects/PoisonEffect";

export default class PoisonedDagger extends Skill {
  constructor(config = {}) {
    super({
      name: "Poisoned Dagger",
      description: "Strike with a poisoned blade that deals damage and has a chance to poison the target",
      manaCost: 15,
      cooldown: 3,
      targetType: "enemy",
      type: "damage",
      basePower: 15,
      effects: [
        {
          effectClass: PoisonEffect,
          chance: 0.75,
          potency: 1.2,
          duration: 3,
          params: {
            description: "Poison from poisoned dagger",
          },
        },
      ],
      ...config,
    });
  }

  // Override for special behaviors specific to this skill
  calculateDamage(caster, target) {
    // Poisoned dagger does extra damage based on dexterity
    const baseDamage = super.calculateDamage(caster, target);
    const dexterityBonus = caster.dexterity / 20;
    return Math.floor(baseDamage * (1 + dexterityBonus));
  }
}
