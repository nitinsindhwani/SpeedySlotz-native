import React from "react";
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
import TopImg from "../../assets/newimage/Ellipse4.png";
import Logo from "../../assets/images/welcome2.png";
import OnBoard from "../../assets/newimage/onBoard2.png";

import { theme3 } from "../../assets/branding/themes";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

const WelcomeScreen2 = ({ handleNextButtonPress }) => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={OnBoard}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.topSection}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.title}>Effortless Decisions</Text>
        <Text style={styles.paragraph}>
          Dive deeper into our features. Experience real-time availability
          updates, transparent pricing, and the ability to chat directly with
          professionals. Making an informed decision has never been easier.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleNextButtonPress()}
          style={styles.loginBtn}
        >
          <Text style={styles.loginTxt}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={[styles.loginBtn, styles.skipBtn]}
        >
          <Text style={styles.loginTxt}>Skip</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topSection: {
    marginTop: WindowHeight * 0.1,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#084887",
    textAlign: "center",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#2c3e50",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: WindowHeight * 0.1,
  },
  loginBtn: {
    backgroundColor: "#084887",
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  skipBtn: {
    backgroundColor: "#f9ab55",
  },
  loginTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WelcomeScreen2;
