import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { theme3 } from '../../assets/branding/themes';

const badgesInfo = {
  TOPR: { name: "Top Rated", icon: "star-outline" },
  LOWP: { name: "Low Price", icon: "pricetags-outline" },
  R1HR: { name: "Response Within 1 Hour", icon: "time-outline" },
  PUNC: { name: "Punctuality Award", icon: "alarm-outline" },
  FAIR: { name: "Fair Business", icon: "thumbs-up-outline" },
  MBUS: { name: "Most Busy In The Category", icon: "people-outline" },
  LOYA: { name: "Customer Loyalty", icon: "heart" },
  SAFE: { name: "Safety Champion", icon: "shield-alt" },
  TECH: { name: "Tech-Savvy", icon: "laptop-code" },
};


const badges=[
   { name: "Top Rated", icon: "star-outline" },
   { name: "Low Price", icon: "pricetags-outline" },
   { name: "Response Within 1 Hour", icon: "time-outline" },
   { name: "Punctuality Award", icon: "alarm-outline" },
   { name: "Fair Business", icon: "thumbs-up-outline" },
   { name: "Most Busy In The Category", icon: "people-outline" },
   { name: "Customer Loyalty", icon: "heart" },
   { name: "Safety Champion", icon: "shield-alt" },
   { name: "Tech-Savvy", icon: "laptop-code" },
]
export default function RemarkModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [ratings, setRatings] = useState({});

  const handleRating = (badgeKey, isPositive) => {
    setRatings((prev) => {
      const updatedRatings = { ...prev };
      if (updatedRatings[badgeKey] === isPositive) {
        delete updatedRatings[badgeKey]; // Deselect if the same option is tapped
      } else {
        updatedRatings[badgeKey] = isPositive;
      }
      return updatedRatings;
    });
    setSelectedBadge(null); // Hide options after selection
  };

  const toggleOptions = (badgeKey) => {
    if (selectedBadge === badgeKey) {
      setSelectedBadge(null); // Deselect if tapped again
    } else {
      setSelectedBadge(badgeKey); // Show options for the selected item
    }
  };

  const renderBadge = ({item}) => {
    // const badge = badgesInfo[badgeKey];
    // const rating = ratings[badgeKey];
    const rating = "2"
    const backgroundColor = rating === true ? '#00A896' : rating === false ? '#FF6B6B' : '#fff';

    return (
      <View style={styles.badgeContainer}>
        <TouchableOpacity
          style={[styles.iconContainer, { backgroundColor }]}
          onPress={() => toggleOptions(item.name)}
        >
          <Ionicons name={item.icon} size={40} color={theme3.primaryColor}/>
          <Text style={styles.badgeText}>{item.name}</Text>
        </TouchableOpacity>
        {selectedBadge === item.name && (
          <View style={styles.ratingContainer}>
            <TouchableOpacity onPress={() => handleRating(item.name, true)}>
              <Ionicons name="thumbs-up" size={20} color={rating === true ? '#00A896' : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRating(item.name, false)}>
              <Ionicons name="thumbs-down" size={20} color={rating === false ? '#FF6B6B' : '#ccc'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.openModalText}>Open Modal</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Leave Your Remarks</Text>

          <FlatList 
          data={badges}
          numColumns={3}
          renderItem={renderBadge}
          />

          {/* <ScrollView contentContainerStyle={styles.badgesContainer}>
            <View style={styles.badgesGrid}>
              {Object.keys(badgesInfo).map((key) => renderBadge(key))}
            </View>
          </ScrollView> */}

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Submit Remarks</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  openModalText: {
    fontSize: 18,
    color: '#00A896',
  },
  modalContainer: {
    flex: 1,
    alignItems:'center',
    backgroundColor: '#022C43',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  badgesContainer: {
    paddingVertical: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    width: '30%',
    margin: 5,
    alignItems: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    top: -30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 100,
    width: '100%',
  },
  badgeText: {
    fontSize: 14,
    color: '#022C43',
    marginTop: 5,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#00A896',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 30,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
});
