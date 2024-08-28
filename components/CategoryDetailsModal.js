import React, { useContext } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext"; // Import the LanguageContext

const { width } = Dimensions.get("window");

const CategoryDetailsModal = ({ visible, onClose, category }) => {
  const { translations } = useContext(LanguageContext); // Use the translations from context

  const renderBreadcrumbs = () => {
    if (!category || typeof category !== "object") {
      return null;
    }
    const categories = Array.isArray(category.categories)
      ? category.categories
      : [];
    const subcategories = Array.isArray(category.subcategories)
      ? category.subcategories
      : [];
    const serviceTypes = Array.isArray(category.serviceTypes)
      ? category.serviceTypes
      : [];

    return (
      <View style={styles.breadcrumbsContainer}>
        <Text style={styles.breadcrumbsLabel}>
          {translations.serviceCategory}
        </Text>
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>
            {categories[0] || translations.category}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme3.primaryColor}
          />
          <Text style={styles.breadcrumbText}>
            {subcategories[0] || translations.subcategory}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme3.primaryColor}
          />
          <Text style={styles.breadcrumbText}>
            {serviceTypes[0] || translations.service}
          </Text>
        </View>
      </View>
    );
  };

  const renderCategoryDetails = () => {
    if (!category || typeof category !== "object") return null;

    const fieldMappings = {
      details: {
        label: translations.serviceDetails,
        icon: "information-outline",
      },
      min_price: { label: translations.minimumPrice, icon: "currency-usd" },
      max_price: { label: translations.maximumPrice, icon: "currency-usd" },
      duration: { label: translations.duration, icon: "clock-outline" },
      disclaimer: {
        label: translations.disclaimer,
        icon: "alert-circle-outline",
      },
      onsiteEstimate: {
        label: translations.onsiteEstimate,
        icon: "home-outline",
      },
      waivedHired: {
        label: translations.waivedIfHired,
        icon: "check-circle-outline",
      },
    };

    const fields = Object.keys(category).filter((key) => fieldMappings[key]);

    const renderField = (key, fullWidth = false) => {
      const value = category[key];
      const { label, icon } = fieldMappings[key];

      return (
        <View
          key={key}
          style={[styles.detailItem, fullWidth && styles.fullWidthItem]}
        >
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color={theme3.primaryColor}
              style={styles.icon}
            />
            <Text style={styles.detailLabel}>{label}</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>
              {key === "duration"
                ? `${value || 0} ${translations.minutes}`
                : key === "min_price" || key === "max_price"
                ? `$${value || 0}`
                : String(value || translations.notAvailable)}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.detailsContainer}>
        {renderField("details", true)}
        <View style={styles.rowContainer}>
          {renderField("min_price")}
          {renderField("max_price")}
        </View>
        <View style={styles.rowContainer}>
          {renderField("duration")}
          {renderField("onsiteEstimate")}
        </View>
        {renderField("disclaimer", true)}
        {renderField("waivedHired")}
      </View>
    );
  };

  if (!category || typeof category !== "object") {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{translations.serviceDetails}</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {renderBreadcrumbs()}
            {renderCategoryDetails()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme3.primaryColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: theme3.primaryColor,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: 20,
  },
  breadcrumbsContainer: {
    marginBottom: 20,
  },
  breadcrumbsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  breadcrumbs: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 10,
  },
  breadcrumbText: {
    fontSize: 16,
    color: theme3.primaryColor,
    fontWeight: "500",
  },
  detailsContainer: {},
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    marginBottom: 15,
    width: "48%",
  },
  fullWidthItem: {
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailValueContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 10,
  },
  detailValue: {
    fontSize: 14,
    color: "#666",
  },
});

export default CategoryDetailsModal;
