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
// import { app, auth, firestore, logAnalyticsEvent } from "./firebaseConfig";

// Use auth, firestore, and logAnalyticsEvent as needed
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
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return { status: "failed", token: null };
  }

  let { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Notification Permission Required",
      "SpeedySlotz needs permission to send you notifications about important updates, such as service confirmations, appointment reminders, and booking changes. For example, we will notify you when a service provider accepts your request or if there are any changes to your booking.",

      [{ text: "OK" }]
    );
    return { status: "denied", token: null };
  }

  try {
    let tokenObject = await Notifications.getExpoPushTokenAsync({
      projectId: "8cdc32df-1dfe-4ba1-b002-d69366d596e4", // Your project ID
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    await SecureStore.setItemAsync("push_notification", tokenObject.data);

    return { status: "granted", token: tokenObject.data };
  } catch (error) {
    console.error("Error getting push token:", error);
    return { status: "error", token: null };
  }
};

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
  const [notificationStatus, setNotificationStatus] = useState("unknown");
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(null);

  useEffect(() => {
    const setupNotifications = async () => {
      const result = await PushNotification();
      setNotificationStatus(result.status);

      if (result.status === "granted" && result.token) {
        // Here you can send the token to your server if needed
      } else {
        // You might want to show an alert to the user here
        Alert.alert(
          "Allow Notifications to Stay Updated",
          "SpeedySlotz needs permission to send you notifications about important updates, such as service confirmations, appointment reminders, and booking changes. For example, we will notify you when a service provider accepts your request or if there are any changes to your booking.",
          [{ text: "OK" }]
        );
      }
    };

    setupNotifications();

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
      // Handle other deep links as needed
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

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await SecureStore.getItemAsync("hasLaunched");
      const welcomeSeen = await SecureStore.getItemAsync("welcomeSeen");

      if (hasLaunched === null) {
        console.log("First launch detected");
        setIsFirstLaunch(true);
        setHasSeenWelcome(false);
      } else {
        console.log("Not first launch");
        setIsFirstLaunch(false);
        setHasSeenWelcome(welcomeSeen === "true");
      }
    } catch (error) {
      console.error("Error checking first launch:", error);
      setIsFirstLaunch(false);
      setHasSeenWelcome(true);
    }
  };

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
      return "LoginScreen"; // or whatever your main screen is
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
                  // Add other screens and their paths here
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
