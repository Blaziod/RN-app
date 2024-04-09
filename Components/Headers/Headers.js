/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Headers = () => {
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
    return (
      <View>
        <Text style={{color: '#000', fontSize: 30}}>HELLO</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.Header}>
        <View style={styles.HeaderContainer}>
          <Image
            source={userData.userdata.profile_picture}
            style={styles.ProfileImage}
          />
          <View style={styles.UsernameContainer}>
            <Text style={styles.Name}>
              {userData.userdata.firstname} {userData.userdata.lastname}
            </Text>
            <Text style={styles.UserName}>@{userData.userdata.username}</Text>
          </View>
          <View style={styles.headerImages}>
            <Image source={require('../../assets/sun.png')} />
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
