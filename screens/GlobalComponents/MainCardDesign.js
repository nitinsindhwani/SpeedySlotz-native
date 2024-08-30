import React, { useEffect, useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
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
import { getStoredUser } from "../../api/ApiCall";
import { theme3 } from "../../assets/branding/themes";
import { getBadgeDetails } from "../../components/BadgeInfo";
import Styles from "../../assets/branding/GlobalStyles";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import uuid from "react-native-uuid";

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

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setUserData(storedUserData);
    };

    fetchUserData();
  }, []);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(business.yelpBusiness.id, setIsFav);
    } else {
      addToFav(business.yelpBusiness.id, setIsFav);
    }
  };

  const openDealModal = (dealData) => {
    const dealsArray = Array.isArray(dealData) ? dealData : [dealData];
    setSelectedDeal(dealsArray);
    setIsDealModalVisible(true);
  };

  const handleChatButtonPress = async () => {
    console.log("handleChatButtonPress called");
    try {
      let user = userData;
      if (!user) {
        user = await getStoredUser();
        if (!user) {
          console.error("User data is not available.");

          return;
        }
      }
      console.log("User data:", user);
      console.log("Business data:", business);

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

        console.log("Navigating to ChatScreen with data:", selectedChat);

        navigation.navigate("App", {
          screen: "ChatScreen",
          params: {
            chatData: selectedChat,
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
      <View style={styles.favoriteIconContainer}>
        <TouchableOpacity onPress={toggleFavorite}>
          <HeartIcon
            name={isFav ? "heart" : "hearto"}
            size={25}
            color={isFav ? "#FF0000" : "#FFA500"}
          />
        </TouchableOpacity>
      </View>

      <Image
        source={getImageSource(
          business?.yelpBusiness?.name,
          business?.yelpBusiness?.image_url
        )}
        style={styles.mostPopularImage}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[styles.mostPopularName, { width: "70%" }]}>
          {business.yelpBusiness.name}
        </Text>

        {business?.slots?.length > 0 && (
          <View style={Styles.OneRow}>
            <View style={{ marginLeft: -20 }}>
              <ChatAnim />
            </View>
            <Text style={[styles.DescText, { marginLeft: 0 }]}>
              {translations.slotsAvailable}
            </Text>
          </View>
        )}
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
              {metersToMiles(business.yelpBusiness.distance)} miles
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
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: "cover",
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
  favoriteIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
