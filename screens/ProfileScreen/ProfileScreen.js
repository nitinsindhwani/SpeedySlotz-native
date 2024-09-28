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
import { logoutUser } from "../../api/ApiCall";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const iconColor = theme3.fontColor;

  useEffect(() => {
    setLocalUser(user);
    setProfileImage(user.profile_picture_url);
  }, [user]);

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
      setLoading(true); // Show loading indicator
      const logoutSuccess = await logoutUser();

      if (logoutSuccess) {
        // Successful logout
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        // Logout failed
        setErrorMessage(translations.logoutFailedMessage);
        setShowError(true);
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Check if the error is due to network issues
      if (error.message === "Network Error") {
        setErrorMessage(translations.networkErrorMessage);
      } else {
        setErrorMessage(translations.generalErrorMessage);
      }
      setShowError(true);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };
  const uploadImage = async (uri) => {
    const apiUrl = `${baseApiUrl}/api/v1/users/update`;
    const userToken = await SecureStore.getItemAsync("userToken");
    if (!userToken) {
      throw new Error("Token not found in SecureStore!");
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
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success && responseData.payload) {
          const updatedUser = responseData.payload;
          await updateUserData(updatedUser);
          setLocalImageUri(null);
          setErrorMessage("Profile picture updated successfully");
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to update profile picture. Please try again.");
      setLocalImageUri(null);
    } finally {
      setShowError(true);
    }
  };

  const pickImage = async () => {
    try {
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
    } catch (error) {
      console.error("Error picking image:", error);
      setErrorMessage("Failed to select image. Please try again.");
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
                  <Ionicons name="camera-outline" size={24} color="#f9ab55" />
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
                {translations.termsAndConditions}
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
      <ErrorAlert
        show={showError}
        onAction={handleCloseError}
        title={translations.logoutError}
        body={errorMessage}
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
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 3,
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
