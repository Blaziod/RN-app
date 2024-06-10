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
  ActivityIndicator,
} from 'react-native';
import Headers from '../../Components/Headers/Headers';
import Earn1WAMenu from '../../Components/Menus/earn1WAMenu';
import Earn1CustomSwitch from '../../Components/CustomSwitches/earn1CustomSwitch';
import {Path, Svg, Stop, Defs, LinearGradient} from 'react-native-svg';
import Earn1Image from '../../assets/SVG/earn1Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InReviewTwitterMenu from '../../Components/Menus/inReviewTwitterMenu';
import FailedEarnersTask from '../../Components/Menus/failedEarnTask';
import {ApiLink} from '../../enums/apiLink';

const Earn1WA = ({navigation}) => {
  const [earnMenu, setEarnMenu] = useState(1);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchAvailableTasks = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          `${ApiLink.ENDPOINT_1}/tasks/advert/Whatsapp`,
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
          setIsLoading(false);
          console.log('Tasks:', data);
        } else {
          if (response.status === 401) {
            setIsLoading(false);
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
        setIsLoading(false);
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
                  fill="green"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M1.00869 23.8086C1.00759 27.7575 2.0472 31.6133 4.02401 35.0119L0.819641 46.6238L12.7928 43.508C16.1044 45.2973 19.8148 46.2348 23.5854 46.2351H23.5953C36.0425 46.2351 46.1749 36.1823 46.1802 23.8263C46.1826 17.8389 43.8354 12.2087 39.5709 7.97286C35.3071 3.7374 29.6364 1.40361 23.5944 1.40088C11.1456 1.40088 1.01402 11.453 1.00888 23.8086"
                    fill="green"
                  />
                  <Path
                    d="M0.202377 23.8013C0.201092 27.8923 1.27796 31.886 3.32525 35.4063L0.00598145 47.4345L12.4084 44.2069C15.8257 46.0561 19.6732 47.0311 23.5883 47.0326H23.5984C36.4922 47.0326 46.9885 36.6183 46.994 23.8199C46.9963 17.6173 44.5646 11.7848 40.1477 7.39719C35.7303 3.01016 29.8568 0.592394 23.5984 0.589844C10.7024 0.589844 0.207516 11.0027 0.202377 23.8013ZM7.5885 34.8L7.12541 34.0704C5.17871 30.9983 4.15121 27.4482 4.15268 23.8027C4.15672 13.1649 12.8796 4.51015 23.6057 4.51015C28.8001 4.51234 33.6817 6.52205 37.3534 10.1684C41.0249 13.8151 43.0452 18.6626 43.0439 23.8184C43.0392 34.4563 34.3161 43.1121 23.5984 43.1121H23.5907C20.1009 43.1103 16.6783 42.1801 13.6935 40.4223L12.9831 40.0043L5.62326 41.9194L7.5885 34.8Z"
                    fill="green"
                  />
                  <Path
                    d="M17.7509 14.0975C17.313 13.1315 16.8521 13.112 16.4356 13.095C16.0946 13.0805 15.7047 13.0816 15.3153 13.0816C14.9254 13.0816 14.292 13.2271 13.7566 13.8073C13.2206 14.3881 11.7104 15.7915 11.7104 18.646C11.7104 21.5006 13.8052 24.2592 14.0972 24.6467C14.3896 25.0334 18.1413 31.0786 24.0831 33.4041C29.0213 35.3368 30.0262 34.9524 31.0979 34.8555C32.1698 34.7589 34.5567 33.4524 35.0436 32.0976C35.531 30.743 35.531 29.5818 35.3849 29.3392C35.2387 29.0974 34.8489 28.9523 34.2643 28.6622C33.6795 28.372 30.8055 26.9684 30.2698 26.7748C29.7338 26.5813 29.3441 26.4848 28.9543 27.0657C28.5644 27.6457 27.445 28.9523 27.1038 29.3392C26.7629 29.727 26.4217 29.7753 25.8373 29.4851C25.2523 29.194 23.3697 28.5821 21.1361 26.6057C19.3983 25.0678 18.225 23.1687 17.884 22.5878C17.543 22.0077 17.8475 21.6933 18.1406 21.4042C18.4033 21.1442 18.7254 20.7267 19.018 20.3881C19.3094 20.0492 19.4067 19.8075 19.6016 19.4205C19.7967 19.0333 19.6991 18.6944 19.5532 18.4042C19.4067 18.114 18.2707 15.2447 17.7509 14.0975Z"
                    fill="white"
                  />
                  <Defs>
                    <LinearGradient
                      id="paint0_linear_3189_16665"
                      x1="2268.85"
                      y1="4523.69"
                      x2="2268.85"
                      y2="1.40088"
                      gradientUnits="userSpaceOnUse">
                      <Stop stop-color="#1FAF38" />
                      <Stop offset="1" stop-color="#60D669" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint1_linear_3189_16665"
                      x1="2349.41"
                      y1="4685.05"
                      x2="2349.41"
                      y2="0.589844"
                      gradientUnits="userSpaceOnUse">
                      <Stop stop-color="#F9F9F9" />
                      <Stop offset="1" stop-color="white" />
                    </LinearGradient>
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
                  Post advert on whatsapp
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
                  on your whatsapp page and earn ₦60 per posted advert. The more
                  you post, the more you earn.
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
                <View>
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
                      <Earn1WAMenu />
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
export default Earn1WA;
