import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Button,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Newly added
import axios from "axios";
import { getStoredToken, getStoredUser } from "../api/ApiCall";
import * as FileSystem from "expo-file-system";
import qs from "qs";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import HeartIcon from "react-native-vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import {
  FontAwesome,
  Octicons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { baseApiUrl } from "../api/Config";
import { v4 as uuidv4 } from "uuid";
import getImageSource from "./CallFuncGlobal/getImageSource";
import { theme3 } from "../assets/branding/themes";
import Styles from "../assets/branding/GlobalStyles";
import TimeSlots from "../assets/data/TimeSlots";
import metersToMiles from "./CallFuncGlobal/metersoMiles";
import AvailableSlots from "../assets/data/Availableslots";
import Specialieites from "../assets/data/SpecialitiesData";
import CalenderCustom from "./Filters/CalenderCustom";
import SuccessModal from "./GlobalComponents/SuccessModal";
import { getBadgeDetails } from "../components/BadgeInfo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DealModal from "../components/DealModal";
import AttachProfileModal from "../components/AttachProfileModal";
import DealIcons from "./GlobalComponents/DealIcons";
import { Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CategoryDetailsModal from "../components/CategoryDetailsModal";
import ChatAnim from "./GlobalComponents/ChatAnim";
import { SwipeButton } from "react-native-expo-swipe-button";
import Header from "./GlobalComponents/Header";

// Existing pickMedia function seems fine, just ensure you request permissions.

const defaultImageUrl = require("../assets/images/defaultImage.png");
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;
function DetailScreen({ route }) {
  const navigation = useNavigation();
  const [slots, setSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [initialDate, setInitialDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { business } = route.params;
  const providerId = business.yelpBusiness.id;
  const [userData, setUserData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [profileAttached, setProfileAttached] = useState(false);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);
  const [dealsData, setDealsData] = useState([]); // Holds the deals to be displayed in the modal
  const [attachProfileModalVisible, setAttachProfileModalVisible] =
    useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // Should be an empty array
  const [selectedVideos, setSelectedVideos] = useState([]); // Should be an empty array
  const [attachedProfiles, setAttachedProfiles] = useState([]); // Tracks attached profiles
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);
  const [priorityStatus, setPriorityStatus] = useState(null);

  const MAX_NUMBER_OF_IMAGES = 5;
  const MAX_NUMBER_OF_VIDEOS = 3;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const IMAGE_TYPES = ["image/jpeg", "image/png"];
  const VIDEO_TYPES = ["video/mp4"];

  // Your existing useEffect and other functions
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser(); // Await the async call
      setUserData(storedUserData); // Set userData state
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once on mount

  const openDealsModal = (deals) => {
    // Example deals data fetch or assignment

    console.log("Deals:", deals);
    setDealsData(deals); // Set the fetched or predefined deals data
    setIsDealModalVisible(true); // Open the modal
  };
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  };

  let lastPress = 0; // Add this outside your component

  // Inside your DetailScreen component
  const handlePress = (item) => {
    const time = new Date().getTime();
    const delta = time - lastPress;

    const doublePressDelay = 300; // You can adjust this value
    if (delta < doublePressDelay) {
      // This is a double tap
      setModalCategory(item);
      setCategoryModalVisible(true);
    } else {
      // This is a single tap
      setSelectedServiceType(item);
    }
    lastPress = time;
  };

  const renderCarouselItem = ({ item }) => {
    // Directly use the item as the source since prepareImageUrls ensures the correct format
    return (
      <View style={styles.carouselItem}>
        <Image source={item} style={styles.carouselImage} />
      </View>
    );
  };

  function RadioButton({ label, value, onPress, selectedValue }) {
    return (
      <TouchableOpacity
        style={styles.radioButtonContainer}
        onPress={() => onPress(value)}
      >
        <View
          style={[
            styles.outerCircle,
            selectedValue === value && styles.selectedOuterCircle,
          ]}
        >
          {selectedValue === value && <View style={styles.innerCircle} />}
        </View>
        <Text style={styles.radioButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  const pickMedia = async (mediaType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        mediaType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true, // Ensure your ImagePicker supports multiple selection
    });

    if (result.canceled) {
      console.log("Media picking was cancelled");
      return;
    }

    if (result.assets) {
      const overSizedAssets = result.assets.filter(
        (asset) => asset.fileSize > MAX_FILE_SIZE
      );
      if (overSizedAssets.length > 0) {
        // Log oversized files and show an error message
        console.log("Some files are too large:", overSizedAssets);
        alert("Some files are too large and will not be added.");
      }

      const validAssets = result.assets.filter(
        (asset) => asset.fileSize <= MAX_FILE_SIZE
      );

      if (mediaType === "image") {
        setSelectedImages((images) => [
          ...images,
          ...validAssets.map((asset) => asset.uri),
        ]);
      } else if (mediaType === "video") {
        setSelectedVideos((videos) => [
          ...videos,
          ...validAssets.map((asset) => asset.uri),
        ]);
      }
    }
  };

  // Render Media Item Function

  const handleAttachProfile = (profileLabel) => {
    if (!profileLabel) {
      console.error("No profile selected");
      return; // Exit if no profile is selected
    }
    setAttachedProfiles((prevProfiles) => [...prevProfiles, profileLabel]);
  };
  // Function to handle removing an attached profile
  const handleRemoveProfile = (indexToRemove) => {
    setAttachedProfiles((prevProfiles) =>
      prevProfiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const renderAttachedProfile = ({ item, index }) => {
    return (
      <View key={index} style={styles.attachedProfile}>
        <Text style={styles.attachedProfileText}>{item}</Text>
        <TouchableOpacity
          onPress={() => handleRemoveProfile(index)}
          style={styles.removeProfileButton}
        >
          <AntDesign name="close" size={14} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const removeMedia = (mediaType, uri) => {
    if (mediaType === "image") {
      setSelectedImages(selectedImages.filter((imageUri) => imageUri !== uri));
    } else if (mediaType === "video") {
      setSelectedVideos(selectedVideos.filter((videoUri) => videoUri !== uri));
    }
  };

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
  const handleChatButtonPress = () => {
    // Create the chat_info object

    const initialMessages = [
      {
        messageId: uuidv4(),
        content: "Hi",
        timestamp: moment().toISOString(),
        messageType: "user",
      },
      // Add more initial messages here if needed
    ];

    const selectedChat = {
      chat_id: uuidv4(),
      project_name: "New Job",
      user_id: userData.user_id,
      username: userData.username,
      business_id: business.yelpBusiness.id,
      business_name: business.yelpBusiness.name,
      chatMessages: [], // Use the array of initial messages
    };

    navigation.navigate("App", {
      screen: "ChatScreen",
      params: {
        chatData: selectedChat,
      },
    });
  };

  const prepareImageUrls = () => {
    const { image_url } = business.yelpBusiness;

    // If image_url is an object with URLs
    if (typeof image_url === "object" && Object.keys(image_url).length > 0) {
      // Extract URLs and return them as an array
      return Object.values(image_url).map((url) => ({ uri: url }));
    }
    // If image_url is a single string URL
    else if (typeof image_url === "string" && image_url.trim() !== "") {
      // Return it as an array with a single object containing the URI
      return [{ uri: image_url }];
    }
    // If there's no valid image URL, use a default image
    return [defaultImageUrl]; // Assuming defaultImageUrl is correctly imported and refers to a local image
  };

  const handleBookNow = async () => {
    setShowSuccess(false);
    const formData = new FormData();

    // Find the selected slot and prepare it as a JSON string
    const selectedSlot = slots.find(
      (slot) => slot.key.slotId === selectedSlotId
    );
    if (!selectedSlot) {
      console.log("No slot selected");
      return;
    }

    // Prepare the slot information
    let slotData = {
      ...selectedSlot,
      selectedServiceTypes: [selectedServiceType],
      job_description: jobDescription,
      booked: true,
      priorityStatus: priorityStatus,
      profilesAttached: attachedProfiles,
    };
    formData.append("slot", JSON.stringify(slotData));

    // Append images as 'images' array
    selectedImages.forEach((imageUri, index) => {
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg", // Assuming JPEG, adjust based on actual image type
        name: `image-${index}.jpg`,
      });
    });

    // Append videos as 'videos' array
    selectedVideos.forEach((videoUri, index) => {
      formData.append("videos", {
        uri: videoUri,
        type: "video/mp4", // Assuming MP4, adjust based on actual video type
        name: `video-${index}.mp4`,
      });
    });

    try {
      const userToken = await getStoredToken("userToken");
      if (!userToken) {
        console.log("No token found");
        return;
      }

      // Submit the FormData to your backend
      const response = await axios.post(
        baseApiUrl + "/api/v1/userBookings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // Handle response...
      if (response.status === 201) {
        console.log("Booking successful");
        setShowSuccess(false);
        navigation.navigate("ApptConfirmationScreen", {
          businessDetails: business,
          slot: slotData, // Use slotToBook instead of selectedSlot
          service_type: response.data.selectedServiceTypes.join(", "),
        });
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
      // Handle submission error...
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Business Details",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
        color: "purple",
      },
      headerStyle: {
        backgroundColor: "white",
      },
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  const onDayPress = (day) => {
    // console.log("Selected day: ", day.dateString);
    // setCurrentDate(new Date(day.timestamp));
    // // Fetch slots for selected day
    // fetchSlots(day.dateString);
    fetchSlots(day);
  };

  const handleSlotPress = (slot) => {
    console.log(`Selected slot: ${slot.startTime} to ${slot.endTime}`);
    if (selectedSlotId !== slot.key.slotId) {
      setSelectedServiceType(null);
    }

    setSelectedSlotId(slot.key.slotId);
    if (slot.serviceTypes && Array.isArray(slot.serviceTypes)) {
      setServiceTypes(slot.serviceTypes);
    } else {
      setServiceTypes([]); // or any default value you want
    }
    setModalVisible(true);
  };

  // Additional function to close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const fetchSlots = async (selectedDate) => {
    const data = qs.stringify({
      providerId: providerId,
      date: selectedDate,
    });

    const userToken = await getStoredToken("userToken");

    axios
      .post(
        baseApiUrl + "/api/v1/slots/getSlotsByUser",
        {
          data,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        setSlots(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the slots", error);
      });
  };

  useEffect(() => {
    console.log("running");

    fetchSlots(currentDate.toISOString().split("T")[0]);
  }, []);

  function SpecialityList({ item }) {
    return (
      <View style={styles.CatList}>
        <Ionicons name={item.icon} size={18} color={theme3.secondaryColor} />

        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item.name}</Text>
      </View>
    );
  }

  function SpecialityListII({ item, onPress, isSelected }) {
    const backgroundColor = isSelected
      ? theme3.primaryColor
      : theme3.inActive;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.CatList, { backgroundColor }]}
      >
        <Text style={{ color: theme3.light, marginLeft: 0 }}>{item}</Text>
      </TouchableOpacity>
    );
  }
  const imageUrls = prepareImageUrls();
  return (
    <View style={styles.container}>
      <Header title={"Business Details"}/>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mostPopularItem}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {imageUrls.length > 0 ? (
              imageUrls.map((item, index) => (
                <View key={index} style={styles.carouselItem}>
                  <Image source={item} style={styles.carouselImage} />
                </View>
              ))
            ) : (
              <Image source={defaultImageUrl} style={styles.carouselImage} />
            )}
          </ScrollView>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.mostPopularName}>
              {business.yelpBusiness.name}
            </Text>
          </View>

          <Text style={styles.DescText}>{business.yelpBusiness.details}</Text>
          <Text
            style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
          >
            Achivements
          </Text>
          {business.yelpBusiness.badges &&
          business.yelpBusiness.badges.length > 0 ? (
            <FlatList
              data={business.yelpBusiness.badges}
              horizontal={true}
              renderItem={renderBadge}
              keyExtractor={(item, index) => `badge-${index}`} // Ensure unique keys
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noSlotsText}>No badges available.</Text>
          )}
          {/* <View style={styles.extraInfoContainer}>
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
              <Text style={[styles.mostPopularCity, { marginTop: 5 }]}>
                Directions
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.extraInfoContainer}>
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
            <View style={Styles.OneRow}>
              <Octicons name="dot-fill" size={20} color={theme3.send} />
              <TouchableOpacity onPress={handleChatButtonPress}>
                <Text style={[styles.DescText, { marginLeft: 5 }]}>
                  Chat Now
                </Text>
              </TouchableOpacity>
            </View>
            {business.yelpBusinessDeal && (
              <TouchableOpacity
                style={styles.dealIconContainer}
                onPress={() => {
                  openDealsModal(business.yelpBusinessDeal);
                }}
              >
                <DealIcons />
                <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                  Deals
                </Text>
              </TouchableOpacity>
            )}
          </View> */}




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
              <View style={Styles.OneRow}>
                {/* <Octicons name="dot-fill" size={20} color={theme3.send} /> */}
                <View
            style={{marginLeft:-6}}
            >

            <ChatAnim/>
            </View>
                <TouchableOpacity
                  // onPress={() => handleChatButtonPress(business.yelpBusiness)}
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
              <TouchableOpacity
                style={styles.dealIconContainer}
                onPress={() => {
                  console.log("Deal data at press:", business.yelpBusinessDeal);
                  // openDealModal(business.yelpBusinessDeal);
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

        </View>

        <CalenderCustom
          setSelectedDay={onDayPress}
          SlotAvailable={slots}
          selectedSlotId={selectedSlotId}
          handleSlotPress={handleSlotPress}
        />

        <View style={styles.mostPopularItem}>
          <Text
            style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
          >
            Categories
          </Text>
          {slots.length === 0 || selectedSlotId === null ? (
            <Text style={styles.noSlotsText}>
              No categories available. Please select a slot or wait until slots
              are available.
            </Text>
          ) : (
            <FlatList
              data={serviceTypes}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `speciality-${index}`}
              style={{marginLeft:-5}}
              renderItem={({ item }) => (
                <SpecialityListII
                  item={item}
                  onPress={() => handlePress(item)}
                  isSelected={selectedServiceType === item}
                />
              )}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.input}>
          <Text style={styles.label}>Job Description:</Text>
          <TextInput
            style={{flex:1,textAlignVertical:'top'}}
            onChangeText={setJobDescription}
            value={jobDescription}
            placeholder="Enter job description"
            multiline
          />
          </View>
         
        </View>
        <View style={styles.mostPopularItem}>
          <Text style={styles.label}>Priority Status:</Text>
          <View style={styles.radioButtonRow}>
            {["Routine", "Flexible", "Urgent", "Emergency"].map(
              (priority, index) => (
                <RadioButton
                  key={index}
                  label={priority}
                  value={index}
                  onPress={() => setPriorityStatus(index)}
                  selectedValue={priorityStatus}
                />
              )
            )}
          </View>
          {/* <Text style={[styles.label,{marginTop:10}]}>Attached Profiles:</Text> */}

          <FlatList
          data={attachedProfiles}
          horizontal
          renderItem={renderAttachedProfile}
          keyExtractor={(item, index) => index.toString()}
          style={styles.attachedProfilesList}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity
          style={styles.attachProfileButton}
          onPress={() => setAttachProfileModalVisible(true)}
        >
          <Text style={styles.attachProfileButtonText}>Attach Profile</Text>
        </TouchableOpacity>
        </View>
     
        {
          selectedImages.length >0 &&
     <View style={styles.mostPopularItem}>
     <Text style={styles.label}>Images:</Text>

 <View style={styles.mediaListContainer}>
            {selectedImages.map((uri, index) => (
              <View key={uri} style={styles.mediaItem}>
                <Image source={{ uri }} style={styles.mediaThumbnail} />
                <TouchableOpacity
                  onPress={() => removeMedia("image", uri)}
                  style={styles.removeMediaIcon}
                >
                  <AntDesign name="closecircle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
     </View>
        }

{
  selectedVideos.length > 0 &&
     <View style={styles.mostPopularItem}>
     <Text style={styles.label}>Videos:</Text>

     <View style={styles.mediaListContainer}>
            {selectedVideos.map((uri, index) => (
              <View key={uri} style={styles.mediaItem}>
                {/* Replace this with your video thumbnail or player */}
                <FontAwesome name="file-video-o" size={48} color="#333" />
                <TouchableOpacity
                  onPress={() => removeMedia("video", uri)}
                  style={styles.removeMediaIcon}
                >
                  <AntDesign name="closecircle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
     </View>
    }

        <View style={styles.mediaUploadSection}>
          <TouchableOpacity
            onPress={() => pickMedia("image")}
            style={styles.mediaButton}
          >
            <MaterialIcons name="add-photo-alternate" size={24} color="#333" />
          </TouchableOpacity>

          {/* Render selected images */}
          

          <TouchableOpacity
            onPress={() => pickMedia("video")}
            style={styles.mediaButton}
          >
            <FontAwesome name="video-camera" size={24} color="#333" />
          </TouchableOpacity>

          {/* Render selected videos */}
        
        </View>

        {selectedSlotId &&
        selectedServiceType &&
        jobDescription &&
        priorityStatus !== null && // Explicitly check for null
        priorityStatus !== undefined ? ( // Explicitly check for undefined if needed
          // <TouchableOpacity onPress={handleBookNow} style={Styles.LoginBtn}>
          //   <Text style={Styles.LoginTxt}>Submit</Text>
          // </TouchableOpacity>
          <SwipeButton
          Icon={
            <MaterialIcons name="keyboard-arrow-right" size={50} color="white" />
          }
          width={320}
          height={55}
          onComplete={() => handleBookNow()}
          title="Swipe to complete"
          borderRadius={1000}
          circleBackgroundColor={theme3.secondaryColor}
          underlayContainerGradientProps={{
            colors: [theme3.primaryColor,theme3.secondaryColor],
            start: [0, 0.5],
            end: [1.3, 0.5],
          }}
          titleStyle={{color:"white"}}
                containerStyle={{ backgroundColor: 'gray' }}
          underlayTitle="Release to complete"
          underlayTitleStyle={{ color: theme3.light }}
        />
        ) : (
          <TouchableOpacity
            style={[Styles.LoginBtn, { backgroundColor: theme3.inActive }]}
          >
            <Text style={Styles.LoginTxt}>
              {!selectedSlotId ||
              !selectedServiceType ||
              !jobDescription ||
              priorityStatus === null ||
              !profileAttached
                ? "Complete selections to submit"
                : ""}
            </Text>
          </TouchableOpacity>
        )}
    

        <View style={{ height: 200, width: 100 }}></View>
      </ScrollView>
      <AttachProfileModal
        isVisible={attachProfileModalVisible}
        onClose={() => setAttachProfileModalVisible(false)}
        onAttach={handleAttachProfile} // Pass the handleAttachProfile function
        user={userData}
      />
      <DealModal
        isVisible={isDealModalVisible}
        deals={dealsData}
        onClose={() => setIsDealModalVisible(false)}
      />
      {/* </View> */}
      <SuccessModal
        show={showSuccess}
        onBack={setShowSuccess}
        title={"Booked Successfully"}
      />
      <CategoryDetailsModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        category={modalCategory}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: WindowHeight,
    flex:1,
    alignItems: "center",
    // padding: 20,
    backgroundColor: "#f4f4f4",
    // marginTop: Platform.OS === "android" ? 40 : 16,
    width: WindowWidth,
  },
  mostPopularImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 4,
    resizeMode: "cover",
  },
  dealButtonStyle: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  dealButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
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
  DescText: {
    fontSize: 14,
    color: theme3.fontColorI, // Gray text color
  },
  mostPopularName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor, // Blue text color
    marginTop: 8,
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
  noSlotsText: {
    fontSize: 14,
    color: "#666", // Example color, adjust as needed
    marginTop: 10,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%", // Make it full width to match category section
    paddingHorizontal: 5, // Match the horizontal padding with the category section
    marginTop: 5,
     // Adjust top margin as necessary
  },
  label: {
    fontSize: 16, // Match the font size with the category section
    fontWeight: "bold", // Match the font weight
    color: theme3.fontColor, // Use the theme's font color
    marginBottom: 5, // Space between label and text input
  },
  input: {
    // borderColor: "#ccc", // Border color to match the theme
    // borderWidth: 1, // Border width
    // borderRadius: 5, // Border radius for rounded corners
    // padding: 10, // Padding inside the text input
    // marginBottom: 20, // Margin at the bottom
    // fontSize: 16, // Font size
    // backgroundColor: "#fff", // Background color
    // textAlignVertical: "top", // Start text at the top-left corner
    // height: 100,
    
    marginBottom: 16,
    width: WindowWidth / 1.03,
    height:WindowHeight/8,
    padding: 10,
    shadowColor: "rgba(0,0,0,0.1)",
    elevation: 2,
    shadowOpacity: 4,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
    
    // Set a fixed height for text area
    // Add the rest of the input styles here
  },
  button: {
    backgroundColor: theme3.primaryColor,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: theme3.secondaryColor,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  carouselContainer: {
    flexDirection: "row",
    paddingVertical: 10, // Adjust as needed
  },
  carouselItem: {
    marginRight: 10, // Space between items
  },
  carouselImage: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    borderRadius: 8, // Optional: for rounded corners
  },
  mediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    // Button styles
  },
  mediaPreview: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  attachedProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "90%",
  },
  attachedProfilesList: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  attachedProfile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
  },
  attachedProfileText: {
    fontSize: 14,
    marginRight: 6,
    color:theme3.light
  },
  removeProfileButton: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 1,
  },

  // Styles for Attach Profile button
  attachProfileButton: {
    backgroundColor: theme3.secondaryColor, // Example: A green color for the attach button
    paddingVertical: 10,
    paddingHorizontal: 10,
    width:150,
    alignItems:"center",
    alignSelf:'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  attachProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Styles for media upload section
  mediaUploadSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  mediaButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  imagePreview: {
    alignItems: "center",
  },
  videoPreview: {
    alignItems: "center",
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  removeMediaButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  mediaListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    // marginVertical: 10,
  },
  // Add these to your styles object
  mediaItem: {
    position: "relative",
    margin: 5,
    // Add any additional styling for the container of each media item
  },

  mediaThumbnail: {
    width: 100, // Adjust the size as needed
    height: 100,
    // Add any additional styling for the media thumbnails
  },

  removeMediaIcon: {
    position: "absolute",
    top: -10, // Adjust position as needed
    right: -10,
    backgroundColor: "#fff", // Optional: for better visibility of the icon
    borderRadius: 15, // Optional: if you want a rounded background for the icon
    padding: 5, // Optional: if you want spacing around the icon
  },
  outerContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  radioButtonContainer: {
    flexDirection: "row", // Align label and button in a row
    alignItems: "center", // Center-align items vertically in the container
    // You may want to adjust the margin here depending on your layout needs
  },
  outerCircle: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000", // Or use your theme color
    alignItems: "center",
    justifyContent: "center",
    marginRight: 1, // Space between the radio button and label
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme3.secondaryColor, // Use your theme color here
  },
  selectedOuterCircle: {
    borderColor: theme3.secondaryColor, // Use the theme color for selection
  },

  radioButtonText: {
    fontSize: 14, // Adjust the size as needed
    marginLeft: 2, // Adjust the spacing as needed
  },
  radioButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribute buttons evenly across the available space
    alignItems: "center", // Center-align vertically
    paddingVertical: 5, // Add some vertical padding for spacing
  },
});

export default DetailScreen;
