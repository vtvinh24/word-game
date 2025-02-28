import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GameContext } from "../../contexts/GameContext";

const SettingsScreen = ({ navigation }) => {
  const { gameState, logout } = useContext(GameContext);

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [difficulty, setDifficulty] = useState("Medium");

  // Language options
  const languages = ["English", "Spanish", "French", "German"];
  const difficulties = ["Easy", "Medium", "Hard", "Expert"];

  // Handle logout
  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout() },
    ]);
  };

  // Setting item with switch component
  const SettingSwitch = ({ title, value, onValueChange, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTitleContainer}>
        <MaterialIcons
          name={icon}
          size={24}
          color="#7d5fff"
          style={styles.icon}
        />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#ddd", true: "#a78bfa" }}
        thumbColor={value ? "#7d5fff" : "#f4f3f4"}
      />
    </View>
  );

  // Setting item that opens a selection modal/screen
  const SettingSelector = ({ title, value, options, icon }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => {
        // In a real app, this would open a modal or navigate to a selection screen
        Alert.alert(
          `Select ${title}`,
          `This would open a ${title.toLowerCase()} selector`,
          options.map((option) => ({
            text: option,
            onPress: () => {
              if (title === "Language") setLanguage(option);
              if (title === "Difficulty") setDifficulty(option);
            },
          }))
        );
      }}
    >
      <View style={styles.settingTitleContainer}>
        <MaterialIcons
          name={icon}
          size={24}
          color="#7d5fff"
          style={styles.icon}
        />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingValueContainer}>
        <Text style={styles.settingValue}>{value}</Text>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color="#888"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings</Text>
        <SettingSelector
          title="Difficulty"
          value={difficulty}
          options={difficulties}
          icon="tune"
        />
        <SettingSelector
          title="Language"
          value={language}
          options={languages}
          icon="language"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <SettingSwitch
          title="Dark Mode"
          value={darkMode}
          onValueChange={setDarkMode}
          icon="brightness-4"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sound</Text>
        <SettingSwitch
          title="Sound Effects"
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          icon="volume-up"
        />
        <SettingSwitch
          title="Music"
          value={musicEnabled}
          onValueChange={setMusicEnabled}
          icon="music-note"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingSwitch
          title="Enable Notifications"
          value={notifications}
          onValueChange={setNotifications}
          icon="notifications"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.settingTitleContainer}>
            <MaterialIcons
              name="person"
              size={24}
              color="#7d5fff"
              style={styles.icon}
            />
            <Text style={styles.settingTitle}>Edit Profile</Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#888"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleLogout}
        >
          <View style={styles.settingTitleContainer}>
            <MaterialIcons
              name="exit-to-app"
              size={24}
              color="#7d5fff"
              style={styles.icon}
            />
            <Text style={styles.settingTitle}>Logout</Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert("About", "Word Game v1.0.0\n© 2025 Word Game Team")}
        >
          <View style={styles.settingTitleContainer}>
            <MaterialIcons
              name="info"
              size={24}
              color="#7d5fff"
              style={styles.icon}
            />
            <Text style={styles.settingTitle}>App Information</Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Word Game v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7d5fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
    margin: 10,
  },
});

export default SettingsScreen;
