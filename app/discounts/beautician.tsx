  // app/discounts/beautician.tsx (apply the same to laundry.tsx and cleaning.tsx)
  import React from 'react';
  import { View, Text, FlatList, TouchableOpacity } from 'react-native';
  import { useRouter } from 'expo-router';
  import { FontAwesome5 } from '@expo/vector-icons';

  const BeauticianDiscounts = () => {
    const router = useRouter();
    const discounts = [
      { id: '1', provider: 'Beauty Salon A', discount: '20% off', service: 'Hair Treatment' },
      { id: '2', provider: 'Spa Center B', discount: '15% off', service: 'Facial' },
      // Add more beautician-specific discounts
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
          <Text className="text-lg font-bold ml-4">Beautician Discounts</Text>
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

  export default BeauticianDiscounts;