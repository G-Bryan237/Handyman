import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Animated, Image, ActivityIndicator } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import apiService from '../../utils/api';
import { removeToken, getUserData, clearAllData, getActiveRole, setActiveRole, saveUserData } from '../../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

const PROFILE_SECTIONS = [
  { id: '1', name: 'My Bookings', icon: 'event-note', route: '/profile/bookings' },
  { id: '2', name: 'Payment Methods', icon: 'payment', route: '/profile/payments' },
  { id: '3', name: 'Settings', icon: 'settings', route: '/profile/settings' }
];

// Additional sections for service providers
const PROVIDER_SECTIONS = [
  { id: '4', name: 'My Services', icon: 'home-repair-service', route: '/profile/services' },
  { id: '5', name: 'Service Requests', icon: 'assignment', route: '/profile/requests' },
  { id: '6', name: 'Earnings', icon: 'account-balance-wallet', route: '/profile/earnings' }
];

export default function YouScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState<string>('user');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  
  const isProvider = userData?.role === 'provider';

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setUseDefaultImage(false); // Reset this state when refreshing
      
      // First try to get data from storage for quick display
      const storedUser = await getUserData();
      if (storedUser) {
        console.log('[YouScreen] Profile data from storage:', {
          name: storedUser.name,
          email: storedUser.email,
          profilePhotoUrl: storedUser.profilePhotoUrl || 'No URL found'
        });
        
        if (storedUser.profilePhotoUrl) {
          console.log('[YouScreen] Found profile image URL in storage:', storedUser.profilePhotoUrl);
        }
        
        setUserData(storedUser);
      } else {
        console.log('[YouScreen] No user data found in storage');
      }
      
      // Get the active role
      const currentRole = await getActiveRole();
      setActiveRoleState(currentRole);
      
      // Then fetch fresh data from API
      console.log('[YouScreen] Fetching fresh user data from API');
      const response = await apiService.getUserProfile();
      
      if (response.data && response.data.user) {
        const apiUser = response.data.user;
        
        // Log full user object to debug
        console.log('[YouScreen] Full user object from API:', JSON.stringify(apiUser, null, 2));
        
        // Check if the API response has a profile photo URL
        if (!apiUser.profilePhotoUrl && storedUser?.profilePhotoUrl) {
          console.log('[YouScreen] API response missing profile photo URL. Using stored URL:', storedUser.profilePhotoUrl);
          apiUser.profilePhotoUrl = storedUser.profilePhotoUrl;
        }
        
        console.log('[YouScreen] Final user data after merging:', {
          name: apiUser.name,
          email: apiUser.email,
          profilePhotoUrl: apiUser.profilePhotoUrl || 'No URL after merge'
        });
        
        // Make sure to update storage with the latest data from API
        await saveUserData(apiUser);
        setUserData(apiUser);
      }

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    } catch (error) {
      console.error('[YouScreen] Error fetching user profile:', error);
      // Error handling...
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Refresh data when screen comes into focus (e.g., when navigating back from settings)
  useFocusEffect(
    React.useCallback(() => {
      console.log('[YouScreen] Screen is focused, refreshing user data');
      fetchUserData();
      return () => {
        // Cleanup if needed when screen loses focus
      };
    }, [])
  );

  // Display appropriate sections based on user role
  const displaySections = isProvider 
    ? [...PROFILE_SECTIONS, ...PROVIDER_SECTIONS] 
    : PROFILE_SECTIONS;

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              // Clear token and user data from storage
              await clearAllData();
              // Redirect to login
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/profile/personal');
  };

  const handleBecomeProvider = () => {
    router.push('/provider/register');
  };

  const handleSwitchRole = async () => {
    try {
      const newRole = activeRole === 'provider' ? 'user' : 'provider';
      
      // Save the new role to storage before navigating
      await setActiveRole(newRole);
      setActiveRoleState(newRole);
      
      // Show welcome screen based on the new role
      if (newRole === 'provider') {
        router.push('/provider/welcome');
      } else {
        router.push('/client/welcome');
      }
    } catch (error) {
      console.error('Error switching role:', error);
      Alert.alert('Error', 'Failed to switch user role. Please try again.');
    }
  };

  // Add this console.log to check what's happening with the URL
  useEffect(() => {
    if (userData?.profilePhotoUrl) {
      console.log('[YouScreen] Profile photo URL:', userData.profilePhotoUrl);
    } else {
      console.log('[YouScreen] No profile photo URL found in userData');
    }
  }, [userData]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">Loading...</Text>
      </View>
    );
  }

  // Update image component with additional error handling
  const renderProfileImage = () => {
    if (userData?.profilePhotoUrl && !useDefaultImage) {
      console.log('[YouScreen] Rendering image with URL:', userData.profilePhotoUrl);
      return (
        <View className="w-20 h-20 rounded-full mr-4 overflow-hidden shadow-sm">
          <Image 
            source={{ uri: userData.profilePhotoUrl }} 
            className="w-full h-full"
            onLoadStart={() => {
              console.log('[YouScreen] Starting to load image from URL:', userData.profilePhotoUrl);
              setProfileImageLoading(true);
            }}
            onLoadEnd={() => {
              console.log('[YouScreen] Image load completed or failed');
              setProfileImageLoading(false);
            }}
            onError={(e) => {
              console.log('[YouScreen] Error loading image:', e.nativeEvent.error);
              setUseDefaultImage(true);
              setProfileImageLoading(false);
            }}
          />
          {profileImageLoading && (
            <View className="absolute inset-0 bg-gray-200 items-center justify-center">
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View className="w-20 h-20 bg-primary-400 rounded-full items-center justify-center mr-4 shadow-sm">
          <Text className="text-3xl">👤</Text>
        </View>
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-500 pt-16 pb-8 px-5 rounded-b-3xl shadow-md">
          <Text className="text-white text-2xl font-bold mb-2">My Profile</Text>
          {isProvider && (
            <View className="bg-white/25 px-3 py-1 rounded-full mt-1 self-start">
              <Text className="text-white font-medium">
                {activeRole === 'provider' ? 'Provider Mode' : 'Client Mode'}
              </Text>
            </View>
          )}
        </View>
        
        <Animated.View 
          className="px-4 pt-6" 
          style={{ opacity: fadeAnim }}
        >
          {/* User Profile Card with Edit Button */}
          <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Personal Info</Text>
              <TouchableOpacity
                onPress={handleEditProfile}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
              >
                <Feather name="edit-2" size={16} color="#2563eb" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center mt-2">
              {renderProfileImage()}
              <View className="flex-1">
                <Text className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                  {userData?.name || "User"}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {userData?.email || "user@example.com"}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {userData?.phone || "No phone number"}
                </Text>
              </View>
            </View>
          </View>

          {/* Provider Switch Section for users who are already providers */}
          {isProvider && (
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
              <TouchableOpacity
                className="p-4 flex-row items-center justify-between"
                onPress={handleSwitchRole}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-4">
                    <MaterialIcons 
                      name={activeRole === 'provider' ? 'person' : 'home-repair-service'} 
                      size={24} 
                      color="#2563eb" 
                    />
                  </View>
                  <View>
                    <Text className="text-gray-800 dark:text-gray-200 text-base">
                      {activeRole === 'provider' ? 'Switch to Client' : 'Switch to Provider'}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs">
                      {activeRole === 'provider' 
                        ? 'Use app as a regular client' 
                        : 'Manage your service provider account'}
                    </Text>
                  </View>
                </View>
                <MaterialIcons name="swap-horiz" size={24} color="#2563eb" />
              </TouchableOpacity>
            </View>
          )}

          {/* Become Provider Section - More compact and professional design */}
          {!isProvider && (
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
              <View className="p-4 flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-4">
                  <MaterialIcons name="star" size={22} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 dark:text-gray-200 text-base font-semibold">Become a Service Provider</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    Offer your skills and earn money on our platform
                  </Text>
                </View>
                <TouchableOpacity
                  className="bg-blue-500 px-3 py-1.5 rounded-lg"
                  onPress={handleBecomeProvider}
                >
                  <Text className="text-white text-sm font-medium">Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Profile Sections - Enhanced with subtle improvements */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
            <Text className="text-gray-600 dark:text-gray-400 text-xs uppercase font-medium tracking-wider px-4 pt-3 pb-1">
              Account Management
            </Text>
            {displaySections.map((section, index) => (
              <React.Fragment key={section.id}>
                <TouchableOpacity 
                  className="p-4 flex-row items-center"
                  onPress={() => router.push(section.route as any)}
                >
                  <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-4">
                    <MaterialIcons name={section.icon as any} size={22} color="#2563eb" />
                  </View>
                  <Text className="text-gray-800 dark:text-gray-200 text-base flex-1">{section.name}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
                {index < displaySections.length - 1 && (
                  <View className="h-[0.5px] bg-gray-200 dark:bg-gray-700 ml-16" />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Logout Button - More subtle and professional */}
          <TouchableOpacity 
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mt-2 mb-10 flex-row justify-center items-center border border-gray-200 dark:border-gray-700"
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={18} color="#ef4444" />
            <Text className="text-red-500 text-center font-medium ml-2">Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}