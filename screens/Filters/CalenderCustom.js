import React, { useState, useEffect, useContext } from "react";
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
import moment from "moment";
import { LanguageContext } from "../../api/LanguageContext";

const WindowWidth = Dimensions.get("window").width;

function CalenderCustom({
  setSelectedDay,
  SlotAvailable,
  selectedSlotId,
  handleSlotPress,
  customContainerStyle,
}) {
  const { translations } = useContext(LanguageContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const sortedSlots =
    SlotAvailable && SlotAvailable.length > 0
      ? SlotAvailable.sort((a, b) => {
          const startTimeA = moment(a.key.startTime, "HH:mm");
          const startTimeB = moment(b.key.startTime, "HH:mm");
          return startTimeA.diff(startTimeB);
        })
      : [];

  useEffect(() => {
    const currentDate = new Date();
    const days = [
      translations.sunday,
      translations.monday,
      translations.tuesday,
      translations.wednesday,
      translations.thursday,
      translations.friday,
      translations.saturday,
    ];
    const currentDayIndex = currentDate.getDay();

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
  }, [currentMonth, selectedDate, translations]);

  const toggleDate = (date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDay(formattedDate);
  };

  const switchToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const switchToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  function AvailableSlotsList({ item }) {
    if (!item || !item.key || !item.key.startTime || !item.key.endTime) {
      console.warn("Invalid slot data:", item);
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => handleSlotPress(item)}
        style={[
          styles.CatList,
          {
            backgroundColor:
              item.key && item.key.slotId === selectedSlotId
                ? theme3.primaryColor
                : theme3.inActive,
          },
        ]}
      >
        <Text style={{ color: theme3.light, marginLeft: 5 }}>
          {item.key.startTime} - {item.key.endTime}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.modalContainer, customContainerStyle]}>
      <View style={styles.monthSwitchContainer}>
        <TouchableOpacity onPress={switchToPreviousMonth}>
          <Ionicons name="arrow-back" size={24} color={theme3.secondaryColor} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18 }}>
          {translations[getMonthName(currentMonth)]}
          {/* Translate the month name */}
        </Text>
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
            {translations.availability}
          </Text>
          <FlatList
            data={sortedSlots}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key.slotId}
            renderItem={({ item }) => <AvailableSlotsList item={item} />}
          />
        </>
      ) : (
        <Text style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}>
          {translations.noSlotsAvailable}
        </Text>
      )}
    </View>
  );
}

const getMonthName = (monthIndex) => {
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
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
