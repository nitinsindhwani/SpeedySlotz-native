import {
    StyleSheet,
    Dimensions
} from 'react-native'
import { Button } from 'react-native-paper';
// import theme3 from '../GlobalStyles/colors';
import { theme3 } from '../../assets/branding/themes';
const WindowWidth = Dimensions.get('window').width
const WindowHeight = Dimensions.get('window').height;
const NotifStyle = StyleSheet.create({
    Container: {
        width: WindowWidth,
        height: WindowHeight,
        backgroundColor: theme3.backgroundColor,
        // alignItems: "center",

    },
    HeaderText:{
        color:theme3.fontColorI,
        fontWeight:'bold',
        fontSize:30,
        margin:15,
        marginTop:10,
    },
    TrickContainer:{
        width:WindowWidth,
        // height:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        // borderBottomWidth:1,
        borderColor:theme3.placeHolder,
        alignSelf:"center",
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:theme3.GlobalBg,
        marginBottom:7,

        // marginBottom:15,
        alignItems:'center'
    },
    IconWrapper:{

        // backgroundColor:theme3.bgIII,
        
        // width:50,
        
        // height:50,
        
        borderRadius:1000,
        
        borderWidth:0.5,
        
        borderColor:theme3.secondaryColor,
        
        justifyContent:'center',
        
        alignItems:'center',
        marginLeft:5
      
      },

      InnerTricks:{
        width:WindowWidth/1.3,
        marginLeft:15,
        // height:20,
        
    },
    TransactionText:{
        
        fontWeight:"bold",
        fontSize:16 
        },
       ModalDetail:{
        width:WindowWidth,
        height:WindowHeight/2.5,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor:theme3.BgColorII,
        alignSelf:'flex-end'
       },
       ModalHeader:{
        flexDirection:"row",
        alignSelf:"center",
        margin:10,
        marginTop:10,
        // justifyContent:'space-evenly',
        width:WindowWidth/1.1,
        alignItems:"center",
        // backgroundColor:'red',
        padding:10,
        borderBottomWidth:0.5,

        borderColor:theme3.primaryColor
       },
       ModalTitles:{
        color:theme3.fontColorI,
        fontWeight:'bold',
        fontSize:18

       },
       ModalBelowTitles:{
        color:theme3.fontColorI,
        fontWeight:'400',
        fontSize:16

       },
       TextStyle:{fontWeight:'400',fontSize:16,color:theme3.fontColorI}

});

export default NotifStyle