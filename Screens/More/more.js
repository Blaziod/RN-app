/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Svg, Path, G} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../Components/Contexts/colorTheme';
import {ApiLink} from '../../enums/apiLink';

const More = () => {
  // const height = Dimensions.get('screen').height;
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const {theme} = useTheme();
  const strokeColor = theme === 'dark' ? '#fff' : '#000'; // Choosing color based on theme

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor: theme === 'dark' ? '#000' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
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
      const response = await fetch(`${ApiLink.ENDPOINT_1}/logout`, {
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
        await AsyncStorage.removeItem('accesstoken');
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
            fontFamily: 'Campton Bold',
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
          fontSize: 14,
        },
        text2Style: {
          color: 'green',
          fontSize: 14,
          fontFamily: 'Campton Bold',
        },
      });
      <ActivityIndicator />;
    }
  };

  return (
    <SafeAreaView
      style={[
        {backgroundColor: '#121212', flex: 1},
        dynamicStyles.AppContainer,
      ]}>
      <StatusBar />
      <View style={{paddingTop: '100%'}} />
      <View
        style={{
          alignItems: 'flex-end',
        }}>
        <View
          style={[
            {
              backgroundColor: '#000',
              padding: 10,
              width: '45%',
            },
            dynamicStyles.DivContainer,
          ]}>
          <View style={{padding: 10}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 5,
                paddingVertical: 5,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Transact')}>
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
                    stroke={strokeColor}
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </G>
              </Svg>

              <Text
                style={[
                  {color: '#B1B1B1', fontSize: 14},
                  dynamicStyles.TextColor,
                ]}>
                Transactions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 5,
                paddingVertical: 5,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Refer')}>
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
                    stroke={strokeColor}
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </G>
              </Svg>
              <Text
                style={[
                  {color: '#B1B1B1', fontSize: 14},
                  dynamicStyles.TextColor,
                ]}>
                Refer Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 5,
                paddingVertical: 5,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Settings')}>
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
                    stroke={strokeColor}
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </G>
              </Svg>

              <Text
                style={[
                  {color: '#B1B1B1', fontSize: 14},
                  dynamicStyles.TextColor,
                ]}>
                Settings
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
                <G id="Essentials/information/hexagon">
                  <Path
                    id="Icon"
                    d="M12 16.0099V11.0099M12 8.00993V7.99994M4.33984 6.42257L11.0001 2.57728C11.6189 2.22001 12.3813 2.22001 13.0001 2.57728L19.6604 6.42257C20.2792 6.77984 20.6604 7.44009 20.6604 8.15463V15.8452C20.6604 16.5598 20.2792 17.22 19.6604 17.5773L13.0001 21.4226C12.3813 21.7798 11.6189 21.7798 11.0001 21.4226L4.33984 17.5773C3.72104 17.22 3.33984 16.5598 3.33984 15.8452V8.15463C3.33984 7.44009 3.72104 6.77984 4.33984 6.42257Z"
                    stroke={strokeColor}
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </G>
              </Svg>

              <Text
                style={[
                  {color: '#B1B1B1', fontSize: 14},
                  dynamicStyles.TextColor,
                ]}>
                Support
              </Text>
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
                      fontFamily: 'Campton Bold',
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
                AsyncStorage.removeItem('accesstoken');
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
    </SafeAreaView>
  );
};
export default More;
