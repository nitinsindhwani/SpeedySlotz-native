import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { useNavigation } from "@react-navigation/native";
import { Switch } from "react-native";

const ProfileScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState(["Nitin Sindhwani"]);
  const [smsNotification, setSmsNotification] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);
  const [appNotification, setAppNotification] = useState(false);

  // Function to add a new profile
  const handleAddProfile = () => {
    setProfiles([...profiles, "New Profile"]); // Just a dummy profile name for now
  };

  // Function to remove a profile by name
  const handleRemoveProfile = (profileName) => {
    setProfiles(profiles.filter((profile) => profile !== profileName));
  };

  const [avatar, setAvatar] = useState(user.profile_picture_url || null);

  // Calculate the profile completion percentage based on not-null fields
  const calculateProfileCompletion = () => {
    const totalFields = 12; // Assuming there are 12 fields in total
    let filledFields = 0;
    // List of fields to check for non-null values (you can add more fields here if needed)
    const fieldsToCheck = [
      "username",
      "email",
      "first_name",
      "last_name",
      "dateOfBirth",
      "phoneNumber",
      "address",
      "about_me",
      "socialMediaHandles",
      "profile_picture_url",
      "settings",
      "active",
    ];
    for (const field of fieldsToCheck) {
      if (user[field] !== null && user[field] !== undefined) {
        filledFields++;
      }
    }
    return ((filledFields / totalFields) * 100).toFixed(2);
  };

  // Function to format the date to mm-dd-yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}-${year}`;
  };

  // Logout Function
  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing user session, removing tokens, etc.)
    // For demonstration purposes, we'll just navigate to the LoginScreen
    navigation.navigate("LoginScreen");
  };

  const handleManageAccount = () => {
    navigation.navigate("ManageAccountScreen", { user });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.userImageContainer}>
          <View style={styles.letterAvatar}>
            <Text style={styles.letterText}>
              {user.first_name.charAt(0).toUpperCase()}
              {user.last_name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.first_name}</Text>
          <Text style={styles.memberSince}>
            Member Since: {formatDate(user.createdAt)}
          </Text>
        </View>
      </View>

      {/* Profile Completion Section */}
      <View style={styles.completionContainer}>
        <Text style={styles.heading}>Profile Completion</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${calculateProfileCompletion()}%` },
            ]}
          />
          <Text style={styles.percentageText}>
            {calculateProfileCompletion()}%
          </Text>
        </View>
      </View>

      {/* Section Dividing Line */}
      <View style={styles.divider} />

      {/* Account Settings Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>Manage Profile</Text>

        {profiles.map((profile, index) => (
          <TouchableOpacity key={index} onPress={handleManageAccount}>
            <View style={styles.profileRow}>
              <Text style={styles.profileText}>{profile}</Text>
              <Ionicons name="chevron-forward" size={24} color="#084887" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {/* Section Dividing Line */}
      <View style={styles.divider} />
      {/* Notification Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>Notification Settings</Text>

        <View style={styles.notificationRow}>
          <Text style={styles.settingItem}>SMS Notification</Text>
          <Switch
            value={smsNotification}
            onValueChange={setSmsNotification}
            thumbColor={smsNotification ? "#084887" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#f9ab55" }}
          />
        </View>

        <View style={styles.notificationRow}>
          <Text style={styles.settingItem}>Email Notification</Text>
          <Switch
            value={emailNotification}
            onValueChange={setEmailNotification}
            thumbColor={emailNotification ? "#084887" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#f9ab55" }}
          />
        </View>

        <View style={styles.notificationRow}>
          <Text style={styles.settingItem}>App Notification</Text>
          <Switch
            value={appNotification}
            onValueChange={setAppNotification}
            thumbColor={appNotification ? "#084887" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#f9ab55" }}
          />
        </View>
      </View>
      {/* Section Dividing Line */}
      <View style={styles.divider} />

      {/* Support Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>Support</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Chat") }>
          <View style={styles.profileRow}>
            <Text style={styles.settingItem}>Chat</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("http://google.com")}>
          <View style={styles.profileRow}>
            <Text style={stzyles.settingItem}>Help Center</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("http://google.com")}>
          <View style={styles.profileRow}>
            <Text style={styles.settingItem}>Terms and Conditions</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("http://google.com")}>
          <View style={styles.profileRow}>
            <Text style={styles.settingItem}>Privacy</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("http://google.com")}>
          <View style={styles.profileRow}>
            <Text style={styles.settingItem}>About This App</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Section Dividing Line */}
      <View style={styles.divider} />

      {/* More Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>More</Text>
        <TouchableOpacity onPress={() => Linking.openURL("http://google.com")}>
          <View style={styles.profileRow}>
            <Text style={styles.settingItem}>Register as service provider</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("http://google.com")}>
          <View style={styles.profileRow}>
            <Text style={styles.settingItem}>How it works</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("http://google.com")}>
          <View style={styles.profileRow}>
            <Text style={styles.settingItem}>About SpeedySlotz</Text>
            <Ionicons name="chevron-forward" size={24} color="#084887" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 5, // Reduced from 20
    backgroundColor: "#FFFFFF",
  },
  letterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Updated to half of width and height for a perfect circle
    backgroundColor: "#084887", // primaryColor
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: {
    color: "#FFFFFF", // White color
    fontSize: 18,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#084887", // primaryColor
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  userImageContainer: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#084887", // primaryColor
  },
  memberSince: {
    fontSize: 14,
    color: "#666666",
  },
  completionContainer: {
    marginBottom: 10,
  },
  progressBarContainer: {
    width: "100%",
    height: 30,
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    justifyContent: "center",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#f9ab55", // secondaryColor
    borderRadius: 15,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    position: "absolute",
    alignSelf: "center",
  },
  sectionContainer: {
    marginBottom: 5, // Reduced from 20
    paddingVertical: 5, // Reduced from 15
  },

  logoutButton: {
    width: "100%",
    padding: 10, // Reduced from 15
    borderRadius: 10,
    marginTop: 15, // Reduced from 20
    alignItems: "center",
    backgroundColor: "#084887",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  settingItem: {
    fontSize: 18,
    color: "#084887",
    marginBottom: 5, // Reduced from 10
  },
  supportLink: {
    fontSize: 18,
    color: "#084887", // primaryColor
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  divider: {
    height: 1,
    backgroundColor: "#f9ab55",
    marginVertical: 5, // Reduced from 10
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5, // Reduced from 10
  },

  profileText: {
    fontSize: 18,
    color: "#084887", // primaryColor
  },
  addProfileButton: {
    marginTop: 10,
    borderColor: "#084887", // primaryColor
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  addProfileButtonText: {
    color: "#084887", // primaryColor
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default ProfileScreen;
