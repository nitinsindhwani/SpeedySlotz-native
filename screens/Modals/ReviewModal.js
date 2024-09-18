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
  const [allReviews, setAllReviews] = useState({
    google: { reviews: [], overallRating: 0, totalReviewCount: 0 },
    app: { reviews: [], overallRating: 0, totalReviewCount: 0 },
  });
  const [loading, setLoading] = useState(true);
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

      // Extract both Google and App reviews from the response
      const [googleReviewsResponse, appReviewsResponse] =
        response.data?.payload || [];

      // Set the reviews for Google and App
      setAllReviews({
        google: {
          reviews: googleReviewsResponse.reviews || [],
          overallRating: googleReviewsResponse.overallRating || 0,
          totalReviewCount: googleReviewsResponse.totalReviewCount || 0,
        },
        app: {
          reviews: appReviewsResponse.reviews || [],
          overallRating: appReviewsResponse.overallRating || 0,
          totalReviewCount: appReviewsResponse.totalReviewCount || 0,
        },
      });

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
      setError("Failed to load reviews. Please try again.");
    }
  };

  const calculateCombinedRating = () => {
    const totalReviews =
      allReviews.google.totalReviewCount + allReviews.app.totalReviewCount;
    const totalRatingSum =
      allReviews.google.overallRating * allReviews.google.totalReviewCount +
      allReviews.app.overallRating * allReviews.app.totalReviewCount;

    return {
      overallRating: totalReviews > 0 ? totalRatingSum / totalReviews : 0,
      totalReviewCount: totalReviews,
    };
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

  const combinedRating = calculateCombinedRating();
  const currentReviews =
    activeTab === "google" ? allReviews.google.reviews : allReviews.app.reviews;
  const currentRating =
    activeTab === "google"
      ? allReviews.google.overallRating
      : allReviews.app.overallRating;
  const reviewCount = currentReviews.length;

  const ListHeaderComponent = () => (
    <>
      {/* Combined Rating and Review Count */}
      <View style={styles.combinedRatingContainer}>
        <Text style={styles.combinedRatingNumber}>
          {combinedRating.overallRating.toFixed(1)}
        </Text>
        <StarRating
          rating={combinedRating.overallRating}
          size={24}
          color={theme3.secondaryColor}
        />
        <Text style={styles.combinedReviewCount}>
          ({combinedRating.totalReviewCount} total reviews)
        </Text>
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
            Google ({allReviews.google.totalReviewCount})
          </Text>
        </TouchableOpacity>
        {isRegistered && allReviews.app.totalReviewCount > 0 && (
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
              SpeedySlotz ({allReviews.app.totalReviewCount})
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
        <Header title="Customer Reviews" typeModal={true} onPress={onClose} />
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
  combinedRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: theme3.primaryColor,
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  combinedRatingNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginRight: 15,
  },
  combinedReviewCount: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
  },
  averageRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: theme3.secondaryColor,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
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
    paddingHorizontal: 24,
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
