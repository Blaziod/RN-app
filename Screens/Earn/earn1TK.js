/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Headers from '../../Components/Headers/Headers';
import Earn1TKMenu from '../../Components/Menus/earn1TKMenu';
import Earn1CustomSwitch from '../../Components/CustomSwitches/earn1CustomSwitch';
import {Svg, Path} from 'react-native-svg';
import Earn1Image from '../../assets/SVG/earn1Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import InReviewTwitterMenu from '../../Components/Menus/inReviewTwitterMenu';
import FailedEarnersTask from '../../Components/Menus/failedEarnTask';
import {ApiLink} from '../../enums/apiLink';

const Earn1TK = ({navigation}) => {
  const [earnMenu, setEarnMenu] = useState(1);
  const [link, setLink] = useState('');
  const deviceHeight = Dimensions.get('window').height;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userSocials, setUserSocials] = useState(null);
  const [availableTasks, setAvailableTasks] = useState(null);

  const onSelectSwitch = value => {
    setEarnMenu(value);
  };

  const fetchUserAccessToken = () => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        // eslint-disable-next-line no-shadow
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        console.log('AccessToken Loading');

        if (!userAccessToken) {
          navigation.navigate('SignIn');
          console.log('AccessToken Not found', userAccessToken);
        }
      })
      .catch(error => {
        console.error('Error retrieving user token:', error);
      });
  };
  useEffect(() => {
    fetchUserAccessToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const sendLinkData = async type => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${ApiLink.ENDPOINT_1}/send_social_verification_request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`,
          },
          body: JSON.stringify({
            link: link,
            type: 'tiktok',
          }),
        },
      );
      const data = await response.json();
      if (response.ok && (response.status === 200 || response.status === 201)) {
        console.log('Success: Link successfully submitted.');
        console.log(data.message);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Your Tiktok account has been submitted for review',
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 14,
          },
          text2Style: {
            color: 'green',
            fontSize: 14,
            fontFamily: 'Manrope-ExtraBold',
          },
        });
        setIsModalVisible(false);
        setLink('');
        fetchSocialLinks();
      } else if (response.status === 401) {
        console.error('Unauthorized: Access token is invalid or expired.');
        await AsyncStorage.removeItem('userbalance');
        await AsyncStorage.removeItem('userdata1');
        await AsyncStorage.removeItem('userdata');
        await AsyncStorage.removeItem('userdata2');
        await AsyncStorage.removeItem('userdatas');
        await AsyncStorage.removeItem('userdatafiles1');
        await AsyncStorage.removeItem('accesstoken');

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 14,
          },
          text2Style: {
            color: 'green',
            fontSize: 14,
            fontFamily: 'Manrope-ExtraBold',
          },
        });
        navigation.navigate('SignIn');
      } else {
        console.error('Error:', response);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 14,
          },
          text2Style: {
            color: 'green',
            fontSize: 14,
            fontFamily: 'Manrope-ExtraBold',
          },
        });
      }
    } catch (error) {
      // Handle network or other errors
      console.error(`Error: ${error}`);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        style: {
          borderLeftColor: 'pink',
          backgroundColor: 'yellow',
          width: '80%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        },
        text1Style: {
          color: 'red',
          fontSize: 14,
        },
        text2Style: {
          color: 'green',
          fontSize: 14,
          fontFamily: 'Manrope-ExtraBold',
        },
      });
    } finally {
      setIsLoading(false); // Reset loading state regardless of the outcome
    }
  };
  const fetchSocialLinks = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await fetch(`${ApiLink.ENDPOINT_1}/verified_socials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`, // Add the access token to the headers
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Successful', data);
          AsyncStorage.setItem(
            'sociallinks',
            JSON.stringify({
              facebook: data.facebook,
              tiktok: data.tiktok,
              x: data.x,
              instagram: data.instagram,
            }),
          )
            .then(() => {
              setUserSocials(data);
              console.log('Socials Stored');
            })
            .catch(error => {
              console.error('Error storing user Socials:', error);
            });
          setIsLoading(false);
        } else {
          if (response.status === 401) {
            console.log('401 Unauthorized: Access token is invalid or expired');
            await AsyncStorage.removeItem('userbalance');
            await AsyncStorage.removeItem('userdata1');
            await AsyncStorage.removeItem('userdata');
            await AsyncStorage.removeItem('userdata2');
            await AsyncStorage.removeItem('userdatas');
            await AsyncStorage.removeItem('userdatafiles1');
            await AsyncStorage.removeItem('accesstoken');
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignIn',
                },
              ],
            });
          }
          setIsLoading(false);
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error during balance fetch:', error);
      }
    } else {
      console.log('No access token found');
    }
  };

  useEffect(() => {
    if (userAccessToken) {
      fetchSocialLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  const fetchAvailableTasks = async () => {
    if (userAccessToken) {
      try {
        const response = await fetch(
          `${ApiLink.ENDPOINT_1}/tasks/advert/Tiktok`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAccessToken.accessToken}`,
            },
          },
        );
        const data = await response.json();

        if (response.ok) {
          setAvailableTasks(data);
          console.log('Tasks:', data);
        } else {
          if (response.status === 401) {
            console.log('401 Unauthorized: Access token is invalid or expired');
            await AsyncStorage.removeItem('userbalance');
            await AsyncStorage.removeItem('userdata1');
            await AsyncStorage.removeItem('userdata');
            await AsyncStorage.removeItem('userdata2');
            await AsyncStorage.removeItem('userdatas');
            await AsyncStorage.removeItem('userdatafiles1');
            await AsyncStorage.removeItem('accesstoken');
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignIn',
                },
              ],
            });
          }
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error during Tasks fetch:', error);
      }
    }
  };

  useEffect(() => {
    fetchAvailableTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  return (
    <SafeAreaView style={styles.AppContainer}>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            padding: 20,
            justifyContent: 'center',
          }}>
          <>
            <SafeAreaView>
              <View
                style={{
                  backgroundColor: '#121212',
                  width: '100%',
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  maxHeight: deviceHeight * 0.7,
                  position: 'relative',
                }}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    position: 'absolute',
                    top: -10,
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setIsModalVisible(false)}>
                  <View
                    style={{
                      backgroundColor: '#FF6DFB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      position: 'absolute',
                      top: -20,
                      alignSelf: 'flex-end',
                    }}>
                    <Svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        d="M18 6L6 18M18 18L6 6.00001"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </Svg>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 30,
                  }}>
                  <View>
                    <Svg
                      width="48"
                      height="48"
                      viewBox="0 0 47 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        d="M34.8307 17.5134C38.2597 19.6762 42.4604 20.9488 46.9973 20.9488V13.2457C46.1386 13.2458 45.2822 13.1667 44.4422 13.0097V19.0732C39.9057 19.0732 35.7055 17.8008 32.2758 15.6381V31.3582C32.2758 39.2222 25.0507 45.5967 16.1389 45.5967C12.8137 45.5967 9.72286 44.7097 7.15546 43.1884C10.0858 45.8322 14.1723 47.4722 18.6933 47.4722C27.6058 47.4722 34.8311 41.0977 34.8311 33.2333V17.5134H34.8307ZM37.9828 9.7419C36.2303 8.05266 35.0796 5.86959 34.8307 3.45606V2.46533H32.4094C33.0189 5.53281 35.098 8.15347 37.9828 9.7419ZM12.7922 37.1539C11.8131 36.0213 11.2839 34.6355 11.2862 33.2108C11.2862 29.6142 14.5909 26.6979 18.6681 26.6979C19.4278 26.6975 20.183 26.8005 20.9073 27.0031V19.1276C20.0609 19.0254 19.2069 18.9818 18.3533 18.9978V25.1276C17.6287 24.9249 16.8731 24.822 16.113 24.8226C12.036 24.8226 8.73151 27.7385 8.73151 31.3356C8.73151 33.8792 10.3832 36.0812 12.7922 37.1539Z"
                        fill="#FF004F"
                      />
                      <Path
                        d="M32.2758 15.638C35.7057 17.8006 39.9055 19.073 44.4422 19.073V13.0095C41.9098 12.5335 39.6681 11.366 37.9826 9.7419C35.0976 8.1533 33.0189 5.53265 32.4094 2.46533H26.0496V33.233C26.0351 36.8199 22.7361 39.7242 18.6677 39.7242C16.2705 39.7242 14.1406 38.7159 12.7918 37.1538C10.3832 36.0812 8.73132 33.879 8.73132 31.3358C8.73132 27.739 12.0358 24.8227 16.1128 24.8227C16.894 24.8227 17.6468 24.93 18.3531 25.1278V18.998C9.59764 19.1576 2.55634 25.4699 2.55634 33.2331C2.55634 37.1085 4.30973 40.6217 7.15563 43.1887C9.72303 44.7097 12.8136 45.5971 16.1391 45.5971C25.0511 45.5971 32.276 39.2221 32.276 31.3582L32.2758 15.638Z"
                        fill="black"
                      />
                      <Path
                        d="M44.4423 13.0092V11.37C42.1587 11.3731 39.9203 10.8088 37.9828 9.74172C39.6978 11.3984 41.9561 12.5409 44.4423 13.0095M32.4094 2.46498C32.3513 2.1719 32.3067 1.87685 32.2758 1.58057V0.589844H23.4943V31.3578C23.4803 34.9444 20.1813 37.8487 16.1128 37.8487C14.9594 37.8502 13.8218 37.6122 12.7918 37.1539C14.1406 38.7158 16.2705 39.7238 18.6677 39.7238C22.7359 39.7238 26.0352 36.8199 26.0496 33.233V2.46514L32.4094 2.46498ZM18.3536 18.9976V17.2523C17.6198 17.1638 16.88 17.1195 16.1394 17.1197C7.22648 17.1197 0.00158691 23.4946 0.00158691 31.3578C0.00158691 36.2878 2.84106 40.6325 7.15598 43.1882C4.31009 40.6214 2.55669 37.108 2.55669 33.2328C2.55669 25.4697 9.59781 19.1573 18.3536 18.9976Z"
                        fill="#00F2EA"
                      />
                    </Svg>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 400,
                      fontFamily: 'Manrope-Regular',
                      textAlign: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                    }}>
                    Link Your Tiktok Account
                  </Text>
                </View>
                <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
                  <Text
                    style={{fontSize: 12, paddingTop: 10, paddingBottom: 10}}>
                    You must obey the following rules in order to successfully
                    link your Tiktok account to Trendti3.
                  </Text>
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <Text style={{fontSize: 12}}>1.</Text>
                    <Text style={{fontSize: 12}}>
                      Your account on Tiktok must have at least 500 Active
                      Followers. Note that Ghost or Bots followers are not
                      allowed and your account on Trendit³ will be banned if you
                      have ghost followers
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>2.</Text>
                    <Text style={{fontSize: 12}}>
                      You Account on Tiktok must have been opened one year ago.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>3.</Text>
                    <Text style={{fontSize: 12}}>
                      You must have posted at least five times on your Tiktok
                      account within the last one year
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(47, 47, 47, 0.42)',
                    borderRadius: 10,
                    height: 200,
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#fff',
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}>
                    Please enter your Tiktok profile link which you want to use
                    to perform this task:{' '}
                  </Text>
                  <View style={{paddingVertical: 20}}>
                    <TextInput
                      placeholder="Facebook profile  link"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        padding: 5,
                      }}
                      placeholderTextColor={'#888'}
                      value={link}
                      selectionColor={'#000'}
                      onChangeText={setLink}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: '#CB29BE',
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '50%',
                      borderRadius: 110,
                    }}
                    onPress={() => sendLinkData(link, 'Facebook')}
                    disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'Manrope-Regular',
                          fontSize: 14,
                        }}>
                        Link Account
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </>
        </View>
      </Modal>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Headers />
          <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
            <TouchableOpacity
              style={{flexDirection: 'row', gap: 5}}
              onPress={() => navigation.navigate('Earn')}>
              {/* <Left /> */}
              <Text style={{color: '#FFD0FE', paddingBottom: 20}}>Go Back</Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: '#fff',
                height: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                paddingVertical: 20,
              }}>
              <View style={{position: 'absolute', top: 0}}>
                <Earn1Image />
              </View>
              <View style={{paddingTop: 30}}>
                <Svg
                  width="48"
                  height="48"
                  viewBox="0 0 47 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M34.8307 17.5134C38.2597 19.6762 42.4604 20.9488 46.9973 20.9488V13.2457C46.1386 13.2458 45.2822 13.1667 44.4422 13.0097V19.0732C39.9057 19.0732 35.7055 17.8008 32.2758 15.6381V31.3582C32.2758 39.2222 25.0507 45.5967 16.1389 45.5967C12.8137 45.5967 9.72286 44.7097 7.15546 43.1884C10.0858 45.8322 14.1723 47.4722 18.6933 47.4722C27.6058 47.4722 34.8311 41.0977 34.8311 33.2333V17.5134H34.8307ZM37.9828 9.7419C36.2303 8.05266 35.0796 5.86959 34.8307 3.45606V2.46533H32.4094C33.0189 5.53281 35.098 8.15347 37.9828 9.7419ZM12.7922 37.1539C11.8131 36.0213 11.2839 34.6355 11.2862 33.2108C11.2862 29.6142 14.5909 26.6979 18.6681 26.6979C19.4278 26.6975 20.183 26.8005 20.9073 27.0031V19.1276C20.0609 19.0254 19.2069 18.9818 18.3533 18.9978V25.1276C17.6287 24.9249 16.8731 24.822 16.113 24.8226C12.036 24.8226 8.73151 27.7385 8.73151 31.3356C8.73151 33.8792 10.3832 36.0812 12.7922 37.1539Z"
                    fill="#FF004F"
                  />
                  <Path
                    d="M32.2758 15.638C35.7057 17.8006 39.9055 19.073 44.4422 19.073V13.0095C41.9098 12.5335 39.6681 11.366 37.9826 9.7419C35.0976 8.1533 33.0189 5.53265 32.4094 2.46533H26.0496V33.233C26.0351 36.8199 22.7361 39.7242 18.6677 39.7242C16.2705 39.7242 14.1406 38.7159 12.7918 37.1538C10.3832 36.0812 8.73132 33.879 8.73132 31.3358C8.73132 27.739 12.0358 24.8227 16.1128 24.8227C16.894 24.8227 17.6468 24.93 18.3531 25.1278V18.998C9.59764 19.1576 2.55634 25.4699 2.55634 33.2331C2.55634 37.1085 4.30973 40.6217 7.15563 43.1887C9.72303 44.7097 12.8136 45.5971 16.1391 45.5971C25.0511 45.5971 32.276 39.2221 32.276 31.3582L32.2758 15.638Z"
                    fill="black"
                  />
                  <Path
                    d="M44.4423 13.0092V11.37C42.1587 11.3731 39.9203 10.8088 37.9828 9.74172C39.6978 11.3984 41.9561 12.5409 44.4423 13.0095M32.4094 2.46498C32.3513 2.1719 32.3067 1.87685 32.2758 1.58057V0.589844H23.4943V31.3578C23.4803 34.9444 20.1813 37.8487 16.1128 37.8487C14.9594 37.8502 13.8218 37.6122 12.7918 37.1539C14.1406 38.7158 16.2705 39.7238 18.6677 39.7238C22.7359 39.7238 26.0352 36.8199 26.0496 33.233V2.46514L32.4094 2.46498ZM18.3536 18.9976V17.2523C17.6198 17.1638 16.88 17.1195 16.1394 17.1197C7.22648 17.1197 0.00158691 23.4946 0.00158691 31.3578C0.00158691 36.2878 2.84106 40.6325 7.15598 43.1882C4.31009 40.6214 2.55669 37.108 2.55669 33.2328C2.55669 25.4697 9.59781 19.1573 18.3536 18.9976Z"
                    fill="#00F2EA"
                  />
                </Svg>
              </View>

              <View
                style={{
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    fontFamily: 'Manrope-ExtraBold',
                    textAlign: 'center',
                    paddingBottom: 5,
                    color: '#000',
                  }}>
                  Post advert on Tiktok
                </Text>
                <Text
                  style={{
                    fontFamily: 'Manrope-Medium',
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#000',
                    paddingBottom: 10,
                  }}>
                  Post adverts of various Individuals businesses and top brands
                  on your Tiktok page and earn ₦110 per posted advert. The more
                  you post, the more you earn. Please note that your Tiktok page
                  must have at least 500 active followers to be eligible for
                  this task.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(55, 147, 255, 0.13)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                  }}>
                  <Text style={{color: '#1877f2'}}>
                    {availableTasks?.total} Tasks Available
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View>
                {userSocials?.tiktok_verified && (
                  <View>
                    <View style={styles.ProfileSetUp}>
                      <View style={styles.ProfileTexting}>
                        <Text style={styles.SetUpText}>
                          Your Tiktok Profile Account
                        </Text>
                        <Text style={styles.SetUpSubText}>
                          Your Tiktok task must be done from the above Tiktok
                          Profile which has been linked to your Trendit³ account
                        </Text>
                        <View style={{paddingTop: 10}} />
                        <TouchableOpacity style={styles.GotoButton3}>
                          <View style={{width: '60%'}}>
                            <Text style={styles.GotoText2}>
                              {userSocials?.x_link}
                            </Text>
                          </View>

                          <Text style={styles.GotoText3}>verified</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.IconAA}>
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none">
                          <Path
                            d="M18 6.89026L6 18.8903M18 18.8903L6 6.89027"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                        </Svg>
                      </View>
                    </View>
                    <View style={{paddingTop: 20}}>
                      <Earn1CustomSwitch
                        selectionMode={1}
                        option1="Pending"
                        option2="In review"
                        option5="Failed"
                        onSelectSwitch={onSelectSwitch}
                      />
                    </View>

                    {earnMenu === 1 && (
                      <View style={{paddingVertical: 15}}>
                        <Earn1TKMenu />
                      </View>
                    )}
                    {earnMenu === 2 && (
                      <View style={{paddingVertical: 15}}>
                        <InReviewTwitterMenu />
                      </View>
                    )}
                    {earnMenu === 3 && <FailedEarnersTask />}
                    {earnMenu === 4}

                    {earnMenu === 5}
                  </View>
                )}
                {!userSocials?.tiktok_verified && (
                  <View style={styles.ProfileSetUp}>
                    <View style={styles.ProfileTexting}>
                      <Text style={styles.SetUpText}>
                        Link Your Tiktok Account
                      </Text>
                      <Text style={styles.SetUpSubText}>
                        You need to link your Tiktok Account to Trendit before
                        you can start earning with your Tiktok Account. Click
                        the button below to link your Tiktok account now.
                      </Text>
                      <View style={{paddingTop: 10}} />
                      <TouchableOpacity
                        style={styles.GotoButton2}
                        onPress={() => setIsModalVisible(true)}>
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 48 48"
                          fill="none">
                          <Path
                            d="M37.5145 3.14795H44.7211L28.9761 21.145L47.5 45.6301H32.9966L21.6383 30.7781L8.63883 45.6301H1.42825L18.2699 26.3797L0.5 3.14991H15.3716L25.6391 16.7251L37.5145 3.14795ZM34.9863 41.3178H38.9793L13.2018 7.23499H8.91692L34.9863 41.3178Z"
                            fill="black"
                          />
                        </Svg>
                        <Text style={styles.GotoText}>
                          {' '}
                          Link Tiktok account
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.IconAA}>
                      <Svg
                        width="23"
                        height="23"
                        viewBox="0 0 47 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M34.8307 17.5134C38.2597 19.6762 42.4604 20.9488 46.9973 20.9488V13.2457C46.1386 13.2458 45.2822 13.1667 44.4422 13.0097V19.0732C39.9057 19.0732 35.7055 17.8008 32.2758 15.6381V31.3582C32.2758 39.2222 25.0507 45.5967 16.1389 45.5967C12.8137 45.5967 9.72286 44.7097 7.15546 43.1884C10.0858 45.8322 14.1723 47.4722 18.6933 47.4722C27.6058 47.4722 34.8311 41.0977 34.8311 33.2333V17.5134H34.8307ZM37.9828 9.7419C36.2303 8.05266 35.0796 5.86959 34.8307 3.45606V2.46533H32.4094C33.0189 5.53281 35.098 8.15347 37.9828 9.7419ZM12.7922 37.1539C11.8131 36.0213 11.2839 34.6355 11.2862 33.2108C11.2862 29.6142 14.5909 26.6979 18.6681 26.6979C19.4278 26.6975 20.183 26.8005 20.9073 27.0031V19.1276C20.0609 19.0254 19.2069 18.9818 18.3533 18.9978V25.1276C17.6287 24.9249 16.8731 24.822 16.113 24.8226C12.036 24.8226 8.73151 27.7385 8.73151 31.3356C8.73151 33.8792 10.3832 36.0812 12.7922 37.1539Z"
                          fill="#FF004F"
                        />
                        <Path
                          d="M32.2758 15.638C35.7057 17.8006 39.9055 19.073 44.4422 19.073V13.0095C41.9098 12.5335 39.6681 11.366 37.9826 9.7419C35.0976 8.1533 33.0189 5.53265 32.4094 2.46533H26.0496V33.233C26.0351 36.8199 22.7361 39.7242 18.6677 39.7242C16.2705 39.7242 14.1406 38.7159 12.7918 37.1538C10.3832 36.0812 8.73132 33.879 8.73132 31.3358C8.73132 27.739 12.0358 24.8227 16.1128 24.8227C16.894 24.8227 17.6468 24.93 18.3531 25.1278V18.998C9.59764 19.1576 2.55634 25.4699 2.55634 33.2331C2.55634 37.1085 4.30973 40.6217 7.15563 43.1887C9.72303 44.7097 12.8136 45.5971 16.1391 45.5971C25.0511 45.5971 32.276 39.2221 32.276 31.3582L32.2758 15.638Z"
                          fill="black"
                        />
                        <Path
                          d="M44.4423 13.0092V11.37C42.1587 11.3731 39.9203 10.8088 37.9828 9.74172C39.6978 11.3984 41.9561 12.5409 44.4423 13.0095M32.4094 2.46498C32.3513 2.1719 32.3067 1.87685 32.2758 1.58057V0.589844H23.4943V31.3578C23.4803 34.9444 20.1813 37.8487 16.1128 37.8487C14.9594 37.8502 13.8218 37.6122 12.7918 37.1539C14.1406 38.7158 16.2705 39.7238 18.6677 39.7238C22.7359 39.7238 26.0352 36.8199 26.0496 33.233V2.46514L32.4094 2.46498ZM18.3536 18.9976V17.2523C17.6198 17.1638 16.88 17.1195 16.1394 17.1197C7.22648 17.1197 0.00158691 23.4946 0.00158691 31.3578C0.00158691 36.2878 2.84106 40.6325 7.15598 43.1882C4.31009 40.6214 2.55669 37.108 2.55669 33.2328C2.55669 25.4697 9.59781 19.1573 18.3536 18.9976Z"
                          fill="#00F2EA"
                        />
                      </Svg>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  ProfileSetUp: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    paddingVertical: 30,
  },
  SetUpText: {
    color: '#fff',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 17,
    paddingBottom: 10,
  },
  SetUpSubText: {
    color: '#fff',
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
  },
  IconAA: {
    paddingLeft: 20,
  },
  ProfileTexting: {
    width: 300,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  GotoButton: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 1,
  },
  GotoButton2: {
    width: 230,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'white',
  },
  GotoButton3: {
    width: 230,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'white',
    paddingHorizontal: 4,
  },
  GotoText: {
    color: '#000',
    fontFamily: 'Manrope-ExtraBold',
  },
  GotoText3: {
    color: '#4CAF50',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 10,
  },
  GotoText2: {
    color: '#000',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 10,
  },
});
export default Earn1TK;
