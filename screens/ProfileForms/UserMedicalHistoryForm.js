import React, { useState } from "react";
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
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
const UserMedicalHistoryForm = ({ profilesData }) => {
  const [allergies, setAllergies] = useState(profilesData?.allergies || "");
  const [currentMedications, setCurrentMedications] = useState(
    profilesData?.currentMedications || ""
  );
  const [pastMedications, setPastMedications] = useState(
    profilesData?.pastMedications || ""
  );
  const [surgicalHistory, setSurgicalHistory] = useState(
    profilesData?.surgicalHistory || ""
  );
  const [smokeAlcoholHistory, setSmokeAlcoholHistory] = useState(
    profilesData?.smokeAlcoholHistory || ""
  );
  const [chronicIllnesses, setChronicIllnesses] = useState(
    profilesData?.chronicIllnesses || ""
  );
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState(
    profilesData?.familyMedicalHistory || ""
  );
  const [recentHospitalVisits, setRecentHospitalVisits] = useState(
    profilesData?.recentHospitalVisits || ""
  );
  const [immunizationHistory, setImmunizationHistory] = useState(
    profilesData?.immunizationHistory || ""
  );
  const [pregnancyChildbirthHistory, setPregnancyChildbirthHistory] = useState(
    profilesData?.pregnancyChildbirthHistory || ""
  );
  const [otherMedicalInfo, setOtherMedicalInfo] = useState(
    profilesData?.otherMedicalInfo || ""
  );

  const handleSaveMedicalHistory = () => {
    let profileData = {
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
    const response = saveProfiles(profileData);
    // Add logic to pass data to the backend or parent component
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Known Allergies */}
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

        {/* Current Medications */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="pills" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Current Medications"
            value={currentMedications}
            onChangeText={setCurrentMedications}
          />
        </View>

        {/* Past Medications */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="history" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Past Medications"
            value={pastMedications}
            onChangeText={setPastMedications}
          />
        </View>

        {/* Previous Surgeries and Dates */}
        <View style={styles.iconInputContainer}>
          <FontAwesome name="scissors" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Previous Surgeries and Dates"
            value={surgicalHistory}
            onChangeText={setSurgicalHistory}
          />
        </View>

        {/* Smoke or Alcohol Consumption */}
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

        {/* Chronic Illnesses */}
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

        {/* Family History of Illnesses */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="users" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Family History of Illnesses (e.g., Heart Disease, Cancer)"
            value={familyMedicalHistory}
            onChangeText={setFamilyMedicalHistory}
          />
        </View>

        {/* Recent Hospital Visits */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="hospital" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Recent Hospitalizations or Emergency Visits"
            value={recentHospitalVisits}
            onChangeText={setRecentHospitalVisits}
          />
        </View>

        {/* Immunization History */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="syringe" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Immunization History"
            value={immunizationHistory}
            onChangeText={setImmunizationHistory}
          />
        </View>

        {/* Pregnancy and Childbirth History */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="baby" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Women: Pregnancy and Childbirth History"
            value={pregnancyChildbirthHistory}
            onChangeText={setPregnancyChildbirthHistory}
          />
        </View>

        {/* Other Relevant Medical Information */}
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

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveMedicalHistory}
          style={styles.button}
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
