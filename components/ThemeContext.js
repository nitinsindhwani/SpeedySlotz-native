// ThemeContext.js
import React, { createContext, useState } from 'react';
import { theme1, theme2 } from '../assets/branding/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(theme1);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === theme1 ? theme2 : theme1);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};