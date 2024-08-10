import React, { useState, useEffect } from "react";
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

import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";
import { theme3 } from "../../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;

const ResendEmailScreen = ({ route }) => {
  const { user } = route?.params;
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
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color="#4C4C4C" />
        </TouchableOpacity>
      </View>

      <Image source={Logo} style={styles.logo} />

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

      <Text
        style={{
          color: "#8A8A8A",
          marginTop: 20,
          textAlign: "center",
          paddingHorizontal: 20,
        }}
      >
        By resending, you agree to our Terms and Privacy Policy.
      </Text>

      <Text style={{ color: theme3.LightTxtClr, marginTop: 20 }}>
        Already verified?{" "}
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={{
            color: theme3.primaryColor,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Login
        </Text>
      </Text>

      <Text style={{ color: theme3.LightTxtClr, marginTop: 10 }}>
        Don't have an account?{" "}
        <Text
          onPress={() => navigation.navigate("SignUpScreen")}
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
    position: "absolute",
    top: 40, // Adjust this value as needed to position correctly on the screen
    left: 20, // Adjust this value to position the back button
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
