import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import apiService from '../../utils/api';

// Types for payment methods
interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'card' | 'bank';
  name: string;
  provider: string;
  isDefault: boolean;
  lastUsed?: string;
  logo?: string;
  maskedNumber?: string;
}

export default function PaymentsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for payment methods in Cameroon - Updated with better MTN image URL
  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'mobile_money',
      name: 'MTN Mobile Money',
      provider: 'MTN',
      isDefault: true,
      maskedNumber: '****1234',
      logo: 'https://1000logos.net/wp-content/uploads/2023/08/MTN-Logo.png'
    },
    {
      id: '2',
      type: 'mobile_money',
      name: 'Orange Money',
      provider: 'Orange',
      isDefault: false,
      maskedNumber: '****5678',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/800px-Orange_logo.svg.png'
    },
    {
      id: '3',
      type: 'card',
      name: 'Visa Card',
      provider: 'BICEC Bank',
      isDefault: false,
      maskedNumber: '****9012',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png'
    },
    {
      id: '4',
      type: 'bank',
      name: 'UBA Account',
      provider: 'UBA Bank',
      isDefault: false,
      maskedNumber: '****7890',
      logo: 'https://www.ubagroup.com/wp-content/uploads/2018/08/uba-logo.png'
    }
  ];
  
  useEffect(() => {
    // Simulate API call to fetch payment methods
    const loadPaymentMethods = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await apiService.getPaymentMethods();
        // setPaymentMethods(response.data.paymentMethods);
        
        // Using mock data for now
        setTimeout(() => {
          setPaymentMethods(mockPaymentMethods);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setIsLoading(false);
      }
    };
    
    loadPaymentMethods();
  }, []);
  
  const handleAddPaymentMethod = () => {
    // Navigate to add payment method screen
    router.push('/profile/add-payment');
  };
  
  const handleSetAsDefault = (id: string) => {
    // Update default payment method
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setPaymentMethods(updatedMethods);
    
    // In a real app, send to API
    // apiService.setDefaultPaymentMethod(id);
    
    Alert.alert('Success', 'Default payment method updated');
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // Remove payment method
            const updatedMethods = paymentMethods.filter(method => method.id !== id);
            setPaymentMethods(updatedMethods);
            
            // In a real app, send to API
            // apiService.deletePaymentMethod(id);
          }
        }
      ]
    );
  };
  
  const renderPaymentMethodItem = (method: PaymentMethod) => {
    const getIconName = () => {
      switch (method.type) {
        case 'mobile_money': return 'phone';
        case 'card': return 'credit-card';
        case 'bank': return 'bank';
        default: return 'money';
      }
    };
    
    return (
      <View key={method.id} className="bg-white dark:bg-gray-800 rounded-2xl mb-4 shadow-sm overflow-hidden">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              {method.logo ? (
                <Image 
                  source={{ uri: method.logo }} 
                  className="w-10 h-10 rounded-lg mr-3" 
                  resizeMode="contain"
                />
              ) : (
                <View className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
                  <FontAwesome name={getIconName()} size={20} color="#4b5563" />
                </View>
              )}
              <View>
                <Text className="text-gray-800 dark:text-gray-200 font-semibold">{method.name}</Text>
                {method.maskedNumber && (
                  <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{method.maskedNumber}</Text>
                )}
              </View>
            </View>
            {method.isDefault && (
              <View className="bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">
                <Text className="text-green-700 dark:text-green-300 text-xs">Default</Text>
              </View>
            )}
          </View>
          
          <View className="flex-row justify-end border-t border-gray-100 dark:border-gray-700 pt-3">
            {!method.isDefault && (
              <TouchableOpacity 
                className="px-3 py-1 mr-3"
                onPress={() => handleSetAsDefault(method.id)}
              >
                <Text className="text-blue-500 text-sm">Set as Default</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              className="px-3 py-1"
              onPress={() => handleDeletePaymentMethod(method.id)}
            >
              <Text className="text-red-500 text-sm">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
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
          <Text className="text-white text-xl font-bold ml-4">Payment Methods</Text>
        </View>
      </View>
      
      <ScrollView className="flex-1 pt-4 px-4">
        {/* Info Banner */}
        <View className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl mb-4 flex-row items-center">
          <MaterialIcons name="info" size={20} color="#3b82f6" />
          <Text className="text-blue-700 dark:text-blue-300 ml-2 text-sm flex-1">
            Add your preferred payment methods for seamless transactions
          </Text>
        </View>
        
        {isLoading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="mt-2 text-gray-600 dark:text-gray-400">Loading payment methods...</Text>
          </View>
        ) : (
          <>
            {/* Payment Methods List */}
            {paymentMethods.length > 0 ? (
              <View>
                {paymentMethods.map(method => renderPaymentMethodItem(method))}
              </View>
            ) : (
              <View className="py-8 items-center">
                <MaterialIcons name="credit-card" size={48} color="#9ca3af" />
                <Text className="mt-3 text-gray-600 dark:text-gray-400 text-center">
                  You don't have any payment methods yet
                </Text>
              </View>
            )}
            
            {/* Add Payment Method Button */}
            <TouchableOpacity 
              className="mt-3 mb-6 bg-primary-500 p-4 rounded-xl flex-row items-center justify-center"
              onPress={handleAddPaymentMethod}
            >
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="ml-2 text-white font-semibold">Add Payment Method</Text>
            </TouchableOpacity>
            
            {/* Available Payment Options - Updated with better MTN image and added UBA */}
            <View className="mb-6">
              <Text className="text-gray-800 dark:text-gray-200 text-lg font-semibold mb-3">Available Payment Options</Text>
              
              <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <View className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: 'https://1000logos.net/wp-content/uploads/2023/08/MTN-Logo.png' }} 
                      className="w-10 h-8 mr-3" 
                      resizeMode="contain"
                    />
                    <Text className="text-gray-800 dark:text-gray-200">MTN Mobile Money</Text>
                  </View>
                </View>
                
                <View className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/800px-Orange_logo.svg.png' }} 
                      className="w-8 h-8 mr-3" 
                      resizeMode="contain"
                    />
                    <Text className="text-gray-800 dark:text-gray-200">Orange Money</Text>
                  </View>
                </View>
                
                <View className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: 'https://www.ubagroup.com/wp-content/uploads/2018/08/uba-logo.png' }} 
                      className="w-10 h-8 mr-3" 
                      resizeMode="contain"
                    />
                    <Text className="text-gray-800 dark:text-gray-200">UBA Bank</Text>
                  </View>
                </View>
                
                <View className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png' }} 
                      className="w-8 h-8 mr-3" 
                      resizeMode="contain"
                    />
                    <Text className="text-gray-800 dark:text-gray-200">Visa Card</Text>
                  </View>
                </View>
                
                <View className="p-4">
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png' }} 
                      className="w-8 h-8 mr-3" 
                      resizeMode="contain"
                    />
                    <Text className="text-gray-800 dark:text-gray-200">Mastercard</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
