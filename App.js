// App.js
import React, { useEffect, useRef } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen1 from "./screens/OnBoardScreens/WelcomeScreen1";
import WelcomeScreen2 from "./screens/OnBoardScreens/WelcomeScreen2";
import WelcomeScreen3 from "./screens/OnBoardScreens/WelcomeScreen3";
import SignUpScreen from "./screens/AuthScreens/SignUpScreen";
import LoginScreen from "./screens/AuthScreens/LoginScreen";

import ResendEmailScreen from "./screens/AuthScreens/ResendEmailScreen";
import ForgotPasswordScreen from "./screens/AuthScreens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/AuthScreens/ResetPasswordScreen";

import DetailScreen from "./screens/DetailScreen";
import ApptConfirmationScreen from "./screens/ApptConfirmationScreen";
import ApptHistoryScreen from "./screens/ApptHistoryScreen";
import LandingScreen from "./screens/LandingScreen";
import ManageAccountScreen from "./screens/ManageAccountScreen";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import PreferredCategoriesScreen from "./screens/PreferredCategoriesScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import ReferScreen from "./screens/ReferScreen";
import AboutSpeedySlotzScreen from "./screens/AboutSpeedySlotzScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import HelpCenterScreen from "./screens/HelpCenterScreen";
import TermsAndConditionsScreen from "./screens/TermsAndConditionsScreen";
import HowItWorksScreen from "./screens/HowItWorksScreen";
// import NotificationScreen from "./screens/NotificationScreen";
import NotificationScreen from "./screens/Notifications/NotificationScreen";
import NewJobScreen from "./screens/NewJobScreen";
import ChatScreen from "./screens/Chat.js/ChatScreen";
import ChatMessage from "./screens/Chat.js/ChatMessage";
import { ThemeContext, ThemeProvider } from "./components/ThemeContext";
import Swiper from "react-native-swiper";
import * as Notifications from "expo-notifications";
import { TextEncoder, TextDecoder } from "text-encoding";
import BottomNavigation from "./screens/BottomNavigation/BottomNavigation";
import SignUpDecider from "./screens/AuthScreens/SignUpDescider";
import { WebSocketProvider } from "./api/WebSocketContext";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator();

function WelcomeStack() {
  const swiperRef = useRef(null);
  const handleNextButtonPress = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1); // Scrolls to the next slide
    }
  };
  return (
    <Swiper loop={false} showsButtons={false} ref={swiperRef}>
      <WelcomeScreen1 handleNextButtonPress={handleNextButtonPress} />
      <WelcomeScreen2 handleNextButtonPress={handleNextButtonPress} />
      <WelcomeScreen3 />
    </Swiper>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ApptHistoryScreen" component={ApptHistoryScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="NewJobScreen" component={NewJobScreen} />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatMessage"
        component={ChatMessage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // Extract the data from the notification response
        const { data } = response.notification.request.content;

        // Check if it's the correct notification and data is present
        if (data.screen === "ChatScreen" && data.chatData) {
          // Navigate to the ChatScreen with parameters
          navigationRef.current?.navigate("App", {
            screen: "ChatScreen",
            params: {
              chatData: data.chatData, // Use the chat data from the notification
            },
          });
        }
      }
    );
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);
  return (
    <ThemeProvider>
      <WebSocketProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={WelcomeStack} />
            <Stack.Screen
              name="DetailScreen"
              component={DetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="ResendEmailScreen"
              component={ResendEmailScreen}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="SignUpDecider" component={SignUpDecider} />
            <Stack.Screen name="LandingScreen" component={LandingScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen
              name="ManageAccountScreen"
              component={ManageAccountScreen}
            />
            <Stack.Screen
              name="BottomNavigation"
              component={BottomNavigation}
            />
            <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
            <Stack.Screen name="ReferScreen" component={ReferScreen} />

            <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
            <Stack.Screen
              name="AboutSpeedySlotzScreen"
              component={AboutSpeedySlotzScreen}
            />
            <Stack.Screen
              name="HelpCenterScreen"
              component={HelpCenterScreen}
            />
            <Stack.Screen
              name="TermsAndConditionsScreen"
              component={TermsAndConditionsScreen}
            />
            <Stack.Screen
              name="HowItWorksScreen"
              component={HowItWorksScreen}
            />
            <Stack.Screen
              name="PreferredCategoriesScreen"
              component={PreferredCategoriesScreen}
            />
            <Stack.Screen
              name="ApptConfirmationScreen"
              component={ApptConfirmationScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen name="App" component={AppNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </WebSocketProvider>
    </ThemeProvider>
  );
}
