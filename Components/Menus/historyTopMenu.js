/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Svg, Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../Contexts/colorTheme';
import {ApiLink} from '../../enums/apiLink';

const HistoryTopMenu = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAdverts, setTotalAdverts] = useState(0);

  const {theme} = useTheme();
  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark'
          ? 'rgba(255, 255, 255, 0.03)'
          : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
    },
    TextColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamic text color
    },
    Button: {
      backgroundColor: theme === 'dark' ? '#000' : '#FFF', // Dynamic background color
    },
    Btext: {
      color: theme === 'dark' ? '#FF6DFB' : '#FFF', // Dynamic text color
    },
  });

  // Inside your component
  const fetchUserData = () => {
    AsyncStorage.getItem('userdatafiles1')
      .then(data => {
        const userData = JSON.parse(data);
        setUserData(userData);
        console.log('Here I am', userData);

        if (!userData) {
          return <ActivityIndicator />;
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserAccessToken = () => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);

        if (!userAccessToken) {
          navigation.navigate('SignIn');
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

  const userAdverts = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await fetch(`${ApiLink.ENDPOINT_1}/user/tasks/total`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`, // Add the access token to the headers
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Adverts Here!!!:', data);
          setTotalAdverts(data.total);
          AsyncStorage.setItem(
            'adverts',
            JSON.stringify({
              status: data,
            }),
          )
            .then(() => {
              console.log('Adverts Stored', data);
            })
            .catch(error => {
              console.error('Error storing user Status:', error);
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
        console.error('Error during membership fetch:', error);
      }
    } else {
      console.log('No access token found');
    }
  };

  useEffect(() => {
    if (userAccessToken) {
      userAdverts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  return (
    <ScrollView>
      <View>
        <View
          style={[styles.walletBalanceContainer, dynamicStyles.DivContainer]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignSelf: 'stretch',
              paddingBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none">
                <Path
                  d="M2 6.66634H14M5.33333 3.99967V1.33301M10.6667 3.99967V1.33301M6.26667 14.6663H9.73333C11.2268 14.6663 11.9735 14.6663 12.544 14.3757C13.0457 14.12 13.4537 13.7121 13.7094 13.2103C14 12.6399 14 11.8931 14 10.3997V6.93301C14 5.43953 14 4.6928 13.7094 4.12237C13.4537 3.6206 13.0457 3.21265 12.544 2.95699C11.9735 2.66634 11.2268 2.66634 9.73333 2.66634H6.26667C4.77319 2.66634 4.02646 2.66634 3.45603 2.95699C2.95426 3.21265 2.54631 3.6206 2.29065 4.12237C2 4.6928 2 5.43953 2 6.93301V10.3997C2 11.8931 2 12.6399 2.29065 13.2103C2.54631 13.7121 2.95426 14.12 3.45603 14.3757C4.02646 14.6663 4.77319 14.6663 6.26667 14.6663Z"
                  stroke="#B1B1B1"
                  stroke-linecap="round"
                />
              </Svg>
              <Text
                style={[
                  {
                    color: '#b1b1b1',
                    fontSize: 14,
                    fontFamily: 'Manrope-Regular',
                  },
                  dynamicStyles.TextColor,
                ]}>
                Jan 1 - Jan 27, 2023
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  {
                    color: '#b1b1b1',
                    fontSize: 14,
                    fontFamily: 'Manrope-Regular',
                  },
                  dynamicStyles.TextColor,
                ]}>
                Period:
              </Text>
              <Text
                style={[
                  {
                    color: '#b1b1b1',
                    fontSize: 14,
                    fontFamily: 'Manrope-Regular',
                  },
                  dynamicStyles.TextColor,
                ]}>
                All time
              </Text>
            </View>
          </View>
          <Text style={styles.WalletAmount}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#FF6DFB" />
            ) : (
              <Text>{totalAdverts} Orders</Text>
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
    width: '100%',
  },

  walletBalanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    paddingVertical: 20,
    borderRadius: 4,
    width: '91%',
    alignSelf: 'center',
  },
  WalletButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 20,
    display: 'flex',
  },
  fundButton: {
    // width: 'auto',
    backgroundColor: '#FFFFFF',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 10,
    padding: 7,
  },
  withdrawButton: {
    width: 109,
    backgroundColor: '#ffffff',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 10,
  },
  fundText: {
    fontSize: 12.8,
    color: '#000',
    fontFamily: 'Manrope-ExtraBold',
  },
  withdrawText: {
    fontSize: 12.8,
    fontFamily: 'Manrope-ExtraBold',
    color: '#000',
  },
  WalletAmount: {
    fontFamily: 'Manrope-Regular',
    fontSize: 40,
    color: '#FF6DFB',
  },
  fundIcon: {
    height: 15,
    width: 15,
    tintColor: '#000000',
  },
  TwoContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
});

export default HistoryTopMenu;
