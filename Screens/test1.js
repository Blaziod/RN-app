/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Button} from 'react-native';

const Test1 = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#000',
      }}>
      <Text>Test 1</Text>
      <Button
        title="Go to Test 2"
        onPress={() => navigation.navigate('Test2')}
      />
    </View>
  );
};

export default Test1;
