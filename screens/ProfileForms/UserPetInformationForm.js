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

const UserPetInformationForm = ({ profilesData }) => {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petAllergies, setPetAllergies] = useState("");
  const [petBehavior, setPetBehavior] = useState("");
  const [petFavorites, setPetFavorites] = useState("");
  const [petMicrochipped, setPetMicrochipped] = useState("");
  const [petSpecialNeeds, setPetSpecialNeeds] = useState("");
  const [vetDetails, setVetDetails] = useState("");

  useEffect(() => {
    if (profilesData) {
      setPetName(profilesData.petName || "");
      setPetType(profilesData.petType || "");
      setPetBreed(profilesData.petBreed || "");
      setPetAge(profilesData.petAge || "");
      setPetWeight(profilesData.petWeight || "");
      setPetAllergies(profilesData.petAllergies || "");
      setPetBehavior(profilesData.petBehavior || "");
      setPetFavorites(profilesData.petFavorites || "");
      setPetMicrochipped(profilesData.petMicrochipped || "");
      setPetSpecialNeeds(profilesData.petSpecialNeeds || "");
      setVetDetails(profilesData.vetDetails || "");
    }
  }, [profilesData]);

  const handleSave = async () => {
    const profileData = {
      userPetInformation: {
        petName,
        petType,
        petBreed,
        petAge,
        petWeight,
        petSpecialNeeds,
        vetDetails,
        petAllergies,
        petBehavior,
        petFavorites,
        petMicrochipped,
      },
    };
    try {
      const response = await saveProfiles(profileData);
      if (response.success) {
        alert("Pet information saved successfully");
      }
    } catch (error) {
      console.error("Failed to save pet information:", error);
    }
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="dog" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Name"
            value={petName}
            onChangeText={setPetName}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="paw" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Type (e.g., Dog, Cat)"
            value={petType}
            onChangeText={setPetType}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="dna" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={petBreed}
            onChangeText={setPetBreed}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="birthday-cake"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={petAge}
            onChangeText={setPetAge}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="weight" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={petWeight}
            onChangeText={setPetWeight}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="first-aid"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Special Needs"
            value={petSpecialNeeds}
            onChangeText={setPetSpecialNeeds}
            multiline
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="stethoscope"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Veterinarian Details"
            value={vetDetails}
            onChangeText={setVetDetails}
            multiline
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="allergies"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Pet Allergies"
            value={petAllergies}
            onChangeText={setPetAllergies}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="user-alt" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Behavior"
            value={petBehavior}
            onChangeText={setPetBehavior}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="bone" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Favorites"
            value={petFavorites}
            onChangeText={setPetFavorites}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="microchip"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Pet Microchipped (Yes/No)"
            value={petMicrochipped}
            onChangeText={setPetMicrochipped}
          />
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.button}>
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

export default UserPetInformationForm;
