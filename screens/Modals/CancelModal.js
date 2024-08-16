import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";

const CancelModal = ({ isVisible, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeIconContainer}
          onPress={onClose}
        >
          <Ionicons name="close-circle" size={30} color={theme3.danger} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Cancel Appointment</Text>
          <View style={styles.warningContainer}>
            <Ionicons name="warning-outline" size={24} color={theme3.danger} />
            <Text style={styles.warningText}>
              Please note: Once cancelled, this action cannot be undone. The appointment slot will be released and may be booked by another client.
            </Text>
          </View>
          <Text style={styles.instructionText}>
            We'd appreciate if you could provide a reason for cancellation. This helps us improve our services.
          </Text>
          <View style={styles.reasonContainer}>
            <TextInput
              value={reason}
              onChangeText={setReason}
              style={styles.reasonInput}
              placeholder="Reason for cancellation"
              placeholderTextColor={theme3.placeHolder}
              multiline={true}
            />
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Confirm Cancellation</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: 60,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
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
    color: theme3.danger,
    textAlign: "center",
    marginBottom: 20,
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    color: theme3.danger,
    fontSize: 16,
  },
  instructionText: {
    fontSize: 16,
    color: theme3.fontColor,
    textAlign: "center",
    marginBottom: 20,
  },
  reasonContainer: {
    backgroundColor: theme3.light,
    width: "100%",
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
  },
  reasonInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: theme3.fontColor,
  },
  submitButton: {
    backgroundColor: theme3.danger,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CancelModal;