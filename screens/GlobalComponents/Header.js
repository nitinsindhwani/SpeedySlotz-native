import React from "react";
import { View,Text, TouchableOpacity } from "react-native";
import Styles from "../../assets/branding/GlobalStyles";
import { Ionicons } from '@expo/vector-icons';
import { theme3 } from "../../assets/branding/themes";
import { useNavigation } from "@react-navigation/native";
function Header({title}){
    const naviation = useNavigation()
return(
    <View  style={Styles.Header}>

<TouchableOpacity
onPress={()=>naviation.goBack()}
>

<Ionicons name="chevron-back" size={24} color={theme3.light} style={{marginTop:15,marginLeft:10}}/>
</TouchableOpacity>


{/* <View style={{flex:1}}> */}


<Text style={Styles.HeaderText}>{title}</Text>
<Ionicons name="chevron-back" size={24} color={"transparent"} />

{/* </View> */}
   </View>
)
}
export default Header