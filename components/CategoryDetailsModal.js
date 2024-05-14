import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const CategoryDetailsModal = ({ visible, onClose, category }) => {
  // Function to render category details
  const renderCategoryDetails = () => {
    console.log("Category:", category);
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
        <Text key={key} style={styles.detailText}>
          {`${key}: ${value}`}
        </Text>
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
          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalText}>Category Details</Text>
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  detailText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "navy",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: "darkblue",
    marginBottom: 3,
  },
  scrollView: {
    maxHeight: 400, // Adjust this value as needed
  },
});

export default CategoryDetailsModal;
