import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons, AntDesign, Feather, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

const LandscapersPage = () => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('recommended');
  const [filterView, setFilterView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBadgeInfo, setActiveBadgeInfo] = useState<string | null>(null);
  
  // Provider data for landscapers
  const providers = [
    {
      id: '1',
      name: "Green Gardens Co.",
      specialty: "Garden Design & Maintenance",
      description: "Full-service landscaping with garden design, planting, lawn care, and seasonal maintenance for residential properties.",
      transactions: {
        total: 246,
        last30Days: 35,
        successRate: 99.2
      },
      reviews: 278,
      startingPrice: 20000,
      imageUrl: require('../../assets/images/landscapers/landscaper1.jpg'),
      onlineStatus: "online",
      type: "company",
      teamSize: "12 landscapers"
    },
    {
      id: '2',
      name: "Urban Landscape Design",
      specialty: "Modern Landscaping",
      description: "Contemporary landscape design for urban spaces, rooftop gardens, and small yards with sustainable practices.",
      transactions: {
        total: 152,
        last30Days: 24,
        successRate: 98.7
      },
      reviews: 187,
      startingPrice: 30000,
      imageUrl: require('../../assets/images/landscapers/landscaper2.jpg'),
      onlineStatus: "online",
      type: "company",
      teamSize: "8 designers"
    },
    {
      id: '3',
      name: "James Gardening",
      specialty: "Lawn Care & Maintenance",
      description: "Specializing in lawn care services including mowing, fertilization, weed control, and seasonal cleanup.",
      transactions: {
        total: 96,
        last30Days: 18,
        successRate: 97.4
      },
      reviews: 114,
      startingPrice: 12000,
      imageUrl: require('../../assets/images/landscapers/landscaper3.jpg'),
      onlineStatus: "offline",
      type: "individual"
    },
    {
      id: '4',
      name: "Irrigation Experts",
      specialty: "Irrigation Systems",
      description: "Professional irrigation system installation, repair and maintenance for gardens, lawns and agricultural lands.",
      transactions: {
        total: 178,
        last30Days: 22,
        successRate: 98.3
      },
      reviews: 195,
      startingPrice: 25000,
      imageUrl: require('../../assets/images/landscapers/landscaper3.jpg'),
      onlineStatus: "online",
      type: "company",
      teamSize: "7 technicians"
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
        info: `This provider has completed 100+ successful trades `
      };
    }
    if (transactions >= 50) {
      return { 
        icon: "medal" as const,
        color: '#CD7F32', 
        size: 16,
        label: "Bronze",
        info: `This provider has completed 50+ successful trades`
      };
    }
    return { icon: null, color: null, size: null, label: null, info: null };
  };

  const toggleBadgeInfo = (providerId: string) => {
    if (activeBadgeInfo === providerId) {
      setActiveBadgeInfo(null);
    } else {
      setActiveBadgeInfo(providerId);
    }
  };

  // Filter and sort providers
  const getFilteredProviders = () => {
    let filtered = providers;
    
    // Filter by type
    if (filterView === 'companies') {
      filtered = filtered.filter(p => p.type === 'company');
    } else if (filterView === 'individuals') {
      filtered = filtered.filter(p => p.type === 'individual');
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.specialty.toLowerCase().includes(query)
      );
    }
    
    // Sort after filtering
    switch (sortOption) {
      case 'price-low-high':
        return filtered.sort((a, b) => a.startingPrice - b.startingPrice);
      case 'price-high-low':
        return filtered.sort((a, b) => b.startingPrice - a.startingPrice);
      case 'rating':
        return filtered.sort((a, b) => b.transactions.successRate - a.transactions.successRate);
      default:
        return filtered;
    }
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
          <Text className="text-white text-xl font-bold">Landscapers</Text>
        </View>
        
        {/* Search Bar */}
        <View className="relative">
          <TextInput
            className="bg-white h-12 rounded-lg pl-10 pr-4 text-base"
            placeholder="Search by name or service"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather 
            name="search" 
            size={20} 
            color="#9ca3af" 
            style={{ position: 'absolute', left: 12, top: 14 }}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row bg-white shadow-sm">
        <TouchableOpacity 
          onPress={() => setFilterView('all')}
          className={`flex-1 py-3 items-center border-b-2 ${filterView === 'all' ? 'border-primary-500' : 'border-transparent'}`}
        >
          <Text className={`${filterView === 'all' ? 'text-primary-500 font-semibold' : 'text-gray-600'}`}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFilterView('companies')}
          className={`flex-1 py-3 items-center border-b-2 ${filterView === 'companies' ? 'border-primary-500' : 'border-transparent'}`}
        >
          <Text className={`${filterView === 'companies' ? 'text-primary-500 font-semibold' : 'text-gray-600'}`}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFilterView('individuals')}
          className={`flex-1 py-3 items-center border-b-2 ${filterView === 'individuals' ? 'border-primary-500' : 'border-transparent'}`}
        >
          <Text className={`${filterView === 'individuals' ? 'text-primary-500 font-semibold' : 'text-gray-600'}`}>Individuals</Text>
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
            className={`rounded-full py-1.5 px-4 mr-2 border ${sortOption === 'recommended' ? 'bg-primary-50 border-primary-500' : 'border-gray-300'}`}
            onPress={() => setSortOption('recommended')}
          >
            <Text className={`text-sm ${sortOption === 'recommended' ? 'text-primary-500 font-medium' : 'text-gray-600'}`}>
              Recommended
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`rounded-full py-1.5 px-4 mr-2 border ${sortOption === 'rating' ? 'bg-primary-50 border-primary-500' : 'border-gray-300'}`}
            onPress={() => setSortOption('rating')}
          >
            <Text className={`text-sm ${sortOption === 'rating' ? 'text-primary-500 font-medium' : 'text-gray-600'}`}>
              Highest Rated
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`rounded-full py-1.5 px-4 mr-2 border ${sortOption === 'price-low-high' ? 'bg-primary-50 border-primary-500' : 'border-gray-300'}`}
            onPress={() => setSortOption('price-low-high')}
          >
            <Text className={`text-sm ${sortOption === 'price-low-high' ? 'text-primary-500 font-medium' : 'text-gray-600'}`}>
              Price: Low to High
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`rounded-full py-1.5 px-4 mr-2 border ${sortOption === 'price-high-low' ? 'bg-primary-50 border-primary-500' : 'border-gray-300'}`}
            onPress={() => setSortOption('price-high-low')}
          >
            <Text className={`text-sm ${sortOption === 'price-high-low' ? 'text-primary-500 font-medium' : 'text-gray-600'}`}>
              Price: High to Low
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Category Info */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center mb-2">
            <View className="bg-[#16a34a] rounded-full p-2 mr-2">
              <MaterialCommunityIcons name="tree" size={20} color="white" />
            </View>
            <Text className="text-gray-800 text-lg font-semibold">Find landscapers near you</Text>
          </View>
          <Text className="text-gray-600 text-sm">
            Professional landscape design, garden maintenance and lawn care services
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
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text className="text-gray-900 font-bold text-lg">{provider.name}</Text>
                        
                        {/* Badge moved next to name with tap interaction */}
                        {badgeInfo.icon && (
                          <TouchableOpacity 
                            onPress={() => toggleBadgeInfo(provider.id)}
                            className="ml-2"
                          >
                            <MaterialCommunityIcons 
                              name={badgeInfo.icon} 
                              size={badgeInfo.size} 
                              color={badgeInfo.color} 
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      {/* Price moved to right side */}
                      <View>
                        <Text className="text-primary-500 font-bold text-lg text-right">
                          {provider.startingPrice} CFA
                        </Text>
                        <Text className="text-gray-500 text-xs text-right">Starting price</Text>
                      </View>
                    </View>
                    
                    {/* Reviews count and specialty */}
                    <View className="flex-row items-center mt-1">
                      <FontAwesome5 name="comment" size={12} color="#4B5563" />
                      <Text className="ml-1 text-gray-600 text-xs mr-3">{provider.reviews} reviews</Text>
                      <Text className="text-gray-600 text-sm">{provider.specialty}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Badge Info tooltip/popup */}
                {isInfoActive && badgeInfo.info && (
                  <View className="mx-4 mb-3 p-3.5 bg-gray-50 rounded-lg border shadow-sm" 
                    style={{ borderColor: badgeInfo.color, borderWidth: 1 }}
                  >
                    <View className="flex-row items-start">
                      <MaterialCommunityIcons 
                        name="trophy-award" 
                        size={20} 
                        color={badgeInfo.color} 
                        style={{ marginRight: 10, marginTop: 1 }}
                      />
                      <Text className="text-gray-700 text-sm flex-1">
                        <Text className="font-bold" style={{ color: badgeInfo.color }}>{badgeInfo.label} Provider:</Text>
                        {' '}{badgeInfo.info}
                      </Text>
                      
                      <TouchableOpacity 
                        onPress={() => setActiveBadgeInfo(null)}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      >
                        <AntDesign name="close" size={18} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                
                {/* Middle section */}
                <View className="px-4 pb-3">
                  {/* Transaction stats */}
                  <View className="flex-row items-center mt-1 mb-2 bg-gray-50 rounded-lg p-2">
                    <View className="flex-1 flex-row items-center">
                      <Entypo name="bar-graph" size={12} color="#4B5563" />
                      <Text className="ml-1 text-xs text-gray-800">
                        {provider.transactions.last30Days} jobs (30d)
                      </Text>
                    </View>
                    
                    <Text className="text-gray-500 text-xs mx-2">•</Text>
                    
                    <View className="flex-1 flex-row items-center">
                      <AntDesign name="check" size={12} color="#4B5563" />
                      <Text className="ml-1 text-xs text-gray-800">
                        {provider.transactions.successRate}% success
                      </Text>
                    </View>
                    
                    <View className="bg-gray-100 px-2 py-1 rounded">
                      <Text className="text-gray-700 text-xs">
                        {provider.transactions.total}+ completed
                      </Text>
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

export default LandscapersPage;
