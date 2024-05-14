import {
    StyleSheet,
  
    Dimensions,
    
  } from 'react-native';
  
  const WindowWidth = Dimensions.get('window').width
  const WindowHeight = Dimensions.get('screen').height; 
  
import { theme3 } from '../../assets/branding/themes';
  
  const AlertStyles = StyleSheet.create({
      Container:{
          width:WindowWidth,
          height:WindowHeight,
          alignItems:'center',
          backgroundColor:"rgba(0,0,0,0.4)",justifyContent:'center'
      },
      AlertBox:{
        width:WindowWidth/1.2,
        height:WindowHeight/5,
        borderRadius:20,
        backgroundColor:theme3.GlobalBg,
        alignItems:'center',
        padding:10,
        justifyContent:'center'
      },
      Button:{
      padding:10,
      paddingLeft:20,
      paddingRight:20,
      borderRadius:10,
      backgroundColor:theme3.primaryColor,
       
      },
      BtnTxt:{
        color:theme3.GlobalBg,
        fontWeight:'bold'
      },
      AlertTxt:{
        color:theme3.fontColor,
        margin:10,
        textAlign:'center'
      },
      AlertTitle:{
        color:theme3.fontColor,
        fontWeight:'bold',
        fontSize:16
      }
   
  
      });
   export default AlertStyles   