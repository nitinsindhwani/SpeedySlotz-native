import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { theme3 } from "../assets/branding/themes";
import Header from "./GlobalComponents/Header";
import {
  fetchCategories,
  fetchUserCategories,
  updateUserPreference,
  getStoredUser,
  deleteUserCategory,
  deleteUserCategoriesBatch,
} from "../api/ApiCall";
import { LanguageContext } from "../api/LanguageContext";
const transformData = (flatData) => {
  const categoriesMap = {};

  flatData.forEach(
    ({
      categoryName,
      categoryNameEs,
      key: { categoryId, subcategoryId, serviceTypeId },
      serviceTypeName,
      serviceTypeNameEs,
      subcategoryName,
      subcategoryNameEs,
    }) => {
      if (!categoriesMap[categoryName]) {
        categoriesMap[categoryName] = {
          categoryId,
          categoryName,
          categoryNameEs,
          subcategories: {},
        };
      }

      if (!categoriesMap[categoryName].subcategories[subcategoryName]) {
        categoriesMap[categoryName].subcategories[subcategoryName] = {
          subcategoryId,
          subcategoryName,
          subcategoryNameEs,
          services: [],
        };
      }

      categoriesMap[categoryName].subcategories[subcategoryName].services.push({
        serviceTypeId,
        serviceTypeName,
        serviceTypeNameEs,
        categoryId,
        subcategoryId,
      });
    }
  );

  return Object.values(categoriesMap).map((category) => ({
    ...category,
    subcategories: Object.values(category.subcategories),
  }));
};

const fetchCategoriesData = async () => {
  try {
    const allCategories = await fetchCategories();
    return transformData(allCategories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

const PreferredCategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [userData, setUserData] = useState(null);
  const languageContext = useContext(LanguageContext);


  // Check if context is available
  if (!languageContext) {
   
    return <Text>Loading...</Text>;
  }

  const { language, translations } = languageContext;
  useEffect(() => {
    const loadData = async () => {
      const storedUser = await getStoredUser();
      setUserData(storedUser);

      const allCategoriesData = await fetchCategoriesData();
      const userCategoriesData = await fetchUserCategories();
      const transformedUserCategories = transformData(userCategoriesData);

      setCategories(allCategoriesData);

      const toggledCategoryNames = new Set();
      const toggledSubcategoryNames = new Set();
      const toggledServiceTypeIds = new Set();

      transformedUserCategories.forEach((category) => {
        toggledCategoryNames.add(category.categoryName);
        category.subcategories.forEach((subcategory) => {
          toggledSubcategoryNames.add(subcategory.subcategoryName);
          subcategory.services.forEach((service) => {
            toggledServiceTypeIds.add(service.serviceTypeId);
          });
        });
      });

      const initialToggleStates = {};
      allCategoriesData.forEach((category) => {
        const categoryToggle = toggledCategoryNames.has(category.categoryName);
        initialToggleStates[`category-${category.categoryId}`] = categoryToggle;

        category.subcategories.forEach((subcategory) => {
          const subcategoryToggle = toggledSubcategoryNames.has(
            subcategory.subcategoryName
          );
          initialToggleStates[`subcategory-${subcategory.subcategoryId}`] =
            subcategoryToggle;

          subcategory.services.forEach((service) => {
            const serviceToggle = toggledServiceTypeIds.has(
              service.serviceTypeId
            );
            initialToggleStates[`service-${service.serviceTypeId}`] =
              serviceToggle;
          });
        });
      });

      setToggleStates(initialToggleStates);
    };

    loadData();
  }, []);

  const toggleItem = async (itemId, isOn, details) => {
    if (!userData) {
      console.error("User data not available");
      return;
    }

    setToggleStates((prevState) => ({ ...prevState, [itemId]: isOn }));

    const commonData = {
      userId: userData.user_id,
      categoryId: details.categoryId,
      categoryName: details.categoryName,
      categoryNameEs: details.categoryNameEs,
      subcategoryId: details.subcategoryId,
      subcategoryName: details.subcategoryName,
      subcategoryNameEs: details.subcategoryNameEs,
      serviceTypeId: details.serviceTypeId,
      serviceTypeName: details.serviceTypeName,
      serviceTypeNameEs: details.serviceTypeNameEs,
    };

    if (!isOn) {
      if (details.type === "category" || details.type === "subcategory") {
        let servicesToDelete = [];
        if (details.type === "category") {
          details.subcategories.forEach((subcategory) => {
            setToggleStates((prevState) => ({
              ...prevState,
              [`subcategory-${subcategory.subcategoryId}`]: false,
            }));
            subcategory.services.forEach((service) => {
              if (toggleStates[`service-${service.serviceTypeId}`]) {
                servicesToDelete.push({
                  ...commonData,
                  subcategoryId: subcategory.subcategoryId,
                  subcategoryName: subcategory.subcategoryName,
                  subcategoryNameEs: subcategory.subcategoryNameEs,
                  serviceTypeId: service.serviceTypeId,
                  serviceTypeName: service.serviceTypeName,
                  serviceTypeNameEs: service.serviceTypeNameEs,
                });
                setToggleStates((prevState) => ({
                  ...prevState,
                  [`service-${service.serviceTypeId}`]: false,
                }));
              }
            });
          });
        } else if (details.type === "subcategory") {
          details.services.forEach((service) => {
            if (toggleStates[`service-${service.serviceTypeId}`]) {
              servicesToDelete.push({
                ...commonData,
                serviceTypeId: service.serviceTypeId,
                serviceTypeName: service.serviceTypeName,
                serviceTypeNameEs: service.serviceTypeNameEs,
              });
              setToggleStates((prevState) => ({
                ...prevState,
                [`service-${service.serviceTypeId}`]: false,
              }));
            }
          });
        }
        if (servicesToDelete.length > 0) {
          await deleteUserCategoriesBatch(servicesToDelete);
        }
      } else if (details.type === "service") {
        await deleteUserCategory(commonData);
      }
    } else if (isOn && details.type === "service") {
      await updateUserPreference(commonData);
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
      case "service":
        return language === "es"
          ? item.serviceTypeNameEs
          : item.serviceTypeName;
      default:
        return "Unknown";
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header title={language === "es" ? "Categorías" : "Categories"} />
        <ScrollView>
          {categories.map((category) => (
            <View key={category.categoryId} style={styles.cardWrapper}>
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>
                  {getDisplayName(category, "category")}
                </Text>
                <Switch
                  onValueChange={(newValue) =>
                    toggleItem(`category-${category.categoryId}`, newValue, {
                      type: "category",
                      ...category,
                    })
                  }
                  value={toggleStates[`category-${category.categoryId}`]}
                />
              </View>
              {toggleStates[`category-${category.categoryId}`] &&
                category.subcategories.map((subcategory) => (
                  <View
                    key={subcategory.subcategoryId}
                    style={styles.subcategoryWrapper}
                  >
                    <View style={styles.subcategoryHeader}>
                      <Text style={styles.subcategoryText}>
                        {getDisplayName(subcategory, "subcategory")}
                      </Text>
                      <Switch
                        onValueChange={(newValue) =>
                          toggleItem(
                            `subcategory-${subcategory.subcategoryId}`,
                            newValue,
                            {
                              type: "subcategory",
                              ...subcategory,
                              categoryId: category.categoryId,
                              categoryName: category.categoryName,
                              categoryNameEs: category.categoryNameEs,
                            }
                          )
                        }
                        value={
                          toggleStates[
                            `subcategory-${subcategory.subcategoryId}`
                          ]
                        }
                      />
                    </View>
                    {toggleStates[`subcategory-${subcategory.subcategoryId}`] &&
                      subcategory.services.map((service) => (
                        <View
                          key={service.serviceTypeId}
                          style={styles.serviceWrapper}
                        >
                          <Text style={styles.serviceText}>
                            {getDisplayName(service, "service")}
                          </Text>
                          <Switch
                            onValueChange={(newValue) =>
                              toggleItem(
                                `service-${service.serviceTypeId}`,
                                newValue,
                                {
                                  type: "service",
                                  ...service,
                                  categoryId: category.categoryId,
                                  categoryName: category.categoryName,
                                  categoryNameEs: category.categoryNameEs,
                                  subcategoryId: subcategory.subcategoryId,
                                  subcategoryName: subcategory.subcategoryName,
                                  subcategoryNameEs:
                                    subcategory.subcategoryNameEs,
                                }
                              )
                            }
                            value={
                              toggleStates[`service-${service.serviceTypeId}`]
                            }
                          />
                        </View>
                      ))}
                  </View>
                ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#f0f0f0",
  },
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme3.fontColor,
  },
  subcategoryWrapper: {
    paddingLeft: 20,
    marginTop: 10,
  },
  subcategoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subcategoryText: {
    fontSize: 16,
    color: theme3.fontColor,
  },
  serviceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    marginVertical: 5,
  },
  serviceText: {
    fontSize: 14,
    color: theme3.fontColor,
  },
});

export default PreferredCategoriesScreen;
