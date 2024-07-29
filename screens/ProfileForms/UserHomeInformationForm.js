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

const UserHomeInformationForm = ({ profilesData }) => {
  const [ceilingType, setCeilingType] = useState("");
  const [homeElevation, setHomeElevation] = useState("");
  const [homeExterior, setHomeExterior] = useState("");
  const [homeSize, setHomeSize] = useState("");
  const [homeType, setHomeType] = useState("");
  const [lastHvacServiceDate, setLastHvacServiceDate] = useState("");
  const [lastWindowCleaningDate, setLastWindowCleaningDate] = useState("");
  const [lightingPreferences, setLightingPreferences] = useState("");
  const [mowingFrequency, setMowingFrequency] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("");
  const [treeCount, setTreeCount] = useState("");

  useEffect(() => {
    if (profilesData) {
      setCeilingType(profilesData.ceilingType || "");
      setHomeElevation(profilesData.homeElevation || "");
      setHomeExterior(profilesData.homeExterior || "");
      setHomeSize(profilesData.homeSize || "");
      setHomeType(profilesData.homeType || "");
      setLastHvacServiceDate(profilesData.lastHvacServiceDate || "");
      setLastWindowCleaningDate(profilesData.lastWindowCleaningDate || "");
      setLightingPreferences(profilesData.lightingPreferences || "");
      setMowingFrequency(profilesData.mowingFrequency || "");
      setNumberOfFloors(profilesData.numberOfFloors || "");
      setNumberOfRooms(profilesData.numberOfRooms || "");
      setTreeCount(profilesData.treeCount || "");
    }
  }, [profilesData]);

  const handleSave = async () => {
    const profileData = {
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
    try {
      const response = await saveProfiles(profileData);
      if (response.success) {
        alert("Home information saved successfully");
      }
    } catch (error) {
      console.error("Failed to save home information:", error);
    }
  };

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="home" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Home Type"
            value={homeType}
            onChangeText={setHomeType}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="layer-group"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Home Exterior"
            value={homeExterior}
            onChangeText={setHomeExterior}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="building" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Home Elevation"
            value={homeElevation}
            onChangeText={setHomeElevation}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="arrow-up" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Ceiling Type"
            value={ceilingType}
            onChangeText={setCeilingType}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="ruler" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Home Size"
            value={homeSize}
            onChangeText={setHomeSize}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="door-open"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Rooms"
            value={numberOfRooms}
            onChangeText={setNumberOfRooms}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="layer-group"
            size={20}
            color={theme3.primaryColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Floors"
            value={numberOfFloors}
            onChangeText={setNumberOfFloors}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="fan" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Last HVAC Service Date"
            value={lastHvacServiceDate}
            onChangeText={setLastHvacServiceDate}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="leaf" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Mowing Frequency"
            value={mowingFrequency}
            onChangeText={setMowingFrequency}
          />
        </View>

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

        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="tree" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Tree Count"
            value={treeCount}
            onChangeText={setTreeCount}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <FontAwesome5
            name="lightbulb"
            size={20}
            color={theme3.primaryColor}
          />
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
