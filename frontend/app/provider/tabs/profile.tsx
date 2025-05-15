import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, clearUserData, setActiveRole } from '../../../utils/storage';
// You need to install expo-image-picker:
// npx expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';

// Define TypeScript interfaces
interface BankInfo {
  accountName: string;
  accountNumber: string;
  accountType: string;
}

interface NotificationSettings {
  newJobs: boolean;
  messages: boolean;
  paymentUpdates: boolean;
  promotions: boolean;
  [key: string]: boolean; // Index signature for dynamic access
}

interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  businessName: string;
  experience: string;
  services: string[];
  hourlyRate: number;
  bio: string;
  address: string;
  notifications: NotificationSettings;
  verificationStatus: 'pending' | 'verified' | 'unverified';
  bankInfo: BankInfo;
}

interface ServiceCategory {
  name: string;
  icon: string;
}

interface ServiceCategories {
  [key: string]: ServiceCategory; // Index signature for service categories
}

// Mock provider profile data
const DEFAULT_PROFILE: ProviderProfile = {
  id: 'provider_123',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1234567890',
  photo: null,
  businessName: 'John\'s Electrical',
  experience: '5',
  services: ['electrician', 'smartHome'],
  hourlyRate: 15000,
  bio: 'Professional electrician with 5+ years experience in residential and commercial electrical work.',
  address: '123 Main Street, Springfield',
  notifications: {
    newJobs: true,
    messages: true,
    paymentUpdates: true,
    promotions: false
  },
  verificationStatus: 'verified', // 'pending', 'verified', 'unverified'
  bankInfo: {
    accountName: 'John Smith',
    accountNumber: '****1234',
    accountType: 'Savings'
  }
};

// Service categories
const SERVICE_CATEGORIES: ServiceCategories = {
  'electrician': { name: 'Electrician', icon: 'electrical-services' },
  'plumber': { name: 'Plumber', icon: 'plumbing' },
  'beautician': { name: 'Beautician', icon: 'spa' },
  'cleaner': { name: 'House Cleaner', icon: 'cleaning-services' },
  'painter': { name: 'Painter', icon: 'format-paint' },
  'carpenter': { name: 'Carpenter', icon: 'construction' },
  'landscaper': { name: 'Landscaper', icon: 'grass' },
  'smartHome': { name: 'Smart Home', icon: 'home' }
};

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProviderProfile>(DEFAULT_PROFILE);
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUserData();
        if (userData?.providerProfile) {
          // Merge the userData with providerProfile data
          setProfile({
            ...DEFAULT_PROFILE,
            ...userData,
            ...userData.providerProfile,
            name: userData.name || DEFAULT_PROFILE.name,
            email: userData.email || DEFAULT_PROFILE.email,
            phone: userData.phone || DEFAULT_PROFILE.phone,
            photo: userData.photo || DEFAULT_PROFILE.photo
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);
  
  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Edit Profile', 'This functionality would navigate to the edit profile screen.');
  };
  
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
      });
      
      if (!result.canceled) {
        setProfile({ ...profile, photo: result.assets[0].uri });
        // Here you would typically upload the image to your server
        Alert.alert('Success', 'Profile photo updated successfully');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile photo');
    }
  };
  
  const handleToggleNotification = (key: keyof NotificationSettings) => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key]
      }
    });
    // Here you would typically save the notification settings to your server
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            setLoading(true);
            try {
              await clearUserData();
              router.replace('/login');
            } catch (error) {
              console.error('Error during logout:', error);
              setLoading(false);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  // Add switch to client mode handler
  const handleSwitchToClient = async () => {
    Alert.alert(
      "Switch to Client Mode",
      "Do you want to switch to client mode?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Switch",
          onPress: async () => {
            try {
              await setActiveRole('user');
              router.replace('/client/welcome');
            } catch (error) {
              console.error('Error switching to client mode:', error);
              Alert.alert('Error', 'Failed to switch to client mode. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary-500 pt-12 pb-4 px-5">
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden">
          <View className="p-4 items-center">
            {/* Profile Image */}
            <TouchableOpacity 
              className="relative"
              onPress={handlePickImage}
            >
              {profile.photo ? (
                <Image 
                  source={{ uri: profile.photo }} 
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                  <Text className="text-gray-400 text-4xl font-semibold">
                    {profile.name.charAt(0)}
                  </Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2">
                <Feather name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            
            {/* Verification Badge */}
            {profile.verificationStatus === 'verified' && (
              <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full mt-2">
                <MaterialIcons name="verified" size={16} color="#22C55E" />
                <Text className="text-green-700 text-xs ml-1">Verified Provider</Text>
              </View>
            )}
            
            {/* Basic Info */}
            <Text className="text-gray-900 font-bold text-xl mt-2">{profile.name}</Text>
            <Text className="text-gray-600">{profile.businessName}</Text>
            
            {/* Experience Line */}
            <View className="flex-row items-center mt-2">
              <Feather name="award" size={14} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{profile.experience} years experience</Text>
            </View>
            
            {/* Edit Profile Button */}
            <TouchableOpacity 
              className="bg-gray-100 px-4 py-2 rounded-lg mt-4"
              onPress={handleEditProfile}
            >
              <Text className="text-gray-700 font-medium">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Services Section */}
        <View className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden">
          <View className="p-4">
            <Text className="text-gray-900 font-semibold text-lg mb-3">My Services</Text>
            <View className="flex-row flex-wrap">
              {profile.services.map((serviceId) => (
                <View 
                  key={serviceId}
                  className="bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg mr-2 mb-2 flex-row items-center"
                >
                  <MaterialIcons 
                    name={(SERVICE_CATEGORIES[serviceId]?.icon as any) || 'help'} 
                    size={16} 
                    color="#2563eb" 
                  />
                  <Text className="text-primary-700 ml-1">
                    {SERVICE_CATEGORIES[serviceId]?.name || serviceId}
                  </Text>
                </View>
              ))}
              
              <TouchableOpacity className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex-row items-center">
                <MaterialIcons name="add" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-1">Add More</Text>
              </TouchableOpacity>
            </View>
            
            {/* Rate */}
            <View className="mt-4">
              <Text className="text-gray-900 font-semibold">Hourly Rate</Text>
              <View className="flex-row items-center mt-1">
                <FontAwesome5 name="money-bill-wave" size={14} color="#6B7280" />
                <Text className="text-gray-700 ml-2">{profile.hourlyRate} CFA</Text>
                <TouchableOpacity className="ml-auto">
                  <Text className="text-primary-500">Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        {/* Switch to Client Mode Button - New section */}
        <TouchableOpacity
          className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden"
          onPress={handleSwitchToClient}
        >
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={20} color="#2563eb" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">Switch to Client Mode</Text>
                <Text className="text-gray-500 text-xs mt-1">Use the app as a regular client</Text>
              </View>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9ca3af" />
          </View>
        </TouchableOpacity>
        
        {/* Account Section */}
        <View className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden">
          <View className="p-4">
            <Text className="text-gray-900 font-semibold text-lg mb-3">Account</Text>
            
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
              <Ionicons name="mail-outline" size={20} color="#6B7280" className="mr-3" />
              <View className="flex-1">
                <Text className="text-gray-700">Email</Text>
                <Text className="text-gray-500 text-sm">{profile.email}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
              <Ionicons name="call-outline" size={20} color="#6B7280" className="mr-3" />
              <View className="flex-1">
                <Text className="text-gray-700">Phone</Text>
                <Text className="text-gray-500 text-sm">{profile.phone}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
              <Ionicons name="location-outline" size={20} color="#6B7280" className="mr-3" />
              <View className="flex-1">
                <Text className="text-gray-700">Address</Text>
                <Text className="text-gray-500 text-sm">{profile.address}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
              <MaterialCommunityIcons name="bank-outline" size={20} color="#6B7280" className="mr-3" />
              <View className="flex-1">
                <Text className="text-gray-700">Bank Account</Text>
                <Text className="text-gray-500 text-sm">{profile.bankInfo.accountType} ••••{profile.bankInfo.accountNumber.slice(-4)}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center py-3">
              <MaterialIcons name="vpn-key" size={20} color="#6B7280" className="mr-3" />
              <View className="flex-1">
                <Text className="text-gray-700">Change Password</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Notifications Section */}
        <View className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden">
          <View className="p-4">
            <Text className="text-gray-900 font-semibold text-lg mb-3">Notifications</Text>
            
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View>
                <Text className="text-gray-700">New Job Alerts</Text>
                <Text className="text-gray-500 text-xs">Receive notifications for new job opportunities</Text>
              </View>
              <Switch
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={profile.notifications.newJobs ? '#2563eb' : '#f4f4f5'}
                ios_backgroundColor="#d1d5db"
                onValueChange={() => handleToggleNotification('newJobs')}
                value={profile.notifications.newJobs}
              />
            </View>
            
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View>
                <Text className="text-gray-700">Messages</Text>
                <Text className="text-gray-500 text-xs">Get notified when you receive messages</Text>
              </View>
              <Switch
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={profile.notifications.messages ? '#2563eb' : '#f4f4f5'}
                ios_backgroundColor="#d1d5db"
                onValueChange={() => handleToggleNotification('messages')}
                value={profile.notifications.messages}
              />
            </View>
            
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View>
                <Text className="text-gray-700">Payment Updates</Text>
                <Text className="text-gray-500 text-xs">Receive notifications about payments</Text>
              </View>
              <Switch
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={profile.notifications.paymentUpdates ? '#2563eb' : '#f4f4f5'}
                ios_backgroundColor="#d1d5db"
                onValueChange={() => handleToggleNotification('paymentUpdates')}
                value={profile.notifications.paymentUpdates}
              />
            </View>
            
            <View className="flex-row justify-between items-center py-3">
              <View>
                <Text className="text-gray-700">Promotions</Text>
                <Text className="text-gray-500 text-xs">Receive promotional offers and updates</Text>
              </View>
              <Switch
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={profile.notifications.promotions ? '#2563eb' : '#f4f4f5'}
                ios_backgroundColor="#d1d5db"
                onValueChange={() => handleToggleNotification('promotions')}
                value={profile.notifications.promotions}
              />
            </View>
          </View>
        </View>
        
        {/* Settings Section */}
        <View className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden">
          <View className="p-4">
            <Text className="text-gray-900 font-semibold text-lg mb-3">Settings</Text>
            
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-gray-700">Dark Mode</Text>
              <Switch
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={darkMode ? '#2563eb' : '#f4f4f5'}
                ios_backgroundColor="#d1d5db"
                onValueChange={() => setDarkMode(!darkMode)}
                value={darkMode}
              />
            </View>
            
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-700">Language</Text>
              </View>
              <Text className="text-gray-500 mr-2">English</Text>
              <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center py-3">
              <View className="flex-1">
                <Text className="text-gray-700">Privacy Policy</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Contact Support & Logout Buttons */}
        <View className="mx-4 my-6">
          <TouchableOpacity className="bg-white border border-gray-200 rounded-lg py-3.5 items-center mb-4">
            <Text className="text-gray-700 font-medium">Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-red-50 border border-red-200 rounded-lg py-3.5 items-center"
            onPress={handleLogout}
          >
            <Text className="text-red-600 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
