import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
import { fetchUserCategories, fetchCategories } from "../api/ApiCall";
import { LanguageContext } from "../api/LanguageContext";
import Header from "../components/Header";
import { getIconName } from "../components/IconsData";
import SelectionModal from "./Modals/SelectionModal";
import LoadingModal from "./GlobalComponents/LoadingModal";

const InitialCategorySelectionScreen = ({ navigation, onComplete }) => {
  const [userCategoriesData, setUserCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { translations, language } = useContext(LanguageContext);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

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
    .map((categoryName, index) => {
      const item = userCategoriesData.find(
        (item) => item.categoryName === categoryName
      );
      return {
        id: item.key?.categoryId || `category-${index}`,
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

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedServiceType(null);

    const filteredSubcategories = userCategoriesData
      .filter((item) => item.categoryName === category.name)
      .map((item, index) => ({
        id: item.key?.subcategoryId || `subcategory-${index}`,
        name: item.subcategoryName,
        nameEs: item.subcategoryNameEs,
        displayName: getDisplayName(item, "subcategory"),
        iconName: getIconName(item.subcategoryName),
      }));

    setSubcategories(filteredSubcategories);
    setShowSubcategoryModal(true);
  };

  const handleSubcategoryPress = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowSubcategoryModal(false);
    setShowServiceTypeModal(true);
  };

  const handleServiceTypePress = (serviceType) => {
    setSelectedServiceType(serviceType);
    setShowServiceTypeModal(false);
    // You can choose to navigate or perform other actions here if needed
  };

  const handleContinue = () => {
    onComplete(); // Mark category selection as done
    navigation.navigate("Welcome"); // Navigate to Welcome screen
  };

  const CategoryItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => onPress(item)}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.iconName} size={30} color={theme3.primaryColor} />
      </View>
      <Text style={styles.categoryText} numberOfLines={2}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.instructionText}>
          Please select a category to get started:
        </Text>
        <FlatList
          data={uniqueCategories}
          renderItem={({ item }) => (
            <CategoryItem item={item} onPress={handleCategoryPress} />
          )}
          keyExtractor={(item) => `category-${item.id}`}
          numColumns={3}
          columnWrapperStyle={styles.categoriesColumnWrapper}
        />
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <SelectionModal
        visible={showSubcategoryModal}
        onClose={() => setShowSubcategoryModal(false)}
        items={uniqueSubcategories}
        onSelect={handleSubcategoryPress}
        title="Select Subcategory"
      />
      <SelectionModal
        visible={showServiceTypeModal}
        onClose={() => setShowServiceTypeModal(false)}
        items={uniqueServiceNames}
        onSelect={handleServiceTypePress}
        title="Select Service"
        showBackButton={true}
        onBack={() => {
          setShowServiceTypeModal(false);
          setShowSubcategoryModal(true);
        }}
      />
      <LoadingModal show={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme3.backgroundColor,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginBottom: 20,
    textAlign: "center",
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    width: (Dimensions.get("window").width - 64) / 3, // 3 columns with spacing
    margin: 2,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  categoriesColumnWrapper: {
    justifyContent: "space-between",
  },
  continueButton: {
    backgroundColor: theme3.primaryColor,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default InitialCategorySelectionScreen;
