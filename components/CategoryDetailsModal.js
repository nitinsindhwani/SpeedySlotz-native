import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
import { LanguageContext } from "../api/LanguageContext";
import Header from "../screens/GlobalComponents/Header";

const { width } = Dimensions.get("window");

const CategoryDetailsModal = ({ visible, onClose, category }) => {
  const { translations } = useContext(LanguageContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderImageCarousel = () => {
    if (!category || !category.imageUrls || category.imageUrls.length === 0) {
      return null;
    }

    return (
      <View style={styles.carouselOuterContainer}>
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={({ nativeEvent }) => {
              const slide = Math.ceil(nativeEvent.contentOffset.x / width);
              if (slide !== activeIndex) {
                setActiveIndex(slide);
              }
            }}
            scrollEventThrottle={200}
          >
            {category.imageUrls.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={styles.carouselImage}
              />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {category.imageUrls.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex ? styles.paginationDotActive : null,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };
  const renderBreadcrumbs = () => {
    if (!category) return null;
    const { categories = [], subcategories = [], serviceTypes = [] } = category;

    return (
      <View style={styles.breadcrumbsContainer}>
        <Text style={styles.sectionTitle}>{translations.serviceCategory}</Text>
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>
            {categories[0] || ""} {">"} {subcategories[0] || ""} {">"}{" "}
            {serviceTypes[0] || ""}
          </Text>
        </View>
      </View>
    );
  };

  const renderDetailSection = (title, content, icon) => (
    <View style={styles.detailSection}>
      <View style={styles.detailTitleContainer}>
        <Ionicons name={icon} size={24} color={theme3.primaryColor} />
        <Text style={styles.detailTitle}>{title}</Text>
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailText}>
          {content || translations.notAvailable}
        </Text>
      </View>
    </View>
  );

  const renderPriceSection = () => (
    <View style={styles.priceSection}>
      <View style={styles.priceItem}>
        <Ionicons name="cash-outline" size={24} color={theme3.primaryColor} />
        <Text style={styles.priceLabel}>{translations.minimumPrice}</Text>
        <Text style={styles.priceValue}>${category?.min_price || 0}</Text>
      </View>
      <View style={styles.priceItem}>
        <Ionicons name="cash-outline" size={24} color={theme3.primaryColor} />
        <Text style={styles.priceLabel}>{translations.maximumPrice}</Text>
        <Text style={styles.priceValue}>${category?.max_price || 0}</Text>
      </View>
    </View>
  );

  const renderTimeSection = () => (
    <View style={styles.timeSection}>
      <View style={styles.timeItem}>
        <Ionicons name="time-outline" size={24} color={theme3.primaryColor} />
        <Text style={styles.timeLabel}>{translations.duration}</Text>
        <Text style={styles.timeValue}>{category?.duration || 0} min</Text>
      </View>
      <View style={styles.timeItem}>
        <Ionicons name="home-outline" size={24} color={theme3.primaryColor} />
        <Text style={styles.timeLabel}>{translations.onsiteEstimate}</Text>
        <Text style={styles.timeValue}>
          {category?.onsiteEstimate || translations.notAvailable}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title={translations.serviceDetails}
          typeModal={true}
          onPress={onClose}
        />
        <ScrollView style={styles.scrollView}>
          {renderImageCarousel()}
          <View style={styles.contentContainer}>
            {renderBreadcrumbs()}
            {renderDetailSection(
              translations.serviceDetails,
              category?.details,
              "information-circle-outline"
            )}
            {renderPriceSection()}
            {renderTimeSection()}
            {renderDetailSection(
              translations.disclaimer,
              category?.disclaimer,
              "alert-circle-outline"
            )}
            {renderDetailSection(
              translations.waivedIfHired,
              category?.waivedHired || translations.notAvailable,
              "checkmark-circle-outline"
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  contentContainer: {
    padding: 20,
  },
  carouselOuterContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  carouselContainer: {
    height: 220,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme3.primaryColor,
  },
  carouselImage: {
    width: width - 20,
    height: 220,
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  paginationDotActive: {
    backgroundColor: theme3.primaryColor,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme3.fontColor,
  },
  breadcrumbsContainer: {
    marginBottom: 16,
  },
  breadcrumbs: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 8,
  },
  breadcrumbText: {
    color: theme3.primaryColor,
    fontSize: 16,
  },
  detailSection: {
    backgroundColor: theme3.light,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  detailTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: theme3.fontColor,
  },
  detailContent: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: theme3.fontColor,
    lineHeight: 20,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  priceItem: {
    flex: 1,
    backgroundColor: theme3.light,
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  timeItem: {
    flex: 1,
    backgroundColor: theme3.light,
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: theme3.fontColor,
  },
  priceValue: {
    fontSize: 18,
    color: theme3.primaryColor,
    fontWeight: "bold",
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: theme3.fontColor,
  },
  timeValue: {
    fontSize: 18,
    color: theme3.primaryColor,
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default CategoryDetailsModal;
