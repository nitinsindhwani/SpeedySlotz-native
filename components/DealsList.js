import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
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
        <Animated.View
          style={[
            styles.dealIconContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <MaterialCommunityIcons name="fire" size={18} color="#FFFFFF" />
        </Animated.View>
        <View style={styles.dealContent}>
          <Text style={styles.dealTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.businessName} numberOfLines={1}>
            {item.businessName}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const DealsList = ({ deals, navigation }) => {
  if (deals.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={deals}
        renderItem={({ item, index }) => (
          <DealItem item={item} index={index} navigation={navigation} />
        )}
        keyExtractor={(item, index) => `deal-${item.businessId}-${index}`}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: theme3.primaryColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  dealIconContainer: {
    marginRight: 10,
    backgroundColor: "#FF4136",
    borderRadius: 20,
    padding: 6,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  dealContent: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme3.fontColor,
  },
  businessName: {
    fontSize: 11,
    color: theme3.fontColorI,
    marginTop: 2,
  },
});

export default DealsList;
