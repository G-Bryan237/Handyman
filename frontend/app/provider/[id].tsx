import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Define provider interface
interface Service {
  name: string;
  price: number;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  text: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

interface Transactions {
  total: number;
  last30Days: number;
  successRate: number;
  successful: number;
  unsuccessful: number;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  description: string;
  longDescription: string;
  transactions: Transactions;
  services: Service[];
  reviews: Review[];
  contactInfo: ContactInfo;
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  imageUrl: any; // For require() image imports
  onlineStatus: string;
  type: string;
  teamSize?: string;
  availableDays: string[];
  availableHours: string;
  certificates: string[];
}

interface BadgeInfo {
  icon: string | null;
  color: string | null;
  size: number | null;
  label: string | null;
}

// Mock data - in a real app, you'd fetch this from an API using the ID parameter
const getProviderData = (id: string): Provider | undefined => {
  // This would be replaced with an API call
  const providers: Provider[] = [
    {
      id: '1',
      name: "John's Electrical",
      specialty: "Residential Wiring",
      description: "Specializing in residential electrical services with 24/7 emergency support. Quality work guaranteed. We offer installation, repair, and maintenance services for homes and small businesses with competitive rates.",
      longDescription: "With over a decade of experience in the electrical industry, John's Electrical provides professional services for all your electrical needs. We pride ourselves on our attention to detail, punctuality, and clean work environment. Our team of certified electricians can handle projects of any size, from simple repairs to complete home rewiring.",
      transactions: {
        total: 183,
        last30Days: 24,
        successRate: 98.2,
        successful: 180,
        unsuccessful: 3
      },
      services: [
        { name: "Electrical Installation", price: 15000 },
        { name: "Circuit Repair", price: 12000 },
        { name: "Lighting Installation", price: 8000 },
        { name: "Safety Inspection", price: 10000 },
      ],
      reviews: [
        { id: 1, user: "Thomas M.", rating: 5, date: "Oct 15, 2023", text: "Excellent service! Fixed my electrical issues quickly." },
        { id: 2, user: "Sarah K.", rating: 4, date: "Oct 10, 2023", text: "Very professional and reasonable prices." },
        { id: 3, user: "David R.", rating: 5, date: "Oct 5, 2023", text: "Great job installing new lighting fixtures." },
      ],
      contactInfo: {
        phone: "+1234567890",
        email: "info@johnselectrical.com",
        address: "123 Main Street, City"
      },
      rating: 4.8,
      reviewsCount: 234,
      startingPrice: 15000,
      imageUrl: require('../../assets/images/top_rated/Electrical.png'),
      onlineStatus: "online",
      type: "company",
      teamSize: "5 technicians",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableHours: "8:00 AM - 6:00 PM",
      certificates: ["Licensed Electrician", "Certified by National Electric Association"]
    },
    {
      id: '2',
      name: "Robert Smith",
      specialty: "Electrical Repairs",
      description: "Expert in electrical repairs and troubleshooting. Fast and reliable service.",
      longDescription: "Robert Smith has been working as an independent electrician for over 5 years, specializing in quick repairs and emergency services. He prides himself on being available when you need him most and finding cost-effective solutions to electrical problems.",
      transactions: {
        total: 72,
        last30Days: 13,
        successRate: 95.6,
        successful: 69,
        unsuccessful: 3
      },
      services: [
        { name: "Emergency Repairs", price: 15000 },
        { name: "Troubleshooting", price: 10000 },
        { name: "Switch/Outlet Replacement", price: 7000 },
      ],
      reviews: [
        { id: 1, user: "Jason B.", rating: 5, date: "Oct 12, 2023", text: "Came on short notice and fixed the problem quickly." },
        { id: 2, user: "Michelle P.", rating: 3, date: "Oct 3, 2023", text: "Good work but arrived a bit late." },
      ],
      contactInfo: {
        phone: "+1234567891",
        email: "robertsmith@email.com",
        address: "456 Oak Avenue, City"
      },
      rating: 4.7,
      reviewsCount: 188,
      startingPrice: 12000,
      imageUrl: require('../../assets/images/top_rated/Electrical.png'),
      onlineStatus: "offline",
      type: "individual",
      availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
      availableHours: "9:00 AM - 7:00 PM",
      certificates: ["Certified Electrical Technician"]
    },
    {
      id: 'beautician_1',
      name: "Beauty Plus",
      specialty: "Hair Styling & Makeup",
      description: "Professional hair styling and makeup services for all occasions.",
      longDescription: "Professional hair styling and makeup services for all occasions. Our team of stylists brings the latest trends to you with years of experience in the beauty industry.",
      transactions: {
        total: 245,
        last30Days: 36,
        successRate: 99.2,
        successful: 242,
        unsuccessful: 3
      },
      rating: 4.9,
      reviewsCount: 312,
      startingPrice: 18000,
      imageUrl: require('../../assets/images/offers/1.png'),
      onlineStatus: "online",
      type: "company",
      contactInfo: {
        phone: "+237 6XX XXX XXX",
        email: "info@beautyplus.com",
        address: "Beauty District, Douala"
      },
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      availableHours: "8:00 AM - 6:00 PM",
      certificates: ["Certified Hair Stylist", "Professional Makeup Artist"],
      services: [
        { name: "Hair Styling", price: 18000 },
        { name: "Makeup Application", price: 25000 },
        { name: "Bridal Package", price: 45000 }
      ],
      reviews: [
        {
          id: 1,
          user: "Marie K.",
          rating: 5,
          text: "Amazing service! The hair styling was perfect for my wedding.",
          date: "2 weeks ago"
        },
        {
          id: 2,
          user: "Sophie L.",
          rating: 5,
          text: "Professional makeup artist. Highly recommend!",
          date: "1 month ago"
        }
      ]
    },
    {
      id: 'beautician_2',
      name: "Glamour Studio",
      specialty: "Nail Art & Care",
      description: "Specialized nail services including manicures, pedicures, gel, and creative nail art designs.",
      longDescription: "Specialized nail services including manicures, pedicures, gel, and creative nail art designs with top quality products and experienced technicians.",
      transactions: {
        total: 167,
        last30Days: 22,
        successRate: 98.1,
        successful: 164,
        unsuccessful: 3
      },
      rating: 4.8,
      reviewsCount: 245,
      startingPrice: 15000,
      imageUrl: require('../../assets/images/offers/1.png'),
      onlineStatus: "offline",
      type: "company",
      contactInfo: {
        phone: "+237 6XX XXX XXX",
        email: "contact@glamourstudio.com",
        address: "Fashion Street, Yaoundé"
      },
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      availableHours: "9:00 AM - 7:00 PM",
      certificates: ["Certified Nail Technician", "Gel Application Specialist"],
      services: [
        { name: "Manicure", price: 15000 },
        { name: "Pedicure", price: 18000 },
        { name: "Nail Art", price: 25000 }
      ],
      reviews: [
        {
          id: 3,
          user: "Grace M.",
          rating: 5,
          text: "Beautiful nail art! Very creative and professional.",
          date: "1 week ago"
        }
      ]
    },
    // Add providers from any category - plumbers, mechanics, cleaners, etc.
    {
      id: 'plumber_1',
      name: "Quick Fix Plumbing",
      specialty: "Emergency Plumbing",
      description: "24/7 emergency plumbing services for residential and commercial properties.",
      longDescription: "Professional plumbing services available around the clock. We handle everything from minor leaks to major pipe installations with experienced, licensed plumbers.",
      transactions: {
        total: 134,
        last30Days: 18,
        successRate: 97.8,
        successful: 131,
        unsuccessful: 3
      },
      rating: 4.6,
      reviewsCount: 156,
      startingPrice: 12000,
      imageUrl: require('../../assets/images/top_rated/Electrical.png'), // You can use a generic or plumber image
      onlineStatus: "online",
      type: "company",
      contactInfo: {
        phone: "+237 6XX XXX XXX",
        email: "info@quickfixplumbing.com",
        address: "Downtown District, Douala"
      },
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      availableHours: "24/7 Available",
      certificates: ["Licensed Plumber", "Emergency Service Certified"],
      services: [
        { name: "Pipe Repair", price: 12000 },
        { name: "Drain Cleaning", price: 15000 },
        { name: "Toilet Installation", price: 25000 }
      ],
      reviews: [
        {
          id: 4,
          user: "Paul T.",
          rating: 5,
          text: "Fixed my emergency leak at midnight. Great service!",
          date: "3 days ago"
        }
      ]
    }
  ];
  
  return providers.find(p => p.id === id);
};

// Get badge info based on transaction count
const getBadgeInfo = (transactions: number): BadgeInfo => {
  if (transactions >= 200) {
    return { 
      icon: "medal" as const, // Type assertion for MaterialCommunityIcons
      color: '#FFD700', 
      size: 16, 
      label: "Gold" 
    };
  }
  if (transactions >= 100) {
    return { 
      icon: "medal" as const,
      color: '#C0C0C0', 
      size: 16, 
      label: "Silver" 
    };
  }
  if (transactions >= 50) {
    return { 
      icon: "medal" as const,
      color: '#CD7F32', 
      size: 16, 
      label: "Bronze" 
    };
  }
  return { icon: null, color: null, size: null, label: null };
};

export default function ProviderProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [provider, setProvider] = useState<Provider | null>(null);
  
  useEffect(() => {
    // Check if id is valid before fetching
    if (!id) {
      console.error("Provider ID is missing");
      router.replace('/'); // Generic fallback instead of specific category
      return;
    }
    
    try {
      const data = getProviderData(id);
      if (!data) {
        console.error(`No provider found with ID: ${id}`);
        router.replace('/'); // Generic fallback instead of specific category
        return;
      }
      setProvider(data);
    } catch (error) {
      console.error("Error fetching provider data:", error);
      router.replace('/'); // Generic fallback instead of specific category
    }
  }, [id, router]);
  
  // Show loading state if provider data isn't loaded yet
  if (!provider) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const badgeInfo = getBadgeInfo(provider.transactions.total);
  
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary-500 pt-12 pb-4 px-5">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white/20 p-2 rounded-full mr-4"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Provider Profile</Text>
        </View>
      </View>
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Provider Profile Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm overflow-hidden">
          {/* Top section with banner & image */}
          <View className="h-24 bg-gray-200" />
          <View className="px-4 pb-4 -mt-12">
            <View className="flex-row">
              {/* Profile Image */}
              <View className="relative">
                <Image 
                  source={provider.imageUrl}
                  className="w-20 h-20 rounded-full border-4 border-white"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
                <View className={`absolute bottom-0 right-0 rounded-full p-1 ${provider.type === 'company' ? 'bg-blue-500' : 'bg-green-500'}`}>
                  <MaterialIcons 
                    name={provider.type === 'company' ? 'business' : 'person'} 
                    size={12} 
                    color="white" 
                  />
                </View>
              </View>
              
              {/* Basic Info */}
              <View className="ml-3 flex-1 mt-12">
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-bold text-xl mr-2">{provider.name}</Text>
                  {badgeInfo.icon && (
                    <MaterialCommunityIcons 
                      name={badgeInfo.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={badgeInfo.size || 16} 
                      color={badgeInfo.color || '#000'} 
                    />
                  )}
                </View>
                <Text className="text-gray-600">{provider.specialty}</Text>
              </View>
            </View>
            
            {/* Rating & Reviews Summary */}
            <View className="flex-row items-center mt-3">
              <View className="flex-row items-center">
                <FontAwesome5 name="star" solid size={14} color="#FFD700" />
                <Text className="ml-1 text-base font-medium">{provider.rating}</Text>
                <Text className="text-gray-500 ml-1">({provider.reviewsCount} reviews)</Text>
              </View>
              
              {/* Online Status */}
              <View className="ml-auto flex-row items-center">
                {provider.onlineStatus === "online" ? (
                  <>
                    <View className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1.5"></View>
                    <Text className="text-gray-700 text-sm">Online now</Text>
                  </>
                ) : (
                  <>
                    <Feather name="clock" size={14} color="#6B7280" className="mr-1" />
                    <Text className="text-gray-600 text-sm">Last seen 2h ago</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          
          {/* Navigation Tabs */}
          <View className="flex-row bg-white border-t border-gray-100">
            <TouchableOpacity 
              onPress={() => setActiveTab('about')}
              className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'about' ? 'border-primary-500' : 'border-transparent'}`}
            >
              <Text className={`${activeTab === 'about' ? 'text-primary-500 font-semibold' : 'text-gray-600'}`}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('services')}
              className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'services' ? 'border-primary-500' : 'border-transparent'}`}
            >
              <Text className={`${activeTab === 'services' ? 'text-primary-500 font-semibold' : 'text-gray-600'}`}>Services</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('reviews')}
              className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'reviews' ? 'border-primary-500' : 'border-transparent'}`}
            >
              <Text className={`${activeTab === 'reviews' ? 'text-primary-500 font-semibold' : 'text-gray-600'}`}>Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Content based on active tab */}
        {activeTab === 'about' && (
          <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
            {/* Description */}
            <Text className="text-gray-800 text-base mb-4">{provider.longDescription}</Text>
            
            {/* Binance-style Transaction Statistics */}
            <Text className="text-gray-900 font-semibold text-lg mb-2">Transaction History</Text>
            <View className="bg-gray-50 rounded-lg p-4 mb-4">
              <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <View className="items-center flex-1">
                  <Text className="text-gray-500 text-xs mb-1">Total Completed</Text>
                  <Text className="text-gray-800 font-bold text-xl">{provider.transactions.total}</Text>
                </View>
                <View className="items-center flex-1 border-l border-r border-gray-200">
                  <Text className="text-gray-500 text-xs mb-1">Success Rate</Text>
                  <Text className="text-green-600 font-bold text-xl">{provider.transactions.successRate}%</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-gray-500 text-xs mb-1">Last 30 Days</Text>
                  <Text className="text-gray-800 font-bold text-xl">{provider.transactions.last30Days}</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <View className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></View>
                  <Text className="text-gray-700">Successful: {provider.transactions.successful}</Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="h-3 w-3 rounded-full bg-red-500 mr-1.5"></View>
                  <Text className="text-gray-700">Cancelled: {provider.transactions.unsuccessful}</Text>
                </View>
              </View>
            </View>
            
            {/* Contact Information */}
            <Text className="text-gray-900 font-semibold text-lg mb-2">Contact Information</Text>
            <View className="bg-gray-50 rounded-lg p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="call-outline" size={16} color="#4B5563" />
                <Text className="ml-2 text-gray-800">{provider.contactInfo.phone}</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="mail-outline" size={16} color="#4B5563" />
                <Text className="ml-2 text-gray-800">{provider.contactInfo.email}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#4B5563" />
                <Text className="ml-2 text-gray-800">{provider.contactInfo.address}</Text>
              </View>
            </View>
            
            {/* Availability */}
            <Text className="text-gray-900 font-semibold text-lg mb-2">Availability</Text>
            <View className="bg-gray-50 rounded-lg p-4 mb-4">
              <View className="mb-2">
                <Text className="text-gray-500 mb-1">Days:</Text>
                <Text className="text-gray-800">{provider.availableDays.join(', ')}</Text>
              </View>
              <View>
                <Text className="text-gray-500 mb-1">Hours:</Text>
                <Text className="text-gray-800">{provider.availableHours}</Text>
              </View>
            </View>
            
            {/* Certifications */}
            <Text className="text-gray-900 font-semibold text-lg mb-2">Certifications</Text>
            <View className="bg-gray-50 rounded-lg p-4">
              {provider.certificates.map((cert: string, index: number) => (
                <View key={index} className="flex-row items-center mb-1">
                  <AntDesign name="checkcircle" size={14} color="#2563eb" />
                  <Text className="ml-2 text-gray-800">{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {activeTab === 'services' && (
          <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
            <Text className="text-gray-900 font-semibold text-lg mb-3">Services Offered</Text>
            {provider.services.map((service: Service, index: number) => (
              <View 
                key={index} 
                className={`flex-row justify-between items-center p-3 ${
                  index < provider.services.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <Text className="text-gray-800">{service.name}</Text>
                <Text className="text-primary-500 font-bold">{service.price} CFA</Text>
              </View>
            ))}
            
            <TouchableOpacity className="bg-primary-500 rounded-lg py-3.5 mt-5 items-center">
              <Text className="text-white font-semibold">Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {activeTab === 'reviews' && (
          <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-900 font-semibold text-lg">Reviews</Text>
              <Text className="text-gray-500">{provider.reviewsCount} total</Text>
            </View>
            
            {provider.reviews.map((review: Review) => (
              <View key={review.id} className="mb-4 pb-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-medium text-gray-800">{review.user}</Text>
                  <Text className="text-gray-500 text-xs">{review.date}</Text>
                </View>
                
                <View className="flex-row mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome5 
                      key={star}
                      name="star" 
                      solid={star <= review.rating}
                      size={12} 
                      color={star <= review.rating ? "#FFD700" : "#E5E7EB"} 
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
                
                <Text className="text-gray-600">{review.text}</Text>
              </View>
            ))}
            
            <TouchableOpacity className="flex-row items-center justify-center mt-2 py-3">
              <Text className="text-primary-500 font-medium mr-1">See all reviews</Text>
              <AntDesign name="right" size={12} color="#2563eb" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Fixed Contact Button */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity className="bg-primary-500 rounded-lg py-3.5 items-center">
          <Text className="text-white font-semibold">Contact Provider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
