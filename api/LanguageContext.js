import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import en from "../assets/translations/en";
import es from "../assets/translations/es";

export const LanguageContext = createContext();

const LANGUAGE_KEY = "app_language";
const DEFAULT_LANGUAGE = "en";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_KEY);

      if (savedLanguage) {
        setLanguage(savedLanguage);
        setTranslations(savedLanguage === "es" ? es : en);
      } else {
        // If no language is saved, set it to the default language
        await SecureStore.setItemAsync(LANGUAGE_KEY, DEFAULT_LANGUAGE);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const changeLanguage = async (lang) => {
    try {
      await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
      setLanguage(lang);
      setTranslations(lang === "es" ? es : en);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const updateLanguageAfterLogin = async (userPreferredLanguage) => {
    const currentDeviceLanguage = await SecureStore.getItemAsync(LANGUAGE_KEY);
    if (
      userPreferredLanguage &&
      userPreferredLanguage !== currentDeviceLanguage
    ) {
      await changeLanguage(userPreferredLanguage);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations,
        changeLanguage,
        updateLanguageAfterLogin,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
