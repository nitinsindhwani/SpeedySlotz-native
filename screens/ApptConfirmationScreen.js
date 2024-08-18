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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AnimatedLottieView from "lottie-react-native";
import moment from "moment";
import * as Calendar from "expo-calendar";
import ChatAnim from "./GlobalComponents/ChatAnim";
import { theme3 } from "../assets/branding/themes";
import { v4 as uuidv4 } from "uuid";
import { getStoredUser } from "../api/ApiCall";
import getImageSource from "./CallFuncGlobal/getImageSource";
const ApptConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, businessDetails, slot, service_type } = route.params;
  const animation = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandDescription, setExpandDescription] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setCurrentUser(storedUserData);
    };

    fetchUserData();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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

  const handleChatButtonPress = () => {
    if (!currentUser) {
      console.error("User data not available");
      return;
    }

    const selectedChat = {
      chat_id: uuidv4(),
      project_name: "New Job",
      user_id: currentUser.user_id,
      username: currentUser.username,
      business_id: businessDetails.yelpBusiness.id,
      business_name: businessDetails.yelpBusiness.name,
      chatMessages: [],
    };

    navigation.navigate("App", {
      screen: "ChatScreen",
      params: {
        chatData: selectedChat,
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <AnimatedLottieView
          ref={animation}
          source={require("../assets/Animated/success.json")}
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
        <View style={styles.outerContainer}>
          <View style={styles.card}>
            <Image
              source={getImageSource(
                businessDetails?.yelpBusiness?.name,
                businessDetails?.yelpBusiness?.image_url
              )}
              style={styles.image}
            />
            <View style={styles.contentContainer}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>
                  {businessDetails.yelpBusiness.name}
                </Text>
                <View style={styles.statusContainer}>
                  <ChatAnim />
                  <Text style={styles.statusText}>Booked</Text>
                </View>
              </View>
              <Text style={styles.description}>
                {expandDescription
                  ? slot.job_description
                  : `${slot.job_description.slice(0, 30)}...`}
                <Text
                  style={styles.readMoreText}
                  onPress={() => setExpandDescription(!expandDescription)}
                >
                  {expandDescription ? " Read Less" : " Read More"}
                </Text>
              </Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <MaterialIcons
                      name="location-city"
                      size={18}
                      color={theme3.primaryColor}
                    />
                    <Text style={styles.infoText}>
                      {businessDetails.yelpBusinessLocation.city}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="cash-outline"
                      size={18}
                      color={theme3.primaryColor}
                    />
                    <Text style={styles.infoText}>
                      {slot.amountDue
                        ? `$${slot.amountDue}`
                        : "Final Amount Pending"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.infoItem}
                    onPress={() => {
                      const address = `${businessDetails.yelpBusinessLocation.address1}, ${businessDetails.yelpBusinessLocation.city}`;
                      const mapQuery = encodeURIComponent(address);
                      Linking.openURL(`http://maps.apple.com/?q=${mapQuery}`);
                    }}
                  >
                    <MaterialIcons
                      name="directions"
                      size={18}
                      color={theme3.primaryColor}
                    />
                    <Text style={styles.infoText}>Directions</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `tel:${businessDetails.yelpBusiness.phone}`
                      )
                    }
                    style={styles.infoItem}
                  >
                    <FontAwesome
                      name="phone"
                      size={18}
                      color={theme3.secondaryColor}
                    />
                    <Text style={styles.infoText}>
                      {businessDetails.yelpBusiness.phone}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.infoItem}
                    onPress={handleChatButtonPress}
                  >
                    <ChatAnim />
                    <Text style={styles.infoText}>Chat Now</Text>
                  </TouchableOpacity>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="alert-outline"
                      size={18}
                      color={theme3.primaryColor}
                    />
                    <Text style={styles.infoText}>Emergency</Text>
                  </View>
                </View>
              </View>
              <Text
                style={[
                  styles.mostPopularName,
                  { fontSize: 14, marginLeft: 0 },
                ]}
              >
                Booking Details
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}
                >
                  <Text style={{ color: theme3.light, marginLeft: 5 }}>
                    {formatDate(slot?.date)}
                  </Text>
                </View>
                <View
                  style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}
                >
                  <Text style={{ color: theme3.light, marginLeft: 5 }}>
                    {formatTime(slot?.startTime)} - {formatTime(slot?.endTime)}
                  </Text>
                </View>
                <View
                  style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}
                >
                  <Text style={{ color: theme3.light, marginLeft: 5 }}>
                    {slot.selectedServiceTypes.join(", ")}
                  </Text>
                </View>
              </ScrollView>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleAddToCalendar}
                >
                  <Text style={styles.buttonText}>Add to Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handleNavigateHome}
                >
                  <Text style={styles.buttonText}>Back Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  contentContainer: {
    paddingTop: 16,
  },
  headerContent: {
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 4,
    color: theme3.primaryColor,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: theme3.fontColorI,
    marginBottom: 16,
  },
  readMoreText: {
    color: theme3.primaryColor,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme3.fontColorI,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 8,
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
  bookingDetailsScroll: {
    marginBottom: 16,
  },
  bookingDetails: {
    flexDirection: "row",
  },
  outerContainer: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 1,
    elevation: 1,
  },
  bookingItem: {
    backgroundColor: theme3.primaryColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  bookingItemText: {
    color: "white",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: theme3.primaryColor,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: theme3.secondaryColor,
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAgainButton: {
    backgroundColor: theme3.se,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
  },

  bookAgainText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default ApptConfirmationScreen;
