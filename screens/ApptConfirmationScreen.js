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
// import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from "../assets/Animated/success.json";
import Styles from "../assets/branding/GlobalStyles";
import { theme3 } from "../assets/branding/themes";
import moment from "moment";

const ApptConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { businessDetails, slot, service_type } = route.params;
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
      headerTitle: " Confirmation",
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
    // Check if image_url is an object
    if (image_url && typeof image_url === "object") {
      // Prioritize "Main" image if available
      if (image_url.Main) {
        return { uri: image_url.Main };
      } else {
        // Fallback to any first image available in the object
        const firstImageKey = Object.keys(image_url)[0];
        const firstImageUri = image_url[firstImageKey];
        return { uri: firstImageUri };
      }
    }
    // Check if image_url is a valid string
    else if (typeof image_url === "string" && image_url.trim() !== "") {
      return { uri: image_url };
    }
    // Default image if none of the above conditions are met
    return defaultImageUrl;
  };

  const handleAddToCalendar = async () => {
    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access calendar was denied");
        return;
      }

      // Fetch available calendars
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      if (!calendars.length) {
        alert("No calendars found on this device.");
        return;
      }

      // Using the device's local time zone
      const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Prepare the event details
      const eventDetails = {
        title: "My Event Title",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // For instance, adding 1 hour to the current time
        timeZone: deviceTimeZone,
        location: "Event Location",
        notes: "Details about the event",
      };

      // For simplicity, we're using the first available calendar
      const { id: calendarId } = calendars[0];

      // Add the event to the calendar
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      if (eventId) {
        alert("Event added to calendar successfully!");
      } else {
        alert("Error while adding event to calendar.");
      }
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const openDirections = () => {
    Linking.openURL(
      `http://maps.apple.com/?q=${businessDetails?.yelpBusinessLocation.address1},${businessDetails?.yelpBusinessLocation.city},${businessDetails?.yelpBusinessLocation.zip_code}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.itemContainer}>
        <AnimatedLottieView
          autoPlay
          loop={false}
          ref={animation}
          style={styles.lottieAnimation} // Use the dedicated style for the animation
          source={loaderAnimation}
        />
        {businessDetails && (
          <>
            <Image
              source={getImageSource(
                businessDetails.yelpBusiness.name,
                businessDetails.yelpBusiness.image_url
              )}
              style={styles.image}
            />

            <Text style={styles.name}>{businessDetails.yelpBusiness.name}</Text>
            <View style={styles.locationContainer}>
              <View style={styles.locationContainer}>
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
              </View>

              <TouchableOpacity onPress={openDirections}>
                <MapIcon name="map-marker-alt" size={25} color="#FF6347" />
              </TouchableOpacity>
            </View>
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
                Phone: {businessDetails.yelpBusiness.display_phone}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={styles.timeSlot}>
          Selected Time: {formatDate(slot.date)}
        </Text>
        <Text style={styles.timeSlot}>
          Selected Time: {formatTime(slot.startTime)} -{" "}
          {formatTime(slot.endTime)}
        </Text>
        <Text style={styles.serviceType}>Service Type: {service_type}</Text>
        <Text style={styles.serviceType}>
          Job Description: {slot.job_description}
        </Text>

        <Text style={styles.serviceType}>
          Need service in zipcodes: {slot.zipcodes.join(", ")}
        </Text>
        <Text style={styles.serviceType}>
          Priority Status: {getPriorityStatusText(slot.priorityStatus)}
        </Text>
        {slot.open && !slot.booked && !slot.confirmed && (
          <Text style={{ color: "#FFA500", fontWeight: "bold" }}>
            Awaiting Provider Action
          </Text>
        )}
        {slot.booked && !slot.confirmed && (
          <Text style={{ color: "#FFA500", fontWeight: "bold" }}>
            Awaiting Provider Confirmation
          </Text>
        )}
        {slot.booked && slot.confirmed && (
          <Text style={{ color: "#00AA00", fontWeight: "bold" }}>
            Appointment Confirmed
          </Text>
        )}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={handleAddToCalendar}
        >
          <Text style={styles.calendarButtonText}>Add to Calendar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    marginTop:50
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor, // Applied the text color here
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  width:"95%"
  },
  location: {
    fontSize: 14,
    color: theme3.fontColor, // Applied the text color here
    flex: 1,
  },
  phone: {
    fontSize: 14,
    color: theme3.fontColor, // Applied the text color here
    marginBottom: 10,
  },
  timeSlot: {
    fontSize: 14,
    color: theme3.fontColor, // Applied the text color here
    marginBottom: 10,
  },
  serviceType: {
    fontSize: 14,
    color: theme3.fontColor, // Applied the text color here
    marginBottom: 10,
  },
  calendarButton: {
    backgroundColor: theme3.primaryColor, // Applied the button color here
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  calendarButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  lottieAnimation: {
    width: 200, // Reduced size for better visibility of other contents
    height: 200, // Reduced size for better visibility of other contents
    alignSelf: "center",
    marginTop: 10, // Adjust the margin as needed for better positioning
    marginBottom: 0, // Provide some space between the animation and the next element
    backgroundColor: "#FFF",
  },
});

export default ApptConfirmationScreen;
