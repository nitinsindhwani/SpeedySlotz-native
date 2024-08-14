import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { theme3 } from '../../assets/branding/themes';

const badges = [
  { name: "Top Rated", icon: "star-outline" },
  { name: "Low Price", icon: "pricetags-outline" },
  { name: "Response Within 1 Hour", icon: "time-outline" },
  { name: "Punctuality Award", icon: "alarm-outline" },
  { name: "Fair Business", icon: "thumbs-up-outline" },
  { name: "Most Busy In The Category", icon: "people-outline" },
  { name: "Customer Loyalty", icon: "heart" },
  { name: "Safety Champion", icon: "shield-alt" },
  { name: "Tech-Savvy", icon: "laptop-code" },
];

export default function RemarkModal({visible,onCLose,onSave}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [positiveRatedBadges, setPositiveRatedBadges] = useState([]);
  const [negativeRatedBadges, setNegativeRatedBadges] = useState([]);
  const [review, setReview] = useState("")

  const toggleOptions = (badgeName) => {
    if (selectedBadge === badgeName) {
      setSelectedBadge(null); // Deselect if tapped again
    } else {
      setSelectedBadge(badgeName); // Show options for the selected item
    }
  };

  const handleRating = (badgeName, rating) => {
    let updatedPositive = [...positiveRatedBadges];
    let updatedNegative = [...negativeRatedBadges];

    if (rating) { // Thumbs Up
      if (positiveRatedBadges.includes(badgeName)) {
        updatedPositive = updatedPositive.filter(b => b !== badgeName);
      } else if (positiveRatedBadges.length < 2) {
        updatedPositive.push(badgeName);
        updatedNegative = updatedNegative.filter(b => b !== badgeName);
      }
    } else { // Thumbs Down
      if (negativeRatedBadges.includes(badgeName)) {
        updatedNegative = updatedNegative.filter(b => b !== badgeName);
      } else if (negativeRatedBadges.length < 2) {
        updatedNegative.push(badgeName);
        updatedPositive = updatedPositive.filter(b => b !== badgeName);
      }
    }

    setPositiveRatedBadges(updatedPositive);
    setNegativeRatedBadges(updatedNegative);
    setSelectedBadge(null); // Hide options after selection
  };

  const renderBadge = ({ item }) => {
    const isPositive = positiveRatedBadges.includes(item.name);
    const isNegative = negativeRatedBadges.includes(item.name);
    const backgroundColor = isPositive ?  "rgba(172, 246, 161, 0.8)" : isNegative ?  "rgba(255, 139, 152, 0.8)" : '#fff';

    return (
      <View style={styles.badgeContainer}>
        <TouchableOpacity
          style={[styles.iconContainer, { backgroundColor }]}
          onPress={() => toggleOptions(item.name)}
        >
          <Ionicons name={item.icon} size={40} color={theme3.primaryColor} />
          <Text style={styles.badgeText}>{item.name}</Text>
        </TouchableOpacity>
        {selectedBadge === item.name && (
          <View style={styles.ratingContainer}>
            <TouchableOpacity onPress={() => handleRating(item.name, true)}>
              <Ionicons name="thumbs-up" size={25} color={isPositive ? theme3.send : theme3.light} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRating(item.name, false)}>
              <Ionicons name="thumbs-down" size={25} color={isNegative ? theme3.danger : theme3.light} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (


      <Modal animationType="slide" transparent={false} visible={visible}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Leave Your Remarks</Text>
          <Text style={{fontSize:14,marginTop:0}}>Leave 2 positive and 2 negative remarks</Text>

<View style={{height:"50%",}}>

<FlatList
            data={badges}
            numColumns={3}
            renderItem={renderBadge}
            keyExtractor={(item) => item.name}
            style={{paddingTop:40}}
          />
</View>
         <Text style={{color:theme3.fontColor,fontWeight:'bold',margin:10,fontSize:18,alignSelf:'flex-start'}}>
            Leave a review
         </Text>
          <View  style={styles.ReviewCOntainer}>
<TextInput
value={review}
onChangeText={(e)=> setReview(e)}
style={{flex:1}}
placeholder='Write a review'
placeholderTextColor={theme3.placeHolder}
multiline={true}
/>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={() => onCLose()}>
            <Text style={styles.closeButtonText}>Submit Remarks</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  openModalText: {
    fontSize: 18,
    color: '#00A896',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme3.fontColor,
    textAlign: 'center',
    // marginBottom: 20,
  },
  badgeContainer: {
    width: '30%',
    margin: 5,
    alignItems: 'center',
    shadowColor:"rgba(0,0,0,0.1)",
    shadowOpacity:2,
    elevation:4
  },
  ratingContainer: {
    position: 'absolute',
    top: -30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical:5,
    borderRadius:20,
    backgroundColor:theme3.primaryColor,shadowColor:"rgba(0,0,0,0.1)",shadowOpacity:1
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
    backgroundColor: theme3.primaryColor,width:"80%",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 30,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  ReviewCOntainer: {
   backgroundColor:theme3.light,
   width:"95%",
   height:"20%",
   borderRadius:20,
   shadowColor:"rgba(0,0,0,0.1)",
   shadowOpacity:1,
   elevation:1,
   padding:10

  },
});
