import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
import CategoryModal from "./CaterogryModal";
import { getIconName } from "./IconsData";
import { updateUserPreference, getStoredUser } from "../api/ApiCall";

const CategoryList = ({
  userCategoriesData,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedServiceTypeName,
  setSelectedServiceTypeName,
  language,
  translations,
  location, // Assuming location data is passed down as a prop
  date, // Assuming date data is passed down as a prop
  radius, // Assuming radius data is passed down as a prop
}) => {
  const scrollViewRef = useRef();
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [showCatModal, setCatModal] = useState(false); // Initially set to false
  const [showSubCat, setShowSubCat] = useState(true);
  const [showService, setSHowService] = useState(true);

  const getDisplayName = (item, type) => {
    switch (type) {
      case "category":
        return language === "es" ? item.categoryNameEs : item.categoryName;
      case "subcategory":
        return language === "es"
          ? item.subcategoryNameEs
          : item.subcategoryName;
      case "serviceType":
        return language === "es"
          ? item.serviceTypeNameEs
          : item.serviceTypeName;
      default:
        return "Unknown";
    }
  };
  const uniqueCategories = Array.from(
    new Set(userCategoriesData?.map((item) => item.categoryName))
  )
    .map((categoryName) => {
      const item = userCategoriesData.find(
        (item) => item.categoryName === categoryName
      );
      return {
        id: item.key?.categoryId || "unknown",
        name: item.categoryName || "Unknown Category",
        nameEs: item.categoryNameEs || item.categoryName || "Unknown Category",
        displayName: getDisplayName(item, "category"),
        iconName: getIconName(item.categoryName),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const uniqueSubcategories = selectedCategory
    ? Array.from(
        new Set(
          userCategoriesData
            ?.filter((item) => item.categoryName === selectedCategory.name)
            .map((item) => item.subcategoryName)
        )
      )
        .map((subcategoryName) => {
          const item = userCategoriesData.find(
            (item) => item.subcategoryName === subcategoryName
          );
          return {
            id: item.key?.subcategoryId || "unknown",
            name: item.subcategoryName || "Unknown Subcategory",
            nameEs:
              item.subcategoryNameEs ||
              item.subcategoryName ||
              "Unknown Subcategory",
            displayName: getDisplayName(item, "subcategory"),
            iconName: getIconName(item.subcategoryName),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const uniqueServiceNames = selectedSubcategory
    ? Array.from(
        new Set(
          userCategoriesData
            ?.filter(
              (item) =>
                item.subcategoryName === selectedSubcategory.name &&
                item.categoryName === selectedCategory.name
            )
            .map((item) => item.serviceTypeName)
        )
      )
        .map((serviceTypeName) => {
          const item = userCategoriesData.find(
            (item) => item.serviceTypeName === serviceTypeName
          );
          return {
            id: item.key?.serviceTypeId || "unknown",
            name: item.serviceTypeName || "Unknown Service",
            nameEs:
              item.serviceTypeNameEs ||
              item.serviceTypeName ||
              "Unknown Service",
            displayName: getDisplayName(item, "serviceType"),
            iconName: getIconName(item.serviceTypeName),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const adjustScrollViewPosition = (name, list) => {
    const selectedIndex = list.findIndex((item) => item.name === name);
    const itemWidth = 160;
    const halfOfScrollView = scrollViewWidth / 2;
    const halfOfItem = itemWidth / 2;
    const position = selectedIndex * itemWidth - halfOfScrollView + halfOfItem;
    scrollViewRef.current?.scrollTo({ x: position, animated: true });
  };

  useEffect(() => {
    adjustScrollViewPosition(selectedSubcategory?.name, uniqueSubcategories);
  }, [selectedSubcategory, scrollViewWidth]);

  useEffect(() => {
    adjustScrollViewPosition(selectedServiceTypeName?.name, uniqueServiceNames);
  }, [selectedServiceTypeName, scrollViewWidth]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category); // Store the entire category object
    setSelectedSubcategory(null); // Clear subcategory selection
    setSelectedServiceTypeName(null);
    setCatModal(false);
    setShowSubCat(true);
  };

  const handleSubcategoryPress = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowSubCat(false);
    setSelectedServiceTypeName("");
    setSHowService(true);
  };

  const handleServiceTypePress = (serviceType) => {
    setSHowService(false);
    setSelectedServiceTypeName(serviceType);
  };

  return (
    <View>
      <View style={styles.categories}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => setCatModal(true)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              style={{
                color: theme3.secondaryColor,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {selectedCategory
                ? selectedCategory.displayName
                : translations.selectCategory}
            </Text>
            {!selectedSubcategory ? (
              <FontAwesome
                name="exchange"
                size={14}
                color={theme3.secondaryColor}
                style={{ paddingLeft: 5 }}
              />
            ) : (
              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                color={theme3.secondaryColor}
              />
            )}
          </TouchableOpacity>
          {selectedSubcategory && (
            <TouchableOpacity
              onPress={() => setShowSubCat((P) => !P)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 5,
              }}
            >
              <Text
                style={{
                  color: theme3.secondaryColor,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {selectedSubcategory.displayName}
              </Text>

              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                color={theme3.secondaryColor}
              />
            </TouchableOpacity>
          )}
          {selectedServiceTypeName && (
            <TouchableOpacity
              onPress={() => setSHowService((P) => !P)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{
                  color: theme3.secondaryColor,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {selectedServiceTypeName
                  ? selectedServiceTypeName.displayName
                  : translations.selectService}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          onLayout={(event) =>
            setScrollViewWidth(event.nativeEvent.layout.width)
          }
        >
          {uniqueCategories.length > 0 && (
            <CategoryModal
              uniqueCategories={uniqueCategories}
              handleCategoryPress={handleCategoryPress}
              selectedCategory={selectedCategory?.name}
              showCatModal={showCatModal}
              onClose={() => setCatModal(false)}
              language={language}
            />
          )}
        </ScrollView>
      </View>
      {selectedCategory && showSubCat && (
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
                onPress={() => handleSubcategoryPress(subcategory)}
              >
                <View style={styles.subcategoryImageContainer}>
                  <Ionicons
                    name={subcategory.iconName}
                    size={30}
                    color={
                      selectedSubcategory?.name === subcategory.name
                        ? theme3.secondaryColor
                        : theme3.primaryColor
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.subcategoryName,
                    selectedSubcategory?.name === subcategory.name
                      ? styles.selectedSubcategoryText
                      : null,
                  ]}
                >
                  {subcategory.displayName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {selectedSubcategory && showService && (
        <View style={styles.services}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onLayout={(event) =>
              setScrollViewWidth(event.nativeEvent.layout.width)
            }
          >
            {uniqueServiceNames.map((serviceType) => (
              <TouchableOpacity
                key={serviceType.id}
                style={styles.serviceItem}
                onPress={() => handleServiceTypePress(serviceType)}
              >
                <View style={styles.serviceImageContainer}>
                  <Ionicons
                    name={serviceType.iconName}
                    size={30}
                    color={
                      selectedServiceTypeName?.id === serviceType.id
                        ? theme3.secondaryColor
                        : theme3.primaryColor
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.serviceName,
                    selectedServiceTypeName?.id === serviceType.id
                      ? styles.selectedServiceNameText
                      : null,
                  ]}
                >
                  {serviceType.displayName}
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
