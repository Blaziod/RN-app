/* eslint-disable prettier/prettier */
import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
  const systemTheme = useColorScheme(); // Get system theme (light or dark)
  const [theme, setTheme] = useState('system'); // Initialize theme with 'system'

  const setAppTheme = newTheme => {
    setTheme(newTheme);
    AsyncStorage.setItem('appTheme', newTheme);
  };

  const getEffectiveTheme = () => {
    if (theme === 'system') {
      return systemTheme;
    }
    return theme;
  };

  useEffect(() => {
    AsyncStorage.getItem('appTheme').then(storedTheme => {
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme('system'); // Set theme based on system theme if no stored theme
      }
    });
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      setTheme(systemTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    AsyncStorage.setItem('appTheme', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{theme: getEffectiveTheme(), setAppTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
