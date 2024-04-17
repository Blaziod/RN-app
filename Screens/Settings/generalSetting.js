/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Headers from '../../Components/Headers/Headers';

const GeneralSetting = () => {
  const navigationHook = useNavigation();
  return (
    <View style={styles.container}>
      <Headers title="General Setting" />
      <Text>General Setting</Text>
      <Button
        title="Go to Home"
        onPress={() => navigationHook.navigate('Home')}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default GeneralSetting;
