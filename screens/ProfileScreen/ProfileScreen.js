import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  Linking,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Styles from "./Styles";
import {
  Ionicons,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";

import * as SecureStore from "expo-secure-store";
import { theme3 } from "../../assets/branding/themes";
import { useNavigation } from "@react-navigation/native";
import Header from "../GlobalComponents/Header";
import { LanguageContext } from "../../api/LanguageContext";
import LanguageSwitcher from "../../api/LanguageSwitcher";
import LanguageSelectionScreen from "../LanguageSelectionScreen";
import LoadingModal from "../GlobalComponents/LoadingModal";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import { logoutUser, deleteUser } from "../../api/ApiCall";
import { Platform } from "react-native";
import { baseApiUrl } from "../../api/Config";
const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [localUser, setLocalUser] = useState(user);
  const [profileImage, setProfileImage] = useState(user.profile_picture_url);
  const [localImageUri, setLocalImageUri] = useState(null);
  const { translations } = useContext(LanguageContext);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Success state
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [loading, setLoading] = useState(false);
  const iconColor = theme3.fontColor;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation

  useEffect(() => {
    setLocalUser(user);
    setProfileImage(user.profile_picture_url);
  }, [user]);

  const updateUserData = async (updatedUser) => {
    try {
      const userData = JSON.stringify(updatedUser);
      await SecureStore.setItemAsync("userData", userData);
      setLocalUser(updatedUser);
      setProfileImage(updatedUser.profile_picture_url);
    } catch (error) {
      console.error("Error updating user data in SecureStore:", error);
    }
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      const logoutSuccess = await logoutUser();

      if (logoutSuccess) {
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        setErrorMessage(translations.logoutFailedMessage);
        setShowError(true);
      }
    } catch (error) {
      const errorText = error.message || translations.generalErrorMessage;
      setErrorMessage(errorText);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setLoading(true);
      setShowDeleteConfirmation(false); // Close the confirmation modal
      const deleteSuccess = await deleteUser();

      if (deleteSuccess) {
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        setErrorMessage(
          translations.deleteFailedMessage || "Failed to delete your account."
        );
        setShowError(true);
      }
    } catch (error) {
      const errorText = error.message || translations.generalErrorMessage;
      setErrorMessage(errorText);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false); // Close success alert
  };

  const uploadImage = async (uri) => {
    const apiUrl = `${baseApiUrl}/api/v1/users/update`;
    const userToken = await SecureStore.getItemAsync("userToken");

    if (!userToken) {
      setErrorMessage("Token not found in SecureStore!");
      setShowError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      type: "image/jpeg",
      name: "profile.jpg",
    });

    const userData = {
      user_id: localUser.user_id,
      first_name: localUser.first_name,
      last_name: localUser.last_name,
      email: localUser.email,
    };
    formData.append("user", JSON.stringify(userData));

    try {
      setLoading(true); // Show loading indicator
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok && responseData.payload) {
        const updatedUser = responseData.payload;
        await updateUserData(updatedUser);
        setLocalImageUri(null);
        setSuccessMessage("Profile picture updated successfully");
        setShowSuccess(true); // Show success alert
      } else {
        throw new Error(responseData.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to update profile picture. Please try again.");
      setShowError(true); // Show error alert
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const pickImage = async () => {
    try {
      // Check if permission has already been granted
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        // Show an informative alert if permission has not been granted
        Alert.alert(
          "Photo Library Access",
          "SpeedySlotz needs access to your photo library to allow you to select a profile picture. This picture will be used to personalize your account and will be visible to other users and service providers.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const { status: newStatus } =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (newStatus !== "granted") {
                  setErrorMessage(
                    translations.cameraRollPermissionDenied ||
                      "Permission to access photo library was denied"
                  );
                  setShowError(true);
                  return;
                }

                // Proceed to select the image if permission is granted
                let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.5,
                });

                if (
                  !result.canceled &&
                  result.assets &&
                  result.assets.length > 0
                ) {
                  const imageUri = result.assets[0].uri;
                  setLocalImageUri(imageUri);
                  await uploadImage(imageUri);
                }
              },
            },
          ]
        );
      } else {
        // If permission is already granted, proceed with image selection
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          setLocalImageUri(imageUri);
          await uploadImage(imageUri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setErrorMessage(
        translations.imageSelectionFailed ||
          "Failed to select image. Please try again."
      );
      setShowError(true);
      setLocalImageUri(null);
    }
  };

  const renderProfileImage = () => {
    if (localImageUri || profileImage) {
      return (
        <Image
          source={{ uri: localImageUri || profileImage }}
          style={styles.profileImage}
          onError={() => {
            console.error("Error loading image");
            setLocalImageUri(null);
            setProfileImage(null);
          }}
        />
      );
    } else {
      return renderUserInitials();
    }
  };

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
      <Header title={translations.settings} />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {localUser && (
          <View style={Styles.CardWrapperTop}>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageContainer}
              >
                {renderProfileImage()}
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera-outline" size={24} color="white" />
                </View>
              </TouchableOpacity>

              <Text style={Styles.TitleText}>
                {localUser.first_name + " " + localUser.last_name}
              </Text>
            </View>
            <TouchableHighlight>
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
            onPress={() => navigation.navigate("ManageAccountScreen", { user })}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="user-circle-o"
                size={18}
                color={iconColor}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.manageProfile}</Text>
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
            onPress={() =>
              navigation.navigate("PreferredCategoriesScreen", { user })
            }
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="category"
                size={18}
                color={iconColor}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>
                {translations.preferredCategories}
              </Text>
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
            onPress={() => navigation.navigate("ResetPasswordScreen", {})}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="lock"
                size={18}
                color={iconColor}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.resetPassword}</Text>
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
            onPress={() => navigation.navigate("LanguageSelection")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="language"
                size={18}
                color={iconColor}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.language}</Text>
            </View>
            <TouchableHighlight>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme3.fontColor}
              />
            </TouchableHighlight>
          </TouchableOpacity>
        </View>

        <View style={Styles.CardWrapperALL}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Fontisto
                name="hipchat"
                size={18}
                color={iconColor}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.chat}</Text>
            </View>
            <TouchableHighlight>
              <Ionicons name="chevron-forward" size={20} color={iconColor} />
            </TouchableHighlight>
          </TouchableOpacity>
          <Pressable
            style={Styles.CardWrapperBottom}
            onPress={() => navigation.navigate("ReferScreen")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="gift"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.inviteAndEarn}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </Pressable>
          <Pressable
            style={Styles.CardWrapperBottom}
            onPress={() => navigation.navigate("HelpCenterScreen")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="headset"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.helpCenter}</Text>
            </View>
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
                name="description"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.aboutUs}</Text>
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
              <Text style={Styles.textStyle}>{translations.privacyPolicy}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("TermsAndConditionsScreen")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="article"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>
                {translations.termsConditions}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </TouchableOpacity>
        </View>

        <View style={Styles.CardWrapperALL}>
          <Pressable
            onPress={() => Linking.openURL("https://speedyslotz.com")}
            style={Styles.CardWrapperBottom}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="person"
                color={iconColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>
                {translations.registerAsServiceProvider}
              </Text>
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
              <AntDesign
                name="questioncircle"
                color={theme3.fontColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>{translations.howItWorks}</Text>
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
                name="business"
                color={theme3.fontColor}
                size={20}
                style={Styles.IconWrapper}
              />
              <Text style={Styles.textStyle}>
                {translations.aboutSpeedySlotz}
              </Text>
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
            style={Styles.CardWrapperBottom}
            onPress={handleDeleteAccount}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="trash-outline"
                color={theme3.danger}
                size={22}
                style={Styles.IconWrapper}
              />
              <Text style={[Styles.textStyle, { color: theme3.danger }]}>
                {translations.deleteAccount}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme3.danger} />
          </TouchableOpacity>
        </View>
        <View style={Styles.CardWrapperALL}>
          <TouchableOpacity
            style={Styles.CardWrapperBottom}
            onPress={handleLogout}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="log-out-outline"
                color={theme3.danger}
                size={22}
                style={Styles.IconWrapper}
              />
              <Text style={[Styles.textStyle, { color: theme3.danger }]}>
                {translations.logOut}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme3.danger} />
          </TouchableOpacity>
        </View>

        <Text style={{ color: theme3.fontColorI }}>
          {translations.version} 1.0.0
        </Text>

        <View style={{ width: 100, height: 200 }}></View>
      </ScrollView>
      {/* ErrorAlert for confirmation */}
      <ErrorAlert
        show={showDeleteConfirmation}
        onAction={confirmDeleteAccount}
        title={translations.confirmDeleteTitle || "Confirm Deletion"}
        body={
          translations.confirmDeleteMessage ||
          "Are you sure you want to delete your account? This action cannot be undone."
        }
        confirmButton={true} // Enable confirm button
        onCancel={() => setShowDeleteConfirmation(false)} // Cancel action
      />

      <ErrorAlert
        show={showError}
        onAction={handleCloseError}
        title="Error"
        body={errorMessage}
      />

      <ErrorAlert
        show={showSuccess}
        onAction={handleCloseSuccess}
        title="Success"
        body={successMessage}
      />
      <LoadingModal show={loading} />
    </View>
  );
};
const styles = StyleSheet.create({
  profileCard: {
    width: "100%",
    backgroundColor: theme3.GlobalBg,
    padding: 15,
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginRight: 15,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  cameraIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30, // Match parent container
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
  },
  initialsContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme3.inActive,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 24,
    color: theme3.light,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
