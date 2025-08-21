import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AlertHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://fire-dectector-backend.onrender.com/data");
        const json = await res.json();

        const mapped = json.map(item => ({
          alert: item.smoke > 150,
          temperature: item.temperature,
          smoke: item.smoke,
          time: item.timestamp,
        }));

        mapped.sort((a, b) => new Date(b.time) - new Date(a.time));

        setHistory(mapped);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.alertTitle}>
        {item.alert ? "🔥 Fire Alert" : "✅ Safe Event"}
      </Text>
      <Text style={styles.info}>🌡 Temp: {item.temperature}°C</Text>
      <Text style={styles.info}>💨 Smoke: {item.smoke} ppm</Text>
      <Text style={styles.info}>🕒 {new Date(item.time).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📜 Alert History</Text>
      {history.length === 0 ? (
        <Text style={styles.empty}>No history available</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FF3B30",
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 50,
  },
});
