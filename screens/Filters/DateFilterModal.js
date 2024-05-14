import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

function DateFilterModal({ show, HideModal, onDateSelected }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Initial month index

  useEffect(() => {
    const currentDate = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayIndex = currentDate.getDay(); // Get current day index (0 for Sunday, 1 for Monday, etc.)

    const nextSevenDays = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      nextSevenDays.push({
        date: nextDate,
        day: days[(currentDayIndex + i) % 7], // Cycle through days of the week
      });
    }
    setDates(nextSevenDays);
  }, [currentMonth]); // Update dates when month changes

  const toggleDate = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    if (onDateSelected && selectedDate) {
      onDateSelected(selectedDate); // Call the callback with the selected date
    }
    HideModal(); // Hide modal after date selection
  };

  const switchToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const switchToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  return (
    <Modal visible={show} transparent={true} animationType="slide">
      <View style={[Styles.Container, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
        <View style={styles.modalContainer}>
          {/* Month switch options */}

          <Text style={styles.DateTitle}>Select Date</Text>

          <View style={styles.monthSwitchContainer}>
            <TouchableOpacity onPress={switchToPreviousMonth}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme3.secondaryColor}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 18 }}>{getMonthName(currentMonth)}</Text>
            <TouchableOpacity onPress={switchToNextMonth}>
              <Ionicons
                name="arrow-forward"
                size={24}
                color={theme3.secondaryColor}
              />
            </TouchableOpacity>
          </View>
          {/* Date selection */}
          <View style={styles.dateContainer}>
            {dates.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  selectedDate === item.date ? styles.selectedDate : null,
                ]}
                onPress={() => toggleDate(item.date)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      selectedDate === item.date
                        ? theme3.secondaryColor
                        : theme3.fontColor,
                  }}
                >
                  {item.day}
                </Text>
                <Text
                  style={{
                    color:
                      selectedDate === item.date
                        ? theme3.secondaryColor
                        : theme3.fontColor,
                  }}
                >
                  {item.date.getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleSubmit} style={Styles.LoginBtn}>
            <Text style={Styles.LoginTxt}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const getMonthName = (monthIndex) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthIndex];
};

const styles = StyleSheet.create({
  modalContainer: {
    width: WindowWidth,
    height: WindowHeight / 2.2,
    backgroundColor: theme3.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    paddingTop: 10,
  },
  monthSwitchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 10,
  },
  dateButton: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 6,
    borderColor: "transparent",
    width: "14%",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedDate: {
    borderColor: theme3.secondaryColor,
    borderBottomWidth: 2,
  },
  DateTitle: {
    alignSelf: "center",
    marginVertical: 0,
    fontSize: 24,
    color: theme3.primaryColor,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default DateFilterModal;
