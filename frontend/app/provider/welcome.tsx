import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { setActiveRole } from '../../utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function ProviderWelcomeScreen() {
  const router = useRouter();
  
  useEffect(() => {
    const setupProviderMode = async () => {
      try {
        // Set active role to provider
        await setActiveRole('provider');
        
        // Wait a moment to show the welcome screen
        const timer = setTimeout(() => {
          // Navigate to provider dashboard
          router.replace('/provider/dashboard');
        }, 3000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error switching to provider mode:', error);
        // If there's an error, still try to navigate
        router.replace('/provider/dashboard');
      }
    };
    
    setupProviderMode();
  }, []);
  
  return (
    <View className="flex-1 bg-primary-500 items-center justify-center px-6">
      {/* Animatable logo */}
      <Animatable.View 
        animation="zoomIn" 
        duration={1000}
        className="items-center"
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ width: 180, height: 180 }}
          resizeMode="contain"
        />
      </Animatable.View>
      
      {/* Animatable welcome text */}
      <Animatable.Text 
        animation="fadeIn" 
        delay={500}
        duration={1000}
        className="text-white text-3xl font-bold text-center mt-6"
      >
        Welcome to Provider Mode
      </Animatable.Text>
      
      <Animatable.Text 
        animation="fadeIn" 
        delay={800}
        duration={1000}
        className="text-white/80 text-center mt-4 text-lg"
      >
        Manage your services and clients
      </Animatable.Text>
      
      {/* Loading indicator */}
      <Animatable.View 
        animation="fadeIn" 
        delay={1200}
        className="mt-12"
      >
        <ActivityIndicator size="large" color="white" />
      </Animatable.View>
    </View>
  );
}
