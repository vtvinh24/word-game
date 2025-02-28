// src/screens/game/Map.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ICON_SIZE = 40;

export default function MapScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adventure Map</Text>

      <View style={styles.mapContainer}>
        {/* This is a simple representation of a game map */}
        <View style={styles.pathLine} />

        <TouchableOpacity style={[styles.mapNode, styles.completedNode, { top: 60, left: width * 0.2 }]}>
          <MaterialIcons
            name="check-circle"
            size={ICON_SIZE}
            color="#5a9216"
          />
          <Text style={styles.nodeLabel}>Level 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mapNode, styles.completedNode, { top: 150, left: width * 0.5 }]}>
          <MaterialIcons
            name="check-circle"
            size={ICON_SIZE}
            color="#5a9216"
          />
          <Text style={styles.nodeLabel}>Level 2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mapNode, styles.currentNode, { top: 250, left: width * 0.3 }]}
          onPress={() => navigation.navigate("Battle")}
        >
          <MaterialIcons
            name="play-circle-filled"
            size={ICON_SIZE}
            color="#7d5fff"
          />
          <Text style={styles.nodeLabel}>Level 3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mapNode, styles.lockedNode, { top: 350, left: width * 0.6 }]}>
          <MaterialIcons
            name="lock"
            size={ICON_SIZE}
            color="#999"
          />
          <Text style={styles.nodeLabel}>Level 4</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mapNode, styles.lockedNode, { top: 450, left: width * 0.4 }]}>
          <MaterialIcons
            name="lock"
            size={ICON_SIZE}
            color="#999"
          />
          <Text style={styles.nodeLabel}>Final Boss</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Lobby</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  pathLine: {
    position: "absolute",
    width: 5,
    height: "80%",
    backgroundColor: "#ddd",
    left: width * 0.45,
    top: "10%",
    borderRadius: 5,
    zIndex: -1,
  },
  mapNode: {
    position: "absolute",
    alignItems: "center",
  },
  completedNode: {
    opacity: 0.8,
  },
  currentNode: {
    transform: [{ scale: 1.1 }],
  },
  lockedNode: {
    opacity: 0.6,
  },
  nodeLabel: {
    marginTop: 5,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#7d5fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
