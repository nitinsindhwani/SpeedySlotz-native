import React, { useContext } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext"; // Assuming you have this context

const PrivacyScreen = () => {
  const { translations } = useContext(LanguageContext);

  return (
    <View style={styles.safeArea}>
      <Header title={translations.privacy_policy} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>{translations.privacy_policy}</Text>

        <Section title={translations.introduction}>
          {translations.introduction_content}
        </Section>

        <Section title={translations.information_collection}>
          {translations.information_collection_content}
        </Section>

        <Section title={translations.usage_of_information}>
          {translations.usage_of_information_content}
        </Section>

        <Section title={translations.sharing_of_information}>
          {translations.sharing_of_information_content}
        </Section>

        <Section title={translations.cookies}>
          {translations.cookies_content}
        </Section>

        <Section title={translations.data_security}>
          {translations.data_security_content}
        </Section>

        <Section title={translations.changes_to_privacy_policy}>
          {translations.changes_to_privacy_policy_content}
        </Section>

        <Section title={translations.contact_us}>
          {translations.contact_us_content}
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

export default PrivacyScreen;
