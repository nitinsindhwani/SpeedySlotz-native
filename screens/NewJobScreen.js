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
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Newly added
import axios from "axios";
import {
  getStoredToken,
  getStoredUser,
  fetchUserCategories,
  fetchCategories,
} from "../api/ApiCall";
import * as FileSystem from "expo-file-system";
import qs from "qs";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker"; // If using Expo
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { baseApiUrl } from "../api/Config";
import { v4 as uuidv4 } from "uuid";

import { theme3 } from "../assets/branding/themes";
import Styles from "../assets/branding/GlobalStyles";

import SuccessModal from "./GlobalComponents/SuccessModal";
import { getBadgeDetails } from "../components/BadgeInfo";

import AttachProfileModal from "../components/AttachProfileModal";
import Header from "../components/Header";

import Title from "./GlobalComponents/Header";
import * as ImagePicker from "expo-image-picker";
const Platform = {
  OS:"ios"
}

// Existing pickMedia function seems fine, just ensure you request permissions.

const defaultImageUrl = require("../assets/images/defaultImage.png");
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;
function NewJobScreen({ route }) {
  const navigation = useNavigation();
  const [slots, setSlots] = useState([]);
  const [seletctedDate, setSeletctedDate] = useState(new Date());
  const [seletctedTime, setSeletctedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [userData, setUserData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [profileAttached, setProfileAttached] = useState(false);
  const [attachProfileModalVisible, setAttachProfileModalVisible] =
    useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // Should be an empty array
  const [selectedVideos, setSelectedVideos] = useState([]); // Should be an empty array
  const [attachedProfiles, setAttachedProfiles] = useState([]); // Tracks attached profiles
  const [userCategories, setUserCategories] = useState([]);
  const [priorityStatus, setPriorityStatus] = useState(null);
  const [zipcodes, setZipcodes] = useState(null);

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

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const userCategoriesData = await fetchUserCategories();
        if (
          Array.isArray(userCategoriesData) &&
          userCategoriesData.length > 0
        ) {
          // Create a set to only include unique subcategory names
          const uniqueSubcategories = new Set(
            userCategoriesData.map((cat) => cat.subcategoryName)
          );
          // Convert set back to array and update state
          setUserCategories([...uniqueSubcategories]);
        } else {
          const categoriesData = await fetchCategories();
          if (Array.isArray(categoriesData) && categoriesData.length > 0) {
            const uniqueSubcategories = new Set(
              categoriesData.map((cat) => cat.subcategoryName)
            );
            setUserCategories([...uniqueSubcategories]);
          } else {
            console.error("No valid category data fetched");
            setUserCategories([]); // Optionally handle this situation more gracefully
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setUserCategories([]); // Handle error by setting to empty array or other error handling
      }
    };

    fetchCategoriesData();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    setSeletctedDate(selectedDate); // If user cancels, revert to the current stored date
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    setSeletctedTime(selectedTime); // If user cancels, revert to the current stored time
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

  const handlePress = (item) => {
    // This is a single tap
    setSelectedServiceType(item);
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

  const handleBookNow = async () => {
    setShowSuccess(false);
    const formData = new FormData();

    const formattedDate = moment(seletctedDate).format("YYYY-MM-DD"); // LocalDate format
    const formattedTime = moment(seletctedTime).format("HH:mm"); // LocalTime format

    // Find the selected slot and prepare it as a JSON string
    // Assuming zipcodes is a comma-separated string of zip codes
    const zipcodeArray = zipcodes.split(","); // Convert string to array
    // Prepare the slot information
    let slotData = {
      date: formattedDate,
      startTime: formattedTime,
      zipcodes: zipcodeArray,
      selectedServiceTypes: [selectedServiceType],
      job_description: jobDescription,
      open: true,
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
          businessDetails: null,
          slot: slotData, // Use slotToBook instead of selectedSlot
          service_type: response.data.selectedServiceTypes.join(", "),
        });
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
      // Handle submission error...
    }
  };

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
      ? theme3.secondaryColor
      : theme3.primaryColor;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.CatList, { backgroundColor }]}
      >
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item}</Text>
      </TouchableOpacity>
    );
  }
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
            {/* Date Picker */}
            <TouchableOpacity
              onPress={displayDatePicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                Select Date: {moment(seletctedDate).format("L")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={seletctedDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          <View style={styles.dateAndTimePickerRow}>
            {/* Time Picker */}
            <TouchableOpacity
              onPress={displayTimePicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                Select Time: {moment(seletctedDate).format("LT")}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={seletctedDate}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}
          </View>
        </View>
        <View style={styles.mostPopularItem}>
          <Text
            style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
          >
            Categories
          </Text>

          <FlatList
            data={userCategories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `speciality-${index}`}
            renderItem={({ item }) => (
              <SpecialityListII
                item={item}
                onPress={() => handlePress(item)}
                isSelected={selectedServiceType === item}
              />
            )}
          />
        </View>

        <View style={styles.InputView}>
          <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            placeholder="Enter zipcode 76262,72623"
            value={zipcodes}
            onChangeText={(e) => setZipcodes(e)}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Description:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setJobDescription}
            value={jobDescription}
            placeholder="Enter job description"
            multiline
          />
        </View>
        <View style={styles.outerContainer}>
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
        <FlatList
          data={attachedProfiles}
          horizontal
          renderItem={renderAttachedProfile}
          keyExtractor={(item, index) => index.toString()}
          style={styles.attachedProfilesList}
        />
        <TouchableOpacity
          style={styles.attachProfileButton}
          onPress={() => setAttachProfileModalVisible(true)}
        >
          <Text style={styles.attachProfileButtonText}>Attach Profile</Text>
        </TouchableOpacity>

        <View style={styles.mediaUploadSection}>
          <TouchableOpacity
            onPress={() => pickMedia("image")}
            style={styles.mediaButton}
          >
            <MaterialIcons name="add-photo-alternate" size={24} color="#333" />
          </TouchableOpacity>

          {/* Render selected images */}
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

          {/* Render selected videos */}
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

        {selectedServiceType &&
        jobDescription &&
        priorityStatus !== null && // Explicitly check for null
        priorityStatus !== undefined ? ( // Explicitly check for undefined if needed
          <TouchableOpacity onPress={handleBookNow} style={Styles.LoginBtn}>
            <Text style={Styles.LoginTxt}>Submit</Text>
          </TouchableOpacity>
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

      {/* </View> */}
      <SuccessModal
        show={showSuccess}
        onBack={setShowSuccess}
        title={"Booked Successfully"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: WindowHeight,
    // padding: 20,
    backgroundColor: "#f4f4f4",
    marginTop: Platform.OS === "android" ? 40 : 16,
    width: WindowWidth,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  InputView: {
    width: WindowWidth / 1.08,
    height: WindowHeight / 17,
    borderRadius: 8,
    borderColor: "#E1E1E1",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
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
    marginTop: 5, // Adjust top margin as necessary
  },
  label: {
    fontSize: 16, // Match the font size with the category section
    fontWeight: "bold", // Match the font weight
    color: theme3.fontColor, // Use the theme's font color
    marginBottom: 5, // Space between label and text input
  },
  input: {
    borderColor: "#ccc", // Border color to match the theme
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius for rounded corners
    padding: 10, // Padding inside the text input
    marginBottom: 20, // Margin at the bottom
    fontSize: 16, // Font size
    backgroundColor: "#fff", // Background color
    textAlignVertical: "top", // Start text at the top-left corner
    height: 100, // Set a fixed height for text area
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
    backgroundColor: theme3.secondaryColor,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  attachedProfileText: {
    fontSize: 14,
    marginRight: 6,
  },
  removeProfileButton: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 5,
  },

  // Styles for Attach Profile button
  attachProfileButton: {
    backgroundColor: theme3.secondaryColor, // Example: A green color for the attach button
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
    marginVertical: 10,
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
  datePickerContainer: {
    width: "100%", // Adjust this to take the full width of the screen or as needed
    paddingHorizontal: 16, // Adjust the horizontal padding to ensure elements do not overflow
    alignItems: "center", // Center align the child elements
  },
  dateAndTimePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between", // This will place the elements on either end; adjust if needed

    marginVertical: 8, // Add vertical space between the two rows
  },
  datePickerButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    flex: 1, // Flex set to 1 for both buttons to take equal space
    marginHorizontal: 4, // This will add a slight space between the two buttons
    paddingVertical: 10,
    borderRadius: 5,
    // Ensure the paddingHorizontal does not cause overflow, adjust or remove as needed
  },
  datePickerText: {
    color: theme3.light,
    fontSize: 16,
    textAlign: "center", // Ensure the text is centered within the button
  },
});

export default NewJobScreen;
