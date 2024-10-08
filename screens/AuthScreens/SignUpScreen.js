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
  Platform,
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
  const [referralCode, setReferralCode] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [referralCodeError, setReferralCodeError] = useState("");
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

  const resetErrors = () => {
    setUsernameError("");
    setFirstnameError("");
    setLastnameError("");
    setReferralCode("");
    setEmailError("");
    setPhoneNumberError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  // Updated password policy as an array of bullet points
  const passwordPolicy = [
    "At least 8 characters long",
    "One uppercase letter",
    "One lowercase letter",
    "One number",
    "One special character (@, $, !, %, *, ?, &)",
  ];
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  const validateFirstScreen = () => {
    let hasError = false;

    resetErrors();

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

    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      hasError = true;
    } else {
      setEmailError("");
    }

    return !hasError;
  };

  const validateForm = () => {
    let hasError = false;

    resetErrors();

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

    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
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

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password does not meet the required criteria.");
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
    resetErrors();
    if (!validateForm()) {
      return;
    }

    const token = await SecureStore.getItemAsync("push_notification");

    const userData = {
      username: username.toLowerCase(),
      password,
      email: email.toLowerCase(), // Convert email to lowercase
      first_name: firstname,
      last_name: lastname,
      phoneNumber,
      quick_login: true,
      role: "USER",
      push_notification: token,
    };

    try {
      setLoading(true);
      const response = await signupUser(userData, referralCode);

      if (
        response.success &&
        response.payload === null &&
        response.warnings &&
        response.warnings.length > 0
      ) {
        // Show generic message with warnings in bullet points
        let warningMessage = "Please address the following issues:";
        response.warnings.forEach((warning) => {
          warningMessage += `\n• ${warning}`;
        });
        setAlertBody(warningMessage);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground source={AuthBg} style={Styles.Container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={Logo} style={styles.logo} />

          <View style={styles.formContainer}>
            {index === 0 ? (
              <>
                {/* First page inputs */}
                <Text style={styles.inputLabel}>First Name</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Firstname"
                    value={firstname}
                    onChangeText={(e) => setFirstname(e)}
                  />
                </View>
                {isPressed && firstnameError ? (
                  <Text style={styles.errorText}>{firstnameError}</Text>
                ) : null}

                <Text style={styles.inputLabel}>Last Name</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Lastname"
                    value={lastname}
                    onChangeText={(e) => setLastname(e)}
                  />
                </View>
                {isPressed && lastnameError ? (
                  <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                    {lastnameError}
                  </Text>
                ) : null}

                <Text style={styles.inputLabel}>Username</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={{ marginLeft: 13, flex: 1 }}
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) => {
                      // Ensure the first character is always lowercase
                      const lowercaseText =
                        text.charAt(0).toLowerCase() + text.slice(1);
                      setUsername(lowercaseText);
                    }}
                    autoCapitalize="none"
                    autoCompleteType="username" // Important for username autofill
                    textContentType="username" // iOS-specific for username autofill
                  />
                </View>
                {isPressed && usernameError ? (
                  <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                    {usernameError}
                  </Text>
                ) : null}

                <Text style={styles.inputLabel}>Email</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={{ marginLeft: 13, flex: 1 }}
                    placeholder="Email"
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                    autoCapitalize="none" // This line ensures no auto-capitalization.
                    keyboardType="email-address"
                    autoCompleteType="email" // Important for email autofill
                    textContentType="emailAddress" // iOS-specific for email autofill
                  />
                </View>
                {isPressed && emailError ? (
                  <Text style={{ color: theme3.ErrorColor, marginTop: 5 }}>
                    {emailError}
                  </Text>
                ) : null}
              </>
            ) : (
              <>
                {/* Second page inputs */}
                <Text style={styles.inputLabel}>Phone</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={(e) => setPhoneNumber(e)}
                    autoCompleteType="tel"
                    textContentType="telephoneNumber"
                  />
                </View>
                {isPressed && phoneNumberError ? (
                  <Text style={styles.errorText}>{phoneNumberError}</Text>
                ) : null}

                <Text style={styles.inputLabel}>Referral Code</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Referral Code"
                    value={referralCode}
                    onChangeText={(e) => setReferralCode(e)}
                    autoCapitalize="none"
                  />
                </View>

                <Text style={styles.inputLabel}>Password</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(e) => setPassword(e)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCompleteType="password"
                    textContentType="newPassword"
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Image source={eye} style={styles.eyeIcon} />
                  </TouchableOpacity>
                </View>
                {isPressed && passwordError ? (
                  <>
                    <Text style={styles.errorText}>{passwordError}</Text>
                    {passwordPolicy.map((item, index) => (
                      <Text key={index} style={styles.policyText}>
                        • {item}
                      </Text>
                    ))}
                  </>
                ) : null}

                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={Styles.InputView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(e) => setConfirmPassword(e)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    textContentType="newPassword"
                  />
                  <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                    <Image source={eye} style={styles.eyeIcon} />
                  </TouchableOpacity>
                </View>
                {isPressed && confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </>
            )}
          </View>

          {index === 0 ? (
            <TouchableOpacity
              onPress={() => {
                setPressed(true);
                if (validateFirstScreen()) {
                  setIndex(1);
                }
              }}
              style={Styles.LoginBtn}
            >
              <Text style={Styles.LoginTxt}>Next &gt;&gt;&gt;</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={handleSignUp} style={Styles.LoginBtn}>
                <Text style={Styles.LoginTxt}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIndex(0)}
                style={Styles.LoginBtn}
              >
                <Text style={Styles.LoginTxt}>{"<<< Back"}</Text>
              </TouchableOpacity>
            </>
          )}

          <ErrorAlert
            show={errorModal}
            onAction={onErrorAction}
            title={AlertTitle}
            body={AlertBody}
          />
        </ScrollView>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.termsText}>
            By signing up, you agree to our Terms and Privacy Policy.
          </Text>
          <Text style={styles.loginPromptText}>
            Already have an account?{" "}
            <Text
              onPress={() => navigation.navigate("LoginScreen")}
              style={styles.loginLink}
            >
              Login
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 100,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputLabel: {
    color: "#4C4C4C",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    marginLeft: 13,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 13,
  },
  errorText: {
    color: theme3.ErrorColor,
    marginTop: 5,
    marginBottom: 5,
  },
  policyText: {
    color: "#8A8A8A",
    marginTop: 2,
    marginLeft: 15,
    fontSize: 12,
  },
  bottomTextContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  termsText: {
    color: "#8A8A8A",
    textAlign: "center",
    marginBottom: 10,
  },
  loginPromptText: {
    color: "#8A8A8A",
  },
  loginLink: {
    color: "#438EEC",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
