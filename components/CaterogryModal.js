import React, { useContext, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme3 } from "../assets/branding/themes";
const width = Dimensions.get("window").width
const height = Dimensions.get("screen").height



const CategoryMOdal = ({

  uniqueCategories,
  handleCategoryPress,
  selectedCategory,
  showCatModal
  
}) => {

 

//  console.log("uniu  queee???", uniqueCategories)

const  renderItem=({item})=>(
    
        <TouchableOpacity
        // key={item?.id}
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item?.name)}
      >
        {/* <View style={styles.categoryImageContainer}> */}
          <Ionicons
            name={item?.iconName}
            size={30}
            color={
              selectedCategory === item?.name
                ? theme3.secondaryColor
                : theme3.primaryColor
            }
          />
        {/* </View> */}
        <Text
          style={[
            styles.categoryName,
            selectedCategory === item?.name
              ? styles.selectedCategoryText
              : null,
          ]}
        >
          {item?.name}
        </Text>
      </TouchableOpacity>
    )

 



  const data = [
    {
        id:1,
        name:"dsd"
    }
  ]

  return (
    <Modal
    visible={showCatModal}
    animationType="slide"
    transparent={true}
    >
    
    <View style={styles.container}> 
        <Text
        style={{fontSize:20,marginTop:50,fontWeight:'bold',color:theme3.fontColor}}
        >
            Please choose a category
        </Text>
        <View
        style={{width:width/1.02}}
        >

     <FlatList
     data={uniqueCategories}
     numColumns={3}
     renderItem={renderItem}
     />
        </View>
     
        
       
    </View>
        
</Modal>
  );
};

const styles = StyleSheet.create({
 container:{

    width:width,
    height:height,
    backgroundColor:theme3.light,
    alignItems:'center',
    // justifyContent:'center'
    // padding:10
 },

  categoryItem: {
    alignItems: "center",
    margin: 2,
    width:width/3.2,
    // backgroundColor:"pink",
    height:80,
    justifyContent:'center'
  },
  categoryImageContainer: {
    padding: 0,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    opacity: 0.8,
  },
  categoryName: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
    color: "#084887",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: theme3.secondaryColor,
    fontWeight: "700",
  },



});

export default CategoryMOdal;
