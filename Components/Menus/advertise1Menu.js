/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
// import {AdvertiseModal1} from './Modals/AdvertiseModal1';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Svg, Path, G} from 'react-native-svg';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import {ApiLink} from '../../enums/apiLink';
import axios from 'axios';
import queryString from 'query-string';
import {useTheme} from '../../Components/Contexts/colorTheme';

import {
  AdvertiseModalPicker,
  AdvertiseModalPicker2,
  AdvertiseModalPicker3,
  AdvertiseModalPicker4,
  AdvertiseModalPicker5,
} from '../Modals/AdvertModalPicker';

const Advertise1Menu = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const [base64Videos, setBase64Videos] = useState([]);
  const [videos, setVideos] = useState(null);
  const [religion, setReligion] = useState('Select Religion');
  const [gender, setGender] = useState('Select Gender');
  const [choosePlatform, setChoosePlatform] = useState('Select Platform');
  const [chooseLocation, setChooseLocation] = useState('Select Location');
  const [chooseNumber, setChooseNumber] = useState('Enter The Number');
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);
  const [modal5Visible, setModal5Visible] = useState(false);
  const [taskType, setTaskType] = useState('');
  const [caption, setCaption] = useState('');
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [targetState, setTargetState] = useState('');
  const [userData, setUserData] = useState(null);
  const [userData1, setUserData1] = useState(null);
  const [image, setImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);
  const [isModal3Visible, setIsModal3Visible] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  const [userBalance, setUserBalance] = useState(null);
  const [txRef, setTxRef] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const homeScreenUrl = 'https://blaziod.github.io';
  const [isLoading1, setIsLoading1] = useState(false);
  const result =
    userBalance?.balance -
    (isNaN(Number(chooseNumber)) ? 0 : Number(chooseNumber) * 140);

  useEffect(() => {
    AsyncStorage.getItem('userbalance')
      .then(data => {
        const userBalance = JSON.parse(data);
        setUserBalance(userBalance);
        console.log('Balance', userBalance);
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
  }, []);

  const {theme} = useTheme();

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#2f2f2f6b' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
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
    ModalContainer: {
      backgroundColor: theme === 'dark' ? '#000' : '#FFF', // Dynamic background color
    },
    ModalDivContainer: {
      backgroundColor:
        theme === 'dark' ? '#1a1a1a' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
    },
  });
  useEffect(() => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        const userData = JSON.parse(data);
        setUserData(userData);
        // console.log("Here I am", userData);
        console.log('Here I am', userData.accessToken);
        // console.log(homeScreenUrl);

        if (!userData) {
          navigation.navigate('SignIn');
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Your code to run on screen focus
    AsyncStorage.getItem('userdatafiles1')
      .then(data => {
        const userData1 = JSON.parse(data);
        setUserData1(userData1);
        console.log('Here I am', userData1);
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      const storedImage = await AsyncStorage.getItem('profile_picture');
      if (storedImage) {
        setImage(storedImage);
      }
    };

    fetchImage();
  }, []);

  const changeModalVisibility = bool => {
    setModalVisible(bool);
  };
  const changeModal2Visibility = bool => {
    setModal2Visible(bool);
  };
  const changeModal3Visibility = bool => {
    setModal3Visible(bool);
  };
  const changeModal4Visibility = bool => {
    setModal4Visible(bool);
  };
  const changeModal5Visibility = bool => {
    setModal5Visible(bool);
  };

  const setData = option => {
    setChoosePlatform(option);
  };
  const setData2 = option2 => {
    setChooseLocation(option2);
  };
  const setData3 = option3 => {
    setChooseNumber(option3);
  };
  const setData4 = option4 => {
    setGender(option4);
  };
  const setData5 = option5 => {
    setReligion(option5);
  };

  // let image; // Declare image in the outer scope

  const [mediaType, setMediaType] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const chooseImage = () => {
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 4, // Allow up to 4 images to be selected
    };
    console.log('chooseImage called');
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log(response, 'Response');
        const images = response.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        }));
        const base64Strs = response.assets.map(
          asset => `data:${asset.type};base64,${asset.base64}`,
        );

        // Update state with the selected images and their base64 strings
        setSelectedImages(images);
        setImage(images);
        setBase64Images(base64Strs);
        createMediaTask('photo', images);
        setMediaType('photo');
        setMediaItems(images);
        console.log('Images selected:', images);

        // Store the base64 strings in AsyncStorage
        try {
          await AsyncStorage.setItem(
            'profile_pictures',
            JSON.stringify(base64Strs),
          );
          console.log('Images stored successfully');
        } catch (error) {
          console.error('Error storing images:', error);
        }
      }
    });
  };

  const chooseVideo = () => {
    let options = {
      mediaType: 'video',
      includeBase64: true,
      selectionLimit: 4, // Allow up to 4 videos to be selected
    };
    console.log('chooseVideo called');
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('VideoPicker Error: ', response.error);
      } else {
        console.log(response, 'Response');
        const videos = response.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        }));
        const base64Strs = response.assets.map(
          asset => `data:${asset.type};base64,${asset.base64}`,
        );

        // Update state with the selected videos and their base64 strings
        setSelectedVideos(videos);
        setVideos(videos);
        setBase64Videos(base64Strs);
        createMediaTask('video', videos);
        setMediaType('video');
        setMediaItems(videos);
        console.log('Videos selected:', videos);

        // Store the base64 strings in AsyncStorage
        try {
          await AsyncStorage.setItem(
            'profile_videos',
            JSON.stringify(base64Strs),
          );
          console.log('Videos stored successfully');
        } catch (error) {
          console.error('Error storing videos:', error);
        }
      }
    });
  };

  const createMediaTask = async (mediaType, mediaItems) => {
    if (!mediaItems || mediaItems.length === 0) {
      console.log(
        `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Required`,
        `Please choose a ${mediaType} before proceeding.`,
      );
      return;
    }

    console.log('Creating media task for:', mediaType);
    const base64Strs = mediaItems.map(
      item => `data:${item.type};base64,${item.base64}`,
    );

    // Update state with the selected media and their base64 strings
    if (mediaType === 'photo') {
      setSelectedImages(mediaItems);
      setImage(mediaItems);
      setBase64Images(base64Strs);
    } else if (mediaType === 'video') {
      setSelectedVideos(mediaItems);
      setVideos(mediaItems);
      setBase64Videos(base64Strs);
    }

    console.log(
      `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} selected:`,
      mediaItems,
    );

    // Store the base64 strings in AsyncStorage
    try {
      await AsyncStorage.setItem(
        `profile_${mediaType === 'photo' ? 'pictures' : 'videos'}`,
        JSON.stringify(base64Strs),
      );
      console.log(
        `${
          mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
        } stored successfully`,
      );
    } catch (error) {
      console.error(`Error storing ${mediaType}:`, error);
    }
  };

  const createTask = async (paymentMethod = 'trendit_wallet') => {
    if (!mediaItems || mediaItems.length === 0) {
      Alert.alert('Please choose a media before proceeding.');
      return;
    }

    setTaskType('advert');
    setAmount(chooseNumber * 140);
    const taskData = new FormData();
    taskData.append('platform', choosePlatform);
    taskData.append('target_country', chooseLocation);
    taskData.append('posts_count', chooseNumber);
    taskData.append('task_type', 'advert');
    taskData.append('caption', caption);
    taskData.append('gender', gender);
    // taskData.append('hashtags', hashtag);
    taskData.append('amount', chooseNumber * 140);
    taskData.append('target_state', 'Lagos');
    console.log('Task Data:', mediaItems?.[0]?.uri);

    if (Array.isArray(mediaItems)) {
      // If it's an array, append each media item as part of the form data
      mediaItems.forEach((item, index) => {
        taskData.append(`media[${index}]`, {
          uri: item.uri,
          type: item.type,
          name: item.fileName,
        });
      });
    } else {
      // If it's a single media item, append it directly
      taskData.append('media', {
        uri: mediaItems?.uri,
        type: mediaItems?.type,
        name: mediaItems?.fileName,
      });
    }

    const Token = userData?.accessToken;
    console.log('Testing', Token);

    try {
      setIsLoading1(true);
      const response = await fetch(
        `${ApiLink.ENDPOINT_1}/tasks/new?payment_method=${paymentMethod}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${Token}`,
          },
          body: taskData,
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'AccessToken expired',
            // Styling omitted for brevity
          });
          navigation.navigate('SignIn');
          setIsLoading1(false);
        } else {
          setIsLoading1(false);
          throw new Error('HTTP error ' + response.status);
        }
      }
      setIsLoading1(false);
      const data = await response.json();
      setIsModal2Visible(false);
      setIsModal3Visible(true);
      AsyncStorage.removeItem('profile_picture'); // Consider renaming or removing based on media type
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
      console.log(data);
    } catch (error) {
      setIsLoading1(false);
      console.error('Error:', error);
      console.error('Error message:', error.message);
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
    }
  };

  const createTaskPaystack = async (paymentMethod = 'payment_gateway') => {
    if (!mediaItems || mediaItems.length === 0) {
      Alert.alert('Please choose a media before proceeding.');
      return;
    }
    setTaskType('advert');
    setAmount(chooseNumber * 140);
    const taskData = new FormData();
    taskData.append('platform', choosePlatform);
    taskData.append('target_country', chooseLocation);
    taskData.append('posts_count', chooseNumber);
    taskData.append('task_type', 'advert');
    taskData.append('caption', caption);
    taskData.append('gender', gender);
    // taskData.append('hashtags', hashtag);
    taskData.append('amount', chooseNumber * 140);
    taskData.append('target_state', 'Lagos');
    console.log('Task Data:', image?.uri);
    if (Array.isArray(mediaItems)) {
      // If it's an array, append each media item as part of the form data
      mediaItems.forEach((item, index) => {
        taskData.append(`media[${index}]`, {
          uri: item.uri,
          type: item.type,
          name: item.fileName,
        });
      });
    } else {
      // If it's a single media item, append it directly
      taskData.append('media', {
        uri: mediaItems?.uri,
        type: mediaItems?.type,
        name: mediaItems?.fileName,
      });
    }

    // taskData.append('media_path', imageData);
    const Token = userData?.accessToken;
    console.log('Testing', Token);

    try {
      const response = await fetch(
        `${ApiLink.ENDPOINT_1}/tasks/new?payment_method=${paymentMethod}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${Token}`,
            'CALLBACK-URL': homeScreenUrl,
          },
          body: taskData,
        },
      );

      if (!response.ok) {
        throw new Error('HTTP error ' + response);
      }

      const data = await response.json();
      const url = data.authorization_url;
      console.log('URL:', url); // replace with the actual URL you want to redirect to
      Linking.openURL(url);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
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
      if (error) {
        console.error('Response data:', error);
        console.error('Response status:', error);
      }
    }
  };
  useEffect(() => {
    const handleUrl = async event => {
      try {
        const url = event.url;
        // Alert.alert('Url Caught');
        const parsed = queryString.parseUrl(url);
        // Alert.alert('Url parsed');

        if (parsed.query.tx_ref) {
          const {tx_ref, transaction_id, status} = parsed.query;
          // Alert.alert('tx_ref found');

          if (status === 'completed') {
            setTxRef(tx_ref);
            setTransactionId(transaction_id);
            Alert.alert('Verifying your payment');
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error: handling', error.toString());
      }
    };

    // Listen for incoming links
    const subscription = Linking.addEventListener('url', handleUrl);

    // Clean up the listener on unmount
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (transactionId !== null) {
      verifyPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const verifyPayment = async () => {
    try {
      // Alert.alert('URL: ', `${txRef}, ${transactionId}`);
      setIsLoading1(true);
      const Token = userData?.accessToken;
      const response = await axios.post(
        `${ApiLink.ENDPOINT_1}/payment/verify`,
        {reference: txRef, transaction_id: transactionId},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        Alert.alert('Payment Verified');
        setIsModal2Visible(false);
        setIsModal3Visible(true);
        console.log(response.data);
        Toast.show({
          type: 'success',
          text1: 'Success',
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
      } else {
        Alert.alert('Error Else');
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
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
            },
          ],
        });
      }
    } catch (error) {
      Alert.alert('Error', error.toString());
      console.error(error);
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
      setIsLoading1(false);
    }
  };

  return (
    <View>
      <View
        style={{
          //   paddingVertical: 10,
          paddingHorizontal: 30,
          flexDirection: 'column',
          gap: 10,
        }}>
        <Text
          style={{color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13}}>
          Select Platform
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#2f2f2f6b',
            height: 50,
            width: '100%',
            borderRadius: 4,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
          onPress={() => changeModalVisibility(true)}>
          <Text style={styles.text}>{choosePlatform}</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: '#B1B1B1',
            fontSize: 10,
            fontFamily: 'Manrope-Regular',
          }}>
          Please select the social media or App Store platform where you want to
          perform this action
        </Text>
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => changeModalVisibility(false)}>
          <AdvertiseModalPicker
            changeModalVisibility={changeModalVisibility}
            setData={setData}
          />
        </Modal>
      </View>
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 30,
          flexDirection: 'column',
          gap: 10,
        }}>
        <Text
          style={{color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13}}>
          Select Location
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#2f2f2f6b',
            height: 50,
            width: '100%',
            borderRadius: 4,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
          onPress={() => changeModal2Visibility(true)}>
          <Text style={styles.text}>{chooseLocation}</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: '#B1B1B1',
            fontSize: 10,
            fontFamily: 'Manrope-Regular',
          }}>
          Please select the social media or App Store platform where you want to
          perform this action
        </Text>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modal2Visible}
          onRequestClose={() => changeModal2Visibility(false)}>
          <AdvertiseModalPicker2
            changeModal2Visibility={changeModal2Visibility}
            setData2={setData2}
          />
        </Modal>
      </View>
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 30,
          flexDirection: 'column',
          gap: 10,
        }}>
        <Text
          style={{color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13}}>
          Number of Instagram Advert post you want
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#2f2f2f6b',
            height: 50,
            width: '100%',
            borderRadius: 4,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}>
          <TextInput
            onChangeText={setChooseNumber}
            placeholder="Enter Your Desired Number"
            placeholderTextColor="#fff"
            keyboardType="numeric"
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#B1B1B1',
            fontSize: 10,
            fontFamily: 'Manrope-Regular',
          }}>
          Enter the desired Number of Instagram Advert Post you want us to get
          for you
        </Text>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modal3Visible}
          onRequestClose={() => changeModal3Visibility(false)}>
          <AdvertiseModalPicker3
            changeModal3Visibility={changeModal3Visibility}
            setData3={setData3}
          />
        </Modal>
        <Text
          style={{color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13}}>
          Select Gender
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#2f2f2f6b',
            height: 50,
            width: '100%',
            borderRadius: 4,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
          onPress={() => changeModal4Visibility(true)}>
          <Text style={styles.text}>{gender}</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modal4Visible}
          onRequestClose={() => changeModal4Visibility(false)}>
          <AdvertiseModalPicker4
            changeModal4Visibility={changeModal4Visibility}
            setData4={setData4}
          />
        </Modal>
        <Text
          style={{
            color: '#B1B1B1',
            fontSize: 10,
            fontFamily: 'Manrope-Regular',
          }}>
          you can select the kind of gender whether male or female that you want
          to see your task or “All Gender” if you want to target all genders
        </Text>
        <Text
          style={{color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13}}>
          Select Religion
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#2f2f2f6b',
            height: 50,
            width: '100%',
            borderRadius: 4,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
          onPress={() => changeModal5Visibility(true)}>
          <Text style={styles.text}>{religion}</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modal5Visible}
          onRequestClose={() => changeModal5Visibility(false)}>
          <AdvertiseModalPicker5
            changeModal5Visibility={changeModal5Visibility}
            setData5={setData5}
          />
        </Modal>
        <Text
          style={{
            color: '#B1B1B1',
            fontSize: 10,
            fontFamily: 'Manrope-Regular',
          }}>
          You can target people of a particular religion or belief. Your advert
          and task will be shown to the particular religion you select. Select
          'All Religion' if you want to target all religion
        </Text>
        <Text
          style={{color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13}}>
          Enter Advert Task or Caption
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#2f2f2f6b',
            height: 120,
            width: '100%',
            borderRadius: 4,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}>
          <TextInput
            onChangeText={setCaption}
            placeholder="Enter Your Caption"
            placeholderTextColor="#fff"
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#B1B1B1',
            fontSize: 10,
            fontFamily: 'Manrope-Regular',
          }}>
          Please enter the advert text or caption. The advert text or caption
          should be well detailed. You can also include a link to your site, a
          phone number for people to contact you or any information you want
          people to see on your advert
        </Text>

        <Text
          style={{
            color: '#fff',
            fontFamily: 'Manrope-ExtraBold',
            fontSize: 13,
            paddingTop: 10,
          }}>
          Choose one of the Advert Media Upload Below:
        </Text>
        <View style={{flexDirection: 'row', gap: 5}}>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#2f2f2f6b',
                padding: 7,
                borderRadius: 4,
              },
              dynamicStyles.DivContainer,
            ]}
            onPress={() => chooseImage()}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none">
              <Path
                d="M2.50466 6.66667C2.5 7.01051 2.5 7.39635 2.5 7.83333V12.1667C2.5 14.0335 2.5 14.9669 2.86331 15.68C3.18289 16.3072 3.69282 16.8171 4.32003 17.1367C5.03307 17.5 5.96649 17.5 7.83333 17.5H12.1667C12.6037 17.5 12.9895 17.5 13.3333 17.4953M2.50466 6.66667C2.51991 5.54158 2.58504 4.86616 2.86331 4.32003C3.18289 3.69282 3.69282 3.18289 4.32003 2.86331C5.03307 2.5 5.96649 2.5 7.83333 2.5H12.1667C14.0335 2.5 14.9669 2.5 15.68 2.86331C16.3072 3.18289 16.8171 3.69282 17.1367 4.32003C17.5 5.03307 17.5 5.96649 17.5 7.83333V12.1667C17.5 13.4282 17.5 14.2635 17.3879 14.8925M2.50466 6.66667L6.67133 10.8333M13.3333 17.4953C14.4584 17.4801 15.1338 17.415 15.68 17.1367C16.3072 16.8171 16.8171 16.3072 17.1367 15.68C17.2545 15.4488 17.3341 15.1944 17.3879 14.8925M13.3333 17.4953L6.67133 10.8333M6.67133 10.8333L7.73726 9.7674C8.52929 8.97537 8.92531 8.57935 9.38197 8.43097C9.78365 8.30046 10.2163 8.30046 10.618 8.43097C11.0747 8.57935 11.4707 8.97537 12.2627 9.7674L17.3879 14.8925M14.175 5.83333H14.1583"
                stroke="#FF6DFB"
                stroke-width="2"
                stroke-linecap="round"
              />
            </Svg>
            <Text
              style={[
                {color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13},
                dynamicStyles.TextColor,
              ]}>
              Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#2f2f2f6b',
                padding: 7,
                borderRadius: 4,
              },
              dynamicStyles.DivContainer,
            ]}
            onPress={() => chooseVideo()}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none">
              <Path
                d="M15.0013 6.66683L17.2992 6.09236C17.8251 5.96087 18.3346 6.35867 18.3346 6.90081V13.0995C18.3346 13.6417 17.8251 14.0395 17.2992 13.908L15.0013 13.3335M7.0013 16.6668H9.66797C11.5348 16.6668 12.4682 16.6668 13.1813 16.3035C13.8085 15.9839 14.3184 15.474 14.638 14.8468C15.0013 14.1338 15.0013 13.2003 15.0013 11.3335V8.66683C15.0013 6.79999 15.0013 5.86657 14.638 5.15353C14.3184 4.52632 13.8085 4.01639 13.1813 3.69681C12.4682 3.3335 11.5348 3.3335 9.66797 3.3335H7.0013C5.13446 3.3335 4.20104 3.3335 3.488 3.69681C2.86079 4.01639 2.35086 4.52632 2.03128 5.15353C1.66797 5.86657 1.66797 6.79999 1.66797 8.66683V11.3335C1.66797 13.2003 1.66797 14.1338 2.03128 14.8468C2.35086 15.474 2.86079 15.9839 3.488 16.3035C4.20104 16.6668 5.13446 16.6668 7.0013 16.6668Z"
                stroke="#B1B1B1"
                stroke-width="2"
                stroke-linecap="round"
              />
            </Svg>
            <Text
              style={[
                {color: '#fff', fontFamily: 'Manrope-Regular', fontSize: 13},
                dynamicStyles.TextColor,
              ]}>
              Video
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2f2f2f6b',
            padding: 7,
            borderRadius: 4,
            height: 150,
            width: '50%',
          }}>
          {Array.isArray(image) && image.length > 0 ? (
            image.length === 1 ? (
              <Image
                source={{uri: image[0].uri}}
                style={{width: 100, height: 100}}
              />
            ) : (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {image.map((img, index) => (
                  <Image
                    key={index}
                    source={{uri: img.uri}}
                    style={{width: 100, height: 100, marginRight: 5}}
                  />
                ))}
              </ScrollView>
            )
          ) : (
            <View />
          )}
          {Array.isArray(videos) && videos.length > 0 ? (
            videos.length === 1 ? (
              <Video
                source={{uri: videos[0].uri}}
                style={{width: 100, height: 100}}
              />
            ) : (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {videos.map((img, index) => (
                  <Image
                    key={index}
                    source={{uri: img.uri}}
                    style={{width: 100, height: 100, marginRight: 5}}
                  />
                ))}
              </ScrollView>
            )
          ) : (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none">
              <Path
                d="M12.25 4V20M20.25 12L4.25 12"
                stroke="#FFD0FE"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignSelf: 'baseline',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2F2F2F6B',
          height: 80,
          width: '100%',
          paddingHorizontal: 15,
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              color: '#fff',
              fontFamily: 'Manrope-Regular',
              fontSize: 13,
            }}>
            Total pay
          </Text>
          <Text
            style={{
              color: '#fff',
              fontFamily: 'Manrope-Regular',
              fontSize: 30,
            }}>
            {userData1?.userdata?.wallet?.currency_symbol}{' '}
            {isNaN(Number(chooseNumber)) ? 0 : Number(chooseNumber) * 140}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#CB29BE',
            height: 50,
            width: 140,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setIsModalVisible(true)}>
          <Text
            style={{
              fontFamily: 'Manrope-Regular',
              color: '#fff',
              fontSize: 13,
            }}>
            Submit and Pay
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
              backgroundColor: '#121212aa',
              //   padding: 20,
              justifyContent: 'flex-end',
            }}>
            <>
              <SafeAreaView>
                <View
                  style={{
                    backgroundColor: '#000',
                    width: '100%',
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    maxHeight: deviceHeight * 0.7,
                    position: 'relative',
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 30,
                      paddingVertical: 30,
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
                          top: -30,
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
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'Manrope-ExtraBold',
                        paddingBottom: 10,
                      }}>
                      How would you like to pay?
                    </Text>
                  </View>
                  <View style={{paddingHorizontal: 10}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#1a1a1a',
                        height: 100,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: 8,
                        flexDirection: 'row',
                      }}
                      onPress={() => createTaskPaystack()}>
                      <Svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M8 9V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V9M8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V12.2C19 11.0799 19 10.5198 18.782 10.092C18.5903 9.71569 18.2843 9.40973 17.908 9.21799C17.4802 9 16.9201 9 15.8 9H8.2C7.0799 9 6.51984 9 6.09202 9.21799C5.71569 9.40973 5.40973 9.71569 5.21799 10.092C5 10.5198 5 11.0799 5 12.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21Z"
                          stroke="#FF6DFB"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </Svg>

                      <View
                        style={{
                          flexDirection: 'column',
                          gap: 5,
                          width: 250,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            fontFamily: 'Manrope-Bold',
                          }}>
                          100% Secure payment
                        </Text>
                        <Text
                          style={{
                            color: '#909090',
                            fontSize: 12,
                            fontFamily: 'Manrope-Regular',
                          }}>
                          Pay through our highly secured online payment partner
                          using your VISA/Mastercard/Verve card. Or Bank
                          transfer via USSD or internet Bank Transfer. .
                        </Text>
                      </View>
                      <Svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M5 12H18M13 6L18.2929 11.2929C18.6834 11.6834 18.6834 12.3166 18.2929 12.7071L13 18"
                          stroke="#FF6DFB"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <View style={{paddingHorizontal: 10, paddingVertical: 12}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#1a1a1a',
                        height: 100,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: 8,
                        flexDirection: 'row',
                      }}
                      onPress={() => {
                        setIsModal2Visible(true);
                        setIsModalVisible(false);
                      }}>
                      <Svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <G id="Banking &#38; Finance/wallet/alt">
                          <Path
                            id="Icon"
                            d="M5.09202 19.782L5.54601 18.891H5.54601L5.09202 19.782ZM4.21799 18.908L5.10899 18.454L5.10899 18.454L4.21799 18.908ZM18.908 19.782L18.454 18.891H18.454L18.908 19.782ZM19.782 18.908L18.891 18.454V18.454L19.782 18.908ZM18.908 6.21801L18.454 7.10902L18.454 7.10902L18.908 6.21801ZM19.782 7.09205L18.891 7.54604L19.782 7.09205ZM5.09202 6.21801L4.63803 5.32701H4.63803L5.09202 6.21801ZM4.21799 7.09205L3.32698 6.63806H3.32698L4.21799 7.09205ZM15.546 14.891L16 14L15.546 14.891ZM15.109 14.454L16 14L15.109 14.454ZM21.891 14.454L21 14L21.891 14.454ZM21.454 14.891L21 14L21.454 14.891ZM21.454 11.109L21 12L21.454 11.109ZM21.891 11.546L21 12L21.891 11.546ZM15.546 11.109L16 12L15.546 11.109ZM15.109 11.546L16 12L15.109 11.546ZM5.62861 5.07155C5.11583 5.27666 4.86641 5.85863 5.07152 6.37142C5.27664 6.8842 5.85861 7.13362 6.37139 6.9285L5.62861 5.07155ZM14.6286 2.54858L14.2572 1.62011V1.62011L14.6286 2.54858ZM15 6.00003C15 6.55231 15.4477 7.00003 16 7.00003C16.5523 7.00003 17 6.55231 17 6.00003H15ZM7.2 7.00003H16.8V5.00003H7.2V7.00003ZM16.8 19H7.2V21H16.8V19ZM5 16.8V9.20003H3V16.8H5ZM19 9.20003V11.25H21V9.20003H19ZM19 15.1875V16.8H21V15.1875H19ZM7.2 19C6.62345 19 6.25117 18.9992 5.96784 18.9761C5.69617 18.9539 5.59545 18.9162 5.54601 18.891L4.63803 20.673C5.01641 20.8658 5.40963 20.9372 5.80497 20.9695C6.18864 21.0008 6.65645 21 7.2 21V19ZM3 16.8C3 17.3436 2.99922 17.8114 3.03057 18.1951C3.06287 18.5904 3.13419 18.9836 3.32698 19.362L5.10899 18.454C5.0838 18.4046 5.04612 18.3039 5.02393 18.0322C5.00078 17.7489 5 17.3766 5 16.8H3ZM5.54601 18.891C5.35785 18.7952 5.20487 18.6422 5.10899 18.454L3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673L5.54601 18.891ZM16.8 21C17.3436 21 17.8114 21.0008 18.195 20.9695C18.5904 20.9372 18.9836 20.8658 19.362 20.673L18.454 18.891C18.4045 18.9162 18.3038 18.9539 18.0322 18.9761C17.7488 18.9992 17.3766 19 16.8 19V21ZM19 16.8C19 17.3766 18.9992 17.7489 18.9761 18.0322C18.9539 18.3039 18.9162 18.4046 18.891 18.454L20.673 19.362C20.8658 18.9836 20.9371 18.5904 20.9694 18.1951C21.0008 17.8114 21 17.3436 21 16.8H19ZM19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362L18.891 18.454C18.7951 18.6422 18.6422 18.7952 18.454 18.891L19.362 20.673ZM16.8 7.00003C17.3766 7.00003 17.7488 7.0008 18.0322 7.02395C18.3038 7.04615 18.4045 7.08383 18.454 7.10902L19.362 5.32701C18.9836 5.13421 18.5904 5.0629 18.195 5.0306C17.8114 4.99925 17.3436 5.00003 16.8 5.00003V7.00003ZM21 9.20003C21 8.65648 21.0008 8.18867 20.9694 7.805C20.9371 7.40965 20.8658 7.01644 20.673 6.63806L18.891 7.54604C18.9162 7.59548 18.9539 7.6962 18.9761 7.96786C18.9992 8.2512 19 8.62347 19 9.20003H21ZM18.454 7.10902C18.6422 7.20489 18.7951 7.35787 18.891 7.54604L20.673 6.63806C20.3854 6.07357 19.9265 5.61463 19.362 5.32701L18.454 7.10902ZM7.2 5.00003C6.65645 5.00003 6.18864 4.99925 5.80497 5.0306C5.40963 5.0629 5.01641 5.13421 4.63803 5.32701L5.54601 7.10902C5.59545 7.08383 5.69617 7.04615 5.96784 7.02395C6.25117 7.0008 6.62345 7.00003 7.2 7.00003V5.00003ZM5 9.20003C5 8.62347 5.00078 8.2512 5.02393 7.96786C5.04612 7.6962 5.0838 7.59548 5.10899 7.54604L3.32698 6.63806C3.13419 7.01644 3.06287 7.40965 3.03057 7.805C2.99922 8.18867 3 8.65648 3 9.20003H5ZM4.63803 5.32701C4.07354 5.61463 3.6146 6.07357 3.32698 6.63806L5.10899 7.54604C5.20487 7.35787 5.35785 7.20489 5.54601 7.10902L4.63803 5.32701ZM16.6 12H20.4V10H16.6V12ZM21 12.6V13.4H23V12.6H21ZM20.4 14H16.6V16H20.4V14ZM16 13.4V12.6H14V13.4H16ZM16.6 14C16.3035 14 16.1412 13.9993 16.0246 13.9897C15.9197 13.9812 15.9425 13.9707 16 14L15.092 15.782C15.3634 15.9203 15.6332 15.9644 15.8618 15.9831C16.0787 16.0008 16.3365 16 16.6 16V14ZM14 13.4C14 13.6636 13.9992 13.9213 14.0169 14.1383C14.0356 14.3668 14.0797 14.6366 14.218 14.908L16 14C16.0293 14.0575 16.0189 14.0803 16.0103 13.9754C16.0008 13.8588 16 13.6966 16 13.4H14ZM16 14V14L14.218 14.908C14.4097 15.2843 14.7157 15.5903 15.092 15.782L16 14ZM21 13.4C21 13.6966 20.9992 13.8588 20.9897 13.9754C20.9811 14.0803 20.9707 14.0575 21 14L22.782 14.908C22.9203 14.6366 22.9644 14.3668 22.9831 14.1383C23.0008 13.9213 23 13.6636 23 13.4H21ZM20.4 16C20.6635 16 20.9213 16.0008 21.1382 15.9831C21.3668 15.9644 21.6366 15.9203 21.908 15.782L21 14C21.0575 13.9707 21.0803 13.9812 20.9754 13.9897C20.8588 13.9993 20.6965 14 20.4 14V16ZM21 14V14L21.908 15.782C22.2843 15.5903 22.5903 15.2843 22.782 14.908L21 14ZM20.4 12C20.6965 12 20.8588 12.0008 20.9754 12.0103C21.0803 12.0189 21.0575 12.0293 21 12L21.908 10.218C21.6366 10.0797 21.3668 10.0356 21.1382 10.017C20.9213 9.99925 20.6635 10 20.4 10V12ZM23 12.6C23 12.3365 23.0008 12.0787 22.9831 11.8618C22.9644 11.6332 22.9203 11.3635 22.782 11.092L21 12C20.9707 11.9425 20.9811 11.9198 20.9897 12.0247C20.9992 12.1412 21 12.3035 21 12.6H23ZM21 12L22.782 11.092C22.5903 10.7157 22.2843 10.4098 21.908 10.218L21 12ZM16.6 10C16.3365 10 16.0787 9.99925 15.8618 10.017C15.6332 10.0356 15.3634 10.0797 15.092 10.218L16 12C15.9425 12.0293 15.9197 12.0189 16.0246 12.0103C16.1412 12.0008 16.3035 12 16.6 12V10ZM16 12.6C16 12.3035 16.0008 12.1412 16.0103 12.0247C16.0189 11.9198 16.0293 11.9425 16 12L14.218 11.092C14.0797 11.3635 14.0356 11.6332 14.0169 11.8618C13.9992 12.0787 14 12.3365 14 12.6H16ZM15.092 10.218C14.7157 10.4098 14.4097 10.7157 14.218 11.092L16 12L15.092 10.218ZM6.37139 6.9285L15 3.47706L14.2572 1.62011L5.62861 5.07155L6.37139 6.9285ZM15 3.47706V6.00003H17V3.47706H15ZM15 3.47706L15 3.47706H17C17 2.06213 15.5709 1.09462 14.2572 1.62011L15 3.47706Z"
                            fill="#FF6DFB"
                          />
                        </G>
                      </Svg>

                      <View
                        style={{
                          flexDirection: 'column',
                          gap: 5,
                          width: 250,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            fontFamily: 'Manrope-Bold',
                          }}>
                          Pay from your Trendit Wallet
                        </Text>
                        <Text
                          style={{
                            color: '#909090',
                            fontSize: 12,
                            fontFamily: 'Manrope-Regular',
                          }}>
                          Wallet Balance:
                          {userData?.userdata?.wallet?.currency_symbol}
                          {userBalance?.balance}
                        </Text>
                      </View>
                      <Svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M5 12H18M13 6L18.2929 11.2929C18.6834 11.6834 18.6834 12.3166 18.2929 12.7071L13 18"
                          stroke="#FF6DFB"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </Svg>
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
          visible={isModal2Visible}
          onRequestClose={() => setIsModal2Visible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#121212aa',
              //   padding: 20,
              justifyContent: 'flex-end',
            }}>
            <>
              <SafeAreaView>
                <View
                  style={{
                    backgroundColor: '#000',
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
                    onPress={() => setIsModal2Visible(false)}>
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
                        fontFamily: 'Manrope-ExtraBold',
                        paddingBottom: 10,
                        paddingTop: 20,
                      }}>
                      How would you like to pay?
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 7,
                    }}>
                    <View
                      style={{
                        backgroundColor: 'rgba(177, 177, 177, 0.1)',
                        height: 200,
                        width: '100%',
                        borderRadius: 6,
                        paddingHorizontal: 10,
                      }}>
                      <View
                        style={{
                          paddingBottom: 39,
                          alignSelf: 'center',
                          paddingTop: 50,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            alignSelf: 'center',
                            fontFamily: 'Manrope-Regular',
                          }}>
                          Total Pay
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 30,
                            fontFamily: 'Manrope-Medium',
                          }}>
                          {/* {userData1?.userdata?.wallet?.currency_symbol}{' '} */}
                          {isNaN(Number(chooseNumber))
                            ? 0
                            : Number(chooseNumber) * 140}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'Manrope-Regular',
                            color: '#B1B1B1',
                          }}>
                          Amount due to task
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#B1B1B1',
                            fontFamily: 'Manrope-Regular',
                          }}>
                          {/* {userData1?.userdata?.wallet?.currency_symbol}{' '} */}
                          {isNaN(Number(chooseNumber))
                            ? 0
                            : Number(chooseNumber) * 140}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'Manrope-Regular',
                            color: '#B1B1B1',
                          }}>
                          Wallet balance after this payment
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'Manrope-Regular',
                            color: '#B1B1B1',
                          }}>
                          {result}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingBottom: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 20,
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#CB29BE',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '80%',
                        borderRadius: 110,
                      }}
                      onPress={() => {
                        createTask();
                      }}>
                      {isLoading1 ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: 'Manrope-Regular',
                            fontSize: 14,
                          }}>
                          proceed
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
          visible={isModal3Visible}
          onRequestClose={() => setIsModal3Visible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#121212aa',
              //   padding: 20,
              justifyContent: 'flex-end',
            }}>
            <>
              <SafeAreaView>
                <View
                  style={{
                    backgroundColor: '#000',
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
                    onPress={() => navigation.navigate('History')}>
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
                      paddingTop: 50,
                    }}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="179"
                      height="121"
                      viewBox="0 0 179 121"
                      fill="none">
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M170.894 40.5497C170.691 42.1248 170.836 43.8417 169.057 44.2566C167.412 44.6408 165.606 44.5335 163.929 44.6678C162.044 44.8191 160.164 45.0263 158.282 45.2127C155.911 45.4475 156.249 44.536 155.731 42.5108C155.257 40.6615 154.5 38.8152 153.871 37.0117C153.579 36.173 153.23 35.4021 152.831 34.6119C152.47 33.8967 152.642 32.9237 152.253 32.3226C150.925 30.2715 144.449 35.8805 143.847 34.7748C144.943 33.9218 146.839 32.9674 147.175 31.5077C147.57 29.7922 146.48 29.28 145.11 29.9072C141.739 31.4513 137.848 32.6582 134.172 33.2209C135.361 32.4262 146.115 26.1627 142.506 24.3048C141.693 23.8861 140.606 24.6743 139.873 24.9725C138.708 25.4459 137.492 25.7632 136.277 26.0734C134.996 26.4002 133.712 26.7147 132.425 27.0119C131.521 27.2204 129.911 27.961 129.031 27.7782C128.138 27.5925 129.72 27.0379 129.979 26.9073C131.109 26.338 132.221 25.7264 133.325 25.107C135.281 24.008 137.089 22.7349 138.578 21.0357C139.701 19.7535 141.556 16.9537 140.774 15.1808C140.321 14.1531 139.328 13.2033 138.744 12.2297C138.063 11.0926 137.513 9.88045 136.922 8.69575C137.912 9.13103 139.023 9.24246 140.034 9.63318C141.045 10.0241 142.071 10.3405 143.123 10.6312C145.232 11.2141 147.336 11.3177 149.426 11.7905C151.793 12.3255 154.258 12.9237 156.662 13.233C158.756 13.5018 160.638 14.0746 162.432 15.2157C166.094 17.5467 168.635 20.8953 169.92 25.0363C170.673 27.4621 170.856 29.9932 170.945 32.5171C171.038 35.178 171.235 37.9006 170.894 40.5497ZM150.338 40.7456C147.78 42.61 144.799 44.0664 142.054 45.6528C140.483 46.5599 138.879 47.4073 137.277 48.2579C136.14 48.8612 134.759 49.9717 133.507 50.2812C132.716 50.4771 132.775 50.4921 132.274 49.7702C131.795 49.0816 131.377 48.3396 130.929 47.6296C130.102 46.3213 129.268 45.0175 128.435 43.7136C126.564 40.7914 124.698 37.8698 122.733 35.0098C120.762 32.1395 118.871 29.2168 116.962 26.3061C116.075 24.9529 115.193 23.5945 114.251 22.2785C113.532 21.2736 111.688 19.7409 112.564 18.5578C113.377 17.4587 115.229 16.5458 116.325 15.7139C117.664 14.6983 119.011 13.6931 120.346 12.6723C123.217 10.4778 126.013 8.18777 128.881 5.99037C131.315 10.2591 134.179 14.261 137.068 18.2297C134.456 19.8963 131.817 21.4805 129.064 22.9073C127.031 23.9611 123.921 25.385 122.637 27.384C121.372 29.3523 122.615 31.6234 124.869 31.6596C126.218 31.6811 127.562 31.324 128.884 31.12C129.838 30.9727 131.581 30.2848 132.441 30.7697C130.895 31.7564 125.284 34.6318 128.308 37.1529C130.47 38.9552 134.126 36.3249 136.461 36.8667C135.749 38.2321 135.009 40.411 136.985 41.1543C138.629 41.7726 140.782 40.62 142.261 40.0086C143.331 39.5673 144.393 39.1109 145.445 38.6288C146.281 38.2452 147.282 37.4687 148.176 37.303C149.218 37.1096 151.341 40.0149 150.338 40.7456ZM102.79 141.419C104.253 141.153 105.005 140.548 105.466 142.324C105.879 143.915 106.288 145.448 106.82 147.01C104.534 147.207 102.518 148.298 100.851 149.833C99.6638 150.927 97.3028 153.538 97.8879 155.369C99.3098 159.82 106.491 149.835 107.345 148.768C108.39 150.295 108.774 152.293 109.293 154.039C109.663 155.282 111.034 157.663 109.221 157.965C106.676 158.39 101.901 159.338 102.202 162.941C102.558 167.196 107.972 167.172 111.009 167.363C112.721 167.471 112.729 168.842 112.972 170.377C113.081 171.064 113.422 171.992 112.839 172.495C112.321 172.94 110.736 172.953 110.062 173.097C108.098 173.519 106.135 173.949 104.172 174.37C101.942 174.848 100.763 174.178 98.6789 173.567C97.9074 173.341 97.1321 173.437 97.0756 172.573C97.0404 172.043 97.5596 171.223 97.7291 170.699C98.402 168.625 98.9745 166.49 99.1679 164.312C99.4491 161.147 99.0976 156.402 95.1998 155.784C93.3461 155.491 92.9895 155.395 92.1521 153.655C91.2469 151.774 89.8093 150.031 90.1564 147.863C90.4082 146.293 89.9838 143.321 90.9863 142.018C91.4502 141.416 92.3536 141.057 92.97 140.615C93.756 140.051 94.5131 139.448 95.2457 138.817C95.8615 138.286 96.6123 137.249 97.311 136.866C98.1641 136.397 98.1905 136.716 98.8032 137.448C99.7078 138.529 101.146 141.72 102.79 141.419ZM106.926 148.45C106.419 149.474 105.247 150.425 104.501 151.28C103.75 152.139 103.039 153.047 102.201 153.826C101.28 154.683 98.0053 156.754 98.7266 153.966C99.2884 151.799 101.388 150.043 103.237 148.961C103.595 148.752 107.784 146.719 106.926 148.45ZM110.508 158.771C110.833 160.221 111.007 161.717 111.285 163.178C111.427 163.925 112.213 165.73 111.893 166.449C111.349 167.667 106.464 166.225 105.452 165.806C103.042 164.808 101.935 162.247 104.158 160.423C105.001 159.732 110.184 157.32 110.508 158.771ZM113.71 176.196C113.983 177.581 114.779 178.865 113.463 179.912C112.37 180.782 110.58 181.375 109.234 181.684C107.399 182.106 106.809 181.078 105.838 179.756C104.793 178.334 103.681 176.961 102.528 175.625C106.15 174.815 109.773 174.004 113.396 173.193C113.393 174.202 113.516 175.207 113.71 176.196ZM105.03 182.624C103.142 182.527 101.109 183.095 99.193 183.245C96.8 183.431 94.4145 183.703 92.0196 183.864C92.6329 181.907 93.7353 180.161 94.5972 178.312C95.4622 176.457 96.0693 176.256 98.0586 176.113C99.9024 175.981 101.202 175.346 102.563 176.91C103.978 178.536 105.26 180.303 106.553 182.027C106.113 182.322 105.588 182.654 105.03 182.624ZM91.5268 183.024C91.0604 183.364 89.6235 182.398 89.1388 182.211C88.1966 181.847 87.9875 181.73 87.496 180.811C87.0735 180.021 86.4012 179.123 86.2688 178.221C86.0942 177.033 86.6203 175.467 86.8118 174.286C87.3221 175.515 88.9964 175.659 90.1276 175.859C90.9832 176.012 93.5187 175.769 94.164 176.379C94.8765 177.052 93.5645 178.929 93.2224 179.636C92.8144 180.48 92.3103 182.453 91.5268 183.024ZM90.6134 183.999C90.0529 184.09 88.4383 184.648 88.4703 183.624C88.5067 182.453 90.7277 183.716 90.6134 183.999ZM87.7685 183.938C87.6661 184.923 85.5456 184.841 85.4972 183.974C85.4144 182.51 87.9317 182.364 87.7685 183.938ZM85.3441 157.367C84.8017 158.911 81.4997 159.463 80.2316 159.938C79.0734 160.373 75.6132 162.376 74.4192 161.65C78.4613 158.872 82.6039 156.15 86.0289 152.603C86.1689 153.479 85.9555 154.211 85.6975 155.04C85.464 155.789 85.5839 156.683 85.3441 157.367ZM84.3384 162.997C83.7571 166.778 83.1858 170.61 82.3986 174.353C80.8989 173.896 79.6622 172.967 78.086 172.643C76.6478 172.348 75.1625 172.341 73.7124 172.556C70.6226 173.016 67.868 174.544 65.1724 176.033C64.9232 173.439 64.4071 170.664 64.4687 168.062C64.5189 165.9 68.2189 165.26 69.8975 164.367C70.9126 163.827 71.831 163.067 72.9873 162.879C74.1782 162.684 75.3263 162.69 76.5027 162.328C79.2824 161.47 81.8989 160.11 84.6228 159.097C84.845 160.395 84.5361 161.717 84.3384 162.997ZM81.7407 179.001C81.6171 179.861 81.7734 181.395 81.118 182.05C80.5009 182.667 79.1833 182.688 78.3697 182.855C75.8913 183.365 73.4148 183.88 70.9402 184.405C69.8328 184.64 68.7255 184.865 67.6137 185.076C67.0833 185.176 65.7531 185.684 65.3067 185.263C64.883 184.861 65.1981 183.581 65.2207 183.045C65.2665 181.972 65.3274 180.896 65.2596 179.823C65.1309 177.765 65.2452 176.977 67.1611 175.912C69.1969 174.78 71.2993 174.006 73.5906 173.586C75.9101 173.162 78.1199 173.394 80.3277 174.284C80.9422 174.532 81.8638 174.837 82.15 175.5C82.5386 176.401 81.8719 178.088 81.7407 179.001ZM78.9504 212.178C78.042 212.748 76.0652 212.651 75.0219 212.766C73.3363 212.953 71.6408 212.846 69.9665 212.586C68.7066 212.391 66.8259 212.12 65.8598 211.235C64.4875 209.979 66.0713 209.921 67.1216 210.009C70.1743 210.266 73.266 210.087 76.3163 209.866C76.9102 209.824 78.5065 209.302 79.0791 209.546C79.811 209.858 79.5869 211.78 78.9504 212.178ZM77.2196 232.49C71.5309 231.937 68.2333 227.227 66.1699 222.413C65.0631 219.828 65.4624 217.116 65.3532 214.382C65.3331 213.883 65.0198 212.644 65.5327 212.271C66.0154 211.921 67.9665 213.004 68.4945 213.134C71.2001 213.797 74.1926 213.86 76.9039 213.216C78.0784 212.937 78.7363 212.418 79.1098 213.582C79.4099 214.52 78.9171 216.247 78.8631 217.229C78.7702 218.929 79.0364 232.666 77.2196 232.49ZM65.856 232.495C65.834 231.67 65.4178 223.333 65.8215 223.308C67.0218 225.897 68.2547 228.212 70.4392 230.116C71.5554 231.089 72.8103 231.966 74.2058 232.489C74.7306 232.685 77.7018 232.834 77.8474 233.484C78.1023 234.622 76.0734 234.163 75.472 234.071C74.9892 233.996 74.5548 233.791 74.0809 233.705C73.1788 233.541 72.3263 233.76 71.4198 233.779C70.0431 233.807 68.6916 233.663 67.3137 233.782C66.055 233.89 65.8893 233.746 65.856 232.495ZM66.6953 195.103C71.5654 193.529 75.6352 196.509 78.2052 200.41C79.6704 202.635 79.9981 204.19 79.742 206.824C79.6497 207.768 79.8192 208.405 78.9522 208.79C78.0941 209.171 76.1443 208.888 75.2158 208.932C72.5454 209.056 69.8849 209.222 67.2145 209.064C65.48 208.961 65.2345 208.667 65.2647 206.984C65.3004 204.957 65.1322 202.94 65.0173 200.909C64.893 198.714 64.1391 195.929 66.6953 195.103ZM65.1021 192.184C65.1052 190.695 65.0154 189.167 65.1065 187.68C65.1975 186.206 65.8246 186.279 67.2164 186.027C70.2302 185.482 73.2409 184.873 76.214 184.135C77.3898 183.843 78.7187 183.282 79.9441 183.278C81.2298 183.273 81.1613 183.933 81.076 185.071C80.8851 187.592 80.4231 190.076 80.2825 192.584C80.1312 195.29 80.0515 198.031 80.0634 200.741C80.0678 201.655 80.29 202.333 79.5103 201.477C78.7294 200.619 78.3477 199.253 77.6503 198.29C76.2221 196.317 74.1003 194.73 71.745 194.061C70.4424 193.692 69.0732 193.628 67.7455 193.895C67.3425 193.976 65.3249 194.939 65.0682 194.749C64.8943 194.621 65.1021 192.244 65.1021 192.184ZM82.9172 243.793C84.8488 245.176 86.9875 246.294 89.1527 247.264C90.3711 247.81 95.1936 248.958 95.3474 250.186C95.4296 250.842 94.6305 251.576 94.1069 251.653C93.4427 251.752 92.3486 251.318 91.6725 251.236C89.2129 250.938 86.7584 250.936 84.3585 250.251C79.5668 248.884 74.5994 248.499 69.7581 247.307C68.6062 247.024 67.4511 246.758 66.2935 246.501C65.1937 246.257 64.7009 246.299 64.6626 245.124C64.5766 242.545 65.3168 239.902 65.3224 237.292C69.239 237.739 73.1687 237.733 77.096 238.101C78.779 238.258 78.7401 238.577 79.4771 240.047C80.2429 241.572 81.5449 242.812 82.9172 243.793ZM63.8208 160.007C63.7712 159.053 63.7323 158.095 63.6463 157.143C63.5879 156.503 63.0035 154.715 63.3331 154.217C63.7248 153.626 64.119 153.987 64.8196 153.97C65.743 153.948 66.5158 153.577 67.2772 153.091C68.7192 152.172 69.7914 150.961 70.7274 149.549C71.5504 148.305 71.3972 146.607 71.3872 145.118C71.3614 141.268 71.642 137.514 71.4066 133.647C71.2987 131.871 72.8153 132.96 74.0394 133.19C76.0426 133.566 78.2197 133.306 80.2555 133.31C80.1795 133.784 76.0169 134.959 75.3445 135.406C73.6226 136.551 72.6188 138.382 72.7758 140.47C73.0921 144.671 77.7187 145.373 81.0998 145.381C78.295 147.861 75.5398 150.226 73.3351 153.285C71.7098 155.541 68.8466 159.988 71.5039 162.484C69.1549 163.818 66.8271 165.301 64.1699 165.943C64.0512 163.965 63.9238 161.987 63.8208 160.007ZM62.7543 83.3269C63.7103 83.9415 64.1127 83.0727 64.8409 82.6232C65.8654 81.9898 66.205 82.0519 66.335 80.637C66.5754 78.0123 65.4712 75.6363 64.0845 73.4887C63.4548 72.5126 62.8258 71.3499 61.9363 70.5866C61.1252 69.891 60.306 70.1302 59.5546 69.4114C59.2595 69.1283 59.3229 68.7297 58.8352 68.741C58.5138 68.7485 57.7335 69.7429 57.4686 69.9626C56.6305 70.6557 55.606 71.1836 54.5081 70.6117C52.9098 69.7793 53.4233 66.7592 54.6644 65.7805C55.6204 65.0272 56.7504 65.1433 57.8389 65.0222C58.655 64.9311 58.8245 64.9669 58.4887 64.0328C58.2539 63.3787 57.7115 62.8683 57.4434 62.2293C56.9281 61.0008 57.0404 59.5086 56.8182 58.2085C56.6186 57.044 56.1515 55.7841 56.1685 54.6014C56.1904 53.0954 56.6826 52.7043 57.9877 52.2819C59.252 51.8732 60.2991 50.9717 61.3757 50.214C62.5948 49.3565 63.93 48.7903 65.1824 48.0068C66.033 47.4751 66.5817 46.4004 67.5171 46.9026C68.6282 47.499 69.8033 49.2266 70.7481 50.1092C69.3652 50.9862 69.0438 51.3704 69.2346 53.0879C69.4091 54.6629 69.7299 56.066 70.9339 57.1633C71.3966 57.5851 72.2597 57.9222 72.6182 58.4088C73.0363 58.975 72.7645 58.4759 72.7117 59.115C72.6835 59.4596 72.4104 59.685 72.47 60.0836C72.7356 61.8539 74.7689 60.8093 75.6069 60.1941C78.6013 57.9976 73.0105 56.253 71.6828 55.4527C70.7657 54.8996 70.3124 53.135 71.7651 53.6039C72.7312 53.9159 74.9145 56.5594 75.1361 54.1494C77.5329 55.5412 79.0113 58.4979 81.0207 60.368C82.4696 61.7164 84.4162 63.2117 83.2662 65.3649C81.8004 68.1101 78.8939 69.3562 76.241 70.5401C73.6672 71.6889 74.202 74.9395 75.5774 76.9288C76.3728 78.0795 77.4149 78.7531 78.6685 79.3118C79.9491 79.883 80.2147 80.5541 80.4947 81.8787C80.8054 83.3483 80.4752 83.9409 79.2027 84.6998C77.9598 85.4412 76.6609 86.1593 75.3339 86.74C72.4656 87.9949 69.4895 88.074 66.4386 88.5021C65.3689 88.6522 64.3437 88.9642 63.7599 87.9039C63.1039 86.7111 63.0556 84.6571 62.7543 83.3269ZM62.2929 77.6187C61.5747 77.2402 59.8415 78.4969 58.9337 78.5522C57.4654 78.6407 56.5012 78.6074 55.198 79.3859C52.734 80.8579 50.6888 82.7538 48.7132 84.809C46.4878 87.1242 44.275 89.4513 42.0565 91.7727C41.0515 92.8249 40.0408 93.8713 39.0201 94.9071C38.2153 95.7232 37.4281 96.8714 36.4324 97.4546C36.4839 96.7621 36.9083 96.2725 37.0589 95.6309C37.1468 95.2562 36.9937 94.9373 37.0502 94.5782C37.069 94.462 37.3822 94.0565 37.4293 93.9234C37.5568 93.5725 37.7124 93.226 37.8631 92.8619C38.0037 92.5217 37.9836 92.1689 38.1261 91.8135C38.273 91.4476 38.6754 91.2053 38.8148 90.8443C39.2241 89.7884 38.5467 89.2994 37.4638 89.3239C37.8876 87.2115 38.0728 86.1782 40.2818 85.4337C42.3924 84.7218 44.4539 83.9233 46.3931 82.8109C48.1144 81.8234 49.55 80.4009 51.2048 79.3005C52.6863 78.3149 54.5307 77.2829 54.5156 75.2621C55.3555 75.8321 56.1427 76.3111 57.1032 75.7442C57.9143 75.2653 58.0216 74.8798 58.9595 74.7894C59.7247 74.716 60.1987 74.6965 60.8817 75.033C61.6852 75.4291 61.795 75.7041 62.2634 74.539C62.7951 74.9865 64.1404 76.8516 64.0952 77.5892C64.0707 77.996 64.0091 78.1793 63.5051 78.2867C62.7907 78.4386 62.8183 77.8949 62.2929 77.6187ZM58.9444 187.976C58.5954 188.512 57.122 188.413 56.5533 188.406C54.8194 188.384 54.213 186.928 53.4522 185.522C52.2532 183.306 50.4603 178.701 52.4277 176.375C53.9814 174.539 57.0065 176.852 58.0662 178.239C58.9808 179.437 58.709 181.234 58.7937 182.671C58.8659 183.883 59.6349 186.92 58.9444 187.976ZM54.2074 188.779C53.5143 189.472 51.2638 189.326 50.3454 189.475C48.7063 189.74 47.0754 190.059 45.4853 190.543C44.3007 190.904 43.1306 191.873 42.818 190.223C42.5562 188.835 42.6868 187.171 42.7119 185.77C42.7389 184.259 42.8965 182.768 43.0283 181.264C43.1168 180.247 42.8946 178.375 43.7251 177.595C44.4407 176.922 46.1809 176.857 47.11 176.634C48.636 176.268 50.2299 175.788 51.8162 175.952C50.8909 178.463 50.8125 181.096 51.8043 183.598C52.0874 184.313 54.6355 188.351 54.2074 188.779ZM42.5468 178.775C42.1607 182.553 41.7715 186.354 42.1438 190.15C42.1664 190.376 42.4369 191.414 42.3189 191.576C42.1978 191.744 41.2348 191.831 41.0163 191.883C40.1475 192.089 39.2806 192.307 38.4067 192.489C36.7061 192.845 36.4839 191.771 36.1506 190.195C35.4356 186.818 36.8217 183.157 37.661 179.914C38.0703 178.335 38.3735 178.153 39.9265 178.022C41.0075 177.931 42.7113 177.17 42.5468 178.775ZM35.9792 192.868C35.3295 193.459 34.6798 190.67 34.622 190.386C34.3954 189.258 34.5216 188.113 34.5247 186.966C34.5303 185.176 34.3935 183.394 34.391 181.612C34.3891 180.648 33.6672 178.677 34.8078 178.167C35.1424 178.018 36.4726 178.08 36.7739 178.277C37.4011 178.686 37.1537 178.951 36.9679 179.663C36.5524 181.261 36.1926 182.867 35.8304 184.478C35.4751 186.058 35.1248 187.578 35.2943 189.209C35.3496 189.749 36.3935 192.491 35.9792 192.868ZM56.7071 175.267C58.2915 174.821 58.3763 176.035 58.3738 177.197C58.1321 177.011 55.881 175.501 56.7071 175.267ZM35.5134 90.0018C35.1255 90.6415 32.6665 90.816 31.9641 90.9843C30.5818 91.3157 29.1988 91.6441 27.8196 91.9893C25.2367 92.6347 22.7171 93.3635 20.0691 93.7012C21.5232 91.3735 21.9756 89.3634 21.705 86.4588C21.3638 82.7908 20.9299 79.1605 20.0854 75.5704C19.253 72.0304 18.2892 68.5137 17.3608 64.9977C16.9048 63.2701 16.4117 61.5752 15.8051 59.8947C15.3188 58.5469 14.5594 56.8513 15.3847 55.4696C17.4792 56.9976 19.1591 58.6435 20.3537 60.965C21.6337 63.4528 22.751 66.0071 24.2363 68.3876C24.9156 69.4755 25.7085 70.4679 26.4354 71.5213C26.8673 72.1485 27.1825 73.0524 27.733 73.5816C28.3677 74.1906 29.0438 74.4781 29.4066 73.4498C29.7958 72.3462 28.5547 70.1622 28.1881 69.1258C27.303 66.6236 26.426 64.127 25.743 61.5601C25.191 59.486 24.2784 56.9775 24.6014 54.7885C24.9212 52.6215 26.3921 54.1727 27.136 55.1802C28.6702 57.2568 29.5887 59.6781 30.5962 62.0334C31.5228 64.1967 32.6031 66.2595 33.6283 68.3725C33.9848 69.1082 34.455 71.0078 35.3891 71.2263C36.747 71.5446 36.6321 69.6324 36.5021 68.8565C35.6421 63.7139 33.3954 58.7898 32.9296 53.5581C32.907 53.3082 32.5824 51.3641 32.8436 51.2015C33.3495 50.887 34.0325 52.8588 34.251 53.3421C35.3866 55.855 36.1776 58.5048 36.9033 61.1596C37.521 63.4176 38.0791 65.692 38.7721 67.9287C39.1531 69.1578 39.5894 70.3669 40.0194 71.5791C40.4087 72.6777 40.8035 74.5546 41.8186 75.2784C43.2587 76.3048 48.4119 73.8641 48.9342 76.0462C49.3058 77.5974 44.5274 78.8466 43.5098 79.3181C42.1701 79.9383 40.8562 80.6169 39.516 81.2377C38.5009 81.7073 37.0426 81.9 36.3088 82.7833C35.531 83.7199 35.4067 85.0344 35.3835 86.1951C35.3653 87.074 35.9748 89.2435 35.5134 90.0018ZM32.2572 106.941C32.1888 107.428 31.8015 108.074 31.627 108.538C31.2723 109.483 30.9703 110.612 30.4763 111.496C30.0519 112.256 29.4248 112.936 29.0149 113.708C28.6257 114.44 28.5736 115.285 28.1191 116.019C27.5987 116.857 26.7386 117.459 26.222 118.292C25.9678 118.703 25.7047 119.172 25.345 119.61C24.0707 121.16 22.8057 122.622 21.7809 124.282C21.5189 124.708 20.2389 126.563 19.7294 126.663C18.6646 126.873 19.9041 125.36 20.1124 125.046C21.6212 122.782 22.9612 120.399 24.4175 118.1C25.8284 115.874 27.2716 113.665 28.6294 111.405C29.7368 109.563 30.502 106.918 32.3018 105.62C32.3087 106.062 32.2943 106.502 32.2572 106.941ZM81.4557 86.1342C82.3321 89.7363 83.3804 93.2272 84.3685 96.7979C85.2851 100.111 86.5054 103.656 86.8852 107.071C87.2619 110.453 88.1269 113.877 89.2901 117.088C89.8281 118.574 90.3812 120.065 90.965 121.533C91.2858 122.34 91.6442 123.129 92.0083 123.916C92.2908 124.529 93.0378 125.52 93.0661 126.169C93.0893 126.688 93.2695 126.481 92.7572 126.871C92.2262 127.275 91.3059 127.129 90.6875 127.2C89.0748 127.386 87.5023 127.993 85.9298 128.386C82.8977 129.143 79.2831 129.744 76.1763 129.218C74.8693 128.996 73.5115 128.803 72.2189 128.515C70.6288 128.159 70.3018 127.501 69.9753 125.938C69.2616 122.521 68.647 119.114 68.0575 115.675C67.357 111.584 66.5986 107.498 66.0575 103.381C65.5114 99.2173 65.119 95.049 64.2634 90.9303C67.716 91.5072 70.9672 92.1594 74.4305 91.2134C77.4971 90.376 79.7106 88.7388 81.4557 86.1342ZM94.972 130.734C95.7435 132.325 93.8828 133.755 92.9814 134.98C91.7924 136.595 90.6819 138.282 89.2989 139.743C88.884 138.083 88.5199 136.215 87.4131 134.852C85.9988 133.111 84.3491 133.822 82.6165 132.999C84.4332 132.115 86.7528 132.453 88.68 131.665C90.5808 130.888 92.4999 130.277 94.2682 129.268C94.503 129.756 94.7353 130.246 94.972 130.734ZM88.2349 167.846C87.0742 167.91 87.8507 165.463 87.926 164.854C88.1332 163.182 88.3428 161.51 88.5243 159.835C89.4822 162.36 90.4402 164.886 91.3975 167.411C90.3448 167.561 89.2996 167.787 88.2349 167.846ZM86.3466 179.952C86.5048 180.305 87.2437 181.477 86.6605 181.694C85.8613 181.99 85.7653 180.047 86.3466 179.952ZM84.9611 152.745C81.263 155.698 77.59 158.658 73.5881 161.199C72.7117 161.756 71.8285 161.989 71.2472 160.885C70.7908 160.017 71.2729 159.039 71.5661 158.189C72.3131 156.021 73.6144 154.137 75.057 152.374C77.9378 148.851 81.3666 145.843 85.7414 144.454C86.4571 144.227 87.5619 143.541 87.8124 144.488C87.9605 145.045 87.3353 146.436 87.2085 146.958C86.6862 149.116 86.8005 151.278 84.9611 152.745ZM95.6079 174.277C95.6889 176.784 88.835 174.761 87.9806 174.314C88.8771 174.013 95.5708 173.15 95.6079 174.277ZM98.1528 174.293C98.5602 174.401 100.122 174.539 99.5383 175.072C99.016 175.55 96.6518 175.358 96.0247 175.417C96.4459 174.034 96.7655 173.923 98.1528 174.293ZM96.8829 170.935C96.7297 171.492 96.6675 172.343 96.1678 172.725C95.5445 173.202 94.2212 172.912 93.5162 172.916C92.3184 172.922 91.1226 172.984 89.9305 173.102C89.4747 173.148 87.6278 173.704 87.2003 173.325C86.8865 173.046 87.0039 171.738 87.2324 171.444C87.7013 170.839 88.7823 171.048 89.4596 171.024C91.938 170.936 94.4032 170.928 96.8829 170.935ZM95.2921 161.668C94.9418 161.149 94.8797 161.154 94.7303 160.368C94.5708 159.528 94.1653 158.81 93.9267 157.997C93.4019 156.211 95.0787 156.369 96.3091 157.024C99.5 158.724 98.7297 164.664 97.9406 167.444C96.7931 166.601 96.37 166.218 95.9751 164.858C95.8251 164.341 95.6568 163.833 95.5005 163.319C95.3863 162.94 95.466 161.927 95.2921 161.668ZM95.5683 132.761C96.4591 132.653 97.2739 135.417 97.0197 136.015C96.4987 137.239 94.508 138.332 93.4942 139.112C92.8194 139.632 92.1489 140.229 91.4277 140.682C90.7578 141.102 90.3724 140.866 89.7497 141.069C88.8482 141.36 88.6297 142.313 87.7076 142.723C86.41 143.3 84.8368 143.462 83.4809 143.982C81.8362 144.614 80.3289 144.631 78.6045 144.332C76.1242 143.901 73.2171 142.671 73.4406 139.658C73.8348 134.342 84.3943 131.618 87.2738 136.125C88.024 137.299 88.012 138.666 88.4985 139.927C89.0259 141.29 89.5368 140.755 90.3297 139.75C91.3668 138.435 92.3304 137.051 93.3266 135.705C93.6487 135.27 94.9249 132.839 95.5683 132.761ZM30.8548 184.522C30.804 185.426 30.858 186.343 30.5435 187.205C30.2271 188.076 29.5843 188.779 29.2145 189.625C28.4643 191.338 28.47 193.411 28.5001 195.248C28.5698 199.52 29.5817 203.668 30.1166 207.889C28.3356 207.885 26.4944 207.906 24.7676 207.396C23.2256 206.942 22.9795 205.815 22.5434 204.395C21.3188 200.407 19.9961 196.435 19.6007 192.259C19.4127 190.269 19.3335 188.262 19.2435 186.266C19.1649 184.514 19.5584 183.75 21.1399 182.883C24.5773 180.998 28.1404 179.428 31.5429 177.453C31.1951 179.796 30.9873 182.158 30.8548 184.522ZM177.6 44.5523C176.763 44.3985 175.918 44.3025 175.074 44.202C174.633 44.1493 173.26 44.2227 172.93 43.9352C172.538 43.5937 173.217 41.0092 173.252 40.4549C173.465 37.1197 173.217 33.682 172.912 30.3598C172.358 24.3456 170.466 18.7738 166.102 14.4432C163.929 12.2874 161.486 10.5771 158.52 9.75176C156.791 9.27083 155.01 9.0144 153.277 8.54816C151.88 8.17151 150.576 7.74043 149.124 7.59115C146.229 7.29334 143.582 6.19954 140.756 5.56676C138.678 5.10115 135.334 3.99693 133.986 6.34386C132.925 5.09983 131.858 4.16567 130.52 3.23772C129.238 2.34882 129.029 1.46092 127.46 2.4873C124.41 4.48175 121.554 6.91474 118.706 9.18383C116.046 11.3031 113.473 13.5223 110.685 15.4711C107.842 17.459 108.38 20.8324 109.717 23.6291C112.233 28.8929 116.113 33.393 119.51 37.905C121.637 40.7318 123.772 43.5617 125.89 46.3941C127.916 49.101 129.668 52.2341 132.035 54.6661C133.527 56.1991 135.308 54.194 136.656 53.2681C138.327 52.1174 139.97 50.924 141.644 49.7771C145.129 47.3872 148.859 45.1493 152.538 43.0689C152.805 43.8272 153.073 44.5862 153.341 45.3445C152.533 45.4054 151.441 45.2246 151.03 46.0934C150.442 47.3339 151.884 47.4971 152.136 48.2083C152.362 48.8436 151.437 50.5216 151.162 51.0941C150.547 52.3842 149.687 53.4966 148.74 54.5581C144.993 58.7603 140.251 61.766 135.44 64.6311C130.291 67.697 124.773 69.5684 119.136 71.5439C116.27 72.5483 113.295 73.0148 110.337 73.6582C107.487 74.2778 104.639 75.0914 101.727 75.3255C95.7692 75.8032 89.4464 76.1617 83.56 74.8773C82.9159 74.7367 82.2335 74.4322 81.5782 74.3739C81.0527 74.3274 80.6635 74.5477 80.1676 74.576C79.1023 74.6369 78.4921 73.6846 77.6459 74.5697C77.2222 75.0123 77.2146 75.7555 76.6252 74.9294C75.8744 73.8786 77.7928 73.6752 78.5034 73.3757C80.8977 72.3675 82.8211 70.3386 84.3422 68.2871C85.862 66.2369 86.0804 64.0479 85.1551 61.648C84.2304 59.2487 82.1262 57.6222 80.5468 55.6743C79.7828 54.7307 79.0797 53.7326 78.2404 52.8519C77.7928 52.3817 77.0709 51.9316 77.0433 51.457C77.0106 50.9058 77.3408 50.6315 77.1431 49.961C77.0922 49.7872 76.8731 49.688 76.826 49.4965C76.7526 49.1908 76.8668 48.929 76.8286 48.6315C76.7394 47.9491 76.472 47.521 76.0935 46.9616C75.8574 46.6126 75.5121 45.9133 75.1876 45.6515C74.6182 45.1926 73.8423 45.3797 73.2635 44.9145C72.3483 44.1794 72.0262 42.6295 71.2164 41.7368C70.0758 40.4807 69.8328 41.75 68.625 41.3495C67.5917 41.0067 67.6043 39.453 66.7694 38.927C65.5936 38.1869 64.6036 39.5491 63.559 39.8523C62.1855 40.2515 62.7135 38.7022 61.4893 38.561C60.3839 38.4336 58.8521 40.6759 58.301 41.4719C57.7391 40.8172 57.1245 39.7023 56.1139 40.1015C55.053 40.5215 54.8646 42.4738 54.0887 43.1706C53.8188 43.4123 53.8759 43.5912 53.5432 43.7029C53.1138 43.8467 52.5419 43.2233 51.987 43.4135C50.8671 43.7965 51.0039 45.2905 51.0014 46.2585C49.6806 46.0652 48.7591 45.9666 48.3171 47.3904C47.884 48.784 47.7195 48.1688 46.3271 48.6214C45.1262 49.0113 44.958 50.1519 44.7603 51.2668C44.6379 51.9598 44.7508 52.2429 44.9373 52.8751C45.1727 53.6717 45.1727 53.6617 44.7891 54.4219C44.1206 55.7477 44.0804 57.2091 43.9737 58.668C43.8601 60.2255 43.5876 61.6436 44.0302 63.1646C44.3039 64.1056 44.3252 65.3869 45.2468 65.9136C45.6128 66.1226 46.2342 66.0084 46.5456 66.2155C47.1395 66.611 46.9587 67.213 47.3541 67.7912C47.6511 68.2231 48.1288 68.2652 48.4615 68.6154C48.8225 68.9971 48.8438 69.4623 49.0497 69.9281C49.6586 71.3066 50.2312 71.9739 48.2462 72.0524C47.0221 72.1014 45.7163 72.4686 44.4966 72.3556C43.0578 72.2232 42.7 71.419 42.2417 70.1942C39.9334 64.0234 38.693 57.3353 35.6528 51.467C34.9855 50.1789 32.2453 44.9158 31.0871 48.7507C30.1109 51.9849 31.3922 55.9323 31.8831 59.152C30.342 57.7628 29.772 55.2612 28.6012 53.5656C27.7368 52.3126 25.03 49.236 23.4433 50.9987C22.1926 52.3886 22.5052 55.3353 22.736 56.9963C23.1007 59.6247 23.9407 62.1577 24.5407 64.7353C23.7852 63.7472 23.4127 62.5406 22.8885 61.4283C22.2311 60.0334 21.4107 58.7095 20.4759 57.4841C19.6591 56.4125 18.7457 55.4169 17.7555 54.5035C16.9987 53.8048 15.6431 52.2762 14.5681 52.1933C11.8018 51.9812 12.6718 57.0547 13.0932 58.5054C13.9664 61.5118 14.9133 64.4352 15.5913 67.5024C16.9166 73.4944 18.5218 79.3482 19.498 85.4161C19.7142 86.762 19.9746 87.8361 19.4423 89.1293C18.9733 90.2686 18.4867 91.6315 17.6212 92.5072C15.6623 94.4916 14.0359 96.6102 12.5717 99.0007C11.0032 101.561 9.38884 104.151 8.10853 106.869C7.51988 108.12 7.03846 109.472 6.3618 110.675C5.75099 111.761 5.01664 112.619 4.58242 113.821C2.50781 119.564 0.971631 125.208 0.268231 131.289C-0.309368 136.283 0.22881 142.924 6.25847 144.092C9.02832 144.629 11.5153 143.401 14.013 142.387C16.5965 141.339 18.4645 139.635 20.5717 137.824C23.1901 135.574 25.9081 133.463 28.5547 131.25C31.202 129.036 33.6471 126.581 36.2799 124.343C38.8807 122.132 41.2335 119.784 43.4822 117.217C45.7132 114.67 47.5255 111.848 49.6856 109.266C49.6775 112.61 49.1815 115.923 49.0422 119.262C48.9147 122.322 48.9116 125.381 49.0353 128.441C49.1589 131.498 48.351 134.409 48.3441 137.46C48.3372 140.437 48.2192 143.396 48.1539 146.369C48.125 147.703 47.8633 149.2 48.3617 150.486C48.734 151.447 49.9041 151.748 50.9016 152.007C52.444 152.407 57.085 151.636 57.7736 153.283C58.1497 154.182 57.7711 155.82 57.8 156.813C57.849 158.45 57.9092 160.086 57.9651 161.723C58.0229 163.414 58.0794 165.104 58.1409 166.794C58.1961 168.283 58.4855 169.942 58.306 171.417C58.1528 172.68 57.4158 172.515 56.2476 172.58C54.4848 172.677 52.7215 172.755 50.9581 172.832C48.3711 172.946 45.6711 172.894 43.1909 173.199C42.1494 173.327 41.0113 173.273 39.9121 173.481C38.5342 173.744 37.2617 173.81 35.8637 173.879C34.7369 173.935 33.2886 173.854 32.4035 174.686C32.0959 174.976 32.0275 175.32 31.8097 175.642C31.4016 176.244 31.6289 176.085 30.9597 176.221C28.3463 176.75 25.8642 177.347 23.3083 178.238C22.029 178.684 20.8419 179.283 19.5567 179.702C18.4302 180.069 17.6046 180.522 17.0479 181.627C16.0531 183.602 16.3051 186.458 16.3771 188.587C16.4905 191.906 17.2281 195.067 18.0238 198.278C18.8514 201.618 19.5003 205.048 21.1102 208.116C21.6392 209.125 22.2103 210.411 23.2908 210.937C24.6858 211.615 26.8309 211.204 28.3538 211.206C29.3752 211.208 32.1122 211.559 32.8762 210.702C33.6157 209.873 32.8718 207.533 32.767 206.504C32.401 202.896 31.7425 199.255 31.7513 195.624C32.5849 196.855 34.03 198.98 35.4764 197.094C35.8323 196.629 35.6936 196.413 36.3251 196.145C36.6748 195.995 37.4118 195.904 37.7928 195.93C38.3107 195.965 38.5022 196.173 38.978 196.071C39.3992 195.981 39.8732 195.604 40.3559 195.489C46.3428 194.067 52.2946 192.533 58.3072 191.266C59.8967 190.931 59.6707 192.151 59.7756 193.524C59.8917 195.044 59.6707 196.58 59.8817 198.082C60.065 199.39 60.2075 200.664 59.9494 201.98C59.6444 203.531 59.8408 204.825 60.1441 206.361C61.3136 212.286 61.1045 218.712 61.3682 224.733C61.5057 227.87 61.2106 231.072 61.5057 234.191C61.6174 235.369 62.2753 236.02 62.5415 237.092C62.8478 238.322 62.0129 239.889 61.7593 241.081C61.2489 243.474 60.3525 246.899 61.9922 248.982C62.8773 250.107 64.038 250.269 65.3488 250.65C66.9175 251.105 68.4631 251.635 70.0394 252.067C75.7971 253.642 82.0188 253.95 87.9204 254.819C89.3648 255.031 90.7051 255.011 92.1596 254.911C93.056 254.848 95.2639 255.143 96.0096 254.607C96.4089 254.32 96.2061 253.96 96.4095 253.61C96.6977 253.111 97.0467 252.908 97.5376 252.598C98.3505 252.085 99.2909 251.785 99.4278 250.724C99.7636 248.127 96.5175 246.751 94.7818 245.628C92.5639 244.193 89.8846 243.638 87.5305 242.467C86.2317 241.82 84.9787 241.088 83.727 240.354C83.1846 240.036 82.0848 239.676 81.7062 239.176C81.3201 238.665 81.6981 237.935 81.8581 237.205C82.5179 234.188 82.2944 231.103 82.6359 228.054C82.9774 225.001 82.8845 221.928 82.9969 218.859C83.113 215.698 83.3742 212.545 83.5744 209.389C83.759 206.473 83.9448 203.511 83.9762 200.593C84.0051 197.887 84.3742 195.232 84.4614 192.508C84.4909 191.584 84.3252 189.907 84.9385 189.124C85.4771 188.437 87.26 188.524 88.0911 188.403C90.3322 188.078 92.4653 187.792 94.6813 187.597C99.9538 187.13 105.821 186.787 110.806 184.949C112.863 184.192 115.599 183.156 116.281 180.795C117.066 178.082 116.041 174.747 116.007 171.972C115.972 169.011 115.112 166.12 114.468 163.25C113.775 160.16 113.338 157.017 112.589 153.939C111.901 151.115 110.786 148.613 109.731 145.931C109.303 144.844 106.867 141.096 107.623 140.171C108.03 139.674 109.496 139.548 110.091 139.32C111.373 138.829 112.658 138.271 113.84 137.573C115.419 136.64 118.876 135.097 119.035 133.024C119.186 131.043 117.24 129.041 116.25 127.486C114.655 124.979 112.645 122.787 111.126 120.231C108.057 115.064 105.616 109.406 103.378 103.838C102.208 100.925 101.826 98.1821 101.633 95.0729C105.032 95.081 108.491 95.4991 111.869 95.0239C115.545 94.5066 119.225 93.6359 122.869 92.9178C129.504 91.6101 135.874 90.1343 142.02 87.1901C147.776 84.433 153.617 81.4154 158.382 77.0393C160.847 74.7762 163.36 72.4699 165.488 69.8823C167.674 67.2237 169.318 64.2036 171.005 61.2198C172.866 57.9254 174.348 54.4639 175.519 50.8612C175.755 50.1368 175.757 49.214 176.058 48.5298C176.398 47.7576 177.017 47.7369 177.664 47.3301C178.573 46.7576 179.178 44.8417 177.6 44.5523Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M98.4682 7.67925C99.2448 8.34662 102.594 10.6975 103.675 10.1259C105.01 9.42021 102.897 7.2945 102.328 6.77045C101.605 6.10371 99.0175 4.08673 98.0269 4.27393C96.047 4.64845 97.7689 7.07855 98.4682 7.67925Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M100.118 31.8068C100.558 30.943 101.725 30.6254 102.265 29.7894C102.915 28.7844 103.213 27.905 102.974 26.6726C101.311 27.2322 99.4194 28.9259 98.307 30.2504C97.3767 31.3572 96.0559 33.6701 98.4828 33.676C98.4615 33.3467 98.4401 33.0172 98.4188 32.6882C99.1463 32.794 99.7879 32.4579 100.118 31.8068Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M92.1997 17.4344C93.2719 17.7425 94.1564 17.6988 95.2512 17.723C96.0459 17.7407 97.1319 18.1774 97.776 17.6852C97.2048 17.3542 97.9267 17.3359 97.7854 17.0133C97.6668 16.7443 97.4408 16.8324 97.2575 16.6146C96.6034 15.8387 96.034 15.8482 94.9969 15.6868C94.1928 15.5612 93.0107 15.2714 92.2386 15.671C91.4256 16.0916 91.1111 17.1215 92.1997 17.4344Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M107.459 41.2327C108.152 40.6514 108.908 38.9684 109.048 38.0996C109.103 37.7593 108.858 37.4988 108.887 37.2483C108.943 36.7712 109.924 35.8491 108.896 35.4573C107.998 35.1146 107.153 37.7769 106.924 38.3582C106.69 38.9521 106.052 40.1096 106.248 40.6847C106.41 41.1618 106.991 41.6244 107.459 41.2327Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M115.752 5.1941C116.379 4.61205 116.776 3.95196 116.712 3.15157C116.66 2.52112 116.188 0.347387 115.656 0.411292C113.892 0.62429 114.685 6.18527 115.752 5.1941Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M78.4946 102.378C78.3496 101.847 77.8217 98.5971 76.9089 98.8187C76.2153 98.9869 76.9359 101.846 76.9679 102.223C77.0357 103.01 75.5222 102.984 74.8191 102.878C73.7036 102.71 73.7927 102.056 73.6264 101.042C73.5636 100.659 73.3219 98.9273 72.5228 99.5619C71.9829 99.9901 72.369 102.125 72.4136 102.612C72.5693 104.3 72.7526 107.181 73.7557 108.713C74.1556 109.324 74.5159 109.626 74.9359 108.842C75.3609 108.049 74.3985 105.632 74.2303 104.821C75.0244 104.899 77.3101 104.64 77.7878 105.465C78.2247 106.218 77.526 108.369 78.9272 108.543C79.7589 108.647 79.6083 107.684 79.5279 106.944C79.3603 105.391 78.9046 103.878 78.4946 102.378Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M80.6234 101.627C79.7031 102.042 80.8588 108.103 82.2047 107.907C83.7766 107.679 81.5004 101.231 80.6234 101.627Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M79.599 99.6197C79.4854 100.984 81.2588 101.493 81.3429 100.01C81.4076 98.8658 79.7183 98.1853 79.599 99.6197Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M69.8611 63.4389C70.6709 66.4559 78.0414 67.7397 77.0483 63.6706C76.5511 61.6335 74.4745 63.4433 73.0244 63.206C72.0859 63.0528 69.2911 61.3114 69.8611 63.4389Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M68.0123 58.0572C68.3588 56.4433 64.8264 54.6611 63.5451 55.1055C61.67 55.7559 61.6782 59.9141 63.1082 61.0196C63.2966 61.1652 63.8735 61.5124 64.156 61.2355C64.6017 60.798 64.1145 60.9173 64.0103 60.481C63.8452 59.7867 63.3053 58.8946 63.8433 58.1049C64.8603 56.6121 67.5157 60.3705 68.0123 58.0572Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M57.2415 65.8935C55.9684 65.8219 54.9238 67.7981 56.7977 67.633C57.1561 67.601 57.927 67.5106 58.1354 67.1339C58.48 66.5093 57.8014 65.9249 57.2415 65.8935Z"
                        fill="white"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M119.022 18.7806C118.586 18.1501 117.672 17.1357 116.886 17.768C116.19 18.3287 116.311 19.7126 116.578 20.4003C117.298 22.2518 118.997 23.9011 120.92 22.8344C120.252 21.4963 119.876 20.0146 119.022 18.7806Z"
                        fill="white"
                      />
                    </Svg>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'Manrope-ExtraBold',
                        paddingBottom: 10,
                        paddingTop: 20,
                      }}>
                      Successful!
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        // fontWeight: 400,
                        fontFamily: 'Manrope-Regular',
                        textAlign: 'center',
                        paddingHorizontal: 20,
                      }}>
                      Your payment has been received and processed successfully.
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingBottom: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#CB29BE',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 300,
                        borderRadius: 110,
                      }}
                      onPress={() => navigation.navigate('History')}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'Manrope-Regular',
                          fontSize: 14,
                        }}>
                        Go Home
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            </>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
  },
  nameInput: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: 180,
  },
  input: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
  },
});

export default Advertise1Menu;
