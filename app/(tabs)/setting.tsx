import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [thresholdTemp, setThresholdTemp] = useState("60");
  const [emergencyContact, setEmergencyContact] = useState("112");

  const saveSettings = () => {
    // Here you would call your backend API to save settings
    Alert.alert("✅ Settings Saved", "Your preferences have been updated.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>⚙️ Settings</Text>

      {/* Notifications */}
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? "#FF3B30" : "#ccc"}
        />
      </View>

      {/* Temperature Threshold */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Alert Temperature Threshold (°C)</Text>
        <TextInput
          style={styles.input}
          value={thresholdTemp}
          keyboardType="numeric"
          onChangeText={setThresholdTemp}
        />
      </View>

      {/* Emergency Contact */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Emergency Contact Number</Text>
        <TextInput
          style={styles.input}
          value={emergencyContact}
          keyboardType="phone-pad"
          onChangeText={setEmergencyContact}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveText}>Save Settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  inputGroup: {
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
