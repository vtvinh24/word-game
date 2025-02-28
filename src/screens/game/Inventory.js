// src/screens/game/Inventory.js
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

const mockItems = [
  { id: "1", name: "Double Points", description: "Double points for next word", quantity: 2, icon: "🎯" },
  { id: "2", name: "Time Boost", description: "Extra 30 seconds", quantity: 1, icon: "⏱️" },
  { id: "3", name: "Word Hint", description: "Reveals a letter", quantity: 5, icon: "💡" },
  { id: "4", name: "Shield", description: "Block an attack", quantity: 3, icon: "🛡️" },
  { id: "5", name: "Combo Boost", description: "2x combo points for 3 turns", quantity: 1, icon: "🔥" },
];

export default function InventoryScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.itemIcon}>{item.icon}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantity}>x{item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.coins}>Coins: 250 🪙</Text>
      </View>

      <FlatList
        data={mockItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.itemsList}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => {
          /* Open Shop */
        }}
      >
        <Text style={styles.shopButtonText}>Visit Shop</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  coins: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f4b400",
  },
  itemsList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  quantityContainer: {
    backgroundColor: "#f0eaff",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantity: {
    fontWeight: "bold",
    color: "#7d5fff",
  },
  shopButton: {
    backgroundColor: "#7d5fff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
