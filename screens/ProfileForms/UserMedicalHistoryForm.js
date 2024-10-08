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
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const UserMedicalHistoryForm = ({ profilesData, onFormValidation }) => {
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [pastMedications, setPastMedications] = useState("");
  const [surgicalHistory, setSurgicalHistory] = useState("");
  const [smokeAlcoholHistory, setSmokeAlcoholHistory] = useState("");
  const [chronicIllnesses, setChronicIllnesses] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [recentHospitalVisits, setRecentHospitalVisits] = useState("");
  const [immunizationHistory, setImmunizationHistory] = useState("");
  const [pregnancyChildbirthHistory, setPregnancyChildbirthHistory] =
    useState("");
  const [otherMedicalInfo, setOtherMedicalInfo] = useState("");

  useEffect(() => {
    if (profilesData) {
      setAllergies(profilesData.allergies || "");
      setCurrentMedications(profilesData.currentMedications || "");
      setPastMedications(profilesData.pastMedications || "");
      setSurgicalHistory(profilesData.surgicalHistory || "");
      setSmokeAlcoholHistory(profilesData.smokeAlcoholHistory || "");
      setChronicIllnesses(profilesData.chronicIllnesses || "");
      setFamilyMedicalHistory(profilesData.familyMedicalHistory || "");
      setRecentHospitalVisits(profilesData.recentHospitalVisits || "");
      setImmunizationHistory(profilesData.immunizationHistory || "");
      setPregnancyChildbirthHistory(
        profilesData.pregnancyChildbirthHistory || ""
      );
      setOtherMedicalInfo(profilesData.otherMedicalInfo || "");
    }
  }, [profilesData]);

  // Validate if all fields are filled
  useEffect(() => {
    const isFormComplete =
      allergies.trim() &&
      currentMedications.trim() &&
      pastMedications.trim() &&
      surgicalHistory.trim() &&
      smokeAlcoholHistory.trim() &&
      chronicIllnesses.trim() &&
      familyMedicalHistory.trim() &&
      recentHospitalVisits.trim() &&
      immunizationHistory.trim() &&
      pregnancyChildbirthHistory.trim() &&
      otherMedicalInfo.trim();

    onFormValidation(isFormComplete);
  }, [
    allergies,
    currentMedications,
    pastMedications,
    surgicalHistory,
    smokeAlcoholHistory,
    chronicIllnesses,
    familyMedicalHistory,
    recentHospitalVisits,
    immunizationHistory,
    pregnancyChildbirthHistory,
    otherMedicalInfo,
    onFormValidation,
  ]);

  const handleSaveMedicalHistory = async () => {
    if (
      !allergies.trim() ||
      !currentMedications.trim() ||
      !pastMedications.trim() ||
      !surgicalHistory.trim() ||
      !smokeAlcoholHistory.trim() ||
      !chronicIllnesses.trim() ||
      !familyMedicalHistory.trim() ||
      !recentHospitalVisits.trim() ||
      !immunizationHistory.trim() ||
      !pregnancyChildbirthHistory.trim() ||
      !otherMedicalInfo.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in all fields before submitting."
      );
      return;
    }
    const profileData = {
      userMedicalHistory: {
        allergies,
        currentMedications,
        pastMedications,
        surgicalHistory,
        smokeAlcoholHistory,
        chronicIllnesses,
        familyMedicalHistory,
        recentHospitalVisits,
        immunizationHistory,
        pregnancyChildbirthHistory,
        otherMedicalInfo,
      },
    };
    try {
      const response = await saveProfiles(profileData);
      if (response.success) {
        alert("Medical history saved successfully");
      }
    } catch (error) {
      console.error("Failed to save medical history:", error);
    }
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="allergies"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Known Allergies (e.g., medication, food)"
            value={allergies}
            onChangeText={setAllergies}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="pills" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Current Medications"
            value={currentMedications}
            onChangeText={setCurrentMedications}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="history" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Past Medications"
            value={pastMedications}
            onChangeText={setPastMedications}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome name="scissors" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Previous Surgeries and Dates"
            value={surgicalHistory}
            onChangeText={setSurgicalHistory}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="wine-bottle"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Do you smoke or consume alcohol? Frequency?"
            value={smokeAlcoholHistory}
            onChangeText={setSmokeAlcoholHistory}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="heartbeat"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Diagnosed Chronic Illnesses (e.g., Diabetes, Hypertension)"
            value={chronicIllnesses}
            onChangeText={setChronicIllnesses}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="users" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Family History of Illnesses (e.g., Heart Disease, Cancer)"
            value={familyMedicalHistory}
            onChangeText={setFamilyMedicalHistory}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="hospital" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Recent Hospitalizations or Emergency Visits"
            value={recentHospitalVisits}
            onChangeText={setRecentHospitalVisits}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="syringe" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Immunization History"
            value={immunizationHistory}
            onChangeText={setImmunizationHistory}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="baby" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Women: Pregnancy and Childbirth History"
            value={pregnancyChildbirthHistory}
            onChangeText={setPregnancyChildbirthHistory}
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
            placeholder="Any other relevant medical information?"
            value={otherMedicalInfo}
            onChangeText={setOtherMedicalInfo}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          onPress={handleSaveMedicalHistory}
          style={[
            styles.button,
            !allergies.trim() ||
            !currentMedications.trim() ||
            !pastMedications.trim() ||
            !surgicalHistory.trim() ||
            !smokeAlcoholHistory.trim() ||
            !chronicIllnesses.trim() ||
            !familyMedicalHistory.trim() ||
            !recentHospitalVisits.trim() ||
            !immunizationHistory.trim() ||
            !pregnancyChildbirthHistory.trim() ||
            !otherMedicalInfo.trim()
              ? styles.disabledButton
              : null,
          ]}
          disabled={
            !allergies.trim() ||
            !currentMedications.trim() ||
            !pastMedications.trim() ||
            !surgicalHistory.trim() ||
            !smokeAlcoholHistory.trim() ||
            !chronicIllnesses.trim() ||
            !familyMedicalHistory.trim() ||
            !recentHospitalVisits.trim() ||
            !immunizationHistory.trim() ||
            !pregnancyChildbirthHistory.trim() ||
            !otherMedicalInfo.trim()
          }
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  disabledButton: {
    backgroundColor: "#ccc",
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

export default UserMedicalHistoryForm;
