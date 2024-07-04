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
import Earn1TRMenu from '../../Components/Menus/earn1TRMenu';
import Earn1CustomSwitch from '../../Components/CustomSwitches/earn1CustomSwitch';
import {Svg, Path} from 'react-native-svg';
import Earn1Image from '../../assets/SVG/earn1Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import InReviewTwitterMenu from '../../Components/Menus/inReviewTwitterMenu';
import FailedEarnersTask from '../../Components/Menus/failedEarnTask';
import {ApiLink} from '../../enums/apiLink';

const Earn1TR = ({navigation}) => {
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
  const sendLinkData = async (type, link) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${ApiLink.ENDPOINT_1}/users/social-profiles/new`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`,
          },
          body: JSON.stringify({
            link: link,
            platform: type,
          }),
        },
      );
      const data = await response.json();
      if (response.ok && (response.status === 200 || response.status === 201)) {
        console.log('Success: Link successfully submitted.', data);
        console.log(data.message);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message,
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
      setIsLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          `${ApiLink.ENDPOINT_1}/users/social-profiles`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAccessToken.accessToken}`, // Add the access token to the headers
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log('Social Links', data);
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
              setUserSocials(data.social_profiles);
              console.log('Socials Stored');
              console.log('Socials:', userSocials);
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
        console.error('Error during Socials fetch:', error);
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

  const isProfileAvailable = platform => {
    if (userSocials && Array.isArray(userSocials)) {
      return userSocials.some(
        profile => profile.platform.toLowerCase() === platform.toLowerCase(),
      );
    }
    return false;
  };

  const threadsAccount = userSocials?.find(
    social => social.platform.toLowerCase() === 'threads',
  );

  const fetchAvailableTasks = async () => {
    if (userAccessToken) {
      try {
        const response = await fetch(
          `${ApiLink.ENDPOINT_1}/tasks/advert/Threads`,
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
                      xmlns="http://www.w3.org/2000/svg"
                      width="47"
                      height="48"
                      viewBox="0 0 47 48"
                      fill="none">
                      <Path
                        d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                        fill="white"
                      />
                      <Path
                        d="M33.293 4.50652H13.7096C11.1127 4.50652 8.62218 5.53813 6.78588 7.37443C4.94959 9.21072 3.91797 11.7013 3.91797 14.2982V33.8815C3.91797 36.4784 4.94959 38.969 6.78588 40.8053C8.62218 42.6416 11.1127 43.6732 13.7096 43.6732H33.293C35.8899 43.6732 38.3804 42.6416 40.2167 40.8053C42.053 38.969 43.0846 36.4784 43.0846 33.8815V14.2982C43.0846 11.7013 42.053 9.21072 40.2167 7.37443C38.3804 5.53813 35.8899 4.50652 33.293 4.50652ZM14.728 29.0444C15.0366 30.075 15.513 31.0476 16.138 31.9232C17.0301 33.1555 18.2618 34.1014 19.6826 34.6453C20.5579 34.9703 21.4744 35.1818 22.4046 35.2719C23.3172 35.3601 24.2337 35.3601 25.1463 35.2719C26.2109 35.1903 27.2523 34.9183 28.2209 34.469C29.3171 33.9357 30.2554 33.1257 30.943 32.119C31.3566 31.5279 31.6298 30.8502 31.7418 30.1375C31.8538 29.4248 31.8016 28.696 31.5892 28.0065C31.3306 27.1347 30.7767 26.38 30.0226 25.8719L29.6309 25.5978C29.6309 25.774 29.6309 25.9307 29.533 26.0873C29.3959 26.9686 29.1021 27.8146 28.6713 28.594C28.29 29.2923 27.7521 29.8926 27.0997 30.348C26.4473 30.8033 25.6982 31.1012 24.9113 31.2182C23.8762 31.4209 22.8071 31.3671 21.7976 31.0615C20.96 30.8305 20.1973 30.385 19.5846 29.769C18.913 29.0857 18.4921 28.1954 18.3901 27.2428C18.292 26.4365 18.4238 25.619 18.7703 24.8844C19.1167 24.1498 19.6638 23.5282 20.3484 23.0911C21.0603 22.6185 21.8592 22.2923 22.6984 22.1315C23.5268 21.9944 24.3649 21.9357 25.2051 21.9553C25.8609 21.9725 26.515 22.0314 27.1634 22.1315H27.2809C27.1938 21.5957 27.0149 21.079 26.7521 20.604C26.5625 20.2873 26.31 20.0127 26.0103 19.7971C25.7105 19.5816 25.3699 19.4297 25.0092 19.3507C24.1478 19.0862 23.2269 19.0862 22.3655 19.3507C21.7447 19.5702 21.2052 19.9732 20.8184 20.5061V20.6432L18.8601 19.2919V19.1548C19.6761 17.972 20.9183 17.1509 22.3263 16.8636C23.5272 16.6017 24.7754 16.6557 25.9492 17.0203C26.6074 17.2218 27.2167 17.5572 27.7391 18.0054C28.2614 18.4536 28.6855 19.005 28.9846 19.6248C29.3293 20.3279 29.5623 21.0818 29.6701 21.8573C29.7273 22.194 29.76 22.5343 29.768 22.8757L30.3555 23.1498C31.274 23.6376 32.0861 24.3033 32.7446 25.1082C33.4222 25.9444 33.8668 26.9431 34.0371 28.0065C34.1762 28.6488 34.2232 29.3088 34.1742 29.9648C34.0741 31.5953 33.4332 33.1458 32.353 34.3711C30.9875 35.9854 29.1299 37.1068 27.0655 37.5632C26.1564 37.7535 25.2325 37.8649 24.3042 37.8961C23.4609 37.9316 22.616 37.8988 21.778 37.7982C20.4186 37.6388 19.0951 37.255 17.8613 36.6623C16.2715 35.8568 14.9209 34.648 13.9446 33.1569C13.2217 32.032 12.6737 30.8038 12.3192 29.5144C12.0568 28.5451 11.8668 27.5561 11.7513 26.5573V24.0898C11.7513 23.2673 11.7513 22.4448 11.8884 21.6223C11.9689 20.6919 12.1195 19.7689 12.3388 18.8611C12.6379 17.7175 13.0996 16.6227 13.7096 15.6103C14.9328 13.4277 16.9321 11.7849 19.3105 11.0082C20.1639 10.7185 21.0424 10.5087 21.9346 10.3815C23.0538 10.2542 24.1838 10.2542 25.303 10.3815C26.6554 10.5048 27.9784 10.8488 29.2196 11.3998C31.0108 12.1899 32.5346 13.4824 33.6063 15.1207C34.3578 16.3031 34.9133 17.5993 35.2513 18.959L32.9405 19.5857V19.429C32.6804 18.5014 32.2985 17.6124 31.8046 16.7853C30.8005 15.154 29.2437 13.9378 27.418 13.3582C26.4568 13.032 25.455 12.8409 24.4413 12.7903C23.6918 12.7313 22.9388 12.7313 22.1892 12.7903C21.0325 12.9035 19.9052 13.2218 18.8601 13.7303C17.5093 14.4357 16.3983 15.5262 15.668 16.8636C15.1623 17.7798 14.7867 18.7618 14.5517 19.7815C14.345 20.6108 14.2074 21.4558 14.1405 22.3078C14.0913 23.123 14.0913 23.9405 14.1405 24.7557C14.1499 26.2047 14.3474 27.6463 14.728 29.0444Z"
                        fill="white"
                      />
                      <Path
                        d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                        fill="white"
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
                    Link Your Threads Account
                  </Text>
                </View>
                <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
                  <Text
                    style={{fontSize: 12, paddingTop: 10, paddingBottom: 10}}>
                    You must obey the following rules in order to successfully
                    link your Threads account to Trendti3.
                  </Text>
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <Text style={{fontSize: 12}}>1.</Text>
                    <Text style={{fontSize: 12}}>
                      Your account on Threads must have at least 500 Active
                      Followers. Note that Ghost or Bots followers are not
                      allowed and your account on Trendit³ will be banned if you
                      have ghost followers
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>2.</Text>
                    <Text style={{fontSize: 12}}>
                      You Account on Threads must have been opened one year ago.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>3.</Text>
                    <Text style={{fontSize: 12}}>
                      You must have posted at least five times on your Threads
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
                    Please enter your Threads profile link which you want to use
                    to perform this task:{' '}
                  </Text>
                  <View style={{paddingVertical: 20}}>
                    <TextInput
                      placeholder="Threads profile  link"
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
                    onPress={() => sendLinkData('Threads', link)}
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
                  xmlns="http://www.w3.org/2000/svg"
                  width="47"
                  height="48"
                  viewBox="0 0 47 48"
                  fill="black">
                  <Path
                    d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                    fill="white"
                  />
                  <Path
                    d="M33.293 4.50652H13.7096C11.1127 4.50652 8.62218 5.53813 6.78588 7.37443C4.94959 9.21072 3.91797 11.7013 3.91797 14.2982V33.8815C3.91797 36.4784 4.94959 38.969 6.78588 40.8053C8.62218 42.6416 11.1127 43.6732 13.7096 43.6732H33.293C35.8899 43.6732 38.3804 42.6416 40.2167 40.8053C42.053 38.969 43.0846 36.4784 43.0846 33.8815V14.2982C43.0846 11.7013 42.053 9.21072 40.2167 7.37443C38.3804 5.53813 35.8899 4.50652 33.293 4.50652ZM14.728 29.0444C15.0366 30.075 15.513 31.0476 16.138 31.9232C17.0301 33.1555 18.2618 34.1014 19.6826 34.6453C20.5579 34.9703 21.4744 35.1818 22.4046 35.2719C23.3172 35.3601 24.2337 35.3601 25.1463 35.2719C26.2109 35.1903 27.2523 34.9183 28.2209 34.469C29.3171 33.9357 30.2554 33.1257 30.943 32.119C31.3566 31.5279 31.6298 30.8502 31.7418 30.1375C31.8538 29.4248 31.8016 28.696 31.5892 28.0065C31.3306 27.1347 30.7767 26.38 30.0226 25.8719L29.6309 25.5978C29.6309 25.774 29.6309 25.9307 29.533 26.0873C29.3959 26.9686 29.1021 27.8146 28.6713 28.594C28.29 29.2923 27.7521 29.8926 27.0997 30.348C26.4473 30.8033 25.6982 31.1012 24.9113 31.2182C23.8762 31.4209 22.8071 31.3671 21.7976 31.0615C20.96 30.8305 20.1973 30.385 19.5846 29.769C18.913 29.0857 18.4921 28.1954 18.3901 27.2428C18.292 26.4365 18.4238 25.619 18.7703 24.8844C19.1167 24.1498 19.6638 23.5282 20.3484 23.0911C21.0603 22.6185 21.8592 22.2923 22.6984 22.1315C23.5268 21.9944 24.3649 21.9357 25.2051 21.9553C25.8609 21.9725 26.515 22.0314 27.1634 22.1315H27.2809C27.1938 21.5957 27.0149 21.079 26.7521 20.604C26.5625 20.2873 26.31 20.0127 26.0103 19.7971C25.7105 19.5816 25.3699 19.4297 25.0092 19.3507C24.1478 19.0862 23.2269 19.0862 22.3655 19.3507C21.7447 19.5702 21.2052 19.9732 20.8184 20.5061V20.6432L18.8601 19.2919V19.1548C19.6761 17.972 20.9183 17.1509 22.3263 16.8636C23.5272 16.6017 24.7754 16.6557 25.9492 17.0203C26.6074 17.2218 27.2167 17.5572 27.7391 18.0054C28.2614 18.4536 28.6855 19.005 28.9846 19.6248C29.3293 20.3279 29.5623 21.0818 29.6701 21.8573C29.7273 22.194 29.76 22.5343 29.768 22.8757L30.3555 23.1498C31.274 23.6376 32.0861 24.3033 32.7446 25.1082C33.4222 25.9444 33.8668 26.9431 34.0371 28.0065C34.1762 28.6488 34.2232 29.3088 34.1742 29.9648C34.0741 31.5953 33.4332 33.1458 32.353 34.3711C30.9875 35.9854 29.1299 37.1068 27.0655 37.5632C26.1564 37.7535 25.2325 37.8649 24.3042 37.8961C23.4609 37.9316 22.616 37.8988 21.778 37.7982C20.4186 37.6388 19.0951 37.255 17.8613 36.6623C16.2715 35.8568 14.9209 34.648 13.9446 33.1569C13.2217 32.032 12.6737 30.8038 12.3192 29.5144C12.0568 28.5451 11.8668 27.5561 11.7513 26.5573V24.0898C11.7513 23.2673 11.7513 22.4448 11.8884 21.6223C11.9689 20.6919 12.1195 19.7689 12.3388 18.8611C12.6379 17.7175 13.0996 16.6227 13.7096 15.6103C14.9328 13.4277 16.9321 11.7849 19.3105 11.0082C20.1639 10.7185 21.0424 10.5087 21.9346 10.3815C23.0538 10.2542 24.1838 10.2542 25.303 10.3815C26.6554 10.5048 27.9784 10.8488 29.2196 11.3998C31.0108 12.1899 32.5346 13.4824 33.6063 15.1207C34.3578 16.3031 34.9133 17.5993 35.2513 18.959L32.9405 19.5857V19.429C32.6804 18.5014 32.2985 17.6124 31.8046 16.7853C30.8005 15.154 29.2437 13.9378 27.418 13.3582C26.4568 13.032 25.455 12.8409 24.4413 12.7903C23.6918 12.7313 22.9388 12.7313 22.1892 12.7903C21.0325 12.9035 19.9052 13.2218 18.8601 13.7303C17.5093 14.4357 16.3983 15.5262 15.668 16.8636C15.1623 17.7798 14.7867 18.7618 14.5517 19.7815C14.345 20.6108 14.2074 21.4558 14.1405 22.3078C14.0913 23.123 14.0913 23.9405 14.1405 24.7557C14.1499 26.2047 14.3474 27.6463 14.728 29.0444Z"
                    fill="black"
                  />
                  <Path
                    d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                    fill="white"
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
                  Post advert on Threads
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
                  on your Threads page and earn ₦110 per posted advert. The more
                  you post, the more you earn. Please note that your Threads
                  page must have at least 500 active followers to be eligible
                  for this task.
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
                {isProfileAvailable('threads') && (
                  <View>
                    <View style={styles.ProfileSetUp}>
                      <View style={styles.ProfileTexting}>
                        <Text style={styles.SetUpText}>
                          Your Threads Profile Account
                        </Text>
                        <Text style={styles.SetUpSubText}>
                          Your Threads task must be done from the above Threads
                          Profile which has been linked to your Trendit³ account
                        </Text>
                        <View style={{paddingTop: 10}} />
                        <TouchableOpacity style={styles.GotoButton3}>
                          <View style={{width: '60%'}}>
                            <Text style={styles.GotoText2}>
                              {threadsAccount?.link || 'No link found'}
                            </Text>
                          </View>

                          <Text style={styles.GotoText3}>
                            {threadsAccount?.status}
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
                        <Earn1TRMenu />
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
                {!isProfileAvailable('threads') && (
                  <View style={styles.ProfileSetUp}>
                    <View style={styles.ProfileTexting}>
                      <Text style={styles.SetUpText}>
                        Link Your Threads Account
                      </Text>
                      <Text style={styles.SetUpSubText}>
                        You need to link your Threads Account to Trendit before
                        you can start earning with your Threads Account. Click
                        the button below to link your Threads account now.
                      </Text>
                      <View style={{paddingTop: 10}} />
                      <TouchableOpacity
                        style={styles.GotoButton2}
                        onPress={() => setIsModalVisible(true)}>
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 47 48"
                          fill="none">
                          <Path
                            d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                            fill="white"
                          />
                          <Path
                            d="M33.293 4.50652H13.7096C11.1127 4.50652 8.62218 5.53813 6.78588 7.37443C4.94959 9.21072 3.91797 11.7013 3.91797 14.2982V33.8815C3.91797 36.4784 4.94959 38.969 6.78588 40.8053C8.62218 42.6416 11.1127 43.6732 13.7096 43.6732H33.293C35.8899 43.6732 38.3804 42.6416 40.2167 40.8053C42.053 38.969 43.0846 36.4784 43.0846 33.8815V14.2982C43.0846 11.7013 42.053 9.21072 40.2167 7.37443C38.3804 5.53813 35.8899 4.50652 33.293 4.50652ZM14.728 29.0444C15.0366 30.075 15.513 31.0476 16.138 31.9232C17.0301 33.1555 18.2618 34.1014 19.6826 34.6453C20.5579 34.9703 21.4744 35.1818 22.4046 35.2719C23.3172 35.3601 24.2337 35.3601 25.1463 35.2719C26.2109 35.1903 27.2523 34.9183 28.2209 34.469C29.3171 33.9357 30.2554 33.1257 30.943 32.119C31.3566 31.5279 31.6298 30.8502 31.7418 30.1375C31.8538 29.4248 31.8016 28.696 31.5892 28.0065C31.3306 27.1347 30.7767 26.38 30.0226 25.8719L29.6309 25.5978C29.6309 25.774 29.6309 25.9307 29.533 26.0873C29.3959 26.9686 29.1021 27.8146 28.6713 28.594C28.29 29.2923 27.7521 29.8926 27.0997 30.348C26.4473 30.8033 25.6982 31.1012 24.9113 31.2182C23.8762 31.4209 22.8071 31.3671 21.7976 31.0615C20.96 30.8305 20.1973 30.385 19.5846 29.769C18.913 29.0857 18.4921 28.1954 18.3901 27.2428C18.292 26.4365 18.4238 25.619 18.7703 24.8844C19.1167 24.1498 19.6638 23.5282 20.3484 23.0911C21.0603 22.6185 21.8592 22.2923 22.6984 22.1315C23.5268 21.9944 24.3649 21.9357 25.2051 21.9553C25.8609 21.9725 26.515 22.0314 27.1634 22.1315H27.2809C27.1938 21.5957 27.0149 21.079 26.7521 20.604C26.5625 20.2873 26.31 20.0127 26.0103 19.7971C25.7105 19.5816 25.3699 19.4297 25.0092 19.3507C24.1478 19.0862 23.2269 19.0862 22.3655 19.3507C21.7447 19.5702 21.2052 19.9732 20.8184 20.5061V20.6432L18.8601 19.2919V19.1548C19.6761 17.972 20.9183 17.1509 22.3263 16.8636C23.5272 16.6017 24.7754 16.6557 25.9492 17.0203C26.6074 17.2218 27.2167 17.5572 27.7391 18.0054C28.2614 18.4536 28.6855 19.005 28.9846 19.6248C29.3293 20.3279 29.5623 21.0818 29.6701 21.8573C29.7273 22.194 29.76 22.5343 29.768 22.8757L30.3555 23.1498C31.274 23.6376 32.0861 24.3033 32.7446 25.1082C33.4222 25.9444 33.8668 26.9431 34.0371 28.0065C34.1762 28.6488 34.2232 29.3088 34.1742 29.9648C34.0741 31.5953 33.4332 33.1458 32.353 34.3711C30.9875 35.9854 29.1299 37.1068 27.0655 37.5632C26.1564 37.7535 25.2325 37.8649 24.3042 37.8961C23.4609 37.9316 22.616 37.8988 21.778 37.7982C20.4186 37.6388 19.0951 37.255 17.8613 36.6623C16.2715 35.8568 14.9209 34.648 13.9446 33.1569C13.2217 32.032 12.6737 30.8038 12.3192 29.5144C12.0568 28.5451 11.8668 27.5561 11.7513 26.5573V24.0898C11.7513 23.2673 11.7513 22.4448 11.8884 21.6223C11.9689 20.6919 12.1195 19.7689 12.3388 18.8611C12.6379 17.7175 13.0996 16.6227 13.7096 15.6103C14.9328 13.4277 16.9321 11.7849 19.3105 11.0082C20.1639 10.7185 21.0424 10.5087 21.9346 10.3815C23.0538 10.2542 24.1838 10.2542 25.303 10.3815C26.6554 10.5048 27.9784 10.8488 29.2196 11.3998C31.0108 12.1899 32.5346 13.4824 33.6063 15.1207C34.3578 16.3031 34.9133 17.5993 35.2513 18.959L32.9405 19.5857V19.429C32.6804 18.5014 32.2985 17.6124 31.8046 16.7853C30.8005 15.154 29.2437 13.9378 27.418 13.3582C26.4568 13.032 25.455 12.8409 24.4413 12.7903C23.6918 12.7313 22.9388 12.7313 22.1892 12.7903C21.0325 12.9035 19.9052 13.2218 18.8601 13.7303C17.5093 14.4357 16.3983 15.5262 15.668 16.8636C15.1623 17.7798 14.7867 18.7618 14.5517 19.7815C14.345 20.6108 14.2074 21.4558 14.1405 22.3078C14.0913 23.123 14.0913 23.9405 14.1405 24.7557C14.1499 26.2047 14.3474 27.6463 14.728 29.0444Z"
                            fill="black"
                          />
                          <Path
                            d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                            fill="white"
                          />
                        </Svg>
                        <Text style={styles.GotoText}>
                          {' '}
                          Link Threads account
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
export default Earn1TR;
