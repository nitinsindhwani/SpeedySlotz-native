import React, { useState, useEffect } from "react";

import {
  FontAwesome,
  Octicons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import getImageSource from "../CallFuncGlobal/getImageSource";
import { theme3 } from "../../assets/branding/themes";
import Styles from "../../assets/branding/GlobalStyles";
import TimeSlots from "../../assets/data/TimeSlots";
import AvailableSlots from "../../assets/data/Availableslots";
import Specialieites from "../../assets/data/SpecialitiesData";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import DealIcon from "react-native-vector-icons/FontAwesome5";
import metersToMiles from "../CallFuncGlobal/metersoMiles";
import HeartIcon from "react-native-vector-icons/AntDesign"; // Add this import for the heart icon
import { Linking } from "react-native";
import { v4 as uuidv4 } from "uuid";
const Platform = {
  OS:"ios"
}


import { Entypo } from "@expo/vector-icons";

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Button,
  Image,
  FlatList,
} from "react-native";
import DealIcons from "./DealIcons";
import { useNavigation } from "@react-navigation/native";
import { getBadgeDetails } from "../../components/BadgeInfo";
import removeFavorite from "../CallFuncGlobal/removeFavorite";
import addToFav from "../CallFuncGlobal/addToFav";
import ChatAnim from "./ChatAnim";
import DealModal from "../../components/DealModal";
import { getStoredUser } from "../../api/ApiCall";
function MainCardDesign({ business }) {
  const navigation = useNavigation();
  const [ExpandCat, setExpandCat] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isFav,setIsFav]=useState(business.favorite)
  const [selectedDeal, setSelectedDeal] = useState([]);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);
  const openDealModal = (dealData) => {
    const dealsArray = Array.isArray(dealData) ? dealData : [dealData];
    setSelectedDeal(dealsArray);
    setIsDealModalVisible(true);
  };
  const desc = "Description will be written here";
  console.log("Inside MainCard:", business);

  function SpecialityList({ item }) {
    return (
      <View style={styles.CatList}>
        <Ionicons name={item.icon} size={20} color={theme3.secondaryColor} />

        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item.name}</Text>
      </View>
    );
  }
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
  console.log("ds", business);
  function AvailableSlotsList({ item }) {
    return (
      <View style={styles.CatList}>
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item.title}</Text>
      </View>
    );
  }


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
      addToFav(itemId,changeTepFav)
      setIsFav(true)
    }
  }
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser(); // Await the async call
      setUserData(storedUserData); // Set userData state
    };

    fetchUserData();
  }, [])

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


  return (
    <View style={styles.mostPopularItem}>


<View style={styles.favoriteIconContainer}>
          <TouchableOpacity
            onPress={() => {
              // setIsFav()
           
              // toggleFavorite(item.yelpBusiness.id,changeTepFav)
               handleFav(business.yelpBusiness.id)
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
          business?.yelpBusiness?.name,
          business?.yelpBusiness?.image_url
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
          {business.yelpBusiness.name}
        </Text>

        {business?.slots?.length > 0 && (
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

      {/* descripton and titles below*/}
      {business.yelpBusiness.is_registered && (
        <>
          {/* Description with Read More/Less functionality */}
          {showMore ? (
            <Text style={styles.DescText}>
              {business.yelpBusiness.details}
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
              {`${business?.yelpBusiness?.details?.slice(0, 30)}...`}
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
            (business.yelpBusiness.badges &&
            business.yelpBusiness.badges.length > 0 ? (
              <FlatList
                data={business.yelpBusiness.badges}
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

      {/* categories below*/}
      {business.yelpBusinessCategory?.serviceTypes?.length > 0 && (
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
              style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
            >
              Categories
            </Text>
          </View>

          <FlatList
            data={business.yelpBusinessCategory?.serviceTypes || []}
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
          <TouchableOpacity 
          onPress={() => handleChatButtonPress(business.yelpBusiness)}
          style={Styles.OneRow}>
            {/* <Octicons name="dot-fill" size={20} color={theme3.send} /> */}
            <View
            style={{marginLeft:-6}}
            >

            <ChatAnim/>
            </View>
            <Text style={[styles.DescText, { marginLeft: 0 }]}>Chat Now</Text>
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
          {business.yelpBusinessDeal && (

          <TouchableOpacity style={styles.dealIconContainer}
          
          onPress={() => {
            console.log("Deal data at press:", business.yelpBusinessDeal);
            openDealModal(business.yelpBusinessDeal);
          }}
          >
            {/* <DealIcon name="tags" size={16} color={theme3.secondaryColor} /> */}
            <DealIcons />
            <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
              Deals
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
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {
              const phoneNumber = business.yelpBusiness.phone;
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
export default MainCardDesign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    marginTop: Platform.OS === "android" ? 40 : 16,
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
    backgroundColor: theme3.GlobalBg, // White background color
  },
  DescText: {
    fontSize: 14,
    color: theme3.fontColorI, // Gray text color
  },
  mostPopularName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor, // Blue text color
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
  mostPopularCity: {
    fontSize: 14,
    color: theme3.fontColorI, // Gray text color
  },
  mapIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mostPopularCity: {
    fontSize: 14,
    color: theme3.fontColorI, // Gray text color
  },

  CatListII: {
    padding: 15,
    borderRadius: 5,
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    // borderColor: theme3.secondaryColor,
    // borderWidth: 2,
    paddingBottom: 5,
    paddingTop: 5,
    margin: 5,
  },
  buttonsContainer: {
    // New style for the button container
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bookButton: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 5, // Added this
    borderRadius: 5,
    backgroundColor: theme3.primaryColor,
    alignItems: "center",
    elevation: 3, // Added shadow for Android
    shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.light, // White text color
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
  favoriteIconContainer: {
    position: "absolute",
    top: 20, // Changed this
    right: 20, // Changed this
    zIndex: 2,
    padding: 5, // Added this to make it touch-friendly
    borderRadius: 20, // Added this for a rounded touch area
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Added a light background for visibility
  },
});
