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
import { LanguageContext } from "../../api/LanguageContext"; // Import LanguageContext

import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";

const WindowWidth = Dimensions.get("window").width;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: translations.emailRequired });
      return;
    } else if (!validateEmail(email)) {
      setErrors({ email: translations.validEmailRequired });
      return;
    }
    const response = await forgotPassword(email);
    console.log("response", response);
    setErrors({});
    setMessage(translations.resetPasswordMessage);
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
            onChangeText={setEmail}
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
});

export default ForgotPasswordScreen;
