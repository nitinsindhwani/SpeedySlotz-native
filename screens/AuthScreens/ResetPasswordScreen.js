import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Styles from "../../assets/branding/GlobalStyles";
import { LanguageContext } from "../../api/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/newimage/Logo1.png";
import eye from "../../assets/newimage/eye.png";
import { resetPassword, getStoredUser } from "../../api/ApiCall";
import { theme3 } from "../../assets/branding/themes";
import ErrorAlert from "../GlobalComponents/ErrorAlert"; // Import ErrorAlert component

const WindowWidth = Dimensions.get("window").width;

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // New state for showing the alert
  const navigation = useNavigation();
  const route = useRoute();
  const { translations } = useContext(LanguageContext);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (route.params?.userId) {
        setUserId(route.params.userId);
      } else {
        try {
          const userData = await getStoredUser();
          if (userData && userData.user_id) {
            setUserId(userData.user_id);
          }
        } catch (error) {
          console.error("Error fetching stored user:", error);
        }
      }
    };

    fetchUserId();
  }, [route.params]);

  const passwordPolicy = [
    translations.passwordPolicyLength,
    translations.passwordPolicyUppercase,
    translations.passwordPolicyLowercase,
    translations.passwordPolicyNumber,
    translations.passwordPolicySpecial,
  ];

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage(translations.passwordsDoNotMatch);
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setMessage(translations.passwordCriteria);
      return;
    }

    if (!userId) {
      setMessage("User Id is missing!");
      return;
    }

    try {
      const response = await resetPassword(userId, newPassword);
      setShowAlert(true); // Show the success alert
    } catch (error) {
      setMessage(translations.passwordResetFailed);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigation.navigate("LoginScreen");
  };

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

      <Image source={Logo} style={{ width: 160, height: 160, marginTop: 20 }} />

      <View style={[Styles.TopView, { marginTop: 20 }]}>
        <Text style={styles.Text}>{translations.newPassword}</Text>
        <View style={Styles.InputView}>
          <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            placeholder={translations.newPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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

        <Text style={styles.Text}>{translations.confirmPassword}</Text>
        <View style={Styles.InputView}>
          <TextInput
            style={{ marginLeft: 13, flex: 1 }}
            placeholder={translations.confirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
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

        {passwordPolicy.map((item, index) => (
          <Text
            key={index}
            style={{ color: "#8A8A8A", marginTop: 5, marginLeft: 15 }}
          >
            • {item}
          </Text>
        ))}

        {message && (
          <Text style={{ color: theme3.ErrorColor, marginTop: 10 }}>
            {message}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={handleResetPassword} style={Styles.LoginBtn}>
        <Text style={Styles.LoginTxt}>{translations.resetPassword}</Text>
      </TouchableOpacity>

      <ErrorAlert
        show={showAlert}
        onAction={handleCloseAlert}
        title={translations.success}
        body={translations.passwordResetSuccess}
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
});

export default ResetPasswordScreen;
