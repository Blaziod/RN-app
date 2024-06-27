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
import {ApiLink} from '../../enums/apiLink';
import axios from 'axios';

const Headers = () => {
  const {theme, toggleTheme} = useTheme();
  const [userData, setUserData] = useState(null);
  const [userData1, setUserData1] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [userAccessToken, setUserAccessToken] = useState(null);

  useEffect(() => {
    // Your code to run on screen focus
    setIsLoading(true);
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        setIsLoading(false);
        console.log('AccessToken Loading', userAccessToken);

        if (!userAccessToken) {
          // navigation.navigate('SignIn');
          console.log('AccessToken Not found', userAccessToken);
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userdatafiles1');
        if (data) {
          const userData = JSON.parse(data);
          setUserData1(userData);
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

  const checkToken = async () => {
    console.log('starting');
    setIsLoading(true);
    try {
      const response = await axios.get(`${ApiLink.ENDPOINT_1}/profile`, {
        headers: {
          Authorization: `Bearer ${userAccessToken?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(response.data.user_profile, 'userData Fetched');
        setIsLoading(false);
        setUserData(response.data.user_profile);
      } else if (response.status === 401) {
        console.error('Unauthorized: Access token is invalid or expired.');
        setIsLoading(false);
        await AsyncStorage.removeItem('userbalance');
        await AsyncStorage.removeItem('userdata1');
        await AsyncStorage.removeItem('userdata');
        await AsyncStorage.removeItem('userdata2');
        await AsyncStorage.removeItem('userdatas');
        await AsyncStorage.removeItem('userdatafiles1');
        await AsyncStorage.removeItem('accesstoken');
        navigation.navigate('SignIn');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken, userData1]);

  if (!userData) {
    return <ActivityIndicator />;
  }

  const profileImageUri = userData?.profile_picture;

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View
          style={[
            styles.Header,
            {
              backgroundColor:
                theme === 'dark'
                  ? '#000000'
                  : 'rgba(177, 177, 177, 0.20)#FFFFFF',
            },
          ]}>
          <View>
            <View
              style={styles.HeaderContainer}
              onPress={() => navigation.navigate('More', {Screen: 'Settings'})}>
              {profileImageUri ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('More', {Screen: 'Settings'})
                  }
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#CB29BE',
                  }}>
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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('More', {Screen: 'Settings'})
                  }
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#CB29BE',
                  }}>
                  <View
                    style={styles.ProfilePlaceholder}
                    onPress={() => navigation.navigate('More')}>
                    <Text style={styles.ProfilePlaceholderText}>No Image</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View style={styles.UsernameContainer}>
                <Text
                  style={[
                    styles.Name,
                    {color: theme === 'dark' ? '#FFFFFF' : '#000000'},
                  ]}>
                  {userData?.firstname || 'Edit First Name'}{' '}
                  {userData?.lastname || 'Edit Last Name'}
                </Text>
                <Text
                  style={[
                    styles.UserName,
                    {color: theme === 'dark' ? '#FFFFFF' : '#000000'},
                  ]}>
                  @{userData?.username || 'Edit Username'}
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
        </View>
      )}
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
    width: '70%',
    paddingHorizontal: 10,
  },
  ProfileImage: {
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  ProfilePlaceholder: {
    height: 50,
    width: 50,
    borderRadius: 5,
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
