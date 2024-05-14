import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { theme3 } from "../../assets/branding/themes";
import { saveProfiles } from "../../api/ApiCall";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
const UserPreferredPharmacyForm = ({ profilesData }) => {
  const [pharmacyName, setPharmacyName] = useState(
    profilesData?.pharmacyName || ""
  );
  const [pharmacyAddress, setPharmacyAddress] = useState(
    profilesData?.pharmacyAddress || ""
  );
  const [pharmacyPhone, setPharmacyPhone] = useState(
    profilesData?.pharmacyPhone || ""
  );

  const handleSavePreferredPharmacy = () => {
    console.log("Preferred Pharmacy Information saved:", {
      pharmacyName,
      pharmacyAddress,
      pharmacyPhone,
    });
    let profileData = {
      userPreferredPharmacy: {
        pharmacyName,
        pharmacyAddress,
        pharmacyPhone,
      },
    };
    const response = saveProfiles(profileData);
    // Add logic to pass data to the backend or parent component
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
        <FontAwesome5 name="home" size={20} color={theme3.primaryColor} />
        <TextInput
          style={styles.input}
          placeholder="Pharmacy Contact Number"
          value={pharmacyPhone}
          onChangeText={setPharmacyPhone}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSavePreferredPharmacy}
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
