import React, { useRef } from "react";
import AnimatedLottieView from "lottie-react-native";
import chatload from '../../assets/Animated/chatload.json'

function ChatAnim(){
    const animation = useRef()

    return(
        <AnimatedLottieView 
        autoPlay
        ref={animation}
        style={{
          width: 23,
          height: 23,
        //   alignSelf:'center',
        //   marginTop:20,
          backgroundColor: 'transparent',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={chatload}
        />
    )
}
export default ChatAnim