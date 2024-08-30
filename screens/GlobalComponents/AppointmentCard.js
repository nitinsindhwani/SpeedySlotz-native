import React, { useState, useEffect, useContext } from "react";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import getImageSource from "../CallFuncGlobal/getImageSource";
import { theme3 } from "../../assets/branding/themes";
import Styles from "../../assets/branding/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { getStoredUser, getStoredToken } from "../../api/ApiCall";
import CancelModal from "../Modals/CancelModal";
import axios from "axios";
import {
  Linking,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Platform,
} from "react-native";
import ChatAnim from "./ChatAnim";
import ErrorAlert from "./ErrorAlert";
import { baseApiUrl } from "../../api/Config";
import RescheduleModal from "../Modals/RescheduleModal";
import ConfirmModal from "../Modals/ConfirmModal";
import RemarkModal from "../Modals/FeedbackModal";
import moment from "moment";

import uuid from "react-native-uuid";
import { LanguageContext } from "../../api/LanguageContext";

function AppointmentCard({
  businesss,
  formatDate,
  formatTime,
  singleSlot,
  setBusinesses,
}) {
  const { translations } = useContext(LanguageContext);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isRemarkModalVisible, setRemarkModalVisible] = useState(false);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [isReviewed, setIsReviewed] = useState(
    localSingleSlot?.reviewed || false
  );
  const [expandDescription, setExpandDescription] = useState(false);
  const [isRescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [localSingleSlot, setLocalSingleSlot] = useState(singleSlot);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const navigation = useNavigation();

  const priorityLabels = [
    translations.priorityFlexible,
    translations.priorityRoutine,
    translations.priorityUrgent,
    translations.priorityEmergency,
  ];
  const priorityColor = ["#6EBD6A", "#FFD700", "#FFA500", "#FF4500"];
  const priorityIcons = [
    "calendar-outline",
    "time-outline",
    "warning-outline",
    "alert-outline",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getStoredUser();
      setUserData(storedUserData);
    };

    fetchUserData();
  }, []);

  const fetchSlots = async (selectedDate) => {
    try {
      const providerId = businesss?.yelpBusiness?.id;
      const userToken = await getStoredToken("userToken");

      if (!providerId || !selectedDate || !userToken) {
        console.error("Missing required parameters");
        return;
      }

      const dataString = `providerId=${providerId}&date=${selectedDate}`;

      const response = await axios.post(
        `${baseApiUrl}/api/v1/slots/getSlotsByUser`,
        { data: dataString },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSlots(response.data);
      } else {
        console.error("No slots data received.");
      }
    } catch (error) {
      console.error("There was an error fetching the slots", error);
    }
  };

  useEffect(() => {
    setIsReviewed(singleSlot?.reviewed || false);
    setLocalSingleSlot(singleSlot);
  }, [singleSlot]);

  const onDayPress = (day) => {
    const dateString = typeof day === "string" ? day : day.dateString;
    setSelectedDate(dateString);
    fetchSlots(dateString);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedSlotId || !selectedServiceType || !selectedDate) {
      setErrorMessage(translations.rescheduleFailed);
      setShowError(true);
      return;
    }

    try {
      const userToken = await getStoredToken("userToken");
      if (!userToken) {
        return;
      }

      const rescheduleData = {
        oldSlotId: localSingleSlot.key.slotId,
        newSlotId: selectedSlotId,
        newServiceType: selectedServiceType,
      };

      const response = await axios.post(
        `${baseApiUrl}/api/v1/userBookings/reschedule`,
        rescheduleData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const updatedSlot = {
          ...response.data.payload,
          rescheduled: true,
          booked: true,
        };

        setLocalSingleSlot(updatedSlot);

        setBusinesses((prevBusinesses) =>
          prevBusinesses.map((business) =>
            business.id === businesss.id
              ? {
                  ...business,
                  slots: business.slots.map((slot) =>
                    slot.key.slotId === localSingleSlot.key.slotId
                      ? updatedSlot
                      : slot
                  ),
                }
              : business
          )
        );

        setRescheduleModalVisible(false);
      } else {
        setErrorMessage(translations.rescheduleFailed);
        setShowError(true);
      }
    } catch (error) {
      console.error("Error during rescheduling:", error);
      setErrorMessage(translations.rescheduleFailed);
      setShowError(true);
    }
  };

  const handleSlotPress = (slot) => {
    setSelectedSlotId(slot.key.slotId);
  };

  const handleServiceTypePress = (serviceType) => {
    setSelectedServiceType(serviceType);
  };

  const handleReview = () => {
    setRemarkModalVisible(true);
  };

  const handleReviewSubmit = () => {
    setIsReviewed(true);
    const updatedSlot = { ...localSingleSlot, reviewed: true };
    setLocalSingleSlot(updatedSlot);
    updateBusinessesState(updatedSlot);
    setRemarkModalVisible(false);
  };

  const handleConfirm = async () => {
    setConfirmModalVisible(true);
  };

  const handleConfirmModalClose = () => {
    setConfirmModalVisible(false);
  };

  const handleComplete = async () => {
    try {
      const userToken = await getStoredToken("userToken");
      if (!userToken) {
        return;
      }

      const response = await axios.post(
        `${baseApiUrl}/api/v1/userBookings/confirm`,
        { ...localSingleSlot, completed: true },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data && response.data.success) {
        const updatedSlot = { ...localSingleSlot, completed: true };
        setLocalSingleSlot(updatedSlot);
        updateBusinessesState(updatedSlot);
        setErrorMessage(translations.completionSuccess);
        setShowError(true);
      } else {
        setErrorMessage(translations.completionFailed);
        setShowError(true);
      }
    } catch (error) {
      console.error("Error during completion:", error);
      setErrorMessage(translations.completionFailed);
      setShowError(true);
    }
  };

  const handleConfirmModalConfirm = async () => {
    try {
      const userToken = await getStoredToken("userToken");
      if (!userToken) {
        return;
      }

      const response = await axios.post(
        `${baseApiUrl}/api/v1/userBookings/confirm`,
        { ...localSingleSlot, confirmed: true },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data && response.data.success) {
        const updatedSlot = { ...localSingleSlot, confirmed: true };
        setLocalSingleSlot(updatedSlot);
        updateBusinessesState(updatedSlot);
        setErrorMessage(translations.confirmSuccess);
        setShowError(true);
      } else {
        setErrorMessage(translations.confirmFailed);
        setShowError(true);
      }
    } catch (error) {
      console.error("Error during confirmation:", error);
      setErrorMessage(translations.confirmFailed);
      setShowError(true);
    } finally {
      setConfirmModalVisible(false);
    }
  };

  const handleReject = async () => {
    try {
      const userToken = await getStoredToken("userToken");
      if (!userToken) {
        return;
      }

      const response = await axios.post(
        `${baseApiUrl}/api/v1/userBookings/reject`,
        { ...localSingleSlot, rejected: true },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data && response.data.success) {
        const updatedSlot = { ...localSingleSlot, rejected: true };
        setLocalSingleSlot(updatedSlot);
        updateBusinessesState(updatedSlot);
        setErrorMessage(translations.rejectionSuccess);
        setShowError(true);
      } else {
        setErrorMessage(translations.rejectionFailed);
        setShowError(true);
      }
    } catch (error) {
      console.error("Error during rejection:", error);
      setErrorMessage(translations.rejectionFailed);
      setShowError(true);
    }
  };

  const formatTimeWindow = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
      } else {
        return `${hours} hour${
          hours > 1 ? "s" : ""
        } and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
      }
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  };

  const handleBookAgain = () => {
    navigation.navigate("DetailScreen", { business: businesss });
  };

  const updateBusinessesState = (updatedSlot) => {
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((business) =>
        business.id === businesss.id
          ? {
              ...business,
              slots: business.slots.map((slot) =>
                slot.key.slotId === updatedSlot.key.slotId ? updatedSlot : slot
              ),
            }
          : business
      )
    );
  };

  const handleReschedule = () => {
    if (localSingleSlot.rescheduled) {
      setErrorMessage(translations.rescheduleFailed);
      setShowError(true);
      return;
    }

    const now = new Date();
    const appointmentTime = new Date(
      `${localSingleSlot.date}T${localSingleSlot.startTime}`
    );
    const timeDifference = appointmentTime.getTime() - now.getTime();
    const reschedulingWindowInMinutes =
      businesss.yelpBusinessSettings?.rescheduleWindow || 60;
    const reschedulingWindowInMs = reschedulingWindowInMinutes * 60 * 1000;

    if (timeDifference <= reschedulingWindowInMs) {
      const formattedTimeWindow = formatTimeWindow(reschedulingWindowInMinutes);
      setErrorMessage(
        `${translations.rescheduleFailed} ${formattedTimeWindow}`
      );
      setShowError(true);
      return;
    }

    const formattedDate = localSingleSlot.date;
    setSelectedDate(formattedDate);
    fetchSlots(formattedDate);
    setRescheduleModalVisible(true);
  };

  const handleCancel = () => {
    setCancelModalVisible(true);
  };

  const handleCancelConfirm = async (reason) => {
    try {
      if (!localSingleSlot || !localSingleSlot.date) {
        setErrorMessage(translations.cancellationFailed);
        setShowError(true);
        return;
      }

      const userToken = await getStoredToken("userToken");
      if (!userToken) {
        return;
      }

      const now = new Date();
      const appointmentTime = new Date(
        `${localSingleSlot.date}T${localSingleSlot.startTime}`
      );
      const timeDifference = appointmentTime.getTime() - now.getTime();
      const cancellationWindowInMinutes =
        businesss.yelpBusinessSettings?.cancellationWindow || 60;
      const cancellationWindowInMs = cancellationWindowInMinutes * 60 * 1000;

      if (timeDifference <= cancellationWindowInMs) {
        const formattedTimeWindow = formatTimeWindow(
          cancellationWindowInMinutes
        );
        setErrorMessage(`${translations.cancelSuccess} ${formattedTimeWindow}`);
        setShowError(true);
        return;
      }

      const response = await axios.post(
        `${baseApiUrl}/api/v1/userBookings/cancel`,
        { ...localSingleSlot, cancelled: true, cancellationReason: reason },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data && response.data.success) {
        const updatedSlot = {
          ...localSingleSlot,
          cancelled: true,
          cancellationReason: reason,
        };
        setLocalSingleSlot(updatedSlot);
        setBusinesses((prevBusinesses) =>
          prevBusinesses.map((business) =>
            business.id === businesss.id
              ? {
                  ...business,
                  slots: business.slots.map((slot) =>
                    slot.key.slotId === localSingleSlot.key.slotId
                      ? updatedSlot
                      : slot
                  ),
                }
              : business
          )
        );
        setErrorMessage(translations.cancelSuccess);
        setShowError(true);
      } else {
        setErrorMessage(translations.cancellationFailed);
        setShowError(true);
      }
    } catch (error) {
      console.error("There was an error while canceling:", error);
      setErrorMessage(translations.cancellationFailed);
      setShowError(true);
    } finally {
      setCancelModalVisible(false);
    }
  };

  const handleChatButtonPress = () => {
    console.log("handleChatButtonPress called");
    console.log("userData:", userData);

    if (!userData) {
      console.log("userData is null or undefined");
      setErrorMessage(
        translations.userDataMissing ||
          "User data is missing. Please try logging in again."
      );
      setShowError(true);
      return;
    }

    const selectedChat = {
      chat_id: uuid.v4(),
      project_name: "New Job",
      user_id: userData.user_id,
      username: userData.username,
      business_id: businesss.yelpBusiness.id,
      business_name: businesss.yelpBusiness.name,
      chatMessages: [],
    };

    console.log("Navigating to ChatScreen with data:", selectedChat);

    try {
      navigation.navigate("App", {
        screen: "ChatScreen",
        params: {
          chatData: selectedChat,
        },
      });
    } catch (error) {
      console.error("Navigation error:", error);
      setErrorMessage(
        translations.navigationError ||
          "There was an error opening the chat. Please try again."
      );
      setShowError(true);
    }
  };

  const getStatusMessage = (slot) => {
    const statusLabels = {
      cancelled: { label: translations.statusCancelled, color: "#FF6347" },
      rescheduled: { label: translations.statusRescheduled, color: "#FFD700" },
      noshow: { label: translations.statusNoShow, color: "#FF4500" },
      completed: { label: translations.statusCompleted, color: "#32CD32" },
      confirmed: { label: translations.statusConfirmed, color: "#32CD32" },
      accepted: { label: translations.statusAccepted, color: "#4682B4" },
      booked: { label: translations.statusBooked, color: "#1E90FF" },
      open: { label: translations.statusOpen, color: "#6EBD6A" },
      unknown: { label: translations.statusUnknown, color: "#808080" },
      reviewed: { label: translations.statusReviewed, color: "#8A2BE2" },
    };

    // Debugging: Log the slot status
    console.log("Slot status:", JSON.stringify(slot, null, 2));

    if (slot.reviewed) return statusLabels.reviewed;
    if (slot.cancelled) return statusLabels.cancelled;
    if (slot.noshow) return statusLabels.noshow;
    if (slot.completed) return statusLabels.completed;
    if (slot.confirmed) return statusLabels.confirmed;
    if (slot.accepted) return statusLabels.accepted;
    if (slot.rescheduled) return statusLabels.rescheduled;
    if (slot.booked) return statusLabels.booked;
    if (slot.open) return statusLabels.open;
    return statusLabels.unknown;
  };
  const status = getStatusMessage(localSingleSlot);
  const renderButtons = () => {
    const buttonStyle = (color, width = "47%") => [
      Styles.LoginBtn,
      {
        backgroundColor: color,
        padding: 10,
        width: width,
      },
    ];

    const now = new Date();
    const appointmentTime = new Date(
      `${localSingleSlot.date}T${localSingleSlot.startTime}`
    );

    const isPastAppointment = appointmentTime < now;

    // Debugging: Log the current state and conditions
    console.log("Current state:", {
      isPastAppointment,
      isReviewed,
      completed: localSingleSlot.completed,
      confirmed: localSingleSlot.confirmed,
      accepted: localSingleSlot.accepted,
      booked: localSingleSlot.booked,
      status: status.label,
    });

    if (isPastAppointment) {
      if (localSingleSlot.completed && !isReviewed) {
        return (
          <TouchableOpacity
            onPress={handleReview}
            style={buttonStyle(theme3.primaryColor, "100%")}
          >
            <Text style={Styles.LoginTxt}>{translations.review}</Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          onPress={handleBookAgain}
          style={buttonStyle(theme3.primaryColor, "100%")}
        >
          <Text style={Styles.LoginTxt}>{translations.bookAgain}</Text>
        </TouchableOpacity>
      );
    }

    if (localSingleSlot.reviewed) {
      return (
        <TouchableOpacity
          onPress={handleBookAgain}
          style={buttonStyle(theme3.primaryColor, "100%")}
        >
          <Text style={Styles.LoginTxt}>{translations.bookAgain}</Text>
        </TouchableOpacity>
      );
    }

    if (localSingleSlot.completed && !isReviewed) {
      return (
        <TouchableOpacity
          onPress={handleReview}
          style={buttonStyle(theme3.primaryColor, "100%")}
        >
          <Text style={Styles.LoginTxt}>{translations.review}</Text>
        </TouchableOpacity>
      );
    }

    if (localSingleSlot.confirmed) {
      return (
        <TouchableOpacity
          onPress={handleComplete}
          style={buttonStyle(theme3.primaryColor, "100%")}
        >
          <Text style={Styles.LoginTxt}>{translations.markComplete}</Text>
        </TouchableOpacity>
      );
    }

    if (localSingleSlot.accepted) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={handleConfirm}
            style={buttonStyle(theme3.primaryColor)}
          >
            <Text style={Styles.LoginTxt}>{translations.confirm}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReject}
            style={buttonStyle(theme3.danger)}
          >
            <Text style={Styles.LoginTxt}>{translations.reject}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (localSingleSlot.booked) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={handleReschedule}
            style={buttonStyle(theme3.primaryColor)}
          >
            <Text style={Styles.LoginTxt}>{translations.reschedule}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            style={buttonStyle(theme3.danger)}
          >
            <Text style={Styles.LoginTxt}>{translations.cancel}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Debugging: Log if no condition was met
    console.log("No button condition met");

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
          {expandDescription ? translations.readLess : translations.readMore}
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
              {translations.categories}
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
                : translations.finalAmountPending}
            </Text>
          </View>

          <View style={Styles.OneRow}>
            <View style={{ marginLeft: -6 }}>
              <ChatAnim />
            </View>
            <TouchableOpacity
              onPress={() => handleChatButtonPress(businesss.yelpBusiness)}
            >
              <Text style={[styles.DescText, { marginLeft: 0 }]}>
                {translations.chatNow}
              </Text>
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
              {translations.directions}
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
        {translations.bookingDetails}
      </Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}>
          <Text style={{ color: theme3.light, marginLeft: 5 }}>
            {formatDate(localSingleSlot?.date)}
          </Text>
        </View>
        <View style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}>
          <Text style={{ color: theme3.light, marginLeft: 5 }}>
            {formatTime(localSingleSlot?.startTime)} -{" "}
            {formatTime(localSingleSlot?.endTime)}
          </Text>
        </View>
        <View style={[styles.CatList, { marginLeft: 0, marginRight: 5 }]}>
          <Text style={{ color: theme3.light, marginLeft: 5 }}>
            {localSingleSlot.selectedServiceTypes.join(", ")}
          </Text>
        </View>
      </ScrollView>

      <View style={{ marginTop: 10 }}>{renderButtons()}</View>

      <ErrorAlert
        show={showError}
        onAction={() => setShowError(false)}
        title={translations.attention}
        body={errorMessage}
      />
      <CancelModal
        isVisible={isCancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
      />
      <ConfirmModal
        isVisible={isConfirmModalVisible}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirmModalConfirm}
        slot={localSingleSlot}
        business={businesss}
      />
      <RescheduleModal
        isVisible={isRescheduleModalVisible}
        onClose={() => setRescheduleModalVisible(false)}
        providerId={businesss?.yelpBusiness?.id}
        slots={slots}
        onDayPress={onDayPress}
        selectedSlotId={selectedSlotId}
        handleSlotPress={handleSlotPress}
        selectedDate={selectedDate}
        selectedServiceType={selectedServiceType}
        handlePress={handleServiceTypePress}
        onSubmit={handleRescheduleSubmit}
      />
      <RemarkModal
        modalVisible={isRemarkModalVisible}
        setModalVisible={setRemarkModalVisible}
        slotId={localSingleSlot.key.slotId}
        userId={userData?.user_id}
        businessId={businesss?.yelpBusiness?.id}
        onReviewSubmit={handleReviewSubmit}
      />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: theme3.primaryColor,
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
