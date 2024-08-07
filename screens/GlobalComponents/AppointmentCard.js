import React, { useState, useEffect } from "react";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import getImageSource from "../CallFuncGlobal/getImageSource";
import { theme3 } from "../../assets/branding/themes";
import Styles from "../../assets/branding/GlobalStyles";
import metersToMiles from "../CallFuncGlobal/metersoMiles";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getStoredUser } from "../../api/ApiCall";
import { v4 as uuidv4 } from "uuid"; // Ensure this import is present
import { Linking } from "react-native";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Platform,
} from "react-native";
import DealIcons from "./DealIcons";
import { getBadgeDetails } from "../../components/BadgeInfo";
import ChatAnim from "./ChatAnim";

function AppointmentCard({
  businesss,
  getStatusText,
  formatDate,
  formatTime,
  handleReschedule,
  handleCancel,
  handleReview,
  handleConfirm,
  handleReject,
  singleSlot,
}) {
  const [expandDescription, setExpandDescription] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setUserData(storedUserData);
    };

    fetchUserData();
  }, []);

  const priorityLabels = ["Flexible", "Routine", "Urgent", "Emergency"];
  const priorityColor = ["#6EBD6A", "#FFD700", "#FFA500", "#FF4500"];
  const priorityIcons = [
    "calendar-outline", // Flexible
    "time-outline", // Routine
    "warning-outline", // Urgent
    "alert-outline", // Emergency
  ];

  const statusLabels = {
    cancelled: { label: "Cancelled", color: "#FF6347" },
    rescheduled: { label: "Rescheduled", color: "#FFD700" },
    noshow: { label: "No Show", color: "#FF4500" },
    completed: { label: "Completed", color: "#32CD32" },
    accepted: { label: "Accepted", color: "#4682B4" },
    booked: { label: "Booked", color: "#1E90FF" },
    open: { label: "Open", color: "#6EBD6A" },
    unknown: { label: "Unknown Status", color: "#808080" },
  };

  const getStatusMessage = (slot) => {
    if (slot.cancelled) {
      return {
        ...statusLabels.cancelled,
        label: `Cancelled: ${slot.cancellation_reason || "No reason provided"}`,
      };
    }
    if (slot.rescheduled) {
      return {
        ...statusLabels.rescheduled,
        label: `Rescheduled: ${slot.rejection_reason || "No reason provided"}`,
      };
    }
    if (slot.noshow) return statusLabels.noshow;
    if (slot.completed) return statusLabels.completed;
    if (slot.accepted) return statusLabels.accepted;
    if (slot.booked) return statusLabels.booked;
    if (slot.open) return statusLabels.open;
    return statusLabels.unknown;
  };

  const handleChatButtonPress = async (business) => {
    let user = userData;
    if (!user) {
      user = await getStoredUser();
      if (!user) {
        console.error("User data is not available.");
        return;
      }
    }

    const selectedChat = {
      chat_id: uuidv4(),
      project_name: "New Job",
      user_id: user.user_id,
      username: user.username,
      business_id: business.id,
      business_name: business.name,
      chatMessages: [],
    };

    navigation.navigate("App", {
      screen: "ChatScreen",
      params: {
        chatData: selectedChat,
      },
    });
  };

  const renderBadge = ({ item }) => {
    const badge = getBadgeDetails(item);
    if (!badge) return null;

    return (
      <View style={styles.CatList}>
        <Ionicons name={badge.icon} size={20} color={theme3.secondaryColor} />
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{badge.name}</Text>
      </View>
    );
  };

  const status = getStatusMessage(singleSlot);

  // Determine which buttons to render based on the slot status
  const renderButtons = () => {
    if (singleSlot.completed) {
      return (
        <TouchableOpacity
          onPress={() => handleReview(businesss.yelpBusiness.id)}
          style={[
            Styles.LoginBtn,
            {
              backgroundColor: theme3.primaryColor,
              padding: 10,
              width: "100%",
            },
          ]}
        >
          <Text style={Styles.LoginTxt}>Review</Text>
        </TouchableOpacity>
      );
    }
    if (singleSlot.accepted) {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => handleConfirm(businesss.yelpBusiness.id)}
            style={[
              Styles.LoginBtn,
              {
                backgroundColor: theme3.primaryColor,
                padding: 10,
                width: "50%",
                marginRight: 10,
              },
            ]}
          >
            <Text style={Styles.LoginTxt}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleReject(businesss.yelpBusiness.id)}
            style={[
              Styles.LoginBtn,
              {
                backgroundColor: theme3.danger,
                padding: 10,
                width: "50%",
              },
            ]}
          >
            <Text style={Styles.LoginTxt}>Reject</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (singleSlot.booked) {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => handleReschedule(businesss.yelpBusiness.id)}
            style={[
              Styles.LoginBtn,
              {
                backgroundColor: theme3.primaryColor,
                padding: 10,
                width: "50%",
                marginRight: 10,
              },
            ]}
          >
            <Text style={Styles.LoginTxt}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleCancel(businesss.slot, businesss.yelpBusinessSettings)
            }
            style={[
              Styles.LoginBtn,
              { backgroundColor: theme3.danger, padding: 10, width: "47%" },
            ]}
          >
            <Text style={Styles.LoginTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.mostPopularItem}>
      <Image
        source={getImageSource(
          businesss?.yelpBusiness?.name,
          businesss?.yelpBusiness?.image_url
        )}
        style={styles.mostPopularImage}
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[styles.mostPopularName, { width: "70%" }]}>
          {businesss?.yelpBusiness?.name}
        </Text>

        <View style={[Styles.OneRow, styles.statusContainer]}>
          <View style={{ marginLeft: -6 }}>
            <ChatAnim />
          </View>
          <Text
            style={[
              styles.statusText,
              { color: status.color, fontWeight: "bold" },
            ]}
          >
            {status.label}
          </Text>
        </View>
      </View>

      <Text style={styles.DescText}>
        {expandDescription
          ? singleSlot?.job_description
          : `${singleSlot?.job_description?.slice(0, 30)}...`}
        <Text
          style={{ color: theme3.primaryColor }}
          onPress={() => setExpandDescription(!expandDescription)}
        >
          {expandDescription ? " Read Less" : " Read More"}
        </Text>
      </Text>

      {businesss?.yelpBusinessCategory?.serviceTypes?.length > 0 && (
        <>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text
              style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
            >
              Categories
            </Text>
          </View>

          <FlatList
            data={businesss?.yelpBusinessCategory?.serviceTypes || []}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: serviceType, index }) => {
              return (
                <View style={styles.CatListII}>
                  <Text style={{ color: theme3.light, marginLeft: 5 }}>
                    {serviceType}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(serviceType, index) => index.toString()}
          />
        </>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.extraInfoContainer}>
          <View style={styles.dealIconContainer}>
            <MaterialIcons
              name="location-city"
              size={18}
              color={theme3.primaryColor}
            />
            <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
              {businesss?.yelpBusinessLocation?.city}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`tel:${businesss.yelpBusiness.phone}`)
            }
          >
            <View style={styles.dealIconContainer}>
              <FontAwesome
                name="phone"
                size={20}
                color={theme3.secondaryColor}
              />
              <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                {businesss.yelpBusiness.phone}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.extraInfoContainer}>
          <View style={styles.dealIconContainer}>
            <Ionicons
              name="cash-outline"
              size={16}
              color={theme3.primaryColor}
            />
            <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
              {singleSlot.amountDue
                ? `$${singleSlot.amountDue}`
                : "Final Amount Pending"}
            </Text>
          </View>

          <View style={Styles.OneRow}>
            <View style={{ marginLeft: -6 }}>
              <ChatAnim />
            </View>
            <TouchableOpacity
              onPress={() => handleChatButtonPress(businesss.yelpBusiness)}
            >
              <Text style={[styles.DescText, { marginLeft: 0 }]}>Chat Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.extraInfoContainer}>
          <TouchableOpacity
            style={styles.mapIconContainer}
            onPress={() => {
              const address1 = businesss.yelpBusinessLocation?.address1
                ? businesss.yelpBusinessLocation.address1 + ","
                : "";
              const city = businesss.yelpBusinessLocation?.city || "";
              const mapQuery = encodeURIComponent(`${address1}${city}`);
              if (mapQuery) {
                Linking.openURL(`http://maps.apple.com/?q=${mapQuery}`);
              } else {
                console.warn("No address available for directions");
              }
            }}
          >
            <MaterialIcons
              name="directions"
              size={18}
              color={theme3.primaryColor}
            />
            <Text style={[styles.mostPopularCity, { marginTop: 0 }]}>
              Directions
            </Text>
          </TouchableOpacity>

          <View style={styles.dealIconContainer}>
            <Ionicons
              name={priorityIcons[singleSlot.priorityStatus]}
              size={16}
              color={priorityColor[singleSlot.priorityStatus]}
            />
            <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
              {priorityLabels[singleSlot.priorityStatus]}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}>
        Booking Details
      </Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}>
          <Text style={{ color: theme3.light, marginLeft: 5 }}>
            {formatDate(singleSlot?.key?.date)}
          </Text>
        </View>
        <View style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}>
          <Text style={{ color: theme3.light, marginLeft: 5 }}>
            {formatTime(singleSlot?.startTime)} -{" "}
            {formatTime(singleSlot?.endTime)}
          </Text>
        </View>
        <View style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}>
          <Text style={{ color: theme3.light, marginLeft: 5 }}>
            {singleSlot.selectedServiceTypes.join(", ")}
          </Text>
        </View>
      </ScrollView>

      <View style={{ marginTop: 10 }}>{renderButtons()}</View>
    </View>
  );
}

export default AppointmentCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    marginTop: Platform.OS === "android" ? 40 : 16,
  },
  mostPopularImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
  mostPopularItem: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 1,
    elevation: 1,
  },
  DescText: {
    fontSize: 14,
    color: theme3.fontColorI,
  },
  mostPopularName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor,
  },
  CatList: {
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    paddingBottom: 5,
    paddingTop: 5,
    margin: 5,
  },
  extraInfoContainer: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dealIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mostPopularCity: {
    fontSize: 14,
    color: theme3.fontColorI,
  },
  mapIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  CatListII: {
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    paddingBottom: 5,
    paddingTop: 5,
    margin: 5,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
