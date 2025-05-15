import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import apiService from '../../utils/api';

// Types for bookings
type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  providerImage?: string;
  date: string;
  time: string;
  status: BookingStatus;
  totalPrice: number;
  address: string;
}

// Helper function to get status color
const getStatusColor = (status: BookingStatus) => {
  switch(status) {
    case 'pending': return 'bg-yellow-500';
    case 'confirmed': return 'bg-blue-500';
    case 'in-progress': return 'bg-purple-500';
    case 'completed': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // Mock data - would be replaced with API call
  const mockBookings: Booking[] = [
    {
      id: '1',
      serviceId: '101',
      serviceName: 'House Cleaning',
      providerName: 'Marie Cleaner',
      date: '2023-11-20',
      time: '14:00',
      status: 'confirmed',
      totalPrice: 45,
      address: '123 Main St, Douala',
    },
    {
      id: '2',
      serviceId: '102',
      serviceName: 'Plumbing Repair',
      providerName: 'John Pipes',
      date: '2023-11-25',
      time: '10:30',
      status: 'pending',
      totalPrice: 60,
      address: '456 Central Ave, Yaounde',
    },
    {
      id: '3',
      serviceId: '103',
      serviceName: 'Electrical Work',
      providerName: 'Electra Tech',
      date: '2023-10-15',
      time: '09:00',
      status: 'completed',
      totalPrice: 75,
      address: '789 Power St, Douala',
    },
    {
      id: '4',
      serviceId: '104',
      serviceName: 'Furniture Assembly',
      providerName: 'Build Bros',
      date: '2023-10-05',
      time: '11:00',
      status: 'cancelled',
      totalPrice: 35,
      address: '101 Home Rd, Bafoussam',
    },
    {
      id: '5',
      serviceId: '105',
      serviceName: 'Gardening Service',
      providerName: 'Green Thumb',
      date: '2023-12-01',
      time: '08:00',
      status: 'confirmed',
      totalPrice: 55,
      address: '202 Garden Ln, Limbe',
    }
  ];
  
  // Simulate API call to load bookings
  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await apiService.getBookings();
        // setBookings(response.data.bookings);
        
        // Using mock data for now
        setTimeout(() => {
          setBookings(mockBookings);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setIsLoading(false);
      }
    };
    
    loadBookings();
  }, []);
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (activeTab === 'upcoming') {
      return bookingDate >= today && booking.status !== 'cancelled' && booking.status !== 'completed';
    } else {
      return bookingDate < today || booking.status === 'cancelled' || booking.status === 'completed';
    }
  });
  
  const handleBookingPress = (bookingId: string) => {
    // Navigate to booking detail screen
    router.push(`/profile/booking-detail?id=${bookingId}`);
  };
  
  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity 
      className="bg-white dark:bg-gray-800 rounded-2xl mb-4 shadow-sm overflow-hidden"
      onPress={() => handleBookingPress(item.id)}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-gray-800 dark:text-gray-200 text-lg font-semibold">{item.serviceName}</Text>
          <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
            <Text className="text-white text-xs font-medium capitalize">{item.status}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="person" size={16} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">{item.providerName}</Text>
        </View>
        
        <View className="flex-row justify-between mb-1">
          <View className="flex-row items-center">
            <MaterialIcons name="event" size={16} color="#9ca3af" />
            <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">{formatDate(item.date)}</Text>
          </View>
          
          <View className="flex-row items-center">
            <MaterialIcons name="access-time" size={16} color="#9ca3af" />
            <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">{item.time}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="location-on" size={16} color="#9ca3af" />
          <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">{item.address}</Text>
        </View>
        
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
          <Text className="text-gray-800 dark:text-gray-200 font-semibold">Total:</Text>
          <Text className="text-primary-500 font-bold">{item.totalPrice.toLocaleString()} FCFA</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-primary-500 pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">My Bookings</Text>
        </View>
      </View>
      
      {/* Tabs */}
      <View className="flex-row bg-white dark:bg-gray-800 p-2 mx-4 mt-4 rounded-xl">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-lg ${activeTab === 'upcoming' ? 'bg-primary-500' : 'bg-transparent'}`}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text 
            className={`text-center font-medium ${activeTab === 'upcoming' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-lg ${activeTab === 'past' ? 'bg-primary-500' : 'bg-transparent'}`}
          onPress={() => setActiveTab('past')}
        >
          <Text 
            className={`text-center font-medium ${activeTab === 'past' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Booking List */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="mt-2 text-gray-600 dark:text-gray-400">Loading bookings...</Text>
          </View>
        ) : filteredBookings.length > 0 ? (
          <FlatList
            data={filteredBookings}
            renderItem={renderBookingItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <MaterialIcons name="event-busy" size={64} color="#9ca3af" />
            <Text className="mt-4 text-gray-600 dark:text-gray-400 text-lg">No {activeTab} bookings</Text>
            <Text className="mt-1 text-gray-500 dark:text-gray-500 text-center px-8">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming bookings. Browse services to book now!"
                : "You don't have any past bookings yet."}
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity 
                className="mt-6 bg-primary-500 py-3 px-6 rounded-xl"
                onPress={() => router.push('/(tabs)')}
              >
                <Text className="text-white font-medium">Find Services</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
