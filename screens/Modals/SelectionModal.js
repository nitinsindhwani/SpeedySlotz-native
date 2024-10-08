import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";
import Header from "../GlobalComponents/Header";

const { width, height } = Dimensions.get("window");

const SelectionModal = ({
  visible,
  onClose,
  items,
  onSelect,
  title,
  showBackButton,
  onBack,
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0], // slide the modal up from the bottom
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onSelect(item)}
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.iconName} size={30} color={theme3.primaryColor} />
      </View>
      <Text style={styles.categoryText} numberOfLines={2}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <StatusBar
          backgroundColor={theme3.primaryColor}
          barStyle="light-content"
        />
        <Header
          title={title}
          typeModal={true}
          onPress={onClose}
          showBackButton={showBackButton}
          onBack={onBack}
        />
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
        >
          {items.length === 0 ? (
            <Text style={styles.noItemsText}>No items to display</Text>
          ) : (
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff", // Full-screen modal with white background
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#f6f6f6", // Light background to match the home screen
  },
  noItemsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: theme3.fontColor,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  categoryItem: {
    alignItems: "center",
    marginVertical: 10,
    width: (width - 60) / 3, // Adjusted width for 3 columns and proper spacing
    height: 120,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#ffffff",
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
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
    color: theme3.fontColor,
    fontWeight: "600",
  },
});

export default SelectionModal;
