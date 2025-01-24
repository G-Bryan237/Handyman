import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const INBOX_TYPES = [
  { id: '1', name: 'All', active: true },
  { id: '2', name: 'Unread', active: false },
  { id: '3', name: 'Notifications', active: false }
];

const MESSAGES = [
  {
    id: '1',
    sender: 'Support Team',
    message: 'Your booking for plumbing service is confirmed.',
    time: '2h ago',
    read: false
  },
  
  {
    id: '2',
    sender: 'Service Provider',
    message: 'I will be arriving 15 minutes early.',
    time: '1d ago',
    read: true
  }
];

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="flex-1">
        {/* Header */}
        <View className="pt-11 py-4 px-6">
          <Text className="text-white text-2xl font-bold">Inbox</Text>
        </View>

        {/* Inbox Type Tabs */}
        <View className="flex-row px-4 mb-4">
          {INBOX_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`p-2 mr-2 rounded-lg ${
                activeTab === type.name ? 'bg-yellow-500' : 'bg-gray-700'
              }`}
              onPress={() => setActiveTab(type.name)}
            >
              <Text className={`text-white ${
                activeTab === type.name ? 'text-gray-800' : 'text-gray-300'
              }`}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Messages List */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          className="flex-1 px-4"
        >
          {MESSAGES.map((message) => (
            <TouchableOpacity
              key={message.id}
              className={`bg-gray-700 p-4 rounded-lg mb-3 ${
                !message.read ? 'border-2 border-yellow-500' : ''
              }`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  {/* Unread Indicator */}
                  {!message.read && (
                    <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  )}
                  <Text className="text-white text-lg">{message.sender}</Text>
                </View>
                <Text className="text-gray-400">{message.time}</Text>
              </View>
              <Text className="text-gray-300 mt-2">{message.message}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
