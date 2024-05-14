import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Pressable,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from "react-native";
import { loginUser } from "../../api/ApiCall";
import { useNavigation } from "@react-navigation/native";

import FbLogin from "../../assets/newimage/fbLogin.png";
import Line from "../../assets/newimage/Line.png";
import googleIcon from "../../assets/newimage/googlIcon.png";

// import SocialButton from '../../components/SocialButton';
// import { ThemeContext, ThemeProvider } from "../../components/ThemeContext"
// import { translation } from "../assets/translations/translations";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";

import eye from "../../assets/newimage/eye.png";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";

import { theme3 } from "../../assets/branding/themes";
import { PushNotification } from "../../api/PushNotification";
import LoadingModal from "../GlobalComponents/LoadingModal";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import { resendVerifyEmail } from "../../api/ApiCall"; // Ensure this API function is correctly defined to handle the request

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

const ResendEmailScreen = ({ route }) => {
  const { user } = route?.params;
  console.log("User data received:", route.params);

  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

  const handleResendEmail = async () => {
    if (!user) {
      return; // Early return if user is undefined
    }

    try {
      const response = await resendVerifyEmail(user);
      if (response.status === 200 && response.data === "EMAIL_SENT") {
        setMessage(
          "Verification email has been resent successfully. Please check your inbox."
        );
        setMessageColor("green");
      } else {
        setMessage(
          "Failed to resend verification email. Please try again later."
        );
        setMessageColor("red");
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again later.");
      setMessageColor("red");
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
        <Text style={styles.heading}>Verify Your Email</Text>
        <Text style={styles.description}>
          Please check your email for a link to verify your email address. Once
          verified, you will be able to continue.
        </Text>
        <TouchableOpacity onPress={handleResendEmail} style={styles.button}>
          <Text style={styles.buttonText}>Resend Email</Text>
        </TouchableOpacity>
        {message ? (
          <Text style={{ color: messageColor, marginTop: 20 }}>{message}</Text>
        ) : null}
      </View>

      <Text style={{ color: theme3.LightTxtClr, marginTop: 20 }}>
        Don{"'"}t have an account?{" "}
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={{
            color: theme3.primaryColor,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Sign up
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
    marginTop: 60,
  },
  logo: {
    width: 160,
    height: 160,
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
