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

const { width, height } = Dimensions.get("window");

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
      <Ionicons
        name={item.iconName}
        size={30}
        color={
          selectedCategory === item.name ? theme3.light : theme3.primaryColor
        }
      />
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
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 30,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    margin: 6,
    width: width / 3.5,
    height: 100,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: theme3.light,
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
