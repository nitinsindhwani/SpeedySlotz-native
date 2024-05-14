import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import * as Calendar from "expo-calendar";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { Linking } from "react-native";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import CalendarIcon from "react-native-vector-icons/FontAwesome5";
import HeartIcon from "react-native-vector-icons/AntDesign"; // Add this import for the heart icon
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import { translation } from "../assets/translations/translations";
import { getStoredToken } from "../api/ApiCall";
import { FontAwesome } from "@expo/vector-icons";
import { baseApiUrl } from "../api/Config";
import AppointmentCard from "../screens/GlobalComponents/AppointmentCard";
import NoDataFound from "../screens/GlobalComponents/NoDataFound";
const defaultImageUrl = require("../assets/images/defaultImage.png");
const metersToMiles = (meters) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
};

const utcDateToString = (dateString) => {
  return moment.utc(dateString).toISOString();
};

const addToCalendar = async (date, time) => {
  const startDate = utcDateToString(`${date}T${time}:00Z`);
  const endDate = utcDateToString(
    `${date}T${(parseInt(time.split(":")[0]) + 1)
      .toString()
      .padStart(2, "0")}:${time.split(":")[1]}:00Z`
  );

  // Requesting permission
  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status === "granted") {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendar =
      calendars.find((cal) => cal.isPrimary) || calendars[0];

    const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
      title: "Scheduled Business Appointment",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timeZone: "UTC",
    });
  }
};

const handleReschedule = async (
  slot,
  setBusinesses,
  yelpBusinessSettings,
  setErrorMessage
) => {
  try {
    // Fetch the token
    const userToken = await getStoredToken("userToken");
    if (!userToken) {
      console.log("No token found");
      return;
    }
    const now = new Date();
    const appointmentTime = new Date(slot.date); // Assuming slot has a 'date' property in a format that can be used to create a Date object
    const timeDifference = appointmentTime - now; // This will give you the time difference in milliseconds

    const rescheduleWindowInMs =
      yelpBusinessSettings?.rescheduleWindow * 60 * 1000; // Convert the window from minutes to milliseconds

    if (timeDifference < rescheduleWindowInMs) {
      // If the time remaining to the appointment is less than the cancellation window
      setErrorMessage(
        `You cannot cancel the appointment within ${yelpBusinessSettings?.rescheduleWindow} minutes of its start time.`
      );
      return;
    }

    // Set the slot cancelled flag to true before sending the request
    slot.rescheduled = true;

    const response = await axios.post(
      baseApiUrl + "/api/v1/userBookings",
      slot,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (response.data) {
      console.log(response.data);
      setBusinesses((prevBusinesses) =>
        prevBusinesses.map((business) =>
          business.slot.id === slot.id
            ? { ...business, slot: { ...business.slot, ...response.data } } // Assuming the updated slot info is within 'slot' field in response
            : business
        )
      );
    } else {
      console.log("Booking failed:", response.data);
      // Handle failure, perhaps show an error message
    }
  } catch (error) {
    console.error("There was an error while booking:", error);
    // Handle the error, perhaps show an error message to the user
  }
};

const handleCancel = async (
  slot,
  setBusinesses,
  yelpBusinessSettings,
  setErrorMessage
) => {
  try {
    // Fetch the token
    const userToken = await getStoredToken("userToken");
    if (!userToken) {
      console.log("No token found");
      return;
    }
    const now = new Date();
    const appointmentTime = new Date(slot.date); // Assuming slot has a 'date' property in a format that can be used to create a Date object
    const timeDifference = appointmentTime - now; // This will give you the time difference in milliseconds

    const cancellationWindowInMs =
      yelpBusinessSettings?.cancellationWindow * 60 * 1000; // Convert the window from minutes to milliseconds

    if (timeDifference < cancellationWindowInMs) {
      // If the time remaining to the appointment is less than the cancellation window
      setErrorMessage(
        `You cannot cancel the appointment within ${yelpBusinessSettings?.cancellationWindow} minutes of its start time.`
      );
      return;
    }

    // Set the slot cancelled flag to true before sending the request
    slot.cancelled = true;

    const response = await axios.post(
      baseApiUrl + "/api/v1/userBookings",
      slot,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (response.data) {
      console.log(response.data);
      setBusinesses((prevBusinesses) =>
        prevBusinesses.map((business) =>
          business.slot.id === slot.id
            ? { ...business, slot: { ...business.slot, ...response.data } } // Assuming the updated slot info is within 'slot' field in response
            : business
        )
      );
    } else {
      console.log("Booking failed:", response.data);
      // Handle failure, perhaps show an error message
    }
  } catch (error) {
    console.error("There was an error while booking:", error);
    // Handle the error, perhaps show an error message to the user
  }
};

const UpcomingBusinesList = ({ fetchedBusinesses, navigation }) => {
  const initialFavorites = fetchedBusinesses.reduce((acc, business) => {
    acc[business.id] = business.favorite || false; // Default to false if 'favorite' is not provided
    return acc;
  }, {});
  const [businesses, setBusinesses] = useState(fetchedBusinesses);
  const [favorites, setFavorites] = useState(initialFavorites);
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("fetchedBusinesses", fetchedBusinesses);
  }, [fetchedBusinesses]);

  const toggleFavorite = (itemId) => {
    if (favorites[itemId]) {
      removeFavorite(itemId);
    } else {
      addFavorite(itemId);
    }
  };

  function handleCancelOne(slot, settings) {
    handleCancel(slot, setBusinesses, settings, setErrorMessage);
  }
  const addFavorite = async (itemId) => {
    try {
      const secureToken = await getStoredToken();

      const headers = {
        Authorization: `Bearer ${secureToken}`,
      };

      console.log("Headers:", headers);
      console.log("Parameters:", { businessId: itemId });

      await axios.post(
        baseApiUrl + "/api/v1/favorites",
        { businessId: itemId },
        { headers }
      );

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [itemId]: true,
      }));
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const getStatusText = (slot) => {
    console.log("Slottt", slot.cancellation_window);
    if (
      slot.booked &&
      !slot.confirmed &&
      !slot.cancelled &&
      !slot.rescheduled &&
      !slot.noshow
    ) {
      return "Pending";
    } else if (
      slot.booked &&
      slot.confirmed &&
      !slot.cancelled &&
      !slot.rescheduled &&
      !slot.noshow
    ) {
      return "Confirmed";
    } else if (!slot.rescheduled && slot.cancelled) {
      return "Cancelled";
    } else if (slot.rescheduled) {
      return "Rescheduled";
    } else if (slot.noshow) {
      return "No Show";
    } else {
      return "Unknown Status"; // a default fallback status
    }
  };
  function formatDate(dateString) {
    return moment(dateString).format("LL"); // e.g., "September 4, 1986"
  }

  function formatTime(timeString) {
    if (!timeString) {
      console.error("Received invalid timeString:", timeString);
      return "-";
    }

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString(undefined, options);
  }

  const removeFavorite = async (itemId) => {
    try {
      const secureToken = await getStoredToken();
      console.log("SecureToken in delete", { secureToken });
      const headers = {
        Authorization: `Bearer ${secureToken}`,
      };

      await axios.delete(baseApiUrl + "/api/v1/favorites", {
        data: { businessId: itemId },
        headers,
      });

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [itemId]: false,
      }));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <View style={styles.mostPopular}>
      <ScrollView>
        {fetchedBusinesses && fetchedBusinesses.length === 0 ? (
          <NoDataFound />
        ) : (
          // <View style={styles.noAppointmentsContainer}>
          //   <Text style={styles.noAppointmentsText}>
          //     You currently don't have any past appointments.
          //   </Text>
          // </View>
          fetchedBusinesses &&
          fetchedBusinesses.map((item, index) => (
            <AppointmentCard
              businesss={item}
              getStatusText={getStatusText}
              formatDate={formatDate}
              formatTime={formatTime}
              handleReschedule={handleReschedule}
              identifier={"upcoming"}
              handleCancel={handleCancelOne}
            />
          ))
        )}
        {/* <NoDataFound/> */}
        {/* <AppointmentCard
          businesss={"Pass the item value here"}
          getStatusText={getStatusText}
          formatDate={formatDate}
          formatTime={formatTime}
          handleReschedule={handleReschedule}
          identifier={"upcoming"}
          handleCancel={handleCancelOne}
        /> */}
      </ScrollView>
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    mostPopular: {
      flex: 1,
      padding: 15,
      backgroundColor: "#f4f4f4",
    },
    nameDirectionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
    },
    mostPopularItem: {
      marginBottom: 20,
      padding: 20,
      borderRadius: 10,
      backgroundColor: "#FFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    favoriteIconContainer: {
      position: "absolute",
      top: 15,
      right: 15,
      zIndex: 2,
      padding: 10,
      borderRadius: 30,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    mostPopularImage: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      resizeMode: "cover",
      marginBottom: 15,
    },
    mostPopularName: {
      fontSize: 18,
      fontWeight: "600",
      color: currentTheme.primaryColor,
      flex: 1,
    },
    mapIconContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 5,
    },
    appointmentDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    appointmentText: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "500",
      color: currentTheme.primaryColor,
    },
    confirmationText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#4CAF50",
      textAlign: "right",
    },
    mostPopularPhone: {
      fontSize: 18,
      color: currentTheme.primaryColor,
      marginTop: 10,
    },
    ratingContainer: {
      flex: 1,
      alignSelf: "flex-start",
    },
    linkContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
    },
    rescheduleButton: {
      backgroundColor: currentTheme.primaryColor,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 5,
      flex: 0.48,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "#FF6347",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 5,
      flex: 0.48,
      alignItems: "center",
    },
    rescheduleLink: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    cancelLink: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    infoContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      flex: 1,
    },
    nameStatusContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dateText: {
      fontSize: 16,
      color: currentTheme.primaryColor,
      marginTop: 5,
    },
    timeRangeText: {
      fontSize: 14,
      color: currentTheme.primaryColor,
      marginTop: 3,
    },
    extraInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    mostPopularCity: {
      fontSize: 18,
      color: currentTheme.primaryColor,
      marginRight: 10,
    },
    confirmationText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#4CAF50",
      marginLeft: 10,
    },
    mapIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    mapText: {
      marginLeft: 5,
      fontSize: 16,
      color: currentTheme.primaryColor,
    },
    buttonsContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    noAppointmentsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 50,
      borderRadius: 10,
      backgroundColor: "rgba(255, 165, 0, 0.1)", // Light orange background
      marginVertical: 20,
      marginHorizontal: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    noAppointmentsText: {
      fontSize: 18,
      fontWeight: "600",
      color: currentTheme.primaryColor,
      textAlign: "center",
    },
  });

export default UpcomingBusinesList;

// return (
//   <View style={styles.mostPopular}>
//     <ScrollView>
//       {fetchedBusinesses && fetchedBusinesses.length === 0 ? (
//         <View style={styles.noAppointmentsContainer}>
//           <Text style={styles.noAppointmentsText}>
//             You currently don't have any past appointments.
//           </Text>
//         </View>
//       ) : (
//         fetchedBusinesses &&
//         fetchedBusinesses.map((item, index) => (
//           <TouchableOpacity key={index} style={styles.mostPopularItem}>
//             {errorMessage && (
//               <Text style={{ color: "red", textAlign: "center" }}>
//                 {errorMessage}
//               </Text>
//             )}
//             <View style={styles.favoriteIconContainer}>
//               <TouchableOpacity
//                 onPress={() => toggleFavorite(item.yelpBusiness.id)}
//               >
//                 <HeartIcon
//                   name={favorites[item.yelpBusiness.id] ? "heart" : "hearto"}
//                   size={25}
//                   color={
//                     favorites[item.yelpBusiness.id] ? "#FF0000" : "#FFA500"
//                   }
//                 />
//               </TouchableOpacity>
//             </View>
//             <Image
//               source={
//                 item.yelpBusiness.image_url
//                   ? { uri: item.yelpBusiness.image_url.image }
//                   : defaultImageUrl
//               }
//               style={styles.mostPopularImage}
//             />
//             <View style={styles.infoContainer}>
//               <View style={styles.nameStatusContainer}>
//                 <Text style={styles.mostPopularName}>
//                   {item.yelpBusiness.name}
//                 </Text>
//                 <Text style={styles.confirmationText}>
//                   {getStatusText(item.slot)}
//                 </Text>
//               </View>

//               <Text style={styles.dateText}>
//                 {formatDate(item.slot.start)}
//               </Text>

//               <Text style={styles.timeRangeText}>
//                 {formatTime(item.slot.startTime)} -{" "}
//                 {formatTime(item.slot.endTime)}
//               </Text>

//               <View style={styles.extraInfoContainer}>
//                 <Text style={styles.mostPopularCity}>
//                   {item.yelpBusinessLocation.city}
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.mapIconContainer}
//                   onPress={() =>
//                     Linking.openURL(
//                       `http://maps.apple.com/?q=${item.yelpBusinessLocation.address1},${item.yelpBusinessLocation.city}`
//                     )
//                   }
//                 >
//                   <MapIcon name="map-marker-alt" size={16} color="#555" />
//                   <Text style={styles.mapText}>Directions</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <TouchableOpacity
//               onPress={() =>
//                 Linking.openURL(`tel:${item.yelpBusiness.phone}`)
//               }
//             >
//               <Text style={styles.mostPopularPhone}>
//                 <FontAwesome name="phone" size={20} color="#084887" />{" "}
//                 {item.yelpBusiness.display_phone}
//               </Text>
//             </TouchableOpacity>

//             <View style={styles.buttonsContainer}>
//               {!item.slot.cancelled && (
//                 <>
//                   <TouchableOpacity
//                     style={styles.rescheduleButton}
//                     onPress={() => handleReschedule(item.yelpBusiness.id)}
//                   >
//                     <Text style={styles.rescheduleLink}>Reschedule</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.cancelButton}
//                     onPress={() =>
//                       handleCancel(
//                         item.slot,
//                         setBusinesses,
//                         item.yelpBusinessSettings,
//                         setErrorMessage
//                       )
//                     }
//                   >
//                     <Text style={styles.cancelLink}>Cancel</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           </TouchableOpacity>
//         ))
//       )}
//     </ScrollView>
//   </View>
// );
