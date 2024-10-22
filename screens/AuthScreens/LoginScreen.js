import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  loginUser,
  socialLoginUser,
  updateUserLanguage,
} from "../../api/ApiCall";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import { PushNotification } from "../../api/PushNotification";
import LoadingModal from "../GlobalComponents/LoadingModal";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import { LanguageContext } from "../../api/LanguageContext";
// import { logAnalyticsEvent } from "../../firebaseConfig";
import eye from "../../assets/newimage/eye.png";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Logo from "../../assets/newimage/Logo1.png";
import Line from "../../assets/newimage/Line.png";
import * as AuthSession from "expo-auth-session";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import SocialButton from "../../components/SocialButton";
import {
  keycloakTokenCompleteUrl,
  clientId,
  baseKeyCloakCompleteUrl,
} from "../../api/Config";

const WindowWidth = Dimensions.get("window").width;

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [securetext, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [AlertTitle, setAlertTitle] = useState("Error Login");
  const [AlertBody, setAlertBody] = useState(
    "Invalid username or password. Please check your credentials and try again."
  );
  const navigation = useNavigation();
  const { language, translations } = useContext(LanguageContext);
  const [isGoogleLoginInitiated, setIsGoogleLoginInitiated] = useState(false);

  const redirectUri = makeRedirectUri({
    scheme: "speedyslotz",
    path: "auth",
    useProxy: false,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      redirectUri,
      scopes: ["openid", "email", "profile"],
      responseType: "code",
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    },
    {
      authorizationEndpoint: baseKeyCloakCompleteUrl,
    }
  );

  useEffect(() => {
    if (
      isGoogleLoginInitiated &&
      response?.type === "success" &&
      response.params?.code
    ) {
      exchangeCodeForToken(response.params.code);
      setIsGoogleLoginInitiated(false);
    }
  }, [response, isGoogleLoginInitiated]);

  const handleGoogleLogin = async () => {
    setIsGoogleLoginInitiated(true);
    await promptAsync();
  };
  const handleSocialLogin = (platform) => {};

  // Function to exchange the authorization code for an access token
  const exchangeCodeForToken = async (code) => {
    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("code", code);
    data.append("redirect_uri", redirectUri);
    data.append("client_id", clientId);
    data.append("code_verifier", request?.codeVerifier);

    try {
      const tokenResponse = await axios.post(keycloakTokenCompleteUrl, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = tokenResponse.data.access_token;

      if (token) {
        await SecureStore.setItemAsync("userToken", token);
        const socialLoginResponse = await socialLoginUser(token);

        if (socialLoginResponse.data && socialLoginResponse.data.success) {
          const userData = socialLoginResponse.data.payload;

          // Serialize userData before storing
          await SecureStore.setItemAsync("userData", JSON.stringify(userData));

          await updateLanguagePreference(userData);
          navigation.navigate("BottomNavigation", { user: userData });
        } else {
          console.error("Social login failed:", socialLoginResponse.data);
          setErrorModal(true);
          setAlertBody("Social login failed. Please try again.");
        }
      } else {
        console.error("No token received in response:", tokenResponse.data);
        setErrorModal(true);
        setAlertBody(
          "Failed to receive authentication token. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Error in authentication process:",
        error.response ? error.response.data : error.message
      );
      setErrorModal(true);
      setAlertBody("Authentication failed. Please try again.");
    }
  };

  const passwordPolicy = [
    translations.passwordPolicyLength,
    translations.passwordPolicyUppercase,
    translations.passwordPolicyLowercase,
    translations.passwordPolicyNumber,
    translations.passwordPolicySpecial,
  ];

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&.]{6,}$/;

  const validateForm = () => {
    let hasError = false;

    if (!username) {
      setUsernameError(translations.usernameRequired);
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError(translations.passwordRequired);
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(translations.passwordCriteria);
      hasError = true;
    } else {
      setPasswordError("");
    }

    return !hasError;
  };

  const handleLogin = async () => {
    // logAnalyticsEvent("login", { method: "email" });
    if (!validateForm()) {
      return;
    }

    try {
      const response = await loginUser(username, password);

      if (response.success) {
        await updateLanguagePreference(response.payload);
        proceedAfterLogin(response.payload);
      } else {
        setErrorModal(true);
        setAlertBody(translations.loginError);
      }
    } catch (error) {
      setErrorModal(true);
    } finally {
    }
  };

  const updateLanguagePreference = async (user) => {
    try {
      if (!user || !user.user_id) {
        console.warn("Invalid user data, skipping language update");
        return;
      }

      const storedLanguage = await SecureStore.getItemAsync("selectedLanguage");
      if (storedLanguage) {
        const parsedLanguage = JSON.parse(storedLanguage);

        await updateUserLanguage(user.user_id, parsedLanguage.code);
      } else {
        console.log("No stored language preference found");
      }
    } catch (error) {
      console.error("Error updating language preference:", error);
    }
  };

  const proceedAfterLogin = (user) => {
    if (user.email_verified) {
      navigation.navigate("BottomNavigation", { user: user });
    } else {
      navigation.navigate("ResendEmailScreen", { user: user });
    }
  };
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  function onErrorAction() {
    setErrorModal(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
    >
      <ImageBackground source={AuthBg} style={styles.backgroundImage}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />

            <View style={styles.formContainer}>
              {/* Username Section */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>{translations.username}</Text>
                <View style={[Styles.InputView, styles.inputContainer]}>
                  <TextInput
                    style={styles.input}
                    placeholder={translations.username}
                    value={username}
                    onChangeText={(e) => setUsername(e)}
                    autoCapitalize="none"
                    autoCompleteType="username"
                  />
                </View>
                {usernameError ? (
                  <Text style={styles.errorText}>{usernameError}</Text>
                ) : null}
              </View>

              {/* Password Section */}
              <View style={styles.inputSection}>
                <View style={styles.passwordContainer}>
                  <Text style={styles.inputLabel}>{translations.password}</Text>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      {translations.forgotPassword}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[Styles.InputView, styles.inputContainer]}>
                  <TextInput
                    style={styles.input}
                    placeholder={translations.password}
                    value={password}
                    onChangeText={(e) => setPassword(e)}
                    secureTextEntry={securetext}
                    autoCapitalize="none"
                    autoCompleteType="password"
                  />
                  <TouchableOpacity
                    onPress={() => setSecureText((prev) => !prev)}
                  >
                    <Image source={eye} style={styles.eyeIcon} />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <View style={styles.passwordErrorContainer}>
                    <Text style={styles.errorText}>{passwordError}</Text>
                    {passwordPolicy.map((item, index) => (
                      <Text key={index} style={styles.policyText}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* Login Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>
                    {translations.loginButton}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Or Divider */}
              <View style={styles.orContainer}>
                <Image source={Line} style={styles.line} />
                <Text style={styles.orText}>{translations.or}</Text>
                <Image source={Line} style={styles.line} />
              </View>

              {/* Social Login */}
              <View style={styles.socialButtonContainer}>
                <SocialButton
                  platform="Google"
                  onPress={() => handleGoogleLogin()}
                />
              </View>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupPromptText}>
                  {translations.dontHaveAccount}{" "}
                  <Text
                    onPress={() => navigation.navigate("SignUpDecider")}
                    style={styles.signupLink}
                  >
                    {translations.signUp}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      <LoadingModal show={loading} />
      <ErrorAlert
        show={errorModal}
        onAction={onErrorAction}
        title={translations.errorLoginTitle}
        body={translations.errorLoginBody}
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
  innerContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 40 : 20, // Reduced top padding for Android
  },
  logo: {
    width: 140, // Slightly reduced logo size
    height: 140,
    marginBottom: Platform.OS === "ios" ? 30 : 20, // Reduced margin for Android
  },
  formContainer: {
    width: "90%",
    alignSelf: "center",
  },
  inputSection: {
    marginBottom: 10, // Reduced spacing between sections
  },
  inputContainer: {
    width: "100%",
    height: 45, // Optimized height for input containers
  },
  inputLabel: {
    color: "#4C4C4C",
    marginBottom: 3, // Reduced margin
    fontWeight: "bold",
    fontSize: 13, // Slightly smaller font
  },
  input: {
    flex: 1,
    marginLeft: 13,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8, // Reduced margin
  },
  forgotPasswordText: {
    color: theme3.primaryColor,
    fontWeight: "bold",
    fontSize: 13, // Slightly smaller font
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 13,
    tintColor: theme3.secondaryColor,
  },
  passwordErrorContainer: {
    marginTop: 3,
  },
  errorText: {
    color: theme3.ErrorColor,
    fontSize: 11, // Smaller error text
    marginTop: 2,
  },
  policyText: {
    color: "#8A8A8A",
    marginTop: 1,
    marginLeft: 15,
    fontSize: 11, // Smaller policy text
  },
  buttonContainer: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 14, // Slightly reduced padding
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    color: "#4C4C4C",
    marginHorizontal: 10,
    fontSize: 13,
  },
  socialButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  signupContainer: {
    width: "100%",
    paddingVertical: 10,
    marginBottom: Platform.OS === "ios" ? 20 : 10,
  },
  signupPromptText: {
    color: theme3.LightTxtClr,
    textAlign: "center",
    fontSize: 13,
  },
  signupLink: {
    color: theme3.primaryColor,
    fontWeight: "bold",
  },
});

export default LoginScreen;
