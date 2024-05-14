import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
  SafeAreaView,
} from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { saveProfiles, fetchProfiles } from "../api/ApiCall";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { useNavigation } from "@react-navigation/native"; // Newly added
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";


import { Platform } from "react-native";

const ManageAccountScreen = ({ route }) => {
  const { user } = route.params;
  const [profile, setProfile] = useState({
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    gender: user.gender || "",
    dateOfBirth: user.dateOfBirth || "",
    // Extend this initial state with other properties as needed
  });
  const [address, setAddress] = useState(user.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth ? new Date(user.dateOfBirth) : new Date()
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isAddressCollapsed, setAddressCollapsed] = useState(true);
  const [isMedicalHistoryCollapsed, setMedicalHistoryCollapsed] =
    useState(true);
  const [isPharmacyCollapsed, setPharmacyCollapsed] = useState(true);
  const [isPetCollapsed, setPetCollapsed] = useState(true);
  const [isDentalHistoryCollapsed, setDentalHistoryCollapsed] = useState(true);
  const [isHomeInfoCollapsed, setHomeInfoCollapsed] = useState(true);
  const [isPetInsuranceCollapsed, setPetInsuranceCollapsed] = useState(true);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [pastMedications, setPastMedications] = useState("");
  const [surgicalHistory, setSurgicalHistory] = useState("");
  const [smokeAlcoholHistory, setSmokeAlcoholHistory] = useState("");
  const [chronicIllnesses, setChronicIllnesses] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [recentHospitalVisits, setRecentHospitalVisits] = useState("");
  const [immunizationHistory, setImmunizationHistory] = useState("");
  const [pregnancyChildbirthHistory, setPregnancyChildbirthHistory] =
    useState("");
  const [otherMedicalInfo, setOtherMedicalInfo] = useState("");

  const [lastDentalVisit, setLastDentalVisit] = useState("");
  const [lastDentalXray, setLastDentalXray] = useState("");
  const [dentalAllergies, setDentalAllergies] = useState("");
  const [dentalComplaints, setDentalComplaints] = useState("");
  const [orthodonticHistory, setOrthodonticHistory] = useState("");
  const [gumDiseaseHistory, setGumDiseaseHistory] = useState("");
  const [toothExtractionHistory, setToothExtractionHistory] = useState("");
  const [dentalMedications, setDentalMedications] = useState("");
  const [otherDentalInfo, setOtherDentalInfo] = useState("");

  // State variables for Home Information
  const [homeType, setHomeType] = useState(user.homeType || ""); // e.g., Apartment, House, Condo
  const [homeSize, setHomeSize] = useState(user.homeSize || ""); // e.g., in square feet or square meters
  const [numberOfRooms, setNumberOfRooms] = useState(user.numberOfRooms || "");
  const [numberOfFloors, setNumberOfFloors] = useState(
    user.numberOfFloors || ""
  );
  const [floorCount, setFloorCount] = useState(user.floorCount || "");
  const [windowCount, setWindowCount] = useState(user.windowCount || "");
  const [yardSize, setYardSize] = useState(user.yardSize || ""); // Useful for mowing and landscaping
  const [lastHvacServiceDate, setLastHvacServiceDate] = useState(
    user.hvacType || ""
  ); // e.g., Central, Window Units
  const [specialInstructions, setSpecialInstructions] = useState(
    user.specialInstructions || ""
  );

  const [homeExterior, setHomeExterior] = useState("");
  const [homeElevation, setHomeElevation] = useState("");
  const [mowingFrequency, setMowingFrequency] = useState("");
  const [lastWindowCleaningDate, setLastWindowCleaningDate] = useState("");
  const [ceilingType, setCeilingType] = useState("");
  const [treeCount, setTreeCount] = useState("");
  const [lightingPreferences, setLightingPreferences] = useState("");

  // Preferred Pharmacy
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [pharmacyPhone, setPharmacyPhone] = useState("");

  // Pet Information
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petSpecialNeeds, setPetSpecialNeeds] = useState("");
  const [petFavorites, setPetFavorites] = useState("");
  const [petAllergies, setPetAllergies] = useState("");
  const [vetDetails, setVetDetails] = useState("");
  const [petMicrochipped, setPetMicrochipped] = useState("");
  const [petBehavior, setPetBehavior] = useState("");

  const [provider, setProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [coverageDetails, setCoverageDetails] = useState("");
  const [contact, setContact] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [exclusions, setExclusions] = useState("");

  const [personalInsuranceCollapsed, setPersonalInsuranceCollapsed] =
    useState(true);
  const [personalInsuranceProvider, setPersonalInsuranceProvider] =
    useState("");
  const [personalPolicyNumber, setPersonalPolicyNumber] = useState("");
  const [personalCoverageDetails, setPersonalCoverageDetails] = useState("");
  const [personalInsuranceContact, setPersonalInsuranceContact] = useState("");
  const [personalClaimDetails, setPersonalClaimDetails] = useState("");
  const [personalInsuranceExclusions, setPersonalInsuranceExclusions] =
    useState("");

  const [dentalInsuranceCollapsed, setDentalInsuranceCollapsed] =
    useState(true);
  const [dentalInsuranceProvider, setDentalInsuranceProvider] = useState("");
  const [dentalPolicyNumber, setDentalPolicyNumber] = useState("");
  const [dentalCoverageDetails, setDentalCoverageDetails] = useState("");
  const [dentalInsuranceContact, setDentalInsuranceContact] = useState("");
  const [dentalClaimDetails, setDentalClaimDetails] = useState("");
  const [dentalInsuranceExclusions, setDentalInsuranceExclusions] =
    useState("");

  const [medicalHistory, setMedicalHistory] = useState(
    user.medicalHistory || ""
  );
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const validate = () => {
    // let newErrors = {};
    // if (!firstName.trim()) newErrors.firstName = "First Name is required";
    // if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    // const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    // if (!email.trim()) newErrors.email = "Email is required";
    // else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    // if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    // else if (isNaN(phoneNumber))
    //   newErrors.phoneNumber = "Phone Number should contain only numbers";
    // if (!address.trim()) newErrors.address = "Address is required";
    // const dobRegex = /^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])-\d{4}$/;
    // if (!dateOfBirth.trim())
    //   newErrors.dateOfBirth = "Date of Birth is required";
    // else if (!dobRegex.test(dateOfBirth))
    //   newErrors.dateOfBirth = "Invalid date format (MM-DD-YYYY)";
    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0; // If no errors, validation passed.
  };

  const onChange = (event, selectedDate) => {
    // Close the picker immediately
    setShowDatePicker(Platform.OS === "ios"); // This line is specifically for iOS, adjust if needed

    // Update the state with the new date, or keep the old if cancelled
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };
  useEffect(() => {
    // Format dateOfBirth to the desired string format before setting it in the profile
    const formattedDate = moment(dateOfBirth).format("YYYY-MM-DD");
    handleInputChange("dateOfBirth", formattedDate);
  }, [dateOfBirth]); // This effect runs every time dateOfBirth changes
  const showMode = () => {
    setShowDatePicker(true);
  };
  const handleInputChange = (name, value) => {
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Manage Profiles",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
        color: "purple",
      },
      headerStyle: {
        backgroundColor: "white",
      },
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await fetchProfiles(); // fetchProfiles needs to be implemented to fetch data from your backend

        // Check and update userProfile information
        if (profileData?.userProfile) {
          setProfile((prevState) => ({
            ...prevState,
            ...profileData.userProfile,
          }));
        }

        // Check and update userAddress
        if (profileData?.userAddress) {
          setStreet(profileData.userAddress.street || "");
          setCity(profileData.userAddress.city || "");
          setState(profileData.userAddress.state || "");
          setZip(profileData.userAddress.zip || "");
        }

        // Check and update userPreferredPharmacy
        if (profileData?.userPreferredPharmacy) {
          setPharmacyName(profileData.userPreferredPharmacy.pharmacyName || "");
          setPharmacyAddress(
            profileData.userPreferredPharmacy.pharmacyAddress || ""
          );
          setPharmacyPhone(
            profileData.userPreferredPharmacy.pharmacyPhone || ""
          );
        }

        // Check and update userMedicalHistory
        if (profileData?.userMedicalHistory) {
          setAllergies(profileData.userMedicalHistory.allergies || "");
          setCurrentMedications(
            profileData.userMedicalHistory.currentMedications || ""
          );
          setPastMedications(
            profileData.userMedicalHistory.pastMedications || ""
          );
          setSurgicalHistory(
            profileData.userMedicalHistory.surgicalHistory || ""
          );
          setSmokeAlcoholHistory(
            profileData.userMedicalHistory.smokeAlcoholHistory || ""
          );
          setChronicIllnesses(
            profileData.userMedicalHistory.chronicIllnesses || ""
          );
          setFamilyMedicalHistory(
            profileData.userMedicalHistory.familyMedicalHistory || ""
          );
          setRecentHospitalVisits(
            profileData.userMedicalHistory.recentHospitalVisits || ""
          );
          setImmunizationHistory(
            profileData.userMedicalHistory.immunizationHistory || ""
          );
          setPregnancyChildbirthHistory(
            profileData.userMedicalHistory.pregnancyChildbirthHistory || ""
          );
          setOtherMedicalInfo(
            profileData.userMedicalHistory.otherMedicalInfo || ""
          );
        }

        // Check and update userDentalInformation
        if (profileData?.userDentalInformation) {
          setLastDentalVisit(
            profileData.userDentalInformation.lastDentalVisit || ""
          );
          setLastDentalXray(
            profileData.userDentalInformation.lastDentalXray || ""
          );
          setDentalAllergies(
            profileData.userDentalInformation.dentalAllergies || ""
          );
          setDentalComplaints(
            profileData.userDentalInformation.dentalComplaints || ""
          );
          setOrthodonticHistory(
            profileData.userDentalInformation.orthodonticHistory || ""
          );
          setGumDiseaseHistory(
            profileData.userDentalInformation.gumDiseaseHistory || ""
          );
          setToothExtractionHistory(
            profileData.userDentalInformation.toothExtractionHistory || ""
          );
          setDentalMedications(
            profileData.userDentalInformation.dentalMedications || ""
          );
          setOtherDentalInfo(
            profileData.userDentalInformation.otherDentalInfo || ""
          );
        }

        // Check and update userPersonalInsurance
        if (profileData?.userPersonalInsurance) {
          setPersonalInsuranceProvider(
            profileData.userPersonalInsurance.provider || ""
          );
          setPersonalPolicyNumber(
            profileData.userPersonalInsurance.policyNumber || ""
          );
          setPersonalCoverageDetails(
            profileData.userPersonalInsurance.coverageDetails || ""
          );
          setPersonalInsuranceContact(
            profileData.userPersonalInsurance.contact || ""
          );
          setPersonalClaimDetails(
            profileData.userPersonalInsurance.claimDetails || ""
          );
          setPersonalInsuranceExclusions(
            profileData.userPersonalInsurance.exclusions || ""
          );
        }

        // Check and update userDentalInsurance
        if (profileData?.userDentalInsurance) {
          setDentalInsuranceProvider(
            profileData.userDentalInsurance.provider || ""
          );
          setDentalPolicyNumber(
            profileData.userDentalInsurance.policyNumber || ""
          );
          setDentalCoverageDetails(
            profileData.userDentalInsurance.coverageDetails || ""
          );
          setDentalInsuranceContact(
            profileData.userDentalInsurance.contact || ""
          );
          setDentalClaimDetails(
            profileData.userDentalInsurance.claimDetails || ""
          );
          setDentalInsuranceExclusions(
            profileData.userDentalInsurance.exclusions || ""
          );
        }

        // Check and update userHomeInformation
        if (profileData?.userHomeInformation) {
          setHomeType(profileData.userHomeInformation.homeType || "");
          setHomeSize(profileData.userHomeInformation.homeSize || "");
          setNumberOfRooms(profileData.userHomeInformation.numberOfRooms || "");
          setNumberOfFloors(
            profileData.userHomeInformation.numberOfFloors || ""
          );
          setFloorCount(profileData.userHomeInformation.floorCount || ""); // This seems to be duplicate with numberOfFloors, adjust as needed
          setWindowCount(profileData.userHomeInformation.windowCount || "");
          setYardSize(profileData.userHomeInformation.yardSize || "");
          setLastHvacServiceDate(
            profileData.userHomeInformation.lastHvacServiceDate || ""
          );
          setSpecialInstructions(
            profileData.userHomeInformation.specialInstructions || ""
          );
          setHomeExterior(profileData.userHomeInformation.homeExterior || "");
          setHomeElevation(profileData.userHomeInformation.homeElevation || "");
          setMowingFrequency(
            profileData.userHomeInformation.mowingFrequency || ""
          );
          setLastWindowCleaningDate(
            profileData.userHomeInformation.lastWindowCleaningDate || ""
          );
          setCeilingType(profileData.userHomeInformation.ceilingType || "");
          setTreeCount(profileData.userHomeInformation.treeCount || "");
          setLightingPreferences(
            profileData.userHomeInformation.lightingPreferences || ""
          );
        }

        // Check and update userPetInformation
        if (profileData?.userPetInformation) {
          setPetName(profileData.userPetInformation.petName || "");
          setPetType(profileData.userPetInformation.petType || "");
          setPetBreed(profileData.userPetInformation.petBreed || "");
          setPetAge(profileData.userPetInformation.petAge || "");
          setPetWeight(profileData.userPetInformation.petWeight || "");
          setPetSpecialNeeds(
            profileData.userPetInformation.petSpecialNeeds || ""
          );
          setPetFavorites(profileData.userPetInformation.petFavorites || "");
          setPetAllergies(profileData.userPetInformation.petAllergies || "");
          setVetDetails(profileData.userPetInformation.vetDetails || "");
          setPetMicrochipped(
            profileData.userPetInformation.petMicrochipped || ""
          );
          setPetBehavior(profileData.userPetInformation.petBehavior || "");
        }

        // Check and update userPetInsurance
        if (profileData?.userPetInsurance) {
          setProvider(profileData.userPetInsurance.provider || "");
          setPolicyNumber(profileData.userPetInsurance.policyNumber || "");
          setCoverageDetails(
            profileData.userPetInsurance.coverageDetails || ""
          );
          setContact(profileData.userPetInsurance.contact || "");
          setClaimDetails(profileData.userPetInsurance.claimDetails || "");
          setExclusions(profileData.userPetInsurance.exclusions || "");
        }
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
        // Optionally, handle error (e.g., show an error message)
      }
    };

    loadData();
  }, []); // The empty dependency array ensures this effect runs only once after the component mounts

  const handleSaveChanges = () => {
    const profileData = {
      userProfile: profile,
      userAddress: {
        street: street,
        city: city,
        state: state,
        zip: zip,
      },
      userPreferredPharmacy: {
        pharmacyName: pharmacyName,
        pharmacyAddress: pharmacyAddress,
        pharmacyPhone: pharmacyPhone,
      },
      userMedicalHistory: {
        allergies: allergies,
        currentMedications: currentMedications,
        pastMedications: pastMedications,
        surgicalHistory: surgicalHistory,
        smokeAlcoholHistory: smokeAlcoholHistory,
        chronicIllnesses: chronicIllnesses,
        familyMedicalHistory: familyMedicalHistory,
        recentHospitalVisits: recentHospitalVisits,
        immunizationHistory: immunizationHistory,
        pregnancyChildbirthHistory: pregnancyChildbirthHistory,
        otherMedicalInfo: otherMedicalInfo,
      },
      userDentalInformation: {
        lastDentalVisit: lastDentalVisit,
        lastDentalXray: lastDentalXray,
        dentalAllergies: dentalAllergies,
        dentalComplaints: dentalComplaints,
        orthodonticHistory: orthodonticHistory,
        gumDiseaseHistory: gumDiseaseHistory,
        toothExtractionHistory: toothExtractionHistory,
        dentalMedications: dentalMedications,
        otherDentalInfo: otherDentalInfo,
      },
      userPersonalInsurance: {
        provider: personalInsuranceProvider,
        policyNumber: personalPolicyNumber,
        coverageDetails: personalCoverageDetails,
        contact: personalInsuranceContact,
        claimDetails: personalClaimDetails,
        exclusions: personalInsuranceExclusions,
      },
      userDentalInsurance: {
        provider: dentalInsuranceProvider,
        policyNumber: dentalPolicyNumber,
        coverageDetails: dentalCoverageDetails,
        contact: dentalInsuranceContact,
        claimDetails: dentalClaimDetails,
        exclusions: dentalInsuranceExclusions,
      },
      userHomeInformation: {
        homeType: homeType,
        homeExterior: homeExterior,
        homeElevation: homeElevation,
        ceilingType: ceilingType,
        homeSize: homeSize,
        numberOfRooms: numberOfRooms,
        numberOfFloors: numberOfFloors,
        lastHvacServiceDate: lastHvacServiceDate,
        mowingFrequency: mowingFrequency,
        lastWindowCleaningDate: lastWindowCleaningDate,
        treeCount: treeCount,
        lightingPreferences: lightingPreferences,
      },
      userPetInformation: {
        petName: petName,
        petType: petType,
        petBreed: petBreed,
        petAge: petAge,
        petWeight: petWeight,
        petSpecialNeeds: petSpecialNeeds,
        petFavorites: petFavorites,
        petAllergies: petAllergies,
        vetDetails: vetDetails,
        petMicrochipped: petMicrochipped,
        petBehavior: petBehavior,
      },
      userPetInsurance: {
        provider: provider,
        policyNumber: policyNumber,
        coverageDetails: coverageDetails,
        contact: contact,
        claimDetails: claimDetails,
        exclusions: exclusions,
      },
    };
    const response = saveProfiles(profileData);
    console.log("Response in ManageAccount", response);
    // if (validate()) {
    //   alert("Changes saved successfully!");
    // } else {
    //   alert("Please fix the errors before saving.");
    // }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.scrollContainer}>
        <Header title={"Manage Profiles"} />
        <View style={styles.container}>
          <Text style={styles.heading}>Manage Account</Text>

          {/* First Name */}
          <View style={styles.iconInputContainer}>
            <FontAwesome5 name="user" size={20} color={theme3.fontColor} />
            <TextInput
              style={[styles.input, errors.firstName && styles.errorInput]}
              placeholder="First Name"
              value={profile.firstName}
              onChangeText={(value) => handleInputChange("firstName", value)}
            />
          </View>
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}

          {/* Last Name */}
          <View style={styles.iconInputContainer}>
            <FontAwesome5 name="user" size={20} color={theme3.fontColor} />
            <TextInput
              style={[styles.input, errors.lastName && styles.errorInput]}
              placeholder="Last Name"
              value={profile.lastName}
              onChangeText={(value) => handleInputChange("lastName", value)}
            />
          </View>
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}

          {/* Email */}
          <View style={styles.iconInputContainer}>
            <FontAwesome5 name="envelope" size={20} color={theme3.fontColor} />
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="Email"
              value={profile.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Phone Number */}
          <View style={styles.iconInputContainer}>
            <FontAwesome5 name="phone" size={20} color={theme3.fontColor} />
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.errorInput]}
              placeholder="Phone Number"
              value={profile.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
            />
          </View>
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          {/* Gender */}
          <View style={styles.iconInputContainer}>
            <FontAwesome name="intersex" size={20} color={theme3.fontColor} />
            <TextInput
              style={styles.input}
              placeholder="Gender (e.g., Male, Female, Other)"
              value={profile.gender}
              onChangeText={(value) => handleInputChange("gender", value)}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.iconInputContainer}>
            <FontAwesome5
              name="birthday-cake"
              size={20}
              color={theme3.fontColor}
            />
            <View style={styles.datePickerContainer}>
              <Text
              style={{marginLeft:10,alignSelf:'center'}}
              onPress={showMode}
              >
                Select Date
              </Text>
              {/* <Button onPress={showMode} title="Select Date" /> */}
              <Text style={styles.dateText}>
                {moment(dateOfBirth).format("MM-DD-YYYY")}
              </Text>
            </View>
            
            {showDatePicker && (
              <View style={{fontSize:10,alignSelf:'flex-start'}}>
              <DateTimePicker
              
                testID="dateTimePicker"
                value={dateOfBirth}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
                </View>

            )}
          </View>
          {errors.dateOfBirth && (
            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
          )}
          <TouchableOpacity
            onPress={() => setAddressCollapsed(!isAddressCollapsed)}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>Address</Text>
              <Icon
                name={
                  isAddressCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={isAddressCollapsed}>
            {/* Street */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="road" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Street"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            {/* City */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="building"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* State */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="flag" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={state}
                onChangeText={setState}
              />
            </View>

            {/* Zipcode */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="map-pin" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Zipcode"
                value={zip}
                onChangeText={setZip}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            onPress={() => setPharmacyCollapsed(!isPharmacyCollapsed)}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>Preferred Pharmacy</Text>
              <Icon
                name={
                  isPharmacyCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={isPharmacyCollapsed}>
            {/* Pharmacy Name */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="plus-square"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Pharmacy Name"
                value={pharmacyName}
                onChangeText={setPharmacyName}
              />
            </View>

            {/* Pharmacy Address */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="home" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Pharmacy Address"
                value={pharmacyAddress}
                onChangeText={setPharmacyAddress}
              />
            </View>
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="home" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Pharmacy Phone"
                value={pharmacyPhone}
                onChangeText={setPharmacyPhone}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            onPress={() =>
              setMedicalHistoryCollapsed(!isMedicalHistoryCollapsed)
            }
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>Medical History</Text>
              <Icon
                name={
                  isMedicalHistoryCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>

          <Collapsible collapsed={isMedicalHistoryCollapsed}>
            {/* Known Allergies */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="allergies"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Known Allergies (e.g., medication, food)"
                value={allergies}
                onChangeText={setAllergies}
              />
            </View>

            {/* Current Medications */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="pills" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Current Medications"
                value={currentMedications}
                onChangeText={setCurrentMedications}
              />
            </View>

            {/* Past Medications */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="history" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Past Medications"
                value={pastMedications}
                onChangeText={setPastMedications}
              />
            </View>

            {/* Previous Surgeries and Dates */}
            <View style={styles.iconInputContainer}>
              <FontAwesome name="scissors" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Previous Surgeries and Dates"
                value={surgicalHistory}
                onChangeText={setSurgicalHistory}
              />
            </View>

            {/* Smoke or Alcohol Consumption */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="wine-bottle"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Do you smoke or consume alcohol? Frequency?"
                value={smokeAlcoholHistory}
                onChangeText={setSmokeAlcoholHistory}
              />
            </View>

            {/* Chronic Illnesses */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="heartbeat"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Diagnosed Chronic Illnesses (e.g., Diabetes, Hypertension)"
                value={chronicIllnesses}
                onChangeText={setChronicIllnesses}
              />
            </View>

            {/* Family History of Illnesses */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="users" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Family History of Illnesses (e.g., Heart Disease, Cancer)"
                value={familyMedicalHistory}
                onChangeText={setFamilyMedicalHistory}
              />
            </View>

            {/* Recent Hospital Visits */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="hospital"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Recent Hospitalizations or Emergency Visits"
                value={recentHospitalVisits}
                onChangeText={setRecentHospitalVisits}
              />
            </View>

            {/* Immunization History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="syringe" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Immunization History"
                value={immunizationHistory}
                onChangeText={setImmunizationHistory}
              />
            </View>

            {/* Pregnancy and Childbirth History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="baby" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Women: Pregnancy and Childbirth History"
                value={pregnancyChildbirthHistory}
                onChangeText={setPregnancyChildbirthHistory}
              />
            </View>

            {/* Other Relevant Medical Information */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="info-circle"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Any other relevant medical information?"
                value={otherMedicalInfo}
                onChangeText={setOtherMedicalInfo}
                multiline
                numberOfLines={4}
              />
            </View>
          </Collapsible>
          <TouchableOpacity
            onPress={() => setDentalHistoryCollapsed(!isDentalHistoryCollapsed)}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>Dental History</Text>
              <Icon
                name={
                  isDentalHistoryCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={isDentalHistoryCollapsed}>
            {/* Last Dental Visit */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="calendar-check"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Dental Visit"
                value={lastDentalVisit}
                onChangeText={setLastDentalVisit}
              />
            </View>

            {/* Last Dental Xray */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="x-ray" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Last Dental X-ray"
                value={lastDentalXray}
                onChangeText={setLastDentalXray}
              />
            </View>

            {/* Dental Allergies */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="allergies"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Dental Allergies"
                value={dentalAllergies}
                onChangeText={setDentalAllergies}
              />
            </View>

            {/* Dental Complaints */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tooth" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Dental Complaints"
                value={dentalComplaints}
                onChangeText={setDentalComplaints}
              />
            </View>

            {/* Orthodontic History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="smile-beam"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Orthodontic History"
                value={orthodonticHistory}
                onChangeText={setOrthodonticHistory}
              />
            </View>

            {/* Gum Disease History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="sad-tear"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Gum Disease History"
                value={gumDiseaseHistory}
                onChangeText={setGumDiseaseHistory}
              />
            </View>

            {/* Tooth Extraction History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tooth" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Tooth Extraction History"
                value={toothExtractionHistory}
                onChangeText={setToothExtractionHistory}
              />
            </View>

            {/* Dental Medications */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="pills" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Dental Medications"
                value={dentalMedications}
                onChangeText={setDentalMedications}
              />
            </View>

            {/* Other Dental Information */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="info-circle"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Other Dental Information"
                value={otherDentalInfo}
                onChangeText={setOtherDentalInfo}
                multiline
                numberOfLines={4}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            onPress={() =>
              setPersonalInsuranceCollapsed(!personalInsuranceCollapsed)
            }
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>
                Personal Insurance Information
              </Text>
              <Icon
                name={
                  personalInsuranceCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={personalInsuranceCollapsed}>
            {/* Insurance Provider Name */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="building"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Insurance Provider Name"
                value={personalInsuranceProvider}
                onChangeText={setPersonalInsuranceProvider}
              />
            </View>

            {/* Policy Number */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="file-alt"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Policy Number"
                value={personalPolicyNumber}
                onChangeText={setPersonalPolicyNumber}
              />
            </View>

            {/* Coverage Details */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="shield-alt"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Coverage Details"
                value={personalCoverageDetails}
                onChangeText={setPersonalCoverageDetails}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Insurance Contact Number */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="phone" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Insurance Contact Number"
                value={personalInsuranceContact}
                onChangeText={setPersonalInsuranceContact}
              />
            </View>

            {/* Claim Process Details */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="clipboard-list"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Claim Process Details"
                value={personalClaimDetails}
                onChangeText={setPersonalClaimDetails}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Exclusions or Limitations */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="times-circle"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Any Exclusions or Limitations?"
                value={personalInsuranceExclusions}
                onChangeText={setPersonalInsuranceExclusions}
                multiline
                numberOfLines={4}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            onPress={() =>
              setDentalInsuranceCollapsed(!dentalInsuranceCollapsed)
            }
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>
                Dental Insurance Information
              </Text>
              <Icon
                name={
                  dentalInsuranceCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={dentalInsuranceCollapsed}>
            {/* Insurance Provider Name */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="building"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Insurance Provider Name"
                value={dentalInsuranceProvider}
                onChangeText={setDentalInsuranceProvider}
              />
            </View>

            {/* Policy Number */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="file-alt"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Policy Number"
                value={dentalPolicyNumber}
                onChangeText={setDentalPolicyNumber}
              />
            </View>

            {/* Coverage Details */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tooth" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Coverage Details"
                value={dentalCoverageDetails}
                onChangeText={setDentalCoverageDetails}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Insurance Contact Number */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="phone" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Insurance Contact Number"
                value={dentalInsuranceContact}
                onChangeText={setDentalInsuranceContact}
              />
            </View>

            {/* Claim Process Details */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="clipboard-list"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Claim Process Details"
                value={dentalClaimDetails}
                onChangeText={setDentalClaimDetails}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Exclusions or Limitations */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="times-circle"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Any Exclusions or Limitations?"
                value={dentalInsuranceExclusions}
                onChangeText={setDentalInsuranceExclusions}
                multiline
                numberOfLines={4}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            onPress={() => setHomeInfoCollapsed(!isHomeInfoCollapsed)}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>Home Information</Text>
              <Icon
                name={
                  isHomeInfoCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={isHomeInfoCollapsed}>
            {/* Type of Home */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="home" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Type of Home (e.g., Single Family, Townhouse, Condo)"
                value={homeType}
                onChangeText={setHomeType}
              />
            </View>

            {/* Home Exterior Material */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="layer-group"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Home Exterior Material (e.g., Brick, Vinyl Siding)"
                value={homeExterior}
                onChangeText={setHomeExterior}
              />
            </View>

            {/* Home Elevation */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="building"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Home Elevation (e.g., Single-story, Two-story)"
                value={homeElevation}
                onChangeText={setHomeElevation}
              />
            </View>

            {/* Presence of High Ceilings */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="arrow-up"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Presence of High Ceilings (e.g., Vaulted, Cathedral)"
                value={ceilingType}
                onChangeText={setCeilingType}
              />
            </View>

            {/* Home Size */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="ruler" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Home Size (in sq. ft.)"
                value={homeSize}
                onChangeText={setHomeSize}
              />
            </View>

            {/* Number of Rooms */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="door-open"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Number of Rooms"
                value={numberOfRooms}
                onChangeText={setNumberOfRooms}
              />
            </View>

            {/* Number of Floors */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="layer-group"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Number of Floors"
                value={numberOfFloors}
                onChangeText={setNumberOfFloors}
              />
            </View>

            {/* Last HVAC Service Date */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="fan" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Last HVAC Service Date (MM-DD-YYYY)"
                value={lastHvacServiceDate}
                onChangeText={setLastHvacServiceDate}
              />
            </View>

            {/* Frequency of Mowing Needed */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="leaf" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Frequency of Mowing Needed (e.g., Weekly, Monthly)"
                value={mowingFrequency}
                onChangeText={setMowingFrequency}
              />
            </View>

            {/* Last Window Cleaning Date */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="window-maximize"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Window Cleaning Date (MM-DD-YYYY)"
                value={lastWindowCleaningDate}
                onChangeText={setLastWindowCleaningDate}
              />
            </View>

            {/* Number of Trees in Yard */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tree" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Number of Trees in Yard (For tree lighting)"
                value={treeCount}
                onChangeText={setTreeCount}
              />
            </View>

            {/* Any Special Requests or Preferences? */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="lightbulb"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Any Special Requests or Preferences?"
                value={lightingPreferences}
                onChangeText={setLightingPreferences}
                multiline
                numberOfLines={4}
              />
            </View>
          </Collapsible>

          <TouchableOpacity onPress={() => setPetCollapsed(!isPetCollapsed)}>
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>Pet Information</Text>
              <Icon
                name={
                  isPetCollapsed ? "chevron-down-outline" : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={isPetCollapsed}>
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="dog" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Pet Name"
                value={petName}
                onChangeText={setPetName}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="paw" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Pet Type (e.g., Dog, Cat, Bird)"
                value={petType}
                onChangeText={setPetType}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="dna" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Pet Breed"
                value={petBreed}
                onChangeText={setPetBreed}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="birthday-cake"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Pet Age"
                value={petAge}
                onChangeText={setPetAge}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="weight" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Pet Weight (in lbs)"
                value={petWeight}
                onChangeText={setPetWeight}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="first-aid"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Any Special Needs or Medications?"
                value={petSpecialNeeds}
                onChangeText={setPetSpecialNeeds}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="bone" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Favorite Activities or Toys"
                value={petFavorites}
                onChangeText={setPetFavorites}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="allergies"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Known Allergies or Sensitivities"
                value={petAllergies}
                onChangeText={setPetAllergies}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="stethoscope"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Veterinarian Name & Contact"
                value={vetDetails}
                onChangeText={setVetDetails}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="microchip"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Is your pet microchipped? (Yes/No)"
                value={petMicrochipped}
                onChangeText={setPetMicrochipped}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="user-alt"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Pet's Behavior with Strangers (Friendly/Shy/Aggressive)"
                value={petBehavior}
                onChangeText={setPetBehavior}
              />
            </View>
          </Collapsible>
          <TouchableOpacity
            onPress={() => setPetInsuranceCollapsed(!isPetInsuranceCollapsed)}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>Pet Insurance Information</Text>
              <Icon
                name={
                  isPetInsuranceCollapsed
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={20}
                color={theme3.fontColor}
              />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={isPetInsuranceCollapsed}>
            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="clinic-medical"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Insurance Provider Name"
                value={provider}
                onChangeText={setProvider}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="file-invoice-dollar"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Policy Number"
                value={policyNumber}
                onChangeText={setPolicyNumber}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="book-medical"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Coverage Details (e.g., accidents, illnesses)"
                value={coverageDetails}
                onChangeText={setCoverageDetails}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="phone" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder="Insurance Contact Number"
                value={contact}
                onChangeText={setContact}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="file-signature"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Claim Process Details"
                value={claimDetails}
                onChangeText={setClaimDetails}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5
                name="exclamation-triangle"
                size={20}
                color={theme3.fontColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Any Exclusions or Limitations?"
                value={exclusions}
                onChangeText={setExclusions}
                multiline
                numberOfLines={4}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 20,
    paddingTop: 50,
  },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.25,
    borderColor: theme3.border,
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: "white",
  },

  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme3.fontColor,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
    color: theme3.fontColor,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 0, // remove the border from the TextInput as it's now on the container
    padding: 0, // adjust
  },
  errorInput: {
    borderColor: "#f9ab55",
  },
  errorText: {
    color: "#f9ab55",
    marginBottom: 10,
    marginTop: -5,
    fontSize: 12,
  },
  saveButton: {
    width: "100%",
    backgroundColor: theme3.primaryColor,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
    paddingTop: 50,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 20,
  },
  dateText: {
    marginLeft: 20,
    fontSize: 14,
  },
});

export default ManageAccountScreen;
