import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator, // <-- Import ActivityIndicator
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
  fetchBusinessesByCategory,
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
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from "../assets/Animated/Loader.json";
import InLineLoader from "./GlobalComponents/InLineLoader";
const LandingScreen = ({ route }) => {
  const animation = useRef(null);
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Pets");
  const [fetchedBusinesses, setFetchedBusinesses] = useState([]);
  const [radius, setRadius] = useState(5);
  const [radiusInMeters, setRadiusInMeters] = useState(radius * 1609.34);
  const [isLoading, setIsLoading] = useState(false); // <-- New state for loading
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
    // Check if fetchedBusinesses is not null and contains data
    if (!fetchedBusinesses || fetchedBusinesses.length === 0) {
      console.log("No businesses fetched yet, or they have no badges.");
      return [];
    }

    // Check if any of the fetched businesses have badges
    if (
      !fetchedBusinesses.some(
        (business) =>
          business.yelpBusiness.badges &&
          business.yelpBusiness.badges.length > 0
      )
    ) {
      console.log("No badges found in the fetched businesses.");
      return [];
    }

    // Flatten the array of badge arrays from all businesses into a single array of badges
    const allBadges = fetchedBusinesses.flatMap((business) =>
      business.yelpBusiness.badges ? business.yelpBusiness.badges : []
    );

    console.log("All badges:", allBadges);

    // Use Set to filter out duplicates
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
  };

  useEffect(() => {
    updateLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchCategoriesData = async () => {
        setIsLoading(true);
        try {
          // Attempt to fetch user-specific categories first
          const userCategoriesData = await fetchUserCategories();

          if (
            isActive &&
            Array.isArray(userCategoriesData) &&
            userCategoriesData.length > 0
          ) {
            // If the response is a non-empty array, update the state
            setUserCategories(userCategoriesData);
          } else {
            // If the first attempt fails, fallback to fetching a general set of categories
            const categoriesData = await fetchCategories(); // Ensure this method is defined and fetches a general set of categories
            console.log("Fallback to general categoriesData", categoriesData);

            // Update state with the fallback data if it's an array and not empty
            if (
              isActive &&
              Array.isArray(categoriesData) &&
              categoriesData.length > 0
            ) {
              setUserCategories(categoriesData);
            } else {
              // Handle case where neither endpoint returns valid, non-empty data
              console.error("No valid category data fetched");
              setUserCategories([]); // Optionally reset to empty array or handle as needed
            }
          }
        } catch (error) {
          console.error("Failed to fetch categories", error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchCategoriesData();

      return () => {
        isActive = false; // Cleanup function to set isActive to false when the component unmounts or loses focus
      };
    }, [])
  );

  const fetchData = async () => {
    if (
      selectedLocation !== "" &&
      locationData.coordinates.latitude !== undefined &&
      locationData.coordinates.longitude !== undefined &&
      locationData.zipcode !== ""
    ) {
      setLoader(true);
      try {
        const businesses = await fetchBusinessesByCategory(
          selectedCategory,
          selectedLocation,
          locationData.coordinates.latitude,
          locationData.coordinates.longitude,
          locationData.zipcode,
          selectedDate,
          radiusInMeters
        );
        setAllBusinesses(businesses); // Store all fetched businesses
        setFetchedBusinesses(businesses); // Also set them as the currently displayed businesses
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
    console.log("Fetching data for date:", selectedDate); // Debugging
    fetchData();
  }, [
    selectedCategory,
    selectedLocation,
    locationData,
    selectedDate,
    radiusInMeters,
  ]);

  const applyFilters = () => {
    if (selectedFilters.length > 0) {
      const filteredBusinesses = allBusinesses.filter(
        (business) =>
          business.yelpBusiness.badges &&
          business.yelpBusiness.badges.some((badge) =>
            selectedFilters.includes(badge)
          )
      );
      setFetchedBusinesses(filteredBusinesses);
    } else {
      setFetchedBusinesses(allBusinesses); // Step 3: Reset to show all businesses when no filters are selected
    }
  };
  useEffect(() => {
    // Call applyFilters whenever selectedFilters changes
    applyFilters();
  }, [selectedFilters]); // Dependency array ensures this runs only when selectedFilters changes

  const handleDateSelect = (date) => {
    const newDate = date.toISOString().split("T")[0];
    console.log("New date selected:", newDate); // Debugging
    setSelectedDate(newDate);
  };

  const handleOpenFilterModal = () => {
    const uniqueBadges = prepareBadgeFilters(); // Call the function to get unique badges
    setUniqueBadgeFilters(uniqueBadges); // Set the unique badges to state
    setShowFilterModal(true); // Open the modal
  };
  function onHideDateModal() {
    setShowDateModal((p) => !p);
  }

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      {loader === 3 ? (
        // Display the spinner when loading
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        // Display the main content when not loading
        // MY INTERNET IS NO
        <>
          <Header user={user} />
          <SearchComponent
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setLocationData={setLocationData}
            handleLoader={handleLoader}
          />
          {/* <ScrollView contentContainerStyle={{alignItems:'center'}}
nestedScrollEnabled={true}
> */}
          <View
            style={{ backgroundColor: "white", width: "100%", marginTop: 0 }}
          >
            {userCategories && userCategories.length > 0 && (
              <CategoryList
                userCategoriesData={userCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
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


{
  loader === true ? (
<InLineLoader />
  ):
  (
    
      fetchedBusinesses.length > 0 ? (

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

      ):(
        <NoDataFound />
      )
  
    
 
  )
}

          {/* {fetchedBusinesses.length < 1 ? (
            loader === true ? (
              
            ) : (
              <NoDataFound />
            )
          ) : (
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
          )} */}
          {/* </ScrollView> */}

          {/* <BottomMenu user={user} /> */}
        </>
      )}
      <FilterModal
        show={showFilterModal}
        onHideModal={hideModal}
        badgeCodes={uniqueBadgeFilters}
        selectedFilters={selectedFilters} // Ensure this is always an array
        setSelectedFilters={setSelectedFilters}
      />
      <DateFilterModal
        show={showDateModal}
        HideModal={onHideDateModal}
        onDateSelected={handleDateSelect} // Pass the handler as a prop
      />
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
