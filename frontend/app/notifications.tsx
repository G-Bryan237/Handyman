import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your booking for plumbing service is confirmed. The service provider will arrive between 2-4 PM tomorrow.',
    time: '2h ago',
    read: false,
    type: 'booking'
  },
  {
    id: '2',
    title: 'New Service Available',
    message: 'We have added new pool cleaning services in your area. Check them out now!',
    time: '1d ago',
    read: true,
    type: 'service'
  },
  {
    id: '3',
    title: 'Payment Successful',
    message: 'Your payment of $120 for electrical repairs has been successfully processed.',
    time: '3d ago',
    read: true,
    type: 'payment'
  },
  {
    id: '4',
    title: 'Special Offer',
    message: 'Special weekend offer: Get 25% off on all cleaning services booked this weekend!',
    time: '1w ago',
    read: true,
    type: 'promo'
  },
  {
    id: '5',
    title: 'Booking Reminder',
    message: 'Reminder: You have a plumbing service appointment tomorrow at 10:00 AM.',
    time: '1w ago',
    read: true,
    type: 'reminder'
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'booking':
        return <MaterialIcons name="event-available" size={22} color="#4FC3F7" />;
      case 'service':
        return <MaterialIcons name="home-repair-service" size={22} color="#81C784" />;
      case 'payment':
        return <MaterialIcons name="payment" size={22} color="#FF8A65" />;
      case 'promo':
        return <MaterialIcons name="local-offer" size={22} color="#FFB74D" />;
      case 'reminder':
        return <MaterialIcons name="notification-important" size={22} color="#BA68C8" />;
      default:
        return <Ionicons name="notifications" size={22} color="#E0E0E0" />;
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
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Notifications</Text>
          </View>
        </View>

        {/* Notifications List */}
        <View className="px-4 pt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600 dark:text-gray-400 text-base font-medium px-1">RECENT NOTIFICATIONS</Text>
            <TouchableOpacity className="bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-full">
              <Text className="text-primary-500 text-xs font-medium">Mark all as read</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {NOTIFICATIONS.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <TouchableOpacity
                  className={`p-4 ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="bg-primary-100 dark:bg-primary-900 rounded-full w-10 h-10 mr-3 items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between">
                        <Text className="text-gray-800 dark:text-white font-semibold">{notification.title}</Text>
                        <Text className="text-gray-400 text-xs">{notification.time}</Text>
                      </View>
                      <Text 
                        className="text-gray-600 dark:text-gray-300 mt-1 leading-5" 
                        numberOfLines={2}
                      >
                        {notification.message}
                      </Text>
                    </View>
                    {!notification.read && (
                      <View className="bg-primary-500 w-2.5 h-2.5 rounded-full ml-2"></View>
                    )}
                  </View>
                </TouchableOpacity>
                {index < NOTIFICATIONS.length - 1 && (
                  <View className="h-[1px] bg-gray-200 dark:bg-gray-700" />
                )}
              </React.Fragment>
            ))}
          </View>
          
          <View className="mt-6 mb-4">
            <Text className="text-gray-600 dark:text-gray-400 text-base font-medium mb-3 px-1">EARLIER</Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-10 items-center">
              <View className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 items-center justify-center mb-4">
                <Ionicons name="checkmark-done-outline" size={36} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mt-2">All caught up!</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                You have no more notifications
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
