import React, { useContext } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeContext } from "../components/ThemeContext";
import Svg, { Path } from "react-native-svg";
import { theme1 } from "../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;

const GoogleLogo = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18">
    <Path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      fill="#4285F4"
    />
    <Path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      fill="#34A853"
    />
    <Path
      d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <Path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </Svg>
);

const SocialButton = ({ platform, onPress }) => {
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);

  const getButtonStyle = (platform) => {
    switch (platform) {
      case "Google":
        return [styles.button, styles.googleButton];
      case "Facebook":
        return [styles.button, styles.facebookButton];
      case "Apple":
        return [styles.button, styles.appleButton];
      default:
        return styles.button;
    }
  };

  const getButtonContent = (platform) => {
    switch (platform) {
      case "Google":
        return (
          <>
            <View style={styles.googleLogoContainer}>
              <GoogleLogo />
            </View>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </>
        );
      case "Facebook":
        return <FontAwesome name="facebook" size={20} color="white" />;
      case "Apple":
        return <FontAwesome name="apple" size={20} color="white" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={getButtonStyle(platform)} onPress={onPress}>
      <View style={styles.buttonContent}>{getButtonContent(platform)}</View>
    </TouchableOpacity>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    button: {
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 10,
      marginVertical: 10,
      elevation: 3,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
    },
    googleButton: {
      backgroundColor: theme1.secondaryColor,
      borderColor: "#DADCE0",
      borderWidth: 1,
      width: WindowWidth / 1.19,
    },
    googleLogoContainer: {
      marginRight: 16,
    },
    googleButtonText: {
      color: theme1.primaryColor,
      fontWeight: "bold",
      fontSize: 16,
    },
    facebookButton: {
      backgroundColor: "#1877F2",
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    appleButton: {
      backgroundColor: "#000000",
      width: 50,
      height: 50,
      borderRadius: 25,
    },
  });

export default SocialButton;
