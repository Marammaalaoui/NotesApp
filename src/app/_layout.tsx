import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Notes App' }} />
      <Stack.Screen name="notes" options={{ title: 'My Notes' }} />
    </Stack>
  );
}