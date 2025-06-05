import { Stack } from 'expo-router';

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="electricians" />
      <Stack.Screen name="plumbers" />
      <Stack.Screen name="beauticians" />
      <Stack.Screen name="cleaning" />
      <Stack.Screen name="painters" />
      <Stack.Screen name="carpenters" />
      <Stack.Screen name="landscapers" />
      <Stack.Screen name="smart-home" />
      <Stack.Screen name="mechanics" />
      <Stack.Screen name="security" />
      <Stack.Screen name="movers" />
      <Stack.Screen name="solar-services" />
    </Stack>
  );
}
