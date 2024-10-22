import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { resendVerifyEmail } from "../../api/ApiCall";
import { LanguageContext } from "../../api/LanguageContext";
import ErrorAlert from "../GlobalComponents/ErrorAlert";

import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";
import { theme3 } from "../../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;

const ResendEmailScreen = ({ route }) => {
  const { user } = route?.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { translations } = useContext(LanguageContext);

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showSuccessAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const showErrorAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    // If it was a success message, navigate back after closing
    if (alertTitle === "Success") {
      navigation.navigate("LoginScreen");
    }
  };

  const handleResendEmail = async () => {
    if (!user) {
      showErrorAlert(
        "Error",
        translations.userDataMissing || "User data is missing"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await resendVerifyEmail(user);

      if (
        response?.status === 200 &&
        response?.data?.payload === "EMAIL_SENT"
      ) {
        showSuccessAlert(
          "Success",
          translations.emailSentSuccess ||
            "Verification email has been sent successfully!"
        );
      } else {
        showErrorAlert(
          "Error",
          translations.emailSentFailed || "Failed to send verification email"
        );
      }
    } catch (error) {
      showErrorAlert(
        "Error",
        translations.unexpectedError || "An unexpected error occurred"
      );
      console.error("Email resend error:", error);
    } finally {
      setLoading(false);
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
        <TouchableOpacity
          onPress={handleResendEmail}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? translations.sending : translations.resendEmail}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.agreementText}>{translations.resendAgreement}</Text>

      <Text style={styles.linkText}>
        {translations.alreadyVerified}{" "}
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={styles.linkHighlight}
        >
          {translations.login}
        </Text>
      </Text>

      <Text style={styles.linkText}>
        {translations.noAccount}{" "}
        <Text
          onPress={() => navigation.navigate("SignUpScreen")}
          style={styles.linkHighlight}
        >
          {translations.signUp}
        </Text>
      </Text>

      <ErrorAlert
        show={showAlert}
        title={alertTitle}
        body={alertMessage}
        onAction={handleCloseAlert}
      />
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
    backgroundColor: theme3.primaryColor,
    padding: 15,
    borderRadius: 8,
    width: WindowWidth * 0.8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: theme3.disabledColor || "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  agreementText: {
    color: "#8A8A8A",
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  linkText: {
    color: theme3.LightTxtClr,
    marginTop: 10,
  },
  linkHighlight: {
    color: theme3.primaryColor,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ResendEmailScreen;
