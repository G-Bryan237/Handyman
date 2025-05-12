import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

interface HandymanBooking {
  id: number;
  name: string;
  service: string;
  date: string;
  status: 'pending' | 'completed' | 'confirmed';
  rating: number;
  image: ImageSourcePropType;
}

const HandymanBookings: React.FC = () => {
  const serviceAbbreviations: { [key: string]: string } = {
    "Plumbing Repair": "PL",
    "Electrical Maintenance": "EM",
    "Home Cleaning": "HC",
  };
  
  const bookings: HandymanBooking[] = [
    {
      id: 1,
      name: "John Smith",
      service: "Plumbing Repair",
      date: "Dec 15, 2024",
      status: "confirmed",
      rating: 4,
      image: require('../../assets/images/John.jpg'),
    },
    {
      id: 2,
      name: "Mike Johnson",
      service: "Electrical Maintenance",
      date: "Dec 16, 2024",
      status: "completed",
      rating: 5,
      image: require('../../assets/images/mike.jpg'),
    },
    {
      id: 3,
      name: "Sarah Wilson",
      service: "Home Cleaning",
      date: "Dec 20, 2024",
      status: "pending",
      rating: 0, // Not yet rated
      image: require('../../assets/images/John.jpg'), // Placeholder image
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        style={{ marginRight: 2 }}
      />
    ));
  };

  const copyToClipboard = (text: string) => {
    Alert.alert("Copied", `Order code: ${text} has been copied to clipboard.`);
  };

  const formatOrderCode = (booking: HandymanBooking): string => {
    const formattedName = booking.name.split(" ").map(n => n[0]).join("").toUpperCase();
    const serviceCode = serviceAbbreviations[booking.service] || booking.service.substring(0, 2).toUpperCase();
    const month = new Date(booking.date).getMonth() + 1;
    const day = booking.date.match(/\d+/)?.[0] || "";
    const year = booking.date.match(/\d{4}/)?.[0].slice(-2) || "";
    return `${formattedName}${serviceCode}${day}${month.toString().padStart(2, '0')}${year}`;
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-500';
      case 'confirmed': return 'bg-blue-600';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{paddingBottom: 30}}
      >
        {/* Header */}
        <View className="bg-primary-500 pt-12 pb-6 px-5 rounded-b-3xl shadow-md">
          <Text className="text-white text-2xl font-bold">My Bookings</Text>
        </View>

        <View className="px-4 pt-6">
          <Text className="text-gray-600 dark:text-gray-400 text-base font-medium mb-3 px-1">UPCOMING APPOINTMENTS</Text>

          {bookings.length > 0 ? (
            bookings.map((booking, index) => {
              const orderCode = formatOrderCode(booking);
              const statusColor = getStatusColor(booking.status);

              return (
                <View
                  key={booking.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl mb-5 shadow-sm overflow-hidden"
                >
                  {/* Status Bar */}
                  <View className={`h-2 w-full ${statusColor}`} />
                  
                  <View className="p-5">
                    {/* Top section with ID and status */}
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                        <Text className="font-medium text-gray-600 dark:text-gray-300">
                          #{(booking.id).toString().padStart(3, '0')}
                        </Text>
                      </View>
                      
                      <View className={`flex-row items-center ${statusColor} px-3 py-1.5 rounded-full`}>
                        <View className="h-2 w-2 rounded-full bg-white mr-2" />
                        <Text className="font-semibold text-white text-xs">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Main booking details */}
                    <View className="flex-row">
                      <Image
                        source={booking.image}
                        className="w-20 h-24 rounded-lg mr-4"
                        resizeMode="cover"
                      />
                      
                      <View className="flex-1 justify-center">
                        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-1">{booking.name}</Text>
                        <Text className="text-gray-700 dark:text-gray-300 mb-1.5">{booking.service}</Text>
                        
                        <View className="flex-row items-center mb-2">
                          <MaterialIcons
                            name="event"
                            size={16}
                            color="#6B7280"
                            style={{ marginRight: 6 }}
                          />
                          <Text className="text-gray-600 dark:text-gray-400">{booking.date}</Text>
                        </View>
                        
                        {booking.rating > 0 && (
                          <View className="flex-row items-center">
                            {renderStars(booking.rating)}
                          </View>
                        )}
                        
                        {booking.rating === 0 && (
                          <Text className="text-gray-400 text-sm italic">Not yet rated</Text>
                        )}
                      </View>
                    </View>
                    
                    {/* Order Code section */}
                    <View className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <MaterialIcons name="receipt" size={18} color="#6B7280" />
                        <Text className="text-gray-700 dark:text-gray-300 font-medium ml-2">Order Code:</Text>
                      </View>
                      
                      <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                        <Text className="font-mono font-semibold text-gray-700 dark:text-gray-300 mr-2">{orderCode}</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(orderCode)}>
                          <Ionicons name="copy-outline" size={18} color="#4B5563" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Action buttons */}
                    <View className="flex-row mt-4">
                      <TouchableOpacity className="flex-1 bg-primary-500 rounded-lg py-3 mr-2 flex-row justify-center items-center">
                        <FontAwesome5 name="comment-alt" size={14} color="white" />
                        <Text className="text-white font-semibold ml-2">Message</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity className="flex-1 bg-white dark:bg-transparent border border-primary-500 rounded-lg py-3 flex-row justify-center items-center">
                        <MaterialIcons name="more-horiz" size={20} color="#2563EB" />
                        <Text className="text-primary-500 font-semibold ml-2">Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-10 mt-2 items-center">
              <View className="bg-primary-100 dark:bg-primary-900/20 rounded-full w-16 h-16 items-center justify-center mb-4">
                <MaterialIcons name="event-busy" size={36} color="#2563eb" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mt-2">No bookings yet</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Your service bookings will appear here once you've made them
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HandymanBookings;