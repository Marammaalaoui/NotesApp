// src/app/index.tsx
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes App</Text>
      <Text style={styles.subtitle}>React Native + Expo Router</Text>

      <Link href="/notes" style={styles.link}>
        Open my notes →
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#60646c' },
  link: {
    marginTop: 16,
    padding: 12,
    fontSize: 18,
    color: '#208AEF',
  },
});