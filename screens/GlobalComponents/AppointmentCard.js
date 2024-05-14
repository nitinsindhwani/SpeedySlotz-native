import React, { useState, useEffect } from "react";

import {
  FontAwesome,
  Octicons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import getImageSource from "../CallFuncGlobal/getImageSource";
import { theme3 } from "../../assets/branding/themes";
import Styles from "../../assets/branding/GlobalStyles";
import TimeSlots from "../../assets/data/TimeSlots";
import AvailableSlots from "../../assets/data/Availableslots";
import Specialieites from "../../assets/data/SpecialitiesData";
import MapIcon from "react-native-vector-icons/FontAwesome5";
import DealIcon from "react-native-vector-icons/FontAwesome5";
import metersToMiles from "../CallFuncGlobal/metersoMiles";
import { Entypo } from "@expo/vector-icons";

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Button,
  Image,
  FlatList,
  Platform
} from "react-native";
import DealIcons from "./DealIcons";
import { getBadgeDetails } from "../../components/BadgeInfo";
import ChatAnim from "./ChatAnim";
function AppointmentCard({
  businesss,
  getStatusText,
  formatDate,
  formatTime,
  handleReschedule,
  identifier,
  handleCancel,
}) {
  const [ExpandCat, setExpandCat] = useState(false);
  const desc = "Description will be written here";
  console.log("dsda", businesss?.slots);
  const [showMore, setShowMore] = useState(false);

  function SpecialityList({ item }) {
    return (
      <View style={styles.CatList}>
        <Ionicons name={item.icon} size={20} color={theme3.secondaryColor} />

        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item.name}</Text>
      </View>
    );
  }

  const renderBadge = ({ item }) => {
    const badge = getBadgeDetails(item); // Correctly call the function
    if (!badge) return null;

    return (
      <View style={styles.CatList}>
        <Ionicons name={badge.icon} size={20} color={theme3.secondaryColor} />
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{badge.name}</Text>
      </View>
    );
  };
  function SpecialityListII({ item }) {
    return (
      <View style={styles.CatListII}>
        {/* <Ionicons name={item.icon} size={20} color={theme3.secondaryColor} /> */}
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item.title}</Text>
      </View>
    );
  }

  function AvailableSlotsList({ item }) {
    return (
      <View style={styles.CatList}>
        {/* <Ionicons name={item.icon} size={20} color={theme3.secondaryColor} /> */}
        <Text style={{ color: theme3.light, marginLeft: 5 }}>{item.title}</Text>
      </View>
    );
  }

  const business = {
    yelpBusiness: {
      name: "True Dealers",
      distance: "2000",
      phone: "+1 929 3232 3322",
    },
    yelpBusinessLocation: {
      city: "Texas, NewLake",
      address1: "Address of th srvice provider 143  B-Block",
    },
  };
  return (
    <View style={styles.mostPopularItem}>
      <Image
        source={getImageSource(
          businesss?.yelpBusiness?.name,
          businesss?.yelpBusiness?.image_url
        )}
        style={styles.mostPopularImage}
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={[styles.mostPopularName, { width: "70%" }]}>
          {businesss?.yelpBusiness?.name}
        </Text>

        {/* Below condition is same as PopularBuisnessList but i think its not correct because of the slots attribute, slots attribute is different here*/}

       
          
            {businesss?.slots && businesss?.slots?.length > 0 && (
              <View style={Styles.OneRow}>
                <View
           style={{marginLeft:-20}}
           >
            <ChatAnim/>
            </View>
                <Text style={[styles.DescText, { marginLeft: 0 }]}>
                  Slots Available
                </Text>
              </View>
            ) }
          
        
      </View>

      {/* description and titles are being shown*/}

      {business.yelpBusiness.is_registered && (
        <>
          {/* Description with Read More/Less functionality */}
          {showMore ? (
            <Text style={styles.DescText}>
              {business.yelpBusiness.details}
              <Text
                style={{ color: theme3.primaryColor }}
                onPress={() => setShowMore(false)}
              >
                {" "}
                Read Less...
              </Text>
            </Text>
          ) : (
            <Text style={styles.DescText}>
              {`${business?.yelpBusiness?.details?.slice(0, 30)}...`}
              <Text
                style={{ color: theme3.primaryColor }}
                onPress={() => setShowMore(true)}
              >
                {" "}
                Read More...
              </Text>
            </Text>
          )}

          {/* Display badges or 'No badges available' based on condition */}
          {showMore &&
            (business.yelpBusiness.badges &&
            business.yelpBusiness.badges.length > 0 ? (
              <FlatList
                data={business.yelpBusiness.badges}
                horizontal={true}
                renderItem={renderBadge} // Ensure this function is defined to render each badge
                keyExtractor={(badge, index) => `badge-${index}`}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noSlotsText}>No badges available.</Text>
            ))}
        </>
      )}

      {/* categories below*/}

      {businesss?.yelpBusinessCategory?.serviceTypes?.length > 0 && (
        <>
          <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
          <Text
            style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}
          >
            Categories
          </Text>
          </View>
          {/* <FlatList
        data={Specialieites}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // numColumns={3}
        renderItem={({ item, index }) => {
          return <SpecialityListII item={item} index={index} />;
        }}
      /> */}

          <FlatList
            data={businesss?.yelpBusinessCategory?.serviceTypes || []}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: serviceType, index }) => {
              // Directly return SpecialityListII component for each serviceType
              return <SpecialityListII item={serviceType} index={index} />;
            }}
            keyExtractor={(serviceType, index) => index.toString()} // Add a keyExtractor for good practice
          />
        </>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.extraInfoContainer}>
          <View style={styles.dealIconContainer}>
            <MaterialIcons
              name="location-city"
              size={18}
              color={theme3.primaryColor}
            />
            <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
              {businesss?.yelpBusinessLocation?.city}
            </Text>
          </View>
          {businesss?.yelpBusiness?.is_registered && (
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`tel:${businesss?.yelpBusiness?.phone}`)
            }
          >
            <View style={styles.dealIconContainer}>
              <FontAwesome
                name="phone"
                size={20}
                color={theme3.secondaryColor}
              />
              <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
                {businesss?.yelpBusiness?.phone}
              </Text>
            </View>
          </TouchableOpacity>
          )}
        </View>
        <View style={styles.extraInfoContainer}>
          <View style={styles.dealIconContainer}>
            <MapIcon
              name="map-marker-alt"
              size={16}
              color={theme3.primaryColor}
            />
            <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
              {metersToMiles(businesss?.yelpBusiness?.distance)} miles
            </Text>
          </View>
          {businesss?.yelpBusiness?.is_registered && (
          <View style={Styles.OneRow}>
             <View
            style={{marginLeft:-6}}
            >

            <ChatAnim/>
            </View>
            <Text style={[styles.DescText, { marginLeft: 0 }]}>Chat Now</Text>
          </View>
          )}
        </View>
        <View style={styles.extraInfoContainer}>
          <TouchableOpacity
            style={styles.mapIconContainer}
            onPress={() => {
              const address1 = businesss.yelpBusinessLocation?.address1
                ? businesss.yelpBusinessLocation.address1 + ","
                : "";
              const city = businesss.yelpBusinessLocation?.city || "";
              const mapQuery = encodeURIComponent(`${address1}${city}`);
              if (mapQuery) {
                Linking.openURL(`http://maps.apple.com/?q=${mapQuery}`);
              } else {
                // Optionally, handle the case where there is no address to navigate to
                // e.g., alert the user or log an error
                console.warn("No address available for directions");
              }
            }}
          >
            <MaterialIcons
              name="directions"
              size={18}
              color={theme3.primaryColor}
            />
            <Text style={[styles.mostPopularCity, { marginTop: 0 }]}>
              Directions
            </Text>
          </TouchableOpacity>
          {businesss.yelpBusinessDeal && (
  <View style={styles.dealIconContainer}>
  {/* <DealIcon name="tags" size={16} color={theme3.secondaryColor} /> */}
  <DealIcons />
  <Text style={[styles.mostPopularCity, { marginLeft: 5 }]}>
    Deals
  </Text>
</View>
          )}
        
        </View>
      </View>

      {/* <View style={styles.extraInfoContainer}>
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(`tel:${business.yelpBusiness.phone}`)
      }
    >
       <View style={styles.dealIconContainer}>
       <Entypo name="time-slot" size={20} color={theme3.send} />
               <Text style={[styles.mostPopularCity,{marginLeft:5}]}>{getStatusText(business.slot)}</Text>
        <Text style={[styles.mostPopularCity,{marginLeft:5}]}>Slot Text</Text>

      </View>
     
    </TouchableOpacity>
      <View style={styles.dealIconContainer}>
      <Entypo name="clock" size={20} color={theme3.send} />
        <Text style={[styles.mostPopularCity,{marginLeft:5}]}>{"2023-12-20"}

</Text>
      </View>
    </View> */}

      <Text style={[styles.mostPopularName, { fontSize: 14, marginLeft: 0 }]}>
        Booking Time
      </Text>
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    >

        {businesss?.slots?.map((item) => {
          return (
            <View style={[styles.CatList, {marginLeft:0, marginRight:5 }]}>
            <Text style={{ color: theme3.light, marginLeft: 5 }}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
              {/* {item.endTime}  */}
            </Text>
            </View>

          );
        })}
    </ScrollView>


        {/* <Text style={{color:theme3.light,marginLeft:5}}>
          10:00 Pm -{" "}
                  3:00 am
          </Text> */}

      {identifier === "past" && (
        <TouchableOpacity
          onPress={() => handleReschedule(businesss.yelpBusiness.id)}
          style={[Styles.LoginBtn, { backgroundColor: theme3.primaryColor,padding:10 }]}
        >
          <Text style={Styles.LoginTxt}>Book Again</Text>
        </TouchableOpacity>
      )}

      {identifier === "upcoming" && (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity
            onPress={() => handleReschedule(businesss.yelpBusiness.id)}
            style={[
              Styles.LoginBtn,
              { backgroundColor: theme3.primaryColor ,padding:10,width:"67%",marginRight:10},
            ]}
          >
            <Text style={Styles.LoginTxt}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleCancel(businesss.slot, businesss.yelpBusinessSettings)
            }
            style={[Styles.LoginBtn, { backgroundColor: theme3.danger ,padding:10,width:"30%" }]}
          >
            <Text style={Styles.LoginTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
export default AppointmentCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    marginTop: Platform.OS === "android" ? 40 : 16,
  },
  mostPopularImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
  mostPopularItem: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme3.GlobalBg,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 1,
    elevation: 1, // White background color
  },
  DescText: {
    fontSize: 14,
    color: theme3.fontColorI, // Gray text color
  },
  mostPopularName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme3.fontColor, // Blue text color
  },
  CatList: {
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    paddingBottom: 5,
    paddingTop: 5,
    margin: 5,
  },
  extraInfoContainer: {
    // flexDirection: "row",
    // marginRight:20,
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dealIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mostPopularCity: {
    fontSize: 14,
    color: theme3.fontColorI, // Gray text color
  },
  mapIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mostPopularCity: {
    fontSize: 14,
    color: theme3.fontColorI, // Gray text color
  },

  CatListII: {
    padding: 15,
    borderRadius: 5,
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme3.primaryColor,
    // borderColor: theme3.secondaryColor,
    // borderWidth: 2,
    paddingBottom: 5,
    paddingTop: 5,
    margin: 5,
  },
});
