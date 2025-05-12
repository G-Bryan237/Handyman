import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const INBOX_TYPES = [
  { id: '1', name: 'All', icon: 'mail-outline' },
  { id: '2', name: 'Unread', icon: 'mail-unread-outline' }
];

const MESSAGES = [
  {
    id: '2',
    sender: 'John Miller',
    message: 'I will be arriving 15 minutes early to your location. Please make sure the water supply is turned off before I get there.',
    time: '1d ago',
    read: true,
    type: 'provider',
    avatar: null
  },
  {
    id: '3',
    sender: 'ElectroPro Services',
    message: 'Thank you for scheduling an appointment. We\'ve sent a confirmation to your email with all the details.',
    time: '3d ago',
    read: true,
    type: 'provider',
    avatar: null
  },
  {
    id: '4',
    sender: 'Promo Team',
    message: 'Special weekend offer: Get 25% off on all cleaning services booked this weekend!',
    time: '1w ago',
    read: true,
    type: 'promo',
    avatar: null
  }
];

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState('All');
  
  // Filter messages based on active tab
  const filteredMessages = () => {
    switch(activeTab) {
      case 'Unread':
        return MESSAGES.filter(message => !message.read);
      default:
        return MESSAGES;
    }
  };

  // Get message icon based on type
  const getMessageIcon = (type: string) => {
    switch(type) {
      case 'provider':
        return <MaterialIcons name="home-repair-service" size={22} color="#4FC3F7" />;
      case 'promo':
        return <MaterialIcons name="local-offer" size={22} color="#FF8A65" />;
      default:
        return <Ionicons name="chatbox" size={22} color="#81C784" />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-primary-500 pt-12 pb-6 px-5 rounded-b-3xl shadow-md">
          <Text className="text-white text-2xl font-bold">Messages</Text>
        </View>

        {/* Inbox Type Tabs */}
        <View className="flex-row px-4 py-5 mt-2">
          {INBOX_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`flex-row items-center mr-4 px-4 py-2.5 rounded-full ${
                activeTab === type.name 
                  ? 'bg-primary-100' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onPress={() => setActiveTab(type.name)}
            >
              <Ionicons 
                name={type.icon as any} 
                size={18} 
                color={activeTab === type.name ? "#2563eb" : "#6B7280"} 
                style={{ marginRight: 5 }}
              />
              <Text className={`font-medium ${
                activeTab === type.name ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Messages List */}
        {filteredMessages().length > 0 ? (
          <View className="px-4">
            <Text className="text-gray-600 dark:text-gray-400 text-base font-medium mb-3 px-1">RECENT MESSAGES</Text>
            
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              {filteredMessages().map((message, index) => (
                <React.Fragment key={message.id}>
                  <TouchableOpacity
                    className={`p-4 ${!message.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <View className="bg-primary-100 dark:bg-primary-900 rounded-full w-10 h-10 mr-3 items-center justify-center">
                          {getMessageIcon(message.type)}
                        </View>
                        <View>
                          <Text className="text-gray-800 dark:text-white font-semibold">{message.sender}</Text>
                          <Text className="text-gray-400 text-xs">{message.time}</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        className="bg-gray-100 dark:bg-gray-700 rounded-full p-1.5"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    <Text 
                      className="text-gray-600 dark:text-gray-300 mt-1 leading-5" 
                      numberOfLines={2}
                    >
                      {message.message}
                    </Text>
                    <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {!message.read ? (
                        <View className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                          <Text className="text-primary-500 text-xs font-medium">New message</Text>
                        </View>
                      ) : (
                        <View />
                      )}
                      <TouchableOpacity 
                        className="bg-primary-500 px-3 py-1.5 rounded-lg flex-row items-center"
                        activeOpacity={0.7}
                      >
                        <Text className="text-white mr-1">Reply</Text>
                        <MaterialIcons name="reply" size={16} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                  {index < filteredMessages().length - 1 && (
                    <View className="h-[1px] bg-gray-200 dark:bg-gray-700" />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ) : (
          <View className="items-center justify-center px-5 mt-10">
            <View className="bg-primary-100 dark:bg-primary-900/20 rounded-full w-16 h-16 items-center justify-center mb-4">
              <Ionicons name="chatbubble-ellipses-outline" size={36} color="#2563eb" />
            </View>
            <Text className="text-gray-800 dark:text-gray-200 text-lg font-semibold text-center">No messages found</Text>
            <Text className="text-gray-500 text-center mt-2">Messages matching your filter will appear here</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
