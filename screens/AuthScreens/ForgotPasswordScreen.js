import React, { useState, useContext, useEffect } from "react";
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

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;
import eye from "../../assets/newimage/eye.png";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";

import { theme3 } from "../../assets/branding/themes";
import { PushNotification } from "../../api/PushNotification";
import LoadingModal from "../GlobalComponents/LoadingModal";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import { forgotPassword } from "../../api/ApiCall";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: "Email address is required." });
      return;
    } else if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    forgotPassword;
    setErrors({});
    setMessage(
      "If this email is registered you will receive a link to reset your password."
    );
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
        <Text style={styles.heading}>Forgot Your Password?</Text>
        <Text style={styles.description}>
          Enter your email address below to receive instructions to reset your
          password.
        </Text>
        <View style={[Styles.InputView,{marginBottom:20}]}>
          {/* <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            placeholder="username"
            value={username}
            onChangeText={(e) => setUsername(e)}
            autoCapitalize="none"
          /> */}
            <TextInput
          // style={styles.input}
          style={{ marginLeft: 13, flex: 1 }}

          onChangeText={setEmail}
          value={email}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        </View>
        {/* <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        /> */}
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        {/* <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity> */}


        <TouchableOpacity onPress={() => handleForgotPassword()} style={Styles.LoginBtn}>
        <Text style={Styles.LoginTxt}>Submit</Text>
      </TouchableOpacity>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  banner: {
    width: 300,
    height: 200,
    marginBottom: 20,
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
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4C4C4C",
    padding: 10,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  message: {
    color: "green",
    marginTop: 20,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
