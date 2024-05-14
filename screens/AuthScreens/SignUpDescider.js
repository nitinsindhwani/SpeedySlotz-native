import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Pressable,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Line from "../../assets/newimage/Line.png";
import OnBoard from "../../assets/newimage/onBoard2.png";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Styles from "../../assets/branding/GlobalStyles";

const WindowWidth = Dimensions.get("window").width;

import Logo from "../../assets/newimage/Logo1.png";

import { theme3 } from "../../assets/branding/themes";

const SignUpDecider = () => {


  const navigation = useNavigation();
  

 
  return (
    <ImageBackground source={OnBoard} style={Styles.Container}>
      <View style={Styles.TopView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-outline"
            style={{ marginLeft: 5 }}
            size={25}
            color="#4C4C4C"
          />
        </TouchableOpacity>

    
      </View>

      <Image source={Logo} style={{ width: 160, height: 160 }} />
     
      <Text
          style={{
            color: "#4C4C4C",
            fontSize: 24,
            // marginLeft: 5,
            marginTop: 7,
            fontWeight: "bold",
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            color: "#4C4C4C",
            fontSize: 24,
            // marginLeft: 5,
            marginTop: 7,
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Text>
        <Text
          style={{
            color: "#4C4C4C",
            fontSize: 24,
            // marginLeft: 5,
            marginTop: 7,
            fontWeight: "bold",
          }}
        >
          As
        </Text>
      
      
      <TouchableOpacity          
       onPress={() => navigation.navigate("SignUpScreen")}
       style={Styles.LoginBtn}>
        <Text style={Styles.LoginTxt}>Customer</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      
      onPress={() => Linking.openURL("http://google.com")}      
      style={[Styles.LoginBtn,{backgroundColor:theme3.secondaryColor}]}>
        <Text style={Styles.LoginTxt}>Service Provider</Text>
      </TouchableOpacity>


 
  

      <View style={{ flexDirection: "row", alignItems: "center" ,marginTop:50}}>
        <Image source={Line} style={{ width: WindowWidth / 2.9, height: 2 }} />
        <Text style={{ color: "#4C4C4C", marginLeft: 10, marginRight: 10 }}>
          Or
        </Text>
        <Image source={Line} style={{ width: WindowWidth / 2.6, height: 2 }} />
      </View>
      <Text style={{ color: theme3.LightTxtClr, marginTop: 20 }}>
        Already Have An Account?{" "}
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={{
            color: theme3.primaryColor,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Login
        </Text>
      </Text>

   
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  Text: {
    color: "#4C4C4C",
    margin: 5,
    fontWeight: "bold",
  },

  PasswordTextView: {
    marginTop: 25,
    flexDirection: "row",
    width: WindowWidth / 1.08,
    justifyContent: "space-between",
  },
  socialView: {
    width: WindowWidth / 1.2,
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  SocialBtn: {
    width: 50,
    height: 50,
    borderRadius: 1000,
    backgroundColor: "#F4F7FD",
    //  borderRadius:8,
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
    opacity: 0.8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 2,
  },
  socialLoginTxt: {
    color: "#4C4C4C",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default SignUpDecider;

//////////////////OLD CODE BELOW///////////////////////////
