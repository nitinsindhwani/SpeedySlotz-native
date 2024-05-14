import React, { useRef } from "react";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from '../../assets/Animated/deals.json'

function DealIcons(){
    const animation = useRef()

    return(
        <AnimatedLottieView 
        autoPlay
        ref={animation}
        style={{
          width: 20,
          height: 20,
        //   alignSelf:'center',
        //   marginTop:20,
          backgroundColor: 'transparent',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={loaderAnimation}
        />
    )
}
export default DealIcons