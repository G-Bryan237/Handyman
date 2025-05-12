import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen as RouterSplashScreen, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import "../global.css";
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { View, ActivityIndicator } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const { checkAuth, isLoggedIn, isLoading } = useAuthStore();

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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="auth" />
          <Stack.Screen name="index" redirect />
        </>
      ) : (
        <>
          {/* Main Home Screen */}
          <Stack.Screen name="(tabs)" />
          
          {/* Discount Screens */}
          <Stack.Screen name="discounts/beautician" />
          <Stack.Screen name="discounts/laundry" />
          <Stack.Screen name="discounts/cleaning" />
          
          {/* Auth screens redirect back to home when logged in */}
          <Stack.Screen 
            name="auth" 
            options={{}}
            redirect
          />
        </>
      )}
    </Stack>
  );
}