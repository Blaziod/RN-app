/* eslint-disable prettier/prettier */
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
    return null;
  }

  return (
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
  );
};

const styles = StyleSheet.create({
  Header: {
    paddingTop: 20,
    justifyContent: 'center',
    paddingBottom: 17,
  },
  HeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    height: 66,
    alignItems: 'center',
  },
  ProfileImage: {
    height: 60,
    width: 60,
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
