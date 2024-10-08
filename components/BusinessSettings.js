import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";

const BusinessSettings = ({ settings, translations }) => {
  const workingDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const formatTime = (time) => time.slice(0, 5);

  const renderWorkingHours = () => {
    return workingDays.map((day) => (
      <View key={day} style={styles.dayRow}>
        <Text style={styles.dayText}>{translations[day].slice(0, 3)}</Text>
        <Text style={styles.timeText}>
          {settings[`${day}StartTime`] === "00:00:00" &&
          settings[`${day}EndTime`] === "00:00:00"
            ? translations.closed
            : `${formatTime(settings[`${day}StartTime`])} - ${formatTime(
                settings[`${day}EndTime`]
              )}`}
        </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.workingHoursGrid}>{renderWorkingHours()}</View>

      <View style={styles.policyContainer}>
        <PolicyItem
          icon="calendar-clock"
          text={`${translations.cancel}: ${
            settings.cancellationWindow / 60
          }h before booking`}
        />
        <PolicyItem
          icon="calendar-sync"
          text={`${translations.reschedule}: ${
            settings.rescheduleWindow / 60
          }h before booking`}
        />
        <PolicyItem
          icon="clock-alert-outline"
          text={
            settings.allowEmergencyRequest
              ? `${translations.emergency}: ${translations.yes}, ${
                  translations.emergencyHours
                }: ${formatTime(settings.emergencyStartTime)} - ${formatTime(
                  settings.emergencyEndTime
                )}`
              : `${translations.emergency}: ${translations.no}`
          }
        />
      </View>
    </View>
  );
};

const PolicyItem = ({ icon, text }) => (
  <View style={styles.policyItem}>
    <MaterialCommunityIcons name={icon} size={16} color={theme3.primaryColor} />
    <Text style={styles.policyText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme3.GlobalBg,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
  },
  workingHoursGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayRow: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dayText: {
    fontSize: 14,
    color: theme3.fontColor,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 14,
    color: theme3.fontColorI,
  },
  policyContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme3.inActive,
    paddingTop: 15,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: theme3.fontColorI,
    marginLeft: 8,
  },
});

export default BusinessSettings;
