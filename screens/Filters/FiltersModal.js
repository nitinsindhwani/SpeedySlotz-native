import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import { getBadgeDetails } from "../../components/BadgeInfo";
import { LanguageContext } from "../../api/LanguageContext";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

function FilterModal({
  show,
  onHideModal,
  badgeCodes,
  selectedFilters,
  setSelectedFilters,
}) {
  const [tempSelectedFilters, setTempSelectedFilters] =
    useState(selectedFilters);
  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    setTempSelectedFilters(selectedFilters);
  }, [selectedFilters, show]);

  const toggleFilter = (filterCode) => {
    if (tempSelectedFilters.includes(filterCode)) {
      setTempSelectedFilters(
        tempSelectedFilters.filter((filter) => filter !== filterCode)
      );
    } else {
      setTempSelectedFilters([...tempSelectedFilters, filterCode]);
    }
  };

  const handleSave = () => {
    setSelectedFilters(tempSelectedFilters);
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
                name="filter-variant"
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
                {translations.filters}
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
            {badgeCodes.map((code, index) => {
              const badgeDetails = getBadgeDetails(code, translations);
              if (!badgeDetails) return null;
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 20,
                    marginVertical: 10,
                  }}
                  onPress={() => toggleFilter(code)}
                >
                  <Ionicons
                    name={badgeDetails.icon}
                    size={20}
                    color={
                      tempSelectedFilters.includes(code)
                        ? theme3.secondaryColor
                        : "gray"
                    }
                  />
                  <Text style={{ marginLeft: 10 }}>{badgeDetails.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default FilterModal;
