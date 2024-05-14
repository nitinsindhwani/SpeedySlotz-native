import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { fetchBookings } from "../api/ApiCall";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import PastBusinesList from "./PastBusinesList";

const PastScreen = () => {
  const navigation = useNavigation();
  const [fetchedBusinesses, setFetchedBusinesses] = useState([]);

  useEffect(() => {
    fetchBookings("OLD")
      .then((businesses) => {
        setFetchedBusinesses(businesses);
      })
      .catch((error) => {
        console.log("Error fetching businesses:", error.message);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <PastBusinesList
        fetchedBusinesses={fetchedBusinesses}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  businessContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  businessTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
  },
});

export default PastScreen;
