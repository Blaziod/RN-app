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
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import Headers from '../../Components/Headers/Headers';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Svg, Path} from 'react-native-svg';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import {ApiLink} from '../../enums/apiLink';

const Earn2FB = () => {
  const navigation = useNavigation();
  const [GeneratedTasks, setGeneratedTasks] = useState([]);
  const [savedGeneratedTask, setSavedGeneratedTask] = useState([]);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [fetching, setFectching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString()); // Updates the time every second
    }, 1000);

    return () => clearInterval(timer); // Clear the interval on component unmount
  }, []);

  const [time, setTime] = useState(0); // Initialize time as 0

  useEffect(() => {
    const initializeTimer = async () => {
      try {
        const savedStartTime = await AsyncStorage.getItem('startTime');
        const savedDuration = await AsyncStorage.getItem('duration');

        if (savedStartTime && savedDuration) {
          const startTime = parseInt(savedStartTime, 10);
          const duration = parseInt(savedDuration, 10);
          const currentTime = Math.floor(Date.now() / 1000);
          const elapsedTime = currentTime - startTime;

          if (elapsedTime < duration) {
            setTime(duration - elapsedTime);
          } else {
            setTime(0);
          }
        } else {
          const duration = 60 * 60; // 60 minutes
          const startTime = Math.floor(Date.now() / 1000);
          await AsyncStorage.setItem('startTime', startTime.toString());
          await AsyncStorage.setItem('duration', duration.toString());
          setTime(duration);
        }
      } catch (error) {
        console.error('Error initializing timer:', error);
      }
    };

    initializeTimer();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval); // cleanup on component unmount
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

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

  const SavedGeneratedTask = () => {
    setFectching(true);
    AsyncStorage.getItem('GeneratedTasks')
      .then(data => {
        // eslint-disable-next-line no-shadow
        const savedGeneratedTask = JSON.parse(data);
        setSavedGeneratedTask(savedGeneratedTask);
        console.log('Generated Task Loading');
        console.log('SavedGeneratedTask:', savedGeneratedTask);
        setFectching(false);
      })
      .catch(error => {
        console.error('Error retrieving user token:', error);
        setFectching(false);
      });
  };
  useEffect(() => {
    SavedGeneratedTask();
  }, []);

  const fetchGeneratedTask = async () => {
    if (SavedGeneratedTask && userAccessToken) {
      const key = savedGeneratedTask?.Tasks?.generated_task?.key;
      console.log('Key:', key);
      if (userAccessToken) {
        try {
          const response = await fetch(
            `${ApiLink.ENDPOINT_1}/performed-tasks/${key}`,
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
            setGeneratedTasks(data);
            setFectching(false);
            console.log('GeneratedTasks:', data);
          } else {
            if (response.status === 401) {
              console.log(
                '401 Unauthorized: Access token is invalid or expired',
              );
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
            setFectching(false);
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('Error during Tasks fetch:', error);
          setFectching(false);
        }
      }
    }
  };

  useEffect(() => {
    if (savedGeneratedTask?.Tasks?.generated_task?.key && userAccessToken) {
      fetchGeneratedTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedGeneratedTask, userAccessToken]);

  const performTask = async () => {
    setIsLoading(true);
    if (!uploadedImage) {
      console.error('No image to upload');
      setIsLoading(false);
      return;
    }
    const id = GeneratedTasks?.performed_task?.task?.id;
    console.log('new ID', id);
    const formData = new FormData();
    formData.append('reward_money', 110);
    formData.append('task_id_key', id);
    formData.append('screenshot', {
      name: 'image.jpg', // You might need to handle the name dynamically
      type: 'image/jpeg', // Adjust the MIME type according to your image type
      uri: uploadedImage.uri,
    });

    try {
      const response = await fetch(`${ApiLink.ENDPOINT_1}/perform-task`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAccessToken.accessToken}`,
          'Content-Type': 'multipart/form-data', // This is crucial for file uploads
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
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
        navigation.navigate('Earn1FB');
        AsyncStorage.removeItem('startTime');
        AsyncStorage.removeItem('duration');
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
        setIsLoading(false);
        const errorData = await response.json();
        console.error('Error signing in:', errorData);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorData.message,
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
      setIsLoading(false);
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
    }
  };

  const openImagePicker = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri}; // Adjusted for the typical response structure
        setUploadedImage(source); // Assuming setUploadedImage is a state setter function
        console.log('Image picked:', source);
      }
    });
  };

  const copyToClipboard = text => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copied to Clipboard',
      text2: 'Text copied successfully!',
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
  };
  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.AppContainer}>
          <Headers />
          <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
            <TouchableOpacity
              style={{flexDirection: 'row', gap: 5}}
              onPress={() => navigation.navigate('Earn1FB')}>
              {/* <Left /> */}
              <Text style={{color: '#FFD0FE', paddingBottom: 20}}>Go Back</Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: '#2F2F2F',
                opacity: 0.9,
                height: 'auto',
              }}>
              <ImageBackground
                source={require('../../assets/fbi2.png')}
                style={{
                  height: 'auto',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontFamily: 'CamptonLight',
                    fontSize: 10,
                  }}>
                  {currentDateTime}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonMedium',
                    fontSize: 30,
                  }}>
                  Post an Advert on your FaceBook page
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    {/* <Wallet style={styles.wallet} /> */}
                    <Text
                      style={{
                        color: '#808080',
                        fontFamily: 'CamptonMedium',
                        fontSize: 12,
                      }}>
                      Earning:
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                      fontSize: 12,
                    }}>
                    ₦110 Per Advert Post
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View
              style={{
                backgroundColor: '#E5F0FF',
                height: 80,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 7,
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'CamptonBook',
                    fontSize: 12,
                    color: 'blue',
                  }}>
                  You must NOT DELETE THE ADVERT POST on the Facebook page after
                  you have post the advert on your account Your Trendit account
                  will be suspended once you Delete the advert on your Facebook
                  Page.
                </Text>

                <View style={{alignSelf: 'center'}}>{/* <Info /> */}</View>
              </View>
            </View>
            <View style={{paddingVertical: 10}}>
              <View
                style={{
                  height: 100,
                  backgroundColor: '#FFA2A2',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{paddingBottom: 5}} />
                <Text style={{fontFamily: 'Campton Bold', fontSize: 15}}>
                  {`${minutes.toString().padStart(2, '0')}:${seconds
                    .toString()
                    .padStart(2, '0')}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 20,
                backgroundColor: '#1E1E1E',
                borderRadius: 10,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonSemiBold',
                    fontSize: 22,
                    paddingTop: 20,
                  }}>
                  Task
                </Text>
                <View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonSemiBold',
                      fontSize: 12,
                      paddingBottom: 10,
                      paddingTop: 60,
                    }}>
                    Please follow the step-by-step instructions below to do your
                    task:
                  </Text>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 1:{' '}
                      <Text style={styles.StepText}>
                        Open the Task Link above on your Facebook Mobile App or
                        browser
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 2:{' '}
                      <Text style={styles.StepText}>
                        The link will direct you to a Facebook Page which you
                        are meant to like and follow.
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 3:{' '}
                      <Text style={styles.StepText}>
                        Click on the Like or Follow button on the Facebook Page
                        to start liking or following the page. You MUST NOT
                        Unfollow the account after you have followed the
                        account.
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 4:{' '}
                      <Text style={styles.StepText}>
                        Create a screenshot of the page that shows you have
                        liked or followed the page and upload the screenshot
                        under the Proof of Work Form below. You are also
                        required to enter your Facebook Username or Name which
                        you used to perform the task
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{paddingVertical: 10}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'grey',
                    opacity: 0.5,
                    height: 'auto',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    padding: 10,
                  }}>
                  {fetching ? (
                    <ActivityIndicator size="small" color="fff" />
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'CamptonBook',
                        fontSize: 13,
                      }}>
                      {GeneratedTasks?.performed_task?.task?.caption}
                    </Text>
                  )}
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <TouchableOpacity
                      onPress={() =>
                        copyToClipboard(
                          GeneratedTasks?.performed_task?.task?.caption,
                        )
                      }>
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none">
                        <Path
                          d="M14 5.33333C14 5.60948 14.2239 5.83333 14.5 5.83333C14.7761 5.83333 15 5.60948 15 5.33333H14ZM11.1667 1.5C10.8905 1.5 10.6667 1.72386 10.6667 2C10.6667 2.27614 10.8905 2.5 11.1667 2.5V1.5ZM8.14645 7.64645C7.95118 7.84171 7.95118 8.15829 8.14645 8.35355C8.34171 8.54882 8.65829 8.54882 8.85355 8.35355L8.14645 7.64645ZM14.4637 2.182L14.0182 2.40899L14.0182 2.409L14.4637 2.182ZM14.318 2.03633L14.091 2.48183V2.48184L14.318 2.03633ZM8.5 3.83333C8.77614 3.83333 9 3.60948 9 3.33333C9 3.05719 8.77614 2.83333 8.5 2.83333V3.83333ZM13.6667 8C13.6667 7.72386 13.4428 7.5 13.1667 7.5C12.8905 7.5 12.6667 7.72386 12.6667 8H13.6667ZM3.95603 13.7094L4.18302 13.2638L3.95603 13.7094ZM2.79065 12.544L2.34515 12.771L2.79065 12.544ZM11.7106 13.7094L11.4836 13.2638L11.7106 13.7094ZM12.876 12.544L12.4305 12.317L12.876 12.544ZM2.79065 4.78936L2.34515 4.56236H2.34515L2.79065 4.78936ZM3.95603 3.62398L3.72903 3.17848L3.72903 3.17848L3.95603 3.62398ZM15 5.33333V2.53333H14V5.33333H15ZM13.9667 1.5H11.1667V2.5H13.9667V1.5ZM14.0488 1.74408L8.14645 7.64645L8.85355 8.35355L14.7559 2.45118L14.0488 1.74408ZM15 2.53333C15 2.44824 15.0004 2.35435 14.9938 2.27368C14.9867 2.18718 14.9692 2.07289 14.9092 1.95501L14.0182 2.409C13.9944 2.36242 13.9951 2.33045 13.9971 2.35512C13.9981 2.36715 13.999 2.38617 13.9995 2.41757C14 2.44895 14 2.48552 14 2.53333H15ZM13.9667 2.5C14.0145 2.5 14.0511 2.50001 14.0824 2.50051C14.1138 2.501 14.1329 2.5019 14.1449 2.50288C14.1695 2.5049 14.1376 2.50557 14.091 2.48183L14.545 1.59083C14.4271 1.53076 14.3128 1.51327 14.2263 1.5062C14.1456 1.49961 14.0518 1.5 13.9667 1.5V2.5ZM14.9092 1.95501C14.8692 1.87661 14.8174 1.80553 14.7559 1.74408L14.0488 2.45118C14.0365 2.4389 14.0262 2.42468 14.0182 2.40899L14.9092 1.95501ZM14.7559 1.74408C14.6945 1.68263 14.6234 1.63077 14.545 1.59083L14.091 2.48184C14.0753 2.47385 14.0611 2.46347 14.0488 2.45118L14.7559 1.74408ZM8.9 13.5H6.76667V14.5H8.9V13.5ZM3 9.73333V7.6H2V9.73333H3ZM6.76667 3.83333H8.5V2.83333H6.76667V3.83333ZM12.6667 8V9.73333H13.6667V8H12.6667ZM6.76667 13.5C6.01168 13.5 5.47551 13.4996 5.05592 13.4653C4.64217 13.4315 4.386 13.3673 4.18302 13.2638L3.72903 14.1549C4.09648 14.3421 4.4989 14.4232 4.97449 14.462C5.44425 14.5004 6.02818 14.5 6.76667 14.5V13.5ZM2 9.73333C2 10.4718 1.99961 11.0558 2.03799 11.5255C2.07685 12.0011 2.15792 12.4035 2.34515 12.771L3.23615 12.317C3.13273 12.114 3.06848 11.8578 3.03467 11.4441C3.00039 11.0245 3 10.4883 3 9.73333H2ZM4.18302 13.2638C3.77534 13.0561 3.44388 12.7247 3.23615 12.317L2.34515 12.771C2.64875 13.3668 3.13318 13.8513 3.72903 14.1549L4.18302 13.2638ZM8.9 14.5C9.63849 14.5 10.2224 14.5004 10.6922 14.462C11.1678 14.4232 11.5702 14.3421 11.9376 14.1549L11.4836 13.2638C11.2807 13.3673 11.0245 13.4315 10.6107 13.4653C10.1912 13.4996 9.65499 13.5 8.9 13.5V14.5ZM12.6667 9.73333C12.6667 10.4883 12.6663 11.0245 12.632 11.4441C12.5982 11.8578 12.5339 12.114 12.4305 12.317L13.3215 12.771C13.5087 12.4035 13.5898 12.0011 13.6287 11.5255C13.6671 11.0558 13.6667 10.4718 13.6667 9.73333H12.6667ZM11.9376 14.1549C12.5335 13.8513 13.0179 13.3668 13.3215 12.771L12.4305 12.317C12.2228 12.7247 11.8913 13.0561 11.4836 13.2638L11.9376 14.1549ZM3 7.6C3 6.84501 3.00039 6.30884 3.03467 5.88925C3.06848 5.4755 3.13273 5.21934 3.23615 5.01635L2.34515 4.56236C2.15792 4.92981 2.07685 5.33223 2.03799 5.80782C1.99961 6.27758 2 6.86151 2 7.6H3ZM6.76667 2.83333C6.02818 2.83333 5.44425 2.83294 4.97449 2.87133C4.4989 2.91018 4.09648 2.99125 3.72903 3.17848L4.18302 4.06949C4.386 3.96606 4.64217 3.90181 5.05592 3.868C5.47551 3.83372 6.01168 3.83333 6.76667 3.83333V2.83333ZM3.23615 5.01635C3.44388 4.60867 3.77534 4.27721 4.18302 4.06949L3.72903 3.17848C3.13318 3.48208 2.64875 3.96652 2.34515 4.56236L3.23615 5.01635Z"
                          fill="#FF6DFB"
                        />
                      </Svg>
                      <Text
                        style={{
                          color: '#FF6DFB',
                          fontFamily: 'CamptonBook',
                          fontSize: 13,
                        }}>
                        Copy text
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <Exp /> */}
                </TouchableOpacity>
              </View>
              <View style={styles.Box2}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 7,
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    alignItems: 'center',
                  }}>
                  <Text style={styles.Box2Text}>
                    You must NOT DELETE THE ADVERT POST on the Facebook page
                    after you have post the advert on your account Your Trendit³
                    account will be suspended once you Delete the advert on your
                    Facebook Page.{' '}
                  </Text>
                  <View style={{alignSelf: 'center'}}>{/* <Warning /> */}</View>
                </View>
              </View>
            </View>
            <View style={{paddingVertical: 20}}>
              <View
                style={{
                  backgroundColor: '#1e1e1e',
                  justifyContent: 'center',
                  // alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 20,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonMedium',
                    fontSize: 24,
                    alignSelf: 'center',
                  }}>
                  Upload proof
                </Text>
                <View style={{paddingVertical: 20, alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#262626',
                      height: 155,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 250,
                    }}
                    onPress={openImagePicker}>
                    {uploadedImage ? (
                      <Image
                        source={uploadedImage}
                        style={{width: '100%', height: '100%'}}
                      />
                    ) : (
                      <Text style={{color: 'white'}}>Upload an Image</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{color: '#fff', fontFamily: 'CamptonSemiBold'}}>
                  Please enter the name on your Facebook account that performed
                  this task
                </Text>
                <View style={{paddingVertical: 10}}>
                  <TextInput
                    style={{
                      backgroundColor: 'grey',
                      opacity: 0.5,
                      height: 40,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'CamptonBook',
                        fontSize: 13,
                      }}>
                      Blaziod
                    </Text>
                  </TextInput>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                    // paddingHorizontal: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 10,
                      backgroundColor: '#FF6DFB1A',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 6,
                    }}
                    onPress={openImagePicker}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonBook',
                        fontSize: 12,
                      }}>
                      Upload Proof
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{paddingVertical: 20, alignItems: 'center'}}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: '#ADFFB0',
                    height: 50,
                    width: 290,
                  }}
                  onPress={() => performTask()}>
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'CamptonMedium',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#000',
                      }}>
                      Mark as Done
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: '#121212',
  },

  Box2: {
    backgroundColor: '#FFE9E9',
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  Box2Text: {
    color: 'red',
    fontFamily: 'CamptonBook',
    fontSize: 12,
  },

  Step: {
    color: '#fff',
    fontFamily: 'CamptonSemiBold',
    fontSize: 12,
  },
  StepText: {
    color: '#fff',
    fontFamily: 'CamptonBook',
    fontSize: 12,
  },
  StepView: {
    paddingVertical: 7,
  },
});
export default Earn2FB;
