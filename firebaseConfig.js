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

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });

  // Initialize Analytics only if it's supported (not available in Expo Go)
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} else {
  app = getApps()[0];
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
}

export const logAnalyticsEvent = (eventName, eventParams) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  } else {
    console.log("Analytics not available:", eventName, eventParams);
  }
};

export { app, auth, firestore };
