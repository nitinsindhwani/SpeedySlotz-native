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
import { theme3 } from "../../assets/branding/themes";
import { useNavigation } from "@react-navigation/native";
import Header from "../GlobalComponents/Header";
import { LanguageContext } from "../../api/LanguageContext";
import LanguageSwitcher from "../../api/LanguageSwitcher";
import LanguageSelectionScreen from "../LanguageSelectionScreen";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import { logoutUser } from "../../api/ApiCall";
import { Platform } from "react-native";
const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [profileImage, setProfileImage] = useState(user.profile_picture_url);
  const { translations } = useContext(LanguageContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const iconColor = theme3.fontColor;

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

  const handleLogout = async () => {
    try {
      const logoutSuccess = await logoutUser();
      if (logoutSuccess) {
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        setErrorMessage(translations.logoutFailed);
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage(translations.logoutFailedMessage);
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
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
    </View>
  );
};

export default ProfileScreen;
