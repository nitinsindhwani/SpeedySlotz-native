import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { format, fromUnixTime, parseISO } from "date-fns";
import {
  fetchNotifications,
  deleteNotifications,
  getStoredUser,
} from "../../api/ApiCall";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Swipeable from "react-native-gesture-handler/Swipeable";
import notificationIcon from "../../assets/newimage/Notification.png";
import NotifStyle from "./NotifStyle";
import { theme3 } from "../../assets/branding/themes";
import Header from "../GlobalComponents/Header";
// import Header from "../../components/Header";
import NoDataFound from "../GlobalComponents/NoDataFound";

const NotificationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [notifications, setNotifications] = useState([]);

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
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.log("Error marking notification as read:", error.message);
    }
  };
  const swipeableRef = useRef(null);

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotifications(notificationId);
      setNotifications((prevState) =>
        prevState.filter((notification) => notification.id !== notificationId)
      );
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
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

  function Notificationlist({ item, index }) {
    let formattedDate = "Date unavailable";

    try {
      let date;
      if (typeof item.created_at === "number") {
        // Assuming it's a Unix timestamp in seconds
        date = fromUnixTime(item.created_at);
      } else if (typeof item.created_at === "string") {
        // Assuming it's an ISO string
        date = parseISO(item.created_at);
      } else {
        throw new Error("Invalid date format");
      }

      formattedDate = format(date, "MM/dd HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error, "for item:", item);
    }

    return (
      <View style={styles.notificationItem}>
        <View style={styles.notificationContent}>
          <Image source={notificationIcon} style={styles.notificationIcon} />
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationDate}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={NotifStyle.Container}>
      <Header title={"Notifications"} />
      {/* <Header user={user ? user : "--"} /> */}

      {notifications.length < 1 ? (
        <NoDataFound scenario="notifications" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Swipeable
              renderRightActions={() => renderRightAction(item.id)}
              overshootRight={false}
            >
              <Notificationlist item={item} index={index} />
            </Swipeable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  notificationItem: {
    height: 100, // Fixed height for consistency
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    height: "100%",
  },
  notificationIcon: {
    width: 30,
    height: 30,
    tintColor: theme3.primaryColor,
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: "#999",
  },
  deleteBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    backgroundColor: "#FF4747",
  },
  deleteButton: {
    width: 80,
    height: "100%",
  },
});

export default NotificationScreen;
