import React, { useContext } from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView, View } from "react-native";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext"; // Import LanguageContext

const AboutSpeedySlotzScreen = () => {
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  return (
    <View style={styles.safeArea}>
      <Header title={translations.aboutSpeedySlotzTitle} />
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          {translations.aboutSpeedySlotzParagraph1}
        </Text>

        <Text style={styles.text}>
          {translations.aboutSpeedySlotzParagraph2}
        </Text>

        <Text style={styles.text}>
          {translations.aboutSpeedySlotzParagraph3}
        </Text>

        <Text style={styles.text}>
          {translations.aboutSpeedySlotzParagraph4}
        </Text>

        <Text style={styles.text}>
          {translations.aboutSpeedySlotzParagraph5}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: theme3.fontColor,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: theme3.fontColor,
  },
});

export default AboutSpeedySlotzScreen;
