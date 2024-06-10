/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';

import {useTheme} from '../../Components/Contexts/colorTheme';
const ComingSoon = () => {
  const {theme} = useTheme();

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
      backgroundColor: theme === 'dark' ? '#FFF' : '#CB29BE', // Dynamic background color
    },
    Btext: {
      color: theme === 'dark' ? '#FF6DFB' : '#FFF', // Dynamic text color
    },
  });
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
        },
        dynamicStyles.AppContainer,
      ]}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={[
            {
              color: '#fff',
              fontSize: 50,
              fontFamily: 'Manrope-ExtraBold',
              textAlign: 'center',
            },
            dynamicStyles.TextColor,
          ]}>
          Coming Soon!!!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ComingSoon;
