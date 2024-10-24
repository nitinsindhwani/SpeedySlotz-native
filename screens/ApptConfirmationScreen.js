import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  BackHandler,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AnimatedLottieView from "lottie-react-native";
import moment from "moment";
import * as Calendar from "expo-calendar";
import ChatAnim from "./GlobalComponents/ChatAnim";
import { theme3 } from "../assets/branding/themes";
import uuid from "react-native-uuid";
import { getStoredUser } from "../api/ApiCall";
import getImageSource from "./CallFuncGlobal/getImageSource";
import Header from "./GlobalComponents/Header";
import ErrorAlert from "./GlobalComponents/ErrorAlert";
import AppRatingModal from "./Modals/AppRatingModal";
const ApptConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, businessDetails, slot, service_type } = route.params;
  const animation = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandDescription, setExpandDescription] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAppRating, setShowAppRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (confirmationShown) {
          handleNavigateHome();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [confirmationShown])
  );

  useEffect(() => {
    const checkIfRated = async () => {
      const hasRatedStored = await SecureStore.getItemAsync("hasRated");
      setHasRated(!!hasRatedStored);

      if (!hasRatedStored && confirmationShown) {
        setTimeout(() => {
          setShowAppRating(true); // Show rating modal after a delay
        }, 2000);
      }
    };

    if (confirmationShown) {
      checkIfRated();
    }
  }, [confirmationShown]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setCurrentUser(storedUserData);
    };

    fetchUserData();
    const timer = setTimeout(() => {
      setIsLoading(false);
      setConfirmationShown(true); // Set confirmationShown after data is loaded
    }, 3000); // Simulate loading with 3-second delay

    return () => clearTimeout(timer);
  }, []);

  const showSuccessAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const showErrorAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const formatDate = (dateInput) => {
    if (!dateInput) return "Date not available";

    let date;
    if (typeof dateInput === "string") {
      date = moment(
        dateInput,
        ["YYYY-MM-DD", "DD-MM-YYYY", "MM/DD/YYYY", moment.ISO_8601],
        true
      );
    } else if (Array.isArray(dateInput) && dateInput.length === 3) {
      date = moment(new Date(dateInput[0], dateInput[1] - 1, dateInput[2]));
    } else if (dateInput instanceof Date) {
      date = moment(dateInput);
    } else {
      console.warn("Invalid date format:", dateInput);
      return "Invalid Date";
    }

    if (!date.isValid()) {
      console.warn("Invalid date:", dateInput);
      return "Invalid Date";
    }

    return date.format("DD MMM, YYYY");
  };

  const formatTime = (timeInput) => {
    if (!timeInput) return "Time not available";

    let time;
    if (typeof timeInput === "string") {
      // Handle "HH:mm:ss" or "HH:mm" format
      time = moment(timeInput, ["HH:mm:ss", "HH:mm"], true);
    } else if (Array.isArray(timeInput) && timeInput.length >= 2) {
      // Handle [hours, minutes] array
      time = moment().hours(timeInput[0]).minutes(timeInput[1]).seconds(0);
    } else if (timeInput instanceof Date) {
      time = moment(timeInput);
    } else {
      console.warn("Invalid time format:", timeInput);
      return "Invalid Time";
    }

    if (!time.isValid()) {
      console.warn("Invalid time:", timeInput);
      return "Invalid Time";
    }

    return time.format("HH:mm");
  };

  const handleAddToCalendar = async () => {
    try {
      // Request calendar permission with a clear message
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        showErrorAlert(
          "Calendar Access Required",
          "SpeedySlotz needs access to your calendar to add appointment details. This allows you to easily keep track of your scheduled services. You can manage this permission in your device settings."
        );
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      if (!calendars.length) {
        showErrorAlert("No Calendars", "No calendars found on this device.");
        return;
      }

      const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Parse and validate start date and time
      const startDateTime = moment(
        `${slot.date} ${slot.startTime}`,
        "YYYY-MM-DD HH:mm"
      );

      if (!startDateTime.isValid()) {
        showErrorAlert(
          "Invalid Date",
          "The appointment start date or time is invalid."
        );
        return;
      }

      // Set end date and time
      let endDateTime;
      if (slot.endTime && slot.endTime.trim() !== "") {
        endDateTime = moment(
          `${slot.date} ${slot.endTime}`,
          "YYYY-MM-DD HH:mm"
        );
        if (!endDateTime.isValid()) {
          showErrorAlert(
            "Invalid Date",
            "The appointment end time is invalid."
          );
          return;
        }
      } else {
        // If end time is empty or null, set it to 1 hour after start time
        endDateTime = moment(startDateTime).add(1, "hours");
      }

      const eventDetails = {
        title: businessDetails
          ? `Appointment with ${businessDetails.yelpBusiness.name}`
          : "New Appointment",
        startDate: startDateTime.toDate(),
        endDate: endDateTime.toDate(),
        timeZone: deviceTimeZone,
        location: businessDetails
          ? `${businessDetails.yelpBusinessLocation.address1}, ${businessDetails.yelpBusinessLocation.city}`
          : "To be determined",
        notes: `Service Type: ${service_type}\nJob Description: ${slot.job_description}`,
      };

      const { id: calendarId } = calendars[0];

      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      if (eventId) {
        showSuccessAlert("Success", "Event added to calendar successfully!");
      } else {
        showErrorAlert("Error", "Error while adding event to calendar.");
      }
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      showErrorAlert("Error", `An error occurred: ${error.message}`);
    }
  };

  const handleNavigateHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "BottomNavigation", params: { user: userData } }],
    });
  };

  const handleCloseAppRating = async () => {
    setShowAppRating(false);
    await SecureStore.setItemAsync("hasRated", "true"); // Store that the user has rated
  };

  const handleChatButtonPress = () => {
    if (!currentUser || !businessDetails) {
      console.error("User data or business details not available");
      return;
    }

    const selectedChat = {
      chat_id: uuid.v4(),
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
      <Header title={"Appointment Confirmation"} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.outerContainer}>
          <View style={styles.card}>
            {businessDetails ? (
              <Image
                source={getImageSource(
                  businessDetails.yelpBusiness.name,
                  businessDetails.yelpBusiness.image_url
                )}
                style={styles.image}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  Awaiting Service Provider
                </Text>
              </View>
            )}
            <View style={styles.contentContainer}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>
                  {businessDetails
                    ? businessDetails.yelpBusiness.name
                    : "Service Provider to be Assigned"}
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
              {businessDetails ? (
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
              ) : (
                <View style={styles.awaitingProviderContainer}>
                  <Text style={styles.awaitingProviderText}>
                    We're currently matching you with the best service provider.
                    You'll be notified once a provider accepts your job.
                  </Text>
                </View>
              )}
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
                    {Array.isArray(slot.selectedServiceTypes)
                      ? slot.selectedServiceTypes.join(", ")
                      : service_type}
                  </Text>
                </View>
              </ScrollView>
              <View style={styles.BtnWrapper}>
                <TouchableOpacity
                  onPress={handleAddToCalendar}
                  style={styles.BTn_2}
                >
                  <Text style={styles.Btn_TTx}>Add to Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNavigateHome}
                  style={[
                    styles.BTn_2,
                    { backgroundColor: theme3.secondaryColor },
                  ]}
                >
                  <Text style={styles.Btn_TTx}>Back Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <ErrorAlert
        show={showAlert}
        onAction={handleCloseAlert}
        title={alertTitle}
        body={alertMessage}
      />
      {!hasRated && (
        <AppRatingModal
          isVisible={showAppRating}
          onClose={handleCloseAppRating}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: theme3.GlobalBg,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
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
  awaitingProviderContainer: {
    backgroundColor: theme3.GlobalBg,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  awaitingProviderText: {
    color: theme3.fontColor,
    fontSize: 14,
    textAlign: "center",
  },
  mostPopularName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 8,
  },
  CatList: {
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    paddingVertical: 5,
    marginRight: 5,
  },
  outerContainer: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 1,
    elevation: 1,
    paddingBottom:10
  },
  BtnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    paddingVertical:20
  },
  BTn_2: {
    width: "47%",
    paddingVertical: 10,
    paddingHorizontal: 17,
    backgroundColor: theme3.primaryColor,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  Btn_TTx: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
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
  awaitingProviderContainer: {
    backgroundColor: theme3.GlobalBg,
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  awaitingProviderText: {
    color: theme3.fontColor,
    fontSize: 14,
    textAlign: "center",
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: theme3.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ApptConfirmationScreen;
