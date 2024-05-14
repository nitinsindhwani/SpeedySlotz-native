import React, {useContext} from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons'; // Import icons from @expo/vector-icons
import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
import { translation } from "../assets/translations/translations";
import { theme3 } from '../assets/branding/themes';
import Yelp from '../assets/newimage/yelp_logo.png'


const RadiusSlider = ({ radius, setRadius }) => {
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);
  return (
    <View style={styles.container}>
      <Text style={styles.radiusText}>Radius:{radius} miles</Text>
      {/* <View style={{flexDirection:'row',justifyContent:'space-between',width:'90%',marginTop:-20}}>
      <Image
      source= {Yelp}
      style={{width:45,height:18}}
      />

      </View> */}
      <View style={styles.sliderContainer}>
        <Feather
          name="minus"
          size={24}
          color={theme3.primaryColor} // Blue color for the icon
          onPress={() => setRadius(prevRadius => Math.max(prevRadius - 5, 5))}
        />
        <Slider
          style={styles.slider}
          thumbTintColor={theme3.secondaryColor}
          minimumValue={5}
          maximumValue={50}
          step={1}
          value={radius}
          onValueChange={(value) => setRadius(value)}
        />
        <Feather
          name="plus"
          size={24}
          color={theme3.primaryColor} // Blue color for the icon
          onPress={() => setRadius(prevRadius => Math.min(prevRadius + 5, 25))}
        />
      </View>
    </View>
  );
};

const getStyles = (currentTheme) => StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme3.fontColor,
    marginTop: -20,
  },
  sliderContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '90%',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default RadiusSlider;
