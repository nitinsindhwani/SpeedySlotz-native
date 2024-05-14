import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Share,
  View,
} from "react-native";
import Header from "./GlobalComponents/Header";
import { FontAwesome5 } from "@expo/vector-icons";
import Styles from "../assets/branding/GlobalStyles";

const ReferScreen = () => {
  const referralCode = "ABC123"; // This would be dynamically retrieved in a real app

  const shareReferralCode = async () => {
    try {
      const shareMessage = `Hey! Join me on SpeedySlotz, the easiest way to book your slots quickly. Use my referral code '${referralCode}' when you sign up, and we both get rewarded with SpeedyPoints! Let's enjoy the convenience together. Download the app now: [App Link]`;

      const result = await Share.share({
        message: shareMessage,
        // Optionally you can add a URL to your app: url: "https://link.to/app"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log("Shared with activity type: ", result.activityType);
        } else {
          // Shared
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Dismissed");
      }
    } catch (error) {
      // It's generally better to show a user-friendly error and not the raw message
      // Optionally you can log the error message: console.error(error.message);
      alert("Unable to share at the moment. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={"Refer & Earn"} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.heading}>Refer Your Friends</Text>
          <Text style={styles.text}>
            Invite your friends to join SpeedySlotz! For every friend who signs
            up and completes their first booking, you'll both earn 500
            SpeedyPoints. Accumulate points to unlock exclusive discounts,
            priority booking, and more. Sharing is caring - and rewarding!
          </Text>
        </View>

        <View style={styles.referSection}>
          <FontAwesome5
            name="gifts"
            size={36}
            color="#084887"
            style={styles.icon}
          />
          <Text style={styles.subHeading}>Your Referral Code</Text>
          <Text style={styles.referralCode}>{referralCode}</Text>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareReferralCode}
          >
            <Text style={styles.shareButtonText}>Share Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7", // A neutral background color that suits the entire screen
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  section: {
    paddingHorizontal: 20, // Padding on the sides of the content
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#084887", // Dark blue color for headings for better contrast
    textAlign: "center", // Center align the heading
  },
  text: {
    fontSize: 16,
    lineHeight: 24, // Increased line height for better readability
    color: "#333", // Dark grey color for text for better contrast
    textAlign: "center", // Center align the text
  },
  referSection: {
    alignItems: "center",
    padding: 20,
    marginVertical: 20,
    backgroundColor: "white", // White background for the referral section
    borderRadius: 10, // Rounded corners
    marginHorizontal: 20, // Horizontal margin for better spacing from screen edges
    shadowColor: "#000", // Shadow for elevation effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#084887",
    marginVertical: 8,
  },
  referralCode: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#084887",
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: "#084887",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginBottom: 10,
  },
});

export default ReferScreen;
