import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apiService from '../../../utils/api';
import { getUserData } from '../../../utils/storage';

// Add TypeScript interfaces
interface ProviderProfile {
  businessName?: string;
  phone_number?: string;
  address?: string;
  region?: string;
  categories?: string[];
  services?: string[];
  experience_years?: number;
  tools_available?: string[];
  availability?: {
    workingDays?: string[];
  };
  payment_method?: string;
  mobile_money?: string;
  bank_name?: string;
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  providerProfile?: ProviderProfile;
}

const ProviderProfile = () => {
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const userData = await getUserData();
      
      if (!apiService || typeof apiService.getUserProfile !== 'function') {
        console.log('Using local userData instead of API call');
        if (userData) {
          setProfileData(userData);
          calculateCompletionPercentage(userData);
        }
      } else {
        const response = await apiService.getUserProfile();
        
        if (response?.data?.user) {
          setProfileData(response.data.user);
          calculateCompletionPercentage(response.data.user);
        } else if (userData) {
          setProfileData(userData);
          calculateCompletionPercentage(userData);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      
      try {
        const userData = await getUserData();
        if (userData) {
          setProfileData(userData);
          calculateCompletionPercentage(userData);
        }
      } catch (fallbackError) {
        console.error('Error loading local user data:', fallbackError);
        Alert.alert('Error', 'Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionPercentage = (userData: UserData) => {
    if (!userData) {
      setCompletionPercentage(0);
      return;
    }

    const profile = userData.providerProfile;
    if (!profile) {
      setCompletionPercentage(0);
      return;
    }

    const requiredFields = [
      profile.businessName,
      profile.phone_number,
      profile.address,
      profile.region,
      profile.categories?.length && profile.categories.length > 0,
      profile.services?.length && profile.services.length > 0,
      profile.experience_years,
      profile.availability?.workingDays?.length && profile.availability.workingDays.length > 0,
      profile.payment_method,
      profile.mobile_money || profile.bank_name
    ];

    const completedFields = requiredFields.filter(field => field).length;
    const percentage = Math.round((completedFields / requiredFields.length) * 100);
    setCompletionPercentage(percentage);
  };

  const getVerificationStatus = () => {
    if (completionPercentage >= 90) return { status: 'verified', color: '#10B981', icon: 'verified' };
    if (completionPercentage >= 70) return { status: 'pending', color: '#F59E0B', icon: 'pending' };
    return { status: 'incomplete', color: '#EF4444', icon: 'warning' };
  };

  const handleCompleteProfile = () => {
    router.push('/provider/profile-setup');
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 16, color: '#6B7280' }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <MaterialIcons name="person-off" size={64} color="#9CA3AF" />
          <Text style={{ fontSize: 18, color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
            No profile data available
          </Text>
          <TouchableOpacity 
            onPress={loadProfileData}
            style={{
              marginTop: 20,
              backgroundColor: '#3B82F6',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const verificationStatus = getVerificationStatus();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
          My Profile
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Completion Progress Bar */}
        <View style={{
          backgroundColor: 'white',
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 12,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
              Profile Completion
            </Text>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: verificationStatus.color 
            }}>
              {completionPercentage}%
            </Text>
          </View>
          
          {/* Progress Bar */}
          <View style={{
            height: 8,
            backgroundColor: '#E5E7EB',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 12
          }}>
            <View style={{
              height: '100%',
              width: `${completionPercentage}%`,
              backgroundColor: verificationStatus.color,
              borderRadius: 4
            }} />
          </View>

          {completionPercentage < 90 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  Complete your profile to get more bookings
                </Text>
              </View>
              <TouchableOpacity 
                onPress={handleCompleteProfile}
                style={{
                  backgroundColor: '#F59E0B',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                  marginLeft: 12
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Complete Now
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Profile Header Card */}
        <View style={{
          backgroundColor: 'white',
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 12,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Profile Picture */}
            <View style={{ position: 'relative' }}>
              {profileData.avatar ? (
                <Image 
                  source={{ uri: profileData.avatar }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              ) : (
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#DBEAFE',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MaterialIcons name="person" size={40} color="#3B82F6" />
                </View>
              )}
              {/* Verification Badge */}
              <View style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: verificationStatus.color,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'white'
              }}>
                <MaterialIcons 
                  name={verificationStatus.icon} 
                  size={12} 
                  color="white" 
                />
              </View>
            </View>

            {/* Profile Info */}
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                {profileData.name || 'User Name'}
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
                {profileData.providerProfile?.businessName || 'Business Name'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <MaterialIcons name="star" size={16} color="#F59E0B" />
                <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
                  4.8 (32 reviews)
                </Text>
              </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity 
              onPress={handleCompleteProfile}
              style={{
                backgroundColor: '#F3F4F6',
                padding: 10,
                borderRadius: 8
              }}
            >
              <MaterialIcons name="edit" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <InfoCard title="Contact Information">
          <InfoRow 
            icon="email"
            label="Email"
            value={profileData.email || 'Not provided'}
          />
          <InfoRow 
            icon="phone"
            label="Phone"
            value={profileData.providerProfile?.phone_number || profileData.phone || 'Not provided'}
          />
          <InfoRow 
            icon="location-on"
            label="Address"
            value={profileData.providerProfile?.address || 'Not provided'}
          />
          <InfoRow 
            icon="map"
            label="Region"
            value={profileData.providerProfile?.region || 'Not provided'}
          />
        </InfoCard>

        {/* Professional Information */}
        <InfoCard title="Professional Information">
          <InfoRow 
            icon="work"
            label="Categories"
            value={profileData.providerProfile?.categories?.join(', ') || 'Not specified'}
          />
          <InfoRow 
            icon="build"
            label="Services"
            value={profileData.providerProfile?.services?.join(', ') || 'Not specified'}
          />
          <InfoRow 
            icon="schedule"
            label="Experience"
            value={profileData.providerProfile?.experience_years 
              ? `${profileData.providerProfile.experience_years} years` 
              : 'Not specified'
            }
          />
          <InfoRow 
            icon="construction"
            label="Tools Available"
            value={profileData.providerProfile?.tools_available?.join(', ') || 'Not specified'}
          />
        </InfoCard>

        {/* Payment Information */}
        <InfoCard title="Payment Information">
          <InfoRow 
            icon="payment"
            label="Payment Method"
            value={profileData.providerProfile?.payment_method || 'Not specified'}
          />
          <InfoRow 
            icon="phone-android"
            label="Mobile Money"
            value={profileData.providerProfile?.mobile_money || 'Not specified'}
          />
          <InfoRow 
            icon="account-balance"
            label="Bank"
            value={profileData.providerProfile?.bank_name || 'Not specified'}
          />
        </InfoCard>

        {/* Quick Actions */}
        <View style={{
          backgroundColor: 'white',
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: 32,
          borderRadius: 12,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
            Quick Actions
          </Text>
          
          <ActionButton 
            icon="edit"
            title="Edit Profile"
            subtitle="Update your information"
            color="#3B82F6"
            backgroundColor="#EFF6FF"
            onPress={handleCompleteProfile}
          />
          
          <ActionButton 
            icon="work"
            title="My Bookings"
            subtitle="View your appointments"
            color="#10B981"
            backgroundColor="#ECFDF5"
            onPress={() => {}}
          />
          
          <ActionButton 
            icon="star"
            title="Reviews"
            subtitle="See customer feedback"
            color="#8B5CF6"
            backgroundColor="#F3E8FF"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Info Card Component
const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={{
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
      {title}
    </Text>
    {children}
  </View>
);

// Info Row Component
const InfoRow: React.FC<{
  icon: string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <View style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  }}>
    <MaterialIcons name={icon as any} size={20} color="#6B7280" />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151' }}>{label}</Text>
      <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>{value}</Text>
    </View>
  </View>
);

// Action Button Component
const ActionButton: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}> = ({ icon, title, subtitle, color, backgroundColor, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12
    }}
  >
    <MaterialIcons name={icon as any} size={24} color={color} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color, opacity: 0.7, marginTop: 2 }}>
        {subtitle}
      </Text>
    </View>
    <MaterialIcons name="chevron-right" size={20} color={color} />
  </TouchableOpacity>
);

export default ProviderProfile;
