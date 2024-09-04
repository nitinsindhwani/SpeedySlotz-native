import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import { Platform } from "react-native";

export const PushNotification = async () => {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  try {
    let tokenObject = await Notifications.getExpoPushTokenAsync({
      projectId: "8cdc32df-1dfe-4ba1-b002-d69366d596e4",
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

    return tokenObject.data;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
};
