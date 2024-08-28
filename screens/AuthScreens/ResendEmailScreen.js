import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";
import { resendVerifyEmail } from "../../api/ApiCall"; // Ensure this API function is correctly defined to handle the request
import { LanguageContext } from "../../api/LanguageContext"; // Import LanguageContext

import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";
import { theme3 } from "../../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;

const ResendEmailScreen = ({ route }) => {
  const { user } = route?.params;
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  const handleResendEmail = async () => {
    if (!user) {
      return; // Early return if user is undefined
    }

    try {
      const response = await resendVerifyEmail(user);
      if (response.status === 200 && response.data === "EMAIL_SENT") {
        setMessage(translations.emailSentSuccess);
        setMessageColor("green");
      } else {
        setMessage(translations.emailSentFailed);
        setMessageColor("red");
      }
    } catch (error) {
      setMessage(translations.unexpectedError);
      setMessageColor("red");
    }
  };

  return (
    <ImageBackground source={AuthBg} style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color="#4C4C4C" />
        </TouchableOpacity>
      </View>

      <Image source={Logo} style={styles.logo} />

      <View style={styles.content}>
        <Text style={styles.heading}>{translations.verifyEmail}</Text>
        <Text style={styles.description}>
          {translations.verifyEmailDescription}
        </Text>
        <TouchableOpacity onPress={handleResendEmail} style={styles.button}>
          <Text style={styles.buttonText}>{translations.resendEmail}</Text>
        </TouchableOpacity>
        {message ? (
          <Text style={{ color: messageColor, marginTop: 20 }}>{message}</Text>
        ) : null}
      </View>

      <Text
        style={{
          color: "#8A8A8A",
          marginTop: 20,
          textAlign: "center",
          paddingHorizontal: 20,
        }}
      >
        {translations.resendAgreement}
      </Text>

      <Text style={{ color: theme3.LightTxtClr, marginTop: 20 }}>
        {translations.alreadyVerified}{" "}
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={{
            color: theme3.primaryColor,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          {translations.login}
        </Text>
      </Text>

      <Text style={{ color: theme3.LightTxtClr, marginTop: 10 }}>
        {translations.noAccount}{" "}
        <Text
          onPress={() => navigation.navigate("SignUpScreen")}
          style={{
            color: theme3.primaryColor,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          {translations.signUp}
        </Text>
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  topView: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4C4C4C",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default ResendEmailScreen;
