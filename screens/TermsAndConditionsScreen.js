import React from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView, View } from "react-native";
import Header from "./GlobalComponents/Header";
import { useContext } from "react";
import { LanguageContext } from "../api/LanguageContext";

const TermsAndConditionsScreen = () => {
  const { translations } = useContext(LanguageContext);

  return (
    <View style={styles.safeArea}>
      <Header title={translations.termsAndConditionsTitle} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>
          {translations.termsAndConditionsTitle}
        </Text>

        <Section title={translations.introductionTitle}>
          {translations.introductionText}
        </Section>

        <Section title={translations.dataCollectionTitle}>
          {translations.dataCollectionText}
        </Section>

        <Section title={translations.bookingTitle}>
          {translations.bookingText}
        </Section>

        <Section title={translations.providerSlotManagementTitle}>
          {translations.providerSlotManagementText}
        </Section>

        <Section title={translations.authenticationTitle}>
          {translations.authenticationText}
        </Section>

        <Section title={translations.changesToTermsTitle}>
          {translations.changesToTermsText}
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
    color: "#333",
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    color: "#444",
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color: "#666",
  },
});

export default TermsAndConditionsScreen;
