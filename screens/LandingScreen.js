import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { LanguageContext } from "../api/LanguageContext";
import { FontAwesome } from "@expo/vector-icons";
import { PushNotification } from "../api/PushNotification";
import * as SecureStore from "expo-secure-store";
import {
  getLocationAndCityState,
  fetchBusinessesByServiceName,
  updatePushToken,
} from "../api/ApiCall";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import RadiusSlider from "../components/RadiusSlider";
import SearchComponent from "../components/SearchComponent";
import { theme3 } from "../assets/branding/themes";
import FilterModal from "./Filters/FiltersModal";
import DateFilterModal from "./Filters/DateFilterModal";
import PopularBusinessList from "../components/PopularBusinesList";
import NoDataFound from "./GlobalComponents/NoDataFound";
import InLineLoader from "./GlobalComponents/InLineLoader";
import LoadingModal from "./GlobalComponents/LoadingModal";
import yelp from "../assets/images/yelp_logo.png";
import SortModal from "../screens/Filters/SortModal";
import Svg, { Path } from "react-native-svg";

const LandingScreen = ({ route }) => {
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedServiceTypeName, setSelectedServiceTypeName] = useState("");
  const [fetchedBusinesses, setFetchedBusinesses] = useState([]);
  const [radius, setRadius] = useState(5);
  const [radiusInMeters, setRadiusInMeters] = useState(radius * 1609.34);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [expandCat, setExpandCat] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const [locationData, setLocationData] = useState({
    coordinates: { latitude: undefined, longitude: undefined },
    zipcode: "",
  });
  const { translations, language } = useContext(LanguageContext);
  const [uniqueBadgeFilters, setUniqueBadgeFilters] = useState([]);
  const { user } = route.params;
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    updateLocation();
    checkAndUpdatePushToken();
  }, []);

  useEffect(() => {
    setRadiusInMeters(radius * 1609.34);
  }, [radius]);

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

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, allBusinesses]);

  const handleOpenSortModal = () => {
    setShowSortModal(true);
  };

  useEffect(() => {
    if (selectedSort) {
      // Apply sorting logic here
      const sortedBusinesses = [...fetchedBusinesses].sort((a, b) => {
        switch (selectedSort) {
          case "googleRating":
            return b.yelpBusiness.google_rating - a.yelpBusiness.google_rating;
          case "speedySlotzRating":
            return b.yelpBusiness.rating - a.yelpBusiness.rating;
          case "distance":
            return a.yelpBusiness.distance - b.yelpBusiness.distance;
          case "priceLowToHigh":
            return a.yelpBusiness.price_level - b.yelpBusiness.price_level;
          case "priceHighToLow":
            return b.yelpBusiness.price_level - a.yelpBusiness.price_level;
          default:
            return 0;
        }
      });
      setFetchedBusinesses(sortedBusinesses);
    }
  }, [selectedSort]);

  const updateLocation = async () => {
    try {
      const locationDetails = await getLocationAndCityState();
      if (locationDetails.errorMsg) {
        console.error("Error getting location:", locationDetails.errorMsg);
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

  const fetchData = async (serviceName) => {
    if (
      selectedLocation &&
      locationData.coordinates.latitude &&
      locationData.coordinates.longitude &&
      locationData.zipcode
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
        console.error("Error fetching businesses:", error.message);
      } finally {
        setLoader(false);
      }
    }
  };

  const applyFilters = () => {
    if (selectedFilters.length > 0 && allBusinesses.length > 0) {
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

  const handleDateSelect = (date) => {
    const newDate = date.toISOString().split("T")[0];
    setSelectedDate(newDate);
  };
  const checkAndUpdatePushToken = async () => {
    try {
      const currentPushToken = await PushNotification();

      if (!currentPushToken) {
        return;
      }

      const storedPushToken = await SecureStore.getItemAsync(
        "push_notification"
      );

      if (
        !user.push_notification ||
        user.push_notification !== currentPushToken
      ) {
        const encodedPushToken = encodeURIComponent(currentPushToken);

        try {
          const updateResponse = await updatePushToken(
            user.username,
            currentPushToken
          );

          if (updateResponse.status === 200) {
            if (storedPushToken !== currentPushToken) {
              await SecureStore.setItemAsync(
                "push_notification",
                currentPushToken
              );
            }
          } else {
            console.error(
              "Failed to update push token. Status:",
              updateResponse.status
            );
          }
        } catch (updateError) {
          console.error("Error in updatePushToken:", updateError.message);
          if (updateError.response) {
            console.error("Response status:", updateError.response.status);
            console.error("Response data:", updateError.response.data);
          }
        }
      } else {
        console.log("Push token is up to date");
      }
    } catch (error) {
      console.error("Error in checkAndUpdatePushToken:", error.message);
      console.error("Full error object:", JSON.stringify(error, null, 2));
    }
  };
  const handleOpenFilterModal = () => {
    const uniqueBadges = prepareBadgeFilters();
    setUniqueBadgeFilters(uniqueBadges);
    setShowFilterModal(true);
  };

  const prepareBadgeFilters = () => {
    if (!fetchedBusinesses || fetchedBusinesses.length === 0) return [];
    const allBadges = fetchedBusinesses.flatMap((business) => {
      const badges = business.yelpBusiness.badges || [];
      if (
        business.yelpBusinessSettings &&
        business.yelpBusinessSettings.allowEmergencyRequest
      ) {
        badges.push("emergencyService");
      }
      return badges;
    });
    return Array.from(new Set(allBadges));
  };

  const renderContent = () => {
    if (loader) {
      return <InLineLoader />;
    } else if (fetchedBusinesses.length > 0) {
      return (
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
      );
    } else if (selectedCategory) {
      return <NoDataFound />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Header user={user} />
      <View style={styles.content}>
        <SearchComponent
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setLocationData={setLocationData}
          handleLoader={setLoader}
        />
        <View style={styles.categoryContainer}>
          <CategoryList
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedServiceTypeName={selectedServiceTypeName}
            setSelectedServiceTypeName={setSelectedServiceTypeName}
            language={language}
            translations={translations}
          />
          {expandCat && (
            <>
              <RadiusSlider radius={radius} setRadius={setRadius} />
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  onPress={handleOpenFilterModal}
                  style={styles.filterButton}
                >
                  <MaterialCommunityIcons
                    name="filter-variant"
                    size={24}
                    color={theme3.primaryColor}
                  />
                  <Text style={styles.filterText}>{translations.filters}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOpenSortModal}
                  style={styles.filterButton}
                >
                  <MaterialCommunityIcons
                    name="sort"
                    size={24}
                    color={theme3.primaryColor}
                  />
                  <Text style={styles.filterText}>{translations.sort}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDateModal(true)}
                  style={styles.filterButton}
                >
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={24}
                    color={theme3.primaryColor}
                  />
                  <Text style={styles.filterText}>
                    {translations.dateFilter}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setExpandCat(!expandCat)}
          >
            <FontAwesome
              name={expandCat ? "caret-up" : "caret-down"}
              size={24}
              color={theme3.fontColor}
            />
          </TouchableOpacity>
        </View>

        {renderContent()}
      </View>

      <FilterModal
        show={showFilterModal}
        onHideModal={() => setShowFilterModal(false)}
        badgeCodes={uniqueBadgeFilters}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <DateFilterModal
        show={showDateModal}
        HideModal={() => setShowDateModal(false)}
        onDateSelected={handleDateSelect}
      />
      <SortModal
        show={showSortModal}
        onHideModal={() => setShowSortModal(false)}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      />
      <LoadingModal show={isLoading} />
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
    color: theme3.primaryColor,
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
