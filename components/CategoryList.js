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
    case "Handyman":
      return "construct";
    case "Appliance":
      return "flash";
    case "WindowCleaning":
      return "water";
    case "PoolCleaning":
      return "water";
    case "InteriorDesign":
      return "color-palette-outline";
    case "ArtTeaching":
      return "color-palette-outline";
    case "AutoDetailing":
      return "car-sport-outline";
    case "Boarding":
      return "bed-outline";
    case "Boxing":
      return "fitness-outline";
    case "Business Legal Services":
      return "briefcase-outline";
    case "Criminal Law":
      return "lock-closed-outline";
    case "Employment Law":
      return "people-outline";
    case "Estate Planning":
      return "document-text-outline";
    case "Family Law":
      return "heart-outline";
    case "Immigration":
      return "airplane-outline";
    case "Intellectual Property":
      return "bulb-outline";
    case "Personal Injury":
      return "medkit-outline";
    case "CrossFit":
      return "medkit-outline";
    case "Personal Training":
      return "medkit-outline";
    case "Martial Arts":
      return "fitness-outline";
    case "Dance":
      return "musical-notes-outline";
    case "DogWalking":
      return "paw-outline";
    case "EventPlanning":
      return "calendar-outline";
    case "Grooming":
      return "cut-outline";
    case "Group Classes":
      return "people-outline";
    case "LifeCoaching":
      return "heart-half-outline";
    case "Makeup":
      return "brush-outline";
    case "Massage":
      return "hand-left-outline";
    case "MusicTeaching":
      return "musical-note-outline";
    case "Nutrition":
      return "restaurant-outline";
    case "Performance":
      return "mic-outline";
    case "PetSitting":
      return "home-outline";
    case "Photography":
      return "camera-outline";
    case "RealEstate":
      return "home-outline";
    case "Seasonal":
      return "leaf-outline";
    case "Training":
    case "Tutor":
      return "school-outline";
    case "Wellness":
      return "leaf-outline";
    case "Winter Sports":
      return "snow-outline";
    case "Yoga":
      return "body-outline";
    case "Financial Services":
      return "cash-outline"; // Assuming existence for financial-related services
    case "Tax Services":
      return "document-outline"; // Assuming existence for tax-related services
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
                color={theme3.primaryColor}
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
      color: "#084887", // Fixed color for text
      textAlign: "center",
    },
    selectedText: {
      color: "#084887", // Fixed color for selected text
      fontWeight: "700",
    },
  });

export default CategoryList;
