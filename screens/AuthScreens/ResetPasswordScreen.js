import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthBg from "../../assets/newimage/AuthBg.png";
import Styles from "../../assets/branding/GlobalStyles";
import { LanguageContext } from "../../api/LanguageContext"; // Import LanguageContext
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/newimage/Logo1.png";

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage(translations.passwordsDoNotMatch);
      return;
    }

    try {
      // Here you would typically call your API to reset the password

      navigation.navigate("Login"); // Navigate to login upon success
      setMessage(translations.passwordResetSuccess);
    } catch (error) {
      setMessage(translations.passwordResetFailed);
    }
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
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.heading}>{translations.resetYourPassword}</Text>
        <Text style={styles.description}>{translations.enterNewPassword}</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder={translations.newPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder={translations.confirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>{translations.resetPassword}</Text>
        </TouchableOpacity>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 160,
    height: 160,
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
    color: "red",
    marginTop: 20,
    textAlign: "center",
  },
});

export default ResetPasswordScreen;
