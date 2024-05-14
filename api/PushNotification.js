import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";


import { Platform } from "react-native";
export const PushNotification = async () => {
  let previousToken = await SecureStore.getItemAsync("push_notification");

  if (previousToken) {
    return previousToken; // Return the previously stored token
  } else {
    // Check for notification permissions first
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If no permission, exit the function
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    // Make sure to replace 'YOUR_PROJECT_ID' with your actual Firebase Cloud Messaging project ID
    let tokenObject = await Notifications.getExpoPushTokenAsync({
      projectId: "8cdc32df-1dfe-4ba1-b002-d69366d596e4",
    });

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    await SecureStore.setItemAsync("push_notification", tokenObject.data);

    return tokenObject.data;
  }
};
