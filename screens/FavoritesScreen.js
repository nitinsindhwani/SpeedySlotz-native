import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import FavoriteBusinesList from "../components/FavoriteBusinesList";
import { fetchFavorites } from "../api/ApiCall";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { LanguageContext } from "../api/LanguageContext";


const FavoritesScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = route.params;
  const { translations } = useContext(LanguageContext);

  const [fetchedBusinesses, setFetchedBusinesses] = useState([]);

  useEffect(() => {
    if (isFocused) {
      fetchFavorites()
        .then((businesses) => {
          setFetchedBusinesses(businesses);
        })
        .catch((error) => {
          console.log(
            `${translations.errorFetchingBusinesses} ${error.message}`
          );
        });
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: translations.favorites,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
        color: "purple",
      },
      headerStyle: {
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Header user={user} />
      <FavoriteBusinesList
        fetchedBusinesses={fetchedBusinesses}
        navigation={navigation}
      />
    </View>
  );
};

export default FavoritesScreen;
