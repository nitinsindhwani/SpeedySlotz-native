// AboutUsScreen.js
import React, { useContext } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext"; // Import LanguageContext

const AboutUsScreen = () => {
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  return (
    <View style={styles.safeArea}>
      <Header title={translations.aboutSpeedySlotz} />

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>{translations.aboutUsHeading}</Text>

        <Section title={translations.ourBeginningTitle}>
          {translations.ourBeginningText}
        </Section>

        <Section title={translations.solutionForAllTitle}>
          {translations.solutionForAllText}
        </Section>

        <Section title={translations.ourVisionTitle}>
          {translations.ourVisionText}
        </Section>

        <Section title={translations.contactUsTitle}>
          {translations.contactUsText}
        </Section>
      </ScrollView>
    </View>
  );
};

const Section = ({ title, children }) => (
  <>
    <Text style={styles.subHeading}>{title}</Text>
    <Text style={styles.text}>{children}</Text>
  </>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: theme3.fontColor,
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    color: theme3.fontColor,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color: theme3.fontColor,
  },
});

export default AboutUsScreen;
