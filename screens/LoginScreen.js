import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from "react-native";
import { loginUser } from "../api/ApiCall";
import { useNavigation } from "@react-navigation/native";
import SocialButton from "../components/SocialButton";
import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
import { translation } from "../assets/translations/translations";
import { FontAwesome } from "@expo/vector-icons";
import { PushNotification } from "../api/PushNotification";
const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const navigation = useNavigation();
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);

  useEffect(() => {
    PushNotification();
  }, []);

  const handleLogin = async () => {
    console.log("i am running login function ")

    if (username.length < 4) {
      setUsernameError("Username must be at least 4 characters");
      return;
    } else {
      setUsernameError(null);
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    } else {
      setPasswordError(null);
    }

    try {console.log("i am in try block")

      const response = await loginUser(username, password);
      console.log(response)
      // if (response && response.push_notification === null) {
      //   // The user is logged in but doesn't have a push token saved.
      //   const pushToken = await PushNotification();
      //   if (pushToken) {
      //     // Call an API endpoint to update the user's push token in your backend.
      //   }
      // }
      if (response) {
      console.log(response)

        // navigation.navigate("LandingScreen", { user: response });
      } else {
        console.log(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password logic here!");
  };

  // const handleSocialLogin = (platform) => {
  //   console.log(`Logged in with ${platform}`);
  // };

  return (
    <ImageBackground
      source={require("../assets/images/splash_orange.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <View style={styles.middleContent}>
          <Text style={styles.heading}>Login</Text>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name="user"
              size={24}
              color={currentTheme.primaryColor}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              autoCapitalize="false"
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
            />
          </View>
          {usernameError && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}

          <View style={styles.inputContainer}>
            <FontAwesome
              name="lock"
              size={24}
              color={currentTheme.primaryColor}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="false"
              secureTextEntry
            />
          </View>
          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {/* <View style={styles.socialButtonsContainer}>
            <SocialButton
              platform="Google"
              onPress={() => handleSocialLogin("Google")}
            />
            <SocialButton
              platform="Facebook"
              onPress={() => handleSocialLogin("Facebook")}
            />
            <SocialButton
              platform="Apple"
              onPress={() => handleSocialLogin("Apple")}
            />
          </View> */}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
      width: "100%",
    },
    middleContent: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 140,
    },
    heading: {
      fontSize: 44,
      fontFamily: currentTheme.fontFamilyHeading,
      fontWeight: currentTheme.fontWeight,
      color: currentTheme.whiteColor,
      padding: 5,
      marginBottom: 100,
    },
    innerContainer: {
      width: "100%",
      alignItems: "center",
      padding: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#333333",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
    },
    input: {
      height: 40,
      width: "90%",
      marginLeft: 5,
    },
    errorText: {
      color: "red",
      marginBottom: 10,
    },
    forgotPassword: {
      alignSelf: "flex-end",
    },
    forgotPasswordText: {
      fontSize: 16,
      color: "#007AFF",
    },
    buttonPrimary: {
      width: "100%",
      padding: 15,
      marginTop: 20,
      alignItems: "center",
      backgroundColor: currentTheme.primaryColor,
    },
    buttonText: {
      fontSize: currentTheme.fontSizeMedium,
      fontFamily: currentTheme.fontFamilyText,
      color: currentTheme.whiteColor,
      fontWeight: currentTheme.fontWeight,
    },
    socialButtonsContainer: {
      justifyContent: "space-between",
      width: "100%",
    },
  });

export default LoginScreen;
