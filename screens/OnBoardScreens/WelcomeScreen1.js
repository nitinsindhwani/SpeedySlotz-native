import React, { useContext } from "react";
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
import { LanguageContext } from "../../api/LanguageContext";
import TopImg from "../../assets/newimage/Ellipse4.png";
import Logo from "../../assets/images/welcome1.png";
import OnBoard from "../../assets/newimage/onBoard1.png";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

const WelcomeScreen1 = ({ handleNextButtonPress }) => {
  const navigation = useNavigation();
  const { translations } = useContext(LanguageContext);

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
        <Text style={styles.title}>{translations.unlockYourTime}</Text>
        <Text style={styles.paragraph}>{translations.welcomeMessage}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleNextButtonPress()}
          style={styles.loginBtn}
        >
          <Text style={styles.loginTxt}>{translations.next}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={[styles.loginBtn, styles.skipBtn]}
        >
          <Text style={styles.loginTxt}>{translations.skip}</Text>
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

export default WelcomeScreen1;
