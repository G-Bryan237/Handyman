import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { getUserData, getActiveRole } from '../../utils/storage';
import { useRouter, Redirect } from 'expo-router';

export default function ProviderLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isProvider, setIsProvider] = useState(false);
  const [activeRole, setActiveRole] = useState('');
  const router = useRouter();

  // Check if user is a provider and has provider mode active
  useEffect(() => {
    const checkProviderStatus = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserData();
        const role = await getActiveRole();
        
        console.log('[ProviderLayout] User data:', userData?.role);
        console.log('[ProviderLayout] Active role:', role);
        
        // Verify user is a provider and has provider mode active
        setIsProvider(userData?.role === 'provider');
        setActiveRole(role || 'user');
        
      } catch (error) {
        console.error('Error checking provider status:', error);
        setIsProvider(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkProviderStatus();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  
  // If not a provider, redirect to client mode
  if (!isProvider) {
    console.log('[ProviderLayout] User is not a provider, redirecting to client tabs');
    return <Redirect href="/(tabs)" />;
  }
  
  // If provider but in client mode, redirect to client mode
  if (isProvider && activeRole !== 'provider') {
    console.log('[ProviderLayout] Provider in client mode, redirecting to client tabs');
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="dashboard"
        options={{
          title: 'Provider Dashboard',
        }}
      />
      <Stack.Screen 
        name="register"
        options={{
          title: 'Become a Provider',
        }}
      />
      <Stack.Screen 
        name="welcome"
        options={{
          title: 'Welcome to Provider Mode',
        }}
      />
      <Stack.Screen 
        name="tabs"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{
          title: 'Provider Details',
        }}
      />
    </Stack>
  );
}
