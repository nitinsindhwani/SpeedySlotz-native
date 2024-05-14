import React from "react";
import { View,Image ,Text} from "react-native";
import { theme3 } from "../../assets/branding/themes";
function NoDataFound(){
    return(
        <View style={{alignSelf:'center',marginTop:40,justifyContent:'center',alignItems:'center'}}>
            <Image 
            style={{width:150,height:150}}
            source={{ uri: 'https://img.icons8.com/cute-clipart/150/nothing-found.png' }}
            />
            <Text style={{color:theme3.fontColor,fontSize:20,marginTop:20,fontWeight:'bold'}}>Sorry no data found</Text>
        </View>
    )
}
export default NoDataFound