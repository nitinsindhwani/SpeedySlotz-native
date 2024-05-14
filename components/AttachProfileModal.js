import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import UserProfileForm from "../screens/ProfileForms/UserProfileForm";
import UserAddressForm from "../screens/ProfileForms/UserAddressForm";
import UserPreferredPharmacyForm from "../screens/ProfileForms/UserPreferredPharmacyForm";
import UserMedicalHistoryForm from "../screens/ProfileForms/UserMedicalHistoryForm";
import UserDentalInformationForm from "../screens/ProfileForms/UserDentalInformationForm";
import UserHomeInformationForm from "../screens/ProfileForms/UserHomeInformationForm";
import UserPetInformationForm from "../screens/ProfileForms/UserPetInformationForm";
import UserPetInsuranceForm from "../screens/ProfileForms/UserPetInsuranceForm";
import UserPersonalInsuranceForm from "../screens/ProfileForms/UserPersonalInsuranceForm";
import UserDentalInsuranceForm from "../screens/ProfileForms/UserDentalInsuranceForm";
import { AntDesign } from '@expo/vector-icons';
import { fetchProfiles } from "../api/ApiCall";
import { theme3 } from "../assets/branding/themes";

const AttachProfileModal = ({ isVisible, onClose, onAttach, user }) => {
  const [selectedForm, setSelectedForm] = useState("default");
  const [userProfiles, setUserProfiles] = useState([]); // State to store fetched profiles

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const profilesData = await fetchProfiles();
        console.log("profilesData", profilesData);
        setUserProfiles(profilesData);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    if (isVisible) {
      loadProfiles();
    }
  }, [isVisible]);

  const handleAttach = () => {
    const profileLabel = profileLabels[selectedForm] || "Unknown Profile"; // Get the label
    onAttach(profileLabel); // Pass only the label instead of the whole profile object
  };

  const renderForm = () => {
    switch (selectedForm) {
      case "userProfile":
        return <UserProfileForm profilesData={userProfiles.userProfile} />;
      case "userAddress":
        return <UserAddressForm profilesData={userProfiles.userAddress} />;
      case "userPreferredPharmacy":
        return (
          <UserPreferredPharmacyForm
            profilesData={userProfiles.userPreferredPharmacy}
          />
        );
      case "userMedicalHistory":
        return (
          <UserMedicalHistoryForm
            profilesData={userProfiles.userMedicalHistory}
          />
        );
      case "userDentalInformation":
        return (
          <UserDentalInformationForm
            profilesData={userProfiles.userDentalInformation}
          />
        );
      case "userPersonalInsurance":
        return (
          <UserPersonalInsuranceForm
            profilesData={userProfiles.userPersonalInsurance}
          />
        );
      case "userDentalInsurance":
        return (
          <UserDentalInsuranceForm
            profilesData={userProfiles.userDentalInsurance}
          />
        );
      case "userHomeInformation":
        return (
          <UserHomeInformationForm
            profilesData={userProfiles.userHomeInformation}
          />
        );
      case "userPetInformation":
        return (
          <UserPetInformationForm
            profilesData={userProfiles.userPetInformation}
          />
        );
      case "userPetInsurance":
        return (
          <UserPetInsuranceForm profilesData={userProfiles.userPetInsurance} />
        );
      default:
        return (
          <Text style={styles.instructionsText}>
            Attach Profiles for Tailored Service Quotes
          </Text>
        );
    }
  };

  const profileLabels = {
    userProfile: "User Profile",
    userAddress: "User Address",
    userPreferredPharmacy: "Preferred Pharmacy",
    userMedicalHistory: "Medical History",
    userDentalInformation: "Dental Information",
    userPersonalInsurance: "Medical Insurance",
    userDentalInsurance: "Dental Insurance",
    userHomeInformation: "Home Information",
    userPetInformation: "Pet Information",
    userPetInsurance: "Pet Insurance",
  };
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.xCloseButton}>
            {/* <Text style={styles.xCloseButtonText}>X</Text> */}
            <AntDesign name="closecircle" size={24} color="red" />
          </TouchableOpacity>
          <Text style={styles.titleStyle}>Select Profiles</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedForm}
              onValueChange={(itemValue) => setSelectedForm(itemValue)}
              style={styles.pickerStyle}
              itemStyle={styles.pickerItemStyle}
            >
              <Picker.Item label="Choose profile..." value="default" />
              {Object.keys(userProfiles).map((profileKey) => (
                <Picker.Item
                  label={profileLabels[profileKey] || profileKey}
                  value={profileKey}
                  key={profileKey}
                />
              ))}
            </Picker>
          </View>
          <ScrollView style={styles.scrollView}>{renderForm()}</ScrollView>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={handleAttach}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Attach</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.actionButton, styles.skipButton]}
            >
              <Text style={styles.actionButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    width: "90%",
    height: "90%",
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
  },
  pickerContainer: {
    borderRadius: 20, // This will help to create rounded ends, adjust as needed
    backgroundColor: "#ffffff", // Filling the container with the desired color
    paddingHorizontal: 0, // Spacing to the sides to reduce overall width
    marginVertical: 5, // Spacing from top and bottom
    width: "100%", // Reducing width to less than full-screen
    alignSelf: "center",
    // Shadow styles can be adjusted or removed as per your design needs for 3D look
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerStyle: {
    width: "100%",
    height: 120, // Reduced height for the Picker
    borderRadius: 20, // Border radius for the Picker, must match the container's
    backgroundColor: "transparent", // Keeping the Picker background transparent
    color: theme3.fontColor, // Text color for the Picker items
  },
  pickerItemStyle: {
    height: 120, // Each item's height to match Picker's height
    fontSize: 20, // Font size for Picker items
    color:theme3.fontColor, // Text color for Picker items
    textAlign: "center", // Center text for Picker items
    lineHeight: 120, // Line height to vertically center text, should match height
  },
  scrollView: {
    flex: 1,
  },
  instructionsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#0052cc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  xCloseButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 10,
    zIndex: 10, // Ensure it's above other elements
  },
  xCloseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5, // Add some space between the two buttons
    backgroundColor: "#0052cc",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: theme3.primaryColor, // Attach button color
  },
  skipButton: {
    backgroundColor: "#6c757d", // Different color for skip button
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AttachProfileModal;
