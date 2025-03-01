import React from "react";
import { View, Text, StyleSheet, ProgressBar } from "react-native";

const CharacterStats = (props) => {
  // Handle both prop styles: either a character object or individual props
  const character = props.character || {
    name: props.name || "Player",
    level: props.level || 1,
    health: props.health || 0,
    maxHealth: props.maxHealth || 100,
    mana: props.mana || 0,
    maxMana: props.maxMana || 100,
    strength: props.strength || 0,
    intelligence: props.intelligence || 0,
    dexterity: props.dexterity || 0,
    experience: props.experience || 0,
    nextLevelExp: props.nextLevelExp || 100,
  };
  const { name, level, health, maxHealth, mana, maxMana, strength, intelligence, dexterity, experience, nextLevelExp } = character;

  const renderStatBar = (label, current, max, color) => {
    const percentage = (current / max) * 100;

    return (
      <View style={styles.statBar}>
        <Text style={styles.statLabel}>
          {label}: {current}/{max}
        </Text>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  const renderStat = (label, value) => (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.level}>Level {level}</Text>
      </View>

      {renderStatBar("HP", health, maxHealth, "#ff5555")}
      {renderStatBar("MP", mana, maxMana, "#5555ff")}
      {renderStatBar("EXP", experience, nextLevelExp, "#55ff55")}

      <View style={styles.attributes}>
        {renderStat("STR", strength)}
        {renderStat("INT", intelligence)}
        {renderStat("DEX", dexterity)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  level: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7d5fff",
  },
  statBar: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 3,
  },
  barContainer: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
  },
  attributes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CharacterStats;
