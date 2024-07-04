/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import {Svg, Path, Stop, RadialGradient, Defs} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiLink} from '../../enums/apiLink';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../Components/Contexts/colorTheme';
import Headers from '../../Components/Headers/Headers';

const SocialMedia = () => {
  const navigation = useNavigation();
  const deviceHeight = Dimensions.get('window').height;
  const [userAccessToken, setUserAccessToken] = useState('');
  const [userSocials, setUserSocials] = useState([]);
  const [isXModalVisible, setIsXModalVisible] = useState(false);
  const [isFBModalVisible, setIsFBModalVisible] = useState(false);
  const [isTKModalVisible, setIsTKModalVisible] = useState(false);
  const [isIGModalVisible, setIsIGModalVisible] = useState(false);
  const [link, setLink] = useState('');

  const {theme} = useTheme();
  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
    },
    TextColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamic text color
    },
    Button: {
      backgroundColor: theme === 'dark' ? '#FFF' : '#CB29BE', // Dynamic background color
    },
    Btext: {
      color: theme === 'dark' ? '#FF6DFB' : '#FFF', // Dynamic text color
    },
  });

  useEffect(() => {
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        console.log('AccessToken Loading', userAccessToken);

        if (!userAccessToken) {
          console.log('AccessToken Not found', userAccessToken);
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
  }, []);

  const [IsLoading, setIsLoading] = useState(true);

  const strokeColor = theme === 'dark' ? '#b1b1b1' : '#000';

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
        setIsXModalVisible(false);
        setIsTKModalVisible(false);
        setIsFBModalVisible(false);
        setIsIGModalVisible(false);
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
  const DeleteSocialLinks = async type => {
    try {
      const response = await fetch(
        `${ApiLink.ENDPOINT_1}/users/social-profiles/${type}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`,
          },
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

  const twitterAccount = userSocials?.find(
    social => social.platform.toLowerCase() === 'twitter',
  );
  const instagramAccount = userSocials?.find(
    social => social.platform.toLowerCase() === 'instagram',
  );
  const facebookAccount = userSocials?.find(
    social => social.platform.toLowerCase() === 'facebook',
  );
  const tiktokAccount = userSocials?.find(
    social => social.platform.toLowerCase() === 'tiktok',
  );
  const threadsAccount = userSocials?.find(
    social => social.platform.toLowerCase() === 'threads',
  );

  return (
    <ScrollView style={[dynamicStyles.AppContainer]}>
      <Headers />
      <>
        {IsLoading ? (
          <ActivityIndicator size="large" color="#CB29BE" />
        ) : (
          <View style={{padding: 10}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                paddingVertical: 10,
                paddingBottom: 20,
              }}
              onPress={() => navigation.navigate('Settings')}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill={strokeColor}>
                <Path
                  d="M16.3332 7L10.1581 13.175C9.7025 13.6307 9.7025 14.3693 10.1581 14.825L16.3332 21"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </Svg>
              <Text
                style={[
                  {
                    color: '#fff',
                    fontFamily: 'Manrope-Bold',
                    fontSize: 20,
                  },
                  dynamicStyles.TextColor,
                ]}>
                Social Media Accounts
              </Text>
            </TouchableOpacity>
            <View>
              <View>
                {userSocials.length > 0 && (
                  <>
                    {isProfileAvailable('instagram') && (
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <View
                          style={[
                            dynamicStyles.DivContainer,
                            {
                              justifyContent: 'center',
                              alignContent: 'center',
                              padding: 10,
                              borderRadius: 5,
                              width: '90%',
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Svg
                                width="30"
                                height="30"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <Path
                                  d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                                  fill="url(#paint0_radial_3208_15821)"
                                />
                                <Path
                                  d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                                  fill="url(#paint1_radial_3208_15821)"
                                />
                                <Path
                                  d="M10.0007 2.1875C7.87898 2.1875 7.61266 2.1968 6.77938 2.23469C5.94766 2.27281 5.37992 2.40445 4.8832 2.59766C4.3693 2.79719 3.93344 3.06414 3.49922 3.49852C3.06461 3.93281 2.79766 4.36867 2.5975 4.88234C2.40375 5.37922 2.27195 5.94719 2.23453 6.77852C2.19727 7.61188 2.1875 7.87828 2.1875 10.0001C2.1875 12.1219 2.19688 12.3873 2.23469 13.2206C2.27297 14.0523 2.40461 14.6201 2.59766 15.1168C2.79734 15.6307 3.0643 16.0666 3.49867 16.5008C3.93281 16.9354 4.36867 17.203 4.88219 17.4025C5.3793 17.5957 5.94711 17.7273 6.77867 17.7655C7.61203 17.8034 7.87813 17.8127 9.99977 17.8127C12.1217 17.8127 12.3872 17.8034 13.2205 17.7655C14.0522 17.7273 14.6205 17.5957 15.1177 17.4025C15.6313 17.203 16.0666 16.9354 16.5006 16.5008C16.9352 16.0666 17.2021 15.6307 17.4023 15.117C17.5944 14.6201 17.7262 14.0522 17.7653 13.2208C17.8027 12.3875 17.8125 12.1219 17.8125 10.0001C17.8125 7.87828 17.8027 7.61203 17.7653 6.77867C17.7262 5.94695 17.5944 5.3793 17.4023 4.88258C17.2021 4.36867 16.9352 3.93281 16.5006 3.49852C16.0661 3.06398 15.6315 2.79703 15.1172 2.59773C14.6191 2.40445 14.0511 2.27273 13.2194 2.23469C12.386 2.1968 12.1207 2.1875 9.99828 2.1875H10.0007ZM9.29984 3.59539C9.50789 3.59508 9.74 3.59539 10.0007 3.59539C12.0867 3.59539 12.3339 3.60289 13.1577 3.64031C13.9194 3.67516 14.3328 3.80242 14.6082 3.90938C14.9728 4.05094 15.2327 4.22023 15.506 4.49375C15.7795 4.76719 15.9487 5.02758 16.0906 5.39219C16.1976 5.66719 16.325 6.08063 16.3597 6.84234C16.3971 7.66594 16.4052 7.91328 16.4052 9.99828C16.4052 12.0833 16.3971 12.3307 16.3597 13.1542C16.3248 13.9159 16.1976 14.3294 16.0906 14.6045C15.9491 14.9691 15.7795 15.2287 15.506 15.502C15.2326 15.7754 14.973 15.9446 14.6082 16.0863C14.3331 16.1937 13.9194 16.3206 13.1577 16.3555C12.3341 16.3929 12.0867 16.401 10.0007 16.401C7.91461 16.401 7.66734 16.3929 6.84383 16.3555C6.08211 16.3203 5.66867 16.193 5.39305 16.0861C5.02852 15.9445 4.76805 15.7752 4.49461 15.5018C4.22117 15.2284 4.05195 14.9686 3.91 14.6038C3.80305 14.3287 3.67562 13.9153 3.64094 13.1536C3.60352 12.33 3.59602 12.0827 3.59602 9.99633C3.59602 7.91008 3.60352 7.66398 3.64094 6.84039C3.67578 6.07867 3.80305 5.66523 3.91 5.38984C4.05164 5.02523 4.22117 4.76484 4.49469 4.49141C4.76813 4.21797 5.02852 4.04867 5.39312 3.9068C5.66852 3.79938 6.08211 3.67242 6.84383 3.63742C7.56453 3.60484 7.84383 3.59508 9.29984 3.59344V3.59539ZM14.171 4.89258C13.6534 4.89258 13.2335 5.31211 13.2335 5.82977C13.2335 6.34734 13.6534 6.76727 14.171 6.76727C14.6886 6.76727 15.1085 6.34734 15.1085 5.82977C15.1085 5.31219 14.6886 4.89227 14.171 4.89227V4.89258ZM10.0007 5.98797C7.78508 5.98797 5.98867 7.78438 5.98867 10.0001C5.98867 12.2158 7.78508 14.0113 10.0007 14.0113C12.2164 14.0113 14.0122 12.2158 14.0122 10.0001C14.0122 7.78445 12.2163 5.98797 10.0005 5.98797H10.0007ZM10.0007 7.39586C11.4389 7.39586 12.6049 8.56172 12.6049 10.0001C12.6049 11.4383 11.4389 12.6043 10.0007 12.6043C8.56242 12.6043 7.39656 11.4383 7.39656 10.0001C7.39656 8.56172 8.56242 7.39586 10.0007 7.39586Z"
                                  fill="white"
                                />
                                <Defs>
                                  <RadialGradient
                                    id="paint0_radial_3208_15821"
                                    cx="0"
                                    cy="0"
                                    r="1"
                                    gradientUnits="userSpaceOnUse"
                                    gradientTransform="translate(5.3125 21.5404) rotate(-90) scale(19.8215 18.4355)">
                                    <Stop stop-color="#FFDD55" />
                                    <Stop offset="0.1" stop-color="#FFDD55" />
                                    <Stop offset="0.5" stop-color="#FF543E" />
                                    <Stop offset="1" stop-color="#C837AB" />
                                  </RadialGradient>
                                  <RadialGradient
                                    id="paint1_radial_3208_15821"
                                    cx="0"
                                    cy="0"
                                    r="1"
                                    gradientUnits="userSpaceOnUse"
                                    gradientTransform="translate(-3.35008 1.4407) rotate(78.681) scale(8.86031 36.5225)">
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
                                fontSize: 12,
                                textDecorationLine: 'underline',
                                fontFamily: 'Manrope-Regular',
                              }}
                              onPress={() =>
                                Linking.openURL(instagramAccount?.link)
                              }>
                              {instagramAccount?.link}
                            </Text>
                            <View>
                              {instagramAccount?.status === 'pending' && (
                                <Text
                                  style={{
                                    color: 'yellow',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Pending
                                </Text>
                              )}
                              {instagramAccount?.status === 'verified' && (
                                <Text
                                  style={{
                                    color: 'green',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Verified
                                </Text>
                              )}
                              {instagramAccount?.status === 'rejected' && (
                                <Text
                                  style={{
                                    color: 'red',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Rejected
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => DeleteSocialLinks('instagram')}>
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none">
                            <Path
                              d="M18.8925 19.0133L19.8925 19.0222L18.8925 19.0133ZM4 5.97754C3.44772 5.97754 3 6.42525 3 6.97754C3 7.52982 3.44772 7.97754 4 7.97754V5.97754ZM20 7.97754C20.5523 7.97754 21 7.52982 21 6.97754C21 6.42525 20.5523 5.97754 20 5.97754V7.97754ZM11 10.9775C11 10.4253 10.5523 9.97754 10 9.97754C9.44772 9.97754 9 10.4253 9 10.9775H11ZM9 18.9775C9 19.5298 9.44772 19.9775 10 19.9775C10.5523 19.9775 11 19.5298 11 18.9775H9ZM15 10.9775C15 10.4253 14.5523 9.97754 14 9.97754C13.4477 9.97754 13 10.4253 13 10.9775H15ZM13 18.9775C13 19.5298 13.4477 19.9775 14 19.9775C14.5523 19.9775 15 19.5298 15 18.9775H13ZM18 6.96861L17.8926 19.0043L19.8925 19.0222L20 6.98647L18 6.96861ZM14.8927 21.9775H9V23.9775H14.8927V21.9775ZM4 6.97754V18.9775H6V6.97754H4ZM4 7.97754H5V5.97754H4V7.97754ZM5 7.97754H8V5.97754H5V7.97754ZM8 7.97754H16V5.97754H8V7.97754ZM16 7.97754H19V5.97754H16V7.97754ZM19 7.97754H20V5.97754H19V7.97754ZM9 6.53309C9 5.22917 10.2292 3.97754 12 3.97754V1.97754C9.35256 1.97754 7 3.90966 7 6.53309H9ZM12 3.97754C13.7708 3.97754 15 5.22917 15 6.53309H17C17 3.90966 14.6474 1.97754 12 1.97754V3.97754ZM7 6.53309V6.97754H9V6.53309H7ZM15 6.53309V6.97754H17V6.53309H15ZM9 21.9775C7.34314 21.9775 6 20.6344 6 18.9775H4C4 21.739 6.23857 23.9775 9 23.9775V21.9775ZM17.8926 19.0043C17.8779 20.6507 16.5391 21.9775 14.8927 21.9775V23.9775C17.6367 23.9775 19.868 21.7661 19.8925 19.0222L17.8926 19.0043ZM9 10.9775V18.9775H11V10.9775H9ZM13 10.9775V18.9775H15V10.9775H13Z"
                              fill="#FF3D00"
                            />
                          </Svg>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={{paddingTop: 20}} />
                    {isProfileAvailable('facebook') && (
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <View
                          style={[
                            dynamicStyles.DivContainer,
                            {
                              justifyContent: 'center',
                              alignContent: 'center',
                              padding: 10,
                              borderRadius: 5,
                              width: '90%',
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Svg
                                width="30"
                                height="30"
                                viewBox="0 0 47 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <Path
                                  d="M47 24.0898C47 11.1112 36.4786 0.589844 23.5 0.589844C10.5214 0.589844 0 11.1112 0 24.0898C0 35.8193 8.59366 45.5415 19.8281 47.3044V30.8828H13.8613V24.0898H19.8281V18.9125C19.8281 13.0228 23.3366 9.76953 28.7045 9.76953C31.2756 9.76953 33.9648 10.2285 33.9648 10.2285V16.0117H31.0016C28.0823 16.0117 27.1719 17.8232 27.1719 19.6818V24.0898H33.6895L32.6476 30.8828H27.1719V47.3044C38.4063 45.5415 47 35.8195 47 24.0898Z"
                                  fill="#1877F2"
                                />
                                <Path
                                  d="M32.6476 30.8828L33.6895 24.0898H27.1719V19.6818C27.1719 17.8231 28.0823 16.0117 31.0016 16.0117H33.9648V10.2285C33.9648 10.2285 31.2756 9.76953 28.7043 9.76953C23.3366 9.76953 19.8281 13.0228 19.8281 18.9125V24.0898H13.8613V30.8828H19.8281V47.3044C21.0428 47.4947 22.2705 47.5902 23.5 47.5898C24.7295 47.5902 25.9572 47.4948 27.1719 47.3044V30.8828H32.6476Z"
                                  fill="white"
                                />
                              </Svg>
                            </View>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                textDecorationLine: 'underline',
                                fontFamily: 'Manrope-Regular',
                              }}
                              onPress={() =>
                                Linking.openURL(facebookAccount?.link)
                              }>
                              {facebookAccount?.link}
                            </Text>
                            <View>
                              {facebookAccount?.status === 'pending' && (
                                <Text
                                  style={{
                                    color: 'yellow',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Pending
                                </Text>
                              )}
                              {facebookAccount?.status === 'verified' && (
                                <Text
                                  style={{
                                    color: 'green',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Verified
                                </Text>
                              )}
                              {facebookAccount?.status === 'rejected' && (
                                <Text
                                  style={{
                                    color: 'red',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Rejected
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => DeleteSocialLinks('Facebook')}>
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none">
                            <Path
                              d="M18.8925 19.0133L19.8925 19.0222L18.8925 19.0133ZM4 5.97754C3.44772 5.97754 3 6.42525 3 6.97754C3 7.52982 3.44772 7.97754 4 7.97754V5.97754ZM20 7.97754C20.5523 7.97754 21 7.52982 21 6.97754C21 6.42525 20.5523 5.97754 20 5.97754V7.97754ZM11 10.9775C11 10.4253 10.5523 9.97754 10 9.97754C9.44772 9.97754 9 10.4253 9 10.9775H11ZM9 18.9775C9 19.5298 9.44772 19.9775 10 19.9775C10.5523 19.9775 11 19.5298 11 18.9775H9ZM15 10.9775C15 10.4253 14.5523 9.97754 14 9.97754C13.4477 9.97754 13 10.4253 13 10.9775H15ZM13 18.9775C13 19.5298 13.4477 19.9775 14 19.9775C14.5523 19.9775 15 19.5298 15 18.9775H13ZM18 6.96861L17.8926 19.0043L19.8925 19.0222L20 6.98647L18 6.96861ZM14.8927 21.9775H9V23.9775H14.8927V21.9775ZM4 6.97754V18.9775H6V6.97754H4ZM4 7.97754H5V5.97754H4V7.97754ZM5 7.97754H8V5.97754H5V7.97754ZM8 7.97754H16V5.97754H8V7.97754ZM16 7.97754H19V5.97754H16V7.97754ZM19 7.97754H20V5.97754H19V7.97754ZM9 6.53309C9 5.22917 10.2292 3.97754 12 3.97754V1.97754C9.35256 1.97754 7 3.90966 7 6.53309H9ZM12 3.97754C13.7708 3.97754 15 5.22917 15 6.53309H17C17 3.90966 14.6474 1.97754 12 1.97754V3.97754ZM7 6.53309V6.97754H9V6.53309H7ZM15 6.53309V6.97754H17V6.53309H15ZM9 21.9775C7.34314 21.9775 6 20.6344 6 18.9775H4C4 21.739 6.23857 23.9775 9 23.9775V21.9775ZM17.8926 19.0043C17.8779 20.6507 16.5391 21.9775 14.8927 21.9775V23.9775C17.6367 23.9775 19.868 21.7661 19.8925 19.0222L17.8926 19.0043ZM9 10.9775V18.9775H11V10.9775H9ZM13 10.9775V18.9775H15V10.9775H13Z"
                              fill="#FF3D00"
                            />
                          </Svg>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={{paddingTop: 20}} />
                    {isProfileAvailable('threads') && (
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <View
                          style={[
                            dynamicStyles.DivContainer,
                            {
                              justifyContent: 'center',
                              alignContent: 'center',
                              padding: 10,
                              borderRadius: 5,
                              width: '90%',
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
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
                                fontSize: 12,
                                textDecorationLine: 'underline',
                                fontFamily: 'Manrope-Regular',
                              }}
                              onPress={() =>
                                Linking.openURL(threadsAccount?.link)
                              }>
                              {threadsAccount?.link}
                            </Text>
                            <View>
                              {threadsAccount?.status === 'pending' && (
                                <Text
                                  style={{
                                    color: 'yellow',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Pending
                                </Text>
                              )}
                              {threadsAccount?.status === 'verified' && (
                                <Text
                                  style={{
                                    color: 'green',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Verified
                                </Text>
                              )}
                              {threadsAccount?.status === 'rejected' && (
                                <Text
                                  style={{
                                    color: 'red',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Rejected
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => DeleteSocialLinks('Threads')}>
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none">
                            <Path
                              d="M18.8925 19.0133L19.8925 19.0222L18.8925 19.0133ZM4 5.97754C3.44772 5.97754 3 6.42525 3 6.97754C3 7.52982 3.44772 7.97754 4 7.97754V5.97754ZM20 7.97754C20.5523 7.97754 21 7.52982 21 6.97754C21 6.42525 20.5523 5.97754 20 5.97754V7.97754ZM11 10.9775C11 10.4253 10.5523 9.97754 10 9.97754C9.44772 9.97754 9 10.4253 9 10.9775H11ZM9 18.9775C9 19.5298 9.44772 19.9775 10 19.9775C10.5523 19.9775 11 19.5298 11 18.9775H9ZM15 10.9775C15 10.4253 14.5523 9.97754 14 9.97754C13.4477 9.97754 13 10.4253 13 10.9775H15ZM13 18.9775C13 19.5298 13.4477 19.9775 14 19.9775C14.5523 19.9775 15 19.5298 15 18.9775H13ZM18 6.96861L17.8926 19.0043L19.8925 19.0222L20 6.98647L18 6.96861ZM14.8927 21.9775H9V23.9775H14.8927V21.9775ZM4 6.97754V18.9775H6V6.97754H4ZM4 7.97754H5V5.97754H4V7.97754ZM5 7.97754H8V5.97754H5V7.97754ZM8 7.97754H16V5.97754H8V7.97754ZM16 7.97754H19V5.97754H16V7.97754ZM19 7.97754H20V5.97754H19V7.97754ZM9 6.53309C9 5.22917 10.2292 3.97754 12 3.97754V1.97754C9.35256 1.97754 7 3.90966 7 6.53309H9ZM12 3.97754C13.7708 3.97754 15 5.22917 15 6.53309H17C17 3.90966 14.6474 1.97754 12 1.97754V3.97754ZM7 6.53309V6.97754H9V6.53309H7ZM15 6.53309V6.97754H17V6.53309H15ZM9 21.9775C7.34314 21.9775 6 20.6344 6 18.9775H4C4 21.739 6.23857 23.9775 9 23.9775V21.9775ZM17.8926 19.0043C17.8779 20.6507 16.5391 21.9775 14.8927 21.9775V23.9775C17.6367 23.9775 19.868 21.7661 19.8925 19.0222L17.8926 19.0043ZM9 10.9775V18.9775H11V10.9775H9ZM13 10.9775V18.9775H15V10.9775H13Z"
                              fill="#FF3D00"
                            />
                          </Svg>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={{paddingTop: 20}} />
                    {isProfileAvailable('twitter') && (
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <View
                          style={[
                            dynamicStyles.DivContainer,
                            {
                              justifyContent: 'center',
                              alignContent: 'center',
                              padding: 10,
                              borderRadius: 5,
                              width: '90%',
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 5,
                              }}>
                              <Svg
                                width="30"
                                height="30"
                                viewBox="0 0 47 47"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <Path
                                  d="M37.0145 2.25781H44.2211L28.4761 20.2549L47 44.7399H32.4966L21.1382 29.8879L8.13883 44.7399H0.92825L17.7699 25.4895L0 2.25977H14.8716L25.1391 15.8349L37.0145 2.25781ZM34.4863 40.4277H38.4793L12.7018 6.34485H8.41692L34.4863 40.4277Z"
                                  fill="white"
                                />
                              </Svg>
                            </View>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                textDecorationLine: 'underline',
                                fontFamily: 'Manrope-Regular',
                              }}
                              onPress={() =>
                                Linking.openURL(twitterAccount?.link)
                              }>
                              {twitterAccount?.link}
                            </Text>
                            <View>
                              {twitterAccount?.status === 'pending' && (
                                <Text
                                  style={{
                                    color: 'yellow',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Pending
                                </Text>
                              )}
                              {twitterAccount?.status === 'verified' && (
                                <Text
                                  style={{
                                    color: 'green',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Verified
                                </Text>
                              )}
                              {twitterAccount?.status === 'rejected' && (
                                <Text
                                  style={{
                                    color: 'red',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Rejected
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => DeleteSocialLinks('Twitter')}>
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none">
                            <Path
                              d="M18.8925 19.0133L19.8925 19.0222L18.8925 19.0133ZM4 5.97754C3.44772 5.97754 3 6.42525 3 6.97754C3 7.52982 3.44772 7.97754 4 7.97754V5.97754ZM20 7.97754C20.5523 7.97754 21 7.52982 21 6.97754C21 6.42525 20.5523 5.97754 20 5.97754V7.97754ZM11 10.9775C11 10.4253 10.5523 9.97754 10 9.97754C9.44772 9.97754 9 10.4253 9 10.9775H11ZM9 18.9775C9 19.5298 9.44772 19.9775 10 19.9775C10.5523 19.9775 11 19.5298 11 18.9775H9ZM15 10.9775C15 10.4253 14.5523 9.97754 14 9.97754C13.4477 9.97754 13 10.4253 13 10.9775H15ZM13 18.9775C13 19.5298 13.4477 19.9775 14 19.9775C14.5523 19.9775 15 19.5298 15 18.9775H13ZM18 6.96861L17.8926 19.0043L19.8925 19.0222L20 6.98647L18 6.96861ZM14.8927 21.9775H9V23.9775H14.8927V21.9775ZM4 6.97754V18.9775H6V6.97754H4ZM4 7.97754H5V5.97754H4V7.97754ZM5 7.97754H8V5.97754H5V7.97754ZM8 7.97754H16V5.97754H8V7.97754ZM16 7.97754H19V5.97754H16V7.97754ZM19 7.97754H20V5.97754H19V7.97754ZM9 6.53309C9 5.22917 10.2292 3.97754 12 3.97754V1.97754C9.35256 1.97754 7 3.90966 7 6.53309H9ZM12 3.97754C13.7708 3.97754 15 5.22917 15 6.53309H17C17 3.90966 14.6474 1.97754 12 1.97754V3.97754ZM7 6.53309V6.97754H9V6.53309H7ZM15 6.53309V6.97754H17V6.53309H15ZM9 21.9775C7.34314 21.9775 6 20.6344 6 18.9775H4C4 21.739 6.23857 23.9775 9 23.9775V21.9775ZM17.8926 19.0043C17.8779 20.6507 16.5391 21.9775 14.8927 21.9775V23.9775C17.6367 23.9775 19.868 21.7661 19.8925 19.0222L17.8926 19.0043ZM9 10.9775V18.9775H11V10.9775H9ZM13 10.9775V18.9775H15V10.9775H13Z"
                              fill="#FF3D00"
                            />
                          </Svg>
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={{paddingTop: 20}} />
                    {isProfileAvailable('tiktok') && (
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <View
                          style={[
                            dynamicStyles.DivContainer,
                            {
                              justifyContent: 'center',
                              alignContent: 'center',
                              padding: 10,
                              borderRadius: 5,
                              width: '90%',
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 5,
                              }}>
                              <Svg
                                width="30"
                                height="30"
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
                                fontSize: 12,
                                textDecorationLine: 'underline',
                                fontFamily: 'Manrope-Regular',
                              }}
                              onPress={() =>
                                Linking.openURL(tiktokAccount?.link)
                              }>
                              {tiktokAccount?.link}
                            </Text>
                            <View>
                              {tiktokAccount?.status === 'pending' && (
                                <Text
                                  style={{
                                    color: 'yellow',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Pending
                                </Text>
                              )}
                              {tiktokAccount?.status === 'verified' && (
                                <Text
                                  style={{
                                    color: 'green',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Verified
                                </Text>
                              )}
                              {tiktokAccount?.status === 'rejected' && (
                                <Text
                                  style={{
                                    color: 'red',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Rejected
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => DeleteSocialLinks('Tiktok')}>
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none">
                            <Path
                              d="M18.8925 19.0133L19.8925 19.0222L18.8925 19.0133ZM4 5.97754C3.44772 5.97754 3 6.42525 3 6.97754C3 7.52982 3.44772 7.97754 4 7.97754V5.97754ZM20 7.97754C20.5523 7.97754 21 7.52982 21 6.97754C21 6.42525 20.5523 5.97754 20 5.97754V7.97754ZM11 10.9775C11 10.4253 10.5523 9.97754 10 9.97754C9.44772 9.97754 9 10.4253 9 10.9775H11ZM9 18.9775C9 19.5298 9.44772 19.9775 10 19.9775C10.5523 19.9775 11 19.5298 11 18.9775H9ZM15 10.9775C15 10.4253 14.5523 9.97754 14 9.97754C13.4477 9.97754 13 10.4253 13 10.9775H15ZM13 18.9775C13 19.5298 13.4477 19.9775 14 19.9775C14.5523 19.9775 15 19.5298 15 18.9775H13ZM18 6.96861L17.8926 19.0043L19.8925 19.0222L20 6.98647L18 6.96861ZM14.8927 21.9775H9V23.9775H14.8927V21.9775ZM4 6.97754V18.9775H6V6.97754H4ZM4 7.97754H5V5.97754H4V7.97754ZM5 7.97754H8V5.97754H5V7.97754ZM8 7.97754H16V5.97754H8V7.97754ZM16 7.97754H19V5.97754H16V7.97754ZM19 7.97754H20V5.97754H19V7.97754ZM9 6.53309C9 5.22917 10.2292 3.97754 12 3.97754V1.97754C9.35256 1.97754 7 3.90966 7 6.53309H9ZM12 3.97754C13.7708 3.97754 15 5.22917 15 6.53309H17C17 3.90966 14.6474 1.97754 12 1.97754V3.97754ZM7 6.53309V6.97754H9V6.53309H7ZM15 6.53309V6.97754H17V6.53309H15ZM9 21.9775C7.34314 21.9775 6 20.6344 6 18.9775H4C4 21.739 6.23857 23.9775 9 23.9775V21.9775ZM17.8926 19.0043C17.8779 20.6507 16.5391 21.9775 14.8927 21.9775V23.9775C17.6367 23.9775 19.868 21.7661 19.8925 19.0222L17.8926 19.0043ZM9 10.9775V18.9775H11V10.9775H9ZM13 10.9775V18.9775H15V10.9775H13Z"
                              fill="#FF3D00"
                            />
                          </Svg>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
                <>
                  <View style={{paddingTop: 20}} />
                  {!isProfileAvailable('instagram') && (
                    <View
                      style={[
                        dynamicStyles.DivContainer,
                        {
                          justifyContent: 'center',
                          alignContent: 'center',
                          padding: 10,
                          borderRadius: 5,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Svg
                            width="30"
                            height="30"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <Path
                              d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                              fill="url(#paint0_radial_3208_15821)"
                            />
                            <Path
                              d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                              fill="url(#paint1_radial_3208_15821)"
                            />
                            <Path
                              d="M10.0007 2.1875C7.87898 2.1875 7.61266 2.1968 6.77938 2.23469C5.94766 2.27281 5.37992 2.40445 4.8832 2.59766C4.3693 2.79719 3.93344 3.06414 3.49922 3.49852C3.06461 3.93281 2.79766 4.36867 2.5975 4.88234C2.40375 5.37922 2.27195 5.94719 2.23453 6.77852C2.19727 7.61188 2.1875 7.87828 2.1875 10.0001C2.1875 12.1219 2.19688 12.3873 2.23469 13.2206C2.27297 14.0523 2.40461 14.6201 2.59766 15.1168C2.79734 15.6307 3.0643 16.0666 3.49867 16.5008C3.93281 16.9354 4.36867 17.203 4.88219 17.4025C5.3793 17.5957 5.94711 17.7273 6.77867 17.7655C7.61203 17.8034 7.87813 17.8127 9.99977 17.8127C12.1217 17.8127 12.3872 17.8034 13.2205 17.7655C14.0522 17.7273 14.6205 17.5957 15.1177 17.4025C15.6313 17.203 16.0666 16.9354 16.5006 16.5008C16.9352 16.0666 17.2021 15.6307 17.4023 15.117C17.5944 14.6201 17.7262 14.0522 17.7653 13.2208C17.8027 12.3875 17.8125 12.1219 17.8125 10.0001C17.8125 7.87828 17.8027 7.61203 17.7653 6.77867C17.7262 5.94695 17.5944 5.3793 17.4023 4.88258C17.2021 4.36867 16.9352 3.93281 16.5006 3.49852C16.0661 3.06398 15.6315 2.79703 15.1172 2.59773C14.6191 2.40445 14.0511 2.27273 13.2194 2.23469C12.386 2.1968 12.1207 2.1875 9.99828 2.1875H10.0007ZM9.29984 3.59539C9.50789 3.59508 9.74 3.59539 10.0007 3.59539C12.0867 3.59539 12.3339 3.60289 13.1577 3.64031C13.9194 3.67516 14.3328 3.80242 14.6082 3.90938C14.9728 4.05094 15.2327 4.22023 15.506 4.49375C15.7795 4.76719 15.9487 5.02758 16.0906 5.39219C16.1976 5.66719 16.325 6.08063 16.3597 6.84234C16.3971 7.66594 16.4052 7.91328 16.4052 9.99828C16.4052 12.0833 16.3971 12.3307 16.3597 13.1542C16.3248 13.9159 16.1976 14.3294 16.0906 14.6045C15.9491 14.9691 15.7795 15.2287 15.506 15.502C15.2326 15.7754 14.973 15.9446 14.6082 16.0863C14.3331 16.1937 13.9194 16.3206 13.1577 16.3555C12.3341 16.3929 12.0867 16.401 10.0007 16.401C7.91461 16.401 7.66734 16.3929 6.84383 16.3555C6.08211 16.3203 5.66867 16.193 5.39305 16.0861C5.02852 15.9445 4.76805 15.7752 4.49461 15.5018C4.22117 15.2284 4.05195 14.9686 3.91 14.6038C3.80305 14.3287 3.67562 13.9153 3.64094 13.1536C3.60352 12.33 3.59602 12.0827 3.59602 9.99633C3.59602 7.91008 3.60352 7.66398 3.64094 6.84039C3.67578 6.07867 3.80305 5.66523 3.91 5.38984C4.05164 5.02523 4.22117 4.76484 4.49469 4.49141C4.76813 4.21797 5.02852 4.04867 5.39312 3.9068C5.66852 3.79938 6.08211 3.67242 6.84383 3.63742C7.56453 3.60484 7.84383 3.59508 9.29984 3.59344V3.59539ZM14.171 4.89258C13.6534 4.89258 13.2335 5.31211 13.2335 5.82977C13.2335 6.34734 13.6534 6.76727 14.171 6.76727C14.6886 6.76727 15.1085 6.34734 15.1085 5.82977C15.1085 5.31219 14.6886 4.89227 14.171 4.89227V4.89258ZM10.0007 5.98797C7.78508 5.98797 5.98867 7.78438 5.98867 10.0001C5.98867 12.2158 7.78508 14.0113 10.0007 14.0113C12.2164 14.0113 14.0122 12.2158 14.0122 10.0001C14.0122 7.78445 12.2163 5.98797 10.0005 5.98797H10.0007ZM10.0007 7.39586C11.4389 7.39586 12.6049 8.56172 12.6049 10.0001C12.6049 11.4383 11.4389 12.6043 10.0007 12.6043C8.56242 12.6043 7.39656 11.4383 7.39656 10.0001C7.39656 8.56172 8.56242 7.39586 10.0007 7.39586Z"
                              fill="white"
                            />
                            <Defs>
                              <RadialGradient
                                id="paint0_radial_3208_15821"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(5.3125 21.5404) rotate(-90) scale(19.8215 18.4355)">
                                <Stop stop-color="#FFDD55" />
                                <Stop offset="0.1" stop-color="#FFDD55" />
                                <Stop offset="0.5" stop-color="#FF543E" />
                                <Stop offset="1" stop-color="#C837AB" />
                              </RadialGradient>
                              <RadialGradient
                                id="paint1_radial_3208_15821"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(-3.35008 1.4407) rotate(78.681) scale(8.86031 36.5225)">
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
                        <View>
                          <TouchableOpacity
                            onPress={() => setIsIGModalVisible(true)}>
                            <Text
                              style={{
                                color: 'red',
                                fontSize: 15,
                                fontFamily: 'Manrope-Bold',
                              }}>
                              Link
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                  <View style={{paddingTop: 20}} />
                  {!isProfileAvailable('threads') && (
                    <View
                      style={[
                        dynamicStyles.DivContainer,
                        {
                          justifyContent: 'center',
                          alignContent: 'center',
                          padding: 10,
                          borderRadius: 5,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
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
                        <View>
                          <TouchableOpacity
                          // onPress={() => setIsModalVisible(true)}
                          >
                            <Text
                              style={{
                                color: 'red',
                                fontSize: 15,
                                fontFamily: 'Manrope-Bold',
                              }}>
                              Link
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                  <View style={{paddingTop: 10}} />
                  {!isProfileAvailable('facebook') && (
                    <View
                      style={[
                        dynamicStyles.DivContainer,
                        {
                          justifyContent: 'center',
                          alignContent: 'center',
                          padding: 10,
                          borderRadius: 5,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Svg
                            width="30"
                            height="30"
                            viewBox="0 0 47 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <Path
                              d="M47 24.0898C47 11.1112 36.4786 0.589844 23.5 0.589844C10.5214 0.589844 0 11.1112 0 24.0898C0 35.8193 8.59366 45.5415 19.8281 47.3044V30.8828H13.8613V24.0898H19.8281V18.9125C19.8281 13.0228 23.3366 9.76953 28.7045 9.76953C31.2756 9.76953 33.9648 10.2285 33.9648 10.2285V16.0117H31.0016C28.0823 16.0117 27.1719 17.8232 27.1719 19.6818V24.0898H33.6895L32.6476 30.8828H27.1719V47.3044C38.4063 45.5415 47 35.8195 47 24.0898Z"
                              fill="#1877F2"
                            />
                            <Path
                              d="M32.6476 30.8828L33.6895 24.0898H27.1719V19.6818C27.1719 17.8231 28.0823 16.0117 31.0016 16.0117H33.9648V10.2285C33.9648 10.2285 31.2756 9.76953 28.7043 9.76953C23.3366 9.76953 19.8281 13.0228 19.8281 18.9125V24.0898H13.8613V30.8828H19.8281V47.3044C21.0428 47.4947 22.2705 47.5902 23.5 47.5898C24.7295 47.5902 25.9572 47.4948 27.1719 47.3044V30.8828H32.6476Z"
                              fill="white"
                            />
                          </Svg>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={() => setIsFBModalVisible(true)}>
                            <Text
                              style={{
                                color: 'red',
                                fontSize: 15,
                                fontFamily: 'Manrope-Bold',
                              }}>
                              Link
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                  <View style={{paddingTop: 10}} />
                  {!isProfileAvailable('twitter') && (
                    <View
                      style={[
                        dynamicStyles.DivContainer,
                        {
                          justifyContent: 'center',
                          alignContent: 'center',
                          padding: 10,
                          borderRadius: 5,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                          <Svg
                            width="30"
                            height="30"
                            viewBox="0 0 47 47"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <Path
                              d="M37.0145 2.25781H44.2211L28.4761 20.2549L47 44.7399H32.4966L21.1382 29.8879L8.13883 44.7399H0.92825L17.7699 25.4895L0 2.25977H14.8716L25.1391 15.8349L37.0145 2.25781ZM34.4863 40.4277H38.4793L12.7018 6.34485H8.41692L34.4863 40.4277Z"
                              fill="white"
                            />
                          </Svg>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={() => setIsXModalVisible(true)}>
                            <Text
                              style={{
                                color: 'red',
                                fontSize: 15,
                                fontFamily: 'Manrope-Bold',
                              }}>
                              Link
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={{paddingTop: 10}} />
                  <View style={{paddingTop: 10}} />
                  {!isProfileAvailable('tiktok') && (
                    <View
                      style={[
                        dynamicStyles.DivContainer,
                        {
                          justifyContent: 'center',
                          alignContent: 'center',
                          padding: 10,
                          borderRadius: 5,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                          <Svg
                            width="30"
                            height="30"
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
                        <View>
                          <TouchableOpacity
                            onPress={() => setIsTKModalVisible(true)}>
                            <Text
                              style={{
                                color: 'red',
                                fontSize: 15,
                                fontFamily: 'Manrope-Bold',
                              }}>
                              Link
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                  <View style={{paddingTop: 10}} />
                </>
              </View>
            </View>
          </View>
        )}
      </>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isXModalVisible}
        onRequestClose={() => setIsXModalVisible(false)}>
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
                  onPress={() => setIsXModalVisible(false)}>
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
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none">
                      <Path
                        d="M37.5145 3.14795H44.7211L28.9761 21.145L47.5 45.6301H32.9966L21.6383 30.7781L8.63883 45.6301H1.42825L18.2699 26.3797L0.5 3.14991H15.3716L25.6391 16.7251L37.5145 3.14795ZM34.9863 41.3178H38.9793L13.2018 7.23499H8.91692L34.9863 41.3178Z"
                        fill="black"
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
                    Link Your X Account
                  </Text>
                </View>
                <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
                  <Text
                    style={{fontSize: 12, paddingTop: 10, paddingBottom: 10}}>
                    You must obey the following rules in order to successfully
                    link your X account to Trendti3.
                  </Text>
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <Text style={{fontSize: 12}}>1.</Text>
                    <Text style={{fontSize: 12}}>
                      Your account on X must have at least 500 Active Followers.
                      Note that Ghost or Bots followers are not allowed and your
                      account on Trendit³ will be banned if you have ghost
                      followers
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>2.</Text>
                    <Text style={{fontSize: 12}}>
                      You Account on X must have been opened one year ago.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>3.</Text>
                    <Text style={{fontSize: 12}}>
                      You must have posted at least five times on your X account
                      within the last one year
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
                    Please enter your X profile link which you want to use to
                    perform this task:{' '}
                  </Text>
                  <View style={{paddingVertical: 20}}>
                    <TextInput
                      placeholder="X profile  link"
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
                    onPress={() => sendLinkData('twitter', link)}
                    disabled={IsLoading}>
                    {IsLoading ? (
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
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isFBModalVisible}
        onRequestClose={() => setIsFBModalVisible(false)}>
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
                  onPress={() => setIsFBModalVisible(false)}>
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
                      width="46"
                      height="47"
                      viewBox="0 0 46 47"
                      fill="none">
                      <Path
                        d="M46 23.5C46 10.7975 35.7025 0.5 23 0.5C10.2975 0.5 0 10.7975 0 23.5C0 34.9799 8.41081 44.4952 19.4062 46.2206V30.1484H13.5664V23.5H19.4062V18.4328C19.4062 12.6684 22.8401 9.48437 28.0938 9.48437C30.6101 9.48437 33.2422 9.93359 33.2422 9.93359V15.5937H30.342C27.4848 15.5937 26.5938 17.3667 26.5938 19.1857V23.5H32.9727L31.9529 30.1484H26.5938V46.2206C37.5892 44.4952 46 34.9801 46 23.5Z"
                        fill="#1877F2"
                      />
                      <Path
                        d="M31.9529 30.1484L32.9727 23.5H26.5938V19.1857C26.5938 17.3665 27.4848 15.5938 30.342 15.5938H33.2422V9.93359C33.2422 9.93359 30.6101 9.48438 28.0936 9.48438C22.8401 9.48438 19.4062 12.6684 19.4062 18.4328V23.5H13.5664V30.1484H19.4062V46.2206C20.5951 46.4069 21.7966 46.5003 23 46.5C24.2034 46.5004 25.4049 46.4069 26.5938 46.2206V30.1484H31.9529Z"
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
                    Link Your Facebook Account
                  </Text>
                </View>
                <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
                  <Text
                    style={{fontSize: 12, paddingTop: 10, paddingBottom: 10}}>
                    You must obey the following rules in order to successfully
                    link your Facebook account to Trendti3.
                  </Text>
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <Text style={{fontSize: 12}}>1.</Text>
                    <Text style={{fontSize: 12}}>
                      Your account on Facebook must have at least 500 Active
                      Followers. Note that Ghost or Bots followers are not
                      allowed and your account on Trendit³ will be banned if you
                      have ghost followers
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>2.</Text>
                    <Text style={{fontSize: 12}}>
                      You Account on Facebook must have been opened one year
                      ago.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 5, paddingTop: 5}}>
                    <Text style={{fontSize: 12}}>3.</Text>
                    <Text style={{fontSize: 12}}>
                      You must have posted at least five times on your Facebook
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
                    Please enter your Facebook profile link which you want to
                    use to perform this task:{' '}
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
                    onPress={() => sendLinkData('Facebook', link)}
                    disabled={IsLoading}>
                    {IsLoading ? (
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
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isTKModalVisible}
        onRequestClose={() => setIsTKModalVisible(false)}>
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
                  onPress={() => setIsTKModalVisible(false)}>
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
                      placeholder="Tiktok profile  link"
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
                    onPress={() => sendLinkData('tiktok', link)}
                    disabled={IsLoading}>
                    {IsLoading ? (
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
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isIGModalVisible}
        onRequestClose={() => setIsIGModalVisible(false)}>
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
                  onPress={() => setIsIGModalVisible(false)}>
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
                    onPress={() => sendLinkData('instagram', link)}
                    disabled={IsLoading}>
                    {IsLoading ? (
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
    </ScrollView>
  );
};

export default SocialMedia;
