import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { GameProvider } from "./src/contexts/GameContext";
import { AIProvider } from "./src/contexts/AIContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <View style={styles.container}>
      <GameProvider>
        <AIProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AIProvider>
      </GameProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
