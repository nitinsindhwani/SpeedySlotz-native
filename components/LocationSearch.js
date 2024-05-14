import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const LocationSearch = ({
  searchQuery,
  selectedLocation,
  onLocationChange,
  onLocationSelect,
}) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Enter City, State or Zipcode"
      defaultValue={selectedLocation}
      value={searchQuery}
      onChangeText={onLocationChange}
      onPress={(data, details = null) => onLocationSelect(data.description)}
      query={{
        key: "AIzaSyA0lolNAdaUEWUslsIPxKajib9p0kToU1U",
        language: "en",
      }}
      // ... other props and styles
    />
  );
};

export default LocationSearch;
