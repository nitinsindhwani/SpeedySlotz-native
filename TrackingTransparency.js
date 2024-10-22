// TrackingTransparency.js
import * as TrackingTransparency from "expo-tracking-transparency";
import { Alert, Platform } from "react-native";

export async function requestTrackingPermission() {
  if (Platform.OS !== "ios") {
    // ATT is only required for iOS
    return true;
  }

  const trackingStatus =
    await TrackingTransparency.getTrackingPermissionsAsync();

  if (trackingStatus.status === "unavailable") {
    // Tracking is not available on this device
    return false;
  }

  if (trackingStatus.status === "denied") {
    // The permission request has been denied before
    // You might want to show a custom UI explaining why tracking is important for your app
    Alert.alert(
      "Permission Required",
      "To provide a personalized experience and improve our services, SpeedySlotz needs permission to track your activity. You can change this anytime in your device settings.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
    return false;
  }

  if (trackingStatus.status === "granted") {
    // Permission has already been granted
    return true;
  }

  // Request permission
  const { status } =
    await TrackingTransparency.requestTrackingPermissionsAsync();

  if (status === "granted") {
    console.log("Tracking permission granted");
    // You can enable tracking features here
    return true;
  } else {
    console.log("Tracking permission not granted");
    // You should disable tracking features here
    return false;
  }
}
