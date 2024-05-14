import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
import { translation } from "../assets/translations/translations";
import { Ionicons } from "@expo/vector-icons";
const Header = ({ user }) => {
  const navigation = useNavigation();
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);
  const getInitials = () => {
    if (!user) return ""; // Check if the user object exists
    const firstInitial = user.first_name ? user.first_name.charAt(0) : "";
    const lastInitial = user.last_name ? user.last_name.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleOptionsClick = () => {
    // Navigate to the ProfileScreen passing the user object as a parameter
    navigation.navigate("ProfileScreen", { user });
  };
  const profileUri = user?.profile_picture_url;
  return (
    <View style={styles.header}>
      {profileUri ? (
        <Image source={{ uri: profileUri }} style={styles.userImage} />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{getInitials()}</Text>
        </View>
      )}
      <View style={styles.helloContainer}>
        <Text style={styles.helloText} numberOfLines={1} ellipsizeMode="tail">
          Hello, {user?.first_name}
        </Text>
      </View>
      <View style={[styles.iconContainer, { flexDirection: "row" }]}>
        <Ionicons
          onPress={() =>
            navigation.navigate("App", {
              screen: "NotificationScreen",
              params: {
                user: user,
              },
            })
          }
          name="notifications"
          size={24}
          color="white"
          style={{ marginRight: 10 }}
        />

        <TouchableOpacity onPress={handleOptionsClick}>
          <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    header: {
      width: "100%",
      height: 100,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: currentTheme.primaryColor,
      paddingTop: 30,
    },
    helloContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    helloText: {
      fontSize: 18,
      fontWeight: "bold",
      color: currentTheme.whiteColor,
    },
    imageContainer: {
      alignItems: "flex-start",
      paddingHorizontal: 20,
    },
    userImage: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    iconContainer: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 20,
    },
    initialsContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: currentTheme.secondaryColor,
      borderRadius: 30,
      width: 40, // Same width as the userImage
      height: 40,
      marginLeft: 10,
    },
    initialsText: {
      fontSize: 18,
      fontWeight: "bold",
      color: currentTheme.whiteColor,
    },
    // ... other styles ...
  });

export default Header;
