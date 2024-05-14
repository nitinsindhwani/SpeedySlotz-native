import React, { useContext, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../components/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";

// A mapping function to get the appropriate icon name based on the category name.
// Adjust the icon names as per your requirements and available icons in Ionicons.
const getIconName = (subcategoryName) => {
  switch (subcategoryName) {
    // Valid `Ionicons` icon names
    case "Handyman":
      return "ios-construct"; // Corrected
    case "Appliance":
      return "ios-flash"; // Conceptual match for electrical appliances
    case "WindowCleaning":
      return "ios-water"; // Appropriate match
    case "PoolCleaning":
      return "ios-water"; // Same as window cleaning for lack of a better match
    case "InteriorDesign":
      return "ios-color-palette-outline"; // Corrected
    case "ArtTeaching":
      return "ios-color-palette-outline"; // Same as interior design
    case "AutoDetailing":
      return "car-sport-outline"; // Corrected
    case "Boarding":
      return "bed-outline"; // Corrected
    case "Boxing":
      return "ios-fitness-outline"; // Conceptual match
    case "Business Legal Services":
      return "briefcase-outline"; // Represents business-related legal services
    case "Criminal Law":
      return "lock-closed-outline"; // Suggests law enforcement and legal restrictions
    case "Employment Law":
      return "people-outline"; // Employment law often deals with worker rights and relationships
    case "Estate Planning":
      return "document-text-outline"; // Estate planning involves documents like wills
    case "Family Law":
      return "heart-outline"; // Family law deals with matters of the heart and home
    case "Immigration":
      return "airplane-outline"; // Suggests travel and moving between countries
    case "Intellectual Property":
      return "bulb-outline"; // Represents ideas and invention
    case "Personal Injury":
      return "medkit-outline";
    case "CrossFit":
    case "Personal Training":
    case "Martial Arts":
      return "ios-fitness-outline"; // Fitness-related activities
    case "Dance":
      return "ios-musical-notes-outline"; // Corrected
    case "DogWalking":
      return "paw-outline"; // Corrected
    case "EventPlanning":
      return "calendar-outline"; // Corrected
    case "Grooming":
      return "cut-outline"; // Conceptual match for grooming
    case "Group Classes":
      return "people-outline"; // Corrected
    case "LifeCoaching":
      return "heart-half-outline"; // Conceptual match
    case "Makeup":
      return "brush-outline"; // Corrected
    case "Massage":
      return "hand-left-outline"; // Conceptual match
    case "MusicTeaching":
      return "musical-note-outline"; // Corrected
    case "Nutrition":
      return "restaurant-outline"; // Corrected
    case "Performance":
      return "mic-outline"; // Corrected for microphone
    case "PetSitting":
      return "home-outline"; // Conceptual match for pet sitting at home
    case "Photography":
      return "camera-outline"; // Corrected
    case "PoolCleaning":
      return "water-outline"; // Repeated with corrected name
    case "RealEstate":
      return "home-outline"; // Corrected
    case "Seasonal":
      return "leaf-outline"; // Corrected
    case "Training":
    case "Tutor":
      return "school-outline"; // Education-related activities
    case "Wellness":
      return "leaf-outline"; // Conceptual match for wellness
    case "WindowCleaning":
      return "sunny-outline"; // Corrected
    case "Winter Sports":
      return "snow-outline"; // Assuming existence for conceptual match
    case "Yoga":
      return "body-outline"; // Conceptual match for physical activity
    default:
      return "help-outline"; // A fallback icon
  }
};

const CategoryList = ({
  userCategoriesData,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);
  const scrollViewRef = useRef();
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  const uniqueSubcategories = Array.from(
    new Set(userCategoriesData?.map((item) => item.subcategoryName))
  ).map((subcategoryName) => {
    const item = userCategoriesData.find(
      (item) => item.subcategoryName === subcategoryName
    );
    return {
      id: item.key.subcategoryId,
      name: item.subcategoryName,
      iconName: getIconName(item.subcategoryName), // Dynamically set the icon name
    };
  });

  const adjustScrollViewPosition = (subcategoryName) => {
    const selectedIndex = uniqueSubcategories.findIndex(
      (category) => category.name === subcategoryName
    );
    const itemWidth = 160;
    const halfOfScrollView = scrollViewWidth / 2;
    const halfOfItem = itemWidth / 2;
    const position = selectedIndex * itemWidth - halfOfScrollView + halfOfItem;
    scrollViewRef.current?.scrollTo({ x: position, animated: true });
  };

  useEffect(() => {
    adjustScrollViewPosition(selectedCategory);
  }, [selectedCategory, scrollViewWidth]);

  return (
    <View style={styles.categories}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        onLayout={(event) => setScrollViewWidth(event.nativeEvent.layout.width)}
      >
        {uniqueSubcategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => setSelectedCategory(category.name)}
          >
            <View style={[styles.categoryImageContainer]}>
              <Ionicons
                name={category.iconName}
                size={35}
                color={
                  selectedCategory === category.name
                    ? theme3.primaryColor
                    : theme3.fontColor
                }
              />
            </View>
            <Text
              style={[
                styles.categoryName,
                selectedCategory === category.name ? styles.selectedText : null,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (currentTheme) =>
  StyleSheet.create({
    categories: {
      padding: 10,
    },
    categoryItem: {
      alignItems: "center",
      marginRight: 15,
    },
    categoryImageContainer: {
      padding: 0,
      borderRadius: 70,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      opacity: 0.8,
    },
    categoryName: {
      fontSize: 13,
      marginTop: 2, // Reduced gap by decreasing the top margin
      fontWeight: "500",
      color: "#333",
      textAlign: "center",
    },
    selectedText: {
      color: theme3.primaryColor,
      fontWeight: "700",
    },
  });

export default CategoryList;
