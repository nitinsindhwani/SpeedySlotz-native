import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { theme3 } from "../../assets/branding/themes";
import { saveProfiles } from "../../api/ApiCall";
import { FontAwesome5 } from "@expo/vector-icons";

const UserDentalInformationForm = ({ profilesData, onFormValidation }) => {
  const [lastDentalVisit, setLastDentalVisit] = useState("");
  const [dentalAllergies, setDentalAllergies] = useState("");
  const [dentalComplaints, setDentalComplaints] = useState("");
  const [dentalMedications, setDentalMedications] = useState("");
  const [gumDiseaseHistory, setGumDiseaseHistory] = useState("");
  const [lastDentalXray, setLastDentalXray] = useState("");
  const [orthodonticHistory, setOrthodonticHistory] = useState("");
  const [otherDentalInfo, setOtherDentalInfo] = useState("");
  const [toothExtractionHistory, setToothExtractionHistory] = useState("");

  useEffect(() => {
    if (profilesData) {
      setLastDentalVisit(profilesData.lastDentalVisit || "");
      setDentalAllergies(profilesData.dentalAllergies || "");
      setDentalComplaints(profilesData.dentalComplaints || "");
      setDentalMedications(profilesData.dentalMedications || "");
      setGumDiseaseHistory(profilesData.gumDiseaseHistory || "");
      setLastDentalXray(profilesData.lastDentalXray || "");
      setOrthodonticHistory(profilesData.orthodonticHistory || "");
      setOtherDentalInfo(profilesData.otherDentalInfo || "");
      setToothExtractionHistory(profilesData.toothExtractionHistory || "");
    }
  }, [profilesData]);

  // Validate if all fields are filled
  useEffect(() => {
    const isFormComplete =
      lastDentalVisit.trim() &&
      dentalAllergies.trim() &&
      dentalComplaints.trim() &&
      dentalMedications.trim() &&
      gumDiseaseHistory.trim() &&
      lastDentalXray.trim() &&
      orthodonticHistory.trim() &&
      otherDentalInfo.trim() &&
      toothExtractionHistory.trim();

    onFormValidation(isFormComplete);
  }, [
    lastDentalVisit,
    dentalAllergies,
    dentalComplaints,
    dentalMedications,
    gumDiseaseHistory,
    lastDentalXray,
    orthodonticHistory,
    otherDentalInfo,
    toothExtractionHistory,
    onFormValidation,
  ]);

  const handleSaveDentalInformation = async () => {
    if (
      !lastDentalVisit.trim() ||
      !dentalAllergies.trim() ||
      !dentalComplaints.trim() ||
      !dentalMedications.trim() ||
      !gumDiseaseHistory.trim() ||
      !lastDentalXray.trim() ||
      !orthodonticHistory.trim() ||
      !otherDentalInfo.trim() ||
      !toothExtractionHistory.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in all fields before submitting."
      );
      return;
    }
    const profileData = {
      userDentalInformation: {
        lastDentalVisit,
        dentalAllergies,
        dentalComplaints,
        dentalMedications,
        gumDiseaseHistory,
        lastDentalXray,
        orthodonticHistory,
        otherDentalInfo,
        toothExtractionHistory,
      },
    };
    try {
      const response = await saveProfiles(profileData);
      if (response.success) {
        alert("Dental information saved successfully");
      }
    } catch (error) {
      console.error("Failed to save dental information:", error);
    }
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="calendar-check"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Dental Visit"
            value={lastDentalVisit}
            onChangeText={setLastDentalVisit}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="x-ray" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Last Dental X-ray"
            value={lastDentalXray}
            onChangeText={setLastDentalXray}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="allergies"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Dental Allergies"
            value={dentalAllergies}
            onChangeText={setDentalAllergies}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="tooth" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Dental Complaints"
            value={dentalComplaints}
            onChangeText={setDentalComplaints}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="smile-beam"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Orthodontic History"
            value={orthodonticHistory}
            onChangeText={setOrthodonticHistory}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="sad-tear" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Gum Disease History"
            value={gumDiseaseHistory}
            onChangeText={setGumDiseaseHistory}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="tooth" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Tooth Extraction History"
            value={toothExtractionHistory}
            onChangeText={setToothExtractionHistory}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="pills" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Dental Medications"
            value={dentalMedications}
            onChangeText={setDentalMedications}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="info-circle"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Other Dental Information"
            value={otherDentalInfo}
            onChangeText={setOtherDentalInfo}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          onPress={handleSaveDentalInformation}
          style={[
            styles.button,
            !lastDentalVisit.trim() ||
            !dentalAllergies.trim() ||
            !dentalComplaints.trim() ||
            !dentalMedications.trim() ||
            !gumDiseaseHistory.trim() ||
            !lastDentalXray.trim() ||
            !orthodonticHistory.trim() ||
            !otherDentalInfo.trim() ||
            !toothExtractionHistory.trim()
              ? styles.disabledButton
              : null,
          ]}
          disabled={
            !lastDentalVisit.trim() ||
            !dentalAllergies.trim() ||
            !dentalComplaints.trim() ||
            !dentalMedications.trim() ||
            !gumDiseaseHistory.trim() ||
            !lastDentalXray.trim() ||
            !orthodonticHistory.trim() ||
            !otherDentalInfo.trim() ||
            !toothExtractionHistory.trim()
          }
        >
          <Text style={styles.buttonText}>Save Dental Information</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.25,
    borderColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: theme3.fontColor,
  },
  button: {
    width: "100%",
    backgroundColor: theme3.primaryColor,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserDentalInformationForm;
