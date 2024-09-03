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

const UserPetInsuranceForm = ({ profilesData, onFormValidation }) => {
  const [provider, setProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [coverageDetails, setCoverageDetails] = useState("");
  const [contact, setContact] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [exclusions, setExclusions] = useState("");

  useEffect(() => {
    if (profilesData) {
      setProvider(profilesData.provider || "");
      setPolicyNumber(profilesData.policyNumber || "");
      setCoverageDetails(profilesData.coverageDetails || "");
      setContact(profilesData.contact || "");
      setClaimDetails(profilesData.claimDetails || "");
      setExclusions(profilesData.exclusions || "");
    }
  }, [profilesData]);

  // Validate if all fields are filled
  useEffect(() => {
    const isFormComplete =
      provider.trim() &&
      policyNumber.trim() &&
      coverageDetails.trim() &&
      contact.trim() &&
      claimDetails.trim() &&
      exclusions.trim();

    onFormValidation(isFormComplete);
  }, [
    provider,
    policyNumber,
    coverageDetails,
    contact,
    claimDetails,
    exclusions,
    onFormValidation,
  ]);

  const handleSave = async () => {
    if (
      !provider.trim() ||
      !policyNumber.trim() ||
      !coverageDetails.trim() ||
      !contact.trim() ||
      !claimDetails.trim() ||
      !exclusions.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in all fields before submitting."
      );
      return;
    }
    const profileData = {
      userPetInsurance: {
        provider,
        policyNumber,
        coverageDetails,
        contact,
        claimDetails,
        exclusions,
      },
    };
    try {
      const response = await saveProfiles(profileData);
      if (response.success) {
        alert("Pet insurance information saved successfully");
      }
    } catch (error) {
      console.error("Failed to save pet insurance information:", error);
    }
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="clinic-medical"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Insurance Provider"
            value={provider}
            onChangeText={setProvider}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="file-invoice-dollar"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Policy Number"
            value={policyNumber}
            onChangeText={setPolicyNumber}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="book-medical"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Coverage Details"
            value={coverageDetails}
            onChangeText={setCoverageDetails}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="phone" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Insurance Contact"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="file-signature"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Claim Process Details"
            value={claimDetails}
            onChangeText={setClaimDetails}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="exclamation-triangle"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Insurance Exclusions"
            value={exclusions}
            onChangeText={setExclusions}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.button,
            !provider.trim() ||
            !policyNumber.trim() ||
            !coverageDetails.trim() ||
            !contact.trim() ||
            !claimDetails.trim() ||
            !exclusions.trim()
              ? styles.disabledButton
              : null,
          ]}
          disabled={
            !provider.trim() ||
            !policyNumber.trim() ||
            !coverageDetails.trim() ||
            !contact.trim() ||
            !claimDetails.trim() ||
            !exclusions.trim()
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

export default UserPetInsuranceForm;
