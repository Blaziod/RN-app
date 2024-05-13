/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../Contexts/colorTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Headers = () => {
  const {theme, toggleTheme} = useTheme();
  const [userData, setUserData] = useState(null);
  AsyncStorage.getItem('userdatafiles1')
    .then(data => {
      // eslint-disable-next-line no-shadow
      const userData = JSON.parse(data);
      setUserData(userData);
    })
    .catch(error => {
      console.error('Error retrieving user data:', error);
    });

  if (!userData) {
    return <ActivityIndicator />;
  }
  return (
    <>
      <View
        style={[
          styles.Header,
          {
            backgroundColor:
              theme === 'dark' ? '#000000' : 'rgba(177, 177, 177, 0.20)#FFFFFF',
          },
        ]}>
        <View style={styles.HeaderContainer}>
          <Image
            source={{uri: userData?.userdata?.profile_picture}}
            style={styles.ProfileImage}
          />
          <View style={styles.UsernameContainer}>
            <Text
              style={[
                styles.Name,
                {color: theme === 'dark' ? '#FFFFFF' : '#000000'},
              ]}>
              {userData?.userdata?.firstname} {userData?.userdata?.lastname}
            </Text>
            <Text
              style={[
                styles.UserName,
                {color: theme === 'dark' ? '#FFFFFF' : '#000000'},
              ]}>
              @{userData?.userdata.username}
            </Text>
          </View>
          <View style={styles.headerImages}>
            <TouchableOpacity onPress={toggleTheme}>
              <Image source={require('../../assets/sun.png')} />
            </TouchableOpacity>
            <Image source={require('../../assets/alt.png')} />
          </View>
        </View>
      </View>
      <View style={{paddingBottom: 10}} />
    </>
  );
};

const styles = StyleSheet.create({
  Header: {
    paddingVertical: 10,
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#000000',
  },
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ProfileImage: {
    height: 50,
    width: 50,
  },
  UsernameContainer: {
    paddingLeft: 20,
    paddingRight: 100,
  },
  Name: {
    color: '#ffffff',
    fontFamily: 'CamptonSemiBold',
  },
  UserName: {
    color: '#ffffff',
    fontFamily: 'CamptonBook',
  },
  headerImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
  },
});

export default Headers;
