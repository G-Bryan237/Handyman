import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import apiService from '../../utils/api';
import { getUserData, saveUserData } from '../../utils/storage';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserData();
        if (userData) {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
          });
        }
        
        // Fetch fresh data from API
        const response = await apiService.getUserProfile();
        if (response.data && response.data.user) {
          const user = response.data.user;
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load your profile information');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleUpdateProfile = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    
    setIsSaving(true);
    try {
      // Send updated profile to API
      const response = await apiService.updateUserProfile(formData);
      if (response.data && response.data.user) {
        // Update local storage
        await saveUserData(response.data.user);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture');
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        // Would typically upload image to server here
        Alert.alert('Success', 'Profile picture selected. Image upload will be implemented in a future update.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600 dark:text-gray-400">Loading your information...</Text>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-500 pt-12 pb-4 px-4">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold ml-4">Edit Profile</Text>
          </View>
        </View>
        
        <View className="p-4">
          {/* Profile Picture */}
          <View className="items-center mb-6 mt-2">
            <TouchableOpacity 
              className="relative"
              onPress={handlePickImage}
            >
              <View className="w-24 h-24 rounded-full bg-primary-400 items-center justify-center">
                <Text className="text-4xl">👤</Text>
              </View>
              <View className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full items-center justify-center border-2 border-white dark:border-gray-900">
                <Feather name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Tap to change profile picture</Text>
          </View>
          
          {/* Form Fields */}
          <View className="mb-6 space-y-4">
            <View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1 ml-1">Full Name*</Text>
              <TextInput
                className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                placeholder="Your full name"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={text => setFormData({...formData, name: text})}
              />
            </View>
            
            <View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1 ml-1">Email Address*</Text>
              <TextInput
                className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                placeholder="Your email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={text => setFormData({...formData, email: text})}
              />
            </View>
            
            <View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1 ml-1">Phone Number</Text>
              <TextInput
                className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                placeholder="Your phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={text => setFormData({...formData, phone: text})}
              />
            </View>
            
            <View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1 ml-1">Address</Text>
              <TextInput
                className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                placeholder="Your address"
                placeholderTextColor="#9ca3af"
                value={formData.address}
                onChangeText={text => setFormData({...formData, address: text})}
              />
            </View>
            
            <View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1 ml-1">City</Text>
              <TextInput
                className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                placeholder="Your city"
                placeholderTextColor="#9ca3af"
                value={formData.city}
                onChangeText={text => setFormData({...formData, city: text})}
              />
            </View>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            className={`p-4 rounded-xl ${isSaving ? 'bg-blue-400' : 'bg-blue-500'} shadow-sm mb-6`}
            onPress={handleUpdateProfile}
            disabled={isSaving}
          >
            <Text className="text-white text-center font-semibold">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
