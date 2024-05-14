import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { fetchNotifications, deleteNotifications } from "../api/ApiCall";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Swipeable from "react-native-gesture-handler/Swipeable";

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);

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
      headerTitle: "Notifications",
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

  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .catch((error) => {
        console.log("Error fetching notifications:", error.message);
      });
  }, []);

  const handleNotificationClick = async (notificationId) => {
    try {
      // await markAsRead(notificationId); // Backend call to mark as read
      setNotifications((prevState) =>
        prevState.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: 1 }
            : notification
        )
      );
    } catch (error) {
      console.log("Error marking notification as read:", error.message);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotifications(notificationId);
      setNotifications((prevState) =>
        prevState.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.log("Error deleting notification:", error.message);
    }
  };

  const renderRightAction = (notificationId) => (
    <TouchableOpacity
      onPress={() => handleDelete(notificationId)}
      style={styles.deleteButton}
    >
      <LinearGradient
        colors={["#ff7f7f", "#ff4747"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.deleteBackground}
      >
        <Ionicons name="trash-outline" size={24} color="#FFF" />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightAction(item.id)}>
            <TouchableOpacity
              style={styles.notificationContainer}
              onPress={() => handleNotificationClick(item.id)}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.notificationTitle,
                  { opacity: item.read ? 0.5 : 1 },
                ]}
              >
                {item.message}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFF",
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    padding: 20,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFA500",
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0000FF",
    flex: 3,
  },
  deleteBackground: {
    width: 100,
    height: 85, // Add this line
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  deleteButton: {
    justifyContent: "center",
    width: 100,
    height: 85, // Add this line
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: 10,
  },
});

export default NotificationScreen;
