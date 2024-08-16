import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { theme3 } from "../../assets/branding/themes";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ConfirmModal = ({ isVisible, onClose, onConfirm, amountDue }) => {
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
        <Text style={styles.title}>Confirm Appointment</Text>

        <View style={styles.contentContainer}>
          <Ionicons
            name="cash-outline"
            size={60}
            color={theme3.primaryColor}
            style={styles.icon}
          />

          <Text style={styles.amountText}>${amountDue}</Text>
          <Text style={styles.noteText}>
            (This amount is before taxes and fees)
          </Text>

          <Text style={styles.questionText}>
            Are you okay with this amount?
          </Text>

          <View style={styles.warningContainer}>
            <Ionicons
              name="warning-outline"
              size={24}
              color={theme3.danger}
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              Once confirmed, you cannot change this appointment.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
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
  contentContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  icon: {
    marginBottom: 20,
  },
  amountText: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme3.primaryColor,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    fontStyle: "italic",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    fontSize: 16,
    color: theme3.danger,
    flex: 1,
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
  cancelButton: {
    backgroundColor: theme3.danger,
  },
  confirmButton: {
    backgroundColor: theme3.primaryColor,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ConfirmModal;
