import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { theme3 } from "../assets/branding/themes";
import CategoryModal from "./CaterogryModal";
import { getIconName } from "./IconsData";
import { fetchUserCategories, fetchCategories } from "../api/ApiCall";

const CategoryList = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedServiceTypeName,
  setSelectedServiceTypeName,
  language,
  translations,
}) => {
  const scrollViewRef = useRef();
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [showCatModal, setCatModal] = useState(false);
  const [showSubCat, setShowSubCat] = useState(true);
  const [showService, setShowService] = useState(true);
  const [userCategoriesData, setUserCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const userCategoriesData = await fetchUserCategories();
      if (Array.isArray(userCategoriesData) && userCategoriesData.length > 0) {
        setUserCategoriesData(userCategoriesData);
      } else {
        const categoriesData = await fetchCategories();
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setUserCategoriesData(categoriesData);
        } else {
          console.error("No valid category data fetched");
          setUserCategoriesData([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories", error.message);
    } finally {
      setIsLoading(false);
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
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedServiceTypeName(null);
    setCatModal(false);
    setShowSubCat(true);
  };

  const handleSubcategoryPress = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowSubCat(false);
    setSelectedServiceTypeName(null);
    setShowService(true);
  };

  const handleServiceTypePress = (serviceType) => {
    setShowService(false);
    setSelectedServiceTypeName(serviceType);
  };

  const handleSelectCategoryPress = () => {
    if (userCategoriesData.length === 0) {
      loadCategories();
    }
    setCatModal(true);
  };

  return (
    <View>
      <View style={styles.categories}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleSelectCategoryPress}
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
              onPress={() => setShowSubCat((p) => !p)}
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
              onPress={() => setShowService((p) => !p)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{
                  color: theme3.secondaryColor,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {selectedServiceTypeName.displayName}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showCatModal && (
        <CategoryModal
          uniqueCategories={uniqueCategories}
          handleCategoryPress={handleCategoryPress}
          selectedCategory={selectedCategory?.name}
          showCatModal={showCatModal}
          onClose={() => setCatModal(false)}
          language={language}
          isLoading={isLoading}
        />
      )}

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
