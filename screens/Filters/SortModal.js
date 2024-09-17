import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import { LanguageContext } from "../../api/LanguageContext";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

function SortModal({ show, onHideModal, selectedSort, setSelectedSort }) {
  const [tempSelectedSort, setTempSelectedSort] = useState(selectedSort);
  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    setTempSelectedSort(selectedSort);
  }, [selectedSort, show]);

  const sortOptions = [
    { label: translations.googleRating, value: "googleRating" },
    { label: translations.speedySlotzRating, value: "speedySlotzRating" },
    { label: translations.distance, value: "distance" },
    { label: translations.priceLowToHigh, value: "priceLowToHigh" },
    { label: translations.priceHighToLow, value: "priceHighToLow" },
  ];

  const handleSave = () => {
    setSelectedSort(tempSelectedSort);
    onHideModal();
  };

  return (
    <Modal visible={show} transparent={true} animationType="slide">
      <View style={[Styles.Container, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
        <View
          style={{
            width: WindowWidth,
            height: WindowHeight / 1.5,
            backgroundColor: theme3.light,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            position: "absolute",
            bottom: 0,
          }}
        >
          <View
            style={{
              width: WindowWidth,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginLeft: 20,
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="sort"
                size={25}
                color={theme3.primaryColor}
              />
              <Text
                style={{
                  alignSelf: "center",
                  marginVertical: 0,
                  fontSize: 16,
                  color: theme3.fontColor,
                  fontWeight: "bold",
                }}
              >
                {translations.sortBy}
              </Text>
            </View>
            <TouchableOpacity onPress={handleSave}>
              <Text
                style={{
                  alignSelf: "center",
                  marginRight: 20,
                  fontSize: 16,
                  color: theme3.primaryColor,
                  fontWeight: "bold",
                }}
              >
                {translations.save}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}
                onPress={() => setTempSelectedSort(option.value)}
              >
                <MaterialCommunityIcons
                  name={
                    tempSelectedSort === option.value
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={20}
                  color={
                    tempSelectedSort === option.value
                      ? theme3.secondaryColor
                      : "gray"
                  }
                />
                <Text style={{ marginLeft: 10 }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default SortModal;
