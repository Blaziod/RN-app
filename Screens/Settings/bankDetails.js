/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {useState} from 'react';

const BankSettings = () => {
  return (
    <View>
      <Text>Bank Settings</Text>
      <TextInput placeholder="Enter your name" />
      <TextInput placeholder="Enter your email" />
    </View>
  );
};

export default BankSettings;
