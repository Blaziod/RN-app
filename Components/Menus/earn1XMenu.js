/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Path, G, Svg} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Earn1XMenu = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetching, setFectching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  const [pendingTasks, setPendingTasks] = useState([]);
  const [userAccessToken, setUserAccessToken] = useState(null);

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

  const fetchPendingTasks = async () => {
    setFectching(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          'https://api.trendit3.com/api/performed-tasks?status=pending',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAccessToken.accessToken}`,
            },
          },
        );
        const data = await response.json();

        if (response.ok && data.performed_tasks.length > 0) {
          setPendingTasks(data.performed_tasks);
          console.log('Successful Tasks fetch:', data);
          setFectching(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: data.message,
            style: {
              borderLeftColor: 'pink',
              backgroundColor: 'yellow',
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            text1Style: {
              color: 'red',
              fontSize: 12,
            },
            text2Style: {
              color: 'green',
              fontSize: 12,
              fontFamily: 'Campton Bold',
            },
          });
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
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: response.data.message,
              style: {
                borderLeftColor: 'pink',
                backgroundColor: 'yellow',
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              },
              text1Style: {
                color: 'red',
                fontSize: 12,
              },
              text2Style: {
                color: 'green',
                fontSize: 12,
                fontFamily: 'Campton Bold',
              },
            });
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignIn',
                },
              ],
            });
          }
          setFectching(false);
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error during Tasks fetch:', error);
        setFectching(false);
        Toast.show({
          type: 'success',

          text2: error.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 12,
          },
          text2Style: {
            color: 'green',
            fontSize: 12,
            fontFamily: 'Campton Bold',
          },
        });
      }
    }
  };

  useEffect(() => {
    fetchPendingTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  const GenerateTasks = async () => {
    setGenerating(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          'https://api.trendit3.com/api/generate-task',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAccessToken.accessToken}`, // Add the access token to the headers
            },
            body: JSON.stringify({
              task_type: 'advert',
              platform: 'twitter',
            }),
          },
        );

        const data = await response.json();

        if (response.ok && response.status === 200) {
          setGenerating(false);
          console.log('Successful Generating Tasks', data);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: data.message,
            style: {
              borderLeftColor: 'pink',
              backgroundColor: 'yellow',
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            text1Style: {
              color: 'red',
              fontSize: 12,
            },
            text2Style: {
              color: 'green',
              fontSize: 12,
              fontFamily: 'Campton Bold',
            },
          });
          AsyncStorage.setItem(
            'GeneratedTasks',
            JSON.stringify({
              Tasks: data,
            }),
          )
            .then(() => {
              navigation.navigate('Earn2FB');
            })
            .catch(error => {
              console.error('Error storing Generated Tasks:', error);
            });
        } else {
          if (response.status === 401) {
            setGenerating(false);
            console.log('401 Unauthorized: Access token is invalid or expired');
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: response.data.message,
              style: {
                borderLeftColor: 'pink',
                backgroundColor: 'yellow',
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              },
              text1Style: {
                color: 'red',
                fontSize: 12,
              },
              text2Style: {
                color: 'green',
                fontSize: 12,
                fontFamily: 'Campton Bold',
              },
            });
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
          setGenerating(false);
          throw new Error(data.message);
        }
      } catch (error) {
        setGenerating(false);
        Toast.show({
          type: 'error',
          text2: error.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 12,
          },
          text2Style: {
            color: 'green',
            fontSize: 12,
            fontFamily: 'Campton Bold',
          },
        });
        console.error('Error during Tasks Generation:', error);
      }
    } else {
      console.log('No access token found');
    }
  };

  return (
    <>
      {fetching ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View>
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: '100%',
                  borderRadius: 10,
                  backgroundColor: 'rgba(47, 47, 47, 0.42)',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  padding: 10,
                  marginBottom: 10, // Add space between items
                }}
                onPress={() => navigation.navigate('Earn2X')}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    fill="none">
                    <Path
                      d="M37.5145 3.14795H44.7211L28.9761 21.145L47.5 45.6301H32.9966L21.6383 30.7781L8.63883 45.6301H1.42825L18.2699 26.3797L0.5 3.14991H15.3716L25.6391 16.7251L37.5145 3.14795ZM34.9863 41.3178H38.9793L13.2018 7.23499H8.91692L34.9863 41.3178Z"
                      fill="black"
                    />
                  </Svg>
                  <View
                    style={{
                      backgroundColor: '#323232',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 4,
                      width: '30%',
                      borderRadius: 4,
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <Text
                      style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>
                      Pending
                    </Text>
                  </View>
                </View>

                <Text style={{fontSize: 12, color: '#fff'}}>
                  {task.caption}
                </Text>
                <Text style={{fontSize: 10, color: '#fff'}}>{task.key}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                      fontSize: 12,
                    }}>
                    ₦110 per task
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 70,
              }}>
              <Svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <G id="Software/apps add">
                  <Path
                    id="Icon"
                    d="M17.5 14.8901V18.3901M17.5 18.3901V21.8901M17.5 18.3901H21M17.5 18.3901H14M5 10.8901H8C9.10457 10.8901 10 9.99471 10 8.89014V5.89014C10 4.78557 9.10457 3.89014 8 3.89014H5C3.89543 3.89014 3 4.78557 3 5.89014V8.89014C3 9.99471 3.89543 10.8901 5 10.8901ZM5 21.8901H8C9.10457 21.8901 10 20.9947 10 19.8901V16.8901C10 15.7856 9.10457 14.8901 8 14.8901H5C3.89543 14.8901 3 15.7856 3 16.8901V19.8901C3 20.9947 3.89543 21.8901 5 21.8901ZM16 10.8901H19C20.1046 10.8901 21 9.99471 21 8.89014V5.89014C21 4.78557 20.1046 3.89014 19 3.89014H16C14.8954 3.89014 14 4.78557 14 5.89014V8.89014C14 9.99471 14.8954 10.8901 16 10.8901Z"
                    stroke="#FFD0FE"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </G>
              </Svg>

              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Campton Bold',
                  paddingTop: 15,
                }}>
                Need quick cash to earn?
              </Text>
              <Text
                style={{
                  color: '#B1B1B1',
                  fontFamily: 'CamptonBook',
                  paddingTop: 7,
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                Earn steady income by posting adverts of insividuals, businesses
                and top brands on your social media page. To post adverts on
                Facebook, Instagram, Twitter or Tiktok, you MUST have at
                least 500 Followers on your social media account.
              </Text>

              <View style={{paddingTop: 15}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#fff',
                    height: 50,
                    width: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    flexDirection: 'row',
                  }}
                  onPress={() => setIsModalVisible(true)}>
                  <Text
                    style={{
                      color: '#000000',
                      fontFamily: 'CamptonMedium',
                      fontSize: 13,
                    }}>
                    Generate Task
                  </Text>
                </TouchableOpacity>

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
                      justifyContent: 'flex-end',
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
                              alignSelf: 'center',
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
                                alignSelf: 'center',
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
                              paddingVertical: 30,
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 14,
                                fontFamily: 'Campton Bold',
                                paddingBottom: 10,
                                paddingTop: 20,
                              }}>
                              Generate Next Twitter Advert Task?
                            </Text>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 400,
                                fontFamily: 'CamptonBook',
                                textAlign: 'center',
                                paddingHorizontal: 20,
                              }}>
                              Are you sure you want to generate your next
                              Twitter Advert task now. You have 1 hour to
                              perform this task. Please confirm only if you are
                              ready to perform the task.
                            </Text>
                          </View>
                          <View
                            style={{paddingHorizontal: 10, paddingBottom: 30}}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: '#CB29BE',
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                borderRadius: 110,
                              }}
                              onPress={() => GenerateTasks()}>
                              {generating ? (
                                <ActivityIndicator size="small" color="#fff" />
                              ) : (
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontFamily: 'CamptonBook',
                                    fontSize: 14,
                                  }}>
                                  Confirm
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </SafeAreaView>
                    </>
                  </View>
                </Modal>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default Earn1XMenu;
