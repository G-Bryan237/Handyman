import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserData, getActiveRole } from '../../utils/storage';

// Import provider tab screens
import JobsScreen from './tabs/jobs';
import EarningsScreen from './tabs/earnings';
import ReputationScreen from './tabs/reputation';
import ScheduleScreen from './tabs/schedule';
import ProfileScreen from './tabs/profile';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

export default function ProviderDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<string>('provider');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data and active role
        const [userData, role] = await Promise.all([
          getUserData(),
          getActiveRole()
        ]);
        
        setUserData(userData);
        setActiveRole(role);
        
        // If user is not a provider or active role is not set to provider, redirect
        if (userData?.role !== 'provider' || role !== 'provider') {
          console.log('User is not a provider or not in provider mode');
          router.replace('/(tabs)');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading provider dashboard:', error);
        router.replace('/(tabs)');
      }
    };
    
    loadData();
  }, []);
  
  const handleSwitchToClient = () => {
    router.replace('/client/welcome');
  };
  
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  
  return (
    <View className="flex-1">
      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopColor: '#e5e7eb',
            paddingBottom: 5,
            paddingTop: 5,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="JobsTab" 
          component={JobsScreen} 
          options={{
            tabBarLabel: "Jobs",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
            )
          }}
        />
        
        <Tab.Screen 
          name="EarningsTab" 
          component={EarningsScreen} 
          options={{
            tabBarLabel: "Earnings",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="wallet" color={color} size={size} />
            )
          }}
        />
        
        <Tab.Screen 
          name="ReputationTab" 
          component={ReputationScreen} 
          options={{
            tabBarLabel: "Reputation",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="star" color={color} size={size} />
            )
          }}
        />
        
        <Tab.Screen 
          name="ScheduleTab" 
          component={ScheduleScreen} 
          options={{
            tabBarLabel: "Schedule",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" color={color} size={size} />
            )
          }}
        />
        
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileScreen} 
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
