/* eslint-disable prettier/prettier */
import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState('dark'); // Default to dark mode

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    AsyncStorage.setItem('appTheme', newTheme);
  };

  // Load theme from storage
  useEffect(() => {
    AsyncStorage.getItem('appTheme').then(storedTheme => {
      if (storedTheme) {
        setTheme(storedTheme);
      }
    });
  }, []);

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
