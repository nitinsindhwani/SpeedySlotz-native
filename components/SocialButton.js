
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { ThemeContext, ThemeProvider } from "../components/ThemeContext";
import { translation } from "../assets/translations/translations";


const SocialButton = ({ platform, onPress }) => {
  const { currentTheme } = useContext(ThemeContext);
  const styles = getStyles(currentTheme);

  const getButtonStyle = (platform) => {
    switch (platform) {
      case 'Google':
        return [styles.button, styles.googleButton];
      case 'Facebook':
        return [styles.button, styles.facebookButton];
      case 'Apple':
        return [styles.button, styles.appleButton];
      default:
        return styles.button;
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'Google':
        return <FontAwesome name="google" size={20} color="white" />;
      case 'Facebook':
        return <FontAwesome name="facebook" size={20} color="white" />;
      case 'Apple':
        return <AntDesign name="apple1" size={20} color="white" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={getButtonStyle(platform)} onPress={onPress}>
      <View style={styles.iconContainer}>{getSocialIcon(platform)}</View>
      <Text style={styles.buttonText}>{platform}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (currentTheme) => StyleSheet.create({
  button: {
    width: '100%',
    padding: 5,
    marginTop: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: currentTheme.fontSizeMedium,
    fontFamily: currentTheme.fontFamilyText,
    color: currentTheme.whiteColor,
    fontWeight: currentTheme.fontWeight,
  },
  googleButton: {
    backgroundColor: '#DB4437', // Google Red
  },
  facebookButton: {
    backgroundColor: '#1877F2', // Facebook Blue
  },
  appleButton: {
    backgroundColor: '#000000', // Apple Black
  },
});

export default SocialButton;
