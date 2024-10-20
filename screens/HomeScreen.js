import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
import { Animated } from "react-native";
import {
  fetchUserCategories,
  fetchCategories,
  getLocationAndCityState,
  fetchHomeScreenData,
} from "../api/ApiCall";
import { LanguageContext } from "../api/LanguageContext";
import Header from "../components/Header";
import HomeSearchComponent from "../components/HomeSearchComponent";
import { getIconName } from "../components/IconsData";
import SelectionModal from "./Modals/SelectionModal";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LoadingModal from "./GlobalComponents/LoadingModal";

const windowWidth = Dimensions.get("window").width;

const SectionTitle = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const AlertsBanner = ({ alerts }) => {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex((prevIndex) => (prevIndex + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [alerts]);

  return (
    <LinearGradient
      colors={["#ff9800", "#f44336"]}
      style={styles.notificationBanner}
    >
      <Text style={styles.notificationText}>
        {alerts[currentAlertIndex].message}
      </Text>
    </LinearGradient>
  );
};

const DealItem = ({ deal, yelpBusinesses }) => {
  const navigation = useNavigation();
  const business = yelpBusinesses?.find(
    (business) => business?.yelpBusiness?.id === deal.business_id
  );

  return (
    <View style={styles.dealCard}>
      <Image
        source={
          deal.images && deal.images.length > 0
            ? { uri: deal.images[0] }
            : require("../assets/images/deal1.png")
        }
        style={styles.dealImage}
      />
      <View style={styles.imageOverlay} />
      <View style={styles.dealBadge}>
        <Text style={styles.dealBadgeText}>{deal.percentageOff}% OFF</Text>
      </View>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <View style={styles.dealContent}>
          <Text style={styles.businessName} numberOfLines={1}>
            {deal.businessName}
          </Text>
          <Text style={styles.dealTitle} numberOfLines={2}>
            {deal.title}
          </Text>
          <TouchableOpacity
            style={styles.viewDealButton}
            onPress={() =>
              navigation.navigate("DetailScreen", {
                business: business,
              })
            }
          >
            <Text style={styles.viewDealButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};
const CustomCarousel = ({ data, renderItem, yelpBusinesses, navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < data.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, data.length]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: currentIndex * windowWidth,
      animated: true,
    });
  }, [currentIndex]);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / windowWidth
          );
          setCurrentIndex(newIndex);
        }}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.carouselItemContainer}>
            {renderItem({ item, yelpBusinesses, navigation })}
          </View>
        ))}
      </ScrollView>
      <View style={styles.paginationDots}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.5 }]}
          />
        ))}
      </View>
    </View>
  );
};

const NewContentItem = ({ item, yelpBusinesses, navigation }) => {
  if (!item) return null;

  // Ensure yelpBusinesses is an array
  const businesses = Array.isArray(yelpBusinesses) ? yelpBusinesses : [];

  // Find the matching Yelp business
  const business =
    (item.type === "business" || item.type === "local_business") &&
    businesses.length > 0
      ? businesses.find((business) => business?.yelpBusiness?.id === item.id)
      : null;

  const handleExplore = () => {
    if (business) {
      navigation.navigate("DetailScreen", {
        business: business,
      });
    } else {
      console.log("No matching business found for:", item.id);
    }
  };

  const handleLearnMore = () => {
    if (item.id === "newFeature001") {
      navigation.navigate("LandingScreen");
    } else if (item.id === "feature002") {
      navigation.navigate("ReferScreen");
    } else {
      // Default navigation for other features
      navigation.navigate("LandingScreen", {
        business: business,
      });
    }
  };

  // Function to get the appropriate image source
  const getImageSource = () => {
    if (item.type === "feature") {
      if (item.id === "newFeature001") {
        return require("../assets/images/whatsNew1.png");
      } else if (item.id === "feature002") {
        return require("../assets/images/whatsNew4.png");
      }
    }

    // For business or local_business types
    if (business && business.yelpBusiness && business.yelpBusiness.image_url) {
      const imageUrl = getFirstAvailableImage(business.yelpBusiness.image_url);
      return imageUrl
        ? { uri: imageUrl }
        : require("../assets/images/whatsNew2.png");
    }

    // Default image for other cases
    return require("../assets/images/whatsNew2.png");
  };

  // Function to extract the first available image URL (unchanged)
  const getFirstAvailableImage = (imageUrlObj) => {
    if (!imageUrlObj) return null;
    if (typeof imageUrlObj === "string") return imageUrlObj;
    if (imageUrlObj.Main) return imageUrlObj.Main;
    const firstImageKey = Object.keys(imageUrlObj)[0];
    return imageUrlObj[firstImageKey];
  };

  return (
    <ImageBackground source={getImageSource()} style={styles.carouselItem}>
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
        style={styles.carouselOverlay}
      >
        <View style={styles.carouselContent}>
          <Text style={styles.carouselTitle}>{item.name || "New Item"}</Text>
          <Text style={styles.carouselDescription}>
            {item.description || "No description available"}
          </Text>
          {item.type === "business" || item.type === "local_business" ? (
            <TouchableOpacity
              style={styles.carouselButton}
              onPress={handleExplore}
            >
              <Text style={styles.carouselButtonText}>Explore</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.carouselButton}
              onPress={handleLearnMore}
            >
              <Text style={styles.carouselButtonText}>Learn More</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};
const CategoryItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={() => onPress(item)}>
    <View style={styles.categoryIconContainer}>
      <Ionicons
        name={item.iconName || getIconName(item.name)}
        size={30}
        color={theme3.primaryColor}
      />
    </View>
    <Text style={styles.categoryText} numberOfLines={2}>
      {item.displayName || item.name}
    </Text>
  </TouchableOpacity>
);

const HomeScreen = ({ route }) => {
  const [categories, setCategories] = useState([]);
  const [homeScreenData, setHomeScreenData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationData, setLocationData] = useState({
    coordinates: { latitude: undefined, longitude: undefined },
    zipcode: "",
  });
  const [loader, setLoader] = useState(false);
  const [userCategoriesData, setUserCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { translations, language } = useContext(LanguageContext);
  const { user } = route.params;
  const navigation = useNavigation();

  const renderCarouselItem = ({ item }) => {
    return (
      <NewContentItem
        item={item}
        yelpBusinesses={homeScreenData?.yelpResponse?.businesses || []}
        navigation={navigation}
      />
    );
  };
  useEffect(() => {
    getCurrentLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Fetch the categories when the screen is focused
      loadCategories();
    }, [])
  );

  useEffect(() => {
    if (
      locationData.coordinates.latitude &&
      locationData.coordinates.longitude
    ) {
      fetchHomeData();
    }
  }, [locationData]);

  const getCurrentLocation = async () => {
    try {
      setLoader(true);
      const { cityState, location, zipcode } = await getLocationAndCityState();
      const latitude = location?.coords?.latitude;
      const longitude = location?.coords?.longitude;
      setSelectedLocation(cityState);
      setLocationData({ coordinates: { latitude, longitude }, zipcode });
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLoader(false);
    }
  };

  const fetchHomeData = async () => {
    try {
      // setLoading(true);
      setError(null);
      const radiusInMeters = 10 * 1609.34; // 10 miles to meters
      const formattedDate = new Date().toISOString().split("T")[0];
      const data = await fetchHomeScreenData(
        selectedLocation,
        locationData.coordinates.latitude,
        locationData.coordinates.longitude,
        locationData.zipcode,
        formattedDate,
        radiusInMeters
      );

      // Ensure yelpResponse.businesses is always an array
      const processedData = {
        ...data,
        yelpResponse: {
          ...data.yelpResponse,
          businesses: Array.isArray(data.yelpResponse?.businesses)
            ? data.yelpResponse.businesses
            : [],
        },
      };

      setHomeScreenData(processedData);
    } catch (error) {
      console.error("Error fetching home screen data:", error);
      setError("Failed to fetch home screen data. Please try again.");
      setHomeScreenData({
        alerts: [],
        deals: [],
        newContent: [],
        trendingCategories: [],
        yelpResponse: { businesses: [] },
      });
    } finally {
      // setLoading(false);
    }
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
    setLoader(true);
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
      setLoader(false);
    }
  };
  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(userCategoriesData?.map((item) => item.categoryName))
    )
      .map((categoryName, index) => {
        const item = userCategoriesData.find(
          (item) => item.categoryName === categoryName
        );
        return {
          id: item.key?.categoryId || `category-${index}`,
          name: item.categoryName || "Unknown Category",
          nameEs:
            item.categoryNameEs || item.categoryName || "Unknown Category",
          displayName: getDisplayName(item, "category"),
          iconName: getIconName(item.categoryName),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [userCategoriesData]);

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

    // Filter subcategories for the selected category
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
    navigation.jumpTo("LandingScreen", {
      user: route.params.user,
      selectedCategory,
      selectedSubcategory,
      selectedServiceType: serviceType,
      selectedLocation,
      locationData,
    });
  };
  const renderItem = ({ item }) => {
    switch (item.type) {
      case "alerts":
        return (
          homeScreenData?.alerts &&
          homeScreenData.alerts.length > 0 && (
            <AlertsBanner alerts={homeScreenData.alerts} />
          )
        );
      case "newContent":
        return (
          homeScreenData?.newContent &&
          homeScreenData.newContent.length > 0 && (
            <View style={styles.section}>
              <SectionTitle
                icon={
                  <Entypo name="new" size={24} color={theme3.primaryColor} />
                }
                title="What's New"
                count={homeScreenData.newContent.length}
              />
              <CustomCarousel
                data={homeScreenData.newContent}
                renderItem={({ item, yelpBusinesses, navigation }) => (
                  <NewContentItem
                    item={item}
                    yelpBusinesses={yelpBusinesses}
                    navigation={navigation}
                  />
                )}
                yelpBusinesses={homeScreenData?.yelpResponse?.businesses || []}
                navigation={navigation}
              />
            </View>
          )
        );
      case "deals":
        return (
          homeScreenData?.deals &&
          homeScreenData.deals.length > 0 && (
            <View style={styles.section}>
              <SectionTitle
                icon={
                  <MaterialCommunityIcons
                    name="sale"
                    size={24}
                    color={theme3.primaryColor}
                  />
                }
                title={translations.deals}
                count={homeScreenData.deals.length}
              />
              <FlatList
                horizontal
                data={homeScreenData.deals}
                renderItem={({ item }) => (
                  <DealItem
                    deal={item}
                    yelpBusinesses={
                      homeScreenData?.yelpResponse?.businesses || []
                    }
                  />
                )}
                keyExtractor={(item, index) => `deal-${index}`}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )
        );
      case "trendingCategories":
        return (
          homeScreenData?.trendingCategories &&
          homeScreenData.trendingCategories.length > 0 && (
            <View style={styles.section}>
              <SectionTitle
                icon={
                  <FontAwesome5
                    name="fire"
                    size={24}
                    color={theme3.primaryColor}
                  />
                }
                title={translations.mostPopular}
              />
              <FlatList
                horizontal
                data={homeScreenData.trendingCategories.map(
                  (category, index) => ({
                    id: category.id || `trending-${index}`,
                    name: category.categoryName,
                    nameEs: category.categoryNameEs,
                    displayName: getDisplayName(category, "category"),
                    iconName: getIconName(category.categoryName),
                  })
                )}
                renderItem={({ item }) => (
                  <CategoryItem
                    item={item}
                    onPress={() => handleCategoryPress(item)}
                  />
                )}
                keyExtractor={(item) => `trending-${item.id}`}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )
        );

      case "allCategories":
        return (
          <View style={styles.section}>
            <SectionTitle
              icon={
                <Ionicons
                  name="grid-outline"
                  size={24}
                  color={theme3.primaryColor}
                />
              }
              title={translations.categories}
            />
            <FlatList
              data={uniqueCategories}
              renderItem={({ item }) => (
                <CategoryItem
                  item={item}
                  onPress={() => handleCategoryPress(item)}
                />
              )}
              keyExtractor={(item) => `category-${item.id}`}
              numColumns={3}
              columnWrapperStyle={styles.categoriesColumnWrapper}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const sections = [
    { type: "alerts" },
    { type: "newContent" },
    { type: "deals" },
    { type: "trendingCategories" },
    { type: "allCategories" },
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        {/* Replace text with custom loader */}
        <LoadingModal show={loading} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchHomeData}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header user={user} />
      <HomeSearchComponent
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        setLocationData={setLocationData}
        handleLoader={setLoader}
        onSearch={fetchHomeData}
      />
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + index}
        contentContainerStyle={styles.contentContainer}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme3.backgroundColor,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginLeft: 8,
  },
  sectionCount: {
    fontSize: 16,
    color: theme3.primaryColor,
    marginLeft: 8,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    width: (windowWidth - 48) / 3, // 3 columns with spacing
    margin: 2,
    backgroundColor: "#ffffff",
    borderRadius: 12, // More rounded corners
    padding: 10,
    shadowColor: "#000", // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5, // Softer shadow
    elevation: 5, // Adds shadow for Android
    borderColor: "#e0e0e0", // Subtle border
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
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  categoriesColumnWrapper: {
    justifyContent: "space-between",
  },
  notificationBanner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF", // Adjust as needed
  },
  notificationText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  testimonialSection: {
    marginBottom: 16,
  },
  testimonialCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginRight: 16,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    borderWidth: 1,
    borderColor: "#ddd",
  },
  testimonialText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  testimonialFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testimonialUser: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  dealCard: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Adjust opacity as needed
  },
  dealBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dealBadgeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%", // Increased height for better text visibility
    justifyContent: "flex-end",
  },
  dealContent: {
    padding: 12,
  },
  businessName: {
    fontSize: 18, // Increased font size
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 14,
    color: "#EEE",
    marginBottom: 8,
  },
  viewDealButton: {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  viewDealButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  carouselItem: {
    width: windowWidth - 32, // Adjust this to make it slightly bigger
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 12, // Add horizontal margin to align properly
  },
  carouselOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  carouselImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  carouselContent: {
    padding: 16,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  carouselDescription: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 12,
  },
  carouselButton: {
    backgroundColor: theme3.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  carouselButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    marginHorizontal: 4,
  },
  categorySelection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  selectionButtonText: {
    marginRight: 5,
    color: theme3.fontColor,
  },
  categories: {
    padding: 10,
    marginBottom: 20,
  },
  subcategories: {
    padding: 10,
    paddingTop: 0,
    marginBottom: 20,
  },
  subcategoryItem: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subcategoryImageContainer: {
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light gray background for icons
    marginBottom: 10,
  },
  subcategoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#084887",
    textAlign: "center",
  },
  selectedSubcategoryText: {
    color: theme3.fontColor,
    fontWeight: "700",
  },
  services: {
    padding: 10,
    paddingTop: 0,
  },
  serviceItem: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  serviceImageContainer: {
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light gray background for icons
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#084887",
    textAlign: "center",
  },
  selectedServiceNameText: {
    color: theme3.fontColor,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center", // Center the modal
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%", // Adjust modal width
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    padding: 5,
  },
  closeButton: {
    padding: 5,
  },
  modalColumnWrapper: {
    justifyContent: "space-between",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
