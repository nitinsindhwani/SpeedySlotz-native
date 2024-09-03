import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { theme3 } from "../../assets/branding/themes";
import { saveProfiles } from "../../api/ApiCall";
import { FontAwesome5 } from "@expo/vector-icons";

const UserPreferredPharmacyForm = ({ profilesData, onFormValidation }) => {
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [pharmacyPhone, setPharmacyPhone] = useState("");

  useEffect(() => {
    if (profilesData) {
      setPharmacyName(profilesData.pharmacyName || "");
      setPharmacyAddress(profilesData.pharmacyAddress || "");
      setPharmacyPhone(profilesData.pharmacyPhone || "");
    }
  }, [profilesData]);

  // Validate if all fields are filled
  useEffect(() => {
    const isFormComplete =
      pharmacyName.trim() && pharmacyAddress.trim() && pharmacyPhone.trim();

    onFormValidation(isFormComplete);
  }, [pharmacyName, pharmacyAddress, pharmacyPhone, onFormValidation]);

  const handleSavePreferredPharmacy = async () => {
    if (
      !pharmacyName.trim() ||
      !pharmacyAddress.trim() ||
      !pharmacyPhone.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in all fields before submitting."
      );
      return;
    }
    const profileData = {
      userPreferredPharmacy: {
        pharmacyName,
        pharmacyAddress,
        pharmacyPhone,
      },
    };
    try {
      const response = await saveProfiles(profileData);
      if (response.success) {
        alert("Preferred pharmacy information saved successfully");
      }
    } catch (error) {
      console.error("Failed to save preferred pharmacy information:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconInputContainer}>
        <FontAwesome5
          name="plus-square"
          size={20}
          color={theme3.primaryColor}
        />
        <TextInput
          style={styles.input}
          placeholder="Pharmacy Name"
          value={pharmacyName}
          onChangeText={setPharmacyName}
        />
      </View>
      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="home" size={20} color={theme3.primaryColor} />
        <TextInput
          style={styles.input}
          placeholder="Pharmacy Address"
          value={pharmacyAddress}
          onChangeText={setPharmacyAddress}
        />
      </View>
      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="phone" size={20} color={theme3.primaryColor} />
        <TextInput
          style={styles.input}
          placeholder="Pharmacy Contact Number"
          value={pharmacyPhone}
          onChangeText={setPharmacyPhone}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          !pharmacyName.trim() ||
          !pharmacyAddress.trim() ||
          !pharmacyPhone.trim()
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleSavePreferredPharmacy}
        disabled={
          !pharmacyName.trim() ||
          !pharmacyAddress.trim() ||
          !pharmacyPhone.trim()
        }
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
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

export default UserPreferredPharmacyForm;
