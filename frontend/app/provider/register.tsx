import React, { useState, useEffect, useRef } from 'react';
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
  Switch,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getUserData, updateUserData, setProviderOnboardingComplete } from '../../utils/storage';
import apiService from '../../utils/api';
import cloudinary from '../../utils/cloudinary';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  { id: 'hvac', name: 'HVAC Technician', icon: 'ac-unit' },
  { id: 'appliance', name: 'Appliance Repair', icon: 'kitchen' },
  { id: 'roofing', name: 'Roofing', icon: 'roofing' },
  { id: 'flooring', name: 'Flooring', icon: 'layers' },
  { id: 'pest', name: 'Pest Control', icon: 'bug-report' },
  { id: 'glass', name: 'Glass & Windows', icon: 'window' },
];

// Working days options
const WORKING_DAYS = [
  { id: 'monday', name: 'Monday' },
  { id: 'tuesday', name: 'Tuesday' },
  { id: 'wednesday', name: 'Wednesday' },
  { id: 'thursday', name: 'Thursday' },
  { id: 'friday', name: 'Friday' },
  { id: 'saturday', name: 'Saturday' },
  { id: 'sunday', name: 'Sunday' },
];

// Cities in Cameroon
const CITIES = [
  'Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Buea', 'Limbe',
  'Kumba', 'Kribi', 'Edéa', 'Nkongsamba', 'Ebolowa'
];

// Payment methods
const PAYMENT_METHODS = [
  { id: 'mtn', name: 'MTN Mobile Money' },
  { id: 'orange', name: 'Orange Money' },
  { id: 'uba', name: 'UBA Bank' },
  { id: 'bicec', name: 'BICEC Bank' },
  { id: 'other_bank', name: 'Other Bank' },
];

// Define response types for Cloudinary uploads
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  asset_id: string;
  url: string;
  [key: string]: any;  // For any other properties returned
}

interface CertificationUrl {
  name: string;
  url: string;
  publicId: string;
}

export default function ProviderRegistration() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [providerType, setProviderType] = useState<'individual' | 'company'>('individual');
  
  // 1. Professional Details
  const [businessName, setBusinessName] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<any[]>([]);
  
  // 2. Availability
  const [workingDays, setWorkingDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri']);
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('18:00');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [acceptExpressJobs, setAcceptExpressJobs] = useState(false);
  
  // 3. Service Area
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  
  // 4. Payment Setup
  const [paymentMethod, setPaymentMethod] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  // 5. Terms and Conditions
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [confirmAuthenticity, setConfirmAuthenticity] = useState(false);
  
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
  
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        // Store the local URI for preview
        setProfilePhoto(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const document = result.assets[0];
        setCertifications([...certifications, {
          name: document.name,
          uri: document.uri,
          type: document.mimeType || 'application/pdf',
          // Not uploading immediately to save bandwidth
          // Will upload when form is submitted
        }]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };
  
  const removeCertification = (index: number) => {
    const updatedCerts = [...certifications];
    updatedCerts.splice(index, 1);
    setCertifications(updatedCerts);
  };
  
  const toggleDay = (dayId: string) => {
    if (workingDays.includes(dayId)) {
      setWorkingDays(workingDays.filter(id => id !== dayId));
    } else {
      setWorkingDays([...workingDays, dayId]);
    }
  };
  
  // Add a ref for the ScrollView using the correct React.RefObject type
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleNextStep = () => {
    // Add logging to trace function execution
    console.log('[ProviderRegistration] handleNextStep called, current step:', currentStep);
    
    // Validate current step before proceeding
    if (currentStep === 1) {
      console.log('[ProviderRegistration] Validating step 1');
      if (!validateStep1()) {
        console.log('[ProviderRegistration] Step 1 validation failed');
        return;
      }
      console.log('[ProviderRegistration] Step 1 validation passed');
    } else if (currentStep === 2) {
      console.log('[ProviderRegistration] Validating step 2');
      if (!validateStep2()) {
        console.log('[ProviderRegistration] Step 2 validation failed');
        return;
      }
      console.log('[ProviderRegistration] Step 2 validation passed');
    } else if (currentStep === 3) {
      console.log('[ProviderRegistration] Validating step 3');
      if (!validateStep3()) {
        console.log('[ProviderRegistration] Step 3 validation failed');
        return;
      }
      console.log('[ProviderRegistration] Step 3 validation passed');
    } else if (currentStep === 4) {
      console.log('[ProviderRegistration] Validating step 4');
      if (!validateStep4()) {
        console.log('[ProviderRegistration] Step 4 validation failed');
        return;
      }
      console.log('[ProviderRegistration] Step 4 validation passed');
    }
    
    // Update the step
    console.log('[ProviderRegistration] Updating current step from', currentStep, 'to', currentStep + 1);
    setCurrentStep(currentStep + 1);
    
    // Use scrollTo with the ScrollView ref instead of window.scrollTo
    try {
      console.log('[ProviderRegistration] Attempting to scroll to top');
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      console.log('[ProviderRegistration] Scroll completed');
    } catch (error) {
      console.error('[ProviderRegistration] Error scrolling to top:', error);
    }
  };
  
  const handlePrevStep = () => {
    console.log('[ProviderRegistration] handlePrevStep called, current step:', currentStep);
    setCurrentStep(currentStep - 1);
    
    // Use scrollTo with the ScrollView ref instead of window.scrollTo
    try {
      console.log('[ProviderRegistration] Attempting to scroll to top');
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      console.log('[ProviderRegistration] Scroll completed');
    } catch (error) {
      console.error('[ProviderRegistration] Error scrolling to top:', error);
    }
  };
  
  const validateStep1 = () => {
    if (!businessName.trim()) {
      Alert.alert('Error', `Please enter your ${providerType === 'individual' ? 'service' : 'company'} name`);
      return false;
    }
    
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one service category');
      return false;
    }
    
    if (!experience) {
      Alert.alert('Error', 'Please enter your years of experience');
      return false;
    }
    
    if (providerType === 'company' && !employeeCount) {
      Alert.alert('Error', 'Please enter the number of employees');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (workingDays.length === 0) {
      Alert.alert('Error', 'Please select at least one working day');
      return false;
    }
    
    if (!startHour || !endHour) {
      Alert.alert('Error', 'Please specify your working hours');
      return false;
    }
    
    return true;
  };
  
  const validateStep3 = () => {
    if (!city) {
      Alert.alert('Error', 'Please select your city/region');
      return false;
    }
    
    return true;
  };
  
  const validateStep4 = () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return false;
    }
    
    if (!accountName || !accountNumber) {
      Alert.alert('Error', 'Please enter your account details');
      return false;
    }
    
    return true;
  };
  
  const validateFinalStep = () => {
    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms and Conditions');
      return false;
    }
    
    if (!confirmAuthenticity) {
      Alert.alert('Error', 'Please confirm the authenticity of your details');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateFinalStep()) return;
    
    setIsSubmitting(true);
    
    try {
      let profilePhotoUrl = profilePhoto;
      let certificationUrls: CertificationUrl[] = [];
      
      // Upload profile photo to Cloudinary if exists
      if (profilePhoto) {
        try {
          const uploadResult = await cloudinary.uploadImage(
            profilePhoto, 
            `providers/${userData.id || 'new'}/profile`
          ) as CloudinaryResponse;
          
          profilePhotoUrl = uploadResult.secure_url;
          console.log('Profile photo uploaded:', profilePhotoUrl);
        } catch (uploadError) {
          console.error('Failed to upload profile photo:', uploadError);
          Alert.alert('Warning', 'Failed to upload profile photo. Continuing with registration...');
        }
      }
      
      // Upload certifications to Cloudinary
      if (certifications.length > 0) {
        try {
          // Create a progress indicator
          Alert.alert('Uploading', 'Uploading your certifications. This may take a moment...');
          
          // Upload each certification
          const uploadPromises = certifications.map(cert => 
            cloudinary.uploadDocument(
              cert.uri,
              `providers/${userData.id || 'new'}/certifications`
            ) as Promise<CloudinaryResponse>
          );
          
          const uploadResults = await Promise.all(uploadPromises);
          certificationUrls = uploadResults.map(result => ({
            name: result.original_filename,
            url: result.secure_url,
            publicId: result.public_id
          }));
          
          console.log('Certifications uploaded:', certificationUrls);
        } catch (uploadError) {
          console.error('Failed to upload certifications:', uploadError);
          Alert.alert('Warning', 'Failed to upload certifications. Continuing with registration...');
        }
      }
      
      // Build provider data with uploaded URLs
      const providerData = {
        businessName,
        experience: experience || '0',
        bio,
        services: selectedCategories,
        hourlyRate: parseFloat(hourlyRate),
        providerType,
        ...(providerType === 'company' && { employeeCount: parseInt(employeeCount) }),
        
        // Use Cloudinary URLs for image assets
        profilePhotoUrl,
        certifications: certificationUrls,
        
        // Existing fields
        availability: {
          workingDays,
          hours: {
            start: startHour,
            end: endHour
          },
          expressJobs: acceptExpressJobs
        },
        serviceArea: {
          city,
          neighborhood
        },
        payment: {
          method: paymentMethod,
          accountName,
          accountNumber: accountNumber.replace(/\s/g, '')
        }
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
        await setProviderOnboardingComplete();
        
        // Show success and navigate to provider mode
        Alert.alert(
          'Success',
          'You are now registered as a service provider! Your application will be reviewed shortly.',
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
  
  const renderStep1 = () => (
    <>
      {/* Provider Type Selection */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">I am registering as:</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setProviderType('individual')}
            className={`flex-1 mr-2 py-3 rounded-lg flex-row items-center justify-center ${
              providerType === 'individual'
                ? 'bg-primary-100 border-primary-500 border'
                : 'bg-gray-100 border-gray-200 border'
            }`}
          >
            <MaterialIcons
              name="person"
              size={20}
              color={providerType === 'individual' ? '#2563eb' : '#6B7280'}
              className="mr-2"
            />
            <Text
              className={`${
                providerType === 'individual'
                  ? 'text-primary-700 font-medium'
                  : 'text-gray-700'
              }`}
            >
              Individual
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setProviderType('company')}
            className={`flex-1 ml-2 py-3 rounded-lg flex-row items-center justify-center ${
              providerType === 'company'
                ? 'bg-primary-100 border-primary-500 border'
                : 'bg-gray-100 border-gray-200 border'
            }`}
          >
            <MaterialIcons
              name="business"
              size={20}
              color={providerType === 'company' ? '#2563eb' : '#6B7280'}
              className="mr-2"
            />
            <Text
              className={`${
                providerType === 'company'
                  ? 'text-primary-700 font-medium'
                  : 'text-gray-700'
              }`}
            >
              Company
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Profile Photo */}
      <View className="mb-6 items-center">
        <Text className="text-gray-900 font-semibold text-lg mb-4 self-start">Profile Photo</Text>
        <TouchableOpacity onPress={pickImage} className="mb-3">
          {profilePhoto ? (
            <Image 
              source={{ uri: profilePhoto }} 
              className="w-28 h-28 rounded-full"
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center">
              <MaterialIcons name="person" size={50} color="#9ca3af" />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={pickImage}
          className="bg-gray-100 px-4 py-2 rounded-lg"
        >
          <Text className="text-primary-700">
            {profilePhoto ? 'Change Photo' : 'Upload Photo'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Business Information */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">
          {providerType === 'individual' ? 'Personal Information' : 'Business Information'}
        </Text>
        
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">
            {providerType === 'individual' ? 'Service Name' : 'Company Name'} *
          </Text>
          <TextInput
            value={businessName}
            onChangeText={setBusinessName}
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
            placeholder={providerType === 'individual' ? "Enter your service name" : "Enter your company name"}
          />
        </View>
        
        {providerType === 'company' && (
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Number of Employees *</Text>
            <TextInput
              value={employeeCount}
              onChangeText={setEmployeeCount}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
              placeholder="e.g., 10"
              keyboardType="numeric"
            />
          </View>
        )}
        
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Years of Experience *</Text>
          <TextInput
            value={experience}
            onChangeText={setExperience}
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
            placeholder="e.g., 5"
            keyboardType="numeric"
          />
        </View>
      </View>
      
      {/* Service Categories Section */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-2">Services You Offer *</Text>
        <Text className="text-gray-500 mb-4">Select all the services that you provide</Text>
        
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
      
      {/* Bio */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-2">Service Description / Bio *</Text>
        <Text className="text-gray-500 mb-4">Describe your services, experience, and expertise</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Tell clients about your qualifications, experience, and the quality of service they can expect..."
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>
      
      {/* Certifications */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-2">Certifications & Licenses</Text>
        <Text className="text-gray-500 mb-4">Upload any relevant certifications or licenses (PDF format)</Text>
        
        {certifications.length > 0 && (
          <View className="mb-4">
            {certifications.map((cert, index) => (
              <View key={index} className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 mb-2">
                <View className="flex-row items-center flex-1 mr-2">
                  <MaterialIcons name="description" size={20} color="#4b5563" />
                  <Text className="text-gray-700 ml-2 flex-1" numberOfLines={1}>{cert.name}</Text>
                </View>
                <TouchableOpacity onPress={() => removeCertification(index)}>
                  <MaterialIcons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        <TouchableOpacity
          onPress={pickDocument}
          className="bg-gray-100 p-3 rounded-lg flex-row justify-center items-center"
        >
          <MaterialIcons name="upload-file" size={20} color="#2563eb" className="mr-2" />
          <Text className="text-primary-700">Upload Certificate</Text>
        </TouchableOpacity>
      </View>
      
      {/* Pricing Section */}
      <View className="mb-8">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Service Pricing</Text>
        
        <View>
          <Text className="text-gray-700 mb-2 font-medium">Your Hourly Rate (CFA) *</Text>
          <TextInput
            value={hourlyRate}
            onChangeText={setHourlyRate}
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
            placeholder="e.g., 5000"
            keyboardType="numeric"
          />
        </View>
      </View>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <Text className="text-gray-900 font-semibold text-xl mb-6">📅 Availability</Text>
      
      {/* Working Days */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Working Days *</Text>
        <Text className="text-gray-500 mb-4">Select the days you're available to work</Text>
        
        <View className="flex-row flex-wrap">
          {WORKING_DAYS.map((day) => (
            <TouchableOpacity
              key={day.id}
              onPress={() => toggleDay(day.id)}
              className={`mr-2 mb-3 px-4 py-2 rounded-full flex-row items-center ${
                workingDays.includes(day.id)
                  ? 'bg-primary-100 border-primary-500 border'
                  : 'bg-gray-100 border-gray-200 border'
              }`}
            >
              <Text
                className={`${
                  workingDays.includes(day.id)
                    ? 'text-primary-700 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {day.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Working Hours - Enhanced with TimePicker */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Working Hours *</Text>
        <View className="flex-row items-center">
          <View className="flex-1 mr-2">
            <Text className="text-gray-700 mb-2">Start Time</Text>
            <TouchableOpacity 
              onPress={() => setShowStartTimePicker(true)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between"
            >
              <Text className="text-gray-800">{startHour}</Text>
              <MaterialIcons name="access-time" size={20} color="#4b5563" />
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={parseTimeString(startHour)}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onStartTimeChange}
                minuteInterval={15}
                style={Platform.OS === 'ios' ? { width: '100%', height: 200 } : {}}
              />
            )}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-700 mb-2">End Time</Text>
            <TouchableOpacity 
              onPress={() => setShowEndTimePicker(true)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between"
            >
              <Text className="text-gray-800">{endHour}</Text>
              <MaterialIcons name="access-time" size={20} color="#4b5563" />
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={parseTimeString(endHour)}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onEndTimeChange}
                minuteInterval={15}
                style={Platform.OS === 'ios' ? { width: '100%', height: 200 } : {}}
              />
            )}
          </View>
        </View>
      </View>
      
      {/* Express Jobs */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Express Jobs</Text>
        <View className="flex-row justify-between items-center bg-white border border-gray-200 rounded-lg p-4">
          <View>
            <Text className="text-gray-800 font-medium">Accept Express Jobs</Text>
            <Text className="text-gray-500 text-sm">Emergency bookings with higher rates</Text>
          </View>
          <Switch
            value={acceptExpressJobs}
            onValueChange={setAcceptExpressJobs}
            trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
            thumbColor={acceptExpressJobs ? '#2563eb' : '#ffffff'}
          />
        </View>
      </View>
    </>
  );
  
  const renderStep3 = () => (
    <>
      <Text className="text-gray-900 font-semibold text-xl mb-6">📍 Service Area</Text>
      
      {/* City/Region */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">City / Region *</Text>
        <Text className="text-gray-500 mb-4">Select the city where you offer your services</Text>
        
        <View className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
          <TouchableOpacity
            onPress={() => {
              // Create a simple alert with city options for direct selection
              Alert.alert(
                'Select Your City',
                'Select the city where you offer your services',
                [
                  ...CITIES.map(cityName => ({
                    text: cityName,
                    onPress: () => setCity(cityName)
                  })),
                  { 
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ],
                { cancelable: true }
              );
              
              console.log('[ProviderRegistration] Opening city selection');
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text className={city ? 'text-gray-900' : 'text-gray-400'}>
                {city || 'Select your city'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#4b5563" />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Show selected city with option to change */}
        {city && (
          <View className="mt-2 flex-row items-center">
            <MaterialIcons name="location-on" size={16} color="#2563eb" />
            <Text className="text-primary-600 ml-1">
              {city} selected
            </Text>
            <TouchableOpacity onPress={() => setCity('')} className="ml-2">
              <Text className="text-gray-500 underline">change</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Direct selection from list (alternative approach) */}
        <View className="mt-4">
          <Text className="text-gray-700 mb-2">Or select from list:</Text>
          <ScrollView 
            className="max-h-48 bg-white border border-gray-200 rounded-lg"
          >
            {CITIES.map(cityName => (
              <TouchableOpacity 
                key={cityName}
                onPress={() => setCity(cityName)}
                className={`px-4 py-3 border-b border-gray-100 ${city === cityName ? 'bg-primary-50' : ''}`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className={city === cityName ? 'text-primary-700 font-medium' : 'text-gray-700'}>
                    {cityName}
                  </Text>
                  {city === cityName && (
                    <MaterialIcons name="check" size={18} color="#2563eb" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      {/* Neighborhood */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Neighborhood / Quarter</Text>
        <Text className="text-gray-500 mb-4">Specify the areas where you primarily work</Text>
        
        <TextInput
          value={neighborhood}
          onChangeText={setNeighborhood}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
          placeholder="e.g., Bonanjo, Akwa, etc."
        />
      </View>
    </>
  );
  
  const renderStep4 = () => (
    <>
      <Text className="text-gray-900 font-semibold text-xl mb-6">🏦 Payment Setup</Text>
      
      {/* Payment Method */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Payment Method *</Text>
        <Text className="text-gray-500 mb-4">Select how you want to receive payments</Text>
        
        <View className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Select Payment Method',
                '',
                PAYMENT_METHODS.map((pm) => ({
                  text: pm.name,
                  onPress: () => setPaymentMethod(pm.id)
                })).concat([{ text: 'Cancel', onPress: () => {} }])
              );
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text className={paymentMethod ? 'text-gray-900' : 'text-gray-400'}>
                {paymentMethod ? 
                  PAYMENT_METHODS.find(pm => pm.id === paymentMethod)?.name || 'Select payment method' : 
                  'Select payment method'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#4b5563" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Account Name */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Account Name *</Text>
        <TextInput
          value={accountName}
          onChangeText={setAccountName}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Enter the name on your account"
        />
      </View>
      
      {/* Account Number */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold text-lg mb-4">Account Number *</Text>
        <TextInput
          value={accountNumber}
          onChangeText={setAccountNumber}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Enter your account number"
          keyboardType="numeric"
        />
      </View>
    </>
  );
  
  const renderStep5 = () => (
    <>
      <Text className="text-gray-900 font-semibold text-xl mb-6">✅ Final Submission</Text>
      
      {/* Terms and Conditions */}
      <View className="mb-6">
        <TouchableOpacity 
          className="flex-row items-start mb-4"
          onPress={() => setAgreeToTerms(!agreeToTerms)}
        >
          <View className={`w-6 h-6 rounded border ${agreeToTerms ? 'bg-primary-500 border-primary-500' : 'border-gray-300'} items-center justify-center mr-2`}>
            {agreeToTerms && <MaterialIcons name="check" size={16} color="white" />}
          </View>
          <Text className="text-gray-700 flex-1">
            I agree to the <Text className="text-primary-600 underline">Terms and Conditions</Text> and
            <Text className="text-primary-600 underline"> Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-start"
          onPress={() => setConfirmAuthenticity(!confirmAuthenticity)}
        >
          <View className={`w-6 h-6 rounded border ${confirmAuthenticity ? 'bg-primary-500 border-primary-500' : 'border-gray-300'} items-center justify-center mr-2`}>
            {confirmAuthenticity && <MaterialIcons name="check" size={16} color="white" />}
          </View>
          <Text className="text-gray-700 flex-1">
            I confirm that all the information I have provided is accurate and authentic
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Review Information */}
      <View className="mb-6 bg-blue-50 p-4 rounded-lg">
        <Text className="text-blue-800 font-medium mb-2">What happens next?</Text>
        <Text className="text-blue-700 text-sm mb-2">1. Your profile will be reviewed by our team</Text>
        <Text className="text-blue-700 text-sm mb-2">2. We may contact you for additional information</Text>
        <Text className="text-blue-700 text-sm mb-2">3. Once approved, your profile will be live and you can start receiving bookings</Text>
      </View>
    </>
  );
  
  // Format date object to time string (HH:MM)
  const formatTimeToString = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Parse time string (HH:MM) to date object
  const parseTimeString = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0);
    date.setMinutes(minutes || 0);
    return date;
  };

  // Handle time change from picker
  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartHour(formatTimeToString(selectedDate));
      console.log('[ProviderRegistration] Start time set to:', formatTimeToString(selectedDate));
    }
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndHour(formatTimeToString(selectedDate));
      console.log('[ProviderRegistration] End time set to:', formatTimeToString(selectedDate));
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
      <ScrollView 
        className="flex-1 bg-white"
        ref={scrollViewRef}
      >
        <View className="bg-primary-500 pt-12 pb-6 px-5">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-full w-10 h-10 items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold flex-1 ml-4">Become a Provider</Text>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View className="px-5 pt-5">
          <View className="flex-row justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <View key={step} className="items-center">
                <View 
                  className={`w-8 h-8 rounded-full items-center justify-center 
                    ${step < currentStep ? 'bg-green-500' : step === currentStep ? 'bg-primary-500' : 'bg-gray-300'}`
                  }
                >
                  {step < currentStep ? (
                    <MaterialIcons name="check" size={16} color="white" />
                  ) : (
                    <Text className="text-white font-medium">{step}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View className="h-1 bg-gray-200 w-full rounded-full overflow-hidden">
            <View 
              className="h-1 bg-primary-500 rounded-full" 
              style={{ width: `${(currentStep - 1) * 25}%` }}
            />
          </View>
          <Text className="text-center text-gray-500 text-sm mt-2">
            Step {currentStep} of 5
          </Text>
        </View>
        
        <View className="p-5">
          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          
          {/* Navigation Buttons */}
          <View className="flex-row mt-8 mb-10">
            {currentStep > 1 && (
              <TouchableOpacity
                onPress={handlePrevStep}
                className="flex-1 mr-2 py-4 border border-gray-300 rounded-lg"
              >
                <Text className="text-gray-700 font-bold text-center">Back</Text>
              </TouchableOpacity>
            )}
            
            {currentStep < 5 ? (
              <TouchableOpacity
                onPress={handleNextStep}
                className={`flex-1 ${currentStep > 1 ? 'ml-2' : ''} bg-primary-500 py-4 rounded-lg`}
              >
                <Text className="text-white font-bold text-center">Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 ${currentStep > 1 ? 'ml-2' : ''} bg-primary-500 py-4 rounded-lg ${isSubmitting ? 'opacity-70' : ''}`}
              >
                <Text className="text-white font-bold text-center">
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
