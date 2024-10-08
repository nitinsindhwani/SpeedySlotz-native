import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Animated,
  Easing,
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LanguageContext } from "../api/LanguageContext";
import {
  fetchReferralCode,
  getStoredUser,
  getUserPoints,
} from "../api/ApiCall";
import InLineLoader from "./GlobalComponents/InLineLoader";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedStar = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scaleAnimation = Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    Animated.loop(scaleAnimation).start();
    rotateAnimation.start();

    return () => {
      scaleAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.starContainer,
        { transform: [{ scale: scaleValue }, { rotate: spin }] },
      ]}
    >
      <FontAwesome5 name="star" size={60} color="white" />
    </Animated.View>
  );
};

const RewardProgramScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generateCodeLoading, setGenerateCodeLoading] = useState(false);
  const { translations } = useContext(LanguageContext);

  // Fetch user data and points when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const storedUserData = await getStoredUser();
          setUserData(storedUserData);

          if (storedUserData && storedUserData.user_id) {
            try {
              const pointsData = await getUserPoints(storedUserData.user_id);
              setUserPoints(pointsData.totalPointsAccumulated || 0);
            } catch (error) {
              console.error("Error fetching user points:", error);
              setUserPoints(0);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert(
            "Error",
            "Failed to load user data. Please try again later."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []) // Empty dependency array ensures the effect runs every time the screen is focused
  );

  const generateReferralCode = async () => {
    if (!userData || !userData.user_id) {
      Alert.alert("Error", "User data not available. Please try again later.");
      return;
    }

    setGenerateCodeLoading(true);
    try {
      const code = await fetchReferralCode(userData.user_id, "USER");
      setReferralCode(code || "");
    } catch (error) {
      console.error("Error fetching referral code:", error);
      Alert.alert(
        "Error",
        "Failed to generate referral code. Please try again."
      );
    } finally {
      setGenerateCodeLoading(false);
    }
  };

  const navigateToRedeemScreen = () => {
    navigation.navigate("RedeemScreen", { userPoints });
  };

  const shareReferralCode = async () => {
    try {
      const result = await Share.share({
        message: `${translations.excitingShareMessage}
  
  ${translations.referralCodeIntro}:
  
  💰 💰 💰  ${referralCode} 💰 💰 💰 
  
  ${translations.benefitsIntro}:
  • ${translations.signUpBonus}
  • ${translations.firstBookingBonus}
  • ${translations.amazonGiftCardReward}
  • ${translations.exclusiveOffers}
  
  Referral Code is valid for 48 hours. 
  
  ${translations.downloadAppPrompt}
  ${translations.downloadAppIOS}: [App Store Link]
  ${translations.downloadAppAndroid}: [Play Store Link]
  
  ${translations.joinNowMessage}`,
      });
    } catch (error) {
      Alert.alert(translations.shareError);
    }
  };

  if (loading) {
    return <InLineLoader />;
  }

  const earnCategories = [
    {
      icon: "user-plus",
      title: translations.signUpFriend,
      points: 500,
      color: "#FF6B6B",
      description: translations.signUpFriendDesc,
    },
    {
      icon: "calendar-check",
      title: translations.firstBookingFriend,
      points: 100,
      color: "#4ECDC4",
      description: translations.firstBookingFriendDesc,
    },
    {
      icon: "star",
      title: translations.leaveReview,
      points: 50,
      color: "#FFD93D",
      description: translations.leaveReviewDesc,
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={translations.referEarnTitle}
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={["#4A78B9", "#5EA5D0", "#7ED1E7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pointsCard}
        >
          <AnimatedStar />
          <Text style={styles.pointsLabel}>{translations.totalPoints}</Text>
          <Text style={styles.pointsValue}>{userPoints}</Text>
          <Text style={styles.pointsToNextReward}>
            {translations.pointsToNextReward.replace(
              "{points}",
              1000 - (userPoints % 1000)
            )}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(userPoints % 1000) / 10}%` },
              ]}
            />
          </View>
        </LinearGradient>

        <View style={styles.referralCard}>
          <Text style={styles.cardTitle}>{translations.referralProgram}</Text>
          {referralCode ? (
            <View style={styles.referralCodeContainer}>
              <MaterialCommunityIcons
                name="ticket-confirmation"
                size={24}
                color={theme3.primaryColor}
                style={styles.referralIcon}
              />
              <Text style={styles.referralCode}>{referralCode}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateReferralCode}
              disabled={generateCodeLoading}
            >
              {generateCodeLoading ? (
                <InLineLoader size="small" color={theme3.primaryColor} />
              ) : (
                <Text style={styles.generateButtonText}>
                  {translations.generateCode}
                </Text>
              )}
            </TouchableOpacity>
          )}
          {referralCode && (
            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareReferralCode}
            >
              <FontAwesome5
                name="share-alt"
                size={18}
                color="white"
                style={styles.shareIcon}
              />
              <Text style={styles.shareButtonText}>
                {translations.shareCode}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {translations.howToEarnPoints}
          </Text>
          {earnCategories.map((category, index) => (
            <View
              key={index}
              style={[
                styles.categoryRow,
                { backgroundColor: category.color + "20" },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: category.color },
                ]}
              >
                <FontAwesome5
                  name={category.icon}
                  style={styles.categoryIcon}
                />
              </View>
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
              </View>
              <Text style={[styles.categoryPoints, { color: category.color }]}>
                +{category.points}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {translations.howToRedeemPoints}
          </Text>
          <MaterialCommunityIcons
            name="gift"
            size={60}
            color={theme3.primaryColor}
            style={styles.redeemIcon}
          />
          <View style={styles.amazonRewardContainer}>
            <FontAwesome5
              name="amazon"
              size={30}
              color="#FF9900"
              style={styles.amazonIcon}
            />
            <Text style={styles.amazonRewardText}>
              {translations.amazonGiftCardReward}
            </Text>
          </View>
          <Text style={styles.redeemText}>
            {translations.redeemDescription}
          </Text>
          <TouchableOpacity
            style={styles.redeemButton}
            onPress={navigateToRedeemScreen}
          >
            <Text style={styles.redeemButtonText}>
              {translations.redeemNow}
            </Text>
          </TouchableOpacity>
          <View style={styles.warningContainer}>
            <Ionicons
              name="information-circle"
              size={24}
              color={theme3.primaryColor}
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>{translations.redeemInfo}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  scrollContent: {
    padding: 16,
  },
  pointsCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pointsIcon: {
    marginBottom: 10,
  },
  pointsLabel: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  pointsToNextReward: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    marginTop: 15,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  referralCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 15,
  },
  referralCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  referralIcon: {
    marginRight: 10,
  },
  referralCode: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme3.primaryColor,
    letterSpacing: 2,
    marginRight: 10,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
  },
  shareIcon: {
    marginRight: 10,
  },
  shareButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 20,
    textAlign: "center",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 12,
    padding: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  categoryIcon: {
    fontSize: 24,
    color: "white",
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: theme3.fontColorI,
  },
  categoryPoints: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  redeemIcon: {
    alignSelf: "center",
    marginBottom: 15,
  },
  amazonRewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  amazonIcon: {
    marginRight: 10,
  },
  amazonRewardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9900",
    flex: 1,
  },
  redeemText: {
    fontSize: 16,
    color: theme3.fontColor,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F4FD",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: theme3.primaryColor,
  },
  redeemButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: "center",
    marginVertical: 20,
  },
  redeemButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  generateButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: "center",
    marginVertical: 20,
  },
  generateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  starContainer: {
    marginBottom: 10,
  },
});

export default RewardProgramScreen;
