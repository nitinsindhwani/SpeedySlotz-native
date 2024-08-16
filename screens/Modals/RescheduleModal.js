import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CalenderCustom from "../Filters/CalenderCustom";
import { theme3 } from "../../assets/branding/themes";

const { width, height } = Dimensions.get("window");

const RescheduleModal = ({
  isVisible,
  onClose,
  providerId,
  slots,
  onDayPress,
  selectedSlotId,
  handleSlotPress,
  selectedDate,
  selectedServiceType,
  handlePress,
  onSubmit,
}) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);

  useEffect(() => {
    if (selectedSlotId) {
      const selectedSlot = slots.find(
        (slot) => slot.key.slotId === selectedSlotId
      );
      if (selectedSlot && selectedSlot.serviceTypes) {
        setServiceTypes(selectedSlot.serviceTypes);
      }
    }
  }, [selectedSlotId, slots]);

  const handleDayPress = (day) => {
    console.log("Day pressed in RescheduleModal:", day);
    setLocalSelectedDate(day.dateString);
    onDayPress(day);
  };

  function SpecialityListII({ item, onPress, isSelected }) {
    const backgroundColor = isSelected ? theme3.primaryColor : theme3.inActive;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.catList, { backgroundColor }]}
      >
        <Text style={styles.catListText}>{item}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeIconContainer} onPress={onClose}>
          <Ionicons name="close-circle" size={30} color={theme3.danger} />
        </TouchableOpacity>
        <Text style={styles.title}>Reschedule Appointment</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.instructionText}>
            Select a new date and category that suits your schedule.
          </Text>
          <View style={styles.contentWrapper}>
            <CalenderCustom
              setSelectedDay={handleDayPress}
              SlotAvailable={slots}
              selectedSlotId={selectedSlotId}
              handleSlotPress={handleSlotPress}
              customContainerStyle={styles.customCalendarStyle}
              selectedDate={localSelectedDate}
            />
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>Categories</Text>
              {serviceTypes.length === 0 ? (
                <Text style={styles.noSlotsText}>
                  No categories available. Please select a slot.
                </Text>
              ) : (
                <FlatList
                  data={serviceTypes}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `speciality-${index}`}
                  contentContainerStyle={styles.categoryList}
                  renderItem={({ item }) => (
                    <SpecialityListII
                      item={item}
                      onPress={() => handlePress(item)}
                      isSelected={selectedServiceType === item}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (!selectedSlotId || !selectedServiceType) &&
                styles.disabledButton,
            ]}
            onPress={onSubmit}
            disabled={!selectedSlotId || !selectedServiceType}
          >
            <Text style={styles.buttonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  closeIconContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme3.fontColor,
    textAlign: "center",
    marginBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    color: theme3.fontColor,
    textAlign: "center",
    marginBottom: 20,
  },
  contentWrapper: {
    width: "100%",
    alignItems: "center",
  },
  customCalendarStyle: {
    width: "100%",
    marginBottom: 20,
  },
  categoryContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    elevation: 2,
    width: "100%",
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 10,
  },
  categoryList: {
    paddingVertical: 5,
  },
  catList: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  catListText: {
    color: theme3.light,
    fontSize: 16,
  },
  noSlotsText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    width: width * 0.4,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: theme3.primaryColor,
  },
  disabledButton: {
    backgroundColor: theme3.inActive,
  },
  cancelButton: {
    backgroundColor: theme3.danger,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RescheduleModal;
