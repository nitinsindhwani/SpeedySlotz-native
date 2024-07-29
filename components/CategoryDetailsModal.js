import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

const CategoryDetailsModal = ({ visible, onClose, category }) => {
  // Function to render category details
  const renderCategoryDetails = () => {
    if (!category) return null;

    return Object.keys(category).map((key) => {
      const value = category[key];
      if (Array.isArray(value)) {
        // Render array items
        return (
          <View key={key} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{key}</Text>
            {value.map((item, index) => (
              <Text key={index} style={styles.itemText}>
                {item}
              </Text>
            ))}
          </View>
        );
      } else if (typeof value === "object" && value !== null) {
        // Render object properties
        return (
          <View key={key} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{key}</Text>
            {Object.keys(value).map((subKey) => (
              <Text key={subKey} style={styles.detailText}>
                {subKey}: {value[subKey]}
              </Text>
            ))}
          </View>
        );
      }
      // Render string/number/boolean values
      return (
        <View key={key} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{key}</Text>
          <Text style={styles.detailText}>{value}</Text>
        </View>
      );
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Category Details</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {renderCategoryDetails()}
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

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxHeight: height * 0.8, // Ensure modal does not exceed 80% of screen height
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 15,
    width: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  sectionContainer: {
    marginBottom: 15,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
    paddingLeft: 10,
  },
  scrollViewContent: {
    paddingBottom: 20, // Extra padding to ensure content is not hidden behind the button
  },
});

export default CategoryDetailsModal;
