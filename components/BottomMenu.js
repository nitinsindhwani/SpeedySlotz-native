import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
import { translation } from "../assets/translations/translations";

const BottomMenu = ({ user }) => {
  const navigation = useNavigation();
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);

  return (
    <View style={styles.bottomMenu}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("LandingScreen", { user })}
      >
        <Icon
          name="home-outline"
          size={25}
          color={currentTheme.secondaryColor}
        />
        <Text style={styles.menuItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          navigation.navigate("App", {
            screen: "FavoritesScreen",
          })
        }
      >
        <Icon
          name="heart-outline"
          size={25}
          color={currentTheme.secondaryColor}
        />
        <Text style={styles.menuItemText}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          navigation.navigate("App", {
            screen: "ApptHistoryScreen",
          })
        }
      >
        <Icon
          name="calendar-outline"
          size={25}
          color={currentTheme.secondaryColor}
        />
        <Text style={styles.menuItemText}>Appointments</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          navigation.navigate("App", {
            screen: "NewJobScreen",
          })
        }
      >
        <Icon
          name="notifications-outline"
          size={25}
          color={currentTheme.secondaryColor}
        />
        <Text style={styles.menuItemText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          navigation.navigate("App", {
            screen: "ChatScreen",
          })
        }
      >
        <Icon
          name="notifications-outline"
          size={25}
          color={currentTheme.secondaryColor}
        />
        <Text style={styles.menuItemText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    bottomMenu: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      height: 80,
      borderTopWidth: 1,
      borderTopColor: currentTheme.primaryColor,
      backgroundColor: currentTheme.primaryColor,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    menuItem: {
      alignItems: "center",
      justifyContent: "center",
      width: "25%",
      height: "100%",
    },
    menuItemText: {
      fontSize: 12,
      color: currentTheme.secondaryColor,
      marginTop: 5,
      fontWeight: "bold",
    },
  });

export default BottomMenu;
