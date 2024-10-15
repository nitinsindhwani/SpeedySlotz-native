import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BusinessSettings = ({ settings, translations }) => {
  const workingDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formatTime = (time) => {
    if (Array.isArray(time) && time.length === 2) {
      const [hours, minutes] = time;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
    return "00:00";
  };

  const getWorkingHours = (day) => {
    const fullDay = {
      Mon: "monday",
      Tue: "tuesday",
      Wed: "wednesday",
      Thu: "thursday",
      Fri: "friday",
      Sat: "saturday",
      Sun: "sunday",
    }[day];

    const startTime = formatTime(settings[`${fullDay}StartTime`]);
    const endTime = formatTime(settings[`${fullDay}EndTime`]);

    if (startTime === "00:00" && endTime === "00:00") {
      return "Closed";
    }
    return `${startTime}-${endTime}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.workingHoursContainer}>
        {workingDays.map((day) => (
          <View key={day} style={styles.dayRow}>
            <Text style={styles.dayText}>{day}</Text>
            <Text style={styles.timeText}>{getWorkingHours(day)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.policiesContainer}>
        <PolicyItem
          icon="calendar-clock"
          text={`${translations.cancel}: ${settings.cancellationWindow / 60} ${
            translations.beforeBooking
          }`}
        />
        <PolicyItem
          icon="calendar-sync"
          text={`${translations.reschedule}: ${
            settings.rescheduleWindow / 60
          } ${translations.beforeBooking}`}
        />
        <PolicyItem
          icon="clock-alert-outline"
          text={`${translations.emergency}: ${
            settings.allowEmergencyRequest ? translations.yes : translations.no
          }${
            settings.allowEmergencyRequest
              ? `, ${translations.emergencyHours}: ${formatTime(
                  settings.emergencyStartTime
                )}-${formatTime(settings.emergencyEndTime)}`
              : ""
          }`}
        />
      </View>
    </View>
  );
};

const PolicyItem = ({ icon, text }) => (
  <View style={styles.policyItem}>
    <MaterialCommunityIcons name={icon} size={18} color="#007AFF" />
    <Text style={styles.policyText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  workingHoursContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: "20%",
  },
  timeText: {
    fontSize: 14,
    color: "#555",
    width: "80%",
    textAlign: "right",
  },
  policiesContainer: {
    marginTop: 10,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  policyText: {
    fontSize: 13,
    marginLeft: 8,
    color: "#333",
    flex: 1,
  },
});

export default BusinessSettings;
