import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Mock earnings data - would be replaced by API data
const MOCK_EARNINGS_DATA = {
  currentBalance: 125000,
  totalEarnings: 750000,
  pendingPayouts: 45000,
  weeklyData: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [15000, 25000, 12000, 30000, 18000, 27000, 22000],
      }
    ]
  },
  monthlyData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [85000, 120000, 90000, 105000, 130000, 95000],
      }
    ]
  },
  recentTransactions: [
    { 
      id: '1',
      client: 'John Smith',
      amount: 15000,
      date: '2023-11-10T15:30:00Z',
      service: 'Electrical Repair',
      status: 'completed'
    },
    { 
      id: '2',
      client: 'Sarah Johnson',
      amount: 8000,
      date: '2023-11-09T11:00:00Z',
      service: 'Light Fixture Installation',
      status: 'completed'
    },
    { 
      id: '3',
      client: 'Michael Brown',
      amount: 12000,
      date: '2023-11-07T14:45:00Z',
      service: 'Circuit Repair',
      status: 'completed'
    },
    { 
      id: '4',
      client: 'Emma Wilson',
      amount: 7500,
      date: '2023-11-05T10:15:00Z',
      service: 'Outlet Installation',
      status: 'completed'
    }
  ]
};

// Time period type
type TimePeriod = 'weekly' | 'monthly';

export default function EarningsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<any>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
  
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        // In a real app, this would be an API call:
        // const response = await apiService.getProviderEarnings();
        // setEarningsData(response.data);
        
        // For now, use mock data
        setEarningsData(MOCK_EARNINGS_DATA);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEarnings();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Chart config
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: () => `rgba(37, 99, 235, 1)`,
    labelColor: () => `rgba(107, 114, 128, 1)`,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#2563eb'
    },
    propsForLabels: {
      fontSize: 12,
    }
  };
  
  // Render transaction item
  const renderTransaction = ({ item }: any) => (
    <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-3 shadow-sm">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
          <FontAwesome5 name="money-bill-wave" size={16} color="#2563eb" />
        </View>
        <View>
          <Text className="font-semibold text-gray-800">{item.service}</Text>
          <Text className="text-gray-500 text-xs">{formatDate(item.date)} • {item.client}</Text>
        </View>
      </View>
      
      <View className="items-end">
        <Text className="font-bold text-gray-900">{item.amount} CFA</Text>
        <View className="flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-green-500 mr-1" />
          <Text className="text-green-600 text-xs">Paid</Text>
        </View>
      </View>
    </View>
  );
  
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-primary-500 pt-14 pb-4 px-5">
        <Text className="text-white text-2xl font-bold">Earnings</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View className="m-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <View className="p-4 bg-primary-500">
            <Text className="text-white text-sm">Available Balance</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              {earningsData.currentBalance} CFA
            </Text>
          </View>
          
          <View className="p-4 flex-row">
            <View className="flex-1 border-r border-gray-200">
              <Text className="text-gray-500 text-xs">Total Earnings</Text>
              <Text className="font-semibold text-gray-800 mt-1">
                {earningsData.totalEarnings} CFA
              </Text>
            </View>
            
            <View className="flex-1 pl-4">
              <Text className="text-gray-500 text-xs">Pending</Text>
              <Text className="font-semibold text-gray-800 mt-1">
                {earningsData.pendingPayouts} CFA
              </Text>
            </View>
          </View>
          
          <TouchableOpacity className="bg-gray-100 py-3 items-center">
            <Text className="text-primary-600 font-semibold">Withdraw Funds</Text>
          </TouchableOpacity>
        </View>
        
        {/* Earnings Chart */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-sm p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-800 font-semibold text-lg">Earnings Analysis</Text>
            
            <View className="flex-row bg-gray-100 rounded-lg overflow-hidden">
              <TouchableOpacity 
                className={`px-4 py-2 ${timePeriod === 'weekly' ? 'bg-primary-500' : 'bg-transparent'}`}
                onPress={() => setTimePeriod('weekly')}
              >
                <Text className={timePeriod === 'weekly' ? 'text-white' : 'text-gray-600'}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`px-4 py-2 ${timePeriod === 'monthly' ? 'bg-primary-500' : 'bg-transparent'}`}
                onPress={() => setTimePeriod('monthly')}
              >
                <Text className={timePeriod === 'monthly' ? 'text-white' : 'text-gray-600'}>Monthly</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <LineChart
            data={timePeriod === 'weekly' ? earningsData.weeklyData : earningsData.monthlyData}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
        
        {/* Recent Transactions */}
        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-800 font-semibold text-lg">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="text-primary-500 font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          
          {earningsData.recentTransactions.map((transaction: any) => (
            <View 
              key={transaction.id}
              className="bg-white p-4 rounded-lg mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                    <FontAwesome5 name="money-bill-wave" size={16} color="#2563eb" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-800">{transaction.service}</Text>
                    <Text className="text-gray-500 text-xs">{formatDate(transaction.date)} • {transaction.client}</Text>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="font-bold text-gray-900">{transaction.amount} CFA</Text>
                  <View className="flex-row items-center">
                    <View className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                    <Text className="text-green-600 text-xs">Paid</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity className="bg-white py-3 rounded-lg items-center shadow-sm mt-2">
            <Text className="text-primary-600 font-semibold">Download Earnings Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
