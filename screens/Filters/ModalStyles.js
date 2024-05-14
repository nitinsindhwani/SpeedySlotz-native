import {
  StyleSheet,
 Dimensions
} from 'react-native'
import { Divider } from 'react-native-paper';

// import theme3 from '../GlobalStyles/theme3';
import { theme3 } from '../../assets/branding/themes';
const WindowWidth = Dimensions.get('window').width
const WindowHeight = Dimensions.get('screen').height; 
const styles = StyleSheet.create({ 

  InnerModalContainer:{
    width:WindowWidth,
height:WindowHeight/1.3,
backgroundColor:theme3.ErrorColor,
borderTopLeftRadius:40,
borderTopRightRadius:40,
position:'absolute',
bottom:0,
alignItems:"center"

  },
  CardWrapperTop:{
    width:WindowWidth/1.05,
    padding:17,
    borderRadius:8,
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:theme3.GlobalBg,
    shadowColor:theme3.GlobalBg,
    elevation:2,
    margin:10,
    alignItems:'center'
  },
  CardWrapperALL:{
    width:WindowWidth/1.05,
    // paddingTop:17,
    paddingBottom:10,
    borderRadius:8,
    backgroundColor:theme3.GlobalBg,
    shadowColor:theme3.GlobalBg,
    elevation:2,
    alignItems:"center",
    margin:5

  
  },
  CardWrapperBottom:{
    width:WindowWidth/1.15,
    // padding:17,
    // backgroundColor:"yellow",
    paddingTop:19,
    paddingBottom:19,
    borderRadius:8,
    flexDirection:'row',
    justifyContent:'space-between',
    // margin:20,
    alignItems:'center'
  },
  CardWrapperTextInput:{
    width:WindowWidth/1.15,
    // padding:17,
    // backgroundColor:"yellow",
    paddingTop:12,
    paddingBottom:12,
    borderRadius:8,
    flexDirection:'row',
    justifyContent:'space-between',
    // margin:20,
    alignItems:'center'
  },
  IconWrapper:{width:23},
  SectionTitle:{
    color:theme3.LightTxtClr,
    alignSelf:'flex-start',
    marginLeft:15,
    fontSize:16,
    fontWeight:'600'
  },
  TitleText:{
    color:theme3.LightTxtClr,
    fontWeight:'600',
    fontSize:18,
    marginLeft:15
   },
   textStyle:{
    color:theme3.fontColor,
    fontWeight:'500',
    fontSize:14,
    // marginLeft:15
   },
  

   
})
export default styles