import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
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
// import Header from "../GlobalComponents/Header";
import Header from "../../components/Header";
import NoDataFound from "../GlobalComponents/NoDataFound";
import { format, parseISO } from "date-fns";

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

    console.log("notifications:", notifications);
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

  function Notificationlist({ item, index }) {
    const [showDetail, setShowDetail] = useState(false);
    return (
      <View style={[NotifStyle.TrickContainer, {}]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={NotifStyle.IconWrapper}>
            <Image
              source={notificationIcon}
              style={{
                width: 30,
                height: 30,
                tintColor: theme3.primaryColor,
                margin: 5,
              }}
            />
          </View>
          <View style={NotifStyle.InnerTricks}>
            <Text
              style={[
                NotifStyle.TextStyle,
                { color: theme3.fontColor, fontWeight: "bold" },
              ]}
            >
              {item.title}
            </Text>
            <Text style={NotifStyle.TextStyle}>{item.message}</Text>
            <Text style={NotifStyle.TextStyle}>
              {format(parseISO(item.created_at), "MM/dd HH:mm")}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={NotifStyle.Container}>
      {/* <Header title={"Notifications"} /> */}
      <Header user={user ? user : "--"} />

      {notifications.length < 1 ? (
        <NoDataFound />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Swipeable renderRightActions={() => renderRightAction(item.id)}>
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
