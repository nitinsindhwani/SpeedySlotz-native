import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
import Header from "../screens/GlobalComponents/Header";

const { width } = Dimensions.get("window");

const CategoryModal = ({
  uniqueCategories,
  handleCategoryPress,
  selectedCategory,
  showCatModal,
  onClose,
  language,
}) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.name && styles.selectedCategory,
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <View
        style={[
          styles.categoryIconContainer,
          selectedCategory === item.name &&
            styles.selectedCategoryIconContainer,
        ]}
      >
        <Ionicons
          name={item.iconName}
          size={30}
          color={
            selectedCategory === item.name
              ? theme3.primaryColor
              : theme3.primaryColor
          }
        />
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.name && styles.selectedCategoryText,
        ]}
      >
        {language === "es" ? item.nameEs : item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={showCatModal}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <StatusBar
          backgroundColor={theme3.primaryColor}
          barStyle="light-content"
        />
        <Header
          title={language === "es" ? "Categorías" : "Categories"}
          typeModal={true}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <FlatList
            data={uniqueCategories}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: theme3.primaryColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: 10,
    paddingHorizontal: 10, // Added padding for left and right spacing
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  categoryItem: {
    alignItems: "center",
    margin: 2, // Horizontal and vertical gaps set to 2
    width: (width - 36) / 3, // Adjusted to account for padding and space between items
    height: 120,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#ffffff", // Ensure it matches home screen
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular container behind the icon
    backgroundColor: "#f0f0f0", // Light background similar to home screen
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedCategoryIconContainer: {
    backgroundColor: theme3.secondaryColor, // Fill the background with secondary color when selected
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: theme3.fontColor,
    textAlign: "center",
    marginTop: 8,
  },
  selectedCategory: {
    backgroundColor: theme3.primaryColor, // Keep the background white for selected item
  },
  selectedCategoryText: {
    color: "#ffffff", // Text color becomes primary color when selected
    fontWeight: "600",
  },
});

export default CategoryModal;
