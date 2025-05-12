import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen as RouterSplashScreen, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import "../global.css";
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, ActivityIndicator } from 'react-native';
import { getToken, getUserData } from '../utils/storage';
import apiService from '../utils/api';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  // Local authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status on app load
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      if (token) {
        // Verify the token is still valid by making an API call
        try {
          console.log('[Layout] Validating token by retrieving user profile');
          const response = await apiService.getUserProfile();
          console.log('[Layout] Profile API response:', response.data);
          
          if (response.data && response.data.user) {
            console.log('[Layout] Valid user profile retrieved, setting isLoggedIn to true');
            setIsLoggedIn(true);
          } else {
            console.log('[Layout] No user data in response, setting isLoggedIn to false');
            setIsLoggedIn(false);
          }
        } catch (error: any) { // Type assertion for error
          console.error('[Layout] Token validation failed:', error);
          console.error('[Layout] Status code:', error.response?.status);
          console.error('[Layout] Error data:', error.response?.data);
          setIsLoggedIn(false);
        }
      } else {
        console.log('[Layout] No token found, setting isLoggedIn to false');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('[Layout] Auth check failed:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      checkAuth();
    }
  }, [loaded]);

  if (!loaded || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-500">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Determine the initial route based on authentication status
  const initialRouteName = isLoggedIn ? '(tabs)' : 'auth';

  return (
    <>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen 
          name="auth" 
          options={{
            // If user is authenticated, they shouldn't access auth screens
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="index"
        />
        <Stack.Screen 
          name="(tabs)" 
        />
        <Stack.Screen 
          name="discounts/beautician" 
        />
        <Stack.Screen 
          name="discounts/laundry" 
        />
        <Stack.Screen 
          name="discounts/cleaning"
        />
      </Stack>
      
      {/* Global redirection based on auth state */}
      {!isLoggedIn && (
        <>
          {/* Redirect protected routes to auth */}
          {(window.location.pathname.includes('/(tabs)') || 
            window.location.pathname.includes('/discounts/')) && (
            <Redirect href="/auth" />
          )}
        </>
      )}
      
      {/* Redirect authenticated users trying to access auth */}
      {isLoggedIn && window.location.pathname.includes('/auth') && (
        <Redirect href="/(tabs)" />
      )}
    </>
  );
}