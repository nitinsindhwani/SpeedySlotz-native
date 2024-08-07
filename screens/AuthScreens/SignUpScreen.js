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
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";
import eye from "../../assets/newimage/eye.png";
import { ScrollView } from "react-native-gesture-handler";
import { theme3 } from "../../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;

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
  const [errorModal, setErrorModal] = useState(false);
  const [AlertTitle, setAlertTitle] = useState("Signup Error");
  const [AlertBody, setAlertBody] = useState("");

  useEffect(() => {
    PushNotification();
  }, []);

  const validateForm = () => {
    let hasError = false;

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required.");
      hasError = true;
    } else if (!/^\d{10,15}$/.test(phoneNumber)) {
      setPhoneNumberError("Invalid phone number.");
      hasError = true;
    } else {
      setPhoneNumberError("");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, and include one uppercase letter, one lowercase letter, and one number."
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

  const handleSignUp = async () => {
    setPressed(true);
    if (!validateForm()) {
      return;
    }

    const token = await SecureStore.getItemAsync("push_notification");

    const userData = {
      username,
      password,
      email,
      first_name: firstname,
      last_name: lastname,
      phoneNumber,
      quick_login: true,
      role: "USER",
      push_notification: token,
    };

    try {
      setLoading(true);
      const response = await signupUser(userData);

      if (response.payload.warnings && response.payload.warnings.length > 0) {
        setAlertBody(response.payload.warnings.join("\n"));
        setErrorModal(true);
      } else if (response.payload) {
        setUsername("");
        setFirstname("");
        setLastname("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        navigation.navigate("ResendEmailScreen", { user: response.payload });
      }
    } catch (error) {
      console.error("Signup failed:", error.message);
      setAlertBody("Signup failed. Please check your data and try again.");
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  function handleBack() {
    setIndex(0);
  }

  function onErrorAction() {
    setErrorModal(false);
  }

  return (
    <ImageBackground source={AuthBg} style={Styles.Container}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={Styles.TopView}>
          <Ionicons
            name="arrow-back-outline"
            style={{ marginLeft: 5 }}
            size={25}
            color="#4C4C4C"
            onPress={handleBack}
          />
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
                  value={firstname}
                  onChangeText={(e) => setFirstname(e)}
                />
              </View>
              {isPressed && firstnameError && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {firstnameError}
                </Text>
              )}

              <Text style={styles.Text}>Last Name</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Lastname"
                  value={lastname}
                  onChangeText={(e) => setLastname(e)}
                />
              </View>
              {isPressed && lastnameError && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {lastnameError}
                </Text>
              )}

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
              {isPressed && usernameError && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {usernameError}
                </Text>
              )}

              <Text style={styles.Text}>Email</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Email"
                  value={email}
                  onChangeText={(e) => setEmail(e)}
                  autoCapitalize="none"
                />
              </View>
              {isPressed && emailError && (
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
              {isPressed && phoneNumberError && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {phoneNumberError}
                </Text>
              )}

              <Text style={styles.Text}>Password</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Password"
                  value={password}
                  onChangeText={(e) => setPassword(e)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Image
                    source={eye}
                    style={{ width: 20, height: 20, marginRight: 13 }}
                  />
                </TouchableOpacity>
              </View>
              {isPressed && passwordError && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {passwordError}
                </Text>
              )}

              <Text style={styles.Text}>Confirm Password</Text>
              <View style={Styles.InputView}>
                <TextInput
                  style={{ marginLeft: 13, flex: 1 }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(e) => setConfirmPassword(e)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  <Image
                    source={eye}
                    style={{ width: 20, height: 20, marginRight: 13 }}
                  />
                </TouchableOpacity>
              </View>
              {isPressed && confirmPasswordError && (
                <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                  {confirmPasswordError}
                </Text>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={() => (index === 0 ? setIndex(1) : handleSignUp())}
          style={Styles.LoginBtn}
        >
          <Text style={Styles.LoginTxt}>
            {index === 0 ? "Next >>>" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {index === 1 && (
          <TouchableOpacity onPress={handleBack} style={Styles.LoginBtn}>
            <Text style={Styles.LoginTxt}>{"<<< Back"}</Text>
          </TouchableOpacity>
        )}

        <Text style={{ color: "#8A8A8A", marginTop: 20 }}>
          By signing up you agree to terms and policy.
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

        <ErrorAlert
          show={errorModal}
          onAction={onErrorAction}
          title={AlertTitle}
          body={AlertBody}
        />
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
});

export default SignUpScreen;
