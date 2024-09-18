import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { baseApiUrl } from "../api/Config";
import { getStoredToken, getStoredUser } from "../api/ApiCall";
import qs from "qs";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import {
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import moment from "moment";
import uuid from "react-native-uuid";
import getImageSource from "./CallFuncGlobal/getImageSource";
import { theme3 } from "../assets/branding/themes";
import Styles from "../assets/branding/GlobalStyles";
import metersToMiles from "./CallFuncGlobal/metersoMiles";
import CalenderCustom from "./Filters/CalenderCustom";
import SuccessModal from "./GlobalComponents/SuccessModal";
import { getBadgeDetails } from "../components/BadgeInfo";
import DealModal from "../components/DealModal";
import AttachProfileModal from "../components/AttachProfileModal";
import DealIcons from "./GlobalComponents/DealIcons";
import * as ImagePicker from "expo-image-picker";
import CategoryDetailsModal from "../components/CategoryDetailsModal";
import ChatAnim from "./GlobalComponents/ChatAnim";
import { SwipeButton } from "react-native-expo-swipe-button";
import Header from "./GlobalComponents/Header";
import { LanguageContext } from "../api/LanguageContext";
import ErrorAlert from "./GlobalComponents/ErrorAlert";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import ReviewModal from "../screens/Modals/ReviewModal";
const defaultImageUrl = require("../assets/images/defaultImage.png");
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

function DetailScreen({ route }) {
  const navigation = useNavigation();
  const { translations } = useContext(LanguageContext); // Get translations from context
  const [slots, setSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
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
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showMore, setShowMore] = useState(false); // State for toggling description
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedBusinessIsRegistered, setSelectedBusinessIsRegistered] =
    useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const MAX_NUMBER_OF_IMAGES = 5;
  const MAX_NUMBER_OF_VIDEOS = 1;
  const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_VIDEO_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const MAX_NUMBER_OF_PROFILES = 5; // You can adjust this number as needed
  const IMAGE_TYPES = ["image/jpeg", "image/png"];
  const VIDEO_TYPES = ["video/mp4"];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const renderImageCarousel = () => {
    const imageUrls = prepareImageUrls();

    if (imageUrls.length === 0) {
      return null;
    }

    return (
      <View style={styles.carouselOuterContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            const slide = Math.round(nativeEvent.contentOffset.x / WindowWidth);
            if (slide !== activeImageIndex) {
              setActiveImageIndex(slide);
            }
          }}
          scrollEventThrottle={200}
        >
          {imageUrls.map((item, index) => (
            <Image key={index} source={item} style={styles.carouselImage} />
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {imageUrls.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                index === activeImageIndex ? styles.paginationDotActive : null,
              ]}
              onPress={() => {
                scrollViewRef.current.scrollTo({
                  x: index * WindowWidth,
                  animated: true,
                });
                setActiveImageIndex(index);
              }}
            />
          ))}
        </View>
      </View>
    );
  };

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

  const openReviewModal = (businessId, isRegistered) => {
    setSelectedBusinessId(businessId);
    setSelectedBusinessIsRegistered(isRegistered);
    setIsReviewModalVisible(true);
  };
  const FileSizeNote = ({ fileType }) => (
    <View style={styles.noteBubble}>
      <Text style={styles.noteText}>
        {translations.fileSizeNote}{" "}
        {fileType === "image" ? translations.images : translations.videos}:
        {`${MAX_FILE_SIZE / (1024 * 1024)}MB`}
      </Text>
    </View>
  );
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  };

  let lastPress = 0;

  const handlePress = async (item) => {
    const time = new Date().getTime();
    const delta = time - lastPress;
    const doublePressDelay = 300;

    // Find the matching category
    const matchedCategory = business.yelpBusinessCategory.find((category) =>
      category.serviceTypes.includes(item)
    );

    if (delta < doublePressDelay) {
      if (matchedCategory) {
        setModalCategory(matchedCategory);
        setCategoryModalVisible(true);

        await updateSelectedCategoryId(matchedCategory.category_id);
      } else {
        console.error("No matched category found on double-click.");
      }
    } else {
      setSelectedServiceType(item);
      if (matchedCategory) {
        await updateSelectedCategoryId(matchedCategory.category_id);
      } else {
        console.error("No matched category found on single click.");
      }
    }
    lastPress = time;
  };

  const updateSelectedCategoryId = async (categoryId) => {
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
    if (
      mediaType === "video" &&
      selectedVideos.length >= MAX_NUMBER_OF_VIDEOS
    ) {
      setErrorMessage(translations.maxVideosReached);
      setShowError(true);
      return;
    }

    if (
      mediaType === "image" &&
      selectedImages.length >= MAX_NUMBER_OF_IMAGES
    ) {
      setErrorMessage(translations.maxImagesReached);
      setShowError(true);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        mediaType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: mediaType === "image",
    });

    if (result.canceled) {
      return;
    }

    if (result.assets) {
      const processAsset = async (asset) => {
        try {
          let fileInfo;
          if (mediaType === "image") {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
              asset.uri,
              [{ resize: { width: 1024 } }],
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            fileInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);
            if (fileInfo.size <= MAX_IMAGE_FILE_SIZE) {
              return manipulatedImage.uri;
            }
          } else {
            fileInfo = await FileSystem.getInfoAsync(asset.uri);
            if (fileInfo.size <= MAX_VIDEO_FILE_SIZE) {
              return asset.uri;
            }
          }

          return null;
        } catch (error) {
          console.error("Error processing file:", error);
          return null;
        }
      };

      const processedAssets = await Promise.all(
        result.assets.map(processAsset)
      );
      const validAssets = processedAssets.filter((uri) => uri !== null);

      if (mediaType === "image") {
        const newImages = [...selectedImages, ...validAssets].slice(
          0,
          MAX_NUMBER_OF_IMAGES
        );
        setSelectedImages(newImages);
        if (newImages.length > selectedImages.length) {
          setErrorMessage(translations.someImagesNotAdded);
          setShowError(true);
        }
      } else {
        if (
          validAssets.length > 0 &&
          selectedVideos.length < MAX_NUMBER_OF_VIDEOS
        ) {
          setSelectedVideos([validAssets[0]]); // Only take the first valid video
        } else {
          setErrorMessage(translations.videoNotAdded);
          setShowError(true);
        }
      }

      if (validAssets.length < result.assets.length) {
        setErrorMessage(translations.someFilesStillTooLarge);
        setShowError(true);
      }
    }
  };

  const handleAttachProfile = (profileLabel) => {
    if (!profileLabel) {
      console.error("No profile selected");
      return;
    }
    if (attachedProfiles.length >= MAX_NUMBER_OF_PROFILES) {
      setErrorMessage(translations.maxProfilesReached);
      setShowError(true);
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
  const removeMedia = (mediaType, uri) => {
    if (mediaType === "image") {
      setSelectedImages(selectedImages.filter((imageUri) => imageUri !== uri));
    } else if (mediaType === "video") {
      setSelectedVideos(selectedVideos.filter((videoUri) => videoUri !== uri));
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

  const handleChatButtonPress = () => {
    const initialMessages = [
      {
        messageId: uuid.v4(),
        content: "Hi",
        timestamp: moment().toISOString(),
        messageType: "user",
      },
    ];

    const selectedChat = {
      chat_id: uuid.v4(),
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
    const selectedSlot = slots.find(
      (slot) => slot.key.slotId === selectedSlotId
    );
    if (!selectedSlot) {
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
      if (response.status === 201) {
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
      headerTitle: translations.BusinessDetails,
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
  }, [navigation, translations]);

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
        <Text style={{ color: theme3.light, marginLeft: 0 }}>{item} </Text>
        <Ionicons
          name="duplicate"
          size={24}
          color={theme3.light}
          style={styles.moreInfoIcon}
        />
      </TouchableOpacity>
    );
  }

  const imageUrls = prepareImageUrls();
  return (
    <View style={styles.container}>
      <Header title={translations.businessDetails} />
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mostPopularItem}>
          {renderImageCarousel()}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.businessInfoContainer}>
              <Text style={styles.mostPopularName}>
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
                      source={require("../assets/newimage/google-icon.png")}
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
                        source={require("../assets/icon-new.png")}
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

                <TierBadge score={business.yelpBusiness.ratingScore} />
              </View>
            </View>
          </View>
          {showMore ? (
            <Text style={styles.DescText}>
              {business.yelpBusiness.details}
              <Text
                style={{ color: theme3.primaryColor }}
                onPress={() => setShowMore(false)}
              >
                {" "}
                {translations.readLess} {/* Use translation for "Read Less" */}
              </Text>
            </Text>
          ) : (
            <Text style={styles.DescText}>
              {`${business.yelpBusiness.details.slice(0, 100)}...`}
              <Text
                style={{ color: theme3.primaryColor }}
                onPress={() => setShowMore(true)}
              >
                {" "}
                {translations.readMore} {/* Use translation for "Read More" */}
              </Text>
            </Text>
          )}

          <Text
            style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
          >
            {translations.Achievements}
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
            <Text style={styles.noSlotsText}>
              {translations.noBadgesAvailable}
            </Text>
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
                  {metersToMiles(business.yelpBusiness.distance)}{" "}
                  {translations.miles}
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
                  onPress={() => {
                    openDealsModal(business.yelpBusinessDeal);
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
            {translations.categories}
          </Text>
          {slots.length === 0 || selectedSlotId === null ? (
            <Text style={styles.noSlotsText}>
              {translations.noCategoriesAvailable}
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
            <Text style={styles.label}>{translations.jobDescription}</Text>
            <TextInput
              style={{ flex: 1, textAlignVertical: "top" }}
              onChangeText={setJobDescription}
              value={jobDescription}
              numberOfLines={4}
              placeholder={translations.enterJobDescription}
              multiline
            />
          </View>
        </View>
        <View style={styles.mostPopularItem}>
          <Text style={styles.label}>{translations.priorityStatus}</Text>
          <View style={styles.radioButtonRow}>
            {[
              translations.Routine,
              translations.Flexible,
              translations.Urgent,
              translations.Emergency,
            ].map((priority, index) => (
              <RadioButton
                key={index}
                label={priority}
                value={index}
                onPress={() => setPriorityStatus(index)}
                selectedValue={priorityStatus}
              />
            ))}
          </View>
        </View>
        <View style={styles.mostPopularItem}>
          <Text style={styles.label}>{translations.attachProfiles}</Text>
          <Text style={styles.subLabel}>
            {translations.maxProfilesAllowed}: {MAX_NUMBER_OF_PROFILES}
          </Text>
          <View style={styles.mediaListContainer}>
            <TouchableOpacity
              onPress={() => setAttachProfileModalVisible(true)}
              style={[
                styles.addMediaButton,
                attachedProfiles.length >= MAX_NUMBER_OF_PROFILES &&
                  styles.disabledButton,
              ]}
              disabled={attachedProfiles.length >= MAX_NUMBER_OF_PROFILES}
            >
              <MaterialIcons
                name="person-add"
                size={40}
                color={
                  attachedProfiles.length >= MAX_NUMBER_OF_PROFILES
                    ? "#999"
                    : theme3.primaryColor
                }
              />
            </TouchableOpacity>
            {attachedProfiles.map((profile, index) => (
              <View key={`profile-${index}`} style={styles.mediaItem}>
                <View style={styles.profileIcon}>
                  <MaterialIcons
                    name="person"
                    size={40}
                    color={theme3.primaryColor}
                  />
                </View>
                <Text
                  style={styles.profileName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {profile}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveProfile(index)}
                  style={styles.removeMediaIcon}
                >
                  <AntDesign name="closecircle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.mostPopularItem}>
          <Text style={styles.label}>{translations.addImages}</Text>
          <Text style={styles.subLabel}>
            {translations.maxImagesAllowed}: {MAX_NUMBER_OF_IMAGES},{" "}
            {translations.maxSizePerImage}:{" "}
            {MAX_IMAGE_FILE_SIZE / (1024 * 1024)}MB
          </Text>
          <View style={styles.mediaListContainer}>
            <TouchableOpacity
              onPress={() => pickMedia("image")}
              style={[
                styles.addMediaButton,
                selectedImages.length >= MAX_NUMBER_OF_IMAGES &&
                  styles.disabledButton,
              ]}
              disabled={selectedImages.length >= MAX_NUMBER_OF_IMAGES}
            >
              <MaterialIcons
                name="add-photo-alternate"
                size={40}
                color={
                  selectedImages.length >= MAX_NUMBER_OF_IMAGES
                    ? "#999"
                    : theme3.primaryColor
                }
              />
            </TouchableOpacity>
            {selectedImages.map((uri, index) => (
              <View key={`image-${index}`} style={styles.mediaItem}>
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
          <Text style={styles.label}>{translations.addVideo}</Text>
          <Text style={styles.subLabel}>
            {translations.maxVideoAllowed}: {MAX_NUMBER_OF_VIDEOS},{" "}
            {translations.maxSizePerVideo}:{" "}
            {MAX_VIDEO_FILE_SIZE / (1024 * 1024)}MB
          </Text>
          <View style={styles.mediaListContainer}>
            <TouchableOpacity
              onPress={() => pickMedia("video")}
              style={[
                styles.addMediaButton,
                selectedVideos.length >= MAX_NUMBER_OF_VIDEOS &&
                  styles.disabledButton,
              ]}
              disabled={selectedVideos.length >= MAX_NUMBER_OF_VIDEOS}
            >
              <MaterialIcons
                name="videocam"
                size={40}
                color={
                  selectedVideos.length >= MAX_NUMBER_OF_VIDEOS
                    ? "#999"
                    : theme3.primaryColor
                }
              />
            </TouchableOpacity>
            {selectedVideos.map((uri, index) => (
              <View key={`video-${index}`} style={styles.mediaItem}>
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
            title={translations.swipeToComplete}
            borderRadius={1000}
            circleBackgroundColor={theme3.secondaryColor}
            underlayContainerGradientProps={{
              colors: [theme3.primaryColor, theme3.secondaryColor],
              start: [0, 0.5],
              end: [1.3, 0.5],
            }}
            titleStyle={{ color: "white" }}
            containerStyle={{ backgroundColor: "gray" }}
            underlayTitle={translations.releaseToComplete}
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
                ? translations.completeSelections
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
      <ErrorAlert
        show={showError}
        onAction={() => setShowError(false)}
        title={translations.attention}
        body={errorMessage}
      />
      <SuccessModal
        show={showSuccess}
        onBack={setShowSuccess}
        title={translations.bookedSuccessfully}
      />
      <ReviewModal
        isVisible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        businessId={selectedBusinessId}
        isRegistered={selectedBusinessIsRegistered}
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
  noteBubble: {
    backgroundColor: theme3.primaryColor,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  noteText: {
    color: theme3.light,
    fontSize: 12,
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
  mediaListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  addMediaButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  mediaItem: {
    position: "relative",
    width: 65,
    height: 65,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaThumbnail: {
    width: 65,
    height: 65,
    borderRadius: 5,
  },
  profileIcon: {
    width: 65,
    height: 65,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    fontSize: 10,
    padding: 2,
    textAlign: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  removeMediaIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 0,
  },
  subLabel: {
    fontSize: 12,
    color: theme3.fontColorI,
    marginBottom: 10,
  },
  addMediaButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  ratingAndTierContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingsContainer: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
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

export default DetailScreen;
