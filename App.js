import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { LanguageProvider } from "./api/LanguageContext";
import { ThemeProvider } from "./components/ThemeContext";
import { WebSocketProvider } from "./api/WebSocketContext";
import Swiper from "react-native-swiper";

// Import all your screens
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
import NotificationScreen from "./screens/Notifications/NotificationScreen";
import NewJobScreen from "./screens/NewJobScreen";
import ChatScreen from "./screens/Chat.js/ChatScreen";
import ChatMessage from "./screens/Chat.js/ChatMessage";
import BottomNavigation from "./screens/BottomNavigation/BottomNavigation";
import SignUpDecider from "./screens/AuthScreens/SignUpDescider";
import LanguageSelectionScreen from "./screens/LanguageSelectionScreen";

import { TextEncoder, TextDecoder } from "text-encoding";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator();

const prefix = Linking.createURL("/");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const PushNotification = async () => {
  let previousToken = await SecureStore.getItemAsync("push_notification");

  if (previousToken) {
    return previousToken; // Return the previously stored token
  } else {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    let tokenObject = await Notifications.getExpoPushTokenAsync({
      projectId: "8cdc32df-1dfe-4ba1-b002-d69366d596e4",
    });

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    await SecureStore.setItemAsync("push_notification", tokenObject.data);

    return tokenObject.data;
  }
};

function WelcomeStack() {
  const swiperRef = useRef(null);
  const handleNextButtonPress = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
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
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
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

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    PushNotification().then((token) => {
      if (token) {
        console.log("Push Token:", token);
        // Here you would typically send this token to your backend
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
        // You can handle the notification here, e.g., update app state
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
        const { data } = response.notification.request.content;

        if (data && data.screen === "ChatScreen" && data.chatData) {
          navigationRef.current?.navigate("App", {
            screen: "ChatScreen",
            params: { chatData: data.chatData },
          });
        }
      });

    const handleDeepLink = (event) => {
      let data = Linking.parse(event.url);
      if (data.path === "login") {
        navigationRef.current?.navigate("LoginScreen");
      } else if (data.path === "ResetPasswordScreen") {
        navigationRef.current?.navigate("ResetPasswordScreen", {
          userId: data.queryParams.userId,
        });
      }
      // Handle other deep links as needed
    };

    const linkingSubscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      linkingSubscription.remove();
    };
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <WebSocketProvider>
          <NavigationContainer
            ref={navigationRef}
            linking={{
              prefixes: [
                prefix,
                "speedyslotz://",
                "exp://192.168.254.197:8081",
              ],
              config: {
                screens: {
                  LoginScreen: "login",
                  SignUpScreen: "signup",
                  ResetPasswordScreen: {
                    path: "ResetPasswordScreen/:userId",
                    parse: {
                      userId: (userId) => `${userId}`,
                    },
                  },
                  // Add other screens and their paths here
                },
              },
            }}
          >
            <Stack.Navigator
              initialRouteName="Welcome"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Welcome" component={WelcomeStack} />
              <Stack.Screen name="DetailScreen" component={DetailScreen} />
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
              <Stack.Screen
                name="LanguageSelection"
                component={LanguageSelectionScreen}
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
                options={{ headerShown: false }}
              />
              <Stack.Screen name="App" component={AppNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </WebSocketProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
