import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// This mapping object defines all available skill icons
// The bundler can statically analyze this
const SKILL_ICONS = {
  "slash_1.webp": require("../../assets/game/skill-icons/slash_1.png"),
  "fire_1.webp": require("../../assets/game/skill-icons/fire_1.png"),
  "heal_1.webp": require("../../assets/game/skill-icons/heal_1.png"),
  "default.webp": require("../../assets/game/skill-icons/_default.png"),
  // Add all your other icons here
};

export default function SkillCard({ skill, onSelect, isSelected, disabled }) {
  const [imageError, setImageError] = useState(false);

  const getSkillIcon = () => {
    if (!skill.iconId) return null;
    return SKILL_ICONS[skill.iconId] || SKILL_ICONS["default.webp"];
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard, disabled && styles.disabledCard]}
      onPress={onSelect}
      disabled={disabled}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{skill.name}</Text>
        <Text style={styles.cost}>{skill.cost}</Text>
      </View>

      <View style={styles.iconContainer}>
        {imageError || !skill.iconId ? (
          <View style={styles.emptyIcon}>
            <MaterialIcons
              name="image-not-supported"
              size={32}
              color="#cccccc"
            />
          </View>
        ) : (
          <Image
            source={getSkillIcon()}
            style={styles.icon}
            onError={() => setImageError(true)}
          />
        )}
      </View>

      <Text style={styles.description}>{skill.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.target}>Target: {skill.target}</Text>
        <Text style={styles.effect}>
          {skill.effectMin} - {skill.effectMax}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 220,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#7d5fff",
    backgroundColor: "#f0eaff",
  },
  disabledCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
  },
  cost: {
    backgroundColor: "#7d5fff",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  icon: {
    width: 60,
    height: 60,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  target: {
    fontSize: 11,
    color: "#888",
  },
  effect: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#5a9216",
  },
});
