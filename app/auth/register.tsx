import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { MaterialIcons } from '@expo/vector-icons';

import type { UserRole } from '@/lib/api/authApi';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('user' as UserRole);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { register, isLoggedIn, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn]);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    await register(name, email, password, role, phone);
    
    if (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-10 pb-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-primary-600 mt-2">Create Account</Text>
            <Text className="text-gray-500 text-center mt-2">
              Sign up to get started
            </Text>
          </View>

          {/* Role Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-3 text-center">I am a:</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity 
                onPress={() => setRole('user' as UserRole)}
                className={`flex-1 py-3 rounded-lg mr-2 border ${
                  role === 'user' 
                    ? 'bg-primary-600 border-primary-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <View className="items-center">
                  <MaterialIcons 
                    name="person" 
                    size={24} 
                    color={role === 'user' ? 'white' : '#6B7280'} 
                  />
                  <Text 
                    className={`font-medium mt-1 ${
                      role === 'user' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    User
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setRole('provider' as UserRole)}
                className={`flex-1 py-3 rounded-lg ml-2 border ${
                  role === 'provider' 
                    ? 'bg-primary-600 border-primary-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <View className="items-center">
                  <MaterialIcons 
                    name="handyman" 
                    size={24} 
                    color={role === 'provider' ? 'white' : '#6B7280'} 
                  />
                  <Text 
                    className={`font-medium mt-1 ${
                      role === 'provider' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    Service Provider
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <MaterialIcons name="person" size={20} color="#6B7280" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  className="flex-1 text-gray-800 ml-2"
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <MaterialIcons name="email" size={20} color="#6B7280" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 text-gray-800 ml-2"
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Phone Number (Optional)</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <MaterialIcons name="phone" size={20} color="#6B7280" />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  className="flex-1 text-gray-800 ml-2"
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <MaterialIcons name="lock" size={20} color="#6B7280" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-gray-800 ml-2"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <MaterialIcons name="lock" size={20} color="#6B7280" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-gray-800 ml-2"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className={`bg-primary-600 py-4 rounded-xl flex-row justify-center items-center mt-4 ${
                isLoading ? 'opacity-70' : ''
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold text-center text-lg">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text className="text-primary-600 font-bold ml-1">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
