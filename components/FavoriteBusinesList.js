import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { Linking } from "react-native";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import DealIcon from "react-native-vector-icons/FontAwesome5";
import HeartIcon from "react-native-vector-icons/AntDesign"; // Add this import for the heart icon
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import { translation } from "../assets/translations/translations";
import { getStoredToken } from "../api/ApiCall";
import { baseApiUrl } from "../api/Config";
import MainCardDesign from "../screens/GlobalComponents/MainCardDesign";
import { theme1, theme3 } from "../assets/branding/themes";
import NoDataFound from "../screens/GlobalComponents/NoDataFound";
import InLineLoader from "../screens/GlobalComponents/InLineLoader";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;
const defaultImageUrl = require("../assets/images/defaultImage.png");
const metersToMiles = (meters) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
};

const FavoriteBusinesList = ({ fetchedBusinesses, navigation }) => {

  const initialFavorites = fetchedBusinesses.reduce((acc, business) => {
    acc[business?.yelpBusiness?.id] = business.favorite || false; // Default to false if 'favorite' is not provided
    return acc;
  }, {});
  const [favorites, setFavorites] = useState(initialFavorites);
  const { currentTheme } = useContext(ThemeContext);
  const [loader, setLoader] = useState(true);
  const styles = getStyles(currentTheme);

  const toggleFavorite = (itemId) => {
    if (favorites[itemId]) {
      removeFavorite(itemId);
    } else {
      addFavorite(itemId);
    }
  };

  const addFavorite = async (itemId) => {
    try {
      const secureToken = await getStoredToken();

      const headers = {
        Authorization: `Bearer ${secureToken}`,
      };

      await axios.post(
        baseApiUrl + "/api/v1/favorites",
        { businessId: itemId },
        { headers }
      );

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [itemId]: true,
      }));
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };
  useEffect(() => {
    setLoader(false);
  }, [favorites]);

  const removeFavorite = async (itemId) => {
    try {
      const secureToken = await getStoredToken();
      const headers = {
        Authorization: `Bearer ${secureToken}`,
      };

      await axios.delete(baseApiUrl + "/api/v1/favorites", {
        data: { businessId: itemId },
        headers,
      });

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [itemId]: false,
      }));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <View style={styles.mostPopular}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {fetchedBusinesses && fetchedBusinesses?.length === 0 ? (
          loader === false ? (
            <NoDataFound />
          ) : (
            <InLineLoader />
          )
        ) : (
          fetchedBusinesses &&
          fetchedBusinesses.map((item) => (
            <MainCardDesign
              key={item?.yelpBusiness?.id} // Ensure uniqueness
              business={item}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    mostPopular: {
      flex: 1,
      padding: 10,
      backgroundColor: "#f4f4f4", // Blue background color
    },
    sectionHeading: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
      color: currentTheme.whiteColor, // White text color
    },
    mostPopularItem: {
      marginBottom: 16,
      width: WindowWidth / 1.03,
      padding: 16,
      shadowColor: "rgba(0,0,0,0.1)",
      elevation: 4,
      shadowOpacity: 4,
      borderRadius: 10,
      backgroundColor: theme3.GlobalBg, // White background color
    },
    favoriteIconContainer: {
      position: "absolute",
      top: 20, // Changed this
      right: 20, // Changed this
      zIndex: 2,
      padding: 5, // Added this to make it touch-friendly
      borderRadius: 20, // Added this for a rounded touch area
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Added a light background for visibility
    },
    mostPopularImage: {
      width: "100%",
      height: 200,
      marginBottom: 10,
      borderRadius: 10,
      resizeMode: "cover",
    },
    mostPopularName: {
      fontSize: 16,
      fontWeight: "bold",
      color: currentTheme.primaryColor, // Blue text color
    },
    mostPopularCity: {
      fontSize: 14,
      color: currentTheme.primaryColor, // Gray text color
    },
    mostPopularDistance: {
      fontSize: 12,
      color: currentTheme.primaryColor, // Gray text color
    },
    mostPopularPhone: {
      fontSize: 12,
      color: currentTheme.primaryColor, // Gray text color
    },
    ratingContainer: {
      flex: 1,
      alignSelf: "left",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    bookButton: {
      flex: 1,
      paddingVertical: 8,
      marginLeft: 5, // Added this
      borderRadius: 5,
      backgroundColor: currentTheme.primaryColor,
      alignItems: "center",
      elevation: 3, // Added shadow for Android
      shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
      shadowRadius: 2,
      shadowOpacity: 0.2,
    },
    bookButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: currentTheme.whiteColor, // White text color
    },
    extraInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    dealIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    dealText: {
      marginLeft: 5,
      color: currentTheme.primaryColor, // Gray text color
    },
    mapIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    mapText: {
      marginLeft: 5,
      color: currentTheme.primaryColor, // Gray text color
    },
    callButton: {
      flex: 1,
      paddingVertical: 8,
      marginRight: 5, // Added this
      borderRadius: 5,
      backgroundColor: "#FF0000",
      alignItems: "center",
      elevation: 3, // Added shadow for Android
      shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
      shadowRadius: 2,
      shadowOpacity: 0.2,
    },
    callButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF", // Change this to the color you want
    },
    buttonsContainer: {
      // New style for the button container
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    noAppointmentsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 50,
      borderRadius: 10,
      backgroundColor: "rgba(255, 165, 0, 0.1)", // Light orange background
      marginVertical: 20,
      marginHorizontal: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    noAppointmentsText: {
      fontSize: 18,
      fontWeight: "600",
      color: currentTheme.primaryColor,
      textAlign: "center",
    },
  });

export default FavoriteBusinesList;
