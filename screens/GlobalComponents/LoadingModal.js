import React, { useRef } from "react";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from '../../assets/Animated/Loader.json'
import { View,Modal, TouchableOpacity ,Text} from "react-native";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import Header from "./Header";

function LoadingModal({show}){
    const animation = useRef()

    return(
        <Modal
        visible={show}
        transparent={true}
        animationType="slide"
        style={{height:"100%"}}
        >
        <View style={[Styles.Container,{backgroundColor:"rgba(0,0,0,0.4)",justifyContent:'center'}]}> 
        {/* <Header/> */}
        <AnimatedLottieView 
        autoPlay
        loop={true}
        ref={animation}
        style={{
          width: 200,
          height: 200,
          alignSelf:'center',
          marginTop:-20,
          backgroundColor: 'transparent',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={loaderAnimation}
        />



        </View>

    
        </Modal>

    )
}
export default LoadingModal