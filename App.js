import React, { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import * as TrackingTransparency from "expo-tracking-transparency";
import { LanguageProvider } from "./api/LanguageContext";
import { ThemeProvider } from "./components/ThemeContext";
import { WebSocketProvider } from "./api/WebSocketContext";
import Swiper from "react-native-swiper";
import { PushNotification } from "./api/PushNotification";

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
import RedeemScreen from "./screens/RedeemScreen";
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
import InitialSettingsScreen from "./screens/InitialSettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import { app, auth, firestore, logAnalyticsEvent } from "./firebaseConfig";
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

function WelcomeStack({ onComplete }) {
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
      <WelcomeScreen3 onComplete={onComplete} />
    </Swiper>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
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
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(null);

  const requestNotificationPermission = async () => {
    try {
      // Check existing notification permission status
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        // Request permission only if it hasn't been granted yet
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // If permission is still not granted, alert the user
      if (finalStatus !== "granted") {
        Alert.alert(
          "Notification Permission",
          "SpeedySlotz uses notifications to keep you updated about your appointments and important updates. You can change this in your device settings.",
          [{ text: "OK" }]
        );
        return null;
      }

      // Fetch the push notification token
      const token = await PushNotification();
      return token;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const requestTrackingPermission = async () => {
    if (Platform.OS !== "ios") return true; // Tracking permission is only relevant for iOS

    try {
      // Check the current tracking permission status
      const { status: existingStatus } =
        await TrackingTransparency.getTrackingPermissionsAsync();

      // If the permission has already been granted or denied, don't ask again
      if (existingStatus === "granted" || existingStatus === "denied") {
        return existingStatus === "granted";
      }

      // If permission hasn't been requested yet, request it now
      const { status: newStatus } =
        await TrackingTransparency.requestTrackingPermissionsAsync();
      return newStatus === "granted";
    } catch (error) {
      console.error("Error requesting tracking permission:", error);
      return false;
    }
  };

  useEffect(() => {
    logAnalyticsEvent("app_open");

    const setupApp = async () => {
      try {
        const hasLaunched = await SecureStore.getItemAsync("hasLaunched");
        const welcomeSeen = await SecureStore.getItemAsync("welcomeSeen");

        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          setHasSeenWelcome(false);
          await SecureStore.setItemAsync("hasLaunched", "true");
        } else {
          setIsFirstLaunch(false);
          setHasSeenWelcome(welcomeSeen === "true");
        }

        // Request permissions only once, if not granted already
        await requestTrackingPermission();
        await requestNotificationPermission();
      } catch (error) {
        console.error("Error setting up app:", error);
      }
    };

    setupApp();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle received notification
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;

        if (data) {
          if (data.screen === "ChatScreen" && data.chatData) {
            navigationRef.current?.navigate("App", {
              screen: "ChatScreen",
              params: { chatData: data.chatData },
            });
          } else if (data.screen === "ApptHistoryScreen") {
            navigationRef.current?.navigate("App", {
              screen: "ApptHistoryScreen",
              params: {
                slotId: data.slotId,
                businessId: data.businessId,
                businessName: data.businessName,
                startTime: data.startTime,
                endTime: data.endTime,
                date: data.date,
              },
            });
          } else {
            console.log(
              "Unhandled notification type:",
              JSON.stringify(data, null, 2)
            );
          }
        } else {
          console.log("No data in notification");
        }
      });

    const handleDeepLink = (event) => {
      console.log("Deep link received:", event.url);
      let data = Linking.parse(event.url);
      if (data.path === "login") {
        navigationRef.current?.navigate("LoginScreen");
      } else if (data.path === "ResetPasswordScreen") {
        navigationRef.current?.navigate("ResetPasswordScreen", {
          userId: data.queryParams.userId,
        });
      }
    };

    const linkingSubscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      console.log("App unmounting, cleaning up listeners...");
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      linkingSubscription.remove();
    };
  }, []);

  const markWelcomeAsSeen = async () => {
    try {
      await SecureStore.setItemAsync("welcomeSeen", "true");
      setHasSeenWelcome(true);
    } catch (error) {
      console.error("Error marking welcome as seen:", error);
    }
  };

  if (isFirstLaunch === null || hasSeenWelcome === null) {
    return null; // or a loading screen
  }

  console.log("isFirstLaunch:", isFirstLaunch);
  console.log("hasSeenWelcome:", hasSeenWelcome);

  const getInitialRouteName = () => {
    if (isFirstLaunch) {
      return "InitialSettings";
    } else if (!hasSeenWelcome) {
      return "Welcome";
    } else {
      return "LoginScreen";
    }
  };

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
                },
              },
            }}
          >
            <Stack.Navigator
              initialRouteName={getInitialRouteName()}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen
                name="InitialSettings"
                component={InitialSettingsScreen}
              />
              <Stack.Screen
                name="Welcome"
                children={(props) => (
                  <WelcomeStack {...props} onComplete={markWelcomeAsSeen} />
                )}
              />
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
              <Stack.Screen name="RedeemScreen" component={RedeemScreen} />
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
