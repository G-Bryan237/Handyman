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
import { MaterialIcons } from '@expo/vector-icons';
import apiService from '../../utils/api';
import { saveToken, saveUserData } from '../../utils/storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    // Clear previous errors
    setError(null);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call login API directly
      const response = await apiService.login({ email, password });
      
      // Extract token and user data
      const { token, user } = response.data;
      
      // Save auth data to storage
      await saveToken(token);
      await saveUserData(user);
      
      // Update login state
      setIsLoggedIn(true);
      
    } catch (err: any) {
      // Handle login error
      const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Header */}
          <View className="items-center mb-10">
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-primary-600 mt-4">Welcome Back</Text>
            <Text className="text-gray-500 text-center mt-2">
              Sign in to access your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
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
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <MaterialIcons name="lock" size={20} color="#6B7280" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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

            <TouchableOpacity>
              <Text className="text-primary-600 text-right font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-primary-600 py-4 rounded-xl flex-row justify-center items-center mt-2 ${
                isLoading ? 'opacity-70' : ''
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold text-center text-lg">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center mt-10">
            <Text className="text-gray-600">Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text className="text-primary-600 font-bold ml-1">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
