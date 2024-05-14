import React, { useState, useEffect } from "react";
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

const transformData = (flatData) => {
  const categoriesMap = {};

  flatData.forEach(
    ({
      categoryName,
      key: { categoryId, subcategoryId, serviceTypeId },
      serviceTypeName,
      subcategoryName,
    }) => {
      if (!categoriesMap[categoryName]) {
        categoriesMap[categoryName] = {
          categoryId,
          categoryName,
          subcategories: {},
        };
      }

      if (!categoriesMap[categoryName].subcategories[subcategoryName]) {
        categoriesMap[categoryName].subcategories[subcategoryName] = {
          subcategoryId,
          subcategoryName,
          services: [],
        };
      }

      // Ensure categoryId and subcategoryId are included for each service
      categoriesMap[categoryName].subcategories[subcategoryName].services.push({
        serviceTypeId,
        serviceTypeName,
        categoryId, // Include categoryId
        subcategoryId, // Include subcategoryId
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
    const allCategories = await fetchCategories(); // Fetch all available categories

    const transformedAllCategories = transformData(allCategories);

    // Transform the determined dataset
    return transformedAllCategories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return []; // Return an empty array in case of any error
  }
};

const PreferredCategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [toggleStates, setToggleStates] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const allCategoriesData = await fetchCategoriesData();
      const userCategoriesData = await fetchUserCategories();
      const transformedUserCategories = transformData(userCategoriesData);

      setCategories(allCategoriesData);

      // Sets to track toggled names
      const toggledCategoryNames = new Set();
      const toggledSubcategoryNames = new Set();
      const toggledServiceTypeIds = new Set();

      // Populate the sets based on user preferences
      transformedUserCategories.forEach((category) => {
        toggledCategoryNames.add(category.categoryName);
        category.subcategories.forEach((subcategory) => {
          toggledSubcategoryNames.add(subcategory.subcategoryName);
          subcategory.services.forEach((service) => {
            // Now also tracking serviceTypeId for toggling
            toggledServiceTypeIds.add(service.serviceTypeId);
          });
        });
      });

      // Initialize toggle states based on these sets
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
            // Service toggle is based on its specific presence in the user's preferences
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
    const userData = await getStoredUser(); // Simulate retrieving stored user data.

    // Update the state for the current item.
    setToggleStates((prevState) => ({ ...prevState, [itemId]: isOn }));

    if (
      !isOn &&
      (details.type === "category" || details.type === "subcategory")
    ) {
      // If a category or subcategory is turned off, gather all active services for batch deletion.
      let servicesToDelete = [];

      if (details.type === "category") {
        // Turn off all subcategories and their services.
        details.subcategories.forEach((subcategory) => {
          setToggleStates((prevState) => ({
            ...prevState,
            [`subcategory-${subcategory.subcategoryId}`]: false,
          }));
          subcategory.services.forEach((service) => {
            if (toggleStates[`service-${service.serviceTypeId}`]) {
              servicesToDelete.push({
                userId: userData.user_id,
                categoryId: service.categoryId, // Correct category ID for each service.
                subcategoryId: service.subcategoryId,
                serviceTypeId: service.serviceTypeId,
                categoryName: service.categoryName,
                serviceTypeName: service.serviceTypeName,
                subcategoryName: service.subcategoryName,
              });
              setToggleStates((prevState) => ({
                ...prevState,
                [`service-${service.serviceTypeId}`]: false,
              }));
            }
          });
        });
      } else if (details.type === "subcategory") {
        // Turn off all services under the subcategory.
        details.services.forEach((service) => {
          if (toggleStates[`service-${service.serviceTypeId}`]) {
            servicesToDelete.push({
              userId: userData.user_id,
              categoryId: service.categoryId, // Correct category ID for each service.
              subcategoryId: service.subcategoryId,
              serviceTypeId: service.serviceTypeId,
              categoryName: service.categoryName,
              serviceTypeName: service.serviceTypeName,
              subcategoryName: service.subcategoryName,
            });
            setToggleStates((prevState) => ({
              ...prevState,
              [`service-${service.serviceTypeId}`]: false,
            }));
          }
        });
      }

      // Perform batch deletion if there are services to delete.
      if (servicesToDelete.length > 0) {
        await deleteUserCategoriesBatch(servicesToDelete);
      }
    } else if (!isOn && details.type === "service") {
      // If a single service is turned off, delete it directly.
      const serviceToDelete = {
        userId: userData.user_id,
        categoryId: details.categoryId, // Ensure this references exist and are correctly passed
        subcategoryId: details.subcategoryId,
        serviceTypeId: details.serviceTypeId,
        categoryName: details.categoryName,
        serviceTypeName: details.serviceTypeName,
        subcategoryName: details.subcategoryName,
      };
      await deleteUserCategory(serviceToDelete);
    } else if (isOn && details.type === "service") {
      // If a single service is turned on, enable it.
      const serviceToEnable = {
        userId: userData.user_id,
        categoryId: details.categoryId,
        subcategoryId: details.subcategoryId,
        serviceTypeId: details.serviceTypeId,
        categoryName: details.categoryName,
        serviceTypeName: details.serviceTypeName,
        subcategoryName: details.subcategoryName,
      };
      await updateUserPreference(serviceToEnable);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header title="Categories" />
        <ScrollView>
          {categories.map((category) => (
            <View key={category.categoryId} style={styles.cardWrapper}>
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>{category.categoryName}</Text>
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
                        {subcategory.subcategoryName}
                      </Text>
                      <Switch
                        onValueChange={(newValue) =>
                          toggleItem(
                            `subcategory-${subcategory.subcategoryId}`,
                            newValue,
                            {
                              type: "subcategory",
                              ...subcategory,
                              categoryName: category.categoryName,
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
                            {service.serviceTypeName}
                          </Text>
                          <Switch
                            onValueChange={(newValue) =>
                              toggleItem(
                                `service-${service.serviceTypeId}`,
                                newValue,
                                {
                                  type: "service",
                                  ...service,
                                  categoryName: category.categoryName,
                                  subcategoryName: subcategory.subcategoryName,
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
    </SafeAreaView>
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
