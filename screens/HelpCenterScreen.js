// HelpCenterScreen.js
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const questionsAnswers = [
  {
    question: "How do I book a service on SpeedySlotz?",
    answer:
      "Simply browse the service category you need, select an available slot, and confirm your booking instantly. You will receive a confirmation for your booking.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes, you can cancel or reschedule your booking through the app. Please refer to the specific service provider's cancellation policy for details.",
  },
  {
    question: "What should I do if I'm running late?",
    answer:
      "We recommend contacting the service provider directly to inform them of any delays. The contact information can be found in your booking confirmation.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "Our customer support team can be reached at info@speedyslotz.com. We're here to help with any issues or questions you might have.",
  },
  // Add more questions and answers as needed
];

const HelpCenterScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Help Center</Text>
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
    </SafeAreaView>
  );
};

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
    marginBottom: 20,
  },
  questionContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#444",
  },
});

export default HelpCenterScreen;
