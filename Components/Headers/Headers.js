/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {Screen} from 'react-native-screens';

const Headers = () => {
  const {theme, toggleTheme} = useTheme();
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userdatafiles1');
        if (data) {
          const userData = JSON.parse(data);
          setUserData(userData);
          console.log('User Data:', userData);
          console.log(
            'Profile Image URL:',
            userData?.userdata?.profile_picture,
          );
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <ActivityIndicator />;
  }

  const profileImageUri = userData?.userdata?.profile_picture;

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
        <View
          style={styles.HeaderContainer}
          onPress={() => navigation.navigate('More', {Screen: 'Settings'})}>
          {profileImageUri ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('More', {Screen: 'Settings'})}>
              <Image
                source={{uri: profileImageUri}}
                style={styles.ProfileImage}
                onError={error => {
                  console.error('Image Load Error:', error);
                }}
                onPress={() => navigation.navigate('More')}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={styles.ProfilePlaceholder}
              onPress={() => navigation.navigate('More')}>
              <Text style={styles.ProfilePlaceholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.UsernameContainer}>
            <Text
              style={[
                styles.Name,
                {color: theme === 'dark' ? '#FFFFFF' : '#000000'},
              ]}>
              {userData?.userdata?.firstname || 'Edit First Name'}{' '}
              {userData?.userdata?.lastname || 'Edit Last Name'}
            </Text>
            <Text
              style={[
                styles.UserName,
                {color: theme === 'dark' ? '#FFFFFF' : '#000000'},
              ]}>
              @{userData?.userdata?.username || 'Edit Username'}
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
    borderRadius: 25,
  },
  ProfilePlaceholder: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfilePlaceholderText: {
    color: '#000000',
    fontSize: 10,
  },
  UsernameContainer: {
    paddingLeft: 20,
    paddingRight: 100,
  },
  Name: {
    color: '#ffffff',
    fontFamily: 'Manrope-Bold',
  },
  UserName: {
    color: '#ffffff',
    fontFamily: 'Manrope-Regular',
  },
  headerImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
  },
});

export default Headers;
