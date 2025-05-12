import { Tabs } from "expo-router";
import { Fontisto, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#4A5568",  
          shadowOffset: { width: 0, height: 10}, shadowOpacity: 0.25, shadowRadius: 3.84,
         }, // Gray background
        tabBarActiveTintColor: "white", // Red for active tab
        tabBarInactiveTintColor: "#ffffff", // White for inactive tabs
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Fontisto
              name="home"
              size={24}
              color={focused ? "#4682B4" : "#ffffff"} // steelblue for active, white for inactive
            />
          ),
        }}
      />

      {/* Booking Tab */}
      <Tabs.Screen
        name="booking"
        options={{
          title: "Booking",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MaterialCommunityIcons
              name="ticket-confirmation"
              size={24}
              color={focused ? "#4682B4" : "#ffffff"} // steelblue for active, white for inactive
            />
          ),
        }}
      />

      {/* Inbox Tab */}
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MaterialCommunityIcons name="inbox-arrow-down" size={24} color={focused ? "#4682B4" : "#ffffff"} />

          ),
        }}
      />

      {/* You Tab */}
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Fontisto
              name="person"
              size={24}
              color={focused ? "#4682B4" : "#ffffff"} // steelblue for active, white for inactive
            />
          ),
        }}
      />
    </Tabs>
  );
}
