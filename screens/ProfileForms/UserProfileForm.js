import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";
import { saveProfiles } from "../../api/ApiCall";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LanguageContext } from "../../api/LanguageContext";
import ErrorAlert from "../GlobalComponents/ErrorAlert";

const UserProfileForm = ({ profilesData, onFormValidation }) => {
  const { translations } = useContext(LanguageContext);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (profilesData) {
      setProfile({
        first_name: profilesData.first_name || "",
        last_name: profilesData.last_name || "",
        email: profilesData.email || "",
        phoneNumber: profilesData.phoneNumber || "",
        gender: profilesData.gender || "",
        dateOfBirth: profilesData.dateOfBirth
          ? new Date(profilesData.dateOfBirth)
          : new Date(),
      });
    }
  }, [profilesData]);

  useEffect(() => {
    const isFormComplete =
      profile.first_name.trim() &&
      profile.last_name.trim() &&
      profile.email.trim() &&
      profile.phoneNumber.trim() &&
      profile.gender.trim() &&
      profile.dateOfBirth;

    onFormValidation(isFormComplete);
  }, [profile, onFormValidation]);

  const handleInputChange = (name, value) => {
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || profile.dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setProfile((prevState) => ({
      ...prevState,
      dateOfBirth: currentDate,
    }));
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSave = async () => {
    if (
      !profile.first_name.trim() ||
      !profile.last_name.trim() ||
      !profile.email.trim() ||
      !profile.phoneNumber.trim() ||
      !profile.gender.trim() ||
      !profile.dateOfBirth
    ) {
      setAlertTitle(translations.incompleteForm);
      setAlertMessage(translations.fillAllFields);
      setShowAlert(true);
      return;
    }

    try {
      const formattedProfile = {
        ...profilesData,
        ...profile,
        dateOfBirth: moment(profile.dateOfBirth).format("YYYY-MM-DD"),
        email_verified: profilesData.email_verified || false,
        phone_verified: profilesData.phone_verified || false,
        active: profilesData.active || true,
        quick_login: profilesData.quick_login || false,
        profile_completed: profilesData.profile_completed || false,
        admin_status: profilesData.admin_status || 0,
      };

      Object.keys(formattedProfile).forEach(
        (key) => formattedProfile[key] === null && delete formattedProfile[key]
      );

      console.log(
        "Sending profile data:",
        JSON.stringify({ userProfile: formattedProfile }, null, 2)
      );

      const response = await saveProfiles({ userProfile: formattedProfile });

      if (response.data && response.data.success) {
        setAlertTitle(translations.success);
        setAlertMessage(translations.profileSavedSuccessfully);
      } else {
        throw new Error(
          response.data.message || translations.failedToSaveProfile
        );
      }
    } catch (error) {
      console.error("Update failed:", error);
      setAlertTitle(translations.error);
      setAlertMessage(error.message || translations.updateFailed);
    }
    setShowAlert(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="user" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.first_name}
          onChangeText={(value) => handleInputChange("first_name", value)}
          style={styles.input}
          placeholder={translations.firstName}
        />
      </View>

      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="user" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
          style={styles.input}
          placeholder={translations.lastName}
        />
      </View>

      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="envelope" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.email}
          onChangeText={(value) => handleInputChange("email", value)}
          style={styles.input}
          placeholder={translations.email}
        />
      </View>

      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="phone" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.phoneNumber}
          onChangeText={(value) => handleInputChange("phoneNumber", value)}
          style={styles.input}
          placeholder={translations.phoneNumber}
        />
      </View>

      <View style={styles.iconInputContainer}>
        <Icon name="transgender" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.gender}
          onChangeText={(value) => handleInputChange("gender", value)}
          style={styles.input}
          placeholder={translations.gender}
        />
      </View>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.iconInputContainer}
      >
        <FontAwesome5
          name="birthday-cake"
          size={20}
          color={theme3.primaryColor}
        />
        <Text style={styles.input}>
          {moment(profile.dateOfBirth).format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={profile.dateOfBirth}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>{translations.submit}</Text>
      </TouchableOpacity>

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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4,
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

export default UserProfileForm;
