import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
import { translation } from "../assets/translations/translations";

const LocationSearch = ({
  selectedLocation,
  onLocationChange,
  onLocationSelect,
}) => {
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);

  return (
    <GooglePlacesAutocomplete
      placeholder="Enter City, State or Zipcode"
      defaultValue={selectedLocation}
      onPress={(data, details = null) => onLocationSelect(data.description)}
      query={{
        key: "AIzaSyA0lolNAdaUEWUslsIPxKajib9p0kToU1U",
        language: "en",
      }}
      // ... other props and styles
    />
  );
};

const CurrentLocationBar = ({
  selectedLocation,
  onLocationChange,
  onLocationSelect,
}) => {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=AIzaSyA0lolNAdaUEWUslsIPxKajib9p0kToU1U`
      );

      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        let cityState = "";

        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            cityState += component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            cityState += `, ${component.long_name}`;
          }
        }

        onLocationSelect(cityState);
      }
    })();
  }, []);

  return (
    <View style={styles.locationBar}>
      <View style={styles.autocompleteContainer}>
        <LocationSearch
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
          onLocationSelect={onLocationSelect}
        />
      </View>
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    locationBar: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: "#FFF",
      borderRadius: 10,
      marginBottom: 16,
      elevation: 2, // For Android shadow
      shadowColor: "#000", // For iOS shadow
      shadowOffset: { width: 0, height: 2 }, // For iOS shadow
      shadowOpacity: 0.2, // For iOS shadow
    },
    locationText: {
      fontSize: 14,
      color: currentTheme.PrimaryColor,
      marginTop: 8,
    },
    autocompleteContainer: {
      width: "100%",
      marginBottom: 8,
    },
    inputFieldContainer: {
      height: 38, // Set fixed height for the input field container
    },
    hintsContainer: {
      backgroundColor: "#f5f5f5",
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginTop: 4,
    },
    hintText: {
      fontSize: 14,
      color: currentTheme.PrimaryColor,
      paddingVertical: 2,
    },
    // Styles specific to the GooglePlacesAutocomplete component
    autocompleteContainerStyle: {
      flex: 1,
    },
    textInputContainer: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 38,
      color: currentTheme.PrimaryColor,
      fontSize: 16,
    },
    predefinedPlacesDescription: {
      color: "#1faadb",
    },
  });

export default CurrentLocationBar;
