import React, { useContext } from "react";
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
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext";

const ReferScreen = () => {
  const referralCode = "ABC123"; // This would be dynamically retrieved in a real app
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  const shareReferralCode = async () => {
    try {
      const shareMessage = translations.shareMessage.replace(
        "{referralCode}",
        referralCode
      );

      const result = await Share.share({
        message: shareMessage,
        // Optionally you can add a URL to your app: url: "https://link.to/app"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      alert(translations.shareError);
    }
  };

  return (
    <View style={styles.safeArea}>
      <Header title={translations.referEarnTitle} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.heading}>{translations.referYourFriends}</Text>
          <Text style={styles.text}>{translations.inviteFriendsText}</Text>
        </View>

        <View style={styles.referSection}>
          <FontAwesome5
            name="gifts"
            size={36}
            color="#084887"
            style={styles.icon}
          />
          <Text style={styles.subHeading}>{translations.yourReferralCode}</Text>
          <Text style={styles.referralCode}>{referralCode}</Text>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareReferralCode}
          >
            <Text style={styles.shareButtonText}>{translations.shareCode}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    color: theme3.fontColor, // Dark blue color for headings for better contrast
    textAlign: "center", // Center align the heading
  },
  text: {
    fontSize: 16,
    lineHeight: 24, // Increased line height for better readability
    color: theme3.fontColor, // Dark grey color for text for better contrast
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
    color: theme3.fontColor,
    marginVertical: 8,
  },
  referralCode: {
    fontWeight: "bold",
    fontSize: 24,
    color: theme3.fontColor,
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
