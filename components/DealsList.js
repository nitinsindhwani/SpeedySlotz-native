import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";

const DealItem = ({ item, index, navigation }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={styles.dealItem}
        onPress={() =>
          navigation.navigate("DetailScreen", { business: item.business })
        }
      >
        <Image
          source={{
            uri: item.imageUrl || "https://via.placeholder.com/220x120",
          }}
          style={styles.dealImage}
        />
        <View style={styles.dealHeader}>
          <Animated.View
            style={[
              styles.dealIconContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <MaterialCommunityIcons name="fire" size={18} color="#FFFFFF" />
          </Animated.View>
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>{item.discount || "DEAL"}</Text>
          </View>
        </View>
        <View style={styles.dealContent}>
          <Text style={styles.dealTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.businessName} numberOfLines={1}>
            {item.businessName}
          </Text>
          <Text style={styles.validUntil}>
            Valid until {item.validUntil || "Limited time"}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};
const DealsList = ({ deals, navigation }) => {
  if (!deals || deals.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={deals}
        renderItem={({ item, index }) => (
          <DealItem item={item} index={index} navigation={navigation} />
        )}
        keyExtractor={(item, index) => `deal-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingVertical: 8,
    backgroundColor: theme3.GlobalBg,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  dealItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginRight: 16,
    width: 220,
    height: 280, // Increased height to accommodate image
    borderWidth: 1,
    borderColor: theme3.primaryColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden", // To ensure image respects border radius
  },
  dealImage: {
    width: "100%",
    height: 120, // Adjust as needed
    resizeMode: "cover",
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  dealIconContainer: {
    backgroundColor: "#FF4136",
    borderRadius: 20,
    padding: 6,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  dealBadge: {
    backgroundColor: theme3.primaryColor,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dealBadgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  dealContent: {
    flex: 1,
    padding: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme3.fontColor,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 14,
    color: theme3.fontColorI,
    marginBottom: 4,
  },
  validUntil: {
    fontSize: 12,
    color: theme3.fontColorI,
    marginBottom: 8,
  },
  bookNowButton: {
    backgroundColor: theme3.primaryColor,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 12,
  },
  bookNowText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default DealsList;
