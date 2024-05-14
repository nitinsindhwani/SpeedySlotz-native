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
const UserDentalInformationForm = ({ profilesData }) => {
  const [lastDentalVisit, setLastDentalVisit] = useState(
    profilesData?.lastDentalVisit || ""
  );
  const [dentalAllergies, setDentalAllergies] = useState(
    profilesData?.dentalAllergies || ""
  );
  const [dentalComplaints, setDentalComplaints] = useState(
    profilesData?.dentalComplaints || ""
  );
  const [dentalMedications, setDentalMedications] = useState(
    profilesData?.dentalMedications || ""
  );
  const [gumDiseaseHistory, setGumDiseaseHistory] = useState(
    profilesData?.gumDiseaseHistory || ""
  );
  const [lastDentalXray, setLastDentalXray] = useState(
    profilesData?.lastDentalXray || ""
  );
  const [orthodonticHistory, setOrthodonticHistory] = useState(
    profilesData?.orthodonticHistory || ""
  );
  const [otherDentalInfo, setOtherDentalInfo] = useState(
    profilesData?.otherDentalInfo || ""
  );
  const [toothExtractionHistory, setToothExtractionHistory] = useState(
    profilesData?.toothExtractionHistory || ""
  );

  const handleSaveDentalInformation = () => {
    console.log("Dental Information saved:", {
      lastDentalVisit,
      dentalAllergies,
      dentalComplaints,
      dentalMedications,
      gumDiseaseHistory,
      lastDentalXray,
      orthodonticHistory,
      otherDentalInfo,
      toothExtractionHistory,
    });

    let profileData = {
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
    const response = saveProfiles(profileData);
    // Implement the logic to save this information (e.g., API call)
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Last Dental Visit */}
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

        {/* Last Dental X-ray */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="x-ray" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Last Dental X-ray"
            value={lastDentalXray}
            onChangeText={setLastDentalXray}
          />
        </View>

        {/* Dental Allergies */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="allergies" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Dental Allergies"
            value={dentalAllergies}
            onChangeText={setDentalAllergies}
          />
        </View>

        {/* Dental Complaints */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="tooth" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Dental Complaints"
            value={dentalComplaints}
            onChangeText={setDentalComplaints}
          />
        </View>

        {/* Orthodontic History */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="smile-beam" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Orthodontic History"
            value={orthodonticHistory}
            onChangeText={setOrthodonticHistory}
          />
        </View>

        {/* Gum Disease History */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="sad-tear" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Gum Disease History"
            value={gumDiseaseHistory}
            onChangeText={setGumDiseaseHistory}
          />
        </View>

        {/* Tooth Extraction History */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="tooth" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Tooth Extraction History"
            value={toothExtractionHistory}
            onChangeText={setToothExtractionHistory}
          />
        </View>

        {/* Dental Medications */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="pills" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Dental Medications"
            value={dentalMedications}
            onChangeText={setDentalMedications}
          />
        </View>

        {/* Other Dental Information */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="info-circle" size={20} color={theme3.primaryColor} />
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
          style={styles.button}
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
