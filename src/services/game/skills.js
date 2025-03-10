// src/services/game/skills.js
import YAML from "yaml";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import Skill from "../../models/Skill";

// Cache for loaded skills
let cachedSkills = null;

export const loadSkills = async (playerLevel = 1) => {
  if (cachedSkills) return cachedSkills;

  try {
    // Try primary and fallback directories
    const primaryDir = `${FileSystem.documentDirectory || ""}src/data/game/skills`;
    const fallbackDir = `${FileSystem.documentDirectory || ""}data/game/skills`;

    let skillConfigs = await tryLoadSkillsFromDirectory(primaryDir);

    if (skillConfigs.length === 0) {
      skillConfigs = await tryLoadSkillsFromDirectory(fallbackDir);
    }

    // If no skills found in either directory, use defaults
    if (skillConfigs.length === 0) {
      console.warn("No valid skill files found in any location, using default skills");
      skillConfigs = getDefaultSkills();
    }

    // Convert skill configs to Skill instances
    const skills = skillConfigs.map((config) => new Skill(config));

    console.log(`Loaded ${skills.length} skills successfully`);
    cachedSkills = skills;
    return skills;
  } catch (error) {
    console.error("Error loading skills:", error);
    const defaultSkills = getDefaultSkills().map((config) => new Skill(config));
    cachedSkills = defaultSkills;
    return defaultSkills;
  }
};

const tryLoadSkillsFromDirectory = async (directory) => {
  try {
    // Check if directory exists
    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (!dirInfo.exists) {
      console.log(`Directory not found: ${directory}`);
      return [];
    }

    // Get and filter YAML files
    const files = await FileSystem.readDirectoryAsync(directory);
    const yamlFiles = files.filter((file) => file.endsWith(".yml"));
    console.log(`Found ${yamlFiles.length} skill files in ${directory}`);

    // Load all skill files
    const skillPromises = yamlFiles.map((file) => loadSkillFile(`${directory}/${file}`));
    const loadedSkills = await Promise.all(skillPromises);

    // Filter out null results from failed loads
    return loadedSkills.filter((skill) => skill !== null);
  } catch (dirError) {
    console.error(`Error accessing directory ${directory}:`, dirError);
    return [];
  }
};

const loadSkillFile = async (filePath) => {
  try {
    const content = await FileSystem.readAsStringAsync(filePath);
    const skillConfig = parseSkillYaml(content);
    if (validateSkillConfig(skillConfig)) {
      return skillConfig;
    }
    console.warn(`Invalid skill in file: ${filePath}`);
    return null;
  } catch (fileError) {
    console.error(`Error loading skill file ${filePath}:`, fileError);
    return null;
  }
};

const validateSkillConfig = (skillConfig) => {
  // Basic validation of required skill properties
  if (!skillConfig || !skillConfig.name || !skillConfig.description || !skillConfig.cost) {
    return false;
  }
  return true;
};

const parseSkillYaml = (yamlString) => {
  try {
    const parsed = YAML.parse(yamlString);

    // Add unique ID if needed
    if (parsed && parsed.name && !parsed.id) {
      parsed.id = `skill-${parsed.name.toLowerCase().replace(/\s+/g, "-")}`;
    }
    return parsed;
  } catch (parseError) {
    console.error("Error parsing YAML:", parseError);
    return null;
  }
};

// Get default hardcoded skills as fallback
const getDefaultSkills = () => {
  return [parseSkillYaml(quickSlashYaml), parseSkillYaml(fireballYaml), parseSkillYaml(healingWordYaml)];
};

// Export the validateWord function from the Skill model for convenience
export const validateWordForSkill = (word, skill) => {
  if (skill instanceof Skill) {
    return skill.validateWord(word);
  }

  // For backward compatibility with raw skill configs
  const skillInstance = new Skill(skill);
  return skillInstance.validateWord(word);
};

// Default skill YAML definitions as fallback
const quickSlashYaml = `
name: "Quick Slash"
description: "A swift attack that deals damage based on your dexterity."
cost: "1v"
manaCost: 5
cooldown: 0
target: "single"
type: "damage"
conditions:
- "target.count = 1"
- "target.position = 'front'"
pattern: "action_verbs"
effectMin: 0.5
effectMax: 1.2
basePower: 12
iconId: "slash_1.webp"
`;

const fireballYaml = `
name: "Fireball"
description: "Launches a ball of fire that explodes on impact."
cost: "2a1n"
manaCost: 15
cooldown: 2
target: "random:3"
type: "damage"
conditions:
- "self.mana >= 15"
pattern: "fire_related"
effectMin: 0.8
effectMax: 1.8
basePower: 18
effects:
- name: "Burn"
  type: "burn"
  duration: 3
  potency: 1.0
  chance: 0.7
iconId: "fire_1.webp"
`;

const healingWordYaml = `
name: "Healing Word"
description: "A whispered word of power that mends wounds."
cost: "S1v1n"
manaCost: 20
cooldown: 3
target: "self"
type: "heal"
conditions:
- "self.hp < 75%"
pattern: "healing_words"
effectMin: 0.3
effectMax: 1.0
basePower: 10
iconId: "heal_1.webp"
`;
