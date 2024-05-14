import React, { useState } from "react";
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
const UserProfileForm = ({ profilesData }) => {
  const [profile, setProfile] = useState({
    first_name: profilesData.first_name || "",
    last_name: profilesData.last_name || "",
    email: profilesData.email || "",
    phoneNumber: profilesData.phoneNumber || "",
    gender: profilesData.gender || "",
    dateOfBirth: profilesData.dateOfBirth,
  });

  const formatDateForBackend = (date) => {
    return date ? moment(date).format("MM-dd-yyyy") : null; // Use moment.js or any other library to format
  };

  const handleInputChange = (name, value) => {
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Only send changed fields
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
        console.log("Update successful:", response);
        // Additional code to handle the response
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
        <Icon name="md-transgender" size={20} color={theme3.primaryColor} />
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

      <TouchableOpacity onPress={handleSave} style={styles.button}>
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
    borderRadius:10,
    elevation:4,
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
