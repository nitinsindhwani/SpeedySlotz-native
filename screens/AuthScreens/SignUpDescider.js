import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";
import OnBoard from "../../assets/newimage/onBoard2.png";
import Logo from "../../assets/newimage/Logo1.png";

const SignUpDecider = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={OnBoard} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={25} color="#4C4C4C" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.welcomeText}>Sign Up</Text>
          <Text style={styles.welcomeText}>As</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUpScreen")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://speedyslotz.com")}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={styles.buttonText}>Service Provider</Text>
          </TouchableOpacity>
        </View>

        {/* Login Link - Now part of content flow */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginPromptText}>
            Already Have An Account?{" "}
            <Text
              onPress={() => navigation.navigate("LoginScreen")}
              style={styles.loginLink}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 20 : 10,
  },
  logo: {
    width: 140,
    height: 140,
  },
  welcomeContainer: {
    alignItems: "center",
    marginVertical: Platform.OS === "ios" ? 30 : 20,
  },
  welcomeText: {
    color: "#4C4C4C",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 30 : 20,
  },
  button: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: theme3.secondaryColor,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: "auto", // Pushes the login text to the bottom of contentContainer
    paddingVertical: 15,
  },
  loginPromptText: {
    color: theme3.LightTxtClr,
    fontSize: 14,
  },
  loginLink: {
    color: theme3.primaryColor,
    fontWeight: "bold",
  },
});

export default SignUpDecider;
