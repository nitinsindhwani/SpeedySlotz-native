import React, { useContext } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext"; // Import LanguageContext

const HelpCenterScreen = () => {
  const { translations } = useContext(LanguageContext); // Use LanguageContext

  const questionsAnswers = [
    {
      question: translations.helpCenterQuestion1,
      answer: translations.helpCenterAnswer1,
    },
    {
      question: translations.helpCenterQuestion2,
      answer: translations.helpCenterAnswer2,
    },
    {
      question: translations.helpCenterQuestion3,
      answer: translations.helpCenterAnswer3,
    },
    {
      question: translations.helpCenterQuestion4,
      answer: translations.helpCenterAnswer4,
    },
    // Add more questions and answers as needed
  ];

  return (
    <View style={styles.safeArea}>
      <Header title={translations.helpCenterTitle} />
      <ScrollView style={styles.container}>
        {questionsAnswers.map((qa, index) => (
          <TouchableOpacity
            key={index}
            style={styles.questionContainer}
            onPress={() => alert(qa.answer)} // For demonstration purposes
          >
            <Text style={styles.questionText}>{qa.question}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  questionContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: theme3.light,
    borderBottomColor: "#e0ee0e0",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme3.fontColor,
  },
});

export default HelpCenterScreen;
