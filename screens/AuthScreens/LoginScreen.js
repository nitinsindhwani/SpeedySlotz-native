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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";

const WindowWidth = Dimensions.get("window").width;
import eye from "../../assets/newimage/eye.png";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";

import { theme3 } from "../../assets/branding/themes";
import { PushNotification } from "../../api/PushNotification";
import LoadingModal from "../GlobalComponents/LoadingModal";
import ErrorAlert from "../GlobalComponents/ErrorAlert";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [securetext, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [AlertTitle, setAlertTitle] = useState("Error Login");
  const [AlertBody, setAlertBody] = useState(
    "Invalid username or password. Please check your credentials and try again."
  );
  const navigation = useNavigation();

  useEffect(() => {
    PushNotification();
  }, []);

  const passwordPolicy = [
    "At least 8 characters long",
    "One uppercase letter",
    "One lowercase letter",
    "One number",
    "One special character (@, $, !, %, *, ?, &)",
  ];

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    let hasError = false;

    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password does not meet the required criteria.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    return !hasError;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(username, password);
      console.log(response);
      if (response.success) {
        if (response.payload.email_verified) {
          navigation.navigate("BottomNavigation", { user: response.payload });
        } else {
          navigation.navigate("ResendEmailScreen", {
            user: response.payload,
          });
        }
      } else {
        setErrorModal(true);
        setAlertBody("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  function onErrorAction() {
    setErrorModal(false);
  }

  return (
    <ImageBackground source={AuthBg} style={Styles.Container}>
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

      <Image source={Logo} style={{ width: 160, height: 160 ,marginTop:20}} />

      <View style={[Styles.TopView, { marginTop: 50 }]}>
        <Text style={styles.Text}>Username</Text>

        <View style={Styles.InputView}>
          <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            placeholder="Username"
            value={username}
            onChangeText={(e) => setUsername(e)}
            autoCapitalize="none"
          />
        </View>
        {usernameError && (
          <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
            {usernameError}
          </Text>
        )}

        <View style={styles.PasswordTextView}>
          <Text style={[styles.Text]}>Password</Text>

          <Text
            onPress={() => handleForgotPassword()}
            style={[styles.Text, { color: theme3.primaryColor }]}
          >
            Forgot Password?
          </Text>
        </View>

        <View style={[Styles.InputView]}>
          <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            placeholder="Password"
            value={password}
            onChangeText={(e) => setPassword(e)}
            secureTextEntry={securetext}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setSecureText((prev) => !prev)}>
            <Image
              source={eye}
              style={{
                width: 20,
                height: 20,
                marginRight: 13,
                tintColor: theme3.secondaryColor,
              }}
            />
          </TouchableOpacity>
        </View>

        {passwordError && (
          <>
            <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
              {passwordError}
            </Text>
            {passwordPolicy.map((item, index) => (
              <Text
                key={index}
                style={{ color: "#8A8A8A", marginTop: 5, marginLeft: 15 }}
              >
                • {item}
              </Text>
            ))}
          </>
        )}
      </View>

      <TouchableOpacity onPress={handleLogin} style={Styles.LoginBtn}>
        <Text style={Styles.LoginTxt}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center",marginTop:100 }}>
        <Image source={Line} style={{ width: WindowWidth / 2.9, height: 2 }} />
        <Text style={{ color: "#4C4C4C", marginLeft: 10, marginRight: 10 }}>
          Or
        </Text>
        <Image source={Line} style={{ width: WindowWidth / 2.6, height: 2 }} />
      </View>

      <Text style={{ color: theme3.LightTxtClr,position:'absolute',bottom:50}}>
        Don{"'"}t have an account?{" "}
        <Text
          onPress={() => navigation.navigate("SignUpDecider")}
          style={{
            color: theme3.primaryColor,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Sign up
        </Text>
      </Text>

      <LoadingModal show={loading} />
      <ErrorAlert
        show={errorModal}
        onAction={onErrorAction}
        title={AlertTitle}
        body={AlertBody}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  Text: {
    color: "#4C4C4C",
    margin: 5,
    fontWeight: "bold",
  },

  PasswordTextView: {
    marginTop: 25,
    flexDirection: "row",
    width: WindowWidth / 1.08,
    justifyContent: "space-between",
  },
});

export default LoginScreen;
