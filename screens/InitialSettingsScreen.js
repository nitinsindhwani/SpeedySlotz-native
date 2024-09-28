import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LanguageContext } from "../api/LanguageContext";
import Styles from "../assets/branding/GlobalStyles";
import { theme3 } from "../assets/branding/themes";
import AuthBg from "../assets/newimage/AuthBg.png";
import Logo from "../assets/newimage/Logo1.png";
import * as SecureStore from "expo-secure-store";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

const InitialSettingsScreen = ({ navigation }) => {
  const { language, changeLanguage, translations } =
    useContext(LanguageContext);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    loadStoredLanguage();
  }, []);

  const loadStoredLanguage = async () => {
    try {
      const storedLanguage = await SecureStore.getItemAsync("selectedLanguage");
      if (storedLanguage) {
        const parsedLanguage = JSON.parse(storedLanguage);
        setSelectedLanguage(parsedLanguage);
        changeLanguage(parsedLanguage.code);
      } else {
        // If no stored language, use the current language from context or default to English
        const initialLanguage =
          languages.find((lang) => lang.code === language) || languages[0];
        setSelectedLanguage(initialLanguage);
        changeLanguage(initialLanguage.code);
      }
    } catch (error) {
      console.error("Error loading stored language:", error);
      // In case of error, default to English
      setSelectedLanguage(languages[0]);
      changeLanguage(languages[0].code);
    }
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    changeLanguage(lang.code);
  };

  const handleContinue = async () => {
    try {
      // Ensure we have a selected language, defaulting to English if somehow it's not set
      const languageToStore = selectedLanguage || languages[0];

      // Store the selected language
      await SecureStore.setItemAsync(
        "selectedLanguage",
        JSON.stringify(languageToStore)
      );

      // Ensure the LanguageContext is updated
      changeLanguage(languageToStore.code);

      // Navigate to the Welcome screen
      navigation.navigate("Welcome");
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguage?.code === item.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text style={styles.languageFlag}>{item.flag}</Text>
      <Text style={styles.languageName}>{item.name}</Text>
      {selectedLanguage?.code === item.code && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={theme3.primaryColor}
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={AuthBg} style={Styles.Container}>
      <SafeAreaView style={styles.safeArea}>
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

        <Image source={Logo} style={styles.logo} />

        <View style={styles.content}>
          <Text style={styles.title}>{translations.initialSettings}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {translations.select_preferred_language}
            </Text>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.list}
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleContinue} style={Styles.LoginBtn}>
            <Text style={Styles.LoginTxt}>{translations.continue}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  logo: {
    width: 160,
    height: 160,
    marginTop: 20,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme3.primaryColor,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4C4C4C",
    marginBottom: 10,
  },
  list: {
    maxHeight: WindowHeight * 0.3,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme3.borderColor,
  },
  selectedLanguageItem: {
    backgroundColor: theme3.selectedItemColor,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    fontSize: 18,
    color: theme3.fontColor,
  },
  checkIcon: {
    marginLeft: "auto",
  },
  bottomContainer: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingBottom: 80, // Increased from 20 to 40
    marginBottom: 20, // Added this line to move the button up
  },
});

export default InitialSettingsScreen;
