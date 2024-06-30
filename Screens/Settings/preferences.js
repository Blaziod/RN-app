/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../Components/Contexts/colorTheme';
import {RadioButton} from 'react-native-paper';
import Headers from '../../Components/Headers/Headers';
import {Svg, Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

const PreferencesSettings = () => {
  const navigation = useNavigation();
  const {theme, setAppTheme} = useTheme();
  const [isDarkEnabled, setDarkEnabled] = useState(theme === 'dark');
  const [isLightEnabled, setLightEnabled] = useState(theme === 'light');
  const [isSystemEnabled, setSystemEnabled] = useState(theme === 'system');

  useEffect(() => {
    setDarkEnabled(theme === 'dark');
    setLightEnabled(theme === 'light');
    setSystemEnabled(theme === 'system');
  }, [theme]);

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

  const strokeColor = theme === 'dark' ? '#b1b1b1' : '#000';
  return (
    <ScrollView style={[styles.container, dynamicStyles.AppContainer]}>
      <Headers />
      <View style={{padding: 10}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingVertical: 10,
            paddingBottom: 20,
          }}
          onPress={() => navigation.navigate('Settings')}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill={strokeColor}>
            <Path
              d="M16.3332 7L10.1581 13.175C9.7025 13.6307 9.7025 14.3693 10.1581 14.825L16.3332 21"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </Svg>
          <Text
            style={[
              {
                color: '#fff',
                fontFamily: 'Manrope-Bold',
                fontSize: 20,
              },
              dynamicStyles.TextColor,
            ]}>
            Notifications
          </Text>
        </TouchableOpacity>
        <Text style={[styles.Header2, dynamicStyles.TextColor]}>
          Appearance
        </Text>

        <View>
          <RadioButton.Group
            onValueChange={newValue => setAppTheme(newValue)}
            value={theme}>
            <View style={[styles.row2, dynamicStyles.DivContainer]}>
              <TextInput
                style={[styles.Input2, dynamicStyles.TextColor]}
                placeholder="Dark Mode"
                placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
                editable={theme === 'dark'}
              />
              <RadioButton value="dark" />
            </View>
            <View style={[styles.row2, dynamicStyles.DivContainer]}>
              <TextInput
                style={[styles.Input2, dynamicStyles.TextColor]}
                placeholder="Light Mode"
                placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
                editable={theme === 'light'}
              />
              <RadioButton value="light" />
            </View>
            <View style={[styles.row2, dynamicStyles.DivContainer]}>
              <TextInput
                style={[styles.Input2, dynamicStyles.TextColor]}
                placeholder="System Settings"
                placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
                editable={theme === 'system'}
              />
              <RadioButton value="system" />
            </View>
          </RadioButton.Group>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 14,
    fontFamily: 'Manrope-ExtraBold',
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
    fontFamily: 'Manrope-ExtraBold',
    color: '#fff',
    paddingVertical: 20,
  },
  InputBox: {
    marginTop: 20,
  },
  InputLabel: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
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
