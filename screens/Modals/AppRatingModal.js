import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import StarRating from "../../assets/branding/StarRating";
import { theme3 } from "../../assets/branding/themes";
import Rate, { AndroidMarket } from "react-native-rate";
import Header from "../GlobalComponents/Header";

const AppRatingModal = ({ isVisible, onClose }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const submitRating = () => {
    if (rating > 0) {
      const options = {
        AppleAppID: "6502848090",
        GooglePackageName: "com.speedyzslotznitinapp.app",
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: false,
        openAppStoreIfInAppFails: true,
        fallbackPlatformURL: "https://www.speedyslotz.com",
      };

      Rate.rate(options, (success) => {
        if (success) {
          // Rating submitted successfully
          onClose();
        }
      });
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Header title="Rate SpeedySlotz" typeModal={true} onPress={onClose} />
        <View style={styles.content}>
          <Text style={styles.title}>Enjoying SpeedySlotz?</Text>
          <Text style={styles.subtitle}>
            Tap a star to rate it on the{" "}
            {Platform.OS === "ios" ? "App Store" : "Play Store"}
          </Text>
          <View style={styles.ratingContainer}>
            <StarRating
              rating={rating}
              size={40}
              color={theme3.secondaryColor}
              onFinishRating={handleRating}
            />
          </View>
          <TouchableOpacity
            style={[styles.submitButton, rating === 0 && styles.disabledButton]}
            onPress={submitRating}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme3.fontColorI,
    marginBottom: 20,
    textAlign: "center",
  },
  ratingContainer: {
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AppRatingModal;
