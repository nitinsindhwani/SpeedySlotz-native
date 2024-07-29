import React, { useContext, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";

const getIconName = (name) => {
  switch (name) {
    case "Handyman":
    case "Home":
      return "construct";
    case "Appliance":
    case "Electrical Repair":
      return "flash";
    case "Window Cleaning":
    case "Pool Cleaning":
      return "water";
    case "Interior Design":
    case "Art Teaching":
      return "color-palette-outline";
    case "Auto Detailing":
    case "Automotive":
      return "car-sport-outline";
    case "Boarding":
      return "bed-outline";
    case "Boxing":
      return "fitness-outline";
    case "Business Legal Services":
    case "Legal Finance":
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
    case "Personal Training":
    case "Fitness":
      return "medkit-outline";
    case "Martial Arts":
      return "fitness-outline";
    case "Dance":
      return "musical-notes-outline";
    case "Dog Walking":
    case "Pets":
      return "paw-outline";
    case "Event Planning":
      return "calendar-outline";
    case "Grooming":
      return "cut-outline";
    case "Group Classes":
      return "people-outline";
    case "Life Coaching":
      return "heart-half-outline";
    case "Makeup":
    case "Beauty":
      return "brush-outline";
    case "Massage":
      return "hand-left-outline";
    case "Music Teaching":
      return "musical-note-outline";
    case "Nutrition":
    case "Diet":
      return "restaurant-outline";
    case "Performance":
      return "mic-outline";
    case "Pet Sitting":
      return "home-outline";
    case "Photography":
      return "camera-outline";
    case "Real Estate":
      return "home-outline";
    case "Seasonal":
      return "leaf-outline";
    case "Training":
    case "Tutor":
    case "Education":
      return "school-outline";
    case "Wellness":
    case "Winter Sports":
    case "Sports":
      return "snow-outline";
    case "Yoga":
      return "body-outline";
    case "Financial Services":
      return "cash-outline";
    case "Tax Services":
      return "document-outline";
    default:
      return "help-outline";
  }
};

const CategoryList = ({
  userCategoriesData,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedServiceTypeName,
  setSelectedServiceTypeName,
}) => {
  const scrollViewRef = useRef();
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  const uniqueCategories = Array.from(
    new Set(userCategoriesData?.map((item) => item.categoryName))
  )
    .map((categoryName) => {
      const item = userCategoriesData.find(
        (item) => item.categoryName === categoryName
      );
      return {
        id: item.key.categoryId,
        name: item.categoryName,
        iconName: getIconName(item.categoryName),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const uniqueSubcategories = Array.from(
    new Set(
      userCategoriesData
        ?.filter((item) => item.categoryName === selectedCategory)
        .map((item) => item.subcategoryName)
    )
  )
    .map((subcategoryName) => {
      const item = userCategoriesData.find(
        (item) => item.subcategoryName === subcategoryName
      );
      return {
        id: item.key.subcategoryId,
        name: item.subcategoryName,
        iconName: getIconName(item.subcategoryName),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const uniqueServiceNames = Array.from(
    new Set(
      userCategoriesData
        ?.filter((item) => item.subcategoryName === selectedSubcategory)
        .map((item) => item.serviceTypeName)
    )
  )
    .map((serviceTypeName) => {
      const item = userCategoriesData.find(
        (item) => item.serviceTypeName === serviceTypeName
      );
      return {
        id: item.key.serviceTypeId,
        name: item.serviceTypeName,
        iconName: getIconName(item.serviceTypeName),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const adjustScrollViewPosition = (name, list) => {
    const selectedIndex = list.findIndex((item) => item.name === name);
    const itemWidth = 160;
    const halfOfScrollView = scrollViewWidth / 2;
    const halfOfItem = itemWidth / 2;
    const position = selectedIndex * itemWidth - halfOfScrollView + halfOfItem;
    scrollViewRef.current?.scrollTo({ x: position, animated: true });
  };

  useEffect(() => {
    adjustScrollViewPosition(selectedSubcategory, uniqueSubcategories);
  }, [selectedSubcategory, scrollViewWidth]);

  useEffect(() => {
    adjustScrollViewPosition(selectedServiceTypeName, uniqueServiceNames);
  }, [selectedServiceTypeName, scrollViewWidth]);

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory("");
    setSelectedServiceTypeName("");
  };

  const handleSubcategoryPress = (subcategoryName) => {
    setSelectedSubcategory(subcategoryName);
    setSelectedServiceTypeName("");
  };

  return (
    <View>
      <View style={styles.categories}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          onLayout={(event) =>
            setScrollViewWidth(event.nativeEvent.layout.width)
          }
        >
          {uniqueCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category.name)}
            >
              <View style={styles.categoryImageContainer}>
                <Ionicons
                  name={category.iconName}
                  size={30}
                  color={
                    selectedCategory === category.name
                      ? theme3.secondaryColor
                      : theme3.primaryColor
                  }
                />
              </View>
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === category.name
                    ? styles.selectedCategoryText
                    : null,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {selectedCategory && (
        <View style={styles.subcategories}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onLayout={(event) =>
              setScrollViewWidth(event.nativeEvent.layout.width)
            }
          >
            {uniqueSubcategories.map((subcategory) => (
              <TouchableOpacity
                key={subcategory.id}
                style={styles.subcategoryItem}
                onPress={() => handleSubcategoryPress(subcategory.name)}
              >
                <View style={styles.subcategoryImageContainer}>
                  <Ionicons
                    name={subcategory.iconName}
                    size={30}
                    color={
                      selectedSubcategory === subcategory.name
                        ? theme3.secondaryColor
                        : theme3.primaryColor
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.subcategoryName,
                    selectedSubcategory === subcategory.name
                      ? styles.selectedSubcategoryText
                      : null,
                  ]}
                >
                  {subcategory.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {selectedSubcategory && (
        <View style={styles.services}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onLayout={(event) =>
              setScrollViewWidth(event.nativeEvent.layout.width)
            }
          >
            {uniqueServiceNames.map((serviceTypeName) => (
              <TouchableOpacity
                key={serviceTypeName.id}
                style={styles.serviceItem}
                onPress={() => setSelectedServiceTypeName(serviceTypeName.name)}
              >
                <View style={styles.serviceImageContainer}>
                  <Ionicons
                    name={serviceTypeName.iconName}
                    size={30}
                    color={
                      selectedServiceTypeName === serviceTypeName.name
                        ? theme3.secondaryColor
                        : theme3.primaryColor
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.serviceName,
                    selectedServiceTypeName === serviceTypeName.name
                      ? styles.selectedServiceNameText
                      : null,
                  ]}
                >
                  {serviceTypeName.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
    color: "#084887",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: theme3.secondaryColor,
    fontWeight: "700",
  },
  subcategories: {
    padding: 10,
    paddingTop: 0,
  },
  subcategoryItem: {
    alignItems: "center",
    marginRight: 15,
  },
  subcategoryImageContainer: {
    padding: 0,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    opacity: 0.8,
  },
  subcategoryName: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
    color: "#084887",
    textAlign: "center",
  },
  selectedSubcategoryText: {
    color: theme3.secondaryColor,
    fontWeight: "700",
  },
  services: {
    padding: 10,
    paddingTop: 0,
  },
  serviceItem: {
    alignItems: "center",
    marginRight: 15,
  },
  serviceImageContainer: {
    padding: 0,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    opacity: 0.8,
  },
  serviceName: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
    color: "#084887",
    textAlign: "center",
  },
  selectedServiceNameText: {
    color: theme3.secondaryColor,
    fontWeight: "700",
  },
});

export default CategoryList;
