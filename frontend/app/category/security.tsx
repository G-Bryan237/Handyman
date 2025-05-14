import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons, AntDesign, Feather, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

const SecurityPage = () => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('recommended');
  const [filterView, setFilterView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBadgeInfo, setActiveBadgeInfo] = useState<string | null>(null);
  
  // Provider data for security
  const providers = [
    {
      id: '1',
      name: "SecureTech Solutions",
      specialty: "Home Security Systems",
      description: "Professional installation and monitoring of home security systems with cameras, alarms, and smart integration.",
      transactions: {
        total: 256,
        last30Days: 31,
        successRate: 99.5
      },
      reviews: 287,
      startingPrice: 28000,
      imageUrl: require('../../assets/images/security/sec1.jpg'),
      onlineStatus: "online",
      type: "company",
      teamSize: "9 technicians"
    },
    {
      id: '2',
      name: "SafeGuard Installations",
      specialty: "Alarm Systems",
      description: "Security alarm system installation, maintenance and monitoring for residential and commercial properties.",
      transactions: {
        total: 189,
        last30Days: 24,
        successRate: 98.8
      },
      reviews: 205,
      startingPrice: 20000,
      imageUrl: require('../../assets/images/security/sec2.jpg'),
      onlineStatus: "online",
      type: "company",
      teamSize: "7 specialists"
    },
    {
      id: '3',
      name: "Access Control Pros",
      specialty: "Access Control Systems",
      description: "Advanced access control solutions for businesses with keycard, biometric, and smartphone entry options.",
      transactions: {
        total: 142,
        last30Days: 18,
        successRate: 98.2
      },
      reviews: 164,
      startingPrice: 35000,
      imageUrl: require('../../assets/images/security/sec3.jpg'),
      onlineStatus: "offline",
      type: "company",
      teamSize: "6 technicians"
    },
    {
      id: '4',
      name: "Robert Johnson",
      specialty: "Security Camera Installation",
      description: "Specialized in CCTV and security camera installation for homes and small businesses with remote monitoring.",
      transactions: {
        total: 87,
        last30Days: 12,
        successRate: 97.5
      },
      reviews: 102,
      startingPrice: 15000,
      imageUrl: require('../../assets/images/security/sec4.jpg'),
      onlineStatus: "online",
      type: "individual"
    },
  ];

  // Badge info based on transaction count
  const getBadgeInfo = (transactions: number) => {
    if (transactions >= 200) {
      return { 
        icon: "medal" as const,
        color: '#FFD700', 
        size: 16,
        label: "Gold",
        info: `This provider has completed 200+ successful trades`
      };
    }
    if (transactions >= 100) {
      return { 
        icon: "medal" as const,
        color: '#C0C0C0', 
        size: 16,
        label: "Silver",
        info: `This provider has completed 100+ successful trades`
      };
    }
    if (transactions >= 50) {
      return { 
        icon: "medal" as const,
        color: '#cd7f32', 
        size: 16,
        label: "Bronze",
        info: `This provider has completed 50+ successful trades`
      };
    }
    return { icon: null, color: null, size: null, label: null, info: null };
  };

  const toggleBadgeInfo = (providerId: string) => {
    setActiveBadgeInfo(prev => prev === providerId ? null : providerId);
  };

  // Filter and sort providers
  const getFilteredProviders = () => {
    return providers
      .filter(provider => {
        if (filterView === 'all') return true;
        return provider.type === filterView;
      })
      .sort((a, b) => {
        if (sortOption === 'recommended') return b.reviews - a.reviews;
        if (sortOption === 'priceLowToHigh') return a.startingPrice - b.startingPrice;
        if (sortOption === 'priceHighToLow') return b.startingPrice - a.startingPrice;
        return 0;
      })
      .filter(provider => {
        return provider.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
  };

  const filteredProviders = getFilteredProviders();

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
          <Text className="text-white text-xl font-bold">Security</Text>
        </View>
        
        {/* Search Bar */}
        <View className="relative">
          <TextInput
            placeholder="Search providers..."
            placeholderTextColor="#9CA3AF"
            className="bg-white rounded-full py-3 px-4 pr-10 shadow-sm"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <Feather 
            name="search" 
            size={20} 
            color="#6B7280" 
            className="absolute left-3 top-3"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row bg-white shadow-sm">
        <TouchableOpacity 
          onPress={() => setFilterView('all')}
          className={`flex-1 py-3 text-center ${filterView === 'all' ? 'bg-primary-500' : ''}`}
        >
          <Text className={`text-sm font-medium ${filterView === 'all' ? 'text-white' : 'text-gray-700'}`}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFilterView('company')}
          className={`flex-1 py-3 text-center ${filterView === 'company' ? 'bg-primary-500' : ''}`}
        >
          <Text className={`text-sm font-medium ${filterView === 'company' ? 'text-white' : 'text-gray-700'}`}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFilterView('individual')}
          className={`flex-1 py-3 text-center ${filterView === 'individual' ? 'bg-primary-500' : ''}`}
        >
          <Text className={`text-sm font-medium ${filterView === 'individual' ? 'text-white' : 'text-gray-700'}`}>Individuals</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Sort options in horizontal scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3 bg-white mb-2"
        >
          <TouchableOpacity 
            onPress={() => setSortOption('recommended')}
            className={`py-2 px-4 rounded-full mr-2 ${sortOption === 'recommended' ? 'bg-primary-500' : 'bg-gray-100'}`}
          >
            <Text className={`text-sm font-medium ${sortOption === 'recommended' ? 'text-white' : 'text-gray-700'}`}>Recommended</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSortOption('priceLowToHigh')}
            className={`py-2 px-4 rounded-full mr-2 ${sortOption === 'priceLowToHigh' ? 'bg-primary-500' : 'bg-gray-100'}`}
          >
            <Text className={`text-sm font-medium ${sortOption === 'priceLowToHigh' ? 'text-white' : 'text-gray-700'}`}>Price: Low to High</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSortOption('priceHighToLow')}
            className={`py-2 px-4 rounded-full ${sortOption === 'priceHighToLow' ? 'bg-primary-500' : 'bg-gray-100'}`}
          >
            <Text className={`text-sm font-medium ${sortOption === 'priceHighToLow' ? 'text-white' : 'text-gray-700'}`}>Price: High to Low</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Category Info */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center mb-2">
            <View className="bg-[#dc2626] rounded-full p-2 mr-2">
              <MaterialIcons name="security" size={20} color="white" />
            </View>
            <Text className="text-gray-800 text-lg font-semibold">Find security experts near you</Text>
          </View>
          <Text className="text-gray-600 text-sm">
            Security systems, surveillance cameras, alarms and access control solutions
          </Text>
        </View>
        
        {/* Providers Count */}
        <View className="px-4 py-2">
          <Text className="text-gray-600 text-sm">{filteredProviders.length} service providers found</Text>
        </View>

        {/* Provider Cards */}
        <View className="px-4">
          {filteredProviders.map((provider) => {
            const badgeInfo = getBadgeInfo(provider.transactions.total);
            const isInfoActive = activeBadgeInfo === provider.id;
            
            return (
              <View 
                key={provider.id}
                className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
              >
                {/* Top section with image and name */}
                <View className="p-4 flex-row">
                  {/* Profile Image & Type */}
                  <View className="mr-4 relative">
                    <Image 
                      source={provider.imageUrl}
                      className="w-16 h-16 rounded-full"
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
                  
                  {/* Provider name and info */}
                  <View className="flex-1 justify-center">
                    <Text className="text-gray-800 text-lg font-semibold">{provider.name}</Text>
                    <Text className="text-gray-500 text-sm">{provider.specialty}</Text>
                  </View>
                </View>
                
                {/* Badge Info tooltip/popup */}
                {isInfoActive && badgeInfo.info && (
                  <View className="mx-4 mb-3 p-3.5 bg-gray-50 rounded-lg border shadow-sm" 
                    style={{ borderColor: badgeInfo.color, borderWidth: 1 }}
                  >
                    <View className="flex-row items-center mb-2">
                      <MaterialCommunityIcons name={badgeInfo.icon} size={badgeInfo.size} color={badgeInfo.color} className="mr-2" />
                      <Text className="text-sm font-medium" style={{ color: badgeInfo.color }}>{badgeInfo.label}</Text>
                    </View>
                    <Text className="text-gray-600 text-sm">{badgeInfo.info}</Text>
                  </View>
                )}
                
                {/* Middle section */}
                <View className="px-4 pb-3">
                  {/* Transaction stats */}
                  <View className="flex-row items-center mt-1 mb-2 bg-gray-50 rounded-lg p-2">
                    <View className="flex-1">
                      <Text className="text-gray-700 text-xs">Total Transactions</Text>
                      <Text className="text-gray-800 font-semibold">{provider.transactions.total}</Text>
                    </View>
                    <View className="flex-1 border-l border-gray-200">
                      <Text className="text-gray-700 text-xs text-center">Last 30 Days</Text>
                      <Text className="text-gray-800 font-semibold text-center">{provider.transactions.last30Days}</Text>
                    </View>
                    <View className="flex-1 border-l border-gray-200">
                      <Text className="text-gray-700 text-xs text-center">Success Rate</Text>
                      <Text className="text-gray-800 font-semibold text-center">{provider.transactions.successRate}%</Text>
                    </View>
                  </View>
                  
                  {/* Description */}
                  <Text numberOfLines={2} className="text-gray-600 text-sm mb-3">
                    {provider.description || provider.specialty}
                  </Text>
                </View>
                
                {/* Bottom section - online status and view profile button */}
                <View className="border-t border-gray-100 px-4 py-3 flex-row justify-between items-center">
                  {/* Online status indicator */}
                  {provider.onlineStatus === "online" ? (
                    <View className="flex-row items-center">
                      <View className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></View>
                      <Text className="text-gray-700 text-sm">Online now</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center">
                      <Feather name="clock" size={14} color="#6B7280" className="mr-1" />
                      <Text className="text-gray-600 text-sm">Last seen 2h ago</Text>
                    </View>
                  )}
                  
                  {/* See profile button */}
                  <TouchableOpacity 
                    className="bg-primary-500 rounded-lg px-4 py-2 shadow-sm"
                    onPress={() => {
                      if (provider.id) {
                        console.log(`Navigating to provider profile: ${provider.id}`);
                        router.push({
                          pathname: `/provider/${provider.id}`,
                        });
                      } else {
                        console.error("Provider ID is missing");
                      }
                    }}
                  >
                    <Text className="text-white font-medium text-sm">See Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          
          {/* Empty state */}
          {filteredProviders.length === 0 && (
            <View className="py-12 items-center">
              <Feather name="search" size={48} color="#d1d5db" />
              <Text className="text-gray-400 mt-4 text-base">No providers found</Text>
              <Text className="text-gray-400 text-sm">Try adjusting your filters</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SecurityPage;