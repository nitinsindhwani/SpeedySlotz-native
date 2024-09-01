import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import BottomMenu from "../components/BottomMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { LanguageContext } from "../api/LanguageContext";
import {
  getLocationAndCityState,
  fetchBusinessesByServiceName,
  fetchUserCategories,
  fetchCategories,
} from "../api/ApiCall";
import RadiusSlider from "../components/RadiusSlider";
import { getBadgeDetails } from "../components/BadgeInfo";
import SearchComponent from "../components/SearchComponent";
import { theme3 } from "../assets/branding/themes";
import FilterModal from "./Filters/FiltersModal";
import DateFilterModal from "./Filters/DateFilterModal";
import PopularBusinessList from "../components/PopularBusinesList";
import NoDataFound from "./GlobalComponents/NoDataFound";
import InLineLoader from "./GlobalComponents/InLineLoader";
import LoadingModal from "./GlobalComponents/LoadingModal";
import yelp from "../assets/images/yelp_logo.png";

const LandingScreen = ({ route }) => {
  const animation = useRef(null);
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Initialize as null to check if a category is selected
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedServiceTypeName, setSelectedServiceTypeName] = useState("");
  const [fetchedBusinesses, setFetchedBusinesses] = useState([]);
  const [radius, setRadius] = useState(5);
  const [radiusInMeters, setRadiusInMeters] = useState(radius * 1609.34);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [ExpandCat, setExpandCat] = useState(false);
  const [loader, setLoader] = useState(false);
  const [locationData, setLocationData] = useState({
    coordinates: { latitude: undefined, longitude: undefined },
    zipcode: "",
  });
  const [userCategories, setUserCategories] = useState([]);
  const { translations, language } = useContext(LanguageContext);
  const [uniqueBadgeFilters, setUniqueBadgeFilters] = useState([]);
  const { user } = route.params;
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const hideModal = () => {
    setShowFilterModal(false);
  };

  const prepareBadgeFilters = () => {
    if (!fetchedBusinesses || fetchedBusinesses.length === 0) {
      return [];
    }

    const allBadges = fetchedBusinesses.flatMap((business) => {
      const badges = business.yelpBusiness.badges
        ? business.yelpBusiness.badges
        : [];
      if (
        business.yelpBusinessSettings &&
        business.yelpBusinessSettings.allowEmergencyRequest
      ) {
        badges.push("emergencyService");
      }
      return badges;
    });

    const uniqueBadges = Array.from(new Set(allBadges));

    return uniqueBadges;
  };

  const handleLoader = (value) => {
    setLoader(value);
  };

  useEffect(() => {
    setRadiusInMeters(radius * 1609.34);
  }, [radius]);

  const updateLocation = async () => {
    try {
      const locationDetails = await getLocationAndCityState();

      if (locationDetails.errorMsg) {
        return;
      }

      setSelectedLocation(locationDetails.cityState);
      setLocationData({
        coordinates: {
          latitude: locationDetails?.location?.coords.latitude,
          longitude: locationDetails?.location?.coords.longitude,
        },
        zipcode: locationDetails?.zipcode,
      });
    } catch (error) {
      console.error("Error updating location:", error.message);
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchCategoriesData = async () => {
        try {
          const userCategoriesData = await fetchUserCategories();

          if (
            isActive &&
            Array.isArray(userCategoriesData) &&
            userCategoriesData.length > 0
          ) {
            setUserCategories(userCategoriesData);
          } else {
            const categoriesData = await fetchCategories();

            if (
              isActive &&
              Array.isArray(categoriesData) &&
              categoriesData.length > 0
            ) {
              setUserCategories(categoriesData);
            } else {
              console.error("No valid category data fetched");
              setUserCategories([]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch categories", error.message);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchCategoriesData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const fetchData = async (serviceName) => {
    if (
      selectedLocation !== "" &&
      locationData.coordinates.latitude !== undefined &&
      locationData.coordinates.longitude !== undefined &&
      locationData.zipcode !== ""
    ) {
      setLoader(true);
      try {
        const businesses = await fetchBusinessesByServiceName(
          serviceName,
          selectedLocation,
          locationData.coordinates.latitude,
          locationData.coordinates.longitude,
          locationData.zipcode,
          selectedDate,
          radiusInMeters
        );

        setAllBusinesses(businesses);
        setFetchedBusinesses(businesses);
      } catch (error) {
        console.log("Error fetching businesses:", error.message);
      } finally {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (selectedServiceTypeName) {
      fetchData(selectedServiceTypeName);
    }
  }, [
    selectedServiceTypeName,
    selectedLocation,
    locationData,
    selectedDate,
    radiusInMeters,
  ]);

  const applyFilters = () => {
    if (selectedFilters.length > 0) {
      const filteredBusinesses = allBusinesses.filter((business) => {
        const badges = business.yelpBusiness.badges || [];
        if (
          business.yelpBusinessSettings &&
          business.yelpBusinessSettings.allowEmergencyRequest
        ) {
          badges.push("emergencyService");
        }
        return selectedFilters.every((filter) => badges.includes(filter));
      });
      setFetchedBusinesses(filteredBusinesses);
    } else {
      setFetchedBusinesses(allBusinesses);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [selectedFilters]);

  const handleDateSelect = (date) => {
    const newDate = date.toISOString().split("T")[0];
    setSelectedDate(newDate);
  };

  const handleOpenFilterModal = () => {
    const uniqueBadges = prepareBadgeFilters();
    setUniqueBadgeFilters(uniqueBadges);
    setShowFilterModal(true);
  };

  function onHideDateModal() {
    setShowDateModal((p) => !p);
  }

  return (
    <View style={styles.container}>
      <Header user={user} />
      <View style={styles.content}>
        <SearchComponent
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setLocationData={setLocationData}
          handleLoader={handleLoader}
        />
        <View style={styles.categoryContainer}>
          {userCategories && userCategories.length > 0 && (
            <CategoryList
              userCategoriesData={userCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedServiceTypeName={selectedServiceTypeName}
              setSelectedServiceTypeName={setSelectedServiceTypeName}
              rows={3}
              language={language}
              translations={translations}
            />
          )}
          {ExpandCat === true && (
            <>
              <RadiusSlider radius={radius} setRadius={setRadius} />
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  onPress={() => handleOpenFilterModal()}
                  style={styles.filterButton}
                >
                  <MaterialCommunityIcons
                    name="filter-variant"
                    size={24}
                    color={theme3.secondaryColor}
                  />
                  <Text style={styles.filterText}>Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDateModal(true)}
                  style={styles.filterButton}
                >
                  <MaterialCommunityIcons
                    name="filter-variant"
                    size={24}
                    color={theme3.secondaryColor}
                  />
                  <Text style={styles.filterText}>Date Filter</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setExpandCat(!ExpandCat)}
          >
            <Entypo
              name={ExpandCat ? "chevron-thin-up" : "chevron-thin-down"}
              size={17}
              color={theme3.primaryColor}
            />
          </TouchableOpacity>
        </View>

        {loader === true ? (
          <InLineLoader />
        ) : fetchedBusinesses.length > 0 ? (
          <FlatList
            nestedScrollEnabled={true}
            data={fetchedBusinesses}
            keyExtractor={(item) => item.yelpBusiness.id.toString()}
            ListHeaderComponent={() => <></>}
            ListFooterComponent={() => (
              <PopularBusinessList
                fetchedBusinesses={fetchedBusinesses}
                navigation={navigation}
              />
            )}
          />
        ) : (
          selectedCategory && <NoDataFound />
        )}
      </View>

      <FilterModal
        show={showFilterModal}
        onHideModal={hideModal}
        badgeCodes={uniqueBadgeFilters}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <DateFilterModal
        show={showDateModal}
        HideModal={onHideDateModal}
        onDateSelected={handleDateSelect}
      />
      <LoadingModal show={isLoading} />
      <Image source={yelp} style={styles.yelpLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  content: {
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: "white",
    width: "100%",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme3.secondaryColor,
    marginLeft: 5,
  },
  expandButton: {
    width: 100,
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  yelpLogo: {
    width: 60,
    height: 22,
    position: "absolute",
    bottom: 10,
    right: 15,
  },
});

export default LandingScreen;
