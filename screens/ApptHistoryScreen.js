import React, { useEffect, useContext } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UpcomingScreen from "../components/UpcomingScreen";
import PastScreen from "../components/PastScreen";
import { Text } from "react-native";
import Header from "../components/Header";
import { LanguageContext } from "../api/LanguageContext";

const Tab = createMaterialTopTabNavigator();

const ApptHistoryScreen = ({ route }) => {
  const { user } = route.params;
  const { language, translations } = useContext(LanguageContext); // Use LanguageContext
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
  }, [navigation, translations]);

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
