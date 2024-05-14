import {
  StyleSheet,

  Dimensions,
  
} from 'react-native';

const WindowWidth = Dimensions.get('window').width
const WindowHeight = Dimensions.get('screen').height; 

import { theme3 } from './themes';

const Styles = StyleSheet.create({
    Container:{
        width:WindowWidth,
        height:WindowHeight,
        alignItems:'center',
        backgroundColor:theme3.backgroundColor
    },
    Header:{
width:WindowWidth,
height:WindowHeight/10,
backgroundColor:theme3.primaryColor,
flexDirection:'row',
justifyContent:"space-between",
alignItems:'center'
    },
    HeaderI:{
      width:WindowWidth/1.18,
      height:WindowHeight/10,
      flexDirection:'row',
      alignItems:'center'
          },
          HeaderText:{color:theme3.light  ,fontSize:18,fontWeight:'bold',marginTop:15},
    TopView:{
   width:WindowWidth/1.08,
   marginTop:30
    },
    Text:{
     color:theme3.fontColor,
     margin:5,
     fontWeight:'bold'
   
    },
    InputView:{
      width:WindowWidth/1.08,
      height:WindowHeight/17,
      borderRadius:8,
      borderColor:'#E1E1E1',
       borderWidth:1,
       alignItems:"center",
       flexDirection:"row"
    },
    LoginBtn:{
        width:WindowWidth/1.2,
        // height:WindowHeight/13,
        padding:17,
        backgroundColor:theme3.primaryColor,
        borderRadius:10,
        marginTop:20,
        justifyContent:'center',
        alignItems:'center'
    },
    LoginTxt:{color:'white',fontWeight:'bold',fontSize:16},
    OneRow:{flexDirection:'row',alignItems:'center'}

    });
 export default Styles   