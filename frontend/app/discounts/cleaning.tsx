// app/discounts/cleaning.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const CleaningDiscounts = () => {
  const router = useRouter();
  const discounts = [
    { id: '1', provider: 'Home Clean Pro', discount: '20% off', service: 'Deep Cleaning' },
    { id: '2', provider: 'Clean Masters', discount: '15% off', service: 'Regular Cleaning' },
    // Add more cleaning-specific discounts
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header with return button */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2"
        >
          <FontAwesome5 name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">Cleaning Discounts</Text>
      </View>

      {/* Discount List */}
      <FlatList
        className="p-4"
        data={discounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-50 p-4 rounded-lg mb-3">
            <Text className="text-lg font-bold">{item.provider}</Text>
            <Text className="text-blue-500 text-xl">{item.discount}</Text>
            <Text className="text-gray-600">{item.service}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CleaningDiscounts;