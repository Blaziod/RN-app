/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Button} from 'react-native';

const Test2 = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Test 2</Text>
      <Button
        title="GO TO LINKING"
        onPress={() => navigation.navigate('Test3')}
      />
    </View>
  );
};

export default Test2;
