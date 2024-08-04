import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from "../assets/Animated/success.json";
import Styles from "../assets/branding/GlobalStyles";
import { theme3 } from "../assets/branding/themes";
import moment from "moment";

const ApptConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, businessDetails, slot, service_type } = route.params;
  const animation = useRef();

  function formatDate(dateString) {
    return moment(dateString).format("LL"); // e.g., "September 4, 1986"
  }

  function formatTime(timeString) {
    if (!timeString) {
      return "";
    }

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString(undefined, options);
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={25}
          color="black"
          style={{ marginLeft: 15 }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: "Confirmation",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#000",
      },
      headerStyle: {
        backgroundColor: "#FFF",
      },
    });
  }, [navigation]);

  const priorityStatusMap = {
    0: "Routine",
    1: "Flexible",
    2: "Urgent",
    3: "Emergency",
  };
  const getPriorityStatusText = (priorityStatus) => {
    return priorityStatusMap[priorityStatus] || "Unknown";
  };
  const getImageSource = (businessName, image_url) => {
    if (image_url && typeof image_url === "object") {
      if (image_url.Main) {
        return { uri: image_url.Main };
      } else {
        const firstImageKey = Object.keys(image_url)[0];
        const firstImageUri = image_url[firstImageKey];
        return { uri: firstImageUri };
      }
    } else if (typeof image_url === "string" && image_url.trim() !== "") {
      return { uri: image_url };
    }
    return defaultImageUrl;
  };

  const handleAddToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access calendar was denied");
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      if (!calendars.length) {
        alert("No calendars found on this device.");
        return;
      }

      const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const eventDetails = {
        title: "My Event Title",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
        timeZone: deviceTimeZone,
        location: "Event Location",
        notes: "Details about the event",
      };

      const { id: calendarId } = calendars[0];

      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      if (eventId) {
        alert("Event added to calendar successfully!");
      } else {
        alert("Error while adding event to calendar.");
      }
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      alert("An error occurred. Please try again.");
    } finally {
      navigation.navigate("BottomNavigation");
    }
  };

  const openDirections = () => {
    Linking.openURL(
      `http://maps.apple.com/?q=${businessDetails?.yelpBusinessLocation.address1},${businessDetails?.yelpBusinessLocation.city},${businessDetails?.yelpBusinessLocation.zip_code}`
    );
  };

  const handleNavigateHome = () => {
    navigation.navigate("BottomNavigation", { user: userData });
  };

  return (
    // <ScrollView style={styles.container}>
      <View style={styles.itemContainer}>
        <AnimatedLottieView
          autoPlay
          loop={true}
          ref={animation}
          style={styles.lottieAnimation}
          source={loaderAnimation}
        />
        {businessDetails && (
          <>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: theme3.primaryColor,
                padding: 10,
                borderRadius: 20,
                width:"100%"
              }}
            >
              <Image
                source={getImageSource(
                  businessDetails.yelpBusiness.name,
                  businessDetails.yelpBusiness.image_url
                )}
                style={styles.image}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>
                  {businessDetails.yelpBusiness.name}
                </Text>
                <Text style={styles.location}>
                  {businessDetails.yelpBusinessLocation.address1}
                  {businessDetails.yelpBusinessLocation.address2
                    ? `, ${businessDetails.yelpBusinessLocation.address2}`
                    : ""}
                  {businessDetails.yelpBusinessLocation.address3
                    ? `, ${businessDetails.yelpBusinessLocation.address3}`
                    : ""}
                  {`, ${businessDetails.yelpBusinessLocation.city}, ${businessDetails.yelpBusinessLocation.state} ${businessDetails.yelpBusinessLocation.zipCode}, ${businessDetails.yelpBusinessLocation.country}`}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `tel:${businessDetails.yelpBusiness.display_phone.replace(
                        /\D/g,
                        ""
                      )}`
                    )
                  }
                >
                  <Text style={styles.phone}>
                    {businessDetails.yelpBusiness.display_phone}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <View style={styles.cardDesign}>
          <Text style={styles.timeSlot}>
            <Text style={{ fontWeight: "bold" }}>Selected Time: </Text>
            {formatDate(slot.date)}
          </Text>
          <Text style={styles.timeSlot}>
            <Text style={{ fontWeight: "bold" }}>Selected Time: </Text>
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </Text>
          <Text style={styles.serviceType}>
            <Text style={{ fontWeight: "bold" }}>Service Type: </Text>
            {service_type}
          </Text>
        </View>
        <View style={styles.cardDesign}>
          <Text style={styles.serviceType}>
            <Text style={{ fontWeight: "bold" }}>Job Description: </Text>
            {slot.job_description}
          </Text>
          <Text style={styles.serviceType}>
            <Text style={{ fontWeight: "bold" }}>
              Need service in zipcodes:{" "}
            </Text>
            {slot.zipcodes && Array.isArray(slot.zipcodes)
              ? slot.zipcodes.join(", ")
              : "N/A"}
          </Text>
          <Text style={styles.serviceType}>
            <Text style={{ fontWeight: "bold" }}>Priority Status: </Text>
            {getPriorityStatusText(slot.priorityStatus)}
          </Text>
        </View>

        {slot.open && !slot.booked && !slot.confirmed && (
          <Text style={{ color: "#FFA500", fontWeight: "bold", marginTop: 10 }}>
            Awaiting Provider Action
          </Text>
        )}
        {slot.booked && !slot.confirmed && (
          <Text style={{ color: "#FFA500", fontWeight: "bold", marginTop: 10 }}>
            Awaiting Provider Confirmation
          </Text>
        )}
        {slot.booked && slot.confirmed && (
          <Text style={{ color: "#00AA00", fontWeight: "bold", marginTop: 10 }}>
            Appointment Confirmed
          </Text>
        )}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={handleAddToCalendar}
        >
          <Text style={styles.calendarButtonText}>Add to Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // style={styles.homeButton}
          onPress={handleNavigateHome}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 10,
  },
  itemContainer: {
    marginBottom: 0,
    width:"100%",
    height:"100%",
    padding: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: theme3.Dark,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  image: {
    width: "40%",
    height: 100,
    borderRadius: 10,
    backgroundColor: theme3.primaryColor,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.light,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: "95%",
  },
  location: {
    fontSize: 14,
    color: theme3.light,
    width: "40%",
  },
  phone: {
    fontSize: 14,
    color: theme3.light,
    marginBottom: 10,
  },
  cardDesign: {
    backgroundColor: "rgba(240,240,240,1)",
    marginTop: 10,
    padding: 10,
    width:'100%',
    borderRadius: 10,
    elevation: 4,
    shadowColor: theme3.Dark,
  },
  timeSlot: {
    fontSize: 14,
    color: theme3.fontColor,
    marginBottom: 10,
  },
  serviceType: {
    fontSize: 14,
    color: theme3.fontColor,
    marginBottom: 10,
  },
  calendarButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 10,
    padding:30,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  calendarButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: theme3.primaryColor,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  homeButtonText: {
    color: theme3.secondaryColor,
    textDecorationLine:'underline',
    marginTop:10,
    fontSize: 16,
    fontWeight: "bold",
  
  },
  lottieAnimation: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: "#FFF",
  },
});

export default ApptConfirmationScreen;
