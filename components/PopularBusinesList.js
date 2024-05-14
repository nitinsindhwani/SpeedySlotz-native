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
import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
import { translation } from "../assets/translations/translations";
import { getStoredToken, getStoredUser } from "../api/ApiCall";
import { getBadgeDetails } from "../components/BadgeInfo";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import {
  FontAwesome,
  Octicons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons"; // Import the icon library
import SoftLoadImage from "../components/SoftLoadImage";
import { baseApiUrl } from "../api/Config";
import { theme3 } from "../assets/branding/themes";
import Styles from "../assets/branding/GlobalStyles";
import { FlatList } from "react-native-gesture-handler";
import Specialieites from "../assets/data/SpecialitiesData";
import AvailableSlots from "../assets/data/Availableslots";
import { Entypo } from "@expo/vector-icons";
import DealIcons from "../screens/GlobalComponents/DealIcons";
import DealModal from "./DealModal";
// import { faV } from "@fortawesome/free-solid-svg-icons";
// import { set } from "date-fns";
import ChatAnim from "../screens/GlobalComponents/ChatAnim";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;
const defaultImageUrl = require("../assets/images/defaultImage.png");
const metersToMiles = (meters) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
};
const renderBusinessImage = (item) => {
  const imageUrlMap = item.yelpBusiness.image_url_map;
  const imageKeys = Object.keys(imageUrlMap);
  let mainImageKey;

  // Find the key marked as the main image
  for (const key of imageKeys) {
    if (imageUrlMap[key].main) {
      mainImageKey = key;
      break;
    }
  }

  return (
    <Image
      source={
        mainImageKey
          ? { uri: imageUrlMap[mainImageKey] }
          : imageKeys.length > 0
          ? { uri: imageUrlMap[imageKeys[0]] }
          : defaultImageUrl
      }
      style={Styles.mostPopularImage}
    />
  );
};
const PopularBusinessList = ({ fetchedBusinesses, navigation }) => {
  const initialFavorites = fetchedBusinesses.reduce((acc, business) => {
    acc[business.id] = business.favorite || false; // Default to false if 'favorite' is not provided
    // Log the business ID if it's marked as a favorite

    return acc;
  }, {});
  const [favorites, setFavorites] = useState(initialFavorites);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  // Ensure that `selectedDeal` is initialized as an array, even if empty
  const [selectedDeal, setSelectedDeal] = useState([]);

  // When opening the modal, make sure `selectedDeal` is always an array
  const openDealModal = (dealData) => {
    const dealsArray = Array.isArray(dealData) ? dealData : [dealData];
    setSelectedDeal(dealsArray);
    setIsDealModalVisible(true);
  };

  const desc = "Description will be written here";
  const renderBadge = ({ item }) => {
    const badge = getBadgeDetails(item); // Correctly call the function
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
      const storedUserData = await getStoredUser(); // Await the async call
      setUserData(storedUserData); // Set userData state
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once on mount

  const filters = [
    { name: "Top Rated", icon: "star" },
    { name: "Verified", icon: "checkmark-circle" },
    { name: "Low Price", icon: "pricetag" },
    { name: "Insurance", icon: "shield-checkmark" },
    { name: "5 years+ old", icon: "time" },
    { name: "Licensed", icon: "document-text" },
    { name: "Response in 1 Hr", icon: "timer" },
    { name: "Top Professional (Yearly)", icon: "medal" },
    { name: "Fair Business", icon: "business" },
    { name: "Most Busy", icon: "analytics" },
    { name: "Punctuality Award", icon: "time-outline" },
    { name: "New", icon: "newspaper" },
  ];
  const toggleFavorite = (itemId,changeTepFav) => {
    if (favorites[itemId]) {
      removeFavorite(itemId,changeTepFav);
    } else {
      addFavorite(itemId,changeTepFav);
    }
  };
  const handleChatButtonPress = async (business) => {
    let user = userData;
    if (!user) {
      user = await getStoredUser(); // Synchronously get user data if not already loaded
      if (!user) {
        console.error("User data is not available.");
        return; // Optionally, handle this case (e.g., show an error)
      }
    }
    if (business.is_registered) {
      const selectedChat = {
        chat_id: uuidv4(),
        project_name: "New Job",
        user_id: user.user_id, // Use local user variable
        username: user.username, // Use local user variable
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
  };

  const addFavorite = async (itemId,changeTepFav) => {
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
      changeTepFav(true)
      console.log("function fav")

    } catch (error) {
      changeTepFav(false)

      console.log("Failed to add favorite:", error);
    }
  };

  const getImageSource = (businessName, image_url) => {
    // Check if image_url is an object with properties
    if (
      typeof image_url === "object" &&
      image_url !== null &&
      Object.keys(image_url).length > 0
    ) {
      // Look for a key named "Main" first
      if (image_url.Main && image_url.Main.trim() !== "") {
        return { uri: image_url.Main };
      }
      // If no "Main", use the first available key
      const firstImageUrl = Object.values(image_url).find(
        (url) => typeof url === "string" && url.trim() !== ""
      );
      if (firstImageUrl) {
        return { uri: firstImageUrl };
      }
    }

    // If image_url is a string and not empty, return it
    if (typeof image_url === "string" && image_url.trim() !== "") {
      return { uri: image_url };
    }

    // Fallback to the default image
    return defaultImageUrl;
  };

  const removeFavorite = async (itemId,changeTepFav) => {

    try {
      const secureToken = await getStoredToken();

      const headers = {
        Authorization: `Bearer ${secureToken}`,
      };

      await axios.delete(baseApiUrl + "/api/v1/favorites", {
        data: { businessId: itemId },
        headers,
      });

      // setFavorites((prevFavorites) => ({
      //   ...prevFavorites,
      //   [itemId]: false,
      // }));
      changeTepFav(false)
      console.log("function remove")

    } catch (error) {
      changeTepFav(true)

      console.error("Failed to remove favorite:", error);
    }
  };



  function DetailCard({ item, index }) {
    const [ExpandCat, setExpandCat] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [isFav,setIsFav]=useState(item.favorite)
    function changeTepFav(val){
      console.log("function child",val)
      setIsFav(val)
    }

    function handleFav(itemId){
      if(isFav===true){
        setIsFav(false)
        removeFavorite(itemId,changeTepFav);
      }
      else{
        addFavorite(itemId,changeTepFav)
        setIsFav(true)
      }
    }
  
    function SpecialityList({ item }) {
      return (
        <View style={styles.CatList}>
          {/* Ensure you're using a valid icon name for Ionicons here */}
          <Ionicons name={item.icon} size={18} color={theme3.secondaryColor} />
          <Text style={{ color: theme3.light, marginLeft: 5, fontSize: 11 }}>
            {item.name} {/* Use item.name to render the name */}
          </Text>
        </View>
      );
    }

    function SpecialityListII({ item }) {
      return (
        <View style={styles.CatListII}>
          {/* <Ionicons name={item.icon} size={20} color={theme3.secondaryColor} /> */}
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
    function AvailableSlotsList({ item }) {
      return (
        <View style={styles.CatList}>
          {/* <Ionicons name={item.icon} size={20} color={theme3.secondaryColor} /> */}
          <Text style={{ color: theme3.light, marginLeft: 5 }}>
            {item.title}
          </Text>
        </View>
      );
    }

    return (
      <View key={index} style={styles.mostPopularItem}>
        <View style={styles.favoriteIconContainer}>
          <TouchableOpacity
            onPress={() => {
              // setIsFav()
           
              // toggleFavorite(item.yelpBusiness.id,changeTepFav)
               handleFav(item.yelpBusiness.id)
            }
            }
          >
            <HeartIcon
              name={isFav=== true ? "heart" : "hearto"}
              size={25}
              color={isFav ===true ? "#FF0000" : "#FFA500"}
            />

          
          </TouchableOpacity>
        </View>
        <Image
          source={getImageSource(
            item.yelpBusiness.name,
            item.yelpBusiness.image_url
          )}
          style={styles.mostPopularImage}
        />

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.mostPopularName, { width: "70%" }]}>
            {item.yelpBusiness.name}
          </Text>

          {item?.slots?.length > 0 && (
            <View style={Styles.OneRow}>
              {/* <Octicons name="dot-fill" size={20} color={theme3.send} /> */}
              <View
           style={{marginLeft:-20}}
           >
            <ChatAnim/>
            </View>
              <Text style={[styles.DescText, { marginLeft: 0 }]}>
                Slots Available
              </Text>
            </View>
          )}
        </View>

        {item.yelpBusiness.is_registered && (
          <>
            {/* Description with Read More/Less functionality */}
            {showMore ? (
              <Text style={styles.DescText}>
                {item.yelpBusiness.details}
                <Text
                  style={{ color: theme3.primaryColor }}
                  onPress={() => setShowMore(false)}
                >
                  {" "}
                  Read Less...
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
                  Read More...
                </Text>
              </Text>
            )}

            {/* Display badges or 'No badges available' based on condition */}
            {showMore &&
              (item.yelpBusiness.badges &&
              item.yelpBusiness.badges.length > 0 ? (
                <FlatList
                  data={item.yelpBusiness.badges}
                  horizontal={true}
                  renderItem={renderBadge} // Ensure this function is defined to render each badge
                  keyExtractor={(badge, index) => `badge-${index}`}
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.noSlotsText}>No badges available.</Text>
              ))}
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
                Categories
              </Text>
            </View>

            <FlatList
              data={item.yelpBusinessCategory?.serviceTypes || []}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: serviceType, index }) => {
                // Directly return SpecialityListII component for each serviceType
                return <SpecialityListII item={serviceType} index={index} />;
              }}
              keyExtractor={(serviceType, index) => index.toString()} // Add a keyExtractor for good practice
            />
          </>
        )}
        {/* <Text>item.slot</Text> */}

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
                {metersToMiles(item.yelpBusiness.distance)} miles
              </Text>
            </View>

            {item.yelpBusiness.is_registered && (
              <View style={Styles.OneRow}>
                {/* <Octicons name="dot-fill" size={20} color={theme3.send} /> */}
                <View
            style={{marginLeft:-6}}
            >

            <ChatAnim/>
            </View>
                <TouchableOpacity
                  onPress={() => handleChatButtonPress(item.yelpBusiness)}
                >
                  <Text style={[styles.DescText, { marginLeft: 0 }]}>
                    Chat Now
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.extraInfoContainer}>
            <TouchableOpacity
              style={styles.mapIconContainer}
              onPress={() => {
                const address1 = item.yelpBusinessLocation?.address1
                  ? item.yelpBusinessLocation.address1 + ","
                  : "";
                const city = item.yelpBusinessLocation?.city || "";
                const mapQuery = encodeURIComponent(`${address1}${city}`);
                if (mapQuery) {
                  Linking.openURL(`http://maps.apple.com/?q=${mapQuery}`);
                } else {
                  // Optionally, handle the case where there is no address to navigate to
                  // e.g., alert the user or log an error
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
                Directions
              </Text>
            </TouchableOpacity>
            {item.yelpBusinessDeal && (
              <TouchableOpacity
                style={styles.dealIconContainer}
                onPress={() => {
                  console.log("Deal data at press:", item.yelpBusinessDeal);
                  openDealModal(item.yelpBusinessDeal);
                }}
              >
                <DealIcons />
                <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                  Deals
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
              <Text style={styles.bookButtonText}>Book Now</Text>
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
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {/* Your existing components */}

          <DealModal
            isVisible={isDealModalVisible}
            deals={selectedDeal} // Ensure this matches the prop expected by the modal
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
            <DetailCard key={item.yelpBusiness.id} item={item} index={index} />
          ))}
      </ScrollView>
      {fetchedBusinesses && fetchedBusinesses.length === 0 && (
        <View style={styles.noBusinessContainer}>
          <FontAwesome name="frown-o" size={50} color={theme3.secondaryColor} />
          <Text style={styles.noBusinessPrimaryText}>
            No matching businesses found.
          </Text>
          <Text style={styles.noBusinessSecondaryText}>
            Try increasing the search radius or choose a different category.
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    mostPopular: {
      // flex: 1,
      // padding: 10,
      height: WindowHeight,
      width: WindowWidth,
      // backgroundColor: currentTheme.secondaryColor, // Blue background color
    },
    sectionHeading: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
      color: currentTheme.whiteColor, // White text color
    },
    mostPopularItem: {
      marginTop: 16,
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
      color: theme3.fontColor, // Blue text color
    },
    mostPopularCity: {
      fontSize: 14,
      color: theme3.fontColorI, // Gray text color
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
      alignSelf: "flex-start",
      flex: 1,
      // alignSelf: "left",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      flexDirection: "row",
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
      // flexDirection: "row",
      // marginRight:20,
      alignItems: "flex-start",
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
    noBusinessContainer: {
      marginTop: 5,
      padding: 20,
      borderRadius: 10,
      backgroundColor: "#ffff", // Light grey color, adjust as necessary
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
      // borderColor: theme3.secondaryColor,
      // borderWidth: 2,
      paddingBottom: 5,
      paddingTop: 5,
      margin: 5,
    },
    DescText: {
      fontSize: 14,
      color: theme3.fontColorI, // Gray text color
    },
  });

export default PopularBusinessList;
