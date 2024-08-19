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
import { theme3 } from "../assets/branding/themes";

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
          <Image source={dummyDealImage} style={styles.dealImageTop} />
          <Text style={styles.modalHeader}>Available Deals</Text>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {deals && deals.length > 0 ? (
              deals.map((deal, index) => (
                <View key={index} style={styles.dealContainer}>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <Text style={styles.dealDescription}>{deal.description}</Text>
                  <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="calendar-range"
                        size={20}
                        color={theme3.primaryColor}
                      />
                      <Text style={styles.infoText}>
                        {formatDate(deal.startDate)} -{" "}
                        {formatDate(deal.endDate)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={20}
                        color={theme3.primaryColor}
                      />
                      <Text style={styles.infoText}>
                        {deal.startTime} - {deal.endTime}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="tag"
                        size={20}
                        color={theme3.primaryColor}
                      />
                      <Text style={styles.infoText}>{deal.couponCode}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDealsText}>
                No active deals at the moment.
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dealImageTop: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    marginBottom: 10,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme3.primaryColor,
  },
  scrollView: {
    width: "100%",
  },
  dealContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: theme3.secondaryColor,
  },
  dealDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  noDealsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: theme3.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DealModal;
