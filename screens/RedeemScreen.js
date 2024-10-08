import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LanguageContext } from "../api/LanguageContext";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import { redeemUserPoints, getStoredUser } from "../api/ApiCall";
import ErrorAlert from "../screens/GlobalComponents/ErrorAlert";

const { width, height } = Dimensions.get("window");
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
const RedeemScreen = ({ navigation, route }) => {
  const { userPoints = 0 } = route.params || {};
  const { translations } = useContext(LanguageContext);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0); // Add this line
  const confettiRef = useRef(null);
  const dollarPerPoint = 0.01;
  const minRedeemableAmount = 1000;

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const maxRedeemableAmount = Math.floor(userPoints / 1000) * 1000;

  useEffect(() => {
    setSelectedAmount(minRedeemableAmount);
  }, [userPoints]);

  const handleCloseError = () => setShowError(false);

  const handleRedeem = async () => {
    if (selectedAmount < minRedeemableAmount) {
      setErrorMessage(translations.minimumRedeemError);
      setShowError(true);
      return;
    }

    try {
      const userData = await getStoredUser();
      const userId = userData?.user_id;

      if (!userId) {
        setErrorMessage("User not logged in");
        setShowError(true);
        return;
      }

      const result = await redeemUserPoints(userId, selectedAmount);

      setShowConfetti(true);
      setConfettiKey((prevKey) => prevKey + 1); // Add this line
      setShowError(false);

      // Delay the alert and navigation
      setTimeout(() => {
        Alert.alert(translations.success, result, [
          {
            text: translations.ok,
            onPress: () => {
              setTimeout(() => {
                setShowConfetti(false);
                navigation.goBack();
              }, 1000); // Increased delay before navigation
            },
          },
        ]);
      }, 3000); // Increased delay to show confetti effect
    } catch (error) {
      console.error("Redemption failed:", error);
      setErrorMessage("Failed to redeem points. Please try again.");
      setShowError(true);
    }
  };

  const insufficientPoints = userPoints < minRedeemableAmount;

  const renderSliderMarkers = () => {
    const markers = [];
    for (let i = minRedeemableAmount; i <= maxRedeemableAmount; i += 1000) {
      markers.push(
        <View key={i} style={styles.sliderMarker}>
          <Text style={styles.sliderMarkerText}>{i}</Text>
        </View>
      );
    }
    return markers;
  };

  return (
    <View style={styles.container}>
      {showConfetti && (
        <View style={styles.confettiContainer}>
          <ConfettiCannon
            key={confettiKey}
            count={300}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut={true}
            fallSpeed={2500}
            explosionSpeed={350}
            colors={[
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#ffff00",
              "#ff00ff",
              "#00ffff",
              "#ffa500",
              "#800080",
            ]}
            multiple={3}
          />
          <ConfettiCannon
            key={confettiKey + 1}
            count={300}
            origin={{ x: width + 10, y: 0 }}
            autoStart={true}
            fadeOut={true}
            fallSpeed={2500}
            explosionSpeed={350}
            colors={[
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#ffff00",
              "#ff00ff",
              "#00ffff",
              "#ffa500",
              "#800080",
            ]}
            multiple={3}
          />
        </View>
      )}

      <Header
        title={translations.redeemPoints}
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
          <Text style={styles.pointsLabel}>{translations.availablePoints}</Text>
          <Text style={styles.pointsValue}>{userPoints}</Text>
        </LinearGradient>
        <View style={styles.minPointsCard}>
          <MaterialCommunityIcons
            name="gift-outline"
            size={40}
            color={theme3.primaryColor}
            style={styles.minPointsIcon}
          />
          <View style={styles.minPointsTextContainer}>
            <Text style={styles.minPointsTitle}>
              {translations.minRedeemablePoints}
            </Text>
            <Text style={styles.minPointsValue}>
              1000 {translations.points} = $
              {(minRedeemableAmount * dollarPerPoint).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{translations.selectAmount}</Text>
          {insufficientPoints ? (
            <View style={styles.insufficientPointsContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color="red"
              />
              <Text style={styles.insufficientPointsText}>
                {translations.insufficientPointsMessage}
              </Text>
            </View>
          ) : (
            <>
              <Slider
                style={styles.slider}
                minimumValue={minRedeemableAmount}
                maximumValue={maxRedeemableAmount}
                step={1000}
                value={selectedAmount}
                onValueChange={(value) =>
                  setSelectedAmount(Math.round(value / 1000) * 1000)
                }
                minimumTrackTintColor={theme3.primaryColor}
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor={theme3.primaryColor}
              />
              <View style={styles.sliderMarkersContainer}>
                {renderSliderMarkers()}
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>
                  {selectedAmount} {translations.points}
                </Text>
                <Text style={styles.amountText}>
                  = ${(selectedAmount * dollarPerPoint).toFixed(2)}{" "}
                  {translations.amazonGiftCard}
                </Text>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.redeemButton,
            insufficientPoints && styles.disabledRedeemButton,
          ]}
          onPress={handleRedeem}
          disabled={insufficientPoints}
        >
          <FontAwesome5
            name="gift"
            size={24}
            color="white"
            style={styles.redeemButtonIcon}
          />
          <Text style={styles.redeemButtonText}>{translations.redeemNow}</Text>
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
      </ScrollView>

      <ErrorAlert
        show={showError}
        onAction={handleCloseError}
        title={translations.actionErrorTitle}
        body={errorMessage}
      />
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
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  starAnimation: {
    width: 100,
    height: 100,
  },
  pointsLabel: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 5,
    fontWeight: "600",
  },
  pointsValue: {
    fontSize: 52,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  minPointsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F4FD",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  minPointsIcon: {
    marginRight: 20,
  },
  minPointsTextContainer: {
    flex: 1,
  },
  minPointsTitle: {
    fontSize: 18,
    color: theme3.fontColor,
    marginBottom: 5,
    fontWeight: "600",
  },
  minPointsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme3.primaryColor,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 20,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderMarkersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10,
    marginBottom: 15,
  },
  sliderMarker: {
    alignItems: "center",
  },
  sliderMarkerText: {
    fontSize: 12,
    color: theme3.fontColorI,
    fontWeight: "500",
  },
  amountContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  amountText: {
    fontSize: 20,
    color: theme3.fontColor,
    marginBottom: 5,
    fontWeight: "600",
  },
  insufficientPointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  insufficientPointsText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginLeft: 10,
    fontWeight: "500",
  },
  redeemButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  disabledRedeemButton: {
    opacity: 0.5,
  },
  redeemButtonIcon: {
    marginRight: 10,
  },
  redeemButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  warningIcon: {
    marginRight: 15,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: theme3.fontColor,
    lineHeight: 20,
  },
  starContainer: {
    marginBottom: 10,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // Ensure confetti is on top of other components
  },
});

export default RedeemScreen;
