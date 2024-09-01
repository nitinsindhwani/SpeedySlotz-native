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
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    generateDates(today);
  }, [show]);

  const generateDates = (currentDate) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayIndex = currentDate.getDay();

    const nextSevenDays = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      nextSevenDays.push({
        date: nextDate,
        day: days[(currentDayIndex + i) % 7],
      });
    }
    setDates(nextSevenDays);
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
  };

  const toggleDate = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    if (onDateSelected && selectedDate) {
      onDateSelected(selectedDate);
    }
    HideModal();
  };

  const switchToPreviousWeek = () => {
    const newDate = new Date(dates[0].date);
    newDate.setDate(newDate.getDate() - 7);
    generateDates(newDate);
  };

  const switchToNextWeek = () => {
    const newDate = new Date(dates[6].date);
    newDate.setDate(newDate.getDate() + 1);
    generateDates(newDate);
  };

  return (
    <Modal visible={show} transparent={true} animationType="slide">
      <View style={[Styles.Container, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
        <View style={styles.modalContainer}>
          <Text style={styles.DateTitle}>Select Date</Text>

          <View style={styles.monthSwitchContainer}>
            <TouchableOpacity onPress={switchToPreviousWeek}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme3.secondaryColor}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 18 }}>{`${getMonthName(
              currentMonth
            )} ${currentYear}`}</Text>
            <TouchableOpacity onPress={switchToNextWeek}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={theme3.secondaryColor}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            {dates.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  selectedDate &&
                  selectedDate.toDateString() === item.date.toDateString()
                    ? styles.selectedDate
                    : null,
                ]}
                onPress={() => toggleDate(item.date)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      selectedDate &&
                      selectedDate.toDateString() === item.date.toDateString()
                        ? theme3.secondaryColor
                        : theme3.fontColor,
                  }}
                >
                  {item.day}
                </Text>
                <Text
                  style={{
                    color:
                      selectedDate &&
                      selectedDate.toDateString() === item.date.toDateString()
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
    width: "100%",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 10,
    width: "100%",
  },
  dateButton: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "transparent",
    width: "14%",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedDate: {
    borderColor: theme3.secondaryColor,
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
