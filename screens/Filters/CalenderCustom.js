import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";
import AvailableSlots from "../../assets/data/Availableslots";
import formatTime from "../CallFuncGlobal/formatTime";

const WindowWidth = Dimensions.get("window").width;

function CalenderCustom({
  setSelectedDay,
  SlotAvailable,
  selectedSlotId,
  handleSlotPress,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Initial month index

  const sortedSlots = SlotAvailable.sort((a, b) => {
    const timeA = a.startTime.split(":");
    const minutesA = parseInt(timeA[0], 10) * 60 + parseInt(timeA[1], 10);

    const timeB = b.startTime.split(":");
    const minutesB = parseInt(timeB[0], 10) * 60 + parseInt(timeB[1], 10);

    return minutesA - minutesB;
  });

  function SpecialityListII({ item }) {
    return (
      <View style={styles.CatList}>
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item.title}</Text>
      </View>
    );
  }

  useEffect(() => {
    const currentDate = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayIndex = currentDate.getDay();

    // Highlight current date by default if no date is already selected
    if (!selectedDate) {
      setSelectedDate(currentDate);
    }

    const nextSevenDays = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      nextSevenDays.push({
        date: nextDate,
        day: days[(currentDayIndex + i) % 7],
      });
    }
    setDates(nextSevenDays);
  }, [currentMonth, selectedDate]);

  const toggleDate = (date) => {
    setSelectedDate(date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    // console.log("Selected Date:", formattedDate);
    setSelectedDay(formattedDate);
  };

  const switchToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const switchToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  function AvailableSlotsList({ item }) {
    return (
      <TouchableOpacity
        onPress={() => handleSlotPress(item)}
        style={[
          styles.CatList,
          {
            backgroundColor:
              item.key.slotId === selectedSlotId
                ? theme3.primaryColor
                : theme3.inActive,
          },
        ]}
      >
        <Text style={{ color: theme3.light, marginLeft: 5 }}>
          {formatTime(item.startTime)} - {formatTime(item.endTime)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.monthSwitchContainer}>
        <TouchableOpacity onPress={switchToPreviousMonth}>
          <Ionicons name="arrow-back" size={24} color={theme3.secondaryColor} />
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
      {sortedSlots?.length > 0 ? (
        <>
          <Text
            style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
          >
            Availability
          </Text>
          <FlatList
            data={sortedSlots}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `slot-${item.id || index}`}
            renderItem={({ item, index }) => {
              return <AvailableSlotsList item={item} index={index} />;
            }}
          />
        </>
      ) : (
        <Text style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}>
          No Slots Available Try With Another Date
        </Text>
      )}
    </View>
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
    width: WindowWidth / 1.03,
    backgroundColor: theme3.GlobalBg,
    shadowColor: "rgba(0,0,0,0.1)",
    elevation: 4,
    shadowOpacity: 4,
    borderRadius: 10,
    alignItems: "center",
    padding: 0,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 16,
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
  CatList: {
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme3.inActive,
    paddingBottom: 5,
    paddingTop: 5,
    margin: 5,
  },
});

export default CalenderCustom;
