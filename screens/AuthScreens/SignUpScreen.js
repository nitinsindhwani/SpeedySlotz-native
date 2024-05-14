import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
// import { commonStyles } from '../../assets/styles/commonStyles';
// import { commonBranding } from '../../assets/branding/commonBranding';
import { signupUser } from "../../api/ApiCall";
import * as SecureStore from "expo-secure-store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
} from "react-native";
// import { ThemeContext, ThemeProvider } from "../../components/ThemeContext";
// import { translation } from "../../assets/translations/translations";
import { PushNotification } from "../../api/PushNotification";

import Styles from "../../assets/branding/GlobalStyles";

import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";
import eye from "../../assets/newimage/eye.png";
import { ScrollView } from "react-native-gesture-handler";
import { theme3 } from "../../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;
const SignUpScreen = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isPressed, setPressed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // const { currentTheme } = useContext(ThemeContext);
  // const styles = getStyles(currentTheme);

  useEffect(() => {
    PushNotification();
  }, []);

  const validateForm = () => {
    let hasError = false;

    // Basic validation to check if fields are not empty
    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!firstname) {
      setFirstnameError("First name is required.");
      hasError = true;
    } else {
      setFirstnameError("");
    }

    if (!lastname) {
      setLastnameError("Last name is required.");
      hasError = true;
    } else {
      setLastnameError("");
    }

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required.");
      hasError = true;
    } else {
      setPhoneNumberError("");
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit."
      );
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    return !hasError;
  };

  const ValidateForm = () => {
    setPressed(true);
    if (index === 0) {
      if (!firstname) {
        setFirstnameError("Firstname is required");
      }
      if (!lastname) {
        setLastnameError("Lastname is required");
      }
      if (!username) {
        setUsernameError("Username is required");
      }
      if (!email) {
        setEmailError("Email is required");
      } else {
        setIndex(1);
        setPressed(false);
      }
    } else {
      if (!phoneNumber) {
        setPhoneNumberError("Phone is required");
      }
      if (password.length < 6) {
        setPasswordError("password should at least 6 characters");
      }
      if (confirmPassword.length < 6) {
        setConfirmPasswordError(
          "Confirm password should be atleast 6 charaters"
        );
      } else if (confirmPassword !== password) {
        setConfirmPasswordError("Confirm password should match password");
      } else {
        handleSignUp();
      }
    }
  };

  const handleSignUp = async () => {
    // if (!validateForm()) {
    //   return;
    // }

    const token = await SecureStore.getItemAsync("push_notification");
    console.log("In Signup Successful:");
    const userData = {
      username,
      password: password,
      email,
      first_name: firstname,
      last_name: lastname,
      phoneNumber,
      quick_login: true,
      role: "USER",
      push_notification: token,
    };

    try {
      // Call the signup API to register the user
      const response = await signupUser(userData);
      console.log("Signup Successful:", response);

      // Clear form fields after successful signup

      if (response) {
        setUsername("");
        setFirstname("");
        setLastname("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        navigation.navigate("ResendEmailScreen", { user: response });
      }
    } catch (error) {
      console.error("Signup failed:", error.message);
      // Handle signup failure here (e.g., show an error message to the user)
      alert("Signup failed. Please check your data and try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  function handleBack() {
    setIndex(0);
  }
  return (
    <ImageBackground source={AuthBg} style={Styles.Container}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        // style={Styles.Container}
      >
        {/* <ImageBackground
     source={AuthBg}
    style={Styles.Container}
    > */}

        <View style={Styles.TopView}>
          <Ionicons
            name="arrow-back-outline"
            style={{ marginLeft: 5 }}
            size={25}
            color="#4C4C4C"
          />

          {/* <Text style={{color:"#4C4C4C",fontSize:24,marginLeft:5,marginTop:15,fontWeight:'bold'}}>Create an account</Text>
 <Text style={{color:'#8A8A8A',margin:5}}>Sign up to continue</Text> */}
        </View>

        <Image source={Logo} style={{ width: 160, height: 160 }} />

        <View style={[Styles.TopView, { marginTop: -30 }]}>
          {index === 0 ? (
            <>
              <Text style={styles.Text}>First Name</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Firstname"
                  keyboardType="email-address"
                  value={firstname}
                  onChangeText={(e) => setFirstname(e)}
                />
              </View>
              {isPressed === true && firstname.length < 1 && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {firstnameError}
                </Text>
              )}
              <Text style={styles.Text}>Last Name</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Lastname"
                  keyboardType="email-address"
                  value={lastname}
                  onChangeText={(e) => setLastname(e)}
                />
              </View>

              {isPressed === true && lastname.length < 1 && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {lastnameError}
                </Text>
              )}
              <Text style={styles.Text}>Username</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Username"
                  keyboardType="email-address"
                  value={username}
                  onChangeText={(e) => setUsername(e)}
                  autoCapitalize="none"
                />
              </View>

              {isPressed === true && username.length < 1 && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {usernameError}
                </Text>
              )}

              <Text style={[styles.Text]}>Email</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Email"
                  value={email}
                  onChangeText={(e) => setEmail(e)}
                  autoCapitalize="none"
                />
              </View>
              {isPressed === true && email.length < 1 && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {emailError}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.Text}>Phone</Text>

              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Phone"
                  keyboardType="numeric"
                  value={phoneNumber}
                  onChangeText={(e) => setPhoneNumber(e)}
                />
              </View>

              {isPressed === true && phoneNumber.length < 1 && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {phoneNumberError}
                </Text>
              )}

              <Text style={styles.Text}>Password</Text>
              <View style={[Styles.InputView]}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="password"
                  value={password}
                  onChangeText={(e) => setPassword(e)}
                  secureTextEntry={!showPassword} // Here showPassword will hide text if true
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Image
                    source={eye}
                    style={{ width: 20, height: 20, marginRight: 13 }}
                  />
                </TouchableOpacity>
              </View>

              {isPressed === true && password.length < 6 && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {passwordError}
                </Text>
              )}

              <Text style={styles.Text}>Confirm Password</Text>

              <View style={[Styles.InputView]}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(e) => setConfirmPassword(e)}
                  secureTextEntry={!showConfirmPassword} // Here showConfirmPassword will hide text if true
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  <Image
                    source={eye}
                    style={{ width: 20, height: 20, marginRight: 13 }}
                  />
                </TouchableOpacity>
              </View>
              {isPressed === true && confirmPassword.length < 6 && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {confirmPasswordError}
                </Text>
              )}
              {isPressed === true &&
                confirmPassword !== password &&
                confirmPassword.length >= 6 && (
                  <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                    {confirmPasswordError}
                  </Text>
                )}
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={() => (index === 0 ? ValidateForm() : handleBack())}
          style={Styles.LoginBtn}
        >
          <Text style={Styles.LoginTxt}>
            {index === 0 ? "Next >>>" : "Back <<<"}
          </Text>
        </TouchableOpacity>

        {index === 1 && (
          <TouchableOpacity
            onPress={() => ValidateForm()}
            style={Styles.LoginBtn}
          >
            <Text style={Styles.LoginTxt}>
              {loading === false ? "Sign Up" : "Loading..."}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={{ color: "#8A8A8A", marginTop: 20 }}>
          By signing Up you agree to terms and policy
        </Text>

        <Text style={{ color: "#8A8A8A", marginTop: 20 }}>
          Already have an account?{" "}
          <Text
            onPress={() => navigation.navigate("LoginScreen")}
            style={{ color: "#438EEC", fontWeight: "bold", marginLeft: 10 }}
          >
            Login
          </Text>
        </Text>
        {/* </ImageBackground> */}
      </ScrollView>
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
export default SignUpScreen;
