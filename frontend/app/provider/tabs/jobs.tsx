import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  Alert
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import apiService from '../../../utils/api';

// Job status enum
enum JobStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Job interface
interface Job {
  id: string;
  clientId: string;
  clientName: string;
  clientImage?: string;
  address: string;
  serviceType: string;
  status: JobStatus;
  scheduledAt: string;
  price: number;
  description: string;
}

// Mock job data - would be replaced by API calls
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    clientId: '101',
    clientName: 'John Smith',
    address: '123 Main St, Springfield',
    serviceType: 'Electrical Repair',
    status: JobStatus.PENDING,
    scheduledAt: '2023-11-12T15:00:00Z',
    price: 15000,
    description: 'Need help with electrical wiring in kitchen.'
  },
  {
    id: '2',
    clientId: '102',
    clientName: 'Sarah Johnson',
    address: '456 Oak Ave, Springfield',
    serviceType: 'Light Fixture Installation',
    status: JobStatus.ACCEPTED,
    scheduledAt: '2023-11-13T10:30:00Z',
    price: 8000,
    description: 'Install 3 ceiling lights in living room.'
  },
  {
    id: '3',
    clientId: '103',
    clientName: 'Michael Brown',
    address: '789 Elm St, Springfield',
    serviceType: 'Circuit Repair',
    status: JobStatus.IN_PROGRESS,
    scheduledAt: '2023-11-11T13:15:00Z',
    price: 12000,
    description: 'Fix circuit breaker that keeps tripping.'
  },
  {
    id: '4',
    clientId: '104',
    clientName: 'Emma Wilson',
    address: '321 Pine Rd, Springfield',
    serviceType: 'Outlet Installation',
    status: JobStatus.COMPLETED,
    scheduledAt: '2023-11-10T09:00:00Z',
    price: 7500,
    description: 'Install 5 new outlets in home office.'
  }
];

// Filter types
type FilterType = 'all' | JobStatus;

export default function JobsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  
  // Load jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // In a real app, this would be an API call:
        // const response = await apiService.getProviderJobs();
        // setJobs(response.data.jobs);
        
        // For now, use mock data
        setJobs(MOCK_JOBS);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        Alert.alert('Error', 'Failed to load jobs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Filter jobs based on activeFilter
  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === activeFilter);
  
  // Update job status
  const updateJobStatus = async (jobId: string, newStatus: JobStatus) => {
    try {
      setIsLoading(true);
      
      // In a real app, update via API:
      // await apiService.updateJobStatus(jobId, newStatus);
      
      // For the mock, update local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      
      Alert.alert('Success', 'Job status updated successfully');
    } catch (error) {
      console.error('Error updating job status:', error);
      Alert.alert('Error', 'Failed to update job status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get next status based on current status
  const getNextStatus = (currentStatus: JobStatus): JobStatus | null => {
    switch (currentStatus) {
      case JobStatus.PENDING:
        return JobStatus.ACCEPTED;
      case JobStatus.ACCEPTED:
        return JobStatus.IN_PROGRESS;
      case JobStatus.IN_PROGRESS:
        return JobStatus.COMPLETED;
      default:
        return null;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get color and icon for status
  const getStatusInfo = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING:
        return { color: '#FFA500', icon: 'timer', text: 'Pending' };
      case JobStatus.ACCEPTED:
        return { color: '#2563eb', icon: 'check-circle', text: 'Accepted' };
      case JobStatus.IN_PROGRESS:
        return { color: '#22C55E', icon: 'directions-run', text: 'In Progress' };
      case JobStatus.COMPLETED:
        return { color: '#10B981', icon: 'task-alt', text: 'Completed' };
      case JobStatus.CANCELLED:
        return { color: '#EF4444', icon: 'cancel', text: 'Cancelled' };
    }
  };
  
  // Render job card
  const renderJob = ({ item }: { item: Job }) => {
    const statusInfo = getStatusInfo(item.status);
    const nextStatus = getNextStatus(item.status);
    
    return (
      <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
        {/* Status badge */}
        <View className="absolute top-4 right-4 z-10">
          <View
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${statusInfo.color}20` }}
          >
            <MaterialIcons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
            <Text className="ml-1 font-medium" style={{ color: statusInfo.color }}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
        
        {/* Job header */}
        <View className="p-4 bg-gray-50 border-b border-gray-100">
          <Text className="text-lg font-bold text-gray-800">{item.serviceType}</Text>
          <Text className="text-gray-500 mt-1">{formatDate(item.scheduledAt)}</Text>
        </View>
        
        {/* Job details */}
        <View className="p-4">
          {/* Client info */}
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
              <Text className="text-gray-500 font-bold text-lg">
                {item.clientName.charAt(0)}
              </Text>
            </View>
            <View>
              <Text className="text-gray-800 font-semibold">{item.clientName}</Text>
              <Text className="text-gray-500 text-sm">{item.address}</Text>
            </View>
          </View>
          
          {/* Description */}
          <Text className="text-gray-600 mb-4">{item.description}</Text>
          
          {/* Price */}
          <View className="flex-row items-center mb-4">
            <FontAwesome5 name="money-bill-wave" size={16} color="#6B7280" />
            <Text className="ml-2 text-gray-700 font-medium">{item.price} CFA</Text>
          </View>
          
          {/* Action buttons */}
          <View className="flex-row">
            {/* Only show status update button if there's a next status */}
            {nextStatus && (
              <TouchableOpacity
                onPress={() => updateJobStatus(item.id, nextStatus)}
                className="bg-primary-500 rounded-lg py-3 flex-1 mr-2"
              >
                <Text className="text-white font-bold text-center">
                  {nextStatus === JobStatus.ACCEPTED ? 'Accept Job' : 
                   nextStatus === JobStatus.IN_PROGRESS ? 'Start Job' : 
                   'Complete Job'}
                </Text>
              </TouchableOpacity>
            )}
            
            {/* View details button */}
            <TouchableOpacity
              className="bg-gray-100 rounded-lg py-3 flex-1 ml-2"
            >
              <Text className="text-gray-700 font-bold text-center">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-primary-500 pt-14 pb-4 px-5">
        <Text className="text-white text-2xl font-bold">Jobs</Text>
      </View>
      
      {/* Filters */}
      <View className="bg-white px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setActiveFilter('all')}
            className={`mr-2 px-4 py-2 rounded-full ${
              activeFilter === 'all' ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`font-medium ${
                activeFilter === 'all' ? 'text-white' : 'text-gray-700'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveFilter(JobStatus.PENDING)}
            className={`mr-2 px-4 py-2 rounded-full ${
              activeFilter === JobStatus.PENDING ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`font-medium ${
                activeFilter === JobStatus.PENDING ? 'text-white' : 'text-gray-700'
              }`}
            >
              Pending
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveFilter(JobStatus.ACCEPTED)}
            className={`mr-2 px-4 py-2 rounded-full ${
              activeFilter === JobStatus.ACCEPTED ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`font-medium ${
                activeFilter === JobStatus.ACCEPTED ? 'text-white' : 'text-gray-700'
              }`}
            >
              Accepted
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveFilter(JobStatus.IN_PROGRESS)}
            className={`mr-2 px-4 py-2 rounded-full ${
              activeFilter === JobStatus.IN_PROGRESS ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`font-medium ${
                activeFilter === JobStatus.IN_PROGRESS ? 'text-white' : 'text-gray-700'
              }`}
            >
              In Progress
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveFilter(JobStatus.COMPLETED)}
            className={`mr-2 px-4 py-2 rounded-full ${
              activeFilter === JobStatus.COMPLETED ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`font-medium ${
                activeFilter === JobStatus.COMPLETED ? 'text-white' : 'text-gray-700'
              }`}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Jobs list */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <MaterialIcons name="work-off" size={64} color="#d1d5db" />
              <Text className="text-gray-500 text-lg font-medium mt-4 text-center">
                No jobs found for this filter
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ScrollView component used in the filter section
function ScrollView(props: any) {
  return (
    <View className="flex-row overflow-hidden" {...props}>
      {props.children}
    </View>
  );
}
