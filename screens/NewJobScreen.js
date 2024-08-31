import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import axios from "axios";
import {
  getStoredToken,
  getStoredUser,
  fetchUserCategories,
  fetchCategories,
} from "../api/ApiCall";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import AttachProfileModal from "../components/AttachProfileModal";
import SuccessModal from "./GlobalComponents/SuccessModal";
import { theme3 } from "../assets/branding/themes";
import Styles from "../assets/branding/GlobalStyles";
import { baseApiUrl } from "../api/Config";
import LoadingModal from "./GlobalComponents/LoadingModal";
import { SwipeButton } from "react-native-expo-swipe-button";
import { LanguageContext } from "../api/LanguageContext";
import * as ImagePicker from "expo-image-picker";
import ErrorAlert from "./GlobalComponents/ErrorAlert";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

const NewJobScreen = ({ route }) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedServiceTypeName, setSelectedServiceTypeName] = useState("");
  const [userData, setUserData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [profileAttached, setProfileAttached] = useState(false);
  const [attachProfileModalVisible, setAttachProfileModalVisible] =
    useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [attachedProfiles, setAttachedProfiles] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [priorityStatus, setPriorityStatus] = useState(null);
  const [zipcodes, setZipcodes] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLOading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const languageContext = useContext(LanguageContext);
  const { translations, language } = useContext(LanguageContext);

  const MAX_NUMBER_OF_IMAGES = 5;
  const MAX_NUMBER_OF_VIDEOS = 1;
  const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_VIDEO_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const MAX_NUMBER_OF_PROFILES = 5; // You can adjust this number as needed
  const IMAGE_TYPES = ["image/jpeg", "image/png"];
  const VIDEO_TYPES = ["video/mp4"];

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setUserData(storedUserData);
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setIsLoading(false);
        const userCategoriesData = await fetchUserCategories();
        if (
          Array.isArray(userCategoriesData) &&
          userCategoriesData.length > 0
        ) {
          setUserCategories(userCategoriesData);
        } else {
          const categoriesData = await fetchCategories();
          if (Array.isArray(categoriesData) && categoriesData.length > 0) {
            setUserCategories(categoriesData);
          } else {
            console.error("No valid category data fetched");
            setUserCategories([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setUserCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    setSelectedDate(selectedDate);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    setSelectedTime(selectedTime);
  };

  const displayDatePicker = () => {
    setShowDatePicker(true);
  };

  const displayTimePicker = () => {
    setShowTimePicker(true);
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
      console.log("Media picking was cancelled");
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
          console.log(`File too large: ${fileInfo.size} bytes`);
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
          <AntDesign name="close" size={16} color="white" />
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

  const handleBookNow = async () => {
    setShowSuccess(false);
    const formData = new FormData();

    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const formattedTime = moment(selectedTime).format("HH:mm");

    const zipcodeArray = zipcodes.split(",");
    let slotData = {
      date: formattedDate,
      startTime: formattedTime,
      zipcodes: zipcodeArray,
      selectedServiceTypes: selectedServiceTypeName
        ? [selectedServiceTypeName.name]
        : [],
      job_description: jobDescription,
      open: true,
      priorityStatus: priorityStatus,
      profilesAttached: attachedProfiles,
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

      if (response.status === 201) {
        console.log("Booking successful");
        setShowSuccess(false);
        const selectedServiceTypes =
          response.data.payload.selectedServiceTypes || [];
        navigation.navigate("ApptConfirmationScreen", {
          userData: userData,
          businessDetails: null,
          slot: slotData,
          service_type: selectedServiceTypes.join(", "),
        });
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header user={userData} />
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.datePickerContainer}>
          <View style={styles.dateAndTimePickerRow}>
            <TouchableOpacity
              onPress={displayDatePicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                {translations.selectDate}: {moment(selectedDate).format("L")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          <View style={styles.dateAndTimePickerRow}>
            <TouchableOpacity
              onPress={displayTimePicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                {translations.selectTime}: {moment(selectedTime).format("LT")}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}
          </View>
        </View>
        <View style={styles.mostPopularItem}>
          {userCategories && userCategories.length > 0 && (
            <CategoryList
              userCategoriesData={userCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedServiceTypeName={selectedServiceTypeName}
              setSelectedServiceTypeName={setSelectedServiceTypeName}
              rows={3}
              language={language}
              translations={translations}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.InputView}>
            <Text style={styles.label}>{translations.zipcode}</Text>
            <TextInput
              style={styles.inputField}
              placeholder={translations.enterZipcodes}
              value={zipcodes}
              onChangeText={(e) => setZipcodes(e)}
              autoCapitalize="none"
            />
          </View>
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
              translations.routine,
              translations.flexible,
              translations.urgent,
              translations.emergency,
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

        {selectedServiceTypeName &&
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
              {!selectedServiceTypeName ||
              !jobDescription ||
              priorityStatus === null ||
              !profileAttached
                ? translations.completeSelections
                : ""}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100, width: 100 }}></View>
      </ScrollView>
      <AttachProfileModal
        isVisible={attachProfileModalVisible}
        onClose={() => setAttachProfileModalVisible(false)}
        onAttach={handleAttachProfile}
        user={userData}
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
      <LoadingModal show={isLOading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: WindowHeight,
    width: WindowWidth,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  InputView: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    borderColor: "#E1E1E1",
    borderWidth: 1,
    backgroundColor: theme3.GlobalBg,
    marginBottom: 8,
  },
  inputField: {
    fontSize: 16,
    color: theme3.fontColor,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 5,
  },
  datePickerContainer: {
    margin: 20,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  timePickerButton: {
    padding: 10,
    backgroundColor: "#ddd",
  },
  datePickerText: {
    fontSize: 16,
  },
  timePickerText: {
    fontSize: 16,
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
    marginBottom: 10,
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
    flexDirection: "row",
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
    marginBottom: 10,
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
    paddingHorizontal: 20,
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
  datePickerContainer: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  dateAndTimePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  datePickerButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 5,
  },
  datePickerText: {
    color: theme3.light,
    fontSize: 16,
    textAlign: "center",
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
});

export default NewJobScreen;
