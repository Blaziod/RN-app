/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Button, Linking} from 'react-native';

const Test3 = ({}) => {
  const Url_t1 = 'trendit://app/a';
  const Url_t2 = 'trendit://app/b';

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: '#000'}}>Test 2</Text>
      <Button title="Go to Test 1" onPress={() => Linking.openURL(Url_t1)} />
      <Button title="Go to Test 2" onPress={() => Linking.openURL(Url_t2)} />
    </View>
  );
};

export default Test3;
