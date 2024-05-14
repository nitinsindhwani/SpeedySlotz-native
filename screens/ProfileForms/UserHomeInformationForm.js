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
const UserHomeInformationForm = ({ profilesData }) => {
  const [ceilingType, setCeilingType] = useState(
    profilesData?.ceilingType || ""
  );
  const [homeElevation, setHomeElevation] = useState(
    profilesData?.homeElevation || ""
  );
  const [homeExterior, setHomeExterior] = useState(
    profilesData?.homeExterior || ""
  );
  const [homeSize, setHomeSize] = useState(profilesData?.homeSize || "");
  const [homeType, setHomeType] = useState(profilesData?.homeType || "");
  const [lastHvacServiceDate, setLastHvacServiceDate] = useState(
    profilesData?.lastHvacServiceDate || ""
  );
  const [lastWindowCleaningDate, setLastWindowCleaningDate] = useState(
    profilesData?.lastWindowCleaningDate || ""
  );
  const [lightingPreferences, setLightingPreferences] = useState(
    profilesData?.lightingPreferences || ""
  );
  const [mowingFrequency, setMowingFrequency] = useState(
    profilesData?.mowingFrequency || ""
  );
  const [numberOfFloors, setNumberOfFloors] = useState(
    profilesData?.numberOfFloors || ""
  );
  const [numberOfRooms, setNumberOfRooms] = useState(
    profilesData?.numberOfRooms || ""
  );
  const [treeCount, setTreeCount] = useState(profilesData?.treeCount || "");

  const handleSave = () => {
    let profileData = {
      userHomeInformation: {
        ceilingType,
        homeElevation,
        homeExterior,
        homeSize,
        homeType,
        lastHvacServiceDate,
        lastWindowCleaningDate,
        lightingPreferences,
        mowingFrequency,
        numberOfFloors,
        numberOfRooms,
        treeCount,
      },
    };
    const response = saveProfiles(profileData);
    // Add logic to save this information
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Home Type */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="home" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Home Type"
            value={homeType}
            onChangeText={setHomeType}
          />
        </View>

        {/* Home Exterior */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="layer-group" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Home Exterior"
            value={homeExterior}
            onChangeText={setHomeExterior}
          />
        </View>

        {/* Home Elevation */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="building" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Home Elevation"
            value={homeElevation}
            onChangeText={setHomeElevation}
          />
        </View>

        {/* Ceiling Type */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="arrow-up" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Ceiling Type"
            value={ceilingType}
            onChangeText={setCeilingType}
          />
        </View>

        {/* Home Size */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="ruler" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Home Size"
            value={homeSize}
            onChangeText={setHomeSize}
          />
        </View>

        {/* Number of Rooms */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="door-open" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Number of Rooms"
            value={numberOfRooms}
            onChangeText={setNumberOfRooms}
          />
        </View>

        {/* Number of Floors */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="layer-group" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Number of Floors"
            value={numberOfFloors}
            onChangeText={setNumberOfFloors}
          />
        </View>

        {/* Last HVAC Service Date */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="fan" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Last HVAC Service Date"
            value={lastHvacServiceDate}
            onChangeText={setLastHvacServiceDate}
          />
        </View>

        {/* Frequency of Mowing Needed */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="leaf" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Mowing Frequency"
            value={mowingFrequency}
            onChangeText={setMowingFrequency}
          />
        </View>

        {/* Last Window Cleaning Date */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="window-maximize"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Window Cleaning Date"
            value={lastWindowCleaningDate}
            onChangeText={setLastWindowCleaningDate}
          />
        </View>

        {/* Tree Count */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="tree" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Tree Count"
            value={treeCount}
            onChangeText={setTreeCount}
          />
        </View>

        {/* Lighting Preferences */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="lightbulb" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Lighting Preferences"
            value={lightingPreferences}
            onChangeText={setLightingPreferences}
            multiline
            numberOfLines={4}
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

export default UserHomeInformationForm;
