import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme3 } from "../../assets/branding/themes";
import Header from "../GlobalComponents/Header";

const CancelModal = ({ isVisible, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header title="Cancel Appointment" typeModal={true} onPress={onClose} />
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Cancel Appointment</Text>
          <Text style={styles.instructionText}>
            Please provide a reason for cancellation. This helps us improve our
            services.
          </Text>
          <View style={styles.reasonContainer}>
            <TextInput
              value={reason}
              onChangeText={setReason}
              style={styles.textInput}
              placeholder="Reason for cancellation"
              placeholderTextColor={theme3.placeHolder}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Confirm Cancellation</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme3.fontColor,
    textAlign: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: theme3.fontColor,
    textAlign: "center",
    marginBottom: 20,
  },
  reasonContainer: {
    backgroundColor: theme3.light,
    width: "95%",
    height: 150,
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    elevation: 1,
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    textAlignVertical: "top",
    color: theme3.fontColor,
  },
  submitButton: {
    backgroundColor: theme3.primaryColor,
    width: "95%",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 30,
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
});

export default CancelModal;
