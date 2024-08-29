import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import axios from "axios";
import { baseApiUrl } from "../../api/Config";
import { getStoredToken } from "../../api/ApiCall";
import uuid from "react-native-uuid";
import { getBadgeDetails } from "../../components/BadgeInfo";
import Header from "../GlobalComponents/Header";
import { LanguageContext } from "../../api/LanguageContext"; // Import LanguageContext

export default function RemarkModal({
  modalVisible,
  setModalVisible,
  slotId,
  userId,
  businessId,
  onReviewSubmit,
}) {
  const { translations } = useContext(LanguageContext); // Access translations from context

  // Prepare the badges array dynamically from getBadgeDetails
  const badgeCodes = [
    "TOPR",
    "LOWP",
    "PUNC",
    "FAIR",
    "CSTF",
    "SPDS",
    "COMM",
    "CMKP",
    "EMRG",
  ];

  const badges = badgeCodes.map((code) => ({
    ...getBadgeDetails(code, translations),
    code,
  }));

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [positiveRatedBadges, setPositiveRatedBadges] = useState([]);
  const [negativeRatedBadges, setNegativeRatedBadges] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [review, setReview] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleOptions = (badgeCode) => {
    if (selectedBadge === badgeCode) {
      setSelectedBadge(null);
    } else {
      setSelectedBadge(badgeCode);
    }
  };

  const handleRating = (badgeCode, rating) => {
    let updatedPositive = [...positiveRatedBadges];
    let updatedNegative = [...negativeRatedBadges];

    if (rating) {
      // Thumbs Up
      if (positiveRatedBadges.includes(badgeCode)) {
        updatedPositive = updatedPositive.filter((b) => b !== badgeCode);
      } else {
        updatedPositive.push(badgeCode);
        updatedNegative = updatedNegative.filter((b) => b !== badgeCode);
      }
    } else {
      // Thumbs Down
      if (negativeRatedBadges.includes(badgeCode)) {
        updatedNegative = updatedNegative.filter((b) => b !== badgeCode);
      } else {
        updatedNegative.push(badgeCode);
        updatedPositive = updatedPositive.filter((b) => b !== badgeCode);
      }
    }

    setPositiveRatedBadges(updatedPositive);
    setNegativeRatedBadges(updatedNegative);
    setSelectedBadge(null);
  };

  const submitRemarks = async () => {
    try {
      const userToken = await getStoredToken();
      if (!userToken) {
        setErrorMessage("User token not found. Please log in again.");
        setShowError(true);
        return;
      }

      const reviewData = {
        key: {
          slotId: slotId,
          reviewId: uuid.v4(),
        },
        userId: userId,
        businessId: businessId,
        positiveBadges: positiveRatedBadges,
        negativeBadges: negativeRatedBadges,
        reviewText: review,
        rating: calculateRating(),
        completed: true,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${baseApiUrl}/api/v1/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        if (response.data.warnings && response.data.warnings.length > 0) {
          setErrorMessage(response.data.warnings.join("\n"));
          setShowError(true);
        } else {
          setSuccessMessage("Review submitted successfully!");
          setShowSuccess(true);
          setTimeout(() => {
            setModalVisible(false);
            setShowSuccess(false);
            if (onReviewSubmit) {
              onReviewSubmit();
            }
          }, 2000);
        }
      } else {
        setErrorMessage("Failed to submit review. Please try again.");
        setShowError(true);
      }
      setModalVisible(false);
    } catch (error) {
      let errorMsg = "An unexpected error occurred. Please try again.";

      if (error.response) {
        errorMsg = `Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`;
      } else if (error.request) {
        errorMsg = "No response received from server";
      } else {
        errorMsg = `Error: ${error.message}`;
      }

      setErrorMessage(errorMsg);
      setShowError(true);
    }
  };

  const renderBadge = ({ item }) => {
    const isPositive = positiveRatedBadges.includes(item.code);
    const isNegative = negativeRatedBadges.includes(item.code);
    const backgroundColor = isPositive
      ? "rgba(172, 246, 161, 0.8)"
      : isNegative
      ? "rgba(255, 139, 152, 0.8)"
      : "#fff";

    return (
      <View style={styles.badgeContainer}>
        <TouchableOpacity
          style={[styles.iconContainer, { backgroundColor }]}
          onPress={() => toggleOptions(item.code)}
        >
          <Ionicons name={item.icon} size={40} color={theme3.primaryColor} />
          <Text style={styles.badgeText}>{item.name}</Text>
        </TouchableOpacity>
        {selectedBadge === item.code && (
          <View style={styles.ratingContainer}>
            <TouchableOpacity onPress={() => handleRating(item.code, true)}>
              <Ionicons
                name="thumbs-up"
                size={25}
                color={isPositive ? theme3.send : theme3.light}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRating(item.code, false)}>
              <Ionicons
                name="thumbs-down"
                size={25}
                color={isNegative ? theme3.danger : theme3.light}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const calculateRating = () => {
    const positiveCount = positiveRatedBadges.length;
    const negativeCount = negativeRatedBadges.length;
    const totalBadges = positiveCount + negativeCount;

    if (totalBadges === 0) {
      return 0;
    }

    const positivePercentage = (positiveCount / totalBadges) * 100;
    let rating = (positivePercentage / 100) * 5;
    rating = Math.round(rating * 2) / 2;

    return rating;
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <Header
          title={"Leave Review"}
          typeModal={true}
          onPress={() => setModalVisible(false)}
        />
        <FlatList
          data={badges}
          numColumns={3}
          renderItem={renderBadge}
          keyExtractor={(item) => item.code}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Rate Your Experience</Text>
              <Text style={styles.instructionText}>
                Choose any number of positive or negative badges to best
                represent your experience.
              </Text>
            </>
          }
          ListFooterComponent={
            <>
              <Text style={styles.reviewTitle}>Leave a review</Text>
              <View style={styles.ReviewContainer}>
                <TextInput
                  value={review}
                  onChangeText={(e) => setReview(e)}
                  style={styles.textInput}
                  placeholder="Write a review"
                  placeholderTextColor={theme3.placeHolder}
                  multiline={true}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitRemarks}
              >
                <Text style={styles.submitButtonText}>Submit Remarks</Text>
              </TouchableOpacity>
            </>
          }
          contentContainerStyle={styles.contentContainerStyle}
        />
      </Modal>
      <ErrorAlert
        show={showError}
        onAction={() => setShowError(false)}
        title="Attention!"
        body={errorMessage}
      />
      <ErrorAlert
        show={showSuccess}
        onAction={() => setShowSuccess(false)}
        title="Success!"
        body={successMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  closeIconContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme3.fontColor,
    textAlign: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: theme3.fontColor,
    textAlign: "center",
    marginBottom: 20,
  },
  badgeContainer: {
    width: "30%",
    margin: 5,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 2,
    elevation: 4,
  },
  ratingContainer: {
    position: "absolute",
    top: -30,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: theme3.primaryColor,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 100,
    width: "100%",
  },
  badgeText: {
    fontSize: 14,
    color: "#022C43",
    marginTop: 5,
    textAlign: "center",
  },
  reviewTitle: {
    color: theme3.fontColor,
    fontWeight: "bold",
    margin: 10,
    fontSize: 18,
    alignSelf: "flex-start",
  },
  ReviewContainer: {
    backgroundColor: theme3.light,
    width: "95%",
    height: "25%",
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    elevation: 1,
    padding: 10,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: theme3.primaryColor,
    width: "95%",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 30,
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
  contentContainerStyle: {
    paddingHorizontal: 15,
  },
});
