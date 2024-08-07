import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const CategoryModal = ({
  uniqueCategories,
  handleCategoryPress,
  selectedCategory,
  showCatModal,
  onClose, // Add an onClose prop for closing the modal
}) => {
  useEffect(() => {
    console.log("Modal visibility changed:", showCatModal);
  }, [showCatModal]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item?.name && styles.selectedCategory,
      ]}
      onPress={() => handleCategoryPress(item?.name)}
    >
      <Ionicons
        name={item?.iconName}
        size={30}
        color={
          selectedCategory === item?.name ? theme3.light : theme3.primaryColor
        }
      />
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item?.name && styles.selectedCategoryText,
        ]}
      >
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={showCatModal} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>
            Dive into a World of Categories! 🌟
          </Text>
          <FlatList
            data={uniqueCategories}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width,
    height: height,
    backgroundColor: theme3.light,
    borderRadius: 0,
    paddingTop: 60, // Add padding to prevent overlap with the status bar
    paddingBottom: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40, // Adjusted to be below the status bar
    right: 20,
    zIndex: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 30, // Increased margin for better spacing
    textAlign: "center",
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryItem: {
    alignItems: "center",
    margin: 6,
    width: width / 3.5,
    height: 100,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  selectedCategory: {
    backgroundColor: theme3.primaryColor,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    color: theme3.fontColor,
    textAlign: "center",
    marginTop: 5,
  },
  selectedCategoryText: {
    color: theme3.light,
    fontWeight: "600",
  },
});

export default CategoryModal;
