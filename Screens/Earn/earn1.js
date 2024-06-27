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
import Earn1Menu from '../../Components/Menus/earn1Menu';
import Earn1CustomSwitch from '../../Components/CustomSwitches/earn1CustomSwitch';
import {Svg, Path, Stop, Defs, RadialGradient} from 'react-native-svg';
import Earn1Image from '../../assets/SVG/earn1Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import InReviewTwitterMenu from '../../Components/Menus/inReviewTwitterMenu';
import FailedEarnersTask from '../../Components/Menus/failedEarnTask';
import {ApiLink} from '../../enums/apiLink';

const Earn1 = ({navigation}) => {
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
            type: 'instagram',
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
          text2: 'Your Instagram account has been submitted for review',
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
          `${ApiLink.ENDPOINT_1}/tasks/advert/Instagram`,
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
                      viewBox="0 0 47 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
                        fill="url(#paint0_radial_3204_7466)"
                      />
                      <Path
                        d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
                        fill="url(#paint1_radial_3204_7466)"
                      />
                      <Path
                        d="M23.5017 5.14062C18.5156 5.14062 17.8897 5.16247 15.9315 5.25152C13.977 5.34111 12.6428 5.65046 11.4755 6.10449C10.2678 6.57339 9.24358 7.20073 8.22316 8.22151C7.20183 9.24211 6.57449 10.2664 6.10413 11.4735C5.64881 12.6412 5.33909 13.9759 5.25115 15.9295C5.16357 17.8879 5.14062 18.514 5.14062 23.5002C5.14062 28.4864 5.16266 29.1103 5.25152 31.0685C5.34148 33.023 5.65083 34.3572 6.10449 35.5245C6.57376 36.7322 7.2011 37.7564 8.22188 38.7768C9.24211 39.7982 10.2664 40.427 11.4731 40.8959C12.6413 41.3499 13.9757 41.6593 15.9299 41.7489C17.8883 41.8379 18.5136 41.8597 23.4994 41.8597C28.486 41.8597 29.1099 41.8379 31.0681 41.7489C33.0226 41.6593 34.3583 41.3499 35.5265 40.8959C36.7336 40.427 37.7564 39.7982 38.7765 38.7768C39.7978 37.7564 40.425 36.7322 40.8955 35.525C41.3468 34.3572 41.6567 33.0226 41.7485 31.0688C41.8364 29.1106 41.8594 28.4864 41.8594 23.5002C41.8594 18.514 41.8364 17.8883 41.7485 15.9299C41.6567 13.9753 41.3468 12.6413 40.8955 11.4741C40.425 10.2664 39.7978 9.24211 38.7765 8.22151C37.7553 7.20036 36.734 6.57302 35.5254 6.10468C34.355 5.65046 33.0201 5.34093 31.0655 5.25152C29.1071 5.16247 28.4837 5.14062 23.496 5.14062H23.5017ZM21.8546 8.44917C22.3435 8.44843 22.889 8.44917 23.5017 8.44917C28.4038 8.44917 28.9847 8.46679 30.9205 8.55473C32.7105 8.63662 33.6821 8.93569 34.3293 9.18703C35.1861 9.5197 35.7969 9.91755 36.4391 10.5603C37.0817 11.2029 37.4794 11.8148 37.813 12.6716C38.0643 13.3179 38.3638 14.2895 38.4453 16.0795C38.5332 18.015 38.5523 18.5962 38.5523 23.496C38.5523 28.3957 38.5332 28.9772 38.4453 30.9124C38.3634 32.7025 38.0643 33.674 37.813 34.3205C37.4803 35.1773 37.0817 35.7874 36.4391 36.4296C35.7966 37.0722 35.1865 37.4698 34.3293 37.8027C33.6828 38.0551 32.7105 38.3535 30.9205 38.4354C28.985 38.5233 28.4038 38.5424 23.5017 38.5424C18.5993 38.5424 18.0183 38.5233 16.083 38.4354C14.293 38.3527 13.3214 38.0537 12.6737 37.8023C11.817 37.4695 11.2049 37.0718 10.5623 36.4292C9.91975 35.7866 9.52209 35.1762 9.1885 34.319C8.93716 33.6726 8.63772 32.701 8.5562 30.9109C8.46826 28.9755 8.45064 28.3942 8.45064 23.4914C8.45064 18.5887 8.46826 18.0104 8.5562 16.0749C8.63809 14.2849 8.93716 13.3133 9.1885 12.6661C9.52136 11.8093 9.91975 11.1974 10.5625 10.5548C11.2051 9.91223 11.817 9.51438 12.6738 9.18097C13.321 8.92853 14.293 8.63019 16.083 8.54794C17.7766 8.47138 18.433 8.44843 21.8546 8.44458V8.44917ZM33.3019 11.4976C32.0856 11.4976 31.0988 12.4835 31.0988 13.6999C31.0988 14.9163 32.0856 15.9031 33.3019 15.9031C34.5182 15.9031 35.505 14.9163 35.505 13.6999C35.505 12.4836 34.5182 11.4968 33.3019 11.4968V11.4976ZM23.5017 14.0717C18.2949 14.0717 14.0734 18.2933 14.0734 23.5002C14.0734 28.7071 18.2949 32.9266 23.5017 32.9266C28.7086 32.9266 32.9286 28.7071 32.9286 23.5002C32.9286 18.2935 28.7082 14.0717 23.5013 14.0717H23.5017ZM23.5017 17.3803C26.8814 17.3803 29.6216 20.12 29.6216 23.5002C29.6216 26.88 26.8814 29.6201 23.5017 29.6201C20.1217 29.6201 17.3819 26.88 17.3819 23.5002C17.3819 20.12 20.1217 17.3803 23.5017 17.3803Z"
                        fill="white"
                      />
                      <Defs>
                        <RadialGradient
                          id="paint0_radial_3204_7466"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(12.4844 50.6199) rotate(-90) scale(46.5805 43.3235)">
                          <Stop stop-color="#FFDD55" />
                          <Stop offset="0.1" stop-color="#FFDD55" />
                          <Stop offset="0.5" stop-color="#FF543E" />
                          <Stop offset="1" stop-color="#C837AB" />
                        </RadialGradient>
                        <RadialGradient
                          id="paint1_radial_3204_7466"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(-7.87268 3.38565) rotate(78.681) scale(20.8217 85.8279)">
                          <Stop stop-color="#3771C8" />
                          <Stop offset="0.128" stop-color="#3771C8" />
                          <Stop
                            offset="1"
                            stop-color="#6600FF"
                            stop-opacity="0"
                          />
                        </RadialGradient>
                      </Defs>
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
                    Link Your Instagram Account
                  </Text>
                </View>
                <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
                  <Text
                    style={{fontSize: 12, paddingTop: 10, paddingBottom: 10}}>
                    You must obey the following rules in order to successfully
                    link your Instagram account to Trendit³.
                  </Text>
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <Text style={{fontSize: 12}}>1.</Text>
                    <Text style={{fontSize: 12}}>
                      Your account on Instagram must have at least 500 Active
                      Followers. Note that Ghost or Bots followers are not
                      allowed and your account on Trendit³ will be banned if you
                      have ghost followers
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>2.</Text>
                    <Text style={{fontSize: 12}}>
                      You Account on Instagram must have been opened one year
                      ago.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>3.</Text>
                    <Text style={{fontSize: 12}}>
                      You must have posted at least five times on your Instagram
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
                    Please enter your Instagram profile link which you want to
                    use to perform this task:{' '}
                  </Text>
                  <View style={{paddingVertical: 20}}>
                    <TextInput
                      placeholder="Instagram profile  link"
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
                    onPress={() => sendLinkData(link, 'Instagram')}
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
              <View style={{paddingTop: 40}}>
                <Svg
                  width="48"
                  height="48"
                  viewBox="0 0 47 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
                    fill="url(#paint0_radial_3204_7466)"
                  />
                  <Path
                    d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
                    fill="url(#paint1_radial_3204_7466)"
                  />
                  <Path
                    d="M23.5017 5.14062C18.5156 5.14062 17.8897 5.16247 15.9315 5.25152C13.977 5.34111 12.6428 5.65046 11.4755 6.10449C10.2678 6.57339 9.24358 7.20073 8.22316 8.22151C7.20183 9.24211 6.57449 10.2664 6.10413 11.4735C5.64881 12.6412 5.33909 13.9759 5.25115 15.9295C5.16357 17.8879 5.14062 18.514 5.14062 23.5002C5.14062 28.4864 5.16266 29.1103 5.25152 31.0685C5.34148 33.023 5.65083 34.3572 6.10449 35.5245C6.57376 36.7322 7.2011 37.7564 8.22188 38.7768C9.24211 39.7982 10.2664 40.427 11.4731 40.8959C12.6413 41.3499 13.9757 41.6593 15.9299 41.7489C17.8883 41.8379 18.5136 41.8597 23.4994 41.8597C28.486 41.8597 29.1099 41.8379 31.0681 41.7489C33.0226 41.6593 34.3583 41.3499 35.5265 40.8959C36.7336 40.427 37.7564 39.7982 38.7765 38.7768C39.7978 37.7564 40.425 36.7322 40.8955 35.525C41.3468 34.3572 41.6567 33.0226 41.7485 31.0688C41.8364 29.1106 41.8594 28.4864 41.8594 23.5002C41.8594 18.514 41.8364 17.8883 41.7485 15.9299C41.6567 13.9753 41.3468 12.6413 40.8955 11.4741C40.425 10.2664 39.7978 9.24211 38.7765 8.22151C37.7553 7.20036 36.734 6.57302 35.5254 6.10468C34.355 5.65046 33.0201 5.34093 31.0655 5.25152C29.1071 5.16247 28.4837 5.14062 23.496 5.14062H23.5017ZM21.8546 8.44917C22.3435 8.44843 22.889 8.44917 23.5017 8.44917C28.4038 8.44917 28.9847 8.46679 30.9205 8.55473C32.7105 8.63662 33.6821 8.93569 34.3293 9.18703C35.1861 9.5197 35.7969 9.91755 36.4391 10.5603C37.0817 11.2029 37.4794 11.8148 37.813 12.6716C38.0643 13.3179 38.3638 14.2895 38.4453 16.0795C38.5332 18.015 38.5523 18.5962 38.5523 23.496C38.5523 28.3957 38.5332 28.9772 38.4453 30.9124C38.3634 32.7025 38.0643 33.674 37.813 34.3205C37.4803 35.1773 37.0817 35.7874 36.4391 36.4296C35.7966 37.0722 35.1865 37.4698 34.3293 37.8027C33.6828 38.0551 32.7105 38.3535 30.9205 38.4354C28.985 38.5233 28.4038 38.5424 23.5017 38.5424C18.5993 38.5424 18.0183 38.5233 16.083 38.4354C14.293 38.3527 13.3214 38.0537 12.6737 37.8023C11.817 37.4695 11.2049 37.0718 10.5623 36.4292C9.91975 35.7866 9.52209 35.1762 9.1885 34.319C8.93716 33.6726 8.63772 32.701 8.5562 30.9109C8.46826 28.9755 8.45064 28.3942 8.45064 23.4914C8.45064 18.5887 8.46826 18.0104 8.5562 16.0749C8.63809 14.2849 8.93716 13.3133 9.1885 12.6661C9.52136 11.8093 9.91975 11.1974 10.5625 10.5548C11.2051 9.91223 11.817 9.51438 12.6738 9.18097C13.321 8.92853 14.293 8.63019 16.083 8.54794C17.7766 8.47138 18.433 8.44843 21.8546 8.44458V8.44917ZM33.3019 11.4976C32.0856 11.4976 31.0988 12.4835 31.0988 13.6999C31.0988 14.9163 32.0856 15.9031 33.3019 15.9031C34.5182 15.9031 35.505 14.9163 35.505 13.6999C35.505 12.4836 34.5182 11.4968 33.3019 11.4968V11.4976ZM23.5017 14.0717C18.2949 14.0717 14.0734 18.2933 14.0734 23.5002C14.0734 28.7071 18.2949 32.9266 23.5017 32.9266C28.7086 32.9266 32.9286 28.7071 32.9286 23.5002C32.9286 18.2935 28.7082 14.0717 23.5013 14.0717H23.5017ZM23.5017 17.3803C26.8814 17.3803 29.6216 20.12 29.6216 23.5002C29.6216 26.88 26.8814 29.6201 23.5017 29.6201C20.1217 29.6201 17.3819 26.88 17.3819 23.5002C17.3819 20.12 20.1217 17.3803 23.5017 17.3803Z"
                    fill="white"
                  />
                  <Defs>
                    <RadialGradient
                      id="paint0_radial_3204_7466"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(12.4844 50.6199) rotate(-90) scale(46.5805 43.3235)">
                      <Stop stop-color="#FFDD55" />
                      <Stop offset="0.1" stop-color="#FFDD55" />
                      <Stop offset="0.5" stop-color="#FF543E" />
                      <Stop offset="1" stop-color="#C837AB" />
                    </RadialGradient>
                    <RadialGradient
                      id="paint1_radial_3204_7466"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(-7.87268 3.38565) rotate(78.681) scale(20.8217 85.8279)">
                      <Stop stop-color="#3771C8" />
                      <Stop offset="0.128" stop-color="#3771C8" />
                      <Stop offset="1" stop-color="#6600FF" stop-opacity="0" />
                    </RadialGradient>
                  </Defs>
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
                  Post advert on Instagram
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
                  on your Instagram page and earn ₦110 per posted advert. The
                  more you post, the more you earn. Please note that your
                  Instagram page must have at least 500 active followers to be
                  eligible for this task.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(55, 147, 255, 0.13)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                  }}>
                  <Text style={{color: '#1877f2'}}>
                    {availableTasks?.total || 0} Tasks Available
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View>
                {userSocials?.instagram_verified && (
                  <View>
                    <View style={styles.ProfileSetUp}>
                      <View style={styles.ProfileTexting}>
                        <Text style={styles.SetUpText}>
                          Your Instagram Profile Account
                        </Text>
                        <Text style={styles.SetUpSubText}>
                          Your Instagram task must be done from the above
                          Instagram Profile which has been linked to your
                          Trendit³ account
                        </Text>
                        <View style={{paddingTop: 10}} />
                        <TouchableOpacity style={styles.GotoButton3}>
                          <View style={{width: '60%'}}>
                            <Text style={styles.GotoText2}>
                              {userSocials?.instagram_link}
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
                        <Earn1Menu />
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
                {!userSocials?.instagram_verified && (
                  <View style={styles.ProfileSetUp}>
                    <View style={styles.ProfileTexting}>
                      <Text style={styles.SetUpText}>
                        Link Your Instagram Account
                      </Text>
                      <Text style={styles.SetUpSubText}>
                        You need to link your Instagram Account to Trendit
                        before you can start earning with your Instagram
                        Account. Click the button below to link your Instagram
                        account now.
                      </Text>
                      <View style={{paddingTop: 10}} />
                      <TouchableOpacity
                        style={styles.GotoButton2}
                        onPress={() => setIsModalVisible(true)}>
                        <Svg
                          width="23"
                          height="23"
                          viewBox="0 0 47 47"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <Path
                            d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
                            fill="url(#paint0_radial_3204_7466)"
                          />
                          <Path
                            d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
                            fill="url(#paint1_radial_3204_7466)"
                          />
                          <Path
                            d="M23.5017 5.14062C18.5156 5.14062 17.8897 5.16247 15.9315 5.25152C13.977 5.34111 12.6428 5.65046 11.4755 6.10449C10.2678 6.57339 9.24358 7.20073 8.22316 8.22151C7.20183 9.24211 6.57449 10.2664 6.10413 11.4735C5.64881 12.6412 5.33909 13.9759 5.25115 15.9295C5.16357 17.8879 5.14062 18.514 5.14062 23.5002C5.14062 28.4864 5.16266 29.1103 5.25152 31.0685C5.34148 33.023 5.65083 34.3572 6.10449 35.5245C6.57376 36.7322 7.2011 37.7564 8.22188 38.7768C9.24211 39.7982 10.2664 40.427 11.4731 40.8959C12.6413 41.3499 13.9757 41.6593 15.9299 41.7489C17.8883 41.8379 18.5136 41.8597 23.4994 41.8597C28.486 41.8597 29.1099 41.8379 31.0681 41.7489C33.0226 41.6593 34.3583 41.3499 35.5265 40.8959C36.7336 40.427 37.7564 39.7982 38.7765 38.7768C39.7978 37.7564 40.425 36.7322 40.8955 35.525C41.3468 34.3572 41.6567 33.0226 41.7485 31.0688C41.8364 29.1106 41.8594 28.4864 41.8594 23.5002C41.8594 18.514 41.8364 17.8883 41.7485 15.9299C41.6567 13.9753 41.3468 12.6413 40.8955 11.4741C40.425 10.2664 39.7978 9.24211 38.7765 8.22151C37.7553 7.20036 36.734 6.57302 35.5254 6.10468C34.355 5.65046 33.0201 5.34093 31.0655 5.25152C29.1071 5.16247 28.4837 5.14062 23.496 5.14062H23.5017ZM21.8546 8.44917C22.3435 8.44843 22.889 8.44917 23.5017 8.44917C28.4038 8.44917 28.9847 8.46679 30.9205 8.55473C32.7105 8.63662 33.6821 8.93569 34.3293 9.18703C35.1861 9.5197 35.7969 9.91755 36.4391 10.5603C37.0817 11.2029 37.4794 11.8148 37.813 12.6716C38.0643 13.3179 38.3638 14.2895 38.4453 16.0795C38.5332 18.015 38.5523 18.5962 38.5523 23.496C38.5523 28.3957 38.5332 28.9772 38.4453 30.9124C38.3634 32.7025 38.0643 33.674 37.813 34.3205C37.4803 35.1773 37.0817 35.7874 36.4391 36.4296C35.7966 37.0722 35.1865 37.4698 34.3293 37.8027C33.6828 38.0551 32.7105 38.3535 30.9205 38.4354C28.985 38.5233 28.4038 38.5424 23.5017 38.5424C18.5993 38.5424 18.0183 38.5233 16.083 38.4354C14.293 38.3527 13.3214 38.0537 12.6737 37.8023C11.817 37.4695 11.2049 37.0718 10.5623 36.4292C9.91975 35.7866 9.52209 35.1762 9.1885 34.319C8.93716 33.6726 8.63772 32.701 8.5562 30.9109C8.46826 28.9755 8.45064 28.3942 8.45064 23.4914C8.45064 18.5887 8.46826 18.0104 8.5562 16.0749C8.63809 14.2849 8.93716 13.3133 9.1885 12.6661C9.52136 11.8093 9.91975 11.1974 10.5625 10.5548C11.2051 9.91223 11.817 9.51438 12.6738 9.18097C13.321 8.92853 14.293 8.63019 16.083 8.54794C17.7766 8.47138 18.433 8.44843 21.8546 8.44458V8.44917ZM33.3019 11.4976C32.0856 11.4976 31.0988 12.4835 31.0988 13.6999C31.0988 14.9163 32.0856 15.9031 33.3019 15.9031C34.5182 15.9031 35.505 14.9163 35.505 13.6999C35.505 12.4836 34.5182 11.4968 33.3019 11.4968V11.4976ZM23.5017 14.0717C18.2949 14.0717 14.0734 18.2933 14.0734 23.5002C14.0734 28.7071 18.2949 32.9266 23.5017 32.9266C28.7086 32.9266 32.9286 28.7071 32.9286 23.5002C32.9286 18.2935 28.7082 14.0717 23.5013 14.0717H23.5017ZM23.5017 17.3803C26.8814 17.3803 29.6216 20.12 29.6216 23.5002C29.6216 26.88 26.8814 29.6201 23.5017 29.6201C20.1217 29.6201 17.3819 26.88 17.3819 23.5002C17.3819 20.12 20.1217 17.3803 23.5017 17.3803Z"
                            fill="white"
                          />
                          <Defs>
                            <RadialGradient
                              id="paint0_radial_3204_7466"
                              cx="0"
                              cy="0"
                              r="1"
                              gradientUnits="userSpaceOnUse"
                              gradientTransform="translate(12.4844 50.6199) rotate(-90) scale(46.5805 43.3235)">
                              <Stop stop-color="#FFDD55" />
                              <Stop offset="0.1" stop-color="#FFDD55" />
                              <Stop offset="0.5" stop-color="#FF543E" />
                              <Stop offset="1" stop-color="#C837AB" />
                            </RadialGradient>
                            <RadialGradient
                              id="paint1_radial_3204_7466"
                              cx="0"
                              cy="0"
                              r="1"
                              gradientUnits="userSpaceOnUse"
                              gradientTransform="translate(-7.87268 3.38565) rotate(78.681) scale(20.8217 85.8279)">
                              <Stop stop-color="#3771C8" />
                              <Stop offset="0.128" stop-color="#3771C8" />
                              <Stop
                                offset="1"
                                stop-color="#6600FF"
                                stop-opacity="0"
                              />
                            </RadialGradient>
                          </Defs>
                        </Svg>
                        <Text style={styles.GotoText}>
                          {' '}
                          Link Instagram account
                        </Text>
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
export default Earn1;
