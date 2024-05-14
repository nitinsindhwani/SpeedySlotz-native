import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import FavoriteBusinesList from "../components/FavoriteBusinesList";
import { fetchFavorites } from "../api/ApiCall";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// import Header from "./GlobalComponents/Header";
import Header from "../components/Header";

const FavoritesScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = route.params;

  const [fetchedBusinesses, setFetchedBusinesses] = useState([]);

  useEffect(() => {
    if (isFocused) {
      fetchFavorites()
        .then((businesses) => {
          setFetchedBusinesses(businesses);
        })
        .catch((error) => {
          console.log("Error fetching businesses:", error.message);
        });
    }
  }, [isFocused]);

  // Add this to your component to set up the navigation header
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ marginLeft: 10 }} // Adjust the margin as needed
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: "Favorites",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
        color: "purple", // You can adjust color and other CSS properties as needed
      },
      headerStyle: {
        backgroundColor: "white", // Adjust background color or other CSS properties
      },
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      {/* <Header title={"Favorite"}/> */}
      <Header user={user} />

      <FavoriteBusinesList
        fetchedBusinesses={fetchedBusinesses}
        navigation={navigation}
      />
    </View>
  );
};

export default FavoritesScreen;
