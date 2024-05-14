import React, { useRef } from "react";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from '../../assets/Animated/Loader.json'
import { View,Modal, TouchableOpacity ,Text} from "react-native";
import Styles from "../../assets/branding/GlobalStyles";
import { theme3 } from "../../assets/branding/themes";
import Header from "./Header";
import AlertStyles from "./AlertStyling";

function ErrorAlert({show,onAction,title,body}){
    const animation = useRef()

    return(
        <Modal
        visible={show}
        transparent={true}
        animationType="slide"
        style={{height:"100%"}}
        >
        <View style={AlertStyles.Container}> 
        {/* <Header/> */}
    <View style={AlertStyles.AlertBox}>
<Text style={AlertStyles.AlertTitle}>
{title}
</Text>
<Text style={AlertStyles.AlertTxt}>
    {body} 
</Text>
<TouchableOpacity
onPress={()=> onAction()}
style={AlertStyles.Button}>
<Text style={AlertStyles.BtnTxt}>
Okay
</Text>
</TouchableOpacity>
    </View>



        </View>

        </Modal>

    )
}
export default ErrorAlert