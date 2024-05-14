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

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;
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
  const [isPressed, setPressed] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [AlertTitle, setAlertTitle] = useState("Error Login");
  const [AlertBody, setAlertBody] = useState(
    "Something Went Wrong PLease check the credentials!"
  );

  const [passwordError, setPasswordError] = useState(null);
  const [securetext, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // const { currentTheme } = useContext(ThemeContext);
  // const styles = getStyles(currentTheme);

  useEffect(() => {
    PushNotification();
  }, []);

  const handleLogin = async () => {
    // navigation.navigate('LandingScreen');

    if (username.length < 4) {
      setErrorMessage("Username must be at least 4 characters");
      setErrorCode("phone");
    } else if (password.length < 6) {
      setErrorCode("password");
      setErrorMessage(
        "Password must be at least 6 characters poioip pipi ipi iiiopi"
      );
    } else {
      setErrorCode(false);

      try {
        setLoading(true);
        const response = await loginUser(username, password);
        if (response && response.push_notification === null) {
          // The user is logged in but doesn't have a push token saved.
          const pushToken = await PushNotification();
          if (pushToken) {
            // Call an API endpoint to update the user's push token in your backend.
            console.log("Push Token:", pushToken);
          }
        }
        if (response.email_verified === true) {
          navigation.navigate("BottomNavigation", { user: response });
        } else {
          navigation.navigate("ResendEmailScreen", { user: response });
        }
        ////// UN COMMENT THE FUNCTION ABOVE AFTER MAKING THOSE CHANGES IN BACKEND/////
        // if (response.status === "200") {
        //   navigation.navigate('BottomNavigation', { user: response });

        // } else if(response.status === "401") {
        //   console.log('Login failed. Please check your credentials and try dsdagain.');
        //   setErrorModal(true)
        //   setErrorCode(response.title)
        //   setErrorMessage(response.message)
        // }
      } catch (error) {
        console.error("Login error:", error.message);
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const handleSocialLogin = (platform) => {
    console.log(`Logged in with ${platform}`);
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

      <Image source={Logo} style={{ width: 160, height: 160 }} />

      <View style={[Styles.TopView, { marginTop: -20 }]}>
        <Text style={styles.Text}>Username</Text>

        <View style={Styles.InputView}>
          <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            placeholder="username"
            value={username}
            onChangeText={(e) => setUsername(e)}
            autoCapitalize="none"
          />
        </View>
        {errorCode === "phone" && username.length < 4 && (
          <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
            {errorMessage}
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
            placeholder="password"
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

        {errorCode === "password" && password.length < 6 && (
          <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
            {errorMessage}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => handleLogin()} style={Styles.LoginBtn}>
        <Text style={Styles.LoginTxt}>Login</Text>
      </TouchableOpacity>

      {/* {loading===true?
    <TouchableOpacity 
  
  style={Styles.LoginBtn}>
  <Text style={Styles.LoginTxt}>Loading....</Text>
  </TouchableOpacity>:
  <TouchableOpacity 
  onPress={()=> handleLogin()}
  style={Styles.LoginBtn}>
  <Text style={Styles.LoginTxt}>Login</Text>
  </TouchableOpacity>
  
  } */}

      <View style={styles.socialView}>
        {/* <Pressable
          onPress={() => handleSocialLogin("Facebook")}
          style={styles.SocialBtn}
        >
          <Image source={FbLogin} style={{ width: 10, height: 20 }} />
        </Pressable>
        <Pressable
          onPress={() => handleSocialLogin("Google")}
          style={styles.SocialBtn}
        >
          <Image source={googleIcon} style={{ width: 20, height: 20 }} />
        </Pressable>
        <Pressable
          onPress={() => handleSocialLogin("Apple")}
          style={styles.SocialBtn}
        >
          <MaterialCommunityIcons name="apple" size={24} color="black" />
        </Pressable> */}
      </View>

      {/* <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
<Text style={{color:theme3.LightTxtClr}}>Have apple account? <Text 
  
  onPress={() => handleSocialLogin("Apple")}
  style={{color:theme3.fontColor ,fontWeight:'bold',marginLeft:10}}> Login Apple</Text></Text> 
  <MaterialCommunityIcons name="apple" size={24} color="black" />
</View> */}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={Line} style={{ width: WindowWidth / 2.9, height: 2 }} />
        <Text style={{ color: "#4C4C4C", marginLeft: 10, marginRight: 10 }}>
          Or
        </Text>
        <Image source={Line} style={{ width: WindowWidth / 2.6, height: 2 }} />
      </View>
      <Text style={{ color: theme3.LightTxtClr, marginTop: 20 }}>
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
  socialView: {
    width: WindowWidth / 1.2,
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  SocialBtn: {
    width: 50,
    height: 50,
    borderRadius: 1000,
    backgroundColor: "#F4F7FD",
    //  borderRadius:8,
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
    opacity: 0.8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 2,
  },
  socialLoginTxt: {
    color: "#4C4C4C",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default LoginScreen;
