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
const UserPetInformationForm = ({ profilesData }) => {
  const [petName, setPetName] = useState(profilesData?.petName || "");
  const [petType, setPetType] = useState(profilesData?.petType || "");
  const [petBreed, setPetBreed] = useState(profilesData?.petBreed || "");
  const [petAge, setPetAge] = useState(profilesData?.petAge || "");
  const [petWeight, setPetWeight] = useState(profilesData?.petWeight || "");
  const [petAllergies, setPetAllergies] = useState(
    profilesData?.petAllergies || ""
  );
  const [petBehavior, setPetBehavior] = useState(
    profilesData?.petBehavior || ""
  );
  const [petFavorites, setPetFavorites] = useState(
    profilesData?.petFavorites || ""
  );
  const [petMicrochipped, setPetMicrochipped] = useState(
    profilesData?.petMicrochipped || ""
  );
  const [petSpecialNeeds, setPetSpecialNeeds] = useState(
    profilesData?.petSpecialNeeds || ""
  );
  const [vetDetails, setVetDetails] = useState(profilesData?.vetDetails || "");

  const handleSave = () => {
    let profileData = {
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
    const response = saveProfiles(profileData);
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Pet Name */}
        {/* Pet Name */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="dog" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Name"
            value={petName}
            onChangeText={setPetName}
          />
        </View>

        {/* Pet Type */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="paw" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Type (e.g., Dog, Cat)"
            value={petType}
            onChangeText={setPetType}
          />
        </View>

        {/* Pet Breed */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="dna" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={petBreed}
            onChangeText={setPetBreed}
          />
        </View>

        {/* Pet Age */}
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

        {/* Pet Weight */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="weight" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={petWeight}
            onChangeText={setPetWeight}
          />
        </View>

        {/* Special Needs */}
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

        {/* Veterinarian Details */}
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

        {/* Pet Allergies */}
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

        {/* Pet Behavior */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="user-alt" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Behavior"
            value={petBehavior}
            onChangeText={setPetBehavior}
          />
        </View>

        {/* Pet Favorites */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="bone" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Pet Favorites"
            value={petFavorites}
            onChangeText={setPetFavorites}
          />
        </View>

        {/* Pet Microchipped */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="microchip"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Pet Microchipped (Yes/No)"
            value={petMicrochipped.toString()}
            onChangeText={setPetMicrochipped}
          />
        </View>

        {/* Save Button */}
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
