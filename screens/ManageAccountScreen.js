import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { saveProfiles, fetchProfiles } from "../api/ApiCall";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Platform } from "react-native";
import { LanguageContext } from "../api/LanguageContext"; // Import LanguageContext
import ErrorAlert from "./GlobalComponents/ErrorAlert";
import SuccessModal from "./GlobalComponents/SuccessModal";

const ManageAccountScreen = ({ route }) => {
  const { user } = route.params;
  const { language, translations } = useContext(LanguageContext); // Get translations

  const [profile, setProfile] = useState({
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    gender: user.gender || "",
    dateOfBirth: user.dateOfBirth || "",
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
  const [homeType, setHomeType] = useState(user.homeType || "");
  const [homeSize, setHomeSize] = useState(user.homeSize || "");
  const [numberOfRooms, setNumberOfRooms] = useState(user.numberOfRooms || "");
  const [numberOfFloors, setNumberOfFloors] = useState(
    user.numberOfFloors || ""
  );
  const [floorCount, setFloorCount] = useState(user.floorCount || "");
  const [windowCount, setWindowCount] = useState(user.windowCount || "");
  const [yardSize, setYardSize] = useState(user.yardSize || "");
  const [lastHvacServiceDate, setLastHvacServiceDate] = useState(
    user.hvacType || ""
  );
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
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    // Validation logic here
  };

  const onChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  useEffect(() => {
    const formattedDate = moment(dateOfBirth).format("YYYY-MM-DD");
    handleInputChange("dateOfBirth", formattedDate);
  }, [dateOfBirth]);

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
    const loadData = async () => {
      try {
        const profileData = await fetchProfiles();

        if (profileData?.userProfile) {
          setProfile((prevState) => ({
            ...prevState,
            ...profileData.userProfile,
          }));
        }

        if (profileData?.userAddress) {
          setStreet(profileData.userAddress.street || "");
          setCity(profileData.userAddress.city || "");
          setState(profileData.userAddress.state || "");
          setZip(profileData.userAddress.zip || "");
        }

        if (profileData?.userPreferredPharmacy) {
          setPharmacyName(profileData.userPreferredPharmacy.pharmacyName || "");
          setPharmacyAddress(
            profileData.userPreferredPharmacy.pharmacyAddress || ""
          );
          setPharmacyPhone(
            profileData.userPreferredPharmacy.pharmacyPhone || ""
          );
        }

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

        if (profileData?.userHomeInformation) {
          setHomeType(profileData.userHomeInformation.homeType || "");
          setHomeSize(profileData.userHomeInformation.homeSize || "");
          setNumberOfRooms(profileData.userHomeInformation.numberOfRooms || "");
          setNumberOfFloors(
            profileData.userHomeInformation.numberOfFloors || ""
          );
          setFloorCount(profileData.userHomeInformation.floorCount || "");
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
        console.error(translations.fetchProfilesError, error);
      }
    };

    loadData();
  }, []);

  const handleSaveChanges = () => {
    const formatDate = (date) => {
      return date ? moment(date).format("YYYY-MM-DD") : null;
    };

    const formatInstant = (date) => {
      return date ? moment(date).toISOString() : null;
    };

    const nullIfEmpty = (value) => (value === "" ? null : value);

    // Helper function to remove null values from an object
    const removeNullValues = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null)
      );
    };

    const addressMap = removeNullValues({
      street: nullIfEmpty(street),
      city: nullIfEmpty(city),
      state: nullIfEmpty(state),
      zip: nullIfEmpty(zip),
    });

    const profileData = {
      userProfile: removeNullValues({
        user_id: profile.user_id,
        username: profile.username,
        provider_id: profile.provider_id,
        password: profile.password,
        role: profile.role,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        gender: profile.gender,
        email_verified: profile.email_verified,
        email_verification_code: nullIfEmpty(profile.email_verification_code),
        phoneNumber: nullIfEmpty(profile.phoneNumber),
        phone_verified: profile.phone_verified,
        phone_verification_code: nullIfEmpty(profile.phone_verification_code),
        profile_picture_url: nullIfEmpty(profile.profile_picture_url),
        address: Object.keys(addressMap).length > 0 ? addressMap : undefined,
        latitude: profile.latitude || 0,
        longitude: profile.longitude || 0,
        active: profile.active,
        lastLoginAt:
          formatInstant(profile.lastLoginAt) || formatInstant(new Date()),
        createdAt:
          formatInstant(profile.createdAt) || formatInstant(new Date()),
        quick_login: profile.quick_login,
        profile_completed: profile.profile_completed,
        dateOfBirth: formatDate(profile.dateOfBirth),
        about_me: nullIfEmpty(profile.about_me),
        socialMediaHandles:
          Object.keys(profile.socialMediaHandles || {}).length > 0
            ? profile.socialMediaHandles
            : undefined,
        settings:
          Object.keys(profile.settings || {}).length > 0
            ? profile.settings
            : undefined,
        push_notification: nullIfEmpty(profile.push_notification),
        admin_status: profile.admin_status,
        zipCodes: (profile.zipCodes || []).filter(Boolean),
      }),
      userAddress: removeNullValues({
        user_id: profile.user_id,
        ...addressMap,
      }),
      userPreferredPharmacy: removeNullValues({
        user_id: profile.user_id,
        pharmacyName: nullIfEmpty(pharmacyName),
        pharmacyAddress: nullIfEmpty(pharmacyAddress),
        pharmacyPhone: nullIfEmpty(pharmacyPhone),
      }),
      userMedicalHistory: removeNullValues({
        user_id: profile.user_id,
        allergies: nullIfEmpty(allergies),
        currentMedications: nullIfEmpty(currentMedications),
        pastMedications: nullIfEmpty(pastMedications),
        surgicalHistory: nullIfEmpty(surgicalHistory),
        smokeAlcoholHistory: nullIfEmpty(smokeAlcoholHistory),
        chronicIllnesses: nullIfEmpty(chronicIllnesses),
        familyMedicalHistory: nullIfEmpty(familyMedicalHistory),
        recentHospitalVisits: nullIfEmpty(recentHospitalVisits),
        immunizationHistory: nullIfEmpty(immunizationHistory),
        pregnancyChildbirthHistory: nullIfEmpty(pregnancyChildbirthHistory),
        otherMedicalInfo: nullIfEmpty(otherMedicalInfo),
      }),
      userDentalInformation: removeNullValues({
        user_id: profile.user_id,
        lastDentalVisit: formatDate(lastDentalVisit),
        lastDentalXray: formatDate(lastDentalXray),
        dentalAllergies: nullIfEmpty(dentalAllergies),
        dentalComplaints: nullIfEmpty(dentalComplaints),
        orthodonticHistory: nullIfEmpty(orthodonticHistory),
        gumDiseaseHistory: nullIfEmpty(gumDiseaseHistory),
        toothExtractionHistory: nullIfEmpty(toothExtractionHistory),
        dentalMedications: nullIfEmpty(dentalMedications),
        otherDentalInfo: nullIfEmpty(otherDentalInfo),
      }),
      userPersonalInsurance: removeNullValues({
        user_id: profile.user_id,
        provider: nullIfEmpty(personalInsuranceProvider),
        policyNumber: nullIfEmpty(personalPolicyNumber),
        coverageDetails: nullIfEmpty(personalCoverageDetails),
        contact: nullIfEmpty(personalInsuranceContact),
        claimDetails: nullIfEmpty(personalClaimDetails),
        exclusions: nullIfEmpty(personalInsuranceExclusions),
      }),
      userDentalInsurance: removeNullValues({
        user_id: profile.user_id,
        provider: nullIfEmpty(dentalInsuranceProvider),
        policyNumber: nullIfEmpty(dentalPolicyNumber),
        coverageDetails: nullIfEmpty(dentalCoverageDetails),
        contact: nullIfEmpty(dentalInsuranceContact),
        claimDetails: nullIfEmpty(dentalClaimDetails),
        exclusions: nullIfEmpty(dentalInsuranceExclusions),
      }),
      userHomeInformation: removeNullValues({
        user_id: profile.user_id,
        homeType: nullIfEmpty(homeType),
        homeExterior: nullIfEmpty(homeExterior),
        homeElevation: nullIfEmpty(homeElevation),
        ceilingType: nullIfEmpty(ceilingType),
        homeSize: nullIfEmpty(homeSize),
        numberOfRooms: nullIfEmpty(numberOfRooms),
        numberOfFloors: nullIfEmpty(numberOfFloors),
        lastHvacServiceDate: formatDate(lastHvacServiceDate),
        mowingFrequency: nullIfEmpty(mowingFrequency),
        lastWindowCleaningDate: formatDate(lastWindowCleaningDate),
        treeCount: nullIfEmpty(treeCount),
        lightingPreferences: nullIfEmpty(lightingPreferences),
      }),
      userPetInformation: removeNullValues({
        user_id: profile.user_id,
        petName: nullIfEmpty(petName),
        petType: nullIfEmpty(petType),
        petBreed: nullIfEmpty(petBreed),
        petAge: nullIfEmpty(petAge),
        petWeight: nullIfEmpty(petWeight),
        petSpecialNeeds: nullIfEmpty(petSpecialNeeds),
        petFavorites: nullIfEmpty(petFavorites),
        petAllergies: nullIfEmpty(petAllergies),
        vetDetails: nullIfEmpty(vetDetails),
        petMicrochipped: nullIfEmpty(petMicrochipped),
        petBehavior: nullIfEmpty(petBehavior),
      }),
      userPetInsurance: removeNullValues({
        user_id: profile.user_id,
        provider: nullIfEmpty(provider),
        policyNumber: nullIfEmpty(policyNumber),
        coverageDetails: nullIfEmpty(coverageDetails),
        contact: nullIfEmpty(contact),
        claimDetails: nullIfEmpty(claimDetails),
        exclusions: nullIfEmpty(exclusions),
      }),
    };

    // Remove any top-level objects that are empty after null removal
    Object.keys(profileData).forEach((key) => {
      if (Object.keys(profileData[key]).length === 0) {
        delete profileData[key];
      }
    });

    saveProfiles(profileData)
      .then((response) => {
        console.log("Profile saved successfully:", response);
        setAlertTitle(translations.success);
        setAlertMessage(translations.profileSavedSuccessfully);
        setShowAlert(true);
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        setAlertTitle(translations.error);
        setAlertMessage(translations.profileSaveError);
        setShowAlert(true);
      });
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollContainer}>
        <Header title={translations.manageProfile} />
        <View style={styles.container}>
          <Text style={styles.heading}>{translations.manageAccount}</Text>

          {/* First Name */}
          <View style={styles.iconInputContainer}>
            <FontAwesome5 name="user" size={20} color={theme3.fontColor} />
            <TextInput
              style={[styles.input, errors.firstName && styles.errorInput]}
              placeholder={translations.firstName}
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
              placeholder={translations.lastName}
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
              placeholder={translations.email}
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
              placeholder={translations.phoneNumber}
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
              placeholder={translations.gender}
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
                style={{ marginLeft: 10, alignSelf: "center" }}
                onPress={showMode}
              >
                {translations.selectDate}
              </Text>
              <Text style={styles.dateText}>
                {moment(dateOfBirth).format(translations.dateFormat)}
              </Text>
            </View>

            {showDatePicker && (
              <View style={{ fontSize: 10, alignSelf: "flex-start" }}>
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
              <Text style={styles.subHeading}>{translations.address}</Text>
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
                placeholder={translations.street}
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
                placeholder={translations.city}
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* State */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="flag" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.state}
                value={state}
                onChangeText={setState}
              />
            </View>

            {/* Zipcode */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="map-pin" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.zipcode}
                value={zip}
                onChangeText={setZip}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            onPress={() => setPharmacyCollapsed(!isPharmacyCollapsed)}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>{translations.pharmacy}</Text>
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
                placeholder={translations.pharmacyName}
                value={pharmacyName}
                onChangeText={setPharmacyName}
              />
            </View>

            {/* Pharmacy Address */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="home" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.pharmacyAddress}
                value={pharmacyAddress}
                onChangeText={setPharmacyAddress}
              />
            </View>
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="home" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.pharmacyPhone}
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
              <Text style={styles.subHeading}>
                {translations.medicalHistory}
              </Text>
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
                placeholder={translations.knownAllergies}
                value={allergies}
                onChangeText={setAllergies}
              />
            </View>

            {/* Current Medications */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="pills" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.currentMedications}
                value={currentMedications}
                onChangeText={setCurrentMedications}
              />
            </View>

            {/* Past Medications */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="history" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.pastMedications}
                value={pastMedications}
                onChangeText={setPastMedications}
              />
            </View>

            {/* Previous Surgeries and Dates */}
            <View style={styles.iconInputContainer}>
              <FontAwesome name="scissors" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.surgeries}
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
                placeholder={translations.smokeAlcohol}
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
                placeholder={translations.chronicIllnesses}
                value={chronicIllnesses}
                onChangeText={setChronicIllnesses}
              />
            </View>

            {/* Family History of Illnesses */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="users" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.familyHistory}
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
                placeholder={translations.recentHospitalizations}
                value={recentHospitalVisits}
                onChangeText={setRecentHospitalVisits}
              />
            </View>

            {/* Immunization History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="syringe" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.immunizationHistory}
                value={immunizationHistory}
                onChangeText={setImmunizationHistory}
              />
            </View>

            {/* Pregnancy and Childbirth History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="baby" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.pregnancyHistory}
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
                placeholder={translations.otherMedicalInfo}
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
              <Text style={styles.subHeading}>
                {translations.dentalHistory}
              </Text>
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
                placeholder={translations.lastDentalVisit}
                value={lastDentalVisit}
                onChangeText={setLastDentalVisit}
              />
            </View>

            {/* Last Dental Xray */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="x-ray" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.lastDentalXray}
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
                placeholder={translations.dentalAllergies}
                value={dentalAllergies}
                onChangeText={setDentalAllergies}
              />
            </View>

            {/* Dental Complaints */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tooth" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.dentalComplaints}
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
                placeholder={translations.orthodonticHistory}
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
                placeholder={translations.gumDiseaseHistory}
                value={gumDiseaseHistory}
                onChangeText={setGumDiseaseHistory}
              />
            </View>

            {/* Tooth Extraction History */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tooth" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.toothExtractionHistory}
                value={toothExtractionHistory}
                onChangeText={setToothExtractionHistory}
              />
            </View>

            {/* Dental Medications */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="pills" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.dentalMedications}
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
                placeholder={translations.otherDentalInfo}
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
                {translations.personalInsurance}
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
                placeholder={translations.insuranceProvider}
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
                placeholder={translations.policyNumber}
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
                placeholder={translations.coverageDetails}
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
                placeholder={translations.insuranceContact}
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
                placeholder={translations.claimProcess}
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
                placeholder={translations.exclusions}
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
                {translations.dentalInsurance}
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
                placeholder={translations.insuranceProvider}
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
                placeholder={translations.policyNumber}
                value={dentalPolicyNumber}
                onChangeText={setDentalPolicyNumber}
              />
            </View>

            {/* Coverage Details */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tooth" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.coverageDetails}
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
                placeholder={translations.insuranceContact}
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
                placeholder={translations.claimProcess}
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
                placeholder={translations.exclusions}
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
              <Text style={styles.subHeading}>
                {translations.homeInformation}
              </Text>
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
                placeholder={translations.homeType}
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
                placeholder={translations.homeExterior}
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
                placeholder={translations.homeElevation}
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
                placeholder={translations.ceilingType}
                value={ceilingType}
                onChangeText={setCeilingType}
              />
            </View>

            {/* Home Size */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="ruler" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.homeSize}
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
                placeholder={translations.numberOfRooms}
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
                placeholder={translations.numberOfFloors}
                value={numberOfFloors}
                onChangeText={setNumberOfFloors}
              />
            </View>

            {/* Last HVAC Service Date */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="fan" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.lastHvacService}
                value={lastHvacServiceDate}
                onChangeText={setLastHvacServiceDate}
              />
            </View>

            {/* Frequency of Mowing Needed */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="leaf" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.mowingFrequency}
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
                placeholder={translations.lastWindowCleaning}
                value={lastWindowCleaningDate}
                onChangeText={setLastWindowCleaningDate}
              />
            </View>

            {/* Number of Trees in Yard */}
            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="tree" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.treeCount}
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
                placeholder={translations.lightingPreferences}
                value={lightingPreferences}
                onChangeText={setLightingPreferences}
                multiline
                numberOfLines={4}
              />
            </View>
          </Collapsible>

          <TouchableOpacity onPress={() => setPetCollapsed(!isPetCollapsed)}>
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>
                {translations.petInformation}
              </Text>
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
                placeholder={translations.petName}
                value={petName}
                onChangeText={setPetName}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="paw" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.petType}
                value={petType}
                onChangeText={setPetType}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="dna" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.petBreed}
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
                placeholder={translations.petAge}
                value={petAge}
                onChangeText={setPetAge}
              />
            </View>

            <View style={styles.iconInputContainer}>
              <FontAwesome5 name="weight" size={20} color={theme3.fontColor} />
              <TextInput
                style={styles.input}
                placeholder={translations.petWeight}
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
                placeholder={translations.petSpecialNeeds}
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
                placeholder={translations.petFavorites}
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
                placeholder={translations.petAllergies}
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
                placeholder={translations.vetDetails}
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
                placeholder={translations.petMicrochipped}
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
                placeholder={translations.petBehavior}
                value={petBehavior}
                onChangeText={setPetBehavior}
              />
            </View>
          </Collapsible>
          <TouchableOpacity
            onPress={() => setPetInsuranceCollapsed(!isPetInsuranceCollapsed)}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.subHeading}>{translations.petInsurance}</Text>
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
                placeholder={translations.insuranceProvider}
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
                placeholder={translations.policyNumber}
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
                placeholder={translations.coverageDetails}
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
                placeholder={translations.insuranceContact}
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
                placeholder={translations.claimProcess}
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
                placeholder={translations.exclusions}
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
            <Text style={styles.buttonText}>{translations.submit}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ErrorAlert
        show={showAlert}
        onAction={handleCloseAlert}
        title={alertTitle}
        body={alertMessage}
      />
    </View>
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
    borderWidth: 0,
    padding: 0,
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
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    marginLeft: 20,
    fontSize: 14,
  },
});

export default ManageAccountScreen;
