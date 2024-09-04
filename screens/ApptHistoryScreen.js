import React, { useEffect, useState, useContext } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UpcomingScreen from "../components/UpcomingScreen";
import PastScreen from "../components/PastScreen";
import { Text, View } from "react-native";
import Header from "../components/Header";
import { LanguageContext } from "../api/LanguageContext";
import { getStoredUser } from "../api/ApiCall";

const Tab = createMaterialTopTabNavigator();

const ApptHistoryScreen = ({ route }) => {
  const { language, translations } = useContext(LanguageContext); // Use LanguageContext
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const params = route.params || {};
  const isFromNotification = params.slotId != null;
  // Ensure you have a valid userId before making the request

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getStoredUser();
        if (!userData || !userData.user_id) {
          throw new Error("User ID is missing");
        }
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle the error appropriately, e.g., navigate to login screen
        // navigation.navigate('LoginScreen');
      }
    };

    fetchUser();

    if (params.slotId) {
      console.log("Received params:", JSON.stringify(params, null, 2));
      // You can add logic here to handle the specific appointment
    }

    if (!isFromNotification) {
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
        headerTitle: translations.appointmentsTitle,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
          color: "purple",
        },
        headerStyle: {
          backgroundColor: "white",
        },
      });
    } else {
      // If it's from a notification, hide the header
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation, translations, isFromNotification, params]);
  if (!user) {
    // You can return a loading indicator here
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <>
      <Header user={user} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === translations.upcomingTab) {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === translations.pastTab) {
              iconName = focused ? "time" : "time-outline";
            }
            return <Ionicons name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
          },
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 5,
            shadowOpacity: 0.5,
            shadowRadius: 3,
            shadowOffset: {
              width: 0,
              height: 3,
            },
          },
          tabBarIndicatorStyle: {
            backgroundColor: "orange",
            height: 4,
          },
        })}
      >
        <Tab.Screen
          name={translations.upcomingTab}
          component={UpcomingScreen}
        />
        <Tab.Screen name={translations.pastTab} component={PastScreen} />
      </Tab.Navigator>
    </>
  );
};

export default ApptHistoryScreen;
