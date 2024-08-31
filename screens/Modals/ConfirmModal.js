import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { theme3 } from "../../assets/branding/themes";
import { Ionicons } from "@expo/vector-icons";
import Header from "../GlobalComponents/Header";

const ConfirmModal = ({ isVisible, onClose, onConfirm, slot, business }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title="Confirm Appointment"
          typeModal={true}
          onPress={onClose}
        />
        <ScrollView contentContainerStyle={styles.modalContainer}>
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

          <TouchableOpacity style={styles.submitButton} onPress={onConfirm}>
            <Text style={styles.submitButtonText}>Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme3.fontColor,
    textAlign: "center",
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
    width: "100%",
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: theme3.danger,
  },
  submitButton: {
    backgroundColor: theme3.primaryColor,
    width: "95%",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ConfirmModal;
