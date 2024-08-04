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
import { MaterialIcons } from '@expo/vector-icons'; // Import Expo vector icons
import { theme1, theme3 } from "../assets/branding/themes";

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
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="list" size={20} color={theme3.primaryColor} /> {key}
            </Text>
            {value.map((item, index) => (
              <Text key={index} style={styles.itemText}>
                <MaterialIcons name="chevron-right" size={16} color="#555" /> {item}
              </Text>
            ))}
          </View>
        );
      } else if (typeof value === "object" && value !== null) {
        // Render object properties
        return (
          <View key={key} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="folder" size={20} color={theme3.primaryColor} /> {key}
            </Text>
            {Object.keys(value).map((subKey) => (
              <Text key={subKey} style={styles.detailText}>
                <MaterialIcons name="info" size={16} color="#555" /> {subKey}: {value[subKey]}
              </Text>
            ))}
          </View>
        );
      }
      // Render string/number/boolean values
      return (
        <View key={key} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            <MaterialIcons name="label" size={20} color={theme3.primaryColor} /> {key}
          </Text>
          <Text style={styles.detailText}>
            <MaterialIcons name="check-circle" size={16} color="#555" /> {value}
          </Text>
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
          <View style={styles.header}>
            <Text style={styles.modalTitle}>
              <MaterialIcons name="category" size={24} color={theme3.fontColor} /> Category Details
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme3.fontColor} />
            </TouchableOpacity>
          </View>
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
    backgroundColor: theme3.light,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
    width: "90%",
    maxHeight: height * 0.8, // Ensure modal does not exceed 80% of screen height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: theme3.primaryColor,
    marginTop: 15,
    width: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme3.fontColor,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  sectionContainer: {
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.primaryColor,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
    paddingLeft: 10,
  },
  scrollViewContent: {
    paddingBottom: 20, // Extra padding to ensure content is not hidden behind the button
  },
});

export default CategoryDetailsModal;
