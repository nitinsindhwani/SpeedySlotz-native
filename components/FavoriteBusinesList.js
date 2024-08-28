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
import HeartIcon from "react-native-vector-icons/AntDesign";
import { ThemeContext } from "./ThemeContext";
import { LanguageContext } from "../api/LanguageContext";
import { getStoredToken } from "../api/ApiCall";
import { baseApiUrl } from "../api/Config";
import MainCardDesign from "../screens/GlobalComponents/MainCardDesign";
import NoDataFound from "../screens/GlobalComponents/NoDataFound";
import InLineLoader from "../screens/GlobalComponents/InLineLoader";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

const FavoriteBusinesList = ({ fetchedBusinesses, navigation }) => {
  const { currentTheme } = useContext(ThemeContext);
  const { translations } = useContext(LanguageContext);

  const initialFavorites = fetchedBusinesses.reduce((acc, business) => {
    acc[business?.yelpBusiness?.id] = business.favorite || false;
    return acc;
  }, {});

  const [favorites, setFavorites] = useState(initialFavorites);
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
        `${baseApiUrl}/api/v1/favorites`,
        { businessId: itemId },
        { headers }
      );

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [itemId]: true,
      }));
    } catch (error) {
      console.error(`${translations.failedToAddFavorite} ${error}`);
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

      await axios.delete(`${baseApiUrl}/api/v1/favorites`, {
        data: { businessId: itemId },
        headers,
      });

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [itemId]: false,
      }));
    } catch (error) {
      console.error(`${translations.failedToRemoveFavorite} ${error}`);
    }
  };

  return (
    <View style={styles.mostPopular}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {fetchedBusinesses && fetchedBusinesses.length === 0 ? (
          loader === false ? (
            <NoDataFound message={translations.noDataFound} />
          ) : (
            <InLineLoader message={translations.loading} />
          )
        ) : (
          fetchedBusinesses &&
          fetchedBusinesses.map((item) => (
            <MainCardDesign key={item?.yelpBusiness?.id} business={item} />
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
      backgroundColor: "#f4f4f4",
    },
    sectionHeading: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
      color: currentTheme.whiteColor,
    },
    mostPopularItem: {
      marginBottom: 16,
      width: WindowWidth / 1.03,
      padding: 16,
      shadowColor: "rgba(0,0,0,0.1)",
      elevation: 4,
      shadowOpacity: 4,
      borderRadius: 10,
      backgroundColor: currentTheme.GlobalBg,
    },
    favoriteIconContainer: {
      position: "absolute",
      top: 20,
      right: 20,
      zIndex: 2,
      padding: 5,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
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
      color: currentTheme.primaryColor,
    },
    mostPopularCity: {
      fontSize: 14,
      color: currentTheme.primaryColor,
    },
    mostPopularDistance: {
      fontSize: 12,
      color: currentTheme.primaryColor,
    },
    mostPopularPhone: {
      fontSize: 12,
      color: currentTheme.primaryColor,
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
      marginLeft: 5,
      borderRadius: 5,
      backgroundColor: currentTheme.primaryColor,
      alignItems: "center",
      elevation: 3,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      shadowOpacity: 0.2,
    },
    bookButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: currentTheme.whiteColor,
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
      color: currentTheme.primaryColor,
    },
    mapIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    mapText: {
      marginLeft: 5,
      color: currentTheme.primaryColor,
    },
    callButton: {
      flex: 1,
      paddingVertical: 8,
      marginRight: 5,
      borderRadius: 5,
      backgroundColor: "#FF0000",
      alignItems: "center",
      elevation: 3,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      shadowOpacity: 0.2,
    },
    callButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    buttonsContainer: {
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
      backgroundColor: "rgba(255, 165, 0, 0.1)",
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
