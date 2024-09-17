import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";
import LandingScreen from "../LandingScreen";
import NotificationScreen from "../Notifications/NotificationScreen";
import FavoritesScreen from "../FavoritesScreen";
import ApptHistoryScreen from "../ApptHistoryScreen";
import Chat from "../Chat.js/ChatScreen";
import NewJobScreen from "../NewJobScreen";
const Tab = createBottomTabNavigator();

const BottomNavigation = ({ route }) => {
  const { user } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme3.light,
          borderTopWidth: 0,
          borderTopColor: theme3.secondaryColor,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme3.primaryColor,
        tabBarInactiveTintColor: theme3.inActive,
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              return <Ionicons name={iconName} size={30} color={color} />;
            case "Favourite":
              iconName = focused ? "heart" : "heart-outline";
              return <Ionicons name={iconName} size={30} color={color} />;
            case "NewJob":
              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 80,
                    height: 80,
                    borderRadius: 1000,
                    backgroundColor: theme3.primaryColor,
                  }}
                >
                  <Ionicons name="add-circle" size={36} color="white" />
                </View>
              );
            case "Appointments":
              iconName = focused ? "calendar" : "calendar-outline";
              return <Ionicons name={iconName} size={30} color={color} />;
            case "Chat":
              iconName = focused ? "chat" : "chat-outline";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={30}
                  color={color}
                />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={LandingScreen}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavoritesScreen}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="NewJob"
        component={NewJobScreen}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Appointments"
        component={ApptHistoryScreen}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
