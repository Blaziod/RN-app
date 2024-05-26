/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TextInput, StyleSheet, Switch} from 'react-native';
import {useState} from 'react';
import {useTheme} from '../../Components/Contexts/colorTheme';

const PreferencesSettings = () => {
  const [isDarkEnabled, setDarkEnabled] = useState(false);
  const [isLightEnabled, setLightEnabled] = useState(false);
  const [isSystemEnabled, setSystemEnabled] = useState(false);
  const {theme, toggleTheme} = useTheme();

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#171717' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
    },
    TextColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamic text color
    },
    Button: {
      backgroundColor: theme === 'dark' ? '#FFF' : '#CB29BE',
    },
    Btext: {
      color: theme === 'dark' ? '#FF6DFB' : '#FFF',
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.AppContainer]}>
      <Text style={[styles.Header2, dynamicStyles.TextColor]}>Appearance</Text>

      <View>
        <View style={[styles.row2, dynamicStyles.DivContainer]}>
          <TextInput
            style={[styles.Input2, dynamicStyles.TextColor]}
            placeholder="Dark Mode"
            placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
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
            onPress={toggleTheme}
          />
        </View>
        <View
          style={[styles.row2, dynamicStyles.DivContainer]}
          onPress={toggleTheme}>
          <TextInput
            style={[styles.Input2, dynamicStyles.TextColor]}
            placeholder="Light Mode"
            placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
            editable={isLightEnabled}
            onPress={toggleTheme}
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
            onPress={toggleTheme}
          />
        </View>
        <View style={[styles.row2, dynamicStyles.DivContainer]}>
          <TextInput
            style={[styles.Input2, dynamicStyles.TextColor]}
            placeholder="System Settings"
            placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
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
    color: '#fff',
    marginTop: 5,
    padding: 10,
  },
});

export default PreferencesSettings;
