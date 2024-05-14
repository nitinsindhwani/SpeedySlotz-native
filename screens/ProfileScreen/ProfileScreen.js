import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  ImageBackground,
  TouchableHighlight,
  Pressable,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Styles from "./Styles";
import profMale from "../../assets/newimage/users.png";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { theme3 } from "../../assets/branding/themes";
import { useNavigation } from "@react-navigation/native";
import Header from "../GlobalComponents/Header";
import { Switch } from "react-native";

import { Platform } from "react-native";

import { AntDesign } from '@expo/vector-icons';
// import Styles from '../../assets/branding/Styles';
const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [profileImage, setProfileImage] = useState(user.profile_picture_url);

  const [profiles, setProfiles] = useState([
    user.first_name + " " + user.last_name,
  ]);
  const [smsNotification, setSmsNotification] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);
  const [appNotification, setAppNotification] = useState(false);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    // Check if the picker has not been cancelled and the result has assets
    if (!result.canceled && result.assets) {
      // Assuming only one image is picked, access the first item in the assets array
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
    }
  };

  // Mock function to "upload" an image
  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("image", {
      uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      type: "image/jpeg", // or the correct image mime type
      name: "profile.jpg", // or any name you want to assign to the file
    });
    formData.append("userId", user.id); // Assuming you have the user's id

    try {
      const response = await fetch("YOUR_BACKEND_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data", // This is important for sending files
          // Additional headers such as authorization tokens can be added here
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Upload successful", responseData);
        // Handle successful upload here, like updating user's profile picture URL
      } else {
        // Handle server errors or invalid responses
        console.error("Upload failed", await response.text());
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  // Function to add a new profile
  const handleAddProfile = () => {
    setProfiles([...profiles, "New Profile"]); // Just a dummy profile name for now
  };

  // Function to remove a profile by name
  const handleRemoveProfile = (profileName) => {
    setProfiles(profiles.filter((profile) => profile !== profileName));
  };

  // const [avatar, setAvatar] = useState(user.profile_picture_url || null);

  // Calculate the profile completion percentage based on not-null fields
  const calculateProfileCompletion = () => {
    const totalFields = 12; // Assuming there are 12 fields in total
    let filledFields = 0;
    // List of fields to check for non-null values (you can add more fields here if needed)
    const fieldsToCheck = [
      "username",
      "email",
      "first_name",
      "last_name",
      "dateOfBirth",
      "phoneNumber",
      "address",
      "about_me",
      "socialMediaHandles",
      "profile_picture_url",
      "settings",
      "active",
    ];
    for (const field of fieldsToCheck) {
      if (user[field] !== null && user[field] !== undefined) {
        filledFields++;
      }
    }
    return ((filledFields / totalFields) * 100).toFixed(2);
  };

  // Function to format the date to mm-dd-yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}-${year}`;
  };

  // Logout Function
  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing user session, removing tokens, etc.)
    // For demonstration purposes, we'll just navigate to the LoginScreen
    navigation.navigate("LoginScreen");
  };

  const handleManageAccount = () => {
    navigation.navigate("ManageAccountScreen", { user });
  };

  const iconColor = theme3.fontColor;

  const renderUserInitials = () => {
    let initials =
      user.first_name.charAt(0).toUpperCase() +
      user.last_name.charAt(0).toUpperCase();
    return (
      <View style={Styles.initialsContainer}>
        <Text style={Styles.initialsText}>{initials}</Text>
      </View>
    );
  };

  return (
    <View style={Styles.Container}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {user && (
          <View style={Styles.CardWrapperTop}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={pickImage}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={Styles.profileImage}
                  />
                ) : (
                  renderUserInitials()
                )}
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color="#f9ab55"
                  style={Styles.cameraIcon}
                />
              </TouchableOpacity>

              <Text style={Styles.TitleText}>
                {user.first_name + " " + user.last_name}
              </Text>
            </View>
            <TouchableHighlight
            // onPress={()=> navigation.navigate("ProfileDetails", user)}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={"transparent"}
              />
            </TouchableHighlight>
          </View>
        )}

        <View style={Styles.CardWrapperALL}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ManageAccountScreen", { user });
            }}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="user-circle-o"  size={18} color={iconColor}
                style={Styles.IconWrapper} />
            
              <Text style={Styles.textStyle}>Manage Profile</Text>
            </View>
            <TouchableHighlight>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme3.fontColor}
              />
            </TouchableHighlight>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PreferredCategoriesScreen", { user });
            }}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
             
              <MaterialIcons name="category" size={18}
                color={iconColor}
                style={Styles.IconWrapper} />
              <Text style={Styles.textStyle}>Preffered Categories</Text>
            </View>
            <TouchableHighlight>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme3.fontColor}
              />
            </TouchableHighlight>
          </TouchableOpacity>

          {/* <View style={Styles.CardWrapperBottom}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Fontisto
                name="favorite"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>Notification Settings</Text>
            </View>
            <Switch
              value={smsNotification}
              onValueChange={setSmsNotification}
              thumbColor={smsNotification ? "#084887" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#f9ab55" }}
            />
          </View>
          <View style={Styles.CardWrapperBottom}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="share"
                color={theme3.fontColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotification}
              onValueChange={setEmailNotification}
              thumbColor={emailNotification ? "#084887" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#f9ab55" }}
            />
          </View>

          <View style={Styles.CardWrapperBottom}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="share"
                color={theme3.fontColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>App Notification</Text>
            </View>
            <Switch
              value={appNotification}
              onValueChange={setAppNotification}
              thumbColor={appNotification ? "#084887" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#f9ab55" }}
            />
          </View> */}
        </View>

        <View style={Styles.CardWrapperALL}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            
              <Fontisto name="hipchat"  size={18}
                color={iconColor}
                style={Styles.IconWrapper}/>
              <Text style={Styles.textStyle}>Chat</Text>
            </View>
            <TouchableHighlight>
              <Ionicons name="chevron-forward" size={20} color={iconColor} />
            </TouchableHighlight>
          </TouchableOpacity>
          <Pressable
            // onPress={()=> navigation.navigate("HelpCenter")}
            style={Styles.CardWrapperBottom}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => navigation.navigate("ReferScreen")}
            >
              <FontAwesome5
                name="gift"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>Invite & Earn! </Text>
            </TouchableOpacity>

            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </Pressable>
          <Pressable
            // onPress={()=> navigation.navigate("HelpCenter")}
            style={Styles.CardWrapperBottom}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => navigation.navigate("HelpCenterScreen")}
            >
              <FontAwesome5
                name="headset"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>Help Center</Text>
            </TouchableOpacity>

            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </Pressable>
        </View>

        <View style={Styles.CardWrapperALL}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AboutUsScreen")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="privacy-tip"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>About Us</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("PrivacyScreen")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="privacy-tip"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("TermsAndConditionsScreen")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="privacy-tip"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>Terms & Conditions</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </TouchableOpacity>
        </View>

        <View style={Styles.CardWrapperALL}>
          <Pressable
            onPress={() => Linking.openURL("http://speedyslotz.com")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="headset"
                color={theme3.fontColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>Register as service provider</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme3.fontColor}
            />
          </Pressable>

          <TouchableOpacity
            onPress={() => navigation.navigate("HowItWorksScreen")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            
              <AntDesign name="questioncircle" color={theme3.fontColor}
                size={20}
                style={Styles.IconWrapper} />
              <Text style={Styles.textStyle}>How it works</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme3.fontColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AboutSpeedySlotzScreen")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="privacy-tip"
                color={theme3.fontColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>About SpeedySlotz</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme3.fontColor}
            />
          </TouchableOpacity>
        </View>

        <View style={Styles.CardWrapperALL}>
          <TouchableOpacity
            // onPress={()=> {
            //   navigation.navigate("Login")
            //   navigationRester("Login")
            //   AsyncStorage.clear()
            // }}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="log-out-outline"
                color={theme3.danger}
                size={22}
                style={Styles.IconWrapper}
              />
              <Text style={[Styles.textStyle, { color: theme3.danger }]}>
                Log Out
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={"transparent"} />
          </TouchableOpacity>
        </View>

        {/* <View style={Styles.CardWrapperALL}>
          <View style={Styles.CardWrapperBottom}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="delete-empty"
                color={theme3.danger}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={[Styles.textStyle, { color: theme3.danger }]}>
                Delete Account
              </Text>
            </TouchableOpacity>

            <Ionicons name="chevron-forward" size={20} color={"transparent"} />
          </View>
        </View> */}

        <Text style={{ color: theme3.fontColorI }}>Version 1.0.0</Text>

        <View style={{ width: 100, height: 200 }}></View>
        {/* {
  showIvitationModal === true &&
<InviteEarn 
show={showIvitationModal}
onHide={onHideInvitation}
/>
} */}

        {/* <PrivacyPolicy
isVisible={showPrivacy}
onHide={onHidePrivacy}
/>
<Tos 
isVisible={showTos}
onHide={onHideTos}
/> */}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
