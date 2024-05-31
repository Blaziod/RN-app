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
import Earn1XMenu from '../../Components/Menus/earn1XMenu';
import Earn1CustomSwitch from '../../Components/CustomSwitches/earn1CustomSwitch';
import {Svg, Path} from 'react-native-svg';
import Earn1Image from '../../assets/SVG/earn1Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import InReviewTwitterMenu from '../../Components/Menus/inReviewTwitterMenu';
import FailedEarnersTask from '../../Components/Menus/failedEarnTask';
import {ApiLink} from '../../enums/apiLink';

const Earn1X = ({navigation}) => {
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
            type: 'twitter',
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
          text2: 'Your X account has been submitted for review',
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
            fontFamily: 'Campton Bold',
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
            fontFamily: 'Campton Bold',
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
          fontFamily: 'Campton Bold',
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
          `${ApiLink.ENDPOINT_1}/tasks/advert/Twitter`,
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
                      fontFamily: 'CamptonBook',
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
                          fontFamily: 'CamptonBook',
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
                height: 240,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
              <View style={{position: 'absolute', top: 0}}>
                <Earn1Image />
              </View>
              <View style={{paddingTop: 30}}>
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

              <View
                style={{
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    fontFamily: 'Campton Bold',
                    textAlign: 'center',
                    paddingBottom: 5,
                    color: '#000',
                  }}>
                  Post advert on Twitter
                </Text>
                <Text
                  style={{
                    fontFamily: 'CamptonMedium',
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#000',
                    paddingBottom: 10,
                  }}>
                  Post adverts of various Individuals businesses and top brands
                  on your Twitter page and earn ₦110 per posted advert. The more
                  you post, the more you earn. Please note that your Twitter
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
                    {availableTasks?.total} Tasks Available
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View>
                {userSocials?.x_verified && (
                  <View>
                    <View style={styles.ProfileSetUp}>
                      <View style={styles.ProfileTexting}>
                        <Text style={styles.SetUpText}>
                          Your Twitter Profile Account
                        </Text>
                        <Text style={styles.SetUpSubText}>
                          Your Twitter task must be done from the above Twitter
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
                        <Earn1XMenu />
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
                {!userSocials?.x_verified && (
                  <View style={styles.ProfileSetUp}>
                    <View style={styles.ProfileTexting}>
                      <Text style={styles.SetUpText}>
                        Link Your Twitter Account
                      </Text>
                      <Text style={styles.SetUpSubText}>
                        You need to link your Twitter Account to Trendit before
                        you can start earning with your Twitter Account. Click
                        the button below to link your Twitter account now.
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
                          Link Twitter account
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
    fontFamily: 'Campton Bold',
    fontSize: 17,
    paddingBottom: 10,
  },
  SetUpSubText: {
    color: '#fff',
    fontFamily: 'CamptonBook',
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
    fontFamily: 'Campton Bold',
  },
  GotoText3: {
    color: '#4CAF50',
    fontFamily: 'Campton Bold',
    fontSize: 10,
  },
  GotoText2: {
    color: '#000',
    fontFamily: 'Campton Bold',
    fontSize: 10,
  },
});
export default Earn1X;
