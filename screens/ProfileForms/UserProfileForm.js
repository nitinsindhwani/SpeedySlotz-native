import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";
import { saveProfiles } from "../../api/ApiCall";
import moment from "moment";

const UserProfileForm = ({ profilesData, onFormValidation }) => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (profilesData) {
      setProfile({
        first_name: profilesData.first_name || "",
        last_name: profilesData.last_name || "",
        email: profilesData.email || "",
        phoneNumber: profilesData.phoneNumber || "",
        gender: profilesData.gender || "",
        dateOfBirth: profilesData.dateOfBirth || "",
      });
    }
  }, [profilesData]);

  useEffect(() => {
    // Check if all fields are filled to enable form validation
    const isFormComplete =
      profile.first_name.trim() &&
      profile.last_name.trim() &&
      profile.email.trim() &&
      profile.phoneNumber.trim() &&
      profile.gender.trim() &&
      profile.dateOfBirth.trim();

    onFormValidation(isFormComplete);
  }, [
    profile.first_name,
    profile.last_name,
    profile.email,
    profile.phoneNumber,
    profile.gender,
    profile.dateOfBirth,
    onFormValidation,
  ]);

  const handleInputChange = (name, value) => {
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !profile.first_name.trim() ||
      !profile.last_name.trim() ||
      !profile.email.trim() ||
      !profile.phoneNumber.trim() ||
      !profile.gender.trim() ||
      !profile.dateOfBirth.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in all fields before submitting."
      );
      return;
    }
    const updatedFields = {};
    Object.keys(profile).forEach((key) => {
      if (profile[key] !== profilesData[key]) {
        updatedFields[key] = profile[key];
      }
    });

    if (Object.keys(updatedFields).length > 0) {
      try {
        const response = await saveProfiles({
          userProfile: { ...profilesData, ...updatedFields },
        });
        if (response.success) {
          alert("Profile information saved successfully");
        }
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="user" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.first_name}
          onChangeText={(value) => handleInputChange("first_name", value)}
          style={styles.input}
          placeholder="First Name"
        />
      </View>

      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="user" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
          style={styles.input}
          placeholder="Last Name"
        />
      </View>

      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="envelope" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.email}
          onChangeText={(value) => handleInputChange("email", value)}
          style={styles.input}
          placeholder="Email"
        />
      </View>

      <View style={styles.iconInputContainer}>
        <FontAwesome5 name="phone" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.phoneNumber}
          onChangeText={(value) => handleInputChange("phoneNumber", value)}
          style={styles.input}
          placeholder="Phone Number"
        />
      </View>

      <View style={styles.iconInputContainer}>
        <Icon name="transgender" size={20} color={theme3.primaryColor} />
        <TextInput
          value={profile.gender}
          onChangeText={(value) => handleInputChange("gender", value)}
          style={styles.input}
          placeholder="Gender"
        />
      </View>

      <View style={styles.iconInputContainer}>
        <FontAwesome5
          name="birthday-cake"
          size={20}
          color={theme3.primaryColor}
        />
        <TextInput
          value={profile.dateOfBirth}
          onChangeText={(value) => handleInputChange("dateOfBirth", value)}
          style={styles.input}
          placeholder="Date of Birth"
        />
      </View>

      <TouchableOpacity
        onPress={handleSave}
        style={[
          styles.button,
          !profile.first_name.trim() ||
          !profile.last_name.trim() ||
          !profile.email.trim() ||
          !profile.phoneNumber.trim() ||
          !profile.gender.trim() ||
          !profile.dateOfBirth.trim()
            ? styles.disabledButton
            : null,
        ]}
        disabled={
          !profile.first_name.trim() ||
          !profile.last_name.trim() ||
          !profile.email.trim() ||
          !profile.phoneNumber.trim() ||
          !profile.gender.trim() ||
          !profile.dateOfBirth.trim()
        }
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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

export default UserProfileForm;
