import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import { forgotPassword } from "../../api/ApiCall";
import { LanguageContext } from "../../api/LanguageContext";

import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";

const WindowWidth = Dimensions.get("window").width;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const { translations } = useContext(LanguageContext);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleForgotPassword = async () => {
    setErrors({});
    setMessage("");

    const lowercaseEmail = email.toLowerCase();
    if (!lowercaseEmail) {
      setErrors({ email: translations.emailRequired });
      return;
    } else if (!validateEmail(lowercaseEmail)) {
      setErrors({ email: translations.validEmailRequired });
      return;
    }

    try {
      const response = await forgotPassword(lowercaseEmail);
      if (response.status === 200) {
        setMessage(translations.resetPasswordMessage);
      } else {
        setMessage(translations.errorResettingPassword);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage(translations.errorResettingPassword);
    }
  };

  return (
    <ImageBackground source={AuthBg} style={styles.container}>
      <View style={Styles.TopView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-outline"
            style={{ marginLeft: 5 }}
            size={25}
            color="#4C4C4C"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image source={Logo} style={{ width: 160, height: 160 }} />
        <Text style={styles.heading}>{translations.forgotPasswordTitle}</Text>
        <Text style={styles.description}>
          {translations.forgotPasswordDescription}
        </Text>
        <View style={[Styles.InputView, { marginBottom: 20 }]}>
          <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            onChangeText={(text) => {
              const lowercaseText = text.toLowerCase();
              setEmail(lowercaseText);
            }}
            value={email}
            placeholder={translations.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TouchableOpacity
          onPress={() => handleForgotPassword()}
          style={Styles.LoginBtn}
        >
          <Text style={Styles.LoginTxt}>{translations.submitButton}</Text>
        </TouchableOpacity>
        {message && <Text style={styles.message}>{message}</Text>}

        {/* Add the text to navigate back to the login screen */}
        <Text style={styles.goBackText}>
          {translations.goBackToLoginQuestion}{" "}
          <Text
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.loginLink}
          >
            {translations.login}
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
  message: {
    color: "green",
    marginTop: 20,
    textAlign: "center",
  },
  goBackText: {
    color: "#8A8A8A",
    marginTop: 20,
    textAlign: "center",
  },
  loginLink: {
    color: "#438EEC",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ForgotPasswordScreen;
