import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext";

const { width, height } = Dimensions.get("window");

const UserGuide = ({ onCategorySelect }) => {
  const { translations } = useContext(LanguageContext);
  const [modalVisible, setModalVisible] = useState(false);

  const steps = [
    { icon: "map-marker-alt", text: translations.step1, color: "#FF6B6B" },
    { icon: "list-ul", text: translations.step2, color: "#4ECDC4" },
    { icon: "calendar-check", text: translations.step3, color: "#45B7D1" },
  ];

  const funFacts = [
    "Did you know? The average person spends 6 months of their life waiting in line. Not with us!",
    "Fun fact: The word 'appointment' comes from the Latin 'appointare', meaning 'to fix a time'. We prefer 'funpointment'!",
    "Riddle me this: What's always in front of you but can't be seen? The future! And we're here to make it awesome!",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="party-popper" size={40} color="#FFD700" />
        <Text style={styles.title}>{translations.funnyWelcomeTitle}</Text>
      </View>
      <View style={styles.card}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View
              style={[styles.iconContainer, { backgroundColor: step.color }]}
            >
              <FontAwesome5 name={step.icon} size={20} color="white" />
            </View>
            <Text style={styles.step}>{step.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.funFactContainer}>
        <Text style={styles.funFactTitle}>
          While you're here, enjoy these fun facts:
        </Text>
        {funFacts.map((fact, index) => (
          <Text key={index} style={styles.funFact}>
            • {fact}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme3.primaryColor,
    marginLeft: 10,
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  step: {
    fontSize: 18,
    color: theme3.fontColor,
    flex: 1,
  },
  funFactContainer: {
    marginBottom: 20,
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme3.primaryColor,
  },
  funFact: {
    fontSize: 16,
    marginBottom: 10,
    color: theme3.fontColor,
  },
  button: {
    backgroundColor: theme3.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme3.primaryColor,
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 18,
    color: theme3.fontColor,
    marginBottom: 30,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default UserGuide;
