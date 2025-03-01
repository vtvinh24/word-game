// src/services/skills/SkillFactory.js
import YAML from "yaml";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

// Cache for loaded skills
let cachedSkills = null;

export const loadSkills = async () => {
  if (cachedSkills) return cachedSkills;

  try {
    // In a real app, you would load these from files
    // For now, we'll hard-code some example skills
    const skills = [parseSkillYaml(quickSlashYaml), parseSkillYaml(fireballYaml), parseSkillYaml(healingWordYaml)];

    cachedSkills = skills;
    return skills;
  } catch (error) {
    console.error("Error loading skills:", error);
    return [];
  }
};

const parseSkillYaml = (yamlString) => {
  const parsed = YAML.parse(yamlString);

  // Add unique ID
  parsed.id = `skill-${parsed.name.toLowerCase().replace(/\s+/g, "-")}`;

  // Parse pattern if needed
  if (parsed.pattern) {
    // In a real app, you would load patterns from patterns.yml
    // and apply the specified pattern
  }

  return parsed;
};

// Example skill YAML strings
const quickSlashYaml = `
name: "Quick Slash"
description: "A swift attack that deals damage based on your dexterity."
cost: "1v"
target: "single"
conditions:
- "target.count = 1"
- "target.position = 'front'"
pattern: "action_verbs"
effectMin: 0.5
effectMax: 1.2
iconId: "slash_1.webp"
`;

const fireballYaml = `
name: "Fireball"
description: "Launches a ball of fire that explodes on impact."
cost: "2a1n"
target: "random:3"
conditions:
- "self.mana >= 15"
pattern: "fire_related"
effectMin: 0.8
effectMax: 1.8
iconId: "fire_1.webp"
`;

const healingWordYaml = `
name: "Healing Word"
description: "A whispered word of power that mends wounds."
cost: "S1v1n"
target: "self"
conditions:
- "self.hp < 75%"
pattern: "healing_words"
effectMin: 0.3
effectMax: 1.0
iconId: "heal_1.webp"
`;

export const validateWordForSkill = (word, skill) => {
  // This would implement the validation logic based on skill.cost and skill.pattern
  // For now, just return a simple validation
  if (!word || word.length < 3) return false;

  const cost = skill.cost;

  if (cost.includes("v")) {
    // Validate verb
    // In a real app, you would use NLP to detect parts of speech
    return true; // Simplified for example
  }

  if (cost.includes("n")) {
    // Validate noun
    return true; // Simplified for example
  }

  if (cost.includes("a")) {
    // Validate adjective
    return true; // Simplified for example
  }

  if (cost.startsWith("S")) {
    // Validate sentence
    return word.includes(" "); // Very simplified check
  }

  return true;
};
