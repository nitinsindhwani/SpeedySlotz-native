import React, { useRef } from "react";
import { View, Modal, TouchableOpacity, Text } from "react-native";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import AlertStyles from "./AlertStyling";

function ErrorAlert({ show, onAction, onCancel, title, body }) {
  return (
    <Modal visible={show} transparent={true} animationType="slide">
      <View style={AlertStyles.Container}>
        <View style={AlertStyles.AlertBox}>
          <Text style={AlertStyles.AlertTitle}>{title}</Text>
          <Text style={AlertStyles.AlertTxt}>{body}</Text>

          <View style={AlertStyles.ButtonContainer}>
            {/* Cancel Button */}
            {onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                style={[AlertStyles.Button, AlertStyles.CancelButton]}
              >
                <Text style={AlertStyles.CancelBtnTxt}>Cancel</Text>
              </TouchableOpacity>
            )}
            {/* Confirm Button */}
            <TouchableOpacity
              onPress={onAction}
              style={[AlertStyles.Button, AlertStyles.ConfirmButton]}
            >
              <Text style={AlertStyles.BtnTxt}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ErrorAlert;
