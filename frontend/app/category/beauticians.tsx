import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

const BeauticiansPage = () => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('recommended');
  
  // Provider data for this category
  const providers = [
    {
      id: '1',
      name: "Beauty Plus",
      specialty: "Hair Styling & Makeup",
      rating: 4.9,
      reviews: 312,
      startingPrice: 18000,
      imageUrl: require('../../assets/images/offers/1.png'),
      availability: "Available today",
      verified: true,
      experience: "9 years"
    },
    {
      id: '2',
      name: "Glamour Studio",
      specialty: "Nail Art & Care",
      rating: 4.8,
      reviews: 245,
      startingPrice: 15000,
      imageUrl: require('../../assets/images/offers/1.png'),
      availability: "Available tomorrow",
      verified: true,
      experience: "7 years"
    },
    {
      id: '3',
      name: "Beauty Hub",
      specialty: "Full Beauty Services",
      rating: 4.7,
      reviews: 178,
      startingPrice: 22000,
      imageUrl: require('../../assets/images/offers/1.png'),
      availability: "Available today",
      verified: true,
      experience: "5 years"
    },
  ];

  // ... same sorting function ...

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary-500 pt-12 pb-4 px-5 rounded-b-3xl shadow-md">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white/20 p-2.5 rounded-full mr-4"
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Beauticians</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Category Info */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center mb-2">
            <View className="bg-[#ff69b4] rounded-full p-2 mr-2">
              <MaterialIcons name="spa" size={20} color="white" />
            </View>
            <Text className="text-gray-800 text-lg font-semibold">Find beauticians near you</Text>
          </View>
          <Text className="text-gray-600 text-sm">
            Professional beauty services including hairstyling, makeup, and nail care
          </Text>
        </View>

        {/* ... sorting options and provider cards ... */}
      </ScrollView>
    </View>
  );
};

export default BeauticiansPage;
