import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


interface HandymanBooking {
  id: number;
  name: string;
  service: string;
  date: string;
  status: 'pending' | 'completed';
  rating: number;
  image: ImageSourcePropType;
}

const HandymanBookings: React.FC = () => {
  const serviceAbbreviations: { [key: string]: string } = {
    "Plumbing Repair": "PL",
    "Electrical Maintenance": "EM",
  };
const bookings: HandymanBooking[] = [
  {
    id: 1,
    name: "John Smith",
    service: "Plumbing Repair",
    date: "Dec 15, 2024",
    status: "pending",
    rating: 4,
    image: require('../../assets/images/John.jpg'), // Updated path
  },
  {
    id: 2,
    name: "Mike Johnson",
    service: "Electrical Maintenance",
    date: "Dec 16, 2024",
    status: "completed",
    rating: 5,
    image: require('../../assets/images/mike.jpg'), // Updated path
  },
];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={20}
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">Bookings</Text>
        </View>

        <ScrollView>
          {bookings.map((booking, index) => {
            const orderCode = formatOrderCode(booking);

            return (
              <View
                key={booking.id}
                className="border border-gray-300 bg-white rounded-lg p-6 mx-4 my-4 shadow-sm relative"
              >
                {/* Transaction Number (#ID) in red text */}
                <Text
                  className="absolute top-4 right-4 text-red-500 font-semibold text-lg"
                >
                  #{(index + 1).toString().padStart(2, '0')}
                </Text>

                {/* Booking Details */}
                <View className="flex-row items-center mb-6">
                  {/* Profile Image */}
                  <Image
                     source={booking.image}
                     style={{ width: 80, height: 100 }}

                     className="w-24 h-24 mr-6 object-cover"
                 />

                  <View className="flex-1">
                    {/* Name */}
                    <Text className="text-2xl font-bold mb-2">{booking.name}</Text>

                    {/* Service */}
                    <Text className="text-lg text-gray-700 mb-2">{booking.service}</Text>

                    {/* Date */}
                    <View className="flex-row items-center mb-2">
                      <MaterialIcons
                        name="calendar-today"
                        size={20}
                        color="gray"
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-gray-600 text-base">{booking.date}</Text>
                    </View>

                    {/* Stars */}
                    <View className="flex-row items-center">
                      {renderStars(booking.rating)}
                    </View>
                  </View>

                  {/* Status beside the details */}
                  <Text
                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                      booking.status === 'pending'
                        ? 'bg-purple-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>

                {/* Order Code, Copy Icon, and Order Text */}
                <View className="border-t border-gray-200 pt-4 mt-4 flex-row items-center justify-between">
                  {/* Order Text */}
                  <Text className="text-gray-800 text-base font-semibold flex-1">Order:</Text>

                  {/* Order Code and Copy Icon */}
                  <View className="flex-row items-center">
                    <Text className="text-gray-800 text-base font-semibold mr-2">{orderCode}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(orderCode)}>
                      <Ionicons name="copy-outline" size={24} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HandymanBookings;