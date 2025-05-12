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
import apiService from '@/utils/api';
import { setToken } from '@/utils/storage';

// Define UserRole type
type UserRole = 'user' | 'provider';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const router = useRouter();

  // Add debug logging for initial component state
  console.log('[DEBUG] RegisterScreen - Initial render with state:', { 
    name, email, phone, address, role, 
    passwordLength: password ? password.length : 0,
    confirmPasswordMatch: password === confirmPassword
  });

  useEffect(() => {
    console.log('[RegisterScreen] Component mounted');
    if (isLoggedIn) {
      console.log('[RegisterScreen] User logged in, redirecting to tabs');
      router.replace('/(tabs)');
    }
    return () => {
      console.log('[RegisterScreen] Component unmounted');
    };
  }, [isLoggedIn]);

  const handleRegister = async () => {
    // Clear previous errors
    setError(null);
    console.log('=== REGISTRATION PROCESS STARTED ===');
    console.log('[DEBUG] Registration attempt with values:', {
      name,
      email,
      phone,
      address,
      role,
      passwordLength: password ? password.length : 0,
      confirmPasswordMatch: password === confirmPassword
    });
    
    // Validation logging
    if (!name || !email || !password || !confirmPassword) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!confirmPassword) missingFields.push('confirmPassword');
      
      console.log('[DEBUG] Missing fields:', missingFields);
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('[DEBUG] Password mismatch:', { 
        passwordLength: password.length, 
        confirmLength: confirmPassword.length 
      });
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      console.log('[DEBUG] Password too short:', password.length);
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    console.log('[DEBUG] Passed all validations, proceeding with registration');
    
    try {
      console.log('[DEBUG] About to call apiService.register()');
      const userData = { name, email, password, role, phone, address };
      console.log('[DEBUG] API call payload:', JSON.stringify(userData, null, 2));
      
      // Log the API service object to verify it exists and has the register method
      console.log('[DEBUG] apiService object:', Object.keys(apiService));
      
      // Wrap API call in try-catch for more detailed error logging
      try {
        const response = await apiService.register(userData);
        console.log('[DEBUG] Raw API response:', response);
        console.log('[DEBUG] Registration API call succeeded:', JSON.stringify(response.data, null, 2));
        
        // Get the token and user from response
        const { token, user } = response.data;
        console.log(`[DEBUG] Token extracted:`, token ? 'Valid token received' : 'No token in response');
        console.log(`[DEBUG] User data extracted:`, user ? 'Valid user data received' : 'No user in response');
        
        if (!token) {
          console.log('[DEBUG] WARNING: No token received in successful response');
        }
        
        // Save token to storage with error handling
        console.log('[DEBUG] Attempting to save token to storage');
        try {
          await setToken(token);
          console.log('[DEBUG] Token saved successfully');
        } catch (storageError) {
          console.log('[DEBUG] Error saving token:', storageError);
          throw new Error('Failed to save authentication token');
        }
        
        // Update login state
        console.log('[DEBUG] Setting isLoggedIn to true');
        setIsLoggedIn(true);
      } catch (apiError: any) {
        console.log('[DEBUG] API call threw exception:', apiError);
        console.log('[DEBUG] API error stack:', apiError.stack);
        throw apiError; // re-throw to be caught by outer catch
      }
    } catch (err: any) {
      console.log('[DEBUG] Registration error type:', typeof err);
      console.log('[DEBUG] Is error an Error object?', err instanceof Error);
      console.log('[DEBUG] Error name:', err.name);
      console.log('[DEBUG] Error message:', err.message);
      console.log('[DEBUG] Error stack:', err.stack);
      
      // Log specific axios error properties if available
      if (err.response) {
        console.log('[DEBUG] Error response status:', err.response.status);
        console.log('[DEBUG] Error response headers:', JSON.stringify(err.response.headers, null, 2));
        console.log('[DEBUG] Error response data:', JSON.stringify(err.response.data, null, 2));
      } else if (err.request) {
        console.log('[DEBUG] Error request:', 'Request was made but no response received');
        console.log('[DEBUG] Error request details:', JSON.stringify(err.request, null, 2));
      } else {
        console.log('[DEBUG] Error setting up request:', err.message);
      }
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        console.log('[DEBUG] Using error message from API response');
      } else if (err.message) {
        errorMessage = err.message;
        console.log('[DEBUG] Using error message from Error object');
      }
      
      console.log('[DEBUG] Final error message to display:', errorMessage);
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      console.log('[DEBUG] Registration process complete, setting isLoading to false');
      setIsLoading(false);
      console.log('=== REGISTRATION PROCESS ENDED ===');
    }
  };

  // Add logging before render
  console.log('[DEBUG] RegisterScreen rendering, current state:', { 
    hasName: !!name, 
    hasEmail: !!email,
    formComplete: !!(name && email && password && confirmPassword),
    isLoading, 
    isLoggedIn,
    error
  });
  
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
            
            {/* Add Address field */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Address (Optional)</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <MaterialIcons name="home" size={20} color="#6B7280" />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
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
                  autoCorrect={false}
                  textContentType="oneTimeCode"
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
                  secureTextEntry={!showConfirmPassword}
                  autoCorrect={false}
                  textContentType="oneTimeCode"
                  className="flex-1 text-gray-800 ml-2"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <MaterialIcons 
                    name={showConfirmPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
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
