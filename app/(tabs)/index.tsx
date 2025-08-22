import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    connected: false,
    temperature: 0,
    smoke: 0,
    alert: false,
    lastAlert: null,
  });

  const ws = useRef<WebSocket | null>(null);
  const deviceId = "ESP32-001"; // ESP32 device ID
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications not granted!");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "6bc219f4-b8d5-4ec9-8a03-c5281fbb8a44",
      });
      alert(`Push token: ${tokenData.data}`);
      const token = tokenData.data;

      // Send token to backend
      await fetch("https://fire-dectector-backend.onrender.com/register-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: "ESP32-001", token }),
      });
    })();
  }, []);


  useEffect(() => {
    // Connect to WebSocket backend
    ws.current = new WebSocket("wss://fire-dectector-backend.onrender.com");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setData(prev => ({ ...prev, connected: true }));

      // Subscribe to this device
      ws.current?.send(JSON.stringify({ action: "subscribe", deviceId }));
    };

    ws.current.onmessage = (event) => {
      try {
        const sensorData = JSON.parse(event.data);

        console.log("Received data:", sensorData);
        if (sensorData.deviceId === deviceId) {
          setData({
            connected: true,
            temperature: sensorData.temperature,
            smoke: sensorData.smoke,
            alert: sensorData.smoke > 150,
            lastAlert: sensorData.smoke > 150 ? new Date().toLocaleString() : null,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setData(prev => ({ ...prev, connected: false }));
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setData(prev => ({ ...prev, connected: false }));
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator size="large" color="#FF3B30" />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🔥 Fire Monitor</Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Status:{" "}
          <Text style={{ color: data.connected ? "green" : "red" }}>
            {data.connected ? "Connected" : "Disconnected"}
          </Text>
        </Text>
        <Text style={styles.label}>🌡 Temperature: {data.temperature || 0}°C</Text>
        <Text style={styles.label}>💨 Smoke Level: {data.smoke || 0} ppm</Text>
        <Text
          style={[
            styles.label,
            { color: data.alert ? "red" : "green", fontWeight: "bold" },
          ]}
        >
          {data.alert ? "⚠️ ALERT TRIGGERED" : "✅ Safe"}
        </Text>
        {data.lastAlert && (
          <Text style={styles.subLabel}>Last Alert: {data.lastAlert}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>
        {data.alert && (
          <TouchableOpacity style={[styles.button, styles.muteButton]}>
            <Text style={styles.buttonText}>Mute Alarm</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  subLabel: {
    fontSize: 14,
    color: "#777",
  },
  actions: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  muteButton: {
    backgroundColor: "#FFA500",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
