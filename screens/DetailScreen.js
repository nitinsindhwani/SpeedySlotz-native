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
import { useNavigation } from "@react-navigation/native";
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
import "react-native-get-random-values";
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
  const [dealsData, setDealsData] = useState([]);
  const [attachProfileModalVisible, setAttachProfileModalVisible] =
    useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [attachedProfiles, setAttachedProfiles] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);
  const [priorityStatus, setPriorityStatus] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // New state for selected category ID

  const MAX_NUMBER_OF_IMAGES = 5;
  const MAX_NUMBER_OF_VIDEOS = 3;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const IMAGE_TYPES = ["image/jpeg", "image/png"];
  const VIDEO_TYPES = ["video/mp4"];

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setUserData(storedUserData);
    };

    fetchUserData();
  }, []);

  const openDealsModal = (deals) => {
    setDealsData(deals);
    setIsDealModalVisible(true);
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  };

  let lastPress = 0;

  const handlePress = async (item) => {
    const time = new Date().getTime();
    const delta = time - lastPress;

    const doublePressDelay = 300;
    const matchedCategory = business.yelpBusinessCategory.find((category) =>
      category.serviceTypes.includes(item)
    );
    if (delta < doublePressDelay) {
      if (matchedCategory) {
        setModalCategory(matchedCategory);
        setCategoryModalVisible(true);
        await updateSelectedCategoryId(matchedCategory.category_id); // Update the selected category ID
      }
    } else {
      setSelectedServiceType(item);
      await updateSelectedCategoryId(matchedCategory.category_id); // Update the selected category ID
    }
    lastPress = time;
  };

  const updateSelectedCategoryId = async (categoryId) => {
    console.log("categoryId", categoryId);
    setSelectedCategoryId(categoryId);
  };

  const renderCarouselItem = ({ item }) => {
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
      allowsMultipleSelection: true,
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

  const handleAttachProfile = (profileLabel) => {
    if (!profileLabel) {
      console.error("No profile selected");
      return;
    }
    setAttachedProfiles((prevProfiles) => [...prevProfiles, profileLabel]);
  };

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
    const badge = getBadgeDetails(item);
    if (!badge) return null;

    return (
      <View style={styles.CatList}>
        <Ionicons name={badge.icon} size={20} color={theme3.secondaryColor} />
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{badge.name}</Text>
      </View>
    );
  };

  const handleChatButtonPress = () => {
    const initialMessages = [
      {
        messageId: uuidv4(),
        content: "Hi",
        timestamp: moment().toISOString(),
        messageType: "user",
      },
    ];

    const selectedChat = {
      chat_id: uuidv4(),
      project_name: "New Job",
      user_id: userData.user_id,
      username: userData.username,
      business_id: business.yelpBusiness.id,
      business_name: business.yelpBusiness.name,
      chatMessages: [],
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

    if (typeof image_url === "object" && Object.keys(image_url).length > 0) {
      return Object.values(image_url).map((url) => ({ uri: url }));
    } else if (typeof image_url === "string" && image_url.trim() !== "") {
      return [{ uri: image_url }];
    }
    return [defaultImageUrl];
  };

  const handleBookNow = async () => {
    setShowSuccess(false);
    const formData = new FormData();
    console.log("selectedCategoryId", selectedCategoryId);
    const selectedSlot = slots.find(
      (slot) => slot.key.slotId === selectedSlotId
    );
    if (!selectedSlot) {
      console.log("No slot selected");
      return;
    }

    let slotData = {
      ...selectedSlot,
      selectedServiceTypes: [selectedServiceType],
      job_description: jobDescription,
      booked: true,
      priorityStatus: priorityStatus,
      profilesAttached: attachedProfiles,
      categoryId: selectedCategoryId,
    };
    formData.append("slot", JSON.stringify(slotData));

    selectedImages.forEach((imageUri, index) => {
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg",
        name: `image-${index}.jpg`,
      });
    });

    selectedVideos.forEach((videoUri, index) => {
      formData.append("videos", {
        uri: videoUri,
        type: "video/mp4",
        name: `video-${index}.mp4`,
      });
    });

    try {
      const userToken = await getStoredToken("userToken");
      if (!userToken) {
        console.log("No token found");
        return;
      }

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
      console.log("Booking confirmation response", response);
      if (response.status === 201) {
        console.log("Booking successful");
        setShowSuccess(false);
        const selectedServiceTypes =
          response.data.payload.selectedServiceTypes || [];
        navigation.navigate("ApptConfirmationScreen", {
          userData: userData,
          businessDetails: business,
          slot: slotData,
          service_type: selectedServiceTypes.join(", "),
        });
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
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
    fetchSlots(day);
  };

  const handleSlotPress = (slot) => {
    if (selectedSlotId !== slot.key.slotId) {
      setSelectedServiceType(null);
    }

    setSelectedSlotId(slot.key.slotId);
    if (slot.serviceTypes && Array.isArray(slot.serviceTypes)) {
      setServiceTypes(slot.serviceTypes);
    } else {
      setServiceTypes([]);
    }
    setModalVisible(true);
  };

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
    fetchSlots(currentDate.toISOString().split("T")[0]);
  }, []);

  function SpecialityListII({ item, onPress, isSelected }) {
    const backgroundColor = isSelected ? theme3.primaryColor : theme3.inActive;

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
      <Header title={"Business Details"} />
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
            Achievements
          </Text>
          {business.yelpBusiness.badges &&
          business.yelpBusiness.badges.length > 0 ? (
            <FlatList
              data={business.yelpBusiness.badges}
              horizontal={true}
              renderItem={renderBadge}
              keyExtractor={(item, index) => `badge-${index}`}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noSlotsText}>No badges available.</Text>
          )}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
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
                  <View style={{ marginLeft: -6 }}>
                    <ChatAnim />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleChatButtonPress(business.yelpBusiness)}
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
                    openDealsModal(business.yelpBusinessDeal);
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
              style={{ marginLeft: -5 }}
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
              style={{ flex: 1, textAlignVertical: "top" }}
              onChangeText={setJobDescription}
              value={jobDescription}
              numberOfLines={4}
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
        </View>
        <View style={styles.mostPopularItem}>
          <Text style={styles.label}>Attach Profiles:</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setAttachProfileModalVisible(true)}
            >
              <MaterialIcons
                name="add-circle"
                size={35}
                color={theme3.primaryColor}
              />
            </TouchableOpacity>
            <FlatList
              data={attachedProfiles}
              horizontal
              renderItem={renderAttachedProfile}
              keyExtractor={(item, index) => index.toString()}
              style={styles.attachedProfilesList}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.mostPopularItem}>
          <Text style={styles.label}>Add Images:</Text>
          <View style={styles.mediaListContainer}>
            <TouchableOpacity onPress={() => pickMedia("image")}>
              <MaterialIcons
                name="add-photo-alternate"
                size={40}
                color="#333"
              />
            </TouchableOpacity>
            {selectedImages?.map((uri, index) => (
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
        <View style={styles.mostPopularItem}>
          <Text style={styles.label}>Add Videos:</Text>
          <View style={styles.mediaListContainer}>
            <TouchableOpacity onPress={() => pickMedia("video")}>
              <MaterialIcons
                name="add-photo-alternate"
                size={40}
                color="#333"
              />
            </TouchableOpacity>
            {selectedVideos?.map((uri, index) => (
              <View key={uri} style={styles.mediaItem}>
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

        {selectedSlotId &&
        selectedServiceType &&
        jobDescription &&
        priorityStatus !== null &&
        priorityStatus !== undefined ? (
          <SwipeButton
            Icon={
              <MaterialIcons
                name="keyboard-arrow-right"
                size={50}
                color="white"
              />
            }
            width={320}
            height={55}
            onComplete={() => handleBookNow()}
            title="Swipe to complete"
            borderRadius={1000}
            circleBackgroundColor={theme3.secondaryColor}
            underlayContainerGradientProps={{
              colors: [theme3.primaryColor, theme3.secondaryColor],
              start: [0, 0.5],
              end: [1.3, 0.5],
            }}
            titleStyle={{ color: "white" }}
            containerStyle={{ backgroundColor: "gray" }}
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
        onAttach={handleAttachProfile}
        user={userData}
      />
      <DealModal
        isVisible={isDealModalVisible}
        deals={dealsData}
        onClose={() => setIsDealModalVisible(false)}
      />
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
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
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
  noSlotsText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 5,
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 5,
  },
  input: {
    marginBottom: 16,
    width: WindowWidth / 1.03,
    height: WindowHeight / 5,
    padding: 10,
    shadowColor: "rgba(0,0,0,0.1)",
    elevation: 2,
    shadowOpacity: 4,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
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
    paddingVertical: 10,
  },
  carouselItem: {
    marginRight: 10,
  },
  carouselImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  mediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    color: theme3.light,
  },
  removeProfileButton: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 1,
  },
  attachProfileButton: {
    backgroundColor: theme3.secondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 150,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    marginVertical: 10,
  },
  attachProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
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
  },
  mediaItem: {
    position: "relative",
    margin: 5,
  },
  mediaThumbnail: {
    width: 65,
    height: 65,
  },
  removeMediaIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
  },
  outerContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerCircle: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 1,
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme3.secondaryColor,
  },
  selectedOuterCircle: {
    borderColor: theme3.secondaryColor,
  },
  radioButtonText: {
    fontSize: 14,
    marginLeft: 2,
  },
  radioButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 5,
  },
});

export default DetailScreen;
