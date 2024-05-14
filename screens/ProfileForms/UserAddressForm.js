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
const UserAddressForm = ({ profilesData }) => {
  const [street, setStreet] = useState(profilesData?.street || "");
  const [city, setCity] = useState(profilesData?.city || "");
  const [state, setState] = useState(profilesData?.state || "");
  const [zip, setZip] = useState(profilesData?.zip || "");

  const handleSaveAddress = () => {
    let profileData = {
      userAddress: {
        street,
        city,
        state,
        zip,
      },
    };
    const response = saveProfiles(profileData);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="road" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Street"
            value={street}
            onChangeText={setStreet}
          />
        </View>

        {/* City */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="building" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* State */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="flag" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={state}
            onChangeText={setState}
          />
        </View>

        {/* Zipcode */}
        <View style={styles.iconInputContainer}>
          <FontAwesome5 name="map-pin" size={20} color={theme3.primaryColor} />
          <TextInput
            style={styles.input}
            placeholder="Zipcode"
            value={zip}
            onChangeText={setZip}
          />
        </View>

        <TouchableOpacity onPress={handleSaveAddress} style={styles.button}>
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

export default UserAddressForm;
