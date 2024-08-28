import React, { useContext } from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView, View } from "react-native";
import { theme3 } from "../assets/branding/themes";
import Header from "./GlobalComponents/Header";
import { LanguageContext } from "../api/LanguageContext"; // Import LanguageContext

const HowItWorksScreen = () => {
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  return (
    <View style={styles.safeArea}>
      <Header title={translations.howItWorksTitle} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>{translations.howItWorksTitle}</Text>

        <Step number="1" title={translations.browseServicesTitle}>
          {translations.browseServicesText}
        </Step>

        <Step number="2" title={translations.chooseSlotTitle}>
          {translations.chooseSlotText}
        </Step>

        <Step number="3" title={translations.bookInstantlyTitle}>
          {translations.bookInstantlyText}
        </Step>

        <Step number="4" title={translations.enjoyServiceTitle}>
          {translations.enjoyServiceText}
        </Step>

        <Text style={styles.finalNote}>{translations.finalNote}</Text>
      </ScrollView>
    </View>
  );
};

const Step = ({ number, title, children }) => (
  <>
    <Text style={styles.stepTitle}>{`Step ${number}: ${title}`}</Text>
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
  stepTitle: {
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
  finalNote: {
    fontSize: 16,
    fontWeight: "500",
    color: theme3.fontColor,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default HowItWorksScreen;
