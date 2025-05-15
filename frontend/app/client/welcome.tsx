import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { setActiveRole } from '../../utils/storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function ClientWelcomeScreen() {
  const router = useRouter();
  
  useEffect(() => {
    const setupClientMode = async () => {
      try {
        // Set active role to user
        await setActiveRole('user');
        
        // Wait a moment to show the welcome screen
        setTimeout(() => {
          // Navigate to client tabs
          router.replace('/(tabs)');
        }, 2000);
      } catch (error) {
        console.error('Error setting up client mode:', error);
        router.replace('/(tabs)');
      }
    };
    
    setupClientMode();
  }, []);
  
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="items-center">
        <View className="bg-primary-100 rounded-full p-6 mb-6">
          <MaterialIcons name="person" size={50} color="#2563eb" />
        </View>
        
        <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome to Client Mode</Text>
        <Text className="text-gray-600 text-center mb-8">
          You can now browse services, make bookings, and manage your account as a client.
        </Text>
        
        <ActivityIndicator size="large" color="#2563eb" />
        
        <Text className="mt-6 text-gray-500 text-sm">
          Redirecting to client dashboard...
        </Text>
      </View>
    </View>
  );
}
