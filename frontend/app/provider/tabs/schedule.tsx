import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Calendar, CalendarList, Agenda, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getProviderAvailability, saveProviderAvailability } from '../../../utils/storage';

// Define types
interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  onSelect: (time: string) => void;
}

// Time slot component
const TimeSlot = ({ time, isSelected, onSelect }: TimeSlotProps) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(time)}
      className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
        isSelected ? 'bg-primary-500' : 'bg-gray-100'
      }`}
    >
      <Text
        className={`${isSelected ? 'text-white' : 'text-gray-700'} font-medium`}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
};

interface DaySelectorProps {
  day: string;
  isSelected: boolean;
  onToggle: () => void;
}

// Day of week selector
const DaySelector = ({ day, isSelected, onToggle }: DaySelectorProps) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`items-center justify-center w-10 h-10 rounded-full mr-2 ${
        isSelected ? 'bg-primary-500' : 'bg-gray-100'
      }`}
    >
      <Text
        className={`${isSelected ? 'text-white' : 'text-gray-700'} font-medium`}
      >
        {day.charAt(0)}
      </Text>
    </TouchableOpacity>
  );
};

interface Booking {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  address: string;
  status: string;
}

// Mock upcoming bookings
const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    clientName: 'John Smith',
    service: 'Electrical Installation',
    date: '2023-11-15',
    time: '10:00 AM',
    address: '123 Main St, Springfield',
    status: 'confirmed'
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    service: 'Circuit Repair',
    date: '2023-11-16',
    time: '2:30 PM',
    address: '456 Oak Ave, Springfield',
    status: 'confirmed'
  },
  {
    id: '3',
    clientName: 'Michael Brown',
    service: 'Light Fixture Installation',
    date: '2023-11-18',
    time: '1:00 PM',
    address: '789 Elm St, Springfield',
    status: 'confirmed'
  }
];

interface AvailableDays {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  [key: string]: boolean; // Index signature to allow string indexing
}

interface WorkHours {
  start: string;
  end: string;
}

interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
  };
}

export default function ScheduleScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [availableDays, setAvailableDays] = useState<AvailableDays>({
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false
  });
  const [workHours, setWorkHours] = useState<WorkHours>({
    start: '08:00',
    end: '18:00'
  });
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [autoAccept, setAutoAccept] = useState<boolean>(false);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Standard time slots
  const timeSlots: string[] = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];
  
  // Load provider availability on component mount
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const savedAvailability = await getProviderAvailability();
        
        if (savedAvailability) {
          setAvailableDays(savedAvailability.days || availableDays);
          setWorkHours(savedAvailability.hours || workHours);
          setAutoAccept(savedAvailability.autoAccept || false);
        }
        
        // Set up calendar marked dates
        const today = new Date();
        const markedDatesObj: MarkedDates = {};
        
        // Mark the next 30 days based on availability
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
          const dateString = date.toISOString().split('T')[0];
          
          // If the day is available, mark it
          if (availableDays[dayName as keyof AvailableDays]) {
            markedDatesObj[dateString] = {
              marked: true,
              dotColor: '#2563eb'
            };
          }
        }
        
        // Add booked appointments
        MOCK_BOOKINGS.forEach(booking => {
          if (markedDatesObj[booking.date]) {
            markedDatesObj[booking.date] = {
              ...markedDatesObj[booking.date],
              marked: true,
              dotColor: '#22C55E'
            };
          } else {
            markedDatesObj[booking.date] = {
              marked: true,
              dotColor: '#22C55E'
            };
          }
        });
        
        setMarkedDates(markedDatesObj);
        setLoading(false);
      } catch (error) {
        console.error('Error loading availability:', error);
        setLoading(false);
      }
    };
    
    loadAvailability();
  }, []);
  
  const handleDayToggle = async (day: keyof AvailableDays) => {
    const updatedDays = { ...availableDays, [day]: !availableDays[day] };
    setAvailableDays(updatedDays);
    
    try {
      await saveProviderAvailability({
        days: updatedDays,
        hours: workHours,
        autoAccept: autoAccept
      });
    } catch (error) {
      console.error('Error saving day availability:', error);
      Alert.alert('Error', 'Failed to save availability settings');
    }
  };
  
  const handleAutoAcceptToggle = async () => {
    const updatedAutoAccept = !autoAccept;
    setAutoAccept(updatedAutoAccept);
    
    try {
      await saveProviderAvailability({
        days: availableDays,
        hours: workHours,
        autoAccept: updatedAutoAccept
      });
    } catch (error) {
      console.error('Error saving auto-accept setting:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };
  
  const handleTimeSlotSelect = (slot: string) => {
    if (selectedTimeSlots.includes(slot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(s => s !== slot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slot]);
    }
  };
  
  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString);
  };
  
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary-500 pt-12 pb-4 px-5">
        <Text className="text-white text-2xl font-bold">Schedule</Text>
        <Text className="text-white/80 mt-1">Manage your availability and bookings</Text>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View className="bg-white p-4 mb-4">
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDateSelect}
            theme={{
              todayTextColor: '#2563eb',
              selectedDayBackgroundColor: '#2563eb',
              arrowColor: '#2563eb',
            }}
          />
        </View>
        
        {/* Working Days Section */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-gray-900 font-semibold text-lg mb-3">Working Days</Text>
          <View className="flex-row mb-4">
            <DaySelector 
              day="Sunday" 
              isSelected={availableDays.sunday}
              onToggle={() => handleDayToggle('sunday')}
            />
            <DaySelector 
              day="Monday" 
              isSelected={availableDays.monday}
              onToggle={() => handleDayToggle('monday')}
            />
            <DaySelector 
              day="Tuesday" 
              isSelected={availableDays.tuesday}
              onToggle={() => handleDayToggle('tuesday')}
            />
            <DaySelector 
              day="Wednesday" 
              isSelected={availableDays.wednesday}
              onToggle={() => handleDayToggle('wednesday')}
            />
            <DaySelector 
              day="Thursday" 
              isSelected={availableDays.thursday}
              onToggle={() => handleDayToggle('thursday')}
            />
            <DaySelector 
              day="Friday" 
              isSelected={availableDays.friday}
              onToggle={() => handleDayToggle('friday')}
            />
            <DaySelector 
              day="Saturday" 
              isSelected={availableDays.saturday}
              onToggle={() => handleDayToggle('saturday')}
            />
          </View>
          
          <Text className="text-gray-900 font-semibold text-lg mb-3">Working Hours</Text>
          <View className="flex-row flex-wrap mb-4">
            {timeSlots.map(slot => (
              <TimeSlot
                key={slot}
                time={slot}
                isSelected={selectedTimeSlots.includes(slot)}
                onSelect={handleTimeSlotSelect}
              />
            ))}
          </View>
          
          {/* Auto Accept Toggle */}
          <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-lg">
            <View>
              <Text className="text-gray-800 font-medium">Auto-Accept Bookings</Text>
              <Text className="text-gray-500 text-sm">Automatically accept bookings from trusted clients</Text>
            </View>
            <Switch
              trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
              thumbColor={autoAccept ? '#2563eb' : '#f4f4f5'}
              ios_backgroundColor="#d1d5db"
              onValueChange={handleAutoAcceptToggle}
              value={autoAccept}
            />
          </View>
        </View>
        
        {/* Upcoming Bookings */}
        <View className="bg-white p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900 font-semibold text-lg">Upcoming Bookings</Text>
            <TouchableOpacity>
              <Text className="text-primary-500 font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          
          {MOCK_BOOKINGS.map((booking) => (
            <View 
              key={booking.id}
              className="bg-gray-50 p-4 rounded-lg mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="calendar" size={20} color="#2563eb" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-800">{booking.service}</Text>
                    <Text className="text-gray-500 text-xs">{booking.date} at {booking.time}</Text>
                  </View>
                </View>
                <View className="bg-green-100 px-2 py-1 rounded">
                  <Text className="text-green-700 text-xs font-medium">Confirmed</Text>
                </View>
              </View>
              
              <View className="ml-13 pl-0.5">
                <Text className="text-gray-700">{booking.clientName}</Text>
                <Text className="text-gray-500 text-sm">{booking.address}</Text>
                
                <View className="flex-row mt-2">
                  <TouchableOpacity className="bg-white border border-gray-200 rounded-lg px-4 py-1.5 mr-2">
                    <Text className="text-gray-700">View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-red-50 border border-red-200 rounded-lg px-4 py-1.5">
                    <Text className="text-red-600">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Special Days Off */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-gray-900 font-semibold text-lg mb-3">Special Days Off</Text>
          <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg h-16 items-center justify-center">
            <View className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
              <Text className="text-gray-600 ml-2">Add Time Off</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
