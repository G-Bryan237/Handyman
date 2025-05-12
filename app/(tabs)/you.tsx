import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';

const PROFILE_SECTIONS = [
  { id: '1', name: 'Personal Information', icon: 'person', route: '/profile/personal' },
  { id: '2', name: 'My Bookings', icon: 'event-note', route: '/profile/bookings' },
  { id: '3', name: 'Payment Methods', icon: 'payment', route: '/profile/payments' },
  { id: '4', name: 'Settings', icon: 'settings', route: '/profile/settings' }
];

// Additional sections for service providers
const PROVIDER_SECTIONS = [
  { id: '5', name: 'My Services', icon: 'home-repair-service', route: '/profile/services' },
  { id: '6', name: 'Service Requests', icon: 'assignment', route: '/profile/requests' },
  { id: '7', name: 'Earnings', icon: 'account-balance-wallet', route: '/profile/earnings' }
];

export default function YouScreen() {
  const router = useRouter();
  const { userData, logout } = useAuthStore();
  const isProvider = userData?.role === 'provider';

  // Display appropriate sections based on user role
  const displaySections = isProvider 
    ? [...PROFILE_SECTIONS, ...PROVIDER_SECTIONS] 
    : PROFILE_SECTIONS;

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-500 pt-12 pb-6 px-5 rounded-b-3xl shadow-md">
          <Text className="text-white text-2xl font-bold">My Profile</Text>
          {isProvider && (
            <View className="bg-white/25 px-3 py-1 rounded-full mt-2 self-start">
              <Text className="text-white font-medium">Service Provider</Text>
            </View>
          )}
        </View>
        
        <View className="px-4 pt-6">
          {/* User Summary */}
          <View className="bg-white dark:bg-gray-800 p-5 rounded-2xl mb-6 shadow-sm flex-row items-center">
            <View className="w-20 h-20 bg-primary-400 rounded-full items-center justify-center mr-4 shadow-sm">
              <Text className="text-3xl">👤</Text>
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white text-xl font-semibold">
                {userData?.name || "User"}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {userData?.email || "user@example.com"}
              </Text>
            </View>
          </View>

          {/* Section Title */}
          <Text className="text-gray-600 dark:text-gray-400 text-base font-medium mb-3 px-1">ACCOUNT</Text>
          
          {/* Profile Sections */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
            {displaySections.map((section, index) => (
              <React.Fragment key={section.id}>
                <TouchableOpacity 
                  className="p-4 flex-row items-center"
                  onPress={() => router.push(section.route as any)}
                >
                  <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-4">
                    <MaterialIcons name={section.icon as any} size={24} color="#2563eb" />
                  </View>
                  <Text className="text-gray-800 dark:text-gray-200 text-base flex-1">{section.name}</Text>
                  <View className="w-6 h-6 items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                    <Text className="text-gray-500 dark:text-gray-400 text-xs">→</Text>
                  </View>
                </TouchableOpacity>
                {index < displaySections.length - 1 && (
                  <View className="h-[1px] bg-gray-200 dark:bg-gray-700 ml-16" />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            className="bg-primary-500 p-4 rounded-xl shadow-sm mt-4 mb-10"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}