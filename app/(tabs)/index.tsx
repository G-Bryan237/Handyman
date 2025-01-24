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
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Home: React.FC = () => {
  const categoryFadeAnim = useRef(new Animated.Value(0)).current;
  const offersFadeAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  // Add top rated services data
  const topRatedServices = [
    {
      name: "John's Electrical",
      category: "Electrician",
      rating: 4.8,
      reviews: 234,
      startingPrice: 45,
      image: require('../../assets/images/top_rated/Electrical.png'), // You'll need to add appropriate images
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
    Animated.parallel([
      Animated.timing(categoryFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(offersFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [categoryFadeAnim, offersFadeAnim]);

  const offersImages = [
    {
      image: require('../../assets/images/offers/1.png'),
      service: 'beautician',
    },
    {
      image: require('../../assets/images/offers/2.png'),
      service: 'laundry',
    },
    {
      image: require('../../assets/images/offers/3.png'),
      service: 'cleaning',
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

  return (
    <SafeAreaView>
      <View className="flex flex-col h-full bg-white">
        {/* Search Bar */}
        <View className="bg-white px-5 py-6">
          <View className="relative">
            <TextInput
              className="bg-gray-100 shadow-md rounded-lg py-3 px-12 text-lg"
              placeholder="Search services here"
              placeholderTextColor="gray"
            />
            <FontAwesome5
              name="search"
              size={20}
              color="gray"
              style={{ position: 'absolute', left: 14, top: 14 }}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}>

          {/* Offers Section */}
          <View>
            <Text className="text-lg font-bold mb-4">Offers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {offersImages.map((offer, index) => (
                <View
                  key={index}
                  className="mr-4 rounded-lg overflow-hidden"
                  style={{ width: width * 0.7, height: 200 }}
                >
                  <Image source={offer.image} className="w-full h-full" resizeMode="cover" />
                  <TouchableOpacity
                    onPress={() => router.push(`/discounts/${offer.service}` as any)}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 10,
                    }}
                  >
                    <Text className="text-white font-medium">See Discount</Text>
                    <FontAwesome5 name="chevron-right" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Categories Section */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-lg font-bold">Categories</Text>
              <TouchableOpacity onPress={() => router.push('/categories')}>
                <Text className="text-blue-500 text-sm font-medium">
                {expanded ? 'View Less' : 'View All'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between flex-wrap">
              {displayedCategories.map((category, index) => (
                <TouchableOpacity key={index} className="w-1/4 items-center mb-4">
                  <View className="bg-gray-100 p-4 rounded-full">
                    <MaterialIcons name={category.icon as any} size={24} color={category.color} />
                  </View>
                  <Text className="text-sm font-medium mt-2 text-center">{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        {/* Top Rated Services Section */}
        <View className="mb-6">
            <Text className="text-lg font-bold mb-4">Top Rated Services</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {topRatedServices.map((service, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => router.push(`/service/${service.category.toLowerCase()}` as any)}
                  style={{ 
                    marginRight: 16,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    overflow: 'hidden',
                    width: width * 0.8,
                    height: 290 // Fixed height for consistency
                  }}
                >
                  <View className="h-[140] w-full">
                    <Image 
                      source={service.image} 
                      className="w-full h-full"
                      resizeMode="cover"
                      style={{
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12
                      }}
                    />
                    <View 
                      className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex-row items-center"
                      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                    >
                      <FontAwesome5 name="star" solid size={12} color="#FFD700" />
                      <Text className="ml-1 font-semibold">{service.rating}</Text>
                    </View>
                  </View>
                  <View className="p-4 flex-1 justify-between">
                    <View>
                      <Text className="text-lg font-semibold ">{service.name}</Text>
                      <Text className="text-gray-500 text-sm">{service.reviews} reviews</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-6">
                      <View>
                        <Text className="text-gray-500 text-xs ">Starting from</Text>
                        <Text className="text-blue-600 font-bold text-lg">${service.startingPrice}</Text>
                      </View>
                      <TouchableOpacity 
                        className="bg-blue-500 rounded-full p-3"
                        style={{ 
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4
                        }}
                      >
                        <FontAwesome5 name="arrow-right" size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
            </ScrollView>
          </View>
    </SafeAreaView>
  );
};

export default Home;