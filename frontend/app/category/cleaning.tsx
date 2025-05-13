import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

const CleaningPage = () => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('recommended');
  
  // Provider data for this category
  const providers = [
    {
      id: '1',
      name: "Clean & Shine",
      specialty: "Home Deep Cleaning",
      rating: 4.8,
      reviews: 456,
      startingPrice: 22000,
      imageUrl: require('../../assets/images/offers/3.png'),
      availability: "Available today",
      verified: true,
      experience: "6 years"
    },
    // ... more providers ...
  ];

  // ... sorting function and UI structure similar to above ...
  
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
          <Text className="text-white text-xl font-bold">Cleaning</Text>
        </View>
      </View>

      {/* ... rest of content similar to above ... */}
    </View>
  );
};

export default CleaningPage;
