/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TextInput, StyleSheet, Switch} from 'react-native';
import {useState} from 'react';

const PreferencesSettings = () => {
  const [isDarkEnabled, setDarkEnabled] = useState(false);
  const [isLightEnabled, setLightEnabled] = useState(false);
  const [isSystemEnabled, setSystemEnabled] = useState(false);

  // Define colors for light and dark themes
  const themeColors = {
    dark: {
      backgroundColor: '#121212',
      textColor: '#ffffff',
      inputBackgroundColor: '#1C1C1C',
      placeholderTextColor: '#ffffff',
    },
    light: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      inputBackgroundColor: '#f0f0f0',
      placeholderTextColor: '#000000',
    },
  };

  const currentTheme = isLightEnabled ? themeColors.light : themeColors.dark;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.backgroundColor},
      ]}>
      <Text style={[styles.Header2, {color: currentTheme.textColor}]}>
        Appearance
      </Text>

      <View>
        <View
          style={[
            styles.row,
            {backgroundColor: currentTheme.inputBackgroundColor},
          ]}>
          <TextInput
            style={[
              styles.Input2,
              {
                backgroundColor: currentTheme.inputBackgroundColor,
                color: currentTheme.textColor,
              },
            ]}
            placeholder="Dark Mode"
            placeholderTextColor={currentTheme.placeholderTextColor}
            editable={isDarkEnabled}
          />
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isDarkEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={newValue => {
              setDarkEnabled(newValue);
              if (newValue) {
                setLightEnabled(false);
                setSystemEnabled(false);
              }
            }}
            value={isDarkEnabled}
          />
        </View>
        <View
          style={[
            styles.row2,
            {backgroundColor: currentTheme.inputBackgroundColor},
          ]}>
          <TextInput
            style={[
              styles.Input2,
              {
                backgroundColor: currentTheme.inputBackgroundColor,
                color: currentTheme.textColor,
              },
            ]}
            placeholder="Light Mode"
            placeholderTextColor={currentTheme.placeholderTextColor}
            editable={isLightEnabled}
          />
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isLightEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={newValue => {
              setLightEnabled(newValue);
              if (newValue) {
                setDarkEnabled(false);
                setSystemEnabled(false);
              }
            }}
            value={isLightEnabled}
          />
        </View>
        <View
          style={[
            styles.row2,
            {backgroundColor: currentTheme.inputBackgroundColor},
          ]}>
          <TextInput
            style={[
              styles.Input2,
              {
                backgroundColor: currentTheme.inputBackgroundColor,
                color: currentTheme.textColor,
              },
            ]}
            placeholder="System Settings"
            placeholderTextColor={currentTheme.placeholderTextColor}
            editable={isSystemEnabled}
          />
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isSystemEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={newValue => {
              setSystemEnabled(newValue);
              if (newValue) {
                setDarkEnabled(false);
                setLightEnabled(false);
              }
            }}
            value={isSystemEnabled}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 14,
    fontFamily: 'Campton Bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
    marginTop: 5,
  },
  Header2: {
    fontSize: 14,
    fontFamily: 'Campton Bold',
    color: '#fff',
    paddingVertical: 20,
  },
  InputBox: {
    marginTop: 20,
  },
  InputLabel: {
    fontSize: 12,
    fontFamily: 'CamptonMedium',
    color: '#fff',
  },
  Input: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  Input2: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    marginTop: 5,
    padding: 10,
  },
});

export default PreferencesSettings;
