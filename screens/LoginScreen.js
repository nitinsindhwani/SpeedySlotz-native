import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from "react-native";
import { loginUser } from "../api/ApiCall";
import { useNavigation } from "@react-navigation/native";
import SocialButton from "../components/SocialButton";
import { ThemeContext } from "../components/ThemeContext";
import { FontAwesome } from "@expo/vector-icons";
import { PushNotification } from "../api/PushNotification";
import { LanguageContext } from "../api/LanguageContext";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const navigation = useNavigation();
  const { currentTheme } = useContext(ThemeContext);

  const styles = getStyles(currentTheme);

  const languageContext = useContext(LanguageContext);
  console.log("Language context in LoginScreen:", languageContext);

  // Check if context is available
  if (!languageContext) {
    console.log("LanguageContext not available");
    return <Text>Loading...</Text>;
  }

  const { language, translations } = languageContext;
  console.log("Current language:", language);
  console.log("Translations:", translations);
  useEffect(() => {
    PushNotification();
  }, []);

  const handleLogin = async () => {
    if (username.length < 4) {
      setUsernameError(translations.usernameError);
      return;
    } else {
      setUsernameError(null);
    }

    if (password.length < 6) {
      setPasswordError(translations.passwordError);
      return;
    } else {
      setPasswordError(null);
    }

    try {
      const response = await loginUser(username, password);
      if (response) {
        console.log(response);
        if (response.settings && response.settings.preferred_language) {
          await updateLanguageAfterLogin(response.settings.preferred_language);
        }
        // Navigate to next screen or handle successful login
        navigation.navigate("LandingScreen", { user: response });
      } else {
        console.log(translations.loginFailed);
        // Handle failed login (e.g., show an error message)
      }
    } catch (error) {
      console.error(translations.loginError, error.message);
      // Handle login error (e.g., show an error message)
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

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
          <Text style={styles.heading}>{translations.login}</Text>
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
              placeholder={translations.username}
              autoCapitalize="none"
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
              placeholder={translations.password}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
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
            <Text style={styles.forgotPasswordText}>
              {translations.forgotPassword}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
            <Text style={styles.buttonText}>{translations.loginButton}</Text>
          </TouchableOpacity>
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
