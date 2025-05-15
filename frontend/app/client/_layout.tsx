import React from 'react';
import { Stack } from 'expo-router';

export default function ClientLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="welcome"
        options={{
          title: 'Welcome to Client Mode',
        }}
      />
    </Stack>
  );
}
