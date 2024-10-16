import React, { useState, useEffect, useContext } from "react";
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
import { LanguageContext } from "../../api/LanguageContext";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
const UserAddressForm = ({ profilesData, onFormValidation }) => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { translations } = useContext(LanguageContext);
  useEffect(() => {
    if (profilesData) {
      setStreet(profilesData.street || "");
      setCity(profilesData.city || "");
      setState(profilesData.state || "");
      setZip(profilesData.zip || "");
    }
  }, [profilesData]);

  useEffect(() => {
    // Check if all fields are filled
    const isComplete =
      street.trim() !== "" &&
      city.trim() !== "" &&
      state.trim() !== "" &&
      zip.trim() !== "";
    onFormValidation(isComplete); // Pass the form completeness status back to the parent
  }, [street, city, state, zip, onFormValidation]);

  const handleSaveAddress = async () => {
    if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      setAlertTitle(translations.incompleteForm);
      setAlertMessage(translations.fillAllFields);
      setShowAlert(true);
      return;
    }
    const profileData = {
      userAddress: {
        street,
        city,
        state,
        zip,
      },
    };
    try {
      const response = await saveProfiles(profileData);
      console.log("Response:", response);

      if (response.data && response.data.success) {
        setAlertTitle(translations.success);
        setAlertMessage(translations.profileSavedSuccessfully);
      } else {
        throw new Error(translations.failedToSaveProfile);
      }
    } catch (error) {
      console.error("Failed to save address:", error);
      setAlertTitle(translations.error);
      setAlertMessage(error.message || translations.failedToSaveProfile);
    }
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="road" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Street"
            value={street}
            onChangeText={setStreet}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="building" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="flag" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={state}
            onChangeText={setState}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="map-pin" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Zipcode"
            value={zip}
            onChangeText={setZip}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            !street.trim() || !city.trim() || !state.trim() || !zip.trim()
              ? styles.disabledButton
              : null,
          ]}
          onPress={handleSaveAddress}
          disabled={
            !street.trim() || !city.trim() || !state.trim() || !zip.trim()
          }
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      <ErrorAlert
        show={showAlert}
        onAction={handleCloseAlert}
        title={alertTitle}
        body={alertMessage}
      />
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

export default UserAddressForm;
