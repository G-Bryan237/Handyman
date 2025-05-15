import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
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
  
  const switchToClient = () => {
    router.push('/client/welcome');
  };
  
  const menuItems = [
    {
      id: 'jobs',
      title: 'Jobs',
      icon: 'clipboard-list',
      color: '#3b82f6',
      route: '/provider/tabs/jobs',
      description: 'Manage service requests'
    },
    {
      id: 'earnings',
      title: 'Earnings',
      icon: 'wallet',
      color: '#10b981',
      route: '/provider/tabs/earnings',
      description: 'Track your income'
    },
    {
      id: 'reputation',
      title: 'Reputation',
      icon: 'star',
      color: '#f59e0b',
      route: '/provider/tabs/reputation',
      description: 'View ratings & reviews'
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: 'calendar',
      color: '#8b5cf6',
      route: '/provider/tabs/schedule',
      description: 'Manage availability'
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'account',
      color: '#ef4444',
      route: '/provider/tabs/profile',
      description: 'Update your information'
    },
  ];

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
      {/* Header */}
      <View className="bg-primary-500 pt-12 pb-6 px-5">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Provider Dashboard</Text>
            <Text className="text-white/80 mt-1">Manage your services</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleSwitchToClient}
            className="bg-white/20 px-3 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="swap-horizontal" size={16} color="white" className="mr-1" />
            <Text className="text-white text-sm">Switch to Client</Text>
          </TouchableOpacity>
        </View>
      </View>
      
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
