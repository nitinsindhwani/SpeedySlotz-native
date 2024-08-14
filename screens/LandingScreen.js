import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import BottomMenu from "../components/BottomMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

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
import RemarkModal from "./Modals/FeedbackModal";

const LandingScreen = ({ route }) => {
  const animation = useRef(null);
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Pets");
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
      console.log("No businesses fetched yet, or they have no badges.");
      return [];
    }
    console.log("fetchedBusinesses", fetchedBusinesses);

    if (
      !fetchedBusinesses.some(
        (business) =>
          (business.yelpBusiness.badges &&
            business.yelpBusiness.badges.length > 0) ||
          (business.yelpBusinessSettings &&
            business.yelpBusinessSettings.allowEmergencyRequest)
      )
    ) {
      console.log(
        "No badges or emergency services found in the fetched businesses."
      );
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

    console.log("All badges:", allBadges);

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
        console.log(`Error getting location: ${locationDetails.errorMsg}`);
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
        // setIsLoading(true);
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
          serviceName, // Updated to use serviceName directly
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
      console.log("Fetching data for service:", selectedServiceTypeName);
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
    console.log("New date selected:", newDate);
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
    <View style={{ flex: 1, flexDirection: "column" }}>
      {loader === 3 ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <Header user={user} />
          <SearchComponent
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setLocationData={setLocationData}
            handleLoader={handleLoader}
          />
          <View
            style={{ backgroundColor: "white", width: "100%", marginTop: 0 }}
          >
            {userCategories && userCategories.length > 0 && (
              <CategoryList
                userCategoriesData={userCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
                selectedServiceTypeName={selectedServiceTypeName}
                setSelectedServiceTypeName={setSelectedServiceTypeName}
                rows={3} // Ensure CategoryList is updated to handle 3 rows
              />
            )}
            {ExpandCat === true && (
              <>
                <RadiusSlider radius={radius} setRadius={setRadius} />

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleOpenFilterModal()}
                    style={{
                      flexDirection: "row",
                      marginTop: -15,
                      margin: 10,
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="filter-variant"
                      size={24}
                      color={theme3.secondaryColor}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        color: theme3.secondaryColor,
                      }}
                    >
                      Filters
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowDateModal(true)}
                    style={{
                      flexDirection: "row",
                      marginTop: -15,
                      margin: 10,
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="filter-variant"
                      size={24}
                      color={theme3.secondaryColor}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        color: theme3.secondaryColor,
                      }}
                    >
                      Date Filter
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {ExpandCat === false ? (
              <TouchableOpacity
                style={{ width: 100, alignSelf: "center" }}
                onPress={() => setExpandCat(true)}
              >
                <Entypo
                  style={{ alignSelf: "center" }}
                  name="chevron-thin-down"
                  size={17}
                  color={theme3.primaryColor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ width: 100, alignSelf: "center" }}
                onPress={() => setExpandCat(false)}
              >
                <Entypo
                  style={{ alignSelf: "center" }}
                  name="chevron-thin-up"
                  size={17}
                  color={theme3.primaryColor}
                />
              </TouchableOpacity>
            )}
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
            <NoDataFound />
          )}
        </>
      )}
    
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  yelpLogoContainer: {
    position: "absolute",
    top: 20, // Changed this
    right: 20, // Changed this
    zIndex: 2,
    padding: 5, // Added this to make it touch-friendly
    borderRadius: 20, // Added this for a rounded touch area
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Added a light background for visibility
  },
  yelpLogo: {
    width: 60,
    height: 22,
    position: "absolute",
    bottom: 10,
    right: 15, // Moved to the right
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
  },
  iconContainer: {
    padding: 5,
  },
  suggestionText: {
    fontSize: 16,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  clearIconContainer: {
    padding: 5,
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
  },
  searchbar: {
    description: {
      fontWeight: "bold",
    },
    predefinedPlacesDescription: {
      color: "#1faadb",
    },
    textInputContainer: {
      backgroundColor: "rgba(0,0,0,0)",
      top: 50,
      width: "100%",
      borderWidth: 0,
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 38,
      color: "#5d5d5d",
      fontSize: 16,
      borderWidth: 0,
    },
    listView: {
      backgroundColor: "rgba(192,192,192,0.9)",
      top: 23,
    },
  },
});

export default LandingScreen;
