import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";

const NoDataFound = ({ scenario = "default" }) => {
  const getContent = () => {
    switch (scenario) {
      case "favorites":
        return {
          icon: "heart-outline",
          title: "No Favorites Yet",
          subtitle:
            "Save your favorite service providers for quick access to their services.",
        };
      case "search":
        return {
          icon: "magnify",
          title: "Let's Find Your Perfect Match",
          subtitle:
            "Try adjusting your filters or expanding your search radius to discover more providers.",
        };
      case "initial":
        return {
          icon: "compass",
          title: "Discover Great Services",
          subtitle:
            "Browse categories or search to find trusted local service providers.",
        };
      case "bookings":
        return {
          icon: "calendar-clock",
          title: "No Bookings Yet",
          subtitle:
            "Your upcoming appointments and service bookings will appear here.",
        };
      case "deals":
        return {
          icon: "tag-multiple",
          title: "No Active Deals",
          subtitle:
            "Check back soon for special offers from service providers.",
        };
      case "notifications":
        return {
          icon: "bell-outline",
          title: "All Caught Up",
          subtitle:
            "You'll see notifications about your bookings and updates here.",
        };
      case "chat":
        return {
          icon: "chat-processing-outline",
          title: "Start a Conversation",
          subtitle:
            "Chat directly with service providers to discuss your needs and book appointments.",
        };
      case "chat-search":
        return {
          icon: "text-search",
          title: "No Matching Chats",
          subtitle:
            "Try different search terms to find specific conversations.",
        };
      case "chat-history":
        return {
          icon: "message-text-outline",
          title: "No Chat History Yet",
          subtitle:
            "Your conversations with service providers will appear here.",
        };
      case "categories":
        return {
          icon: "shape-outline",
          title: "Choose Your Service",
          subtitle: "Select a category to browse available service providers.",
        };
      case "reviews":
        return {
          icon: "star-outline",
          title: "No Reviews Yet",
          subtitle: "Be the first to share your experience with this provider.",
        };
      case "history":
        return {
          icon: "history",
          title: "No Service History",
          subtitle: "Your completed service appointments will appear here.",
        };
      default:
        return {
          icon: "help-circle-outline",
          title: "Ready to Help You",
          subtitle: "Explore our services to find what you're looking for.",
        };
    }
  };

  const content = getContent();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={content.icon}
        size={80}
        color={theme3.primaryColor}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.subtitle}>{content.subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    width: "100%",
  },
  icon: {
    marginBottom: 16,
    opacity: 0.9,
  },
  textContainer: {
    alignItems: "center",
    maxWidth: "80%",
  },
  title: {
    color: theme3.fontColor,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: theme3.fontColor,
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});

export default NoDataFound;
