import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

const PlumbersPage = () => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('recommended');
  
  // Provider data for this category
  const providers = [
    {
      id: '1',
      name: "Pro Plumbing",
      specialty: "Pipe Repairs & Installation",
      rating: 4.9,
      reviews: 189,
      startingPrice: 13000,
      imageUrl: require('../../assets/images/top_rated/pro_plumbing.png'),
      availability: "Available today",
      verified: true,
      experience: "8 years"
    },
    {
      id: '2',
      name: "Water Works",
      specialty: "Bathroom Plumbing",
      rating: 4.7,
      reviews: 156,
      startingPrice: 11000,
      imageUrl: require('../../assets/images/top_rated/pro_plumbing.png'),
      availability: "Available tomorrow",
      verified: true,
      experience: "6 years"
    },
    {
      id: '3',
      name: "Drain Masters",
      specialty: "Clogged Drain Solutions",
      rating: 4.8,
      reviews: 210,
      startingPrice: 9000,
      imageUrl: require('../../assets/images/top_rated/pro_plumbing.png'),
      availability: "Available today",
      verified: true,
      experience: "10 years"
    },
  ];

  // Sorting function for providers
  const getSortedProviders = () => {
    return [...providers].sort((a, b) => {
      if (sortOption === 'recommended') {
        return b.rating - a.rating;
      } else if (sortOption === 'price') {
        return a.startingPrice - b.startingPrice;
      }
      return 0;
    });
  };

  const sortedProviders = getSortedProviders();

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
          <Text className="text-white text-xl font-bold">Plumbers</Text>
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
            <View className="bg-[#4b9fd6] rounded-full p-2 mr-2">
              <MaterialIcons name="plumbing" size={20} color="white" />
            </View>
            <Text className="text-gray-800 text-lg font-semibold">Find plumbers near you</Text>
          </View>
          <Text className="text-gray-600 text-sm">
            Expert plumbing services for leaks, installations, and drain cleaning
          </Text>
        </View>

        {/* ... sorting options and provider cards like in electricians.tsx ... */}
      </ScrollView>
    </View>
  );
};

export default PlumbersPage;
