import React, { useContext,StyleSheet } from 'react';
import { commonBranding } from '../branding/commonBranding';
import { ThemeContext, ThemeProvider } from '../../components/ThemeContext';


export const commonStyles = (currentTheme) => StyleSheet.create({
  title: {
    fontSize: currentTheme.textBold,
    fontFamily: currentTheme.fontFamilyHeading,
    fontWeight: currentTheme.fontWeight,
    color: currentTheme.primaryColor,
  },
  buttonPrimary: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor:currentTheme.primaryColor,
  },
  buttonSecondary: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor:currentTheme.secondaryColor,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: currentTheme.fontFamilyText,
    color: currentTheme.primaryButtonColor,
    fontWeight: currentTheme.fontWeight,
  },
  logo: {
    width: 200,
    height: 200,
  },

  heading_1: {
    fontSize: currentTheme.fontSizeRegular,
    fontFamily: currentTheme.fontFamilyHeading,
    fontWeight: currentTheme.fontWeight,
    color: currentTheme.headerColor,
  },
  heading_2: {
    fontSize: currentTheme.fontSizeMedium,
    fontFamily: currentTheme.fontFamilyHeading,
    fontWeight: currentTheme.fontWeight,
    color: currentTheme.headerColor,
  },
  heading_3: {
    fontSize: currentTheme.fontSizeSmall,
    fontFamily: currentTheme.fontFamilyHeading,
    fontWeight: currentTheme.fontWeight,
    color: currentTheme.headerColor,
  },
  textBold: {
    fontSize: currentTheme.fontSizeRegular,
    fontWeight: currentTheme.fontWeight,
    color: currentTheme.primaryTextColor,
  },
  textRegular: {
    fontSize: currentTheme.fontSizeMedium,
    fontWeight: currentTheme.fontWeight,
    color: currentTheme.primaryTextColor,
  },
  textSmall: {
    fontSize: currentTheme.fontSizeSmall,
    fontWeight: currentTheme.fontWeight,
    color: currentTheme.primaryTextColor,
  },
  text: {
    fontSize: currentTheme.fontSizeSmall,
    color: currentTheme.primaryTextColor,
  },
  
});
