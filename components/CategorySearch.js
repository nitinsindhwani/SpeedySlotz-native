import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const CategorySearch = ({ categoryQuery, onCategoryChange }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Enter Category"
      value={categoryQuery}
      onChangeText={onCategoryChange}
      // Additional props can be added if necessary
    />
  );
};

export default CategorySearch;
