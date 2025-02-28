import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import { GameContext } from "../contexts/GameContext";

// Auth Screens
import LoginScreen from "../screens/auth/Login";
import RegisterScreen from "../screens/auth/Register";

// Home Screens
import HomeScreen from "../screens/home/Home";
import ProfileScreen from "../screens/home/Profile";
import LeaderboardScreen from "../screens/home/Leaderboard";

// Game Screens
import LobbyScreen from "../screens/game/Lobby";
import BattleScreen from "../screens/game/Battle";
import InventoryScreen from "../screens/game/Inventory";
import MapScreen from "../screens/game/Map";
import VictoryScreen from "../screens/game/Victory";
import GameOverScreen from "../screens/game/GameOver";

// Settings Screen
import SettingsScreen from "../screens/settings/Settings";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const GameStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Lobby"
      component={LobbyScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Battle"
      component={BattleScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Inventory"
      component={InventoryScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Map"
      component={MapScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Victory"
      component={VictoryScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="GameOver"
      component={GameOverScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case "Home":
            iconName = "home";
            break;
          case "Game":
            iconName = "gamepad";
            break;
          case "Profile":
            iconName = "person";
            break;
          case "Leaderboard":
            iconName = "leaderboard";
            break;
          case "Settings":
            iconName = "settings";
            break;
        }

        return (
          <MaterialIcons
            name={iconName}
            size={size}
            color={color}
          />
        );
      },
      tabBarActiveTintColor: "#7d5fff",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Game"
      component={GameStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Leaderboard"
      component={LeaderboardScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
    />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { gameState, loading } = useContext(GameContext);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* {gameState ? ( */}
        {true ? (
          <Stack.Screen
            name="Main"
            component={MainTabs}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
