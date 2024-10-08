import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { getLocationAndCityState } from "../api/ApiCall";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";

const WindowWidth = Dimensions.get("screen").width;

const HomeSearchComponent = ({
  selectedLocation,
  setSelectedLocation,
  setLocationData,
  handleLoader,
  onSearch,
}) => {
  const [searchText, setSearchText] = useState(selectedLocation);
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = "AIzaSyA0lolNAdaUEWUslsIPxKajib9p0kToU1U";

  useEffect(() => {
    setSearchText(selectedLocation);
  }, [selectedLocation]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${query}`
      );
      const data = await response.json();
      if (data.predictions) {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    fetchSuggestions(text);
  };

  const handleSearchSubmit = async () => {
    handleLoader(true);
    try {
      const { cityState, location, zipcode } = await getLocationAndCityState(
        searchText
      );
      setSelectedLocation(cityState);
      setLocationData({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zipcode: zipcode,
      });
      // Call the onSearch function to fetch data based on the new location
      if (onSearch) {
        onSearch();
      }
    } catch (error) {
      console.error("Failed to fetch location details:", error);
    } finally {
      handleLoader(false);
    }
  };

  const handleSuggestionPress = (selectedSuggestion) => {
    setSearchText(selectedSuggestion.description);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search your city"
          value={searchText}
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSearchSubmit} // Submitting on enter key press
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleSearchSubmit}
        >
          <Ionicons name="search" size={27} color={theme3.fontColor} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
            <Text style={styles.suggestionText}>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.place_id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: "#ccc", // Adding a border
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#084887",
  },
  iconContainer: {
    padding: 5,
  },
  suggestionText: {
    fontSize: 16,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    color: "#084887",
  },
});

export default HomeSearchComponent;
