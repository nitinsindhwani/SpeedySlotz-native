import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: Platform.select({
    ios: "AIzaSyDRYNojHfCwpGHyDByB1PIGDhgtyqbMnV4",
    android: "AIzaSyCj3MsSLBwoWpKGsVA2pFPu8LJUqtT6yxA",
  }),
  authDomain: "speedyslotz-89875.firebaseapp.com",
  projectId: "speedyslotz-89875",
  storageBucket: "speedyslotz-89875.appspot.com",
  messagingSenderId: "474377974561",
  appId: Platform.select({
    ios: "1:474377974561:ios:4c5da6a11a5e1559210460",
    android: "1:474377974561:android:8198a2da07de0a8e210460",
  }),
  // Note: measurementId is not provided in the given configurations
};

let app;
let analytics;
let auth;
let firestore;

const initializeFirebase = async () => {
  try {
    console.log("Initializing Firebase...");
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized");

      firestore = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
      console.log("Firestore initialized");

      const supported = await isSupported();
      if (supported) {
        analytics = getAnalytics(app);
        console.log("Analytics initialized");
      } else {
        console.log("Analytics not supported on this platform");
      }
    } else {
      app = getApps()[0];
      console.log("Using existing Firebase app");

      firestore = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
      console.log("Firestore initialized");
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    // You might want to show an error message to the user here
  }
};

export const logAnalyticsEvent = (eventName, eventParams) => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
      console.log("Analytics event logged:", eventName, eventParams);
    } else {
      console.log("Analytics not available:", eventName, eventParams);
    }
  } catch (error) {
    console.error("Error logging analytics event:", error);
  }
};

// Initialize Firebase when this module is imported
initializeFirebase();

export { app, auth, firestore };
