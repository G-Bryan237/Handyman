import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProviderTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: "#4A5568",  
          shadowOffset: { width: 0, height: 10}, 
          shadowOpacity: 0.25, 
          shadowRadius: 3.84,
        },
        tabBarActiveTintColor: "#4682B4", // Steel blue color 
        tabBarInactiveTintColor: "#ffffff",
      }}
    >
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="wallet"
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="reputation"
        options={{
          title: "Reputation",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name="star"
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="calendar"
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="person"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
