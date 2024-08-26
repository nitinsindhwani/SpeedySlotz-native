import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { theme3 } from "../../assets/branding/themes";
import { Ionicons } from "@expo/vector-icons";

const ConfirmModal = ({ isVisible, onClose, onConfirm, slot, business }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Confirm Appointment</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount Due:</Text>
            <Text style={styles.amountValue}>
              ${slot?.amountDue || "Final Amount Pending"}
            </Text>
            <Text style={styles.amountNote}>
              (This amount is before taxes and fees)
            </Text>
          </View>

          <Text style={styles.businessName}>
            {business?.yelpBusiness?.name}
          </Text>

          <Text style={styles.serviceInfo}>
            {slot?.selectedServiceTypes?.join(", ")}
          </Text>

          <View style={styles.warningContainer}>
            <Ionicons
              name="warning"
              size={24}
              color={theme3.danger}
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              By confirming, you agree to pay the above amount for this
              appointment.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 20,
  },
  amountContainer: {
    backgroundColor: theme3.primaryColor,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 18,
    color: "white",
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  amountNote: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
    fontStyle: "italic",
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 5,
  },
  serviceInfo: {
    fontSize: 16,
    color: theme3.fontColorI,
    marginBottom: 20,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: theme3.danger,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: "#0056b3", // Blue color matching the image
  },
  rejectButton: {
    backgroundColor: "#dc3545", // Red color matching the image
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfirmModal;
