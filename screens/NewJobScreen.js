import React, { useEffect, useState } from "react";
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
import { setISODay } from "date-fns";
import LoadingModal from "./GlobalComponents/LoadingModal";
import { SwipeButton } from "react-native-expo-swipe-button";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

const NewJobScreen = ({ route }) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Pets");
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
      selectedServiceTypes: [selectedServiceTypeName],
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
                Select Date: {moment(selectedDate).format("L")}
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
                Select Time: {moment(selectedDate).format("LT")}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
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
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.InputView}>
            <Text style={styles.label}>Zipcode:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter zipcodes (e.g., 76262,72623)"
              value={zipcodes}
              onChangeText={(e) => setZipcodes(e)}
              autoCapitalize="none"
            />
          </View>
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
        {/* <View style={styles.mediaUploadSection}>
          <TouchableOpacity
            onPress={() => pickMedia("image")}
            style={styles.mediaButton}
          >
            <MaterialCommunityIcons
              name="add-photo-alternate"
              size={24}
              color="#333"
            />
          </TouchableOpacity>

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

          <TouchableOpacity
            onPress={() => pickMedia("video")}
            style={styles.mediaButton}
          >
            <FontAwesome name="video-camera" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.mediaListContainer}>
            {selectedVideos.map((uri, index) => (
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
        </View> */}

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
          // <TouchableOpacity onPress={handleBookNow} style={Styles.LoginBtn}>
          //   <Text style={Styles.LoginTxt}>Submit</Text>
          // </TouchableOpacity>
          <TouchableOpacity
            style={[Styles.LoginBtn, { backgroundColor: theme3.inActive }]}
          >
            <Text style={Styles.LoginTxt}>
              {!selectedServiceTypeName ||
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
      <SuccessModal
        show={showSuccess}
        onBack={setShowSuccess}
        title={"Booked Successfully"}
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
    marginBottom: 16,
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
});

export default NewJobScreen;
