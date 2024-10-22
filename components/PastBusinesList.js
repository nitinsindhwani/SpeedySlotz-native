import React, { useState, useContext, useEffect, useMemo } from "react";
import moment from "moment";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getStoredToken } from "../api/ApiCall";
import AppointmentCard from "../screens/GlobalComponents/AppointmentCard";
import NoDataFound from "../screens/GlobalComponents/NoDataFound";
import ErrorAlert from "../screens/GlobalComponents/ErrorAlert";
import { ThemeContext } from "./ThemeContext";
import { LanguageContext } from "../api/LanguageContext"; // Import LanguageContext
import { baseApiUrl } from "../api/Config";

const PastBusinessList = ({ fetchedBusinesses, setBusinesses }) => {
  const [sortedBusinesses, setSortedBusinesses] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentTheme } = useContext(ThemeContext);
  const { language, translations } = useContext(LanguageContext); // Use LanguageContext
  const [selectedFilter, setSelectedFilter] = useState(translations.all); // Default filter using translation

  const styles = getStyles(currentTheme);

  const filterOptions = [
    translations.all,
    translations.reviewed,
    translations.completed,
  ];

  useEffect(() => {
    if (fetchedBusinesses && fetchedBusinesses.length > 0) {
      const sortedData = fetchedBusinesses
        .map((business) => {
          const sortedSlots = business.slots.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateA - dateB;
          });
          return { ...business, slots: sortedSlots };
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.slots[0].date}T${a.slots[0].startTime}`);
          const dateB = new Date(`${b.slots[0].date}T${b.slots[0].startTime}`);
          return dateA - dateB;
        });
      setSortedBusinesses(sortedData);
    }
  }, [fetchedBusinesses]);

  const formatDate = (dateString) => {
    return moment(dateString).format("LL");
  };

  const formatTime = (timeValue) => {
    // Check if timeValue is undefined or null
    if (!timeValue) {
      return "-";
    }

    // Handle the case where timeValue is an array, e.g., [hours, minutes]
    if (Array.isArray(timeValue) && timeValue.length === 2) {
      const [hours, minutes] = timeValue;

      // Format time using the Date object
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      const options = { hour: "2-digit", minute: "2-digit", hour12: true };
      return date.toLocaleTimeString(undefined, options);
    }

    // Handle the case where timeValue is a string (expected format: "HH:MM")
    if (typeof timeValue === "string" && timeValue.includes(":")) {
      const [hours, minutes] = timeValue.split(":");

      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      const options = { hour: "2-digit", minute: "2-digit", hour12: true };
      return date.toLocaleTimeString(undefined, options);
    }

    // Default fallback if timeValue is of an unexpected type
    return "Invalid time";
  };

  const handleCloseError = () => setShowError(false);

  const filterAppointments = useMemo(() => {
    return (appointments) => {
      if (selectedFilter === translations.all) return appointments;

      return appointments
        .filter((business) =>
          business.slots.some((slot) => {
            switch (selectedFilter) {
              case translations.reviewed:
                return slot.reviewed;
              case translations.completed:
                return slot.completed && !slot.reviewed;
              case translations.booked:
                return (
                  slot.booked &&
                  !slot.completed &&
                  !slot.cancelled &&
                  !slot.reviewed &&
                  !slot.rescheduled &&
                  !slot.accepted &&
                  !slot.confirmed
                );
              case translations.cancelled:
                return slot.cancelled;
              case translations.confirmed:
                return (
                  slot.confirmed &&
                  !slot.completed &&
                  !slot.cancelled &&
                  !slot.reviewed
                );
              case translations.accepted:
                return (
                  slot.accepted &&
                  !slot.completed &&
                  !slot.cancelled &&
                  !slot.reviewed
                );
              case translations.rescheduled:
                return slot.rescheduled;
              default:
                return true;
            }
          })
        )
        .map((business) => ({
          ...business,
          slots: business.slots.filter((slot) => {
            switch (selectedFilter) {
              case translations.reviewed:
                return slot.reviewed;
              case translations.completed:
                return slot.completed && !slot.reviewed;
              case translations.booked:
                return (
                  slot.booked &&
                  !slot.completed &&
                  !slot.cancelled &&
                  !slot.reviewed &&
                  !slot.rescheduled
                );
              case translations.cancelled:
                return slot.cancelled;
              case translations.accepted:
                return (
                  slot.accepted &&
                  !slot.completed &&
                  !slot.cancelled &&
                  !slot.reviewed
                );
              case translations.rescheduled:
                return slot.rescheduled;
              default:
                return true;
            }
          }),
        }));
    };
  }, [selectedFilter, translations]);

  const filteredBusinesses = useMemo(
    () => filterAppointments(sortedBusinesses),
    [filterAppointments, sortedBusinesses]
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.selectedFilterButtonText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView style={styles.mostPopular}>
        {filteredBusinesses.length === 0 ? (
          <NoDataFound scenario="bookings" />
        ) : (
          filteredBusinesses.map((item) =>
            item?.slots?.map((singleSlot, index) => (
              <AppointmentCard
                key={`${item.id}-${singleSlot.id || index}`}
                businesss={item}
                formatDate={formatDate}
                formatTime={formatTime}
                singleSlot={singleSlot}
                setBusinesses={setBusinesses}
              />
            ))
          )
        )}
      </ScrollView>
      <ErrorAlert
        show={showError}
        onAction={handleCloseError}
        title={translations.actionErrorTitle}
        body={errorMessage}
      />
    </View>
  );
};

const getStyles = (currentTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f4f4f4",
    },
    filterWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
      backgroundColor: "#fff",
    },
    filterContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    filterButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginRight: 8,
      borderRadius: 20,
      backgroundColor: "#f0f0f0",
    },
    selectedFilterButton: {
      backgroundColor: currentTheme.primaryColor,
    },
    filterButtonText: {
      color: "#333",
      fontWeight: "600",
      fontSize: 14,
    },
    selectedFilterButtonText: {
      color: "#fff",
    },
    mostPopular: {
      flex: 1,
    },
  });
};

export default PastBusinessList;
