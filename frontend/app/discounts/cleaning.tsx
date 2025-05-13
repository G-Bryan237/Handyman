// app/discounts/cleaning.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CleaningDiscounts = () => {
  const router = useRouter();
  // Sort options
  const [sortOption, setSortOption] = useState('recommended');
  
  // Enhanced discounts data with prices, dates, and images
  const discounts = [
    { 
      id: '1', 
      provider: 'Home Clean Pro', 
      discount: '20% off',
      discountPercent: 20,
      service: 'Deep Cleaning Service',
      originalPrice: 25000, 
      discountedPrice: 20000,
      validUntil: 'Valid until Nov 15, 2023',
      image: require('../../assets/images/offers/3.png'),
      rating: 4.7,
      reviews: 143,
      dateAdded: new Date('2023-10-05')
    },
    { 
      id: '2', 
      provider: 'Clean Masters', 
      discount: '15% off',
      discountPercent: 15, 
      service: 'Regular Home Cleaning',
      originalPrice: 18000,
      discountedPrice: 15300,
      validUntil: 'Valid until Nov 20, 2023',
      image: require('../../assets/images/offers/3.png'),
      rating: 4.5,
      reviews: 98,
      dateAdded: new Date('2023-10-08')
    },
    { 
      id: '3', 
      provider: 'Spotless Services', 
      discount: '25% off',
      discountPercent: 25, 
      service: 'Premium Office Cleaning',
      originalPrice: 35000,
      discountedPrice: 26250,
      validUntil: 'Valid until Oct 30, 2023',
      image: require('../../assets/images/offers/3.png'),
      rating: 4.9,
      reviews: 176,
      dateAdded: new Date('2023-10-15')
    },
  ];

  // Sort function
  const getSortedDiscounts = () => {
    switch (sortOption) {
      case 'highestDiscount':
        return [...discounts].sort((a, b) => b.discountPercent - a.discountPercent);
      case 'date':
        const now = new Date();
        return [...discounts].sort((a, b) => {
          const daysA = Math.floor((now.getTime() - a.dateAdded.getTime()) / (1000 * 60 * 60 * 24));
          const daysB = Math.floor((now.getTime() - b.dateAdded.getTime()) / (1000 * 60 * 60 * 24));
          return daysA - daysB;
        });
      default:
        return discounts;
    }
  };

  const sortedDiscounts = getSortedDiscounts();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with primary color background */}
      <View className="bg-primary-500 pt-12 pb-4 px-5 rounded-b-3xl shadow-md">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white/20 p-2.5 rounded-full mr-4"
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Cleaning Services Offers</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        className="flex-1 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Sort options */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center mb-2">
            <AntDesign name="filter" size={16} color="#4B5563" />
            <Text className="text-gray-600 font-medium ml-2">Sort by:</Text>
          </View>
          
          <View className="flex-row">
            <TouchableOpacity 
              className={`rounded-full py-2 px-4 mr-2 ${sortOption === 'recommended' ? 'bg-primary-500' : 'bg-gray-200'}`}
              onPress={() => setSortOption('recommended')}
            >
              <Text className={sortOption === 'recommended' ? 'text-white font-medium' : 'text-gray-600'}>
                Recommended
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`rounded-full py-2 px-4 mr-2 ${sortOption === 'highestDiscount' ? 'bg-primary-500' : 'bg-gray-200'}`}
              onPress={() => setSortOption('highestDiscount')}
            >
              <Text className={sortOption === 'highestDiscount' ? 'text-white font-medium' : 'text-gray-600'}>
                Highest Discount
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`rounded-full py-2 px-4 ${sortOption === 'date' ? 'bg-primary-500' : 'bg-gray-200'}`}
              onPress={() => setSortOption('date')}
            >
              <Text className={sortOption === 'date' ? 'text-white font-medium' : 'text-gray-600'}>
                New
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Discount Cards */}
        <View className="px-4">
          {sortedDiscounts.map((item) => (
            <TouchableOpacity 
              key={item.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100"
            >
              {/* Image container */}
              <View className="w-full relative">
                <Image 
                  source={item.image} 
                  className="w-full h-56"
                  resizeMode="cover"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
                <View className="absolute top-3 right-3 bg-white/90 px-2.5 py-1.5 rounded-lg flex-row items-center shadow-md">
                  <FontAwesome5 name="star" solid size={12} color="#FFD700" />
                  <Text className="ml-1 font-bold text-sm text-gray-800">{item.rating}</Text>
                </View>
                <View className="absolute top-3 left-3 bg-primary-500 px-3 py-1.5 rounded-lg shadow-md">
                  <Text className="text-white font-medium">{item.discount}</Text>
                </View>
              </View>
              
              <View className="p-4">
                {/* Provider name */}
                <Text className="text-gray-900 font-bold text-xl mb-1">{item.provider}</Text>
                
                <View className="flex-row items-center mt-1 mb-2">
                  <MaterialIcons name="verified" size={14} color="#2563eb" />
                  <Text className="text-gray-500 text-xs ml-1">{item.reviews} reviews</Text>
                </View>
                
                <View className="h-[1px] bg-gray-100 my-2" />
                
                <View className="flex-row justify-between items-center mt-1">
                  <View>
                    <Text className="text-gray-800 font-medium">{item.service}</Text>
                    <Text className="text-gray-500 text-xs mt-1">{item.validUntil}</Text>
                    
                    {/* Price display */}
                    <View className="flex-row items-center mt-2">
                      <Text className="text-gray-400 text-sm line-through mr-2">
                        {item.originalPrice} CFA
                      </Text>
                      <Text className="text-primary-500 font-bold text-lg">
                        {item.discountedPrice.toFixed(0)} CFA
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity className="bg-primary-500 rounded-full p-3 shadow-md">
                    <FontAwesome5 name="arrow-right" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CleaningDiscounts;