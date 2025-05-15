import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import apiService from '../../utils/api';
import { clearAllData } from '../../utils/storage';

interface SettingsState {
  pushNotifications: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  location: boolean;
  language: string;
  currency: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsState>({
    pushNotifications: true,
    emailNotifications: true,
    darkMode: false,
    location: true,
    language: 'English',
    currency: 'FCFA',
  });
  const [appVersion, setAppVersion] = useState('1.0.0');
  
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Get app version
        const version = await Application.nativeApplicationVersion || '1.0.0';
        setAppVersion(version);
        
        // In a real app, get settings from API or AsyncStorage
        // const userSettings = await AsyncStorage.getItem('userSettings');
        // if (userSettings) {
        //   setSettings(JSON.parse(userSettings));
        // }
        
        // For demo, just simulate a delay
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading settings:', error);
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleToggleSetting = async (key: keyof SettingsState) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    // In a real app, save to API or AsyncStorage
    // await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Handle special cases
    if (key === 'pushNotifications') {
      await togglePushNotifications(!settings.pushNotifications);
    }
  };
  
  const togglePushNotifications = async (enabled: boolean) => {
    try {
      if (enabled) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Push notifications need appropriate permissions.',
            [{ text: 'OK' }]
          );
          setSettings(prev => ({ ...prev, pushNotifications: false }));
        }
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
    }
  };
  
  const handleChangeLanguage = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => updateSetting('language', 'English') },
        { text: 'Français', onPress: () => updateSetting('language', 'Français') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  const updateSetting = (key: keyof SettingsState, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // In a real app, save to API or AsyncStorage
    // await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, call API to delete account
            // apiService.deleteAccount()
            //   .then(() => {
            //     clearAllData();
            //     router.replace('/auth/login');
            //   });
            Alert.alert('Account Deletion', 'This feature will be implemented soon.');
          }
        }
      ]
    );
  };
  
  const renderSettingSwitch = (
    key: keyof SettingsState, 
    label: string, 
    icon: string,
    description?: string
  ) => (
    <View className="flex-row justify-between items-center py-4 border-b border-gray-100 dark:border-gray-700">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-4">
          <MaterialIcons name={icon as any} size={20} color="#2563eb" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 dark:text-gray-200">{label}</Text>
          {description && (
            <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={settings[key] as boolean}
        onValueChange={() => handleToggleSetting(key)}
        trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
        thumbColor={settings[key] ? '#ffffff' : '#f3f4f6'}
      />
    </View>
  );
  
  const renderSettingOption = (label: string, icon: string, value: string | undefined, onPress: () => void) => (
    <TouchableOpacity 
      className="flex-row justify-between items-center py-4 border-b border-gray-100 dark:border-gray-700"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-4">
          <MaterialIcons name={icon as any} size={20} color="#2563eb" />
        </View>
        <Text className="text-gray-800 dark:text-gray-200">{label}</Text>
      </View>
      <View className="flex-row items-center">
        {value && <Text className="text-gray-500 dark:text-gray-400 mr-2">{value}</Text>}
        <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</Text>
      </View>
    );
  }
  
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
          <Text className="text-white text-xl font-bold ml-4">Settings</Text>
        </View>
      </View>
      
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Notifications Section */}
        <View className="mb-6">
          <Text className="text-gray-600 dark:text-gray-400 text-xs uppercase font-medium tracking-wider mb-2">
            Notifications
          </Text>
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {renderSettingSwitch(
              'pushNotifications', 
              'Push Notifications', 
              'notifications', 
              'Receive alerts about bookings and offers'
            )}
            {renderSettingSwitch(
              'emailNotifications', 
              'Email Notifications', 
              'email',
              'Receive booking confirmations and updates'
            )}
          </View>
        </View>
        
        {/* Preferences Section */}
        <View className="mb-6">
          <Text className="text-gray-600 dark:text-gray-400 text-xs uppercase font-medium tracking-wider mb-2">
            Preferences
          </Text>
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {renderSettingSwitch('darkMode', 'Dark Mode', 'dark-mode')}
            {renderSettingSwitch('location', 'Location Services', 'location-on', 'Allow access to your location')}
            {renderSettingOption('Language', 'language', settings.language, handleChangeLanguage)}
          </View>
        </View>
        
        {/* Account Section */}
        <View className="mb-6">
          <Text className="text-gray-600 dark:text-gray-400 text-xs uppercase font-medium tracking-wider mb-2">
            Account
          </Text>
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {renderSettingOption('Change Password', 'lock', undefined, () => router.push('/auth/change-password'))}
            {renderSettingOption('Privacy Policy', 'privacy-tip', undefined, () => router.push('/legal/privacy'))}
            {renderSettingOption('Terms of Service', 'description', undefined, () => router.push('/legal/terms'))}
          </View>
        </View>
        
        {/* Help & Support */}
        <View className="mb-6">
          <Text className="text-gray-600 dark:text-gray-400 text-xs uppercase font-medium tracking-wider mb-2">
            Support
          </Text>
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {renderSettingOption('Help Center', 'help', undefined, () => router.push('/support/help'))}
            {renderSettingOption('Contact Us', 'phone', undefined, () => router.push('/support/contact'))}
            {renderSettingOption('Report a Problem', 'bug-report', undefined, () => router.push('/support/report'))}
          </View>
        </View>
        
        {/* App Info */}
        <View className="mb-6">
          <View className="items-center py-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">Version {appVersion}</Text>
          </View>
        </View>
        
        {/* Delete Account */}
        <TouchableOpacity
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-200 dark:border-red-900 mb-10"
          onPress={handleDeleteAccount}
        >
          <Text className="text-red-500 text-center">Delete My Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
