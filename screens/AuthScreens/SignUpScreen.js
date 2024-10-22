import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { signupUser } from "../../api/ApiCall";
import * as SecureStore from "expo-secure-store";
import { PushNotification } from "../../api/PushNotification";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";
import eye from "../../assets/newimage/eye.png";

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
  const [AlertTitle] = useState("Signup Error");
  const [AlertBody, setAlertBody] = useState("");

  useEffect(() => {
    PushNotification();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  const passwordPolicy = [
    "At least 8 characters long",
    "One uppercase letter",
    "One lowercase letter",
    "One number",
    "One special character (@, $, !, %, *, ?, &)",
  ];

  const resetErrors = () => {
    setUsernameError("");
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
    setPhoneNumberError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const validateFirstScreen = () => {
    let hasError = false;
    resetErrors();

    if (!firstname) {
      setFirstnameError("First name is required.");
      hasError = true;
    }
    if (!lastname) {
      setLastnameError("Last name is required.");
      hasError = true;
    }
    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    }
    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      hasError = true;
    }

    return !hasError;
  };

  const validateForm = () => {
    let hasError = false;
    resetErrors();

    if (!firstname) {
      setFirstnameError("First name is required.");
      hasError = true;
    }
    if (!lastname) {
      setLastnameError("Last name is required.");
      hasError = true;
    }
    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    }
    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      hasError = true;
    }
    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required.");
      hasError = true;
    } else if (!/^\d{10,15}$/.test(phoneNumber)) {
      setPhoneNumberError("Invalid phone number.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password does not meet the required criteria.");
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    return !hasError;
  };

  const handleSignUp = async () => {
    setPressed(true);
    if (!validateForm()) return;

    const token = await SecureStore.getItemAsync("push_notification");
    const userData = {
      username: username.toLowerCase(),
      password,
      email: email.toLowerCase(),
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
        response.warnings?.length > 0
      ) {
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
      setAlertBody("Signup failed. Please check your data and try again.");
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: "height" })}
      style={styles.container}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 40 })}
    >
      <ImageBackground source={AuthBg} style={styles.backgroundImage}>
        <View style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            keyboardDismissMode="interactive"
            bounces={false}
          >
            <View style={styles.innerContainer}>
              <Image source={Logo} style={styles.logo} resizeMode="contain" />

              <View style={styles.formWrapper}>
                {index === 0 ? (
                  <View style={styles.formPageOne}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>First Name</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Firstname"
                          value={firstname}
                          onChangeText={setFirstname}
                        />
                      </View>
                      {isPressed && firstnameError ? (
                        <Text style={styles.errorText}>{firstnameError}</Text>
                      ) : null}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Last Name</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Lastname"
                          value={lastname}
                          onChangeText={setLastname}
                        />
                      </View>
                      {isPressed && lastnameError ? (
                        <Text style={styles.errorText}>{lastnameError}</Text>
                      ) : null}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Username</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Username"
                          value={username}
                          onChangeText={(text) => {
                            setUsername(
                              text.charAt(0).toLowerCase() + text.slice(1)
                            );
                          }}
                          autoCapitalize="none"
                        />
                      </View>
                      {isPressed && usernameError ? (
                        <Text style={styles.errorText}>{usernameError}</Text>
                      ) : null}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Email"
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                      </View>
                      {isPressed && emailError ? (
                        <Text style={styles.errorText}>{emailError}</Text>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View style={styles.formPageTwo}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Phone</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Phone"
                          keyboardType="numeric"
                          value={phoneNumber}
                          onChangeText={setPhoneNumber}
                        />
                      </View>
                      {isPressed && phoneNumberError ? (
                        <Text style={styles.errorText}>{phoneNumberError}</Text>
                      ) : null}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Referral Code</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Referral Code"
                          value={referralCode}
                          onChangeText={setReferralCode}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
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
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Confirm Password</Text>
                      <View style={[Styles.InputView, styles.inputContainer]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!showConfirmPassword}
                          autoCapitalize="none"
                        />
                        <TouchableOpacity
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <Image source={eye} style={styles.eyeIcon} />
                        </TouchableOpacity>
                      </View>
                      {isPressed && confirmPasswordError ? (
                        <Text style={styles.errorText}>
                          {confirmPasswordError}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}

                <View style={styles.actionContainer}>
                  {index === 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setPressed(true);
                        if (validateFirstScreen()) {
                          setIndex(1);
                        }
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Next &gt;&gt;&gt;</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={handleSignUp}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>Sign Up</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setIndex(0)}
                        style={[styles.button, styles.backButton]}
                      >
                        <Text style={styles.buttonText}>{"<<< Back"}</Text>
                      </TouchableOpacity>
                    </>
                  )}

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
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>

      <ErrorAlert
        show={errorModal}
        onAction={() => setErrorModal(false)}
        title={AlertTitle}
        body={AlertBody}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: Platform.select({ ios: 40, android: 20 }),
    paddingBottom: Platform.select({ ios: 120, android: 140 }),
  },
  logo: {
    width: Platform.select({ ios: 120, android: 100 }),
    height: Platform.select({ ios: 120, android: 100 }),
    marginBottom: Platform.select({ ios: 20, android: 15 }),
  },
  formWrapper: {
    width: "100%",
    flex: 1,
  },
  formPageOne: {
    width: "100%",
  },
  formPageTwo: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: Platform.select({ ios: 12, android: 10 }),
  },
  inputContainer: {
    width: "100%",
    height: Platform.select({ ios: 45, android: 40 }),
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: {
    color: "#4C4C4C",
    marginBottom: 4,
    fontWeight: "600",
    fontSize: Platform.select({ ios: 14, android: 13 }),
  },
  input: {
    flex: 1,
    fontSize: Platform.select({ ios: 15, android: 14 }),
    color: "#333",
    paddingVertical: Platform.select({ ios: 8, android: 6 }),
  },
  errorText: {
    color: theme3.ErrorColor,
    fontSize: Platform.select({ ios: 12, android: 11 }),
    marginTop: 4,
  },
  policyText: {
    color: "#8A8A8A",
    fontSize: Platform.select({ ios: 12, android: 11 }),
    marginTop: 2,
    marginLeft: 15,
  },
  actionContainer: {
    width: "100%",
    marginTop: Platform.select({ ios: 20, android: 16 }),
  },
  button: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: Platform.select({ ios: 15, android: 12 }),
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: theme3.secondaryColor,
  },
  buttonText: {
    color: "white",
    fontSize: Platform.select({ ios: 16, android: 14 }),
    fontWeight: "600",
  },
  bottomTextContainer: {
    width: "100%",
    marginTop: Platform.select({ ios: 20, android: 16 }),
    paddingBottom: Platform.select({ ios: 20, android: 16 }),
  },
  termsText: {
    color: "#8A8A8A",
    textAlign: "center",
    marginBottom: 8,
    fontSize: Platform.select({ ios: 13, android: 12 }),
  },
  loginPromptText: {
    color: "#8A8A8A",
    textAlign: "center",
    fontSize: Platform.select({ ios: 14, android: 13 }),
  },
  loginLink: {
    color: theme3.primaryColor,
    fontWeight: "bold",
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: theme3.secondaryColor,
  },
});

export default SignUpScreen;
