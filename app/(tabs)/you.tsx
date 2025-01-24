import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const PROFILE_SECTIONS = [
  { id: '1', name: 'Personal Information', icon: '👤' },
  { id: '2', name: 'My Bookings', icon: '📅' },
  { id: '3', name: 'Payment Methods', icon: '💳' },
  { id: '4', name: 'Settings', icon: '⚙️' }
];

export default function YouScreen() {
  return (
    <View className="flex-1 bg-gray-800 p-4">
      <Text className="text-white text-2xl font-bold mb-4">Profile</Text>
      
      {/* User Summary */}
      <View className="bg-gray-700 p-4 rounded-lg mb-4 items-center">
        <View className="w-24 h-24 bg-yellow-500 rounded-full items-center justify-center">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-white text-xl mt-3">Alex Rodriguez</Text>
        <Text className="text-gray-400">alex.rodriguez@example.com</Text>
      </View>

      {/* Profile Sections */}
      <ScrollView>
        {PROFILE_SECTIONS.map((section) => (
          <TouchableOpacity 
            key={section.id} 
            className="bg-gray-700 p-4 rounded-lg mb-3 flex-row items-center"
          >
            <Text className="text-2xl mr-4">{section.icon}</Text>
            <Text className="text-white text-lg flex-1">{section.name}</Text>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          className="bg-yellow-500 p-4 rounded-lg mt-4"
        >
          <Text className="text-gray-800 text-center font-bold">
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}