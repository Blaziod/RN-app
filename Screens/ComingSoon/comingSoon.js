/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';

const ComingSoon = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 50,
            fontFamily: 'Campton Bold',
            textAlign: 'center',
          }}>
          Coming Soon!!!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ComingSoon;
