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
  Linking,
  Platform,
  Share,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import DealIcon from "react-native-vector-icons/FontAwesome5";
import HeartIcon from "react-native-vector-icons/AntDesign";
import { ThemeContext } from "../components/ThemeContext";
import { getStoredToken, getStoredUser } from "../api/ApiCall";
import { getBadgeDetails } from "../components/BadgeInfo";
import { LanguageContext } from "../api/LanguageContext";
import ShareIcon from "../screens/GlobalComponents/ShareIcon";
import uuid from "react-native-uuid";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import SoftLoadImage from "../components/SoftLoadImage";
import { apiKey, baseApiUrl } from "../api/Config";
import { theme3 } from "../assets/branding/themes";
import Styles from "../assets/branding/GlobalStyles";
import { FlatList } from "react-native-gesture-handler";
import DealIcons from "../screens/GlobalComponents/DealIcons";
import DealModal from "./DealModal";
import ChatAnim from "../screens/GlobalComponents/ChatAnim";
import ReviewModal from "../screens/Modals/ReviewModal";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;
const defaultImageUrl = require("../assets/images/defaultImage.png");

const metersToMiles = (meters) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
};

const PopularBusinessList = ({ fetchedBusinesses, navigation }) => {
  const initialFavorites = fetchedBusinesses.reduce((acc, business) => {
    acc[business.id] = business.favorite || false;
    return acc;
  }, {});

  const [favorites, setFavorites] = useState(initialFavorites);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState([]);
  const { translations } = useContext(LanguageContext);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedBusinessIsRegistered, setSelectedBusinessIsRegistered] =
    useState(null);
  const openDealModal = (dealData) => {
    const dealsArray = Array.isArray(dealData) ? dealData : [dealData];
    setSelectedDeal(dealsArray);
    setIsDealModalVisible(true);
  };

  const openReviewModal = (businessId, isRegistered) => {
    setSelectedBusinessId(businessId);
    setSelectedBusinessIsRegistered(isRegistered);
    setIsReviewModalVisible(true);
  };

  const renderBadge = ({ item }) => {
    const badge = getBadgeDetails(item, translations);
    if (!badge) return null;

    return (
      <View style={styles.CatList}>
        <Ionicons name={badge.icon} size={20} color={theme3.secondaryColor} />
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{badge.name}</Text>
      </View>
    );
  };

  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setUserData(storedUserData);
    };

    fetchUserData();
  }, []);

  const toggleFavorite = (itemId, changeTepFav) => {
    if (favorites[itemId]) {
      removeFavorite(itemId, changeTepFav);
    } else {
      addFavorite(itemId, changeTepFav);
    }
  };

  const handleChatButtonPress = async (business) => {
    try {
      let user = userData;
      if (!user) {
        user = await getStoredUser();
        if (!user) {
          console.error("User data is not available.");
          return;
        }
      }
      if (business.is_registered) {
        const selectedChat = {
          chat_id: uuid.v4(),
          project_name: "New Job",
          user_id: user.user_id,
          username: user.username,
          business_id: business.id,
          business_name: business.name,
          chatMessages: [],
        };

        navigation.navigate("App", {
          screen: "ChatScreen",
          params: {
            chatData: selectedChat,
          },
        });
      }
    } catch (error) {
      console.error("Error in handleChatButtonPress:", error);
    }
  };
  const addFavorite = async (itemId, changeTepFav) => {
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
      changeTepFav(true);
    } catch (error) {
      changeTepFav(false);
      console.log("Failed to add favorite:", error);
    }
  };

  const removeFavorite = async (itemId, changeTepFav) => {
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
      changeTepFav(false);
      console.log("function remove");
    } catch (error) {
      changeTepFav(true);
      console.error("Failed to remove favorite:", error);
    }
  };

  const getImageSource = (business) => {
    try {
      if (business.yelpBusiness && business.yelpBusiness.image_url) {
        const image_url = business.yelpBusiness.image_url;

        if (typeof image_url === "object" && image_url !== null) {
          if (image_url.Main && image_url.Main.trim() !== "") {
            return { uri: image_url.Main };
          }
          const firstImageUrl = Object.values(image_url).find(
            (url) => typeof url === "string" && url.trim() !== ""
          );
          if (firstImageUrl) {
            return { uri: firstImageUrl };
          }
        }

        if (typeof image_url === "string" && image_url.trim() !== "") {
          return { uri: image_url };
        }
      }

      // Handle Google photo reference
      if (
        business.yelpBusiness &&
        business.yelpBusiness.photos &&
        business.yelpBusiness.photos[0] &&
        business.yelpBusiness.photos[0].name
      ) {
        return {
          uri: `https://places.googleapis.com/v1/${business.yelpBusiness.photos[0].name}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`,
        };
      }

      return defaultImageUrl;
    } catch (error) {
      console.error("Error in getImageSource:", error);
      return defaultImageUrl;
    }
  };
  function DetailCard({ item, index }) {
    const [ExpandCat, setExpandCat] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [isFav, setIsFav] = useState(item.favorite);

    useEffect(() => {
      setIsFav(item.favorite);
    }, [item.favorite]);

    function changeTepFav(val) {
      setIsFav(val);
    }

    const getEarliestSlot = (slots) => {
      if (!slots || slots.length === 0) return null;

      return slots.reduce((earliest, slot) => {
        const slotDate = new Date(`${slot.date}T${slot.startTime}`);
        if (!earliest || slotDate < earliest) {
          return slotDate;
        }
        return earliest;
      }, null);
    };

    const formatSlotDateTime = (date) => {
      if (!date) return "";
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const time = date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      return `${month} ${day} - ${time}`;
    };

    const earliestSlot = getEarliestSlot(item.slots);
    const bookButtonText = earliestSlot
      ? `Book | ${formatSlotDateTime(earliestSlot)}`
      : translations.bookNow; // Changed this line

    const getTierLevel = (score) => {
      if (score < 100)
        return { name: "Trailblazer", color: "#B8860B", icon: "trail-sign" };
      if (score >= 100 && score <= 249)
        return { name: "Rookie", color: "#32CD32", icon: "fitness" };
      if (score >= 250 && score <= 499)
        return { name: "Ace", color: "#1E90FF", icon: "diamond" };
      if (score >= 500 && score <= 749)
        return { name: "Pro", color: "#9370DB", icon: "medal" };
      if (score >= 750 && score <= 999)
        return { name: "Elite", color: "#FF4500", icon: "star" };
      if (score >= 1000)
        return { name: "Champion", color: "#FFD700", icon: "trophy" };
      return { name: "Unranked", color: "#808080", icon: "shield" };
    };

    const TierBadge = ({ score }) => {
      const tier = getTierLevel(score);
      return (
        <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
          <Ionicons name={tier.icon} size={14} color="white" />
          <Text style={styles.tierBadgeText}>{tier.name}</Text>
        </View>
      );
    };

    function SpecialityListII({ item }) {
      return (
        <View style={styles.CatListII}>
          <Text
            style={{
              color: theme3.light,
              marginLeft: 5,
              fontSize: 11,
            }}
          >
            {item}
          </Text>
        </View>
      );
    }

    return (
      <View key={index} style={styles.mostPopularItem}>
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource(item)}
            style={styles.mostPopularImage}
          />
          <View style={styles.favoriteIconContainer}>
            <TouchableOpacity onPress={() => handleFav(item.yelpBusiness.id)}>
              <HeartIcon
                name={isFav ? "heart" : "hearto"}
                size={25}
                color={isFav ? "#FF0000" : "#FFA500"}
              />
            </TouchableOpacity>
          </View>

          <ShareIcon business={item} />
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.businessInfoContainer}>
            <View style={styles.nameAndHiredContainer}>
              <Text style={styles.mostPopularName} numberOfLines={1}>
                {item.yelpBusiness.name}
              </Text>
            </View>

            <View style={styles.ratingAndTierContainer}>
              <View style={styles.ratingsContainer}>
                <TouchableOpacity
                  style={styles.ratingItem}
                  onPress={() =>
                    openReviewModal(
                      item.yelpBusiness.id,
                      item.yelpBusiness.is_registered
                    )
                  }
                >
                  <Image
                    source={require("../assets/newimage/google-icon.png")}
                    style={styles.ratingLogo}
                  />
                  <FontAwesome name="star" size={16} color="#FFC107" />
                  <Text style={styles.ratingText}>
                    {item.yelpBusiness.google_rating
                      ? item.yelpBusiness.google_rating.toFixed(1)
                      : "0.0"}{" "}
                    ({item.yelpBusiness.google_review_count || 0})
                  </Text>
                </TouchableOpacity>
                {item.yelpBusiness.is_registered && (
                  <TouchableOpacity
                    style={styles.ratingItem}
                    onPress={() =>
                      openReviewModal(
                        item.yelpBusiness.id,
                        item.yelpBusiness.is_registered
                      )
                    }
                  >
                    <Image
                      source={require("../assets/icon-new.png")}
                      style={styles.myRatingLogo}
                    />
                    <FontAwesome name="star" size={16} color="#FFC107" />
                    <Text style={styles.ratingText}>
                      {item.yelpBusiness.rating
                        ? item.yelpBusiness.rating.toFixed(1)
                        : "0.0"}{" "}
                      ({item.yelpBusiness.review_count || 0})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.slotsAvailableContainer}>
            {item.yelpBusiness.is_registered && (
              <TierBadge score={item.yelpBusiness.ratingScore} />
            )}
            {item?.slots?.length > 0 && (
              <View style={Styles.OneRow}>
                <View style={{ marginRight: 4 }}>
                  <ChatAnim />
                </View>
                <Text style={styles.slotsAvailableText}>
                  {translations.slotsAvailable}
                </Text>
              </View>
            )}
          </View>
        </View>
        {item.completedSlots > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="people" size={20} color={theme3.fontColor} />
            <Text style={styles.previouslyHiredText}>
              Previously hired by {item.completedSlots} neighbor
              {item.completedSlots !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
        {item.yelpBusiness.is_registered && (
          <>
            {showMore ? (
              <Text style={styles.DescText}>
                {item.yelpBusiness.details}
                <Text
                  style={{ color: theme3.primaryColor }}
                  onPress={() => setShowMore(false)}
                >
                  {" "}
                  {translations.readLess}
                </Text>
              </Text>
            ) : (
              <Text style={styles.DescText}>
                {`${item?.yelpBusiness?.details?.slice(0, 30)}...`}
                <Text
                  style={{ color: theme3.primaryColor }}
                  onPress={() => setShowMore(true)}
                >
                  {" "}
                  {translations.readMore}
                </Text>
              </Text>
            )}

            {item.yelpBusiness.badges && item.yelpBusiness.badges.length > 0 ? (
              <FlatList
                data={item.yelpBusiness.badges}
                horizontal={true}
                renderItem={renderBadge}
                keyExtractor={(badge, index) => `badge-${index}`}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noSlotsText}>
                {translations.noBadgesAvailable}
              </Text>
            )}
          </>
        )}

        {item.yelpBusinessCategory?.serviceTypes?.length > 0 && (
          <>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text
                style={[
                  styles.mostPopularName,
                  { fontSize: 14, marginLeft: 0 },
                ]}
              >
                {translations.categories}
              </Text>
            </View>

            <FlatList
              data={item.yelpBusinessCategory?.serviceTypes || []}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: serviceType, index }) => (
                <SpecialityListII item={serviceType} index={index} />
              )}
              keyExtractor={(serviceType, index) => index.toString()}
            />
          </>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.extraInfoContainer}>
            <View style={styles.dealIconContainer}>
              <MaterialIcons
                name="location-city"
                size={18}
                color={theme3.primaryColor}
              />
              <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                {item.yelpBusinessLocation.city}
                {","} {item.yelpBusinessLocation.state}
              </Text>
            </View>

            {item.yelpBusiness.is_registered && (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`tel:${item.yelpBusiness.phone}`)
                }
              >
                <View style={styles.dealIconContainer}>
                  <FontAwesome
                    name="phone"
                    size={20}
                    color={theme3.secondaryColor}
                  />
                  <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                    {item.yelpBusiness.phone}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.extraInfoContainer}>
            <View style={styles.dealIconContainer}>
              <MapIcon
                name="map-marker-alt"
                size={16}
                color={theme3.primaryColor}
              />
              <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                {metersToMiles(item.yelpBusiness.distance)} {translations.miles}
              </Text>
            </View>

            {item.yelpBusiness.is_registered && (
              <View style={Styles.OneRow}>
                <View style={{ marginLeft: -6 }}>
                  <ChatAnim />
                </View>
                <TouchableOpacity
                  onPress={() => handleChatButtonPress(item.yelpBusiness)}
                >
                  <Text style={[styles.DescText, { marginLeft: 0 }]}>
                    {translations.chatNow}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.extraInfoContainer}>
            <TouchableOpacity
              style={styles.mapIconContainer}
              onPress={() => {
                const address = item.yelpBusinessLocation
                  ? item.yelpBusinessLocation.displayAddress[0]
                  : item.yelpBusiness.formattedAddress;
                const mapQuery = address ? encodeURIComponent(address) : "";

                if (mapQuery) {
                  const url =
                    Platform.OS === "ios"
                      ? `http://maps.apple.com/?q=${mapQuery}`
                      : `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

                  Linking.openURL(url).catch((err) =>
                    console.error("An error occurred", err)
                  );
                } else {
                  console.warn("No address available for directions");
                }
              }}
            >
              <MaterialIcons
                name="directions"
                size={18}
                color={theme3.primaryColor}
              />
              <Text style={[styles.mostPopularCity, { marginTop: 0 }]}>
                {translations.directions}
              </Text>
            </TouchableOpacity>
            {item.yelpBusinessDeal && (
              <TouchableOpacity
                style={styles.dealIconContainer}
                onPress={() => {
                  openDealModal(item.yelpBusinessDeal);
                }}
              >
                <DealIcons />
                <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                  {translations.deals}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {item.yelpBusiness.is_registered ? (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() =>
                navigation.navigate("DetailScreen", { business: item })
              }
            >
              <Text style={styles.bookButtonText}>{bookButtonText}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => {
                const phoneNumber = item.yelpBusiness.phone;
                Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
                  console.error("An error occurred", err);
                  alert(
                    "Cannot place the call, please try it from your phone keypad."
                  );
                });
              }}
            >
              <Text style={styles.callButtonText}>
                {translations.callNow}{" "}
                {/* Use translation for the button text */}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <DealModal
            isVisible={isDealModalVisible}
            deals={selectedDeal}
            onClose={() => setIsDealModalVisible(false)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mostPopular}>
      <ScrollView>
        {fetchedBusinesses &&
          fetchedBusinesses.map((item, index) => (
            <DetailCard
              key={item.yelpBusiness.id}
              item={{ ...item, favorite: favorites[item.yelpBusiness.id] }}
              index={index}
            />
          ))}
      </ScrollView>
      {fetchedBusinesses && fetchedBusinesses.length === 0 && (
        <View style={styles.noBusinessContainer}>
          <FontAwesome name="frown-o" size={50} color={theme3.secondaryColor} />
          <Text style={styles.noBusinessPrimaryText}>
            {translations.noMatchingBusinesses}
          </Text>
          <Text style={styles.noBusinessSecondaryText}>
            {translations.increaseRadiusOrChooseDifferentCategory}
          </Text>
        </View>
      )}
      <ReviewModal
        isVisible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        businessId={selectedBusinessId}
        isRegistered={selectedBusinessIsRegistered}
      />
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    mostPopular: {
      height: WindowHeight,
      width: WindowWidth,
    },
    nameAndJobsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    completedJobsBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0, 128, 0, 0.1)", // Light green background
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    completedJobsText: {
      fontSize: 12,
      color: theme3.primaryColor,
      marginLeft: 4,
      fontWeight: "600",
    },
    mostPopularItem: {
      marginTop: 16,
      width: WindowWidth / 1.03,
      padding: 16,
      shadowColor: "rgba(0,0,0,0.1)",
      elevation: 4,
      shadowOpacity: 4,
      borderRadius: 10,
      backgroundColor: theme3.GlobalBg,
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      marginBottom: 10,
    },
    mostPopularImage: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      resizeMode: "cover",
    },
    favoriteIconContainer: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 2,
      padding: 5,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },

    businessNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      flex: 1,
    },
    mostPopularName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme3.fontColor,
      marginTop: 8,
    },
    tierBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    tierBadgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      marginLeft: 4,
    },
    slotsAvailableContainer: {
      marginLeft: "auto",
      marginTop: 5,
    },
    slotsAvailableText: {
      fontSize: 12,
      color: theme3.fontColorI,
    },
    mostPopularCity: {
      fontSize: 14,
      color: theme3.fontColorI,
    },
    DescText: {
      fontSize: 14,
      color: theme3.fontColorI,
    },
    extraInfoContainer: {
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginTop: 10,
    },
    dealIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    mapIconContainer: {
      flexDirection: "row",
      alignItems: "center",
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
    noBusinessContainer: {
      marginTop: 5,
      padding: 20,
      borderRadius: 10,
      backgroundColor: "#ffff",
      alignItems: "center",
    },
    noBusinessPrimaryText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      color: theme3.fontColor,
    },
    noBusinessSecondaryText: {
      marginTop: 10,
      fontSize: 14,
      textAlign: "center",
      color: theme3.fontColor,
    },
    CatList: {
      padding: 15,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme3.primaryColor,
      paddingBottom: 5,
      paddingTop: 5,
      margin: 5,
    },
    CatListII: {
      padding: 15,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme3.primaryColor,
      paddingBottom: 5,
      paddingTop: 5,
      margin: 5,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    bookButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 5,
      backgroundColor: theme3.primaryColor,
      alignItems: "center",
      elevation: 3,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      shadowOpacity: 0.2,
    },
    bookButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    callButton: {
      flex: 1,
      paddingVertical: 12,
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

    businessInfoContainer: {},
    mostPopularName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme3.fontColor,
    },
    ratingAndTierContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    ratingsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    previouslyHiredText: {
      fontSize: 14,
      color: theme3.fontColor,
      fontStyle: "italic",
      padding: 5,
    },
    ratingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    ratingLogo: {
      width: 16,
      height: 16,
      marginRight: 5,
    },
    myRatingLogo: {
      width: 26,
      height: 26,
      marginRight: 5,
    },
    ratingText: {
      fontSize: 14,
      color: theme3.fontColor,
      marginLeft: 3,
    },
    tierBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tierBadgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      marginLeft: 4,
    },
  });

export default PopularBusinessList;
