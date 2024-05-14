import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UpcomingScreen from "../components/UpcomingScreen";
import PastScreen from "../components/PastScreen";
import { Text } from "react-native";
// import Header from "./GlobalComponents/Header";
import Header from "../components/Header";

const Tab = createMaterialTopTabNavigator();

const ApptHistoryScreen = ({route}) => {
  const { user } = route.params;

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: "Appointments",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
        color: "purple",
      },
      headerStyle: {
        backgroundColor: "white",
      },
    });
  }, [navigation]);


  return (
    <>
      <Header user={user} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === "Upcoming") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Past") {
              iconName = focused ? "time" : "time-outline";
            }
            // Icons are shown by default if provided
            return <Ionicons name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontSize: 16, // Increased font size
            fontWeight: "600", // Bold weight
          },
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 5, // For Android shadow
            shadowOpacity: 0.5, // For iOS shadow
            shadowRadius: 3,
            shadowOffset: {
              width: 0,
              height: 3,
            },
          },
          tabBarIndicatorStyle: {
            backgroundColor: "orange",
            height: 4, // Make indicator slightly thicker
          },
        })}
      >
        <Tab.Screen name="Upcoming" component={UpcomingScreen} />
        <Tab.Screen name="Past" component={PastScreen} />
      </Tab.Navigator>
    </>
  );
};

export default ApptHistoryScreen;
