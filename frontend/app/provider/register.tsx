import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, updateUserData, setProviderOnboardingComplete } from '../../utils/storage';
import apiService from '../../utils/api';

// Service categories
const CATEGORIES = [
  { id: 'electrician', name: 'Electrician', icon: 'electrical-services' },
  { id: 'plumber', name: 'Plumber', icon: 'plumbing' },
  { id: 'beautician', name: 'Beautician', icon: 'spa' },
  { id: 'cleaner', name: 'House Cleaner', icon: 'cleaning-services' },
  { id: 'painter', name: 'Painter', icon: 'format-paint' },
  { id: 'carpenter', name: 'Carpenter', icon: 'construction' },
  { id: 'landscaper', name: 'Landscaper', icon: 'grass' },
  { id: 'smartHome', name: 'Smart Home', icon: 'home' },
  { id: 'mechanic', name: 'Mechanic', icon: 'settings' },
  { id: 'security', name: 'Security', icon: 'security' },
  { id: 'mover', name: 'Mover', icon: 'local-shipping' },
  { id: 'solar', name: 'Solar Expert', icon: 'wb-sunny' },
];

export default function ProviderRegistration() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');
  
  // Get user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user profile');
        router.back();
      }
    };
    
    loadUserData();
  }, []);
  
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!businessName) {
      Alert.alert('Error', 'Please enter your business name');
      return;
    }
    
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one service category');
      return;
    }
    
    if (!hourlyRate) {
      Alert.alert('Error', 'Please enter your hourly rate');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Build provider data
      const providerData = {
        businessName,
        experience: experience || '0',
        bio,
        services: selectedCategories,
        hourlyRate: parseFloat(hourlyRate),
      };
      
      // Call API to convert user to provider
      const response = await apiService.becomeProvider(providerData);
      
      // Update local user data with provider role
      if (response && response.data && response.data.user) {
        await updateUserData({ 
          role: 'provider',
          providerProfile: providerData
        });
        
        // Mark provider onboarding as complete
        await setProviderOnboardingComplete(true);
        
        // Show success and navigate to provider mode
        Alert.alert(
          'Success',
          'You are now registered as a service provider!',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/provider/welcome')
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error becoming provider:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.error || 'Failed to register as provider. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="bg-primary-500 pt-12 pb-6 px-5">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white/20 p-2 rounded-full w-10 h-10 items-center justify-center mb-4"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Become a Provider</Text>
          <Text className="text-white/80 mt-2">
            Help clients with your skills and earn money
          </Text>
        </View>
        
        <View className="p-5">
          {/* Business Information Section */}
          <View className="mb-6">
            <Text className="text-gray-900 font-semibold text-lg mb-4">Business Information</Text>
            
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Business/Service Name</Text>
              <TextInput
                value={businessName}
                onChangeText={setBusinessName}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Enter your business name"
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Years of Experience</Text>
              <TextInput
                value={experience}
                onChangeText={setExperience}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="e.g., 5"
                keyboardType="numeric"
              />
            </View>
            
            <View>
              <Text className="text-gray-700 mb-2 font-medium">About Your Services</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Describe your services and expertise"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          {/* Service Categories Section */}
          <View className="mb-6">
            <Text className="text-gray-900 font-semibold text-lg mb-4">Select Your Service Categories</Text>
            <Text className="text-gray-500 mb-4">Choose the categories that match your skills and services</Text>
            
            <View className="flex-row flex-wrap">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => toggleCategory(category.id)}
                  className={`mr-2 mb-3 px-4 py-2 rounded-full flex-row items-center ${
                    selectedCategories.includes(category.id)
                      ? 'bg-primary-100 border-primary-500 border'
                      : 'bg-gray-100 border-gray-200 border'
                  }`}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={18}
                    color={selectedCategories.includes(category.id) ? '#2563eb' : '#6B7280'}
                    className="mr-2"
                  />
                  <Text
                    className={`${
                      selectedCategories.includes(category.id)
                        ? 'text-primary-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Pricing Section */}
          <View className="mb-8">
            <Text className="text-gray-900 font-semibold text-lg mb-4">Service Pricing</Text>
            
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Your Hourly Rate (CFA)</Text>
              <TextInput
                value={hourlyRate}
                onChangeText={setHourlyRate}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="e.g., 5000"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`bg-primary-500 py-4 rounded-lg mb-8 ${isSubmitting ? 'opacity-70' : ''}`}
          >
            <Text className="text-white font-bold text-center text-lg">
              {isSubmitting ? 'Submitting...' : 'Register as Provider'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
