import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import StarRating from "../../assets/branding/StarRating";
import axios from "axios";
import { baseApiUrl } from "../../api/Config";
import { getStoredToken } from "../../api/ApiCall";
import { theme3 } from "../../assets/branding/themes";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../GlobalComponents/Header";

const ReviewModal = ({ isVisible, onClose, businessId, isRegistered }) => {
  const [activeTab, setActiveTab] = useState("google");
  const [googleReviews, setGoogleReviews] = useState([]);
  const [appReviews, setAppReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    if (isVisible && businessId) {
      fetchReviews();
    }
  }, [isVisible, businessId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = await getStoredToken();
      const response = await axios.get(
        `${baseApiUrl}/api/v1/reviews/${businessId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Separate the reviews based on whether they are Google or App reviews
      const allReviews = response.data?.payload || [];

      // Assuming that Google reviews have no `userId`, and App reviews have `userId` set
      const googleReviews = allReviews.filter((review) => !review.userId);
      const appReviews = allReviews.filter(
        (review) => review.userId === "368880cc-0b52-4a9e-b88f-030262efad58"
      ); // Example App user ID or adjust as needed

      setGoogleReviews(googleReviews);
      setAppReviews(appReviews);

      // Calculate average rating, handling empty review lists
      const combinedReviews = [...googleReviews, ...appReviews];
      const avgRating =
        combinedReviews.length > 0
          ? combinedReviews.reduce((sum, review) => sum + review.rating, 0) /
            combinedReviews.length
          : 0;

      setAverageRating(avgRating);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
      setError("Failed to load reviews. Please try again.");
    }
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderReview = ({ item, index }) => {
    const isExpanded = expandedReviews[item.businessId + index];
    const shouldTruncate = item.reviewText.length > 150;

    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <FontAwesome
            name="user-circle"
            size={24}
            color={theme3.secondaryColor}
          />
          <Text style={styles.reviewerName}>
            {item.username || "Anonymous"}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <StarRating
            rating={item.rating || 0}
            size={16}
            color={theme3.secondaryColor}
          />
          <Text style={styles.ratingDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.reviewText}>
          {shouldTruncate && !isExpanded
            ? `${item.reviewText.slice(0, 150)}...`
            : item.reviewText}
        </Text>
        {shouldTruncate && (
          <TouchableOpacity
            onPress={() => toggleReviewExpansion(item.businessId + index)}
          >
            <Text style={styles.readMoreLess}>
              {isExpanded ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const currentReviews = activeTab === "google" ? googleReviews : appReviews;
  const reviewCount = currentReviews.length;

  const ListHeaderComponent = () => (
    <>
      <View style={styles.averageRatingContainer}>
        <Text style={styles.averageRatingNumber}>
          {averageRating.toFixed(1)}
        </Text>
        <StarRating
          rating={averageRating}
          size={24}
          color={theme3.secondaryColor}
        />
        <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "google" && styles.activeTab]}
          onPress={() => setActiveTab("google")}
        >
          <Image
            source={require("../../assets/newimage/google-icon.png")}
            style={styles.tabLogo}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "google" && styles.activeTabText,
            ]}
          >
            Google Reviews ({googleReviews.length})
          </Text>
        </TouchableOpacity>
        {isRegistered && appReviews.length > 0 && (
          <TouchableOpacity
            style={[styles.tab, activeTab === "app" && styles.activeTab]}
            onPress={() => setActiveTab("app")}
          >
            <Image
              source={require("../../assets/icon-new.png")}
              style={styles.myLogo}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "app" && styles.activeTabText,
              ]}
            >
              SpeedySlotz Reviews ({appReviews.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header title="Customer Feedback" typeModal={true} onPress={onClose} />
        {loading ? (
          <ActivityIndicator size="large" color={theme3.primaryColor} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={currentReviews}
            renderItem={renderReview}
            keyExtractor={(item, index) => `${item.businessId}-${index}`}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No reviews yet.</Text>
            }
            contentContainerStyle={styles.reviewList}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  averageRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: theme3.primaryColor,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
  },
  averageRatingNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginRight: 15,
  },
  reviewCount: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: theme3.primaryColor,
  },
  activeTab: {
    backgroundColor: theme3.primaryColor,
  },
  tabLogo: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  myLogo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  tabText: {
    color: theme3.primaryColor,
    fontWeight: "bold",
    fontSize: 14,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  reviewList: {
    paddingHorizontal: 20,
  },
  reviewItem: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewerName: {
    fontWeight: "bold",
    marginLeft: 10,
    color: theme3.fontColor,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ratingDate: {
    fontSize: 12,
    color: theme3.fontColorI,
  },
  reviewText: {
    color: theme3.fontColorI,
    fontSize: 14,
    lineHeight: 20,
  },
  readMoreLess: {
    color: theme3.primaryColor,
    fontWeight: "bold",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    color: theme3.fontColorI,
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});

export default ReviewModal;
