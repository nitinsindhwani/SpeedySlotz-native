import React, { useEffect, useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HeartIcon from "react-native-vector-icons/AntDesign";
import { LanguageContext } from "../../api/LanguageContext";
import { ThemeContext } from "../../components/ThemeContext";
import getImageSource from "../CallFuncGlobal/getImageSource";
import metersToMiles from "../CallFuncGlobal/metersoMiles";
import removeFavorite from "../CallFuncGlobal/removeFavorite";
import addToFav from "../CallFuncGlobal/addToFav";
import ChatAnim from "./ChatAnim";
import DealModal from "../../components/DealModal";
import DealIcons from "./DealIcons";
import { getStoredUser } from "../../api/ApiCall";
import { theme3 } from "../../assets/branding/themes";
import { getBadgeDetails } from "../../components/BadgeInfo";
import Styles from "../../assets/branding/GlobalStyles";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import uuid from "react-native-uuid";
import ReviewModal from "../Modals/ReviewModal";
import ShareIcon from "./ShareIcon";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

function MainCardDesign({ business }) {
  const navigation = useNavigation();
  const { currentTheme } = useContext(ThemeContext);

  // Extract language and translations from LanguageContext
  const { language, translations } = useContext(LanguageContext);

  const [showMore, setShowMore] = useState(false);
  const [isFav, setIsFav] = useState(business.favorite);
  const [selectedDeal, setSelectedDeal] = useState([]);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedBusinessIsRegistered, setSelectedBusinessIsRegistered] =
    useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setUserData(storedUserData);
    };

    fetchUserData();
  }, []);
  const openReviewModal = (businessId, isRegistered) => {
    setSelectedBusinessId(businessId);
    setSelectedBusinessIsRegistered(isRegistered);
    setIsReviewModalVisible(true);
  };
  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(business.yelpBusiness.id, setIsFav);
    } else {
      addToFav(business.yelpBusiness.id, setIsFav);
    }
  };
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
  const openDealModal = (dealData) => {
    const dealsArray = Array.isArray(dealData) ? dealData : [dealData];
    setSelectedDeal(dealsArray);
    setIsDealModalVisible(true);
  };

  const handleChatButtonPress = async () => {
    try {
      let user = userData;
      if (!user) {
        user = await getStoredUser();
        if (!user) {
          console.error("User data is not available.");

          return;
        }
      }

      if (business.yelpBusiness.is_registered) {
        const selectedChat = {
          chat_id: uuid.v4(),
          project_name: "New Job",
          user_id: user.user_id,
          username: user.username,
          business_id: business.yelpBusiness.id,
          business_name: business.yelpBusiness.name,
          chatMessages: [],
        };

        navigation.navigate("App", {
          screen: "ChatMessage",
          params: {
            currentChat: selectedChat,
          },
        });
      } else {
        console.log("Business is not registered for chat");
      }
    } catch (error) {
      console.error("Error in handleChatButtonPress:", error);
    }
  };

  const renderBadge = ({ item }) => {
    const badge = getBadgeDetails(item, translations); // Pass translations to getBadgeDetails
    if (!badge) return null;

    return (
      <View style={styles.CatList}>
        <Ionicons name={badge.icon} size={20} color={theme3.secondaryColor} />
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{badge.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.mostPopularItem}>
      <View style={styles.imageContainer}>
        <View style={styles.favoriteIconContainer}>
          <TouchableOpacity onPress={toggleFavorite}>
            <HeartIcon
              name={isFav ? "heart" : "hearto"}
              size={25}
              color={isFav ? "#FF0000" : "#FFA500"}
            />
          </TouchableOpacity>
        </View>
        <ShareIcon business={business} />
        <Image
          source={getImageSource(
            business?.yelpBusiness?.name,
            business?.yelpBusiness?.image_url
          )}
          style={styles.mostPopularImage}
        />
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.businessInfoContainer}>
          <Text style={styles.mostPopularName} numberOfLines={2}>
            {business.yelpBusiness.name}
          </Text>
          <View style={styles.ratingAndTierContainer}>
            <View style={styles.ratingsContainer}>
              <TouchableOpacity
                style={styles.ratingItem}
                onPress={() =>
                  openReviewModal(
                    business.yelpBusiness.id,
                    business.yelpBusiness.is_registered
                  )
                }
              >
                <Image
                  source={require("../../assets/newimage/google-icon.png")}
                  style={styles.ratingLogo}
                />
                <FontAwesome name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>
                  {business.yelpBusiness.google_rating
                    ? business.yelpBusiness.google_rating.toFixed(1)
                    : "0.0"}{" "}
                  ({business.yelpBusiness.google_review_count || 0})
                </Text>
              </TouchableOpacity>
              {business.yelpBusiness.is_registered && (
                <TouchableOpacity
                  style={styles.ratingItem}
                  onPress={() =>
                    openReviewModal(
                      business.yelpBusiness.id,
                      business.yelpBusiness.is_registered
                    )
                  }
                >
                  <Image
                    source={require("../../assets/icon-new.png")}
                    style={styles.myRatingLogo}
                  />
                  <FontAwesome name="star" size={16} color="#FFC107" />
                  <Text style={styles.ratingText}>
                    {business.yelpBusiness.rating
                      ? business.yelpBusiness.rating.toFixed(1)
                      : "0.0"}{" "}
                    ({business.yelpBusiness.review_count || 0})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.tierAndSlotsContainer}>
          {business.yelpBusiness.is_registered && (
            <TierBadge score={business.yelpBusiness.ratingScore} />
          )}
          {business?.slots?.length > 0 && (
            <View style={Styles.OneRow}>
              <View style={{ marginLeft: -6 }}>
                <ChatAnim />
              </View>
              <Text style={[styles.DescText, { fontSize: 12, marginLeft: 0 }]}>
                {translations.slotsAvailable}
              </Text>
            </View>
          )}
        </View>
      </View>

      {business.yelpBusiness.is_registered && (
        <>
          {showMore ? (
            <Text style={styles.DescText}>
              {business.yelpBusiness.details}
              <Text
                style={{ color: theme3.primaryColor }}
                onPress={() => setShowMore(false)}
              >
                {` ${translations.readLess}`}
              </Text>
            </Text>
          ) : (
            <Text style={styles.DescText}>
              {`${business?.yelpBusiness?.details?.slice(0, 30)}...`}
              <Text
                style={{ color: theme3.primaryColor }}
                onPress={() => setShowMore(true)}
              >
                {` ${translations.readMore}`}
              </Text>
            </Text>
          )}

          {showMore &&
            (business.yelpBusiness.badges &&
            business.yelpBusiness.badges.length > 0 ? (
              <FlatList
                data={business.yelpBusiness.badges}
                horizontal={true}
                renderItem={renderBadge}
                keyExtractor={(badge, index) => `badge-${index}`}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noSlotsText}>
                {translations.noBadgesAvailable}
              </Text>
            ))}
        </>
      )}

      {business.yelpBusinessCategory?.serviceTypes?.length > 0 && (
        <>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[styles.mostPopularName, { fontSize: 14 }]}>
              {translations.categories}
            </Text>
          </View>

          <FlatList
            data={business.yelpBusinessCategory?.serviceTypes || []}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <SpecialityListII item={item} />}
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
              {business.yelpBusinessLocation.city}
            </Text>
          </View>
          {business.yelpBusiness.is_registered && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`tel:${business.yelpBusiness.phone}`)
              }
            >
              <View style={styles.dealIconContainer}>
                <FontAwesome
                  name="phone"
                  size={20}
                  color={theme3.secondaryColor}
                />
                <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                  {business.yelpBusiness.phone}
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
              {metersToMiles(business.yelpBusiness.distance) === "0.00"
                ? "N/A"
                : `${metersToMiles(business.yelpBusiness.distance)} ${
                    translations.miles
                  }`}
            </Text>
          </View>
          {business.yelpBusiness.is_registered && (
            <TouchableOpacity onPress={handleChatButtonPress}>
              <View style={Styles.OneRow}>
                <View style={{ marginLeft: -6 }}>
                  <ChatAnim />
                </View>
                <Text style={[styles.DescText, { marginLeft: 0 }]}>
                  {translations.chatNow}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.extraInfoContainer}>
          <TouchableOpacity
            style={styles.mapIconContainer}
            onPress={() => {
              const address1 = business.yelpBusinessLocation?.address1
                ? business.yelpBusinessLocation.address1 + ","
                : "";
              const city = business.yelpBusinessLocation?.city || "";
              const mapQuery = encodeURIComponent(`${address1}${city}`);
              if (mapQuery) {
                Linking.openURL(`http://maps.apple.com/?q=${mapQuery}`);
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
          {business.yelpBusinessDeal && (
            <TouchableOpacity
              style={styles.dealIconContainer}
              onPress={() => openDealModal(business.yelpBusinessDeal)}
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
        {business.yelpBusiness.is_registered ? (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              navigation.navigate("DetailScreen", { business: business })
            }
          >
            <Text style={styles.bookButtonText}>{translations.bookNow}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {
              const phoneNumber = business.yelpBusiness.phone;
              Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
                console.error("An error occurred", err);
                alert(translations.cannotPlaceCall);
              });
            }}
          >
            <Text style={styles.callButtonText}>{translations.callNow}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ReviewModal
        isVisible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        businessId={selectedBusinessId}
        isRegistered={selectedBusinessIsRegistered}
      />
      <DealModal
        isVisible={isDealModalVisible}
        deals={selectedDeal}
        onClose={() => setIsDealModalVisible(false)}
      />
    </View>
  );
}

export default MainCardDesign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },

  mostPopularImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 10,
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
  mostPopularItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
  },
  DescText: {
    fontSize: 14,
    color: theme3.fontColorI,
  },
  mostPopularName: {
    fontSize: 16,
    fontWeight: "bold",
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
  extraInfoContainer: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dealIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mostPopularCity: {
    fontSize: 14,
    color: theme3.fontColorI,
  },
  mapIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  CatListII: {
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
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
    paddingVertical: 8,
    marginLeft: 5,
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
    color: theme3.light,
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

  businessInfoContainer: {
    marginBottom: 10,
  },
  mostPopularName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 5,
  },
  ratingAndTierContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: "5px",
  },
  ratingsContainer: {
    width: "40%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tierAndSlotsContainer: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  ratingItem: {
    marginBottom: 5,
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
  carouselOuterContainer: {
    width: WindowWidth,
    height: 200,
    marginBottom: 10,
  },
  carouselImage: {
    width: WindowWidth,
    height: 200,
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  paginationDotActive: {
    backgroundColor: theme3.primaryColor,
  },
});
