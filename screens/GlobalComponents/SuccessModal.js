import React, { useRef } from "react";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from '../../assets/Animated/success.json'
import { View,Modal, TouchableOpacity ,Text} from "react-native";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import Header from "./Header";

function SuccessModal({show,onBack,title}){
    const animation = useRef()

    return(
        <Modal
        visible={show}
        transparent={true}
        animationType="slide"
        >
        <View style={[Styles.Container,{backgroundColor:"white",justifyContent:'center'}]}> 
        {/* <Header/> */}
        <AnimatedLottieView 
        autoPlay
        loop={false}
        ref={animation}
        style={{
          width: 200,
          height: 200,
          alignSelf:'center',
          marginTop:-100,
          backgroundColor: 'transparent',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={loaderAnimation}
        />

<Text style={{color:theme3.fontColor,fontSize:28,fontWeight:'bold',marginTop:-20}}>
            {title}
        </Text>
        <Text 
        onPress={()=>onBack(false)}
        style={{color:theme3.secondaryColor,fontSize:18,marginTop:0,textDecorationLine:'underline'}}>
            Lets Go Back.
        </Text>

        </View>

    
        </Modal>

    )
}
export default SuccessModal