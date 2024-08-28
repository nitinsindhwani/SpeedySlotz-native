import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Header from "./GlobalComponents/Header";
import { LanguageContext } from "../api/LanguageContext";
import { theme3 } from "../assets/branding/themes";
import { updateUserLanguage, getStoredUser } from "../api/ApiCall";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

const LanguageSelectionScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const navigation = useNavigation();
  const { translations, changeLanguage } = useContext(LanguageContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedLanguage) {
      setIsLoading(true);
      try {
        await SecureStore.setItemAsync(
          "selectedLanguage",
          JSON.stringify(selectedLanguage)
        );
        changeLanguage(selectedLanguage.code);
        const userData = await getStoredUser();

        if (!userData || !userData.user_id) {
          throw new Error("User ID is missing");
        }

        const userId = userData.user_id;
        await updateUserLanguage(userId, selectedLanguage.code);

        navigation.goBack();
      } catch (error) {
        console.error("Error saving language:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadSelectedLanguage();
  }, []);

  const loadSelectedLanguage = async () => {
    try {
      const storedLanguage = await SecureStore.getItemAsync("selectedLanguage");
      if (storedLanguage) {
        setSelectedLanguage(JSON.parse(storedLanguage));
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language);
    try {
      await SecureStore.setItemAsync(
        "selectedLanguage",
        JSON.stringify(language)
      );
      changeLanguage(language.code);
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={theme3.primaryColor}
        barStyle="light-content"
      />
      <Header title={translations.language_selection} />
      <View style={styles.container}>
        <Text style={styles.title}>
          {translations.select_preferred_language}
        </Text>
        <FlatList
          data={languages}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.code}
          style={styles.list}
        />
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!selectedLanguage || isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Updating..." : translations.save_and_return}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme3.primaryColor,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme3.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme3.fontColor,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: theme3.fontColorLight,
  },
  list: {
    flex: 1,
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
    fontSize: 16,
    color: theme3.fontColor,
  },
  checkIcon: {
    marginLeft: "auto",
  },
  submitButton: {
    backgroundColor: theme3.primaryColor,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: theme3.backgroundColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LanguageSelectionScreen;
