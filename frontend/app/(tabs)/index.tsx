import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getUserData } from '../../utils/storage';
import apiService from '../../utils/api'; // Add API service import

const { width } = Dimensions.get('window');

const Home: React.FC = () => {
  const categoryFadeAnim = useRef(new Animated.Value(0)).current;
  const offersFadeAnim = useRef(new Animated.Value(0)).current;
  const servicesFadeAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState<any>(null); // Add state for API user data
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  // Load user data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getUserProfile();
        if (response && response.data && response.data.user) {
          setUserData(response.data.user);
          setUserName(response.data.user.name || '');
          console.log('User profile data:', response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fall back to local storage if API fails
        try {
          const localUserData = await getUserData();
          if (localUserData && localUserData.name) {
            setUserName(localUserData.name);
          }
        } catch (storageError) {
          console.error('Error loading local user data:', storageError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Add top rated services data
  const topRatedServices = [
    {
      name: "John's Electrical",
      category: "Electrician",
      rating: 4.8,
      reviews: 234,
      startingPrice: 45,
      image: require('../../assets/images/top_rated/Electrical.png'),
    },
    {
      name: "Pro Plumbing",
      category: "Plumber",
      rating: 4.9,
      reviews: 189,
      startingPrice: 60,
      image: require('../../assets/images/top_rated/pro_plumbing.png'),
    },
    {
      name: "Clean & Shine",
      category: "Cleaning",
      rating: 4.8,
      reviews: 456,
      startingPrice: 35,
      image: require('../../assets/images/offers/3.png'),
    },
    {
      name: "Beauty Plus",
      category: "Beautician",
      rating: 4.9,
      reviews: 312,
      startingPrice: 50,
      image: require('../../assets/images/offers/1.png'),
    },
  ];

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(categoryFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(offersFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(servicesFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [categoryFadeAnim, offersFadeAnim, servicesFadeAnim]);

  const offersImages = [
    {
      image: require('../../assets/images/offers/1.png'),
      service: 'beautician',
      title: '20% Off Beauty Services',
      validUntil: 'Valid until Oct 30'
    },
    {
      image: require('../../assets/images/offers/2.png'),
      service: 'laundry',
      title: 'Laundry Special Discount',
      validUntil: 'Valid until Nov 15'
    },
    {
      image: require('../../assets/images/offers/3.png'),
      service: 'cleaning',
      title: 'Premium Cleaning Deal',
      validUntil: 'Valid until Oct 25'
    },
  ];

  const categories = [
    { icon: 'electrical-services', label: 'Electricians', color: '#ffa500' },
    { icon: 'plumbing', label: 'Plumbers', color: '#4b9fd6' },
    { icon: 'spa', label: 'Beauticians', color: '#ff69b4' },
    { icon: 'cleaning-services', label: 'Cleaning', color: '#4caf50' },
    { icon: 'format-paint', label: 'Painters', color: '#ff8c00' },
    { icon: 'construction', label: 'Carpenters', color: '#8b4513' },
    { icon: 'grass', label: 'Landscapers', color: '#228b22' },
    { icon: 'home', label: 'Smart Home', color: '#4682B4' },
    { icon: 'settings', label: 'Technicians', color: '#ff5722' },
    { icon: 'security', label: 'Security', color: '#607d8b' },
    { icon: 'local-shipping', label: 'Movers', color: '#8bc34a' },
    { icon: 'wb-sunny', label: 'Solar Services', color: '#ffc107' },
  ];

  const displayedCategories = expanded ? categories : categories.slice(0, 8);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        className="flex-1"
      >
        {/* Header - adjusted spacing */}
        <View className="bg-primary-500 pt-16 pb-6 px-5 rounded-b-3xl shadow-md">
          <View className="flex-row justify-between items-center mb-0">
            {/* Welcome greeting - positioned closer to search bar */}
            <Text className="text-white text-xl font-bold">
              Welcome back, {userData?.name || userName || 'User'}
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/notifications')}
              className="bg-white/20 p-2 rounded-full"
            >
              <View className="absolute right-0 top-0 z-10 bg-red-500 w-3 h-3 rounded-full"></View>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar - reduced top margin */}
          <View className="relative mt-1">
            <TextInput
              className="bg-white border border-gray-200 rounded-xl py-4 px-12 text-base shadow-sm"
              placeholder="Search services here"
              placeholderTextColor="#9ca3af"
            />
            <FontAwesome5
              name="search"
              size={18}
              color="#9ca3af"
              style={{ position: 'absolute', left: 14, top: 18 }}
            />
          </View>
        </View>
        
        <View className="pt-6">
          {/* Offers Section */}
          <Animated.View 
            className="px-4 mb-6" 
            style={{ opacity: offersFadeAnim }}
          >
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-gray-900 text-xl font-semibold">Special Offers</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-primary-500 font-semibold mr-1">See All</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              className="pb-2"
            >
              {offersImages.map((offer, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(`/discounts/${offer.service}` as any)}
                  className="mr-4 rounded-2xl overflow-hidden bg-white shadow-md"
                  style={{ width: width * 0.75, height: 180 }}
                >
                  <Image 
                    source={offer.image} 
                    className="w-full h-full" 
                    resizeMode="cover" 
                  />
                  <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                    <Text className="text-white font-bold text-lg">{offer.title}</Text>
                    <View className="flex-row justify-between items-center mt-1">
                      <Text className="text-gray-100 text-sm">{offer.validUntil}</Text>
                      <View className="bg-white/30 rounded-full p-2">
                        <FontAwesome5 name="arrow-right" size={12} color="white" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Categories Section */}
          <Animated.View 
            className="px-4 mb-6" 
            style={{ opacity: categoryFadeAnim }}
          >
            <Text className="text-gray-600 text-base font-medium mb-3 px-1">CATEGORIES</Text>
            
            <View className="bg-white rounded-2xl shadow-sm p-4 mb-2">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-900 text-lg font-semibold">Services</Text>
                <TouchableOpacity className="flex-row items-center" onPress={toggleExpand}>
                  <Text className="text-primary-500 font-semibold mr-1">
                    {expanded ? 'View Less' : 'View All'}
                  </Text>
                  <MaterialIcons name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="#2563eb" />
                </TouchableOpacity>
              </View>
              
              <View className="flex-row flex-wrap justify-between">
                {displayedCategories.map((category, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => router.push(`/category/${category.label.toLowerCase()}` as any)}
                    className="w-[22%] mb-7"
                  >
                    <View className="rounded-2xl p-3.5 mb-2 items-center justify-center bg-primary-100 h-16">
                      <MaterialIcons name={category.icon as any} size={28} color={category.color} />
                    </View>
                    <Text className="text-center text-xs font-medium text-gray-700">{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Top Rated Services Section */}
          <Animated.View 
            className="px-4"
            style={{ opacity: servicesFadeAnim }}
          >
            <Text className="text-gray-600 text-base font-medium mb-3 px-1">POPULAR SERVICES</Text>
            
            <View className="bg-white rounded-2xl shadow-sm p-4 mb-2">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-900 text-lg font-semibold">Top Rated</Text>
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-primary-500 font-semibold mr-1">See All</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#2563eb" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                className="pb-2"
              >
                {topRatedServices.map((service, index) => (
                  <TouchableOpacity 
                    key={index}
                    onPress={() => router.push(`/service/${service.category.toLowerCase()}` as any)}
                    className="mr-4 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                    style={{ width: width * 0.7 }}
                  >
                    <View className="h-44 w-full relative">
                      <Image 
                        source={service.image} 
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className="absolute top-3 right-3 bg-white/90 px-2.5 py-1.5 rounded-lg flex-row items-center shadow-md">
                        <FontAwesome5 name="star" solid size={12} color="#FFD700" />
                        <Text className="ml-1 font-bold text-sm text-gray-800">{service.rating}</Text>
                      </View>
                      <View className="absolute top-3 left-3 bg-primary-500 px-3 py-1.5 rounded-lg shadow-md">
                        <Text className="text-white font-medium text-xs">{service.category}</Text>
                      </View>
                    </View>
                    
                    <View className="p-4">
                      <Text className="text-lg font-bold text-gray-800">{service.name}</Text>
                      <View className="flex-row items-center mt-1 mb-3">
                        <MaterialIcons name="verified" size={14} color="#2563eb" />
                        <Text className="text-gray-500 text-xs ml-1">{service.reviews} reviews</Text>
                      </View>
                      
                      <View className="flex-row justify-between items-center mt-1">
                        <View>
                          <Text className="text-gray-500 text-xs">Starting from</Text>
                          <Text className="text-primary-500 font-bold text-xl">${service.startingPrice}</Text>
                        </View>
                        
                        <TouchableOpacity className="bg-primary-500 rounded-full p-3 shadow-md">
                          <FontAwesome5 name="arrow-right" size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;