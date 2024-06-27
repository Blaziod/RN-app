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
import Earn1LSMenu from '../../Components/Menus/earn1LSMenu';
import Earn1CustomSwitch from '../../Components/CustomSwitches/earn1CustomSwitch';
import {Path, Svg, Stop, Defs, RadialGradient, G} from 'react-native-svg';
import Earn1Image from '../../assets/SVG/earn1Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InReviewTwitterMenu from '../../Components/Menus/inReviewTwitterMenu';
import FailedEarnersTask from '../../Components/Menus/failedEarnTask';
import {ApiLink} from '../../enums/apiLink';
import {useTheme} from '../../Components/Contexts/colorTheme';

const Earn1LS = ({navigation}) => {
  const [earnMenu, setEarnMenu] = useState(1);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTasks, setAvailableTasks] = useState(null);
  const {theme} = useTheme();

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
          `${ApiLink.ENDPOINT_1}/tasks/engagement/counts/goal`,
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
          setAvailableTasks(data.goals.Like);
          setIsLoading(false);
          console.log('Tasks:', data.goals.Like);
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

  const strokeColor = theme === 'dark' ? '#b1b1b1' : '#000';
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
              <View
                style={{
                  paddingTop: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Svg
                  width="47"
                  height="48"
                  viewBox="0 0 47 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <G id="like">
                    <Path
                      id="Vector"
                      d="M40.6614 25.0858C41.4325 24.0669 41.8594 22.8184 41.8594 21.5195C41.8594 19.4587 40.7073 17.508 38.853 16.4202C38.3757 16.1402 37.8321 15.9928 37.2787 15.9933H26.2723L26.5477 10.3524C26.6119 8.98924 26.13 7.69491 25.1937 6.70809C24.7341 6.2217 24.1798 5.8347 23.5648 5.57103C22.9498 5.30735 22.2873 5.17259 21.6182 5.17508C19.2314 5.17508 17.1201 6.78153 16.4867 9.08104L12.544 23.3555H12.5303V43H34.2081C34.6304 43 35.0435 42.9174 35.4244 42.7521C37.6092 41.8204 39.0183 39.6861 39.0183 37.3178C39.0183 36.7394 38.9356 36.1703 38.7704 35.6195C39.5415 34.6006 39.9684 33.3521 39.9684 32.0532C39.9684 31.4749 39.8857 30.9057 39.7205 30.355C40.4916 29.336 40.9185 28.0876 40.9185 26.7887C40.9093 26.2103 40.8267 25.6366 40.6614 25.0858ZM5.14062 24.8242V41.5312C5.14062 42.3436 5.79697 43 6.60938 43H9.59277V23.3555H6.60938C5.79697 23.3555 5.14062 24.0118 5.14062 24.8242Z"
                      fill="#1877F2"
                    />
                  </G>
                </Svg>
                <View style={{flexDirection: 'row', gap: 5, paddingTop: 10}}>
                  <TouchableOpacity>
                    <Svg
                      width="18"
                      height="18"
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
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Svg width="17" height="18" viewBox="0 0 47 48" fill="none">
                      <Path
                        d="M47 24.0898C47 11.1112 36.4786 0.589844 23.5 0.589844C10.5214 0.589844 0 11.1112 0 24.0898C0 35.8193 8.59366 45.5415 19.8281 47.3044V30.8828H13.8613V24.0898H19.8281V18.9125C19.8281 13.0228 23.3366 9.76953 28.7045 9.76953C31.2756 9.76953 33.9648 10.2285 33.9648 10.2285V16.0117H31.0016C28.0823 16.0117 27.1719 17.8232 27.1719 19.6818V24.0898H33.6895L32.6476 30.8828H27.1719V47.3044C38.4063 45.5415 47 35.8195 47 24.0898Z"
                        fill="#1877F2"
                      />
                      <Path
                        d="M32.6476 30.8828L33.6895 24.0898H27.1719V19.6818C27.1719 17.8231 28.0823 16.0117 31.0016 16.0117H33.9648V10.2285C33.9648 10.2285 31.2756 9.76953 28.7043 9.76953C23.3366 9.76953 19.8281 13.0228 19.8281 18.9125V24.0898H13.8613V30.8828H19.8281V47.3044C21.0428 47.4947 22.2705 47.5902 23.5 47.5898C24.7295 47.5902 25.9572 47.4948 27.1719 47.3044V30.8828H32.6476Z"
                        fill="white"
                      />
                    </Svg>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Svg width="17" height="18" viewBox="0 0 47 48" fill="none">
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
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Svg
                      width="17"
                      height="18"
                      viewBox="0 0 47 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        d="M37.0145 2.25781H44.2211L28.4761 20.2549L47 44.7399H32.4966L21.1382 29.8879L8.13883 44.7399H0.92825L17.7699 25.4895L0 2.25977H14.8716L25.1391 15.8349L37.0145 2.25781ZM34.4863 40.4277H38.4793L12.7018 6.34485H8.41692L34.4863 40.4277Z"
                        fill={strokeColor}
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
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
                  Like Social Media Posts
                </Text>
                <Text
                  style={{
                    fontFamily: 'Manrope-Medium',
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#000',
                    paddingBottom: 10,
                  }}>
                  Like and follow people on different social media platform and
                  earn ₦3.5 per likes. the more you like post the more you earn
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
                      <Earn1LSMenu />
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
export default Earn1LS;
