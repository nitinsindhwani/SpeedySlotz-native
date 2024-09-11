import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: Platform.select({
    ios: "AIzaSyCVQHv16LZv3AfMWLJ0x_0Rx43th7d_WIg",
    android: "AIzaSyBdUKuAs1HUJHZ-3i35PFozJEuJaFRv8gY",
  }),
  authDomain: "speedyslotz-native.firebaseapp.com",
  projectId: "speedyslotz-native",
  storageBucket: "speedyslotz-native.appspot.com",
  messagingSenderId: "30165942284",
  appId: Platform.select({
    ios: "1:30165942284:ios:d93179c0b2c3cba90c6e29",
    android: "1:30165942284:android:fdac503d0bc2328c0c6e29",
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
