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
import { logAnalyticsEvent } from "../../firebaseConfig";
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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

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
    logAnalyticsEvent("login", { method: "email" });
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
      style={{ flex: 1 }}
    >
      <ImageBackground source={AuthBg} style={Styles.Container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={Logo} style={styles.logo} />

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>{translations.username}</Text>
            <View style={Styles.InputView}>
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

            <View style={styles.passwordContainer}>
              <Text style={styles.inputLabel}>{translations.password}</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  {translations.forgotPassword}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={Styles.InputView}>
              <TextInput
                style={styles.input}
                placeholder={translations.password}
                value={password}
                onChangeText={(e) => setPassword(e)}
                secureTextEntry={securetext}
                autoCapitalize="none"
                autoCompleteType="password"
              />
              <TouchableOpacity onPress={() => setSecureText((prev) => !prev)}>
                <Image source={eye} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <>
                <Text style={styles.errorText}>{passwordError}</Text>
                {passwordPolicy.map((item, index) => (
                  <Text key={index} style={styles.policyText}>
                    • {item}
                  </Text>
                ))}
              </>
            ) : null}
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

            <View style={styles.orContainer}>
              <Image source={Line} style={styles.line} />
              <Text style={styles.orText}>{translations.or}</Text>
              <Image source={Line} style={styles.line} />
            </View>

            <View style={styles.buttonContainer}>
              <SocialButton
                platform="Google"
                onPress={() => handleGoogleLogin()}
              />
            </View>

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
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
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
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  forgotPasswordText: {
    color: theme3.primaryColor,
    fontWeight: "bold",
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 13,
    tintColor: theme3.secondaryColor,
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
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 16,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#4C4C4C",
  },
  orText: {
    color: "#4C4C4C",
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signupPromptText: {
    color: theme3.LightTxtClr,
    textAlign: "center",
  },
  signupLink: {
    color: theme3.primaryColor,
    fontWeight: "bold",
  },
});

export default LoginScreen;
