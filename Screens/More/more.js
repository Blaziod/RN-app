/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Svg, Path, G} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const More = () => {
  const height = Dimensions.get('screen').height;
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('userdatafiles1')
      .then(data => {
        // eslint-disable-next-line no-shadow
        const userData = JSON.parse(data);
        setUserData(userData);
        console.log('Here I am', userData);

        if (!userData) {
          navigation.navigate('SignIn');
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('https://api.trendit3.com/api/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`, // Add the access token to the headers
        },
        credentials: 'include', // This is required to include the cookie in the request
      });

      const data = await response.json();

      if (response.ok) {
        // return response.data;
        console.log('Successful', response);
        // Clear the access token
        await AsyncStorage.removeItem('userbalance');
        await AsyncStorage.removeItem('userdata1');
        await AsyncStorage.removeItem('userdata');
        await AsyncStorage.removeItem('userdata2');
        await AsyncStorage.removeItem('userdatas');
        await AsyncStorage.removeItem('userdatafiles1');
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
            fontSize: 20,
          },
          text2Style: {
            color: 'green',
            fontSize: 20,
            fontFamily: 'CamptonBold',
          },
        });

        console.log('Token cleared successfully');
        navigation.navigate('SignIn');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Toast({
        type: 'error',
        text1: 'Error',
        text2: error,
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
          fontSize: 20,
        },
        text2Style: {
          color: 'green',
          fontSize: 20,
          fontFamily: 'CamptonBold',
        },
      });
      return null;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#121212', flex: 1}}>
      <ScrollView>
        <StatusBar />

        <View
          style={{
            alignItems: 'flex-end',
            paddingTop: height - 470,
          }}>
          <View
            style={{
              backgroundColor: '#000',
              padding: 10,
              width: 200,
              height: height - 400,
            }}>
            <View style={{padding: 10}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="Essentials/search list">
                    <Path
                      id="Icon"
                      d="M2 3C1.44772 3 1 3.44772 1 4C1 4.55228 1.44772 5 2 5V3ZM8 5C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3V5ZM2 9C1.44772 9 1 9.44772 1 10C1 10.5523 1.44772 11 2 11V9ZM6 11C6.55228 11 7 10.5523 7 10C7 9.44772 6.55228 9 6 9V11ZM2 14C1.44772 14 1 14.4477 1 15C1 15.5523 1.44772 16 2 16V14ZM8 16C8.55228 16 9 15.5523 9 15C9 14.4477 8.55228 14 8 14V16ZM2 19C1.44772 19 1 19.4477 1 20C1 20.5523 1.44772 21 2 21V19ZM20 21C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19V21ZM21.2929 16.7071C21.6834 17.0976 22.3166 17.0976 22.7071 16.7071C23.0976 16.3166 23.0976 15.6834 22.7071 15.2929L21.2929 16.7071ZM2 5H8V3H2V5ZM2 11H6V9H2V11ZM2 16H8V14H2V16ZM2 21H20V19H2V21ZM20.5294 9.76471C20.5294 12.3962 18.3962 14.5294 15.7647 14.5294V16.5294C19.5007 16.5294 22.5294 13.5007 22.5294 9.76471H20.5294ZM15.7647 14.5294C13.1332 14.5294 11 12.3962 11 9.76471H9C9 13.5007 12.0287 16.5294 15.7647 16.5294V14.5294ZM11 9.76471C11 7.13323 13.1332 5 15.7647 5V3C12.0287 3 9 6.02866 9 9.76471H11ZM15.7647 5C18.3962 5 20.5294 7.13323 20.5294 9.76471H22.5294C22.5294 6.02866 19.5007 3 15.7647 3V5ZM19.1752 14.5895L21.2929 16.7071L22.7071 15.2929L20.5895 13.1752L19.1752 14.5895Z"
                      fill="#B1B1B1"
                    />
                  </G>
                </Svg>

                <Text style={{color: '#B1B1B1', fontSize: 14}}>Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M11.3536 9.35355L12.0607 8.64645L11.3536 9.35355ZM14.6464 12.6464L13.9393 13.3536L14.6464 12.6464ZM15.3536 12.6464L16.0607 13.3536L16.0607 13.3536L15.3536 12.6464ZM21.7071 7.70711C22.0976 7.31658 22.0976 6.68342 21.7071 6.29289C21.3166 5.90237 20.6834 5.90237 20.2929 6.29289L21.7071 7.70711ZM5.29289 13.2929C4.90237 13.6834 4.90237 14.3166 5.29289 14.7071C5.68342 15.0976 6.31658 15.0976 6.70711 14.7071L5.29289 13.2929ZM10.6464 9.35355L11.3536 10.0607L11.3536 10.0607L10.6464 9.35355ZM17 5C16.4477 5 16 5.44772 16 6C16 6.55228 16.4477 7 17 7V5ZM21 11C21 11.5523 21.4477 12 22 12C22.5523 12 23 11.5523 23 11H21ZM22 21C22.5523 21 23 20.5523 23 20C23 19.4477 22.5523 19 22 19V21ZM3 4C3 3.44772 2.55228 3 2 3C1.44772 3 1 3.44772 1 4H3ZM4.18404 19.564L4.63803 18.673H4.63803L4.18404 19.564ZM2.43597 17.816L1.54497 18.27L2.43597 17.816ZM10.6464 10.0607L13.9393 13.3536L15.3536 11.9393L12.0607 8.64645L10.6464 10.0607ZM16.0607 13.3536L21.7071 7.70711L20.2929 6.29289L14.6464 11.9393L16.0607 13.3536ZM6.70711 14.7071L11.3536 10.0607L9.93934 8.64645L5.29289 13.2929L6.70711 14.7071ZM13.9393 13.3536C14.5251 13.9393 15.4749 13.9393 16.0607 13.3536L14.6464 11.9393C14.8417 11.7441 15.1583 11.7441 15.3536 11.9393L13.9393 13.3536ZM12.0607 8.64645C11.4749 8.06066 10.5251 8.06066 9.93934 8.64645L11.3536 10.0607C11.1583 10.2559 10.8417 10.2559 10.6464 10.0607L12.0607 8.64645ZM17 7H21.5V5H17V7ZM21 6.5V11H23V6.5H21ZM21.5 7C21.2239 7 21 6.77614 21 6.5H23C23 5.67157 22.3284 5 21.5 5V7ZM22 19H8.4V21H22V19ZM3 13.6V4H1V13.6H3ZM8.4 19C7.26339 19 6.47108 18.9992 5.85424 18.9488C5.24907 18.8994 4.90138 18.8072 4.63803 18.673L3.73005 20.455C4.32234 20.7568 4.96253 20.8826 5.69138 20.9422C6.40855 21.0008 7.2964 21 8.4 21V19ZM1 13.6C1 14.7036 0.999222 15.5914 1.05782 16.3086C1.11737 17.0375 1.24318 17.6777 1.54497 18.27L3.32698 17.362C3.19279 17.0986 3.10062 16.7509 3.05118 16.1458C3.00078 15.5289 3 14.7366 3 13.6H1ZM4.63803 18.673C4.07354 18.3854 3.6146 17.9265 3.32698 17.362L1.54497 18.27C2.02433 19.2108 2.78924 19.9757 3.73005 20.455L4.63803 18.673Z"
                    fill="#B1B1B1"
                  />
                </Svg>

                <Text style={{color: '#B1B1B1', fontSize: 14}}>Grow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="Menus/cursor/click/1">
                    <Path
                      id="Icon"
                      d="M7 7L5 5M10 6V3M6 10H3M13 7L15 5M5 15L7 13M9.44217 10.1496L13.4997 20.6992C13.6681 21.1371 14.2924 21.1229 14.4407 20.6778L15.9048 16.2856C15.9634 16.1099 16.1143 15.981 16.2969 15.9505L20.3987 15.2669C20.8842 15.186 20.973 14.526 20.526 14.3197L10.1184 9.51617C9.71081 9.32807 9.28103 9.73068 9.44217 10.1496Z"
                      stroke="#B1B1B1"
                      //   stroke-width="2"
                      stroke-linecap="round"
                    />
                  </G>
                </Svg>

                <Text style={{color: '#B1B1B1', fontSize: 14}}>Giveaways</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="Banking &#38; Finance/bars">
                    <Path
                      id="Icon"
                      d="M9 21L9 3M3 21L3 16M15 21L15 7M21 21V12"
                      stroke="#B1B1B1"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </G>
                </Svg>

                <Text style={{color: '#B1B1B1', fontSize: 14}}>
                  Transactions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="Essentials/double heart">
                    <Path
                      id="Icon"
                      d="M21 10.4087C21.8639 12.0076 21.7221 13.9978 20.5616 15.505C19.2895 17.1572 15.4395 20.6419 14.1777 21.7697C14.0365 21.8959 13.966 21.959 13.8836 21.9838C13.8118 22.0054 13.7331 22.0054 13.6613 21.9838C13.5789 21.959 13.5084 21.8959 13.3672 21.7697C12.9444 21.3918 12.2312 20.7494 11.4217 20M9.77245 4.67663C8.2174 2.84174 5.62425 2.34816 3.67587 4.02837C1.7275 5.70858 1.4532 8.51781 2.98327 10.505C4.25541 12.1572 8.10538 15.6419 9.36719 16.7697C9.50836 16.8959 9.57894 16.959 9.66128 16.9838C9.73314 17.0054 9.81177 17.0054 9.88363 16.9838C9.96596 16.959 10.0365 16.8959 10.1777 16.7697C11.4395 15.6419 15.2895 12.1572 16.5616 10.505C18.0917 8.51781 17.8509 5.69091 15.869 4.02837C13.8872 2.36584 11.3275 2.84174 9.77245 4.67663Z"
                      stroke="#B1B1B1"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </G>
                </Svg>

                <Text style={{color: '#B1B1B1', fontSize: 14}}>Refer Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="Essentials/settings/3">
                    <Path
                      id="Icon"
                      d="M4 5H16M16 5C16 6.10457 16.8954 7 18 7C19.1046 7 20 6.10457 20 5C20 3.89543 19.1046 3 18 3C16.8954 3 16 3.89543 16 5ZM8 12H20M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12ZM4 19H16M16 19C16 20.1046 16.8954 21 18 21C19.1046 21 20 20.1046 20 19C20 17.8954 19.1046 17 18 17C16.8954 17 16 17.8954 16 19Z"
                      stroke="#B1B1B1"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </G>
                </Svg>

                <Text style={{color: '#B1B1B1', fontSize: 14}}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="Essentials/information/hexagon">
                    <Path
                      id="Icon"
                      d="M12 16.0099V11.0099M12 8.00993V7.99994M4.33984 6.42257L11.0001 2.57728C11.6189 2.22001 12.3813 2.22001 13.0001 2.57728L19.6604 6.42257C20.2792 6.77984 20.6604 7.44009 20.6604 8.15463V15.8452C20.6604 16.5598 20.2792 17.22 19.6604 17.5773L13.0001 21.4226C12.3813 21.7798 11.6189 21.7798 11.0001 21.4226L4.33984 17.5773C3.72104 17.22 3.33984 16.5598 3.33984 15.8452V8.15463C3.33984 7.44009 3.72104 6.77984 4.33984 6.42257Z"
                      stroke="#B1B1B1"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </G>
                </Svg>

                <Text style={{color: '#B1B1B1', fontSize: 14}}>Support</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}
                onPress={async () => {
                  const result = await logout();
                  if (result) {
                    // eslint-disable-next-line no-undef
                    console.log('Successful', data);
                    Toast.show({
                      type: 'success',
                      text1: 'Success',
                      // eslint-disable-next-line no-undef
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
                        fontSize: 20,
                      },
                      text2Style: {
                        color: 'green',
                        fontSize: 20,
                        fontFamily: 'CamptonBold',
                      },
                    });

                    // console.log("Wallet Balance", data.wallet);
                    navigation.navigate('SignIn');
                  } else {
                    // Show an error message
                  }
                }}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="Essentials/exit">
                    <Path
                      id="Icon"
                      d="M6.00064 7C6.00064 7.55228 6.44835 8 7.00064 8C7.55292 8 8.00064 7.55228 8.00064 7H6.00064ZM8.00064 17C8.00064 16.4477 7.55292 16 7.00064 16C6.44835 16 6.00064 16.4477 6.00064 17H8.00064ZM8.09266 20.782L8.54665 19.891L8.54665 19.891L8.09266 20.782ZM7.21862 19.908L6.32762 20.362L7.21862 19.908ZM20.7826 19.908L21.6737 20.362L20.7826 19.908ZM19.9086 20.782L19.4546 19.891L19.4546 19.891L19.9086 20.782ZM19.9086 3.21799L19.4546 4.10899V4.10899L19.9086 3.21799ZM20.7826 4.09202L19.8916 4.54601V4.54601L20.7826 4.09202ZM7.21862 4.09202L8.10963 4.54601L7.21862 4.09202ZM8.09266 3.21799L7.63867 2.32698V2.32698L8.09266 3.21799ZM14.0006 13C14.5529 13 15.0006 12.5523 15.0006 12C15.0006 11.4477 14.5529 11 14.0006 11V13ZM3.00064 11C2.44835 11 2.00064 11.4477 2.00064 12C2.00064 12.5523 2.44835 13 3.00064 13V11ZM4.83269 9.5547C5.13904 9.09517 5.01487 8.4743 4.55534 8.16795C4.09581 7.8616 3.47494 7.98577 3.16859 8.4453L4.83269 9.5547ZM2.18554 11.7227L3.01759 12.2774H3.01759L2.18554 11.7227ZM2.18554 12.2774L3.01759 11.7227L2.18554 12.2774ZM3.16859 15.5547C3.47494 16.0142 4.09581 16.1384 4.55534 15.8321C5.01487 15.5257 5.13904 14.9048 4.83269 14.4453L3.16859 15.5547ZM8.00064 7V6.2H6.00064V7H8.00064ZM10.2006 4H17.8006V2H10.2006V4ZM20.0006 6.2V17.8H22.0006V6.2H20.0006ZM17.8006 20H10.2006V22H17.8006V20ZM8.00064 17.8V17H6.00064V17.8H8.00064ZM10.2006 20C9.62408 20 9.25181 19.9992 8.96847 19.9761C8.69681 19.9539 8.59609 19.9162 8.54665 19.891L7.63867 21.673C8.01705 21.8658 8.41026 21.9371 8.80561 21.9694C9.18928 22.0008 9.65709 22 10.2006 22V20ZM6.00064 17.8C6.00064 18.3436 5.99986 18.8114 6.03121 19.195C6.06351 19.5904 6.13482 19.9836 6.32762 20.362L8.10963 19.454C8.08444 19.4045 8.04676 19.3038 8.02456 19.0322C8.00142 18.7488 8.00064 18.3766 8.00064 17.8H6.00064ZM8.54665 19.891C8.35849 19.7951 8.2055 19.6422 8.10963 19.454L6.32762 20.362C6.61524 20.9265 7.07418 21.3854 7.63867 21.673L8.54665 19.891ZM20.0006 17.8C20.0006 18.3766 19.9999 18.7488 19.9767 19.0322C19.9545 19.3038 19.9168 19.4045 19.8916 19.454L21.6737 20.362C21.8665 19.9836 21.9378 19.5904 21.9701 19.195C22.0014 18.8114 22.0006 18.3436 22.0006 17.8H20.0006ZM17.8006 22C18.3442 22 18.812 22.0008 19.1957 21.9694C19.591 21.9371 19.9842 21.8658 20.3626 21.673L19.4546 19.891C19.4052 19.9162 19.3045 19.9539 19.0328 19.9761C18.7495 19.9992 18.3772 20 17.8006 20V22ZM19.8916 19.454C19.7958 19.6422 19.6428 19.7951 19.4546 19.891L20.3626 21.673C20.9271 21.3854 21.386 20.9265 21.6737 20.362L19.8916 19.454ZM17.8006 4C18.3772 4 18.7495 4.00078 19.0328 4.02393C19.3045 4.04612 19.4052 4.0838 19.4546 4.10899L20.3626 2.32698C19.9842 2.13419 19.591 2.06287 19.1957 2.03057C18.812 1.99922 18.3442 2 17.8006 2V4ZM22.0006 6.2C22.0006 5.65645 22.0014 5.18864 21.9701 4.80497C21.9378 4.40963 21.8665 4.01641 21.6737 3.63803L19.8916 4.54601C19.9168 4.59545 19.9545 4.69617 19.9767 4.96784C19.9999 5.25117 20.0006 5.62345 20.0006 6.2H22.0006ZM19.4546 4.10899C19.6428 4.20487 19.7958 4.35785 19.8916 4.54601L21.6737 3.63803C21.386 3.07354 20.9271 2.6146 20.3626 2.32698L19.4546 4.10899ZM8.00064 6.2C8.00064 5.62345 8.00142 5.25117 8.02456 4.96784C8.04676 4.69617 8.08444 4.59545 8.10963 4.54601L6.32762 3.63803C6.13482 4.01641 6.06351 4.40963 6.03121 4.80497C5.99986 5.18864 6.00064 5.65645 6.00064 6.2H8.00064ZM10.2006 2C9.65709 2 9.18928 1.99922 8.80561 2.03057C8.41026 2.06287 8.01705 2.13419 7.63867 2.32698L8.54665 4.10899C8.59609 4.0838 8.69681 4.04612 8.96847 4.02393C9.25181 4.00078 9.62408 4 10.2006 4V2ZM8.10963 4.54601C8.2055 4.35785 8.35849 4.20487 8.54665 4.10899L7.63867 2.32698C7.07418 2.6146 6.61524 3.07354 6.32762 3.63803L8.10963 4.54601ZM14.0006 11H3.00064V13H14.0006V11ZM3.16859 8.4453L1.35349 11.168L3.01759 12.2774L4.83269 9.5547L3.16859 8.4453ZM1.35349 12.8321L3.16859 15.5547L4.83269 14.4453L3.01759 11.7227L1.35349 12.8321ZM1.35349 11.168C1.01759 11.6718 1.01759 12.3282 1.35349 12.8321L3.01759 11.7227C3.12955 11.8906 3.12955 12.1094 3.01759 12.2774L1.35349 11.168Z"
                      fill="#FF3D00"
                    />
                  </G>
                </Svg>

                <Text style={{color: '#FF3D00', fontSize: 14}}>Sign Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{backgroundColor: '#fff', width: 100, height: 50}}
                onPress={() => {
                  AsyncStorage.removeItem('userdatafiles1');
                  AsyncStorage.removeItem('userdata1');
                  AsyncStorage.removeItem('userdata');
                  AsyncStorage.removeItem('userdata2');
                  AsyncStorage.removeItem('userdatas');
                  console.log('Token cleared successfully');
                  navigation.navigate('SignIn');
                }}>
                <Text>Clear Token</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default More;
