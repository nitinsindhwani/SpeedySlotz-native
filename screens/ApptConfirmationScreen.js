import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from "../assets/Animated/success.json";
import moment from "moment";
import getImageSource from "./CallFuncGlobal/getImageSource";
import { theme3 } from "../assets/branding/themes";
import * as Calendar from "expo-calendar";

const ApptConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, businessDetails, slot, service_type } = route.params;
  const animation = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandDescription, setExpandDescription] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    return moment(dateString).format("LL");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString(undefined, options);
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
        title: `Appointment with ${businessDetails.yelpBusiness.name}`,
        startDate: new Date(slot.date + "T" + slot.startTime),
        endDate: new Date(slot.date + "T" + slot.endTime),
        timeZone: deviceTimeZone,
        location: `${businessDetails.yelpBusinessLocation.address1}, ${businessDetails.yelpBusinessLocation.city}`,
        notes: `Service Type: ${service_type}\nJob Description: ${slot.job_description}`,
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
    }
  };

  const handleNavigateHome = () => {
    navigation.navigate("BottomNavigation", { user: userData });
  };

  const handleBookAgain = () => {
    navigation.navigate("DetailScreen", { business: businessDetails });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <AnimatedLottieView
          ref={animation}
          source={loaderAnimation}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Confirmation</Text>
        </View>
      </SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Image
            source={getImageSource(
              businessDetails?.yelpBusiness?.name,
              businessDetails?.yelpBusiness?.image_url
            )}
            style={styles.image}
          />
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>
                {businessDetails?.yelpBusiness?.name}
              </Text>
              <View style={styles.reviewedContainer}>
                <View style={styles.dot} />
                <Text style={styles.reviewedText}>Reviewed</Text>
              </View>
            </View>
            <Text style={styles.description}>
              Need Grooming...{" "}
              <Text
                style={styles.readMoreText}
                onPress={() => setExpandDescription(!expandDescription)}
              >
                {expandDescription ? "Read Less" : "Read More"}
              </Text>
            </Text>
            {expandDescription && (
              <Text style={styles.fullDescription}>{slot.job_description}</Text>
            )}
            <View style={styles.infoContainer}>
              <InfoItem icon="building" text="Northlake" />
              <InfoItem icon="dollar" text="$100" />
              <InfoItem icon="map-marker" text="Directions" />
              <InfoItem
                icon="phone"
                text={businessDetails.yelpBusiness.phone}
              />
              <InfoItem icon="comment" text="Chat Now" />
              <InfoItem
                icon="exclamation-triangle"
                text="Emergency"
                color="red"
              />
            </View>
            <Text style={styles.bookingTitle}>Booking Details</Text>
            <View style={styles.bookingDetails}>
              <BookingItem text={formatDate(slot?.date)} />
              <BookingItem
                text={`${formatTime(slot?.startTime)} - ${formatTime(
                  slot?.endTime
                )}`}
              />
              <BookingItem text={service_type} />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddToCalendar}
              >
                <Text style={styles.buttonText}>Add to Calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleNavigateHome}
              >
                <Text style={styles.buttonText}>Back Home</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.bookAgainButton}
              onPress={handleBookAgain}
            >
              <Text style={styles.bookAgainText}>Book Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, text, color }) => (
  <View style={styles.infoItem}>
    <FontAwesome name={icon} size={16} color={color || theme3.primaryColor} />
    <Text style={[styles.infoText, color && { color }]}>{text}</Text>
  </View>
);

const BookingItem = ({ text }) => (
  <View style={styles.bookingItem}>
    <Text style={styles.bookingItemText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme3.primaryColor,
  },
  safeArea: {
    backgroundColor: theme3.primaryColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme3.primaryColor,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme3.fontColor,
  },
  reviewedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "green",
    marginRight: 4,
  },
  reviewedText: {
    color: "purple",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: theme3.fontColorI,
    marginBottom: 8,
  },
  readMoreText: {
    color: theme3.primaryColor,
  },
  fullDescription: {
    fontSize: 14,
    color: theme3.fontColorI,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme3.fontColorI,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 8,
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  bookingItem: {
    backgroundColor: theme3.primaryColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bookingItemText: {
    color: "white",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme3.primaryColor,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookAgainButton: {
    backgroundColor: theme3.secondaryColor,
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  bookAgainText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ApptConfirmationScreen;
