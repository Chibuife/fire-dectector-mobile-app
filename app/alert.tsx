import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

// Configure notifications (sound + alert even if app is closed)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function AlertScreen({ route, navigation }) {
  const { location, temperature, smoke, time } = route.params || {};

  useEffect(() => {
    // Vibrate when alert page opens
    Vibration.vibrate([500, 500, 500], true);

    // Cleanup vibration when leaving screen
    return () => Vibration.cancel();
  }, []);

  useEffect(() => {
    // Listen for push notifications that open the app
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      // Navigate to this page with new data
      navigation.navigate("AlertScreen", {
        location: data.location,
        temperature: data.temperature,
        smoke: data.smoke,
        time: data.time,
      });
    });

    return () => subscription.remove();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🚨 FIRE ALERT</Text>

      <Text style={styles.label}>🔥 Smoke and heat detected!</Text>
      <Text style={styles.info}>📍 Location: {location || "Unknown"}</Text>
      <Text style={styles.info}>🌡 Temperature: {temperature || "N/A"}°C</Text>
      <Text style={styles.info}>💨 Smoke Level: {smoke || "N/A"} ppm</Text>
      <Text style={styles.info}>🕒 Time: {time || "Just now"}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.muteButton]}
          onPress={() => {
            Vibration.cancel();
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL("tel:112")}
        >
          <Text style={styles.buttonText}>Call Emergency</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF3B30",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 5,
  },
  actions: {
    flexDirection: "row",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  muteButton: {
    backgroundColor: "#FFA500",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
