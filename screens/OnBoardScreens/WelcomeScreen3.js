import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
// import { ThemeContext, ThemeProvider } from "../../components/ThemeContext";
// import { translation } from "../../assets/translations/translations";
import { useNavigation } from "@react-navigation/native";
import TopImg from "../../assets/newimage/Ellipse4.png";
import Logo from "../../assets/images/welcome3.png";
import OnBoard from "../../assets/newimage/onBoard1.png";

import { theme3 } from "../../assets/branding/themes";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;
const WelcomeScreen3 = () => {
  // const { currentTheme } = useContext(ThemeContext);
  // const styles = getStyles(currentTheme);
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={OnBoard}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.topSection}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.title}>Adventure Awaits</Text>
        <Text style={styles.paragraph}>
          Ready to get started? Enjoy the freedom to schedule, reschedule, or
          cancel appointments effortlessly. Our intuitive app is designed to
          adapt to your busy life. Say hello to stress-free planning and more
          time enjoying the moments that matter.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={styles.loginBtn}
        >
          <Text style={styles.loginTxt}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpScreen")}
          style={[styles.loginBtn, styles.skipBtn]}
        >
          <Text style={styles.loginTxt}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topSection: {
    marginTop: WindowHeight * 0.1,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#084887",
    textAlign: "center",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#2c3e50",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: WindowHeight * 0.1,
  },
  loginBtn: {
    backgroundColor: "#084887",
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  skipBtn: {
    backgroundColor: "#f9ab55",
  },
  loginTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WelcomeScreen3;

// import React, { useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
// import { translation } from "../assets/translations/translations";
// import { useNavigation } from "@react-navigation/native";

// const WelcomeScreen3 = () => {
//   const { currentTheme } = useContext(ThemeContext);
//   const styles = getStyles(currentTheme);
//   const navigation = useNavigation();

//   return (
//     <ImageBackground
//       source={require("../assets/images/splash_pink.png")}
//       style={styles.backgroundImage}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <View style={styles.middleContent}>
//           <Text style={styles.heading}>Mark It</Text>
//         </View>
//         <View style={styles.header}>
//           <View style={styles.logoContainer}>
//             <Image
//               source={require("../assets/images/splashImage2.png")}
//               style={styles.logo}
//               resizeMode="contain"
//             />
//           </View>
//         </View>
//         <View style={styles.section}>
//         <Text style={styles.title}>Let's get you scheduled!</Text>
//           </View>
//         <View style={styles.buttonSection}>
//           <TouchableOpacity
//             style={styles.buttonPrimary}
//             onPress={() => navigation.navigate("SignUpScreen")}
//           >
//             <Text style={styles.buttonText}>{translation.signup}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.buttonSecondary]}
//             onPress={() => navigation.navigate("LoginScreen")}
//           >
//             <Text style={styles.buttonText}>{translation.login}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const getStyles = (currentTheme) =>
//   StyleSheet.create({
//     backgroundImage: {
//       flex: 1,
//       resizeMode: "cover",
//       justifyContent: "center",
//       alignItems: "center",

//     },
//     container: {
//       flex: 1,
//       justifyContent: "flex-start", // Aligned items at the top
//       alignItems: "center",
//       paddingTop: 80, // Added padding to the top
//       paddingHorizontal: 20,
//       width:"100%"
//     },
//     header: {
//       marginTop: 40,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     logoContainer: {
//       backgroundColor: "#ffffff",
//       borderRadius: 100,
//       padding: 5,
//     },
//     logo: {
//       width: 200,
//       height: 200,
//       borderRadius: 100,
//     },
//     middleContent: {
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     heading: {
//       fontSize: 44,
//       fontFamily: currentTheme.fontFamilyHeading,
//       fontWeight: currentTheme.fontWeight,
//       color: "#ffffff",
//       padding: 5,
//     },
//     text: {
//       fontSize: currentTheme.fontSizeSmall,
//       fontFamily: currentTheme.fontFamilyText,
//       color: currentTheme.secondaryColor,
//     },
//     buttonPrimary: {
//       width: "100%",
//       padding: 15,
//       marginTop: 20,
//       alignItems: "center",
//       backgroundColor: currentTheme.primaryColor,
//     },
//     buttonSecondary: {
//       width: "100%",
//       padding: 15,
//       marginTop: 20,
//       alignItems: "center",
//       backgroundColor: currentTheme.secondaryColor,
//     },
//     buttonText: {
//       fontSize: currentTheme.fontSizeMedium,
//       fontFamily: currentTheme.fontFamilyText,
//       color: currentTheme.whiteColor,
//       fontWeight: currentTheme.fontWeight,
//     },
//     buttonSection: {
//       width: "100%",
//       alignItems: "center",
//       justifyContent: "flex-start", // Aligned items at the top
//     },
//     section: {
//       justifyContent: "center", // Aligned items at the top
//       alignItems: "center",
//       marginTop:146,
//     },
//     title: {
//       fontSize: 32,
//       fontFamily: currentTheme.fontFamilyText,
//       color: currentTheme.primaryColor,
//     },
//     paragraph: {
//       fontSize: 18,
//       fontFamily: currentTheme.fontFamilyText,
//       color: currentTheme.accent3color,// "#f9ab55"
//     },
//   });

// export default WelcomeScreen3;
