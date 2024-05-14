import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DealModal = ({ isVisible, deals, onClose }) => {
  const dummyDealImage = require("../assets/images/hot-deals.png");

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {deals && deals.length > 0 && (
            <Image source={dummyDealImage} style={styles.dealImageTop} />
          )}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
          >
            {deals && deals.length > 0 ? (
              deals.map((deal, index) => (
                <View key={index} style={styles.dealContainer}>
                  <Text style={styles.modalTextTitle}>{deal.title}</Text>
                  <View style={styles.dateRow}>
                    <MaterialCommunityIcons
                      name="calendar-range"
                      size={20}
                      color="#4F8EF7"
                    />
                    <Text style={styles.dateText}>
                      {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                    </Text>
                  </View>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeText}>{deal.startTime}</Text>
                    <Text style={styles.timeText}>{deal.endTime}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                      name="tag"
                      size={20}
                      color="#4F8EF7"
                    />
                    <Text style={styles.modalText}>{deal.couponCode}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.modalTextNoDeals}>
                No active deals at the moment.
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    width: "100%",
    alignSelf: "stretch", // Ensure ScrollView stretches to fill width
  },
  dealContainer: {
    width: "100%",
    alignSelf: "stretch", // Stretch to fill width
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1, // Add border
    borderColor: "#e1e1e1", // Border color
    padding: 10, // Padding inside the deal container
    borderRadius: 10, // Rounded corners
    marginTop: 15, // Space between image and first deal
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%", // Adjust based on your layout
    marginTop: 5,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  timeText: {
    fontSize: 14,
    color: "#666", // Lighter text color for the time
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  modalTextTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
  },
  modalText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalTextNoDeals: {
    marginTop: 20,
    fontSize: 16,
  },
  dealImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  dealImageTop: {
    width: 150, // Adjust size as needed
    height: 150, // Adjust size as needed
    borderRadius: 75, // Half of width/height to make it round
    marginTop: 0, // Half of image height to offset upwards
    alignSelf: "center",
    zIndex: 1, // Make sure the image is above other elements
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DealModal;
