import React, { useContext } from "react";
import { View, Text, StyleSheet, Switch, Dimensions } from "react-native";
import { LanguageContext } from "../api/LanguageContext";
import { MaterialIcons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  const toggleLanguage = async () => {
    const newLanguage = language === "en" ? "es" : "en";
    try {
      await storeLanguagePreference(newLanguage);
      changeLanguage(newLanguage);
    } catch (error) {
      console.error("Failed to store language preference:", error);
    }
  };

  const storeLanguagePreference = async (lang) => {
    // Implement your API call here
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <MaterialIcons
          name="language"
          color={theme3.fontColor}
          size={20}
          style={styles.icon}
        />
        <Text style={styles.text}>Language</Text>
      </View>
      <View style={styles.switchContainer}>
        <Text style={[styles.text, styles.languageText]}>
          {language === "en" ? "EN" : "ES"}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: theme3.primaryColor }}
          thumbColor={language === "en" ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleLanguage}
          value={language === "es"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WindowWidth / 1.15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: theme3.fontColor,
    fontWeight: "500",
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageText: {
    marginRight: 10,
  },
});

export default LanguageSwitcher;
