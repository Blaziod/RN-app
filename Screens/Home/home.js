/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Headers from '../../Components/Headers/Headers';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import {
  Svg,
  Path,
  Stop,
  RadialGradient,
  Defs,
  ClipPath,
  G,
  Mask,
  Rect,
} from 'react-native-svg';
import {useTheme} from '../../Components/Contexts/colorTheme';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import queryString from 'query-string';
import {ApiLink} from '../../enums/apiLink';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Wait');
      resolve();
    }, timeout);
  });
};
const Home = () => {
  const [userData, setUserData] = useState(null);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [userSocials, setUserSocials] = useState([]);
  const navigation = useNavigation();
  const [link, setLink] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused1, setIsFocused1] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [amount, setAmount] = useState('');
  const [txRef, setTxRef] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const homeScreenUrl = 'https://blaziod.github.io';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal1Visible, setIsModal1Visible] = useState(false);
  const [isXModalVisible, setIsXModalVisible] = useState(false);
  const [isFBModalVisible, setIsFBModalVisible] = useState(false);
  const [isTKModalVisible, setIsTKModalVisible] = useState(false);
  const [isIGModalVisible, setIsIGModalVisible] = useState(false);
  const deviceHeight = Dimensions.get('window').height;

  // const WIDTH = Dimensions.get('screen').width;
  const [refreshing, setRefreshing] = useState(false);
  const [showSection, setShowSection] = useState(true);
  const [showSection1, setShowSection1] = useState(true);
  const {theme} = useTheme();
  const strokeColor = theme === 'dark' ? '#fff' : '#000'; // Choosing color based on theme

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#171717' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
    },
    TextColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamic text color
    },
    Button: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', // Dynamic background color
    },
  });

  const toggleSection = () => {
    setShowSection(!showSection);
  };
  const toggleSection1 = () => {
    setShowSection1(!showSection1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance();
    checkToken();
    fetchUserAccessToken();
    wait(2000).then(() => setRefreshing(false));
    console.log('Waittt');
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
      const response = await axios.post(
        `${ApiLink.ENDPOINT_1}/payment/verify`,
        {reference: txRef, transaction_id: transactionId},
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        Alert.alert('Payment Verified');
        fetchBalance();
        console.log(response.data);
        setAmount('');
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
        checkToken();
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

  const handleCreditWallet = async () => {
    const userToken = userAccessToken?.accessToken;
    console.log('Testing', userToken);
    if (isNaN(amount) || amount === '') {
      Alert.alert('Error', 'Please enter a valid amount.');
      console.log(homeScreenUrl);
      return;
    }

    setIsFocused1(true);
    try {
      if (!homeScreenUrl) {
        Alert.alert('Error', 'Callback URL is not defined.');
        return;
      }
      const response = await axios.post(
        `${ApiLink.ENDPOINT_1}/payment/credit-wallet`,

        {amount: Number(amount)},
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.accessToken}`, // replace userToken with your actual token
            'Content-Type': 'application/json',
            'CALLBACK-URL': homeScreenUrl,
          },
        },
      );

      if (response.data.status === 'success') {
        // Alert.alert('Payment initialized', 'Redirecting to payment page...');
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
        console.log(response.data);
        const url = response.data.authorization_url;
        console.log('URL:', url); // replace with the actual URL you want to redirect to
        setIsModalVisible(false);
        Linking.openURL(url);
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
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing the request.');
      console.error(error.response.data); // log the server's response
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

  const fetchBalance = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await fetch(`${ApiLink.ENDPOINT_1}/show_balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`, // Add the access token to the headers
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Successful', data);
          setUserBalance(data.balance);
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
    if (isFocused && userAccessToken) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, userAccessToken]);

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
    if (isFocused && userAccessToken) {
      fetchSocialLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, userAccessToken, userBalance]);

  const fetchUserAccessToken = () => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        console.log('AccessToken Loading', userAccessToken);

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

  const checkToken = async () => {
    console.log('starting');
    setIsLoading(true);
    try {
      const response = await axios.get(`${ApiLink.ENDPOINT_1}/profile`, {
        headers: {
          Authorization: `Bearer ${userAccessToken?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(response.data.user_profile, 'userData Fetched');
        setIsLoading(false);
        setUserData(response.data.user_profile);
        console.log('User Data:', userData);
      } else if (response.status === 401) {
        console.error('Unauthorized: Access token is invalid or expired.');
        setIsLoading(false);
        await AsyncStorage.removeItem('userbalance');
        await AsyncStorage.removeItem('userdata1');
        await AsyncStorage.removeItem('userdata');
        await AsyncStorage.removeItem('userdata2');
        await AsyncStorage.removeItem('userdatas');
        await AsyncStorage.removeItem('userdatafiles1');
        await AsyncStorage.removeItem('accesstoken');
        navigation.navigate('SignIn');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken, userBalance]);

  if (!userData) {
    return (
      <View style={[dynamicStyles.AppContainer, {justifyContent: 'center'}]}>
        <ActivityIndicator size={50} color="#fff" />
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontFamily: 'Manrope-ExtraBold',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          .....
        </Text>
      </View>
    );
  }

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

  return (
    <SafeAreaView style={dynamicStyles.AppContainer}>
      <ScrollView
        // contentContainerStyle={dynamicStyles.AppContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Headers />
          <View style={{paddingBottom: 20}}>
            <View style={styles.walletBalanceContainer}>
              <Text style={styles.WalletBalance}>Wallet bal:</Text>
              <Text style={styles.WalletAmount}>
                {userData?.wallet?.currency_symbol}
                {isLoading ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  userBalance
                )}
              </Text>
              <View style={styles.WalletButtonsContainer}>
                <TouchableOpacity
                  style={styles.fundButton}
                  onPress={() => setIsModalVisible(true)}>
                  <Svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M9 3V15M15 9L3 9"
                      stroke="black"
                      stroke-linecap="round"
                    />
                  </Svg>

                  <Text style={styles.fundText}>Fund</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.withdrawButton}
                  onPress={() =>
                    navigation.navigate('More', {screen: 'Withdraw'})
                  }>
                  <Svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M15.75 6C15.75 6.27614 15.9739 6.5 16.25 6.5C16.5261 6.5 16.75 6.27614 16.75 6H15.75ZM12.5 1.75C12.2239 1.75 12 1.97386 12 2.25C12 2.52614 12.2239 2.75 12.5 2.75V1.75ZM9.14645 8.64645C8.95118 8.84171 8.95118 9.15829 9.14645 9.35355C9.34171 9.54882 9.65829 9.54882 9.85355 9.35355L9.14645 8.64645ZM16.2091 2.45475L15.7636 2.68174L15.7636 2.68175L16.2091 2.45475ZM16.0452 2.29087L15.8183 2.73638L15.8183 2.73638L16.0452 2.29087ZM9.5 4.25C9.77614 4.25 10 4.02614 10 3.75C10 3.47386 9.77614 3.25 9.5 3.25V4.25ZM15.25 9C15.25 8.72386 15.0261 8.5 14.75 8.5C14.4739 8.5 14.25 8.72386 14.25 9H15.25ZM4.38803 15.423L4.61502 14.9775L4.61502 14.9775L4.38803 15.423ZM3.07698 14.112L2.63148 14.339L3.07698 14.112ZM13.112 15.423L12.885 14.9775L12.885 14.9775L13.112 15.423ZM14.423 14.112L13.9775 13.885L13.9775 13.885L14.423 14.112ZM3.07698 5.38803L2.63148 5.16103L2.63148 5.16103L3.07698 5.38803ZM4.38803 4.07698L4.16103 3.63148L4.16103 3.63148L4.38803 4.07698ZM16.75 6V2.85H15.75V6H16.75ZM15.65 1.75H12.5V2.75H15.65V1.75ZM15.7866 2.00628L9.14645 8.64645L9.85355 9.35355L16.4937 2.71339L15.7866 2.00628ZM16.75 2.85C16.75 2.75324 16.7504 2.6506 16.7432 2.56298C16.7356 2.46953 16.717 2.3501 16.6546 2.22776L15.7636 2.68175C15.7422 2.63962 15.744 2.61281 15.7466 2.64442C15.7478 2.65992 15.7489 2.68287 15.7494 2.71878C15.75 2.75468 15.75 2.79635 15.75 2.85H16.75ZM15.65 2.75C15.7036 2.75 15.7453 2.75001 15.7812 2.75058C15.8171 2.75114 15.8401 2.75218 15.8556 2.75345C15.8872 2.75603 15.8604 2.75784 15.8183 2.73638L16.2722 1.84537C16.1499 1.78303 16.0305 1.76441 15.937 1.75677C15.8494 1.74961 15.7468 1.75 15.65 1.75V2.75ZM16.6546 2.22776C16.6127 2.14544 16.5582 2.07081 16.4937 2.00628L15.7866 2.71339C15.7774 2.70418 15.7696 2.69351 15.7636 2.68174L16.6546 2.22776ZM16.4937 2.00628C16.4292 1.94176 16.3546 1.88731 16.2722 1.84537L15.8183 2.73638C15.8065 2.73038 15.7958 2.7226 15.7866 2.71339L16.4937 2.00628ZM9.95 15.25H7.55V16.25H9.95V15.25ZM3.25 10.95V8.55H2.25V10.95H3.25ZM7.55 4.25H9.5V3.25H7.55V4.25ZM14.25 9V10.95H15.25V9H14.25ZM7.55 15.25C6.70167 15.25 6.09549 15.2496 5.62032 15.2108C5.15099 15.1724 4.85366 15.0991 4.61502 14.9775L4.16103 15.8685C4.56413 16.0739 5.00771 16.1641 5.53889 16.2075C6.06423 16.2504 6.71817 16.25 7.55 16.25V15.25ZM2.25 10.95C2.25 11.7818 2.24961 12.4358 2.29253 12.9611C2.33593 13.4923 2.42609 13.9359 2.63148 14.339L3.52248 13.885C3.40089 13.6463 3.32756 13.349 3.28921 12.8797C3.25039 12.4045 3.25 11.7983 3.25 10.95H2.25ZM4.61502 14.9775C4.14462 14.7378 3.76217 14.3554 3.52248 13.885L2.63148 14.339C2.96703 14.9975 3.50247 15.533 4.16103 15.8685L4.61502 14.9775ZM9.95 16.25C10.7818 16.25 11.4358 16.2504 11.9611 16.2075C12.4923 16.1641 12.9359 16.0739 13.339 15.8685L12.885 14.9775C12.6463 15.0991 12.349 15.1724 11.8797 15.2108C11.4045 15.2496 10.7983 15.25 9.95 15.25V16.25ZM14.25 10.95C14.25 11.7983 14.2496 12.4045 14.2108 12.8797C14.1724 13.349 14.0991 13.6463 13.9775 13.885L14.8685 14.339C15.0739 13.9359 15.1641 13.4923 15.2075 12.9611C15.2504 12.4358 15.25 11.7818 15.25 10.95H14.25ZM13.339 15.8685C13.9975 15.533 14.533 14.9975 14.8685 14.339L13.9775 13.885C13.7378 14.3554 13.3554 14.7378 12.885 14.9775L13.339 15.8685ZM3.25 8.55C3.25 7.70167 3.25039 7.09549 3.28921 6.62032C3.32756 6.15099 3.40089 5.85366 3.52248 5.61502L2.63148 5.16103C2.42609 5.56413 2.33593 6.00771 2.29253 6.53889C2.24961 7.06423 2.25 7.71817 2.25 8.55H3.25ZM7.55 3.25C6.71817 3.25 6.06423 3.24961 5.53889 3.29253C5.00771 3.33593 4.56413 3.42609 4.16103 3.63148L4.61502 4.52248C4.85366 4.40089 5.15099 4.32756 5.62032 4.28921C6.09549 4.25039 6.70167 4.25 7.55 4.25V3.25ZM3.52248 5.61502C3.76217 5.14462 4.14462 4.76217 4.61502 4.52248L4.16103 3.63148C3.50247 3.96703 2.96703 4.50247 2.63148 5.16103L3.52248 5.61502Z"
                      fill="black"
                    />
                  </Svg>

                  <Text style={styles.withdrawText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.TwoContainer}>
            <TouchableOpacity
              style={styles.advert}
              onPress={() =>
                navigation.navigate('Tabs', {screen: 'AdvertisePage'})
              }>
              <View style={styles.AdvertImage1}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M5 12H18M13 6L18.2929 11.2929C18.6834 11.6834 18.6834 12.3166 18.2929 12.7071L13 18"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </Svg>
              </View>

              <Text style={styles.advertText}>Create an Advert</Text>
              <Text style={styles.advertSubText}>
                Get real people to post your ads on their social media account.
              </Text>

              <View style={styles.AdvertImage}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="88"
                  height="82"
                  viewBox="0 0 88 82"
                  fill="none">
                  <G clip-path="url(#clip0_8064_9417)">
                    <Mask
                      id="mask0_8064_9417"
                      style="mask-type:luminance"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="134"
                      height="82">
                      <Path d="M133.371 0H0V81.5522H133.371V0Z" fill="white" />
                    </Mask>
                    <G mask="url(#mask0_8064_9417)">
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M114.376 37.6231C114.265 38.4876 114.344 39.4299 113.368 39.6576C112.465 39.8685 111.474 39.8096 110.554 39.8833C109.519 39.9663 108.487 40.08 107.454 40.1824C106.153 40.3112 106.338 39.811 106.054 38.6995C105.794 37.6845 105.379 36.6712 105.033 35.6813C104.873 35.221 104.681 34.7979 104.462 34.3642C104.264 33.9717 104.359 33.4377 104.145 33.1078C103.416 31.982 99.8618 35.0605 99.5314 34.4536C100.133 33.9855 101.174 33.4617 101.358 32.6605C101.575 31.719 100.977 31.4378 100.225 31.7821C98.3748 32.6296 96.2394 33.2919 94.2217 33.6008C94.8743 33.1646 100.777 29.7269 98.7958 28.7072C98.3493 28.4775 97.7529 28.91 97.3505 29.0737C96.7114 29.3335 96.044 29.5077 95.377 29.6779C94.6741 29.8573 93.9692 30.0299 93.2625 30.193C92.7667 30.3074 91.883 30.7139 91.4 30.6136C90.9097 30.5117 91.7783 30.2073 91.9206 30.1356C92.5407 29.8232 93.1509 29.4875 93.7566 29.1475C94.8305 28.5443 95.8228 27.8457 96.6397 26.9131C97.2564 26.2093 98.2742 24.6727 97.8449 23.6996C97.5965 23.1356 97.0514 22.6143 96.731 22.0799C96.3572 21.4558 96.0554 20.7906 95.7308 20.1404C96.2742 20.3793 96.8843 20.4404 97.439 20.6549C97.9937 20.8694 98.5571 21.0431 99.1342 21.2026C100.292 21.5225 101.446 21.5794 102.594 21.8389C103.893 22.1325 105.246 22.4609 106.565 22.6306C107.714 22.7781 108.747 23.0925 109.732 23.7188C111.742 24.9981 113.137 26.836 113.842 29.1087C114.255 30.4401 114.356 31.8293 114.404 33.2145C114.455 34.6749 114.563 36.1692 114.376 37.6231ZM103.094 37.7306C101.69 38.7539 100.054 39.5532 98.5474 40.4239C97.6854 40.9217 96.8051 41.3869 95.9258 41.8537C95.3019 42.1848 94.5439 42.7943 93.8569 42.9642C93.4224 43.0717 93.4548 43.0799 93.1799 42.6837C92.917 42.3058 92.6875 41.8985 92.4415 41.5088C91.9881 40.7908 91.5302 40.0752 91.0727 39.3596C90.0463 37.7558 89.022 36.1523 87.9436 34.5826C86.8617 33.0073 85.824 31.4031 84.7759 29.8057C84.289 29.063 83.805 28.3174 83.2882 27.5951C82.8933 27.0436 81.8814 26.2024 82.362 25.5531C82.8082 24.9498 83.8249 24.4488 84.4265 23.9922C85.1614 23.4348 85.9008 22.8831 86.6336 22.3228C88.2092 21.1184 89.7438 19.8616 91.318 18.6555C92.6537 20.9984 94.2255 23.1948 95.8111 25.373C94.3775 26.2877 92.929 27.1572 91.4182 27.9403C90.3026 28.5186 88.5954 29.3001 87.8908 30.3972C87.1966 31.4775 87.8784 32.724 89.116 32.7439C89.8561 32.7557 90.5938 32.5597 91.3193 32.4477C91.843 32.3669 92.7995 31.9893 93.2718 32.2555C92.4229 32.797 89.3434 34.3751 91.0034 35.7588C92.19 36.748 94.1962 35.3044 95.4779 35.6017C95.0872 36.3511 94.681 37.547 95.7656 37.9549C96.668 38.2943 97.8494 37.6617 98.6615 37.3261C99.2486 37.0839 99.8315 36.8335 100.409 36.5688C100.868 36.3583 101.417 35.9321 101.907 35.8412C102.48 35.7351 103.645 37.3296 103.094 37.7306ZM76.9979 92.9846C77.801 92.8382 78.2135 92.506 78.4663 93.4811C78.693 94.3545 78.9177 95.1955 79.2095 96.0527C77.955 96.1612 76.8484 96.76 75.9336 97.6024C75.2821 98.203 73.9863 99.6356 74.3074 100.641C75.0878 103.084 79.0293 97.6035 79.4979 97.0178C80.0712 97.8557 80.2821 98.9527 80.567 99.9109C80.7699 100.593 81.5227 101.9 80.5274 102.066C79.1306 102.298 76.5097 102.819 76.6751 104.797C76.8708 107.132 79.8417 107.119 81.5086 107.224C82.4482 107.283 82.4527 108.035 82.5863 108.878C82.6463 109.255 82.8334 109.764 82.5133 110.04C82.229 110.285 81.3591 110.291 80.9891 110.371C79.9113 110.602 78.834 110.838 77.7563 111.069C76.5325 111.332 75.8854 110.964 74.7415 110.629C74.3181 110.505 73.8926 110.557 73.8616 110.083C73.8423 109.792 74.1272 109.342 74.2203 109.055C74.5896 107.916 74.9038 106.744 75.0099 105.549C75.1643 103.812 74.9713 101.208 72.8321 100.869C71.8147 100.707 71.619 100.655 71.1594 99.7C70.6626 98.6674 69.8736 97.711 70.0641 96.5213C70.2022 95.6592 69.9693 94.0282 70.5196 93.3133C70.7742 92.9829 71.27 92.7855 71.6083 92.5429C72.0397 92.2335 72.4552 91.9024 72.8573 91.5561C73.1952 91.265 73.6073 90.6958 73.9908 90.4853C74.459 90.2283 74.4735 90.4033 74.8098 90.805C75.3062 91.398 76.0956 93.1493 76.9979 92.9846ZM79.2681 96.8434C78.9897 97.4054 78.3464 97.9273 77.9368 98.3963C77.5247 98.8679 77.1347 99.3665 76.6747 99.7937C76.169 100.264 74.3719 101.401 74.7677 99.8709C75.0761 98.6812 76.2286 97.7175 77.2432 97.1239C77.44 97.0088 79.7391 95.8932 79.2681 96.8434ZM81.234 102.508C81.4121 103.304 81.5079 104.125 81.6602 104.927C81.7381 105.337 82.1694 106.327 81.9937 106.722C81.6957 107.39 79.0145 106.599 78.4588 106.369C77.1361 105.821 76.5287 104.416 77.7487 103.414C78.2114 103.035 81.0559 101.711 81.234 102.508ZM82.9915 112.071C83.141 112.832 83.5779 113.536 82.8558 114.111C82.2559 114.588 81.2736 114.914 80.5346 115.084C79.5275 115.315 79.2037 114.751 78.6707 114.025C78.0973 113.245 77.4872 112.491 76.8542 111.758C78.8422 111.313 80.8306 110.868 82.8189 110.423C82.8175 110.977 82.8847 111.529 82.9915 112.071ZM78.2276 115.599C77.1909 115.546 76.0752 115.858 75.0237 115.94C73.7103 116.042 72.4011 116.192 71.0867 116.28C71.4233 115.206 72.0283 114.247 72.5014 113.233C72.9761 112.215 73.3093 112.104 74.4011 112.026C75.413 111.953 76.1266 111.605 76.8732 112.463C77.6501 113.356 78.3537 114.326 79.0631 115.272C78.8219 115.433 78.5335 115.616 78.2276 115.599ZM70.8162 115.819C70.5602 116.005 69.7716 115.475 69.5056 115.373C68.9884 115.173 68.8737 115.109 68.6039 114.604C68.3721 114.171 68.0031 113.678 67.9304 113.183C67.8346 112.531 68.1233 111.671 68.2284 111.023C68.5085 111.698 69.4274 111.776 70.0482 111.887C70.5178 111.97 71.9094 111.837 72.2636 112.172C72.6547 112.541 71.9346 113.571 71.7468 113.959C71.5229 114.422 71.2462 115.506 70.8162 115.819ZM70.3149 116.354C70.0072 116.404 69.1211 116.71 69.1387 116.148C69.1586 115.506 70.3776 116.199 70.3149 116.354ZM68.7535 116.321C68.6973 116.861 67.5335 116.816 67.5069 116.34C67.4614 115.537 68.843 115.457 68.7535 116.321ZM67.4229 101.737C67.1252 102.584 65.3129 102.888 64.6169 103.148C63.9813 103.387 62.0822 104.487 61.4269 104.088C63.6453 102.563 65.9189 101.069 67.7987 99.1225C67.8756 99.6035 67.7584 100.005 67.6168 100.46C67.4887 100.871 67.5545 101.362 67.4229 101.737ZM66.8709 104.827C66.5519 106.903 66.2383 109.006 65.8063 111.06C64.9832 110.809 64.3044 110.299 63.4393 110.121C62.65 109.959 61.8348 109.956 61.0389 110.074C59.3431 110.326 57.8312 111.165 56.3518 111.982C56.215 110.558 55.9318 109.035 55.9656 107.607C55.9931 106.421 58.0238 106.069 58.9451 105.579C59.5023 105.283 60.0063 104.866 60.641 104.762C61.2946 104.655 61.9247 104.659 62.5704 104.46C64.096 103.989 65.532 103.243 67.027 102.687C67.1489 103.399 66.9794 104.125 66.8709 104.827ZM65.4452 113.611C65.3773 114.083 65.4631 114.925 65.1034 115.284C64.7647 115.623 64.0416 115.634 63.595 115.726C62.2348 116.006 60.8756 116.288 59.5174 116.577C58.9097 116.706 58.3019 116.829 57.6917 116.945C57.4006 117 56.6705 117.279 56.4255 117.047C56.193 116.827 56.3659 116.125 56.3783 115.83C56.4035 115.241 56.4369 114.651 56.3997 114.062C56.3291 112.932 56.3918 112.5 57.4433 111.916C58.5606 111.294 59.7145 110.869 60.9721 110.639C62.2451 110.406 63.4579 110.534 64.6697 111.022C65.007 111.158 65.5127 111.326 65.6698 111.689C65.8831 112.184 65.5172 113.11 65.4452 113.611ZM63.9137 131.82C63.4152 132.133 62.3302 132.079 61.7576 132.143C60.8325 132.245 59.9019 132.187 58.983 132.044C58.2916 131.937 57.2593 131.788 56.7291 131.302C55.9759 130.613 56.8452 130.581 57.4216 130.63C59.0971 130.77 60.7939 130.672 62.468 130.551C62.794 130.528 63.6701 130.241 63.9844 130.375C64.3861 130.547 64.2631 131.601 63.9137 131.82ZM62.9638 142.968C59.8416 142.664 58.0318 140.08 56.8993 137.437C56.2919 136.018 56.511 134.53 56.451 133.03C56.44 132.756 56.2681 132.076 56.5496 131.871C56.8145 131.679 57.8853 132.273 58.1751 132.344C59.6601 132.708 61.3025 132.743 62.7905 132.389C63.4352 132.236 63.7962 131.952 64.0012 132.59C64.1659 133.105 63.8955 134.053 63.8658 134.592C63.8149 135.525 63.9609 143.064 62.9638 142.968ZM56.727 142.971C56.7149 142.518 56.4865 137.942 56.7081 137.929C57.3668 139.349 58.0435 140.62 59.2425 141.665C59.8551 142.199 60.5438 142.68 61.3097 142.967C61.5977 143.075 63.2284 143.157 63.3084 143.514C63.4483 144.138 62.3347 143.886 62.0046 143.835C61.7397 143.794 61.5013 143.682 61.2411 143.634C60.746 143.545 60.2782 143.665 59.7807 143.675C59.0251 143.691 58.2833 143.611 57.527 143.677C56.8362 143.736 56.7453 143.657 56.727 142.971ZM57.1877 122.448C59.8606 121.584 62.0942 123.22 63.5048 125.361C64.3089 126.582 64.4888 127.436 64.3482 128.881C64.2976 129.399 64.3906 129.749 63.9148 129.96C63.4438 130.169 62.3736 130.014 61.8641 130.038C60.3984 130.107 58.9383 130.197 57.4726 130.111C56.5206 130.054 56.3859 129.893 56.4025 128.969C56.4221 127.857 56.3298 126.749 56.2667 125.635C56.1985 124.43 55.7847 122.902 57.1877 122.448ZM56.3132 120.846C56.3149 120.029 56.2657 119.19 56.3156 118.374C56.3656 117.565 56.7098 117.605 57.4736 117.467C59.1278 117.168 60.7802 116.834 62.4119 116.428C63.0572 116.268 63.7866 115.96 64.4591 115.958C65.1648 115.955 65.1272 116.318 65.0803 116.942C64.9756 118.326 64.722 119.689 64.6448 121.066C64.5618 122.551 64.5181 124.055 64.5246 125.542C64.527 126.044 64.649 126.416 64.2211 125.947C63.7925 125.476 63.583 124.726 63.2002 124.197C62.4164 123.114 61.2518 122.243 59.9591 121.877C59.2442 121.674 58.4928 121.639 57.7641 121.786C57.5429 121.83 56.4355 122.359 56.2946 122.254C56.1992 122.184 56.3132 120.879 56.3132 120.846ZM66.0909 149.172C67.151 149.931 68.3249 150.544 69.5132 151.076C70.1819 151.376 72.8287 152.006 72.9131 152.68C72.9582 153.04 72.5196 153.443 72.2323 153.486C71.8677 153.54 71.2672 153.302 70.8961 153.256C69.5462 153.093 68.1991 153.092 66.8819 152.716C64.2521 151.965 61.5257 151.754 58.8687 151.1C58.2364 150.945 57.6025 150.798 56.9671 150.658C56.3635 150.524 56.0931 150.547 56.072 149.902C56.0248 148.486 56.431 147.036 56.4341 145.603C58.5837 145.848 60.7405 145.845 62.896 146.047C63.8197 146.133 63.7983 146.308 64.2028 147.115C64.6231 147.953 65.3377 148.633 66.0909 149.172ZM55.61 103.186C55.5828 102.662 55.5614 102.137 55.5142 101.614C55.4822 101.263 55.1614 100.282 55.3423 100.008C55.5573 99.6838 55.7737 99.8819 56.1582 99.8729C56.665 99.8609 57.0891 99.6573 57.507 99.3906C58.2984 98.8858 58.8869 98.2216 59.4006 97.4464C59.8523 96.7638 59.7682 95.8315 59.7627 95.0146C59.7486 92.9016 59.9026 90.8409 59.7734 88.7185C59.7142 87.7438 60.5466 88.3416 61.2184 88.4677C62.3178 88.6741 63.5127 88.5314 64.63 88.5338C64.5883 88.794 62.3037 89.4389 61.9347 89.6843C60.9896 90.3127 60.4387 91.3177 60.5249 92.4637C60.6985 94.7693 63.2378 95.1545 65.0934 95.159C63.554 96.5202 62.0419 97.8178 60.8318 99.4967C59.9398 100.735 58.3684 103.176 59.8268 104.546C58.5376 105.278 57.26 106.092 55.8016 106.444C55.7365 105.358 55.6665 104.273 55.61 103.186ZM55.0246 61.101C55.5494 61.4383 55.7702 60.9615 56.1699 60.7148C56.7322 60.3671 56.9186 60.4013 56.9899 59.6247C57.1218 58.1842 56.5158 56.8801 55.7547 55.7014C55.4091 55.1656 55.0639 54.5276 54.5757 54.1086C54.1306 53.7269 53.6809 53.8581 53.2685 53.4636C53.1066 53.3082 53.1414 53.0895 52.8737 53.0957C52.6973 53.0998 52.269 53.6455 52.1236 53.7661C51.6637 54.1465 51.1014 54.4363 50.4988 54.1224C49.6216 53.6655 49.9034 52.008 50.5846 51.4708C51.1093 51.0574 51.7295 51.1211 52.3269 51.0546C52.7748 51.0047 52.8678 51.0243 52.6835 50.5116C52.5546 50.1526 52.257 49.8725 52.1098 49.5218C51.827 48.8475 51.8887 48.0285 51.7667 47.315C51.6571 46.6759 51.4008 45.9844 51.4101 45.3353C51.4222 44.5087 51.6923 44.2941 52.4086 44.0622C53.1025 43.8379 53.6772 43.3432 54.268 42.9273C54.9371 42.4567 55.67 42.1459 56.3573 41.7159C56.8242 41.4241 57.1253 40.8342 57.6387 41.1099C58.2485 41.4372 58.8935 42.3853 59.412 42.8698C58.653 43.3511 58.4766 43.5619 58.5813 44.5046C58.6771 45.369 58.8532 46.1391 59.514 46.7413C59.7679 46.9729 60.2416 47.1579 60.4384 47.4249C60.6678 47.7357 60.5187 47.4618 60.4897 47.8125C60.4742 48.0017 60.3243 48.1254 60.3571 48.3441C60.5028 49.3157 61.6188 48.7424 62.0787 48.4048C63.7222 47.1992 60.6537 46.2418 59.925 45.8025C59.4216 45.4989 59.1729 44.5304 59.9701 44.7878C60.5004 44.959 61.6987 46.4099 61.8203 45.0872C63.1358 45.8511 63.9472 47.4738 65.05 48.5002C65.8452 49.2403 66.9136 50.061 66.2824 51.2427C65.4779 52.7494 63.8827 53.4333 62.4267 54.0831C61.0141 54.7136 61.3076 56.4976 62.0625 57.5895C62.4991 58.221 63.071 58.5907 63.759 58.8973C64.4619 59.2109 64.6076 59.5792 64.7613 60.3062C64.9318 61.1127 64.7506 61.438 64.0522 61.8545C63.37 62.2614 62.6572 62.6556 61.9288 62.9743C60.3546 63.663 58.7212 63.7064 57.0467 63.9414C56.4596 64.0237 55.897 64.195 55.5766 63.613C55.2165 62.9584 55.19 61.8311 55.0246 61.101ZM54.7714 57.9681C54.3773 57.7604 53.426 58.4501 52.9278 58.4804C52.1219 58.529 51.5927 58.5108 50.8774 58.938C49.5251 59.7459 48.4026 60.7864 47.3184 61.9145C46.097 63.1851 44.8825 64.4623 43.6649 65.7364C43.1133 66.3139 42.5586 66.8882 41.9983 67.4567C41.5566 67.9046 41.1246 68.5348 40.5781 68.8548C40.6064 68.4748 40.8393 68.2061 40.922 67.854C40.9702 67.6483 40.8862 67.4732 40.9172 67.2762C40.9275 67.2124 41.0994 66.9899 41.1253 66.9168C41.1952 66.7242 41.2807 66.534 41.3634 66.3342C41.4405 66.1475 41.4295 65.9538 41.5077 65.7588C41.5883 65.558 41.8092 65.425 41.8857 65.2269C42.1103 64.6473 41.7386 64.3789 41.1442 64.3924C41.3768 63.233 41.4784 62.6659 42.6909 62.2573C43.8492 61.8666 44.9807 61.4283 46.0449 60.8178C46.9897 60.2758 47.7776 59.4951 48.6858 58.8911C49.4989 58.3502 50.5112 57.7838 50.5029 56.6747C50.9639 56.9876 51.396 57.2505 51.9231 56.9393C52.3683 56.6764 52.4272 56.4649 52.9419 56.4153C53.3619 56.375 53.622 56.3643 53.9969 56.549C54.4379 56.7664 54.4982 56.9173 54.7552 56.2778C55.047 56.5235 55.7854 57.5471 55.7606 57.9519C55.7471 58.1752 55.7134 58.2758 55.4367 58.3347C55.0446 58.4181 55.0598 58.1197 54.7714 57.9681ZM52.9336 118.537C52.7421 118.831 51.9334 118.777 51.6213 118.773C50.6697 118.761 50.3369 117.962 49.9193 117.19C49.2612 115.974 48.2772 113.446 49.357 112.17C50.2097 111.162 51.8701 112.431 52.4516 113.192C52.9536 113.85 52.8044 114.836 52.8509 115.625C52.8906 116.29 53.3126 117.957 52.9336 118.537ZM50.3338 118.978C49.9534 119.358 48.7182 119.278 48.2142 119.359C47.3146 119.505 46.4195 119.68 45.5467 119.946C44.8966 120.144 44.2544 120.675 44.0828 119.77C43.9391 119.008 44.0108 118.095 44.0246 117.326C44.0394 116.497 44.1259 115.678 44.1982 114.853C44.2468 114.295 44.1248 113.268 44.5807 112.839C44.9734 112.47 45.9285 112.434 46.4384 112.312C47.276 112.111 48.1508 111.847 49.0214 111.937C48.5136 113.315 48.4705 114.761 49.0149 116.134C49.1702 116.526 50.5687 118.743 50.3338 118.978ZM43.934 113.487C43.7221 115.56 43.5084 117.646 43.7128 119.73C43.7252 119.854 43.8737 120.424 43.8089 120.513C43.7424 120.605 43.2139 120.653 43.094 120.681C42.6171 120.794 42.1413 120.914 41.6617 121.014C40.7284 121.209 40.6064 120.619 40.4235 119.755C40.031 117.901 40.7918 115.892 41.2524 114.112C41.477 113.245 41.6435 113.145 42.4959 113.074C43.0891 113.024 44.0242 112.606 43.934 113.487ZM40.3294 121.222C39.9728 121.546 39.6162 120.015 39.5845 119.86C39.4601 119.24 39.5294 118.612 39.5311 117.983C39.5342 117 39.4591 116.022 39.4577 115.044C39.4567 114.515 39.0605 113.433 39.6865 113.153C39.8701 113.071 40.6002 113.105 40.7656 113.213C41.1098 113.438 40.974 113.584 40.872 113.974C40.644 114.851 40.4465 115.733 40.2477 116.617C40.0527 117.484 39.8605 118.318 39.9535 119.214C39.9838 119.51 40.5568 121.015 40.3294 121.222ZM51.7057 111.562C52.5753 111.317 52.6218 111.983 52.6205 112.621C52.4878 112.519 51.2523 111.69 51.7057 111.562ZM40.0737 64.7645C39.8608 65.1156 38.5113 65.2114 38.1257 65.3037C37.3671 65.4856 36.608 65.6658 35.8511 65.8553C34.4334 66.2095 33.0506 66.6095 31.5973 66.7949C32.3953 65.5173 32.6436 64.4141 32.4951 62.8199C32.3079 60.8068 32.0697 58.8143 31.6062 56.8439C31.1493 54.901 30.6204 52.9709 30.1109 51.0412C29.8606 50.093 29.5899 49.1628 29.257 48.2404C28.9901 47.5007 28.5733 46.5701 29.0263 45.8118C30.1758 46.6504 31.0978 47.5538 31.7535 48.8279C32.456 50.1933 33.0692 51.5952 33.8844 52.9017C34.2572 53.4988 34.6924 54.0435 35.0914 54.6216C35.3284 54.9658 35.5014 55.462 35.8035 55.7524C36.1519 56.0866 36.5229 56.2444 36.7221 55.68C36.9357 55.0743 36.2545 53.8757 36.0533 53.3069C35.5675 51.9335 35.0862 50.5633 34.7114 49.1545C34.4084 48.0161 33.9075 46.6394 34.0848 45.438C34.2603 44.2486 35.0676 45.1 35.4759 45.6529C36.3179 46.7927 36.822 48.1216 37.375 49.4143C37.8835 50.6015 38.4765 51.7337 39.0391 52.8934C39.2348 53.2972 39.4929 54.3398 40.0055 54.4597C40.7508 54.6344 40.6877 53.5849 40.6164 53.1591C40.1444 50.3366 38.9113 47.634 38.6556 44.7627C38.6432 44.6255 38.4651 43.5585 38.6084 43.4693C38.8861 43.2966 39.261 44.3788 39.3809 44.6441C40.0042 46.0233 40.4383 47.4776 40.8366 48.9347C41.1756 50.174 41.4819 51.4222 41.8622 52.6498C42.0714 53.3244 42.3108 53.988 42.5468 54.6533C42.7605 55.2563 42.9772 56.2864 43.5343 56.6837C44.3247 57.247 47.153 55.9074 47.4396 57.1051C47.6436 57.9564 45.021 58.642 44.4625 58.9008C43.7272 59.2412 43.0061 59.6136 42.2705 59.9544C41.7134 60.2121 40.913 60.3179 40.5103 60.8026C40.0834 61.3167 40.0152 62.0382 40.0024 62.6752C39.9924 63.1576 40.327 64.3483 40.0737 64.7645ZM38.2866 74.0615C38.2491 74.3289 38.0365 74.6831 37.9407 74.9377C37.746 75.4565 37.5803 76.0764 37.3092 76.5611C37.0763 76.9784 36.7321 77.3515 36.5071 77.7753C36.2935 78.1774 36.2649 78.6408 36.0154 79.0435C35.7298 79.5035 35.2578 79.8342 34.9742 80.2915C34.8347 80.5168 34.6903 80.7741 34.4929 81.0146C33.7935 81.8653 33.0992 82.6677 32.5368 83.579C32.393 83.8126 31.6905 84.8307 31.4108 84.8859C30.8264 85.0009 31.5067 84.1703 31.621 83.9983C32.4491 82.7556 33.1846 81.4477 33.9839 80.1857C34.7582 78.9639 35.5503 77.7519 36.2955 76.5115C36.9033 75.5003 37.3233 74.0488 38.3111 73.3366C38.3149 73.5788 38.307 73.8203 38.2866 74.0615ZM65.2888 62.6418C65.7698 64.6187 66.3451 66.5347 66.8874 68.4945C67.3905 70.3126 68.0602 72.2582 68.2687 74.1325C68.4754 75.9892 68.9502 77.868 69.5886 79.6303C69.8839 80.4458 70.1874 81.2644 70.5079 82.0703C70.6839 82.513 70.8806 82.9458 71.0805 83.3782C71.2355 83.7144 71.6455 84.2585 71.661 84.6144C71.6738 84.8993 71.7727 84.7856 71.4915 84.9996C71.2 85.2218 70.6949 85.1412 70.3556 85.1801C69.4704 85.2824 68.6074 85.6156 67.7443 85.8313C66.0802 86.2468 64.0963 86.5769 62.3912 86.2878C61.6739 86.1658 60.9286 86.0604 60.2192 85.9019C59.3465 85.7066 59.167 85.3455 58.9879 84.4876C58.5961 82.6126 58.2588 80.7425 57.9353 78.8551C57.5508 76.6097 57.1346 74.3671 56.8376 72.1076C56.5379 69.8223 56.3225 67.5346 55.8529 65.2741C57.7479 65.5907 59.5322 65.9487 61.4331 65.4294C63.1161 64.9698 64.331 64.0713 65.2888 62.6418ZM72.707 87.1199C73.1305 87.9929 72.1093 88.7778 71.6145 89.4503C70.962 90.3365 70.3525 91.2626 69.5934 92.0643C69.3657 91.1534 69.1659 90.1284 68.5585 89.38C67.7822 88.4246 66.8768 88.815 65.9258 88.363C66.9229 87.8782 68.196 88.0632 69.2537 87.6308C70.297 87.2043 71.3503 86.8694 72.3208 86.3154C72.4497 86.5834 72.5772 86.8522 72.707 87.1199ZM69.0095 107.489C68.3724 107.524 68.7986 106.18 68.8399 105.847C68.9536 104.929 69.0687 104.011 69.1683 103.092C69.694 104.478 70.2198 105.864 70.7452 107.25C70.1674 107.332 69.5938 107.456 69.0095 107.489ZM67.9731 114.133C68.0599 114.326 68.4654 114.97 68.1454 115.089C67.7068 115.251 67.654 114.185 67.9731 114.133ZM67.2127 99.2008C65.183 100.821 63.1671 102.446 60.9707 103.841C60.4897 104.146 60.0049 104.274 59.6859 103.668C59.4354 103.192 59.7 102.655 59.8609 102.188C60.2709 100.999 60.9852 99.9646 61.7769 98.9968C63.358 97.0636 65.2399 95.4122 67.6409 94.6501C68.0337 94.5254 68.6401 94.1491 68.7776 94.6687C68.8589 94.9743 68.5157 95.7378 68.4461 96.0245C68.1595 97.209 68.2222 98.3956 67.2127 99.2008ZM73.0561 111.018C73.1005 112.394 69.3388 111.284 68.8699 111.038C69.3619 110.873 73.0357 110.4 73.0561 111.018ZM74.4528 111.027C74.6764 111.086 75.5336 111.162 75.2132 111.455C74.9266 111.717 73.629 111.612 73.2848 111.644C73.516 110.885 73.6914 110.824 74.4528 111.027ZM73.7558 109.184C73.6717 109.49 73.6376 109.957 73.3634 110.166C73.0213 110.428 72.295 110.269 71.9081 110.271C71.2507 110.275 70.5943 110.308 69.9401 110.373C69.6899 110.398 68.6763 110.704 68.4417 110.495C68.2694 110.342 68.3338 109.624 68.4592 109.463C68.7166 109.131 69.3099 109.246 69.6816 109.233C71.0419 109.184 72.3949 109.18 73.7558 109.184ZM72.8828 104.098C72.6905 103.813 72.6564 103.815 72.5744 103.384C72.4869 102.923 72.2643 102.529 72.1334 102.083C71.8453 101.103 72.7656 101.19 73.4409 101.549C75.1922 102.482 74.7695 105.742 74.3364 107.268C73.7066 106.805 73.4743 106.595 73.2576 105.849C73.1753 105.565 73.0829 105.286 72.9971 105.004C72.9344 104.796 72.9782 104.24 72.8828 104.098ZM73.0344 88.2324C73.5233 88.1731 73.9705 89.6901 73.8309 90.0185C73.545 90.69 72.4524 91.2898 71.896 91.7184C71.5256 92.0037 71.1577 92.331 70.7618 92.5798C70.3942 92.8106 70.1826 92.6811 69.8408 92.792C69.3461 92.9519 69.2262 93.4752 68.72 93.7002C68.0079 94.0168 67.1445 94.1054 66.4003 94.391C65.4976 94.7379 64.6703 94.7473 63.7239 94.5829C62.3626 94.3465 60.7671 93.6716 60.8897 92.0178C61.1061 89.0999 66.9016 87.605 68.482 90.0788C68.8937 90.723 68.8871 91.4734 69.1542 92.1653C69.4436 92.9136 69.724 92.6197 70.1592 92.0681C70.7284 91.3467 71.2572 90.587 71.804 89.8483C71.9808 89.6095 72.6812 88.2751 73.0344 88.2324ZM37.5169 116.641C37.489 117.137 37.5186 117.64 37.346 118.114C37.1724 118.591 36.8196 118.978 36.6166 119.442C36.2049 120.382 36.208 121.52 36.2246 122.528C36.2628 124.872 36.8182 127.149 37.1117 129.466C36.1343 129.464 35.1238 129.475 34.176 129.195C33.3297 128.946 33.1946 128.327 32.9553 127.548C32.2831 125.359 31.5572 123.18 31.3402 120.887C31.237 119.795 31.1935 118.694 31.1442 117.598C31.101 116.636 31.317 116.217 32.185 115.741C34.0715 114.707 36.0271 113.845 37.8945 112.761C37.7037 114.047 37.5896 115.343 37.5169 116.641ZM118.057 39.8199C117.597 39.7355 117.134 39.6828 116.67 39.6277C116.428 39.5987 115.675 39.639 115.494 39.4812C115.278 39.2938 115.651 37.8753 115.67 37.5711C115.787 35.7406 115.651 33.8538 115.484 32.0305C115.18 28.7296 114.141 25.6716 111.746 23.2948C110.554 22.1116 109.213 21.1729 107.585 20.7199C106.636 20.456 105.658 20.3153 104.707 20.0594C103.94 19.8526 103.225 19.616 102.428 19.5341C100.839 19.3707 99.386 18.7703 97.8353 18.423C96.6945 18.1675 94.8591 17.5615 94.1194 18.8495C93.5371 18.1668 92.9514 17.6541 92.2172 17.1448C91.5137 16.6569 91.3989 16.1696 90.5376 16.7329C88.8638 17.8275 87.2965 19.1629 85.7334 20.4082C84.2732 21.5714 82.8609 22.7894 81.3308 23.859C79.7704 24.95 80.066 26.8015 80.7999 28.3364C82.1808 31.2254 84.3101 33.6952 86.1744 36.1716C87.342 37.723 88.5134 39.2762 89.6762 40.8308C90.7881 42.3164 91.7497 44.036 93.0486 45.3708C93.8679 46.2121 94.8454 45.1117 95.5847 44.6035C96.5022 43.9719 97.4035 43.317 98.3224 42.6875C100.235 41.3758 102.282 40.1476 104.302 39.0058C104.448 39.422 104.595 39.8385 104.742 40.2547C104.299 40.2881 103.699 40.1889 103.474 40.6658C103.151 41.3466 103.943 41.4361 104.081 41.8265C104.205 42.1752 103.697 43.0961 103.547 43.4103C103.209 44.1184 102.737 44.7289 102.217 45.3115C100.161 47.6178 97.5579 49.2675 94.9174 50.84C92.0915 52.5227 89.063 53.5498 85.9694 54.634C84.3962 55.1853 82.7634 55.4413 81.14 55.7944C79.5758 56.1345 78.0129 56.581 76.4146 56.7095C73.1446 56.9717 69.6744 57.1685 66.4437 56.4635C66.0902 56.3863 65.7157 56.2192 65.356 56.1872C65.0676 56.1617 64.854 56.2826 64.5818 56.2981C63.9971 56.3316 63.6622 55.8089 63.1978 56.2947C62.9652 56.5376 62.9611 56.9455 62.6376 56.4921C62.2255 55.9154 63.2784 55.8037 63.6684 55.6394C64.9825 55.0861 66.0382 53.9725 66.873 52.8466C67.7071 51.7213 67.827 50.5199 67.3191 49.2027C66.8116 47.8859 65.6568 46.9932 64.7899 45.9241C64.3706 45.4063 63.9847 44.8584 63.5241 44.375C63.2784 44.117 62.8822 43.87 62.867 43.6095C62.8491 43.307 63.0303 43.1564 62.9218 42.7885C62.8939 42.693 62.7737 42.6386 62.7478 42.5335C62.7075 42.3657 62.7702 42.222 62.7492 42.0587C62.7003 41.6842 62.5535 41.4492 62.3457 41.1422C62.2162 40.9507 62.0267 40.5669 61.8486 40.4232C61.5361 40.1713 61.1102 40.274 60.7926 40.0187C60.2902 39.6153 60.1135 38.7646 59.669 38.2747C59.043 37.5852 58.9097 38.2819 58.2468 38.0621C57.6797 37.874 57.6865 37.0212 57.2283 36.7325C56.583 36.3263 56.0397 37.0739 55.4663 37.2404C54.7125 37.4595 55.0023 36.6092 54.3304 36.5316C53.7237 36.4617 52.883 37.6924 52.5805 38.1293C52.2721 37.7699 51.9348 37.158 51.3801 37.3771C50.7978 37.6076 50.6945 38.6791 50.2686 39.0616C50.1205 39.1942 50.1518 39.2924 49.9692 39.3537C49.7336 39.4326 49.4197 39.0905 49.1151 39.1949C48.5005 39.4051 48.5756 40.2251 48.5742 40.7564C47.8493 40.6502 47.3435 40.5962 47.1009 41.3776C46.8632 42.1424 46.7729 41.8048 46.0088 42.0532C45.3497 42.2672 45.2573 42.8932 45.1488 43.5051C45.0816 43.8855 45.1436 44.0408 45.246 44.3878C45.3752 44.825 45.3752 44.8195 45.1646 45.2367C44.7977 45.9644 44.7757 46.7665 44.7171 47.5672C44.6547 48.422 44.5052 49.2003 44.7481 50.0351C44.8983 50.5516 44.91 51.2548 45.4158 51.5439C45.6167 51.6586 45.9578 51.5959 46.1287 51.7096C46.4546 51.9266 46.3554 52.2571 46.5724 52.5744C46.7354 52.8114 46.9976 52.8345 47.1802 53.0268C47.3783 53.2362 47.39 53.4915 47.503 53.7472C47.8372 54.5038 48.1514 54.87 47.062 54.9131C46.3902 54.94 45.6735 55.1415 45.0041 55.0795C44.2144 55.0068 44.018 54.5655 43.7665 53.8933C42.4996 50.5065 41.8188 46.8357 40.1502 43.615C39.784 42.908 38.2801 40.0194 37.6444 42.1242C37.1086 43.8992 37.8119 46.0657 38.0813 47.8328C37.2354 47.0704 36.9226 45.6974 36.28 44.7668C35.8056 44.0791 34.32 42.3905 33.4492 43.358C32.7627 44.1208 32.9343 45.738 33.061 46.6497C33.2612 48.0923 33.7221 49.4825 34.0515 50.8972C33.6368 50.3549 33.4324 49.6927 33.1447 49.0821C32.7839 48.3166 32.3336 47.5899 31.8205 46.9174C31.3722 46.3293 30.871 45.7828 30.3275 45.2815C29.9121 44.8981 29.1681 44.0591 28.5781 44.0136C27.0598 43.8972 27.5373 46.6817 27.7686 47.478C28.2479 49.128 28.7675 50.7325 29.1396 52.4159C29.867 55.7045 30.7481 58.9173 31.2838 62.2476C31.4025 62.9863 31.5454 63.5758 31.2533 64.2856C30.9959 64.9109 30.7288 65.6589 30.2538 66.1395C29.1787 67.2286 28.286 68.3914 27.4824 69.7034C26.6216 71.1088 25.7355 72.53 25.0328 74.0219C24.7097 74.7082 24.4455 75.4507 24.0741 76.1108C23.7389 76.7069 23.3359 77.1775 23.0975 77.8373C21.9589 80.9895 21.1158 84.0869 20.7297 87.4248C20.4127 90.1652 20.7081 93.8104 24.0174 94.4516C25.5376 94.7462 26.9026 94.0723 28.2734 93.5159C29.6914 92.9405 30.7166 92.0054 31.8731 91.0114C33.3102 89.7763 34.802 88.6176 36.2545 87.4031C37.7075 86.1879 39.0494 84.8404 40.4944 83.6121C41.9218 82.3987 43.2132 81.1101 44.4473 79.7013C45.6718 78.3035 46.6665 76.7548 47.852 75.3377C47.8476 77.1727 47.5754 78.9908 47.4989 80.8234C47.429 82.5034 47.4272 84.182 47.4951 85.8613C47.563 87.5395 47.1196 89.1371 47.1158 90.8116C47.112 92.4454 47.0472 94.0695 47.0114 95.7013C46.9955 96.4334 46.8519 97.2548 47.1254 97.9608C47.3297 98.4883 47.9719 98.6533 48.5194 98.7952C49.3659 99.015 51.9131 98.592 52.2911 99.496C52.4975 99.9894 52.2897 100.888 52.3055 101.433C52.3324 102.332 52.3655 103.23 52.3962 104.128C52.4279 105.056 52.4589 105.984 52.4926 106.911C52.5229 107.728 52.6818 108.639 52.5832 109.448C52.4992 110.142 52.0947 110.051 51.4535 110.087C50.486 110.14 49.5182 110.183 48.5504 110.225C47.1306 110.288 45.6487 110.259 44.2875 110.427C43.7159 110.497 43.0912 110.467 42.4879 110.582C41.7317 110.726 41.0333 110.762 40.266 110.8C39.6476 110.831 38.8527 110.786 38.3669 111.243C38.1981 111.402 38.1605 111.59 38.041 111.767C37.817 112.098 37.9417 112.011 37.5745 112.085C36.1402 112.376 34.7778 112.703 33.3751 113.192C32.673 113.437 32.0214 113.765 31.3161 113.996C30.6978 114.197 30.2447 114.446 29.9391 115.052C29.3931 116.136 29.5314 117.704 29.5709 118.872C29.6332 120.694 30.038 122.428 30.4747 124.191C30.9289 126.024 31.2851 127.906 32.1687 129.59C32.459 130.144 32.7724 130.85 33.3654 131.138C34.1311 131.511 35.3084 131.285 36.1443 131.287C36.7048 131.288 38.207 131.48 38.6263 131.01C39.0322 130.555 38.6239 129.271 38.5664 128.706C38.3655 126.726 38.0041 124.727 38.0089 122.734C38.4665 123.41 39.2596 124.576 40.0534 123.541C40.2488 123.286 40.1726 123.168 40.5192 123.02C40.7111 122.938 41.1156 122.888 41.3248 122.902C41.609 122.922 41.7141 123.036 41.9753 122.98C42.2064 122.93 42.4666 122.723 42.7315 122.66C46.0174 121.88 49.2839 121.038 52.5839 120.342C53.4563 120.158 53.3323 120.828 53.3898 121.582C53.4535 122.416 53.3323 123.259 53.448 124.083C53.5486 124.801 53.6269 125.5 53.4852 126.223C53.3178 127.074 53.4256 127.784 53.5921 128.627C54.2339 131.879 54.1192 135.406 54.2639 138.711C54.3394 140.432 54.1774 142.189 54.3394 143.902C54.4007 144.548 54.7618 144.905 54.9078 145.494C55.076 146.169 54.6177 147.029 54.4785 147.683C54.1984 148.997 53.7064 150.876 54.6064 152.019C55.0922 152.637 55.7292 152.726 56.4486 152.935C57.3096 153.184 58.1579 153.476 59.023 153.712C62.1831 154.577 65.5978 154.746 68.8368 155.223C69.6296 155.339 70.3652 155.328 71.1635 155.273C71.6555 155.239 72.8673 155.401 73.2766 155.107C73.4957 154.949 73.3844 154.752 73.496 154.559C73.6542 154.286 73.8457 154.174 74.1152 154.004C74.5613 153.722 75.0775 153.558 75.1526 152.976C75.3369 151.55 73.5553 150.795 72.6026 150.179C71.3854 149.391 69.9149 149.086 68.6229 148.444C67.91 148.089 67.2223 147.687 66.5353 147.284C66.2376 147.109 65.634 146.912 65.4263 146.637C65.2144 146.357 65.4218 145.956 65.5096 145.556C65.8717 143.9 65.7491 142.207 65.9365 140.533C66.1239 138.857 66.073 137.171 66.1346 135.486C66.1984 133.752 66.3417 132.021 66.4516 130.289C66.5529 128.689 66.6549 127.063 66.6721 125.461C66.688 123.976 66.8905 122.519 66.9384 121.024C66.9546 120.517 66.8637 119.597 67.2003 119.167C67.4959 118.79 68.4744 118.837 68.9306 118.771C70.1606 118.593 71.3313 118.436 72.5475 118.328C75.4413 118.072 78.6614 117.884 81.3977 116.876C82.5264 116.46 84.0279 115.892 84.4024 114.596C84.8331 113.107 84.2708 111.276 84.2522 109.753C84.2325 108.128 83.7609 106.541 83.4074 104.966C83.027 103.27 82.7872 101.545 82.3758 99.8557C81.9982 98.3056 81.3863 96.9327 80.8075 95.4608C80.5725 94.8641 79.2354 92.8068 79.6502 92.2997C79.8738 92.0264 80.6786 91.9572 81.0049 91.8321C81.7088 91.563 82.4137 91.2567 83.0628 90.8736C83.929 90.3613 85.8264 89.5144 85.9139 88.3771C85.9969 87.2897 84.9285 86.191 84.3852 85.3372C83.51 83.9611 82.4065 82.7583 81.5731 81.3554C79.8886 78.5198 78.549 75.4142 77.3208 72.3585C76.6785 70.7595 76.4687 69.2542 76.3629 67.5477C78.2283 67.5521 80.127 67.7816 81.981 67.5208C83.9982 67.2369 86.0183 66.759 88.018 66.3649C91.6594 65.6472 95.1558 64.8372 98.5292 63.2213C101.688 61.7081 104.894 60.0519 107.509 57.6501C108.862 56.4081 110.241 55.1422 111.409 53.722C112.609 52.2629 113.511 50.6053 114.437 48.9677C115.459 47.1596 116.272 45.2598 116.915 43.2825C117.044 42.8849 117.045 42.3785 117.21 42.0029C117.397 41.5791 117.737 41.5678 118.092 41.3445C118.591 41.0303 118.923 39.9787 118.057 39.8199Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M74.6249 19.5827C75.0511 19.949 76.8892 21.2393 77.4828 20.9255C78.2153 20.5382 77.0556 19.3715 76.7435 19.0839C76.3462 18.718 74.9264 17.611 74.3827 17.7137C73.296 17.9193 74.2411 19.253 74.6249 19.5827Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M75.5326 32.8247C75.7737 32.3506 76.4146 32.1763 76.7109 31.7175C77.0675 31.1659 77.2311 30.6832 77.0999 30.0068C76.1872 30.314 75.1491 31.2435 74.5386 31.9705C74.028 32.578 73.303 33.8474 74.635 33.8506C74.6233 33.6699 74.6116 33.489 74.5999 33.3084C74.9992 33.3665 75.3513 33.182 75.5326 32.8247Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M71.1858 24.9361C71.7742 25.1052 72.2597 25.0812 72.8606 25.0944C73.2967 25.1042 73.8928 25.3439 74.2463 25.0737C73.9328 24.8921 74.329 24.882 74.2515 24.7049C74.1863 24.5573 74.0623 24.6057 73.9617 24.4862C73.6027 24.0603 73.2902 24.0655 72.721 23.9769C72.2797 23.908 71.6309 23.749 71.2071 23.9683C70.7609 24.1991 70.5883 24.7643 71.1858 24.9361Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M79.5598 37.9979C79.9405 37.6789 80.3554 36.7552 80.4322 36.2783C80.4622 36.0916 80.3278 35.9486 80.3436 35.8111C80.3747 35.5493 80.9128 35.0432 80.3488 34.8282C79.8558 34.6401 79.392 36.1012 79.2666 36.4203C79.1381 36.7462 78.7877 37.3815 78.8952 37.6971C78.9844 37.959 79.3031 38.2129 79.5598 37.9979Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M84.1113 18.2185C84.4555 17.8991 84.6732 17.5368 84.6377 17.0975C84.6095 16.7515 84.3504 15.5585 84.0586 15.5935C83.0901 15.7104 83.5256 18.7625 84.1113 18.2185Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M63.6632 71.5571C63.5837 71.2656 63.2939 69.482 62.7929 69.6036C62.4122 69.6959 62.8077 71.2653 62.8253 71.472C62.8625 71.9041 62.0318 71.89 61.646 71.8314C61.0337 71.739 61.0826 71.3804 60.9913 70.824C60.9569 70.6134 60.8242 69.6632 60.3856 70.0115C60.0893 70.2465 60.3012 71.4183 60.3257 71.6856C60.4111 72.6118 60.5117 74.1932 61.0623 75.0342C61.2818 75.3694 61.4796 75.5352 61.71 75.1048C61.9433 74.6697 61.4151 73.3429 61.3228 72.8977C61.7586 72.9405 63.0131 72.7988 63.2753 73.2516C63.5151 73.6647 63.1316 74.8451 63.9006 74.9405C64.3571 74.9977 64.2744 74.4692 64.2303 74.063C64.1384 73.2106 63.8882 72.3806 63.6632 71.5571Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M64.8317 71.1444C64.3267 71.3725 64.961 74.699 65.6996 74.5915C66.5624 74.4661 65.3131 70.927 64.8317 71.1444Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M64.2685 70.0432C64.2061 70.7923 65.1795 71.0713 65.2256 70.2575C65.2611 69.6294 64.334 69.256 64.2685 70.0432Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M58.9255 50.1861C59.3699 51.8419 63.4152 52.5465 62.8701 50.3132C62.5972 49.1952 61.4575 50.1885 60.6616 50.0583C60.1465 49.9742 58.6126 49.0185 58.9255 50.1861Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M57.91 47.2322C58.1002 46.3464 56.1615 45.3682 55.4583 45.6122C54.4292 45.9691 54.4336 48.2513 55.2185 48.8581C55.3219 48.938 55.6385 49.1285 55.7935 48.9766C56.0381 48.7364 55.7708 48.8019 55.7136 48.5624C55.623 48.1814 55.3267 47.6918 55.6219 47.2584C56.1801 46.4391 57.6375 48.5018 57.91 47.2322Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M51.9989 51.5333C51.3002 51.494 50.7269 52.5786 51.7553 52.488C51.952 52.4704 52.3751 52.4208 52.4895 52.2141C52.6787 51.8713 52.3062 51.5505 51.9989 51.5333Z"
                        fill="black"
                      />
                      <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M85.9063 25.6752C85.6672 25.3292 85.1655 24.7724 84.7342 25.1194C84.3517 25.4272 84.4182 26.1868 84.565 26.5642C84.9598 27.5803 85.8925 28.4856 86.9482 27.9001C86.5816 27.1657 86.3749 26.3525 85.9063 25.6752Z"
                        fill="black"
                      />
                    </G>
                  </G>
                  <Defs>
                    <ClipPath id="clip0_8064_9417">
                      <Rect width="133.371" height="81.5522" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.task}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'EarnPage',
                    },
                  ],
                })
              }>
              <View style={styles.AdvertImage1}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M5 12H18M13 6L18.2929 11.2929C18.6834 11.6834 18.6834 12.3166 18.2929 12.7071L13 18"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </Svg>
              </View>

              <Text style={styles.advertText}>Engage a task</Text>
              <Text style={styles.advertSubText}>
                Monetize Your Influence! Earn by Posting Ads on Your Social
                Media.
              </Text>

              <View style={styles.TaskImage}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="72"
                  height="60"
                  viewBox="0 0 72 60"
                  fill="none">
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M69.2553 52.9903C68.8324 53.4793 68.208 53.8423 67.7289 54.2894C67.2258 54.7591 66.6797 55.1695 66.1786 55.6335C63.9679 52.9316 60.9395 51.2748 58.3161 49.0328C57.0724 47.9698 56.1561 46.528 55.4855 45.0482C55.1417 44.2897 54.8877 43.5089 54.689 42.7008C54.5995 42.3368 54.512 41.974 54.4534 41.6051C54.3826 41.1583 54.3642 41.1202 54.0628 40.7714C53.933 40.6214 53.6817 40.1829 53.4275 40.2312C53.2136 40.2719 52.8223 40.923 52.6872 41.0838C52.0371 41.8574 51.4068 42.6545 50.7224 43.3981C49.6753 44.5359 48.722 45.6555 47.7498 46.8615C45.761 49.3288 43.6156 51.6514 41.4508 53.973C41.2903 54.1451 40.9159 54.65 40.6852 54.7179C40.4047 54.8004 39.9489 54.4563 39.6665 54.264C38.9847 53.7999 38.4473 53.2254 37.8644 52.6501C36.7271 51.5274 35.9569 49.9516 35.4388 48.4522C35.1287 47.5547 34.927 46.6243 34.6069 45.7299C34.4735 45.3571 34.1711 44.8989 34.3247 44.5743C34.3704 44.4775 34.6613 44.2203 34.7639 44.2006C34.8852 44.1773 35.0876 44.3437 35.1297 44.3322C35.5322 44.222 35.3089 43.8006 35.5483 43.5739C35.6841 43.4452 36.3745 43.4641 36.5807 43.3934C37.3344 43.1348 38.0106 42.6416 38.7231 42.3472C41.706 41.1148 44.7253 39.916 47.3004 37.9036C47.9683 37.3817 48.412 36.9896 49.2089 36.6523C50.0142 36.3114 50.8237 36.0073 51.6454 35.7099C52.3704 35.4475 53.0993 35.2015 53.8482 35.0134C54.658 34.81 55.8068 34.5521 56.6159 34.8141C58.2049 35.3285 58.718 36.6378 59.3508 38.0189C60.2069 39.8875 61.242 41.6557 62.3642 43.3757C64.523 46.6849 67.1486 49.6543 69.2553 52.9903Z"
                    fill="#FF6DFB"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.4016 23.7347C21.3142 23.6904 20.6315 23.9682 20.517 24.0107C20.0593 24.1805 19.6281 24.4627 19.1969 24.6922C19.5274 25.0944 19.858 25.4967 20.1884 25.899C20.5123 25.1044 20.9286 24.4488 21.4016 23.7347ZM21.627 28.6782C21.5145 28.6908 22.4638 30.972 22.5747 31.2281C22.9781 32.1597 23.4016 33.0822 23.8103 34.0115C24.2063 34.912 24.7087 35.7404 25.2148 36.5817C25.6477 37.3011 26.0929 38.4176 26.7459 38.9505C26.3336 37.1214 26.3879 35.0183 25.2053 33.4825C23.9795 31.8903 22.7675 30.3356 21.627 28.6782ZM69.2552 53.0712C67.4234 50.1704 65.1303 47.6043 63.2202 44.7553C62.1506 43.1601 61.1096 41.5444 60.2092 39.8464C59.5544 38.6112 59.1473 36.8488 58.1359 35.9045C57.6902 35.4885 57.214 35.0813 56.6158 34.8949C55.7973 34.6398 54.6704 34.8926 53.8481 35.0943C52.3159 35.47 50.819 36.0534 49.3677 36.6661C47.8956 37.2875 46.6396 38.4038 45.3095 39.3007C43.8826 40.2629 42.3381 40.9638 40.7395 41.5774C39.3476 42.1116 38.1093 42.8787 36.7248 43.4164C36.449 43.5236 35.8859 43.5079 35.6545 43.6476C35.4051 43.7981 35.5033 44.2424 35.2006 44.4063C35.064 44.4803 35.0185 44.2121 34.9136 44.2165C34.7854 44.2219 34.6684 44.3724 34.5449 44.4677C34.0417 44.8559 34.35 45.1148 34.5492 45.649C35.1986 47.3895 35.5476 49.1604 36.4594 50.8035C37.2091 52.1542 38.2821 53.3645 39.5453 54.2586C39.7375 54.3947 40.3639 54.922 40.5895 54.8869C40.7925 54.8554 41.2057 54.3156 41.3459 54.169C41.982 53.5038 42.5635 52.7881 43.1992 52.1219C44.1817 51.0922 45.1274 50.0349 46.0808 48.9911C47.1875 47.7794 48.167 46.4065 49.1639 45.1119C49.6224 44.5163 50.2127 44.0312 50.7223 43.4789C51.4077 42.7364 52.037 41.9381 52.6872 41.1647C52.8838 40.9307 53.2133 40.332 53.519 40.339C53.7332 40.344 54.1108 40.8483 54.2229 41.0063C54.6393 41.5938 54.6374 42.6546 54.8445 43.3879C55.3498 45.176 56.261 46.9225 57.5107 48.3023C58.7534 49.6744 60.3453 50.6502 61.8151 51.7531C63.4073 52.948 64.9158 54.1709 66.1785 55.7143C66.6796 55.2504 67.2257 54.8399 67.7288 54.3703C68.208 53.9231 68.8324 53.5602 69.2552 53.0712ZM45.6759 61.2777C46.032 61.2813 46.6351 61.5004 46.9537 61.3685C46.0087 60.3229 45.1409 59.4257 43.9453 58.6595C42.7046 57.8643 41.468 57.0762 40.2629 56.228C37.8344 54.5188 36.0482 52.4917 35.0337 49.6451C34.7725 48.9121 34.5976 48.1433 34.4061 47.3898C34.3031 46.984 34.0981 45.0854 33.75 44.9215C33.5437 44.8243 31.9915 45.9152 31.7456 46.0512C31.1706 46.3692 30.5935 46.6158 29.999 46.8646C28.7212 47.3996 27.4039 47.8077 26.0489 48.1484C24.4244 48.5568 23.3178 47.881 22.3114 46.6042C21.1697 45.1555 20.2208 43.521 19.1769 41.9998C18.7022 41.3078 18.3089 40.617 17.9583 39.8539C17.7288 39.3545 16.8188 38.0073 17.1332 37.4752C18.0304 38.1583 18.3532 39.5164 18.9643 40.4309C19.726 41.5707 20.5844 42.6454 21.35 43.7841C21.9938 44.7416 22.6506 45.902 23.6017 46.5904C24.4384 47.1958 25.2332 47.0097 26.1336 46.7376C27.2249 46.4078 28.3561 46.2453 29.4256 45.8363C30.583 45.3938 31.678 44.766 32.8072 44.2541C33.3336 44.0154 33.964 43.8797 34.4601 43.5821C34.8876 43.3258 34.8238 43.1904 34.8552 42.6445C34.8919 42.0076 34.9341 41.3703 34.9623 40.7328C34.9812 40.3045 34.7496 39.7238 34.9068 39.4041C33.6248 39.6264 32.3718 39.9241 31.0988 40.1874C30.4018 40.3316 29.7297 40.5098 29.0257 40.6231C28.7572 40.6663 28.3904 40.6651 28.15 40.782C27.9583 40.7269 27.8606 40.762 27.8568 40.8869C27.8477 40.9548 27.8332 41.0217 27.8132 41.0876C27.4201 41.2664 27.1915 40.8828 26.8505 40.5149C26.4298 40.0609 26.1148 39.5495 25.8061 39.016C25.116 37.8231 24.3205 36.7012 23.6819 35.4747C23.031 34.2245 22.5023 32.8858 21.9504 31.5887C21.4441 30.3986 21.1199 29.1116 20.5605 27.9497C20.3108 27.431 19.9944 27.0022 19.6249 26.564C19.32 26.2025 18.8508 25.4226 18.3955 25.2565C18.2751 25.2126 17.9598 25.2863 17.823 25.2766C17.5504 25.2571 17.3075 25.1571 17.0285 25.179C16.4245 25.2262 15.766 25.6082 15.2833 25.944C15.5952 26.2221 16.3755 26.56 15.815 27.0609C15.2711 27.5471 14.9707 26.6749 14.7631 26.2927C13.7858 27.0953 13.927 28.202 13.8141 29.336C13.7552 29.928 13.6 30.511 13.5 31.0942C13.4279 31.5139 13.4784 31.948 13.4578 32.3765C13.4053 33.4653 13.2959 34.5076 13.3012 35.5812C13.3068 36.7287 13.385 37.837 13.4768 38.9762C13.6314 40.8942 13.9855 42.8129 14.2892 44.7157C14.4601 45.7853 14.6939 46.8244 14.921 47.8767C15.1786 49.071 15.6552 50.2022 15.9225 51.3933C16.1948 51.0471 16.3997 51.0455 16.8401 51.0913C17.1789 51.1266 17.4065 51.046 17.3867 51.5163C17.3738 51.8213 17.1048 52.0542 16.8071 52.1075C16.4188 52.1768 16.2869 51.9831 16.0869 51.6891C16.0401 52.2459 16.4145 52.8281 16.5626 53.3719C16.7028 53.8873 16.7957 54.3925 17.0312 54.8857C17.261 55.3669 17.4578 55.8416 17.6904 56.3182C17.7975 56.5374 17.8976 56.7601 18.0059 56.9788C18.0607 57.0896 18.1252 57.2422 18.2069 57.3355C18.3987 57.5543 18.3682 57.4483 18.5926 57.5729C19.0814 57.8445 18.8978 57.7768 18.9093 58.3376C18.9204 58.8908 19.2041 59.2972 19.6589 59.6081C20.624 60.2679 21.576 60.4514 22.6731 60.7848C23.6954 61.0954 24.7722 61.3619 25.8547 61.3558C27.1805 61.3484 28.4888 61.1746 29.8146 61.157C31.2772 61.1376 32.754 61.1456 34.2136 61.1961C34.815 61.2169 35.3734 61.2437 35.9539 61.3972C36.628 61.5756 37.2802 61.5049 37.975 61.4778C39.4573 61.4201 40.9908 61.3055 42.4538 61.2952C43.5071 61.2877 44.6186 61.2142 45.6759 61.2777ZM84.1141 61.8523C84.3776 61.9915 84.9683 61.9344 85.2333 61.8957C85.7 61.8277 85.7499 61.6427 86.0461 61.2265C86.5557 60.5099 86.9695 59.8236 87.2694 58.9935C87.8432 57.4047 88.0776 55.7793 88.3295 54.1173C88.6095 52.2706 88.0982 50.3564 87.9152 48.5223C87.8732 48.1015 87.8157 47.6845 87.7492 47.2669C87.7094 47.0172 87.6991 46.1678 87.5348 45.9516C87.2191 45.5364 85.7512 45.8713 85.174 45.909C83.563 46.0142 81.9415 46.0388 80.3313 46.0571C79.4727 46.0668 78.6094 46.1027 77.7593 46.1094C77.3689 46.1125 76.9873 46.0931 76.5955 46.0551C76.4644 46.0424 76.3364 46.0123 76.2044 46.005C75.7524 45.98 75.7864 45.9145 75.6696 46.3147C75.465 47.0159 75.6224 47.908 75.5687 48.6357C75.4968 49.6082 75.4579 50.5945 75.4757 51.5691C75.4922 52.4697 75.4615 53.3682 75.4951 54.2708C75.5091 54.6446 75.5499 54.9493 75.6485 55.3063C75.76 55.7099 75.8827 56.6528 76.1603 56.932C76.1919 56.9639 76.4279 56.8897 76.4905 56.9689C76.587 57.0909 76.5694 57.349 76.6356 57.4278C76.8501 57.683 77.2934 57.7033 77.615 57.8179C78.4973 58.1326 79.3067 58.4742 80.1383 58.8985C80.8814 59.2775 82.0794 59.6001 82.5261 60.3479C82.731 60.6908 82.7586 61.1428 82.9469 61.4965C83.1614 61.8995 82.7323 61.6888 83.2578 61.8523C83.4944 61.9259 83.8715 61.8523 84.1141 61.8523ZM5.77923 57.2952C5.71238 58.2256 5.18822 59.1119 5.00576 60.0267C4.92038 60.4551 4.77556 60.8762 4.6752 61.3021C4.57896 61.7106 4.23126 62.1945 4.26646 62.5987C5.54977 62.1415 6.84965 62.0265 8.19091 61.9032C9.46214 61.7863 10.8051 61.7398 12.0656 61.7392C13.3502 61.7385 14.7236 61.6131 16.0463 61.5936C17.4294 61.5733 18.8335 61.5374 20.1967 61.394C19.4839 60.8661 18.592 60.3703 18.0657 59.6358C17.4935 58.8373 17.1963 57.8369 16.6929 56.9944C15.6825 55.3036 15.0402 53.2055 14.5106 51.3059C13.4414 47.4711 12.2466 43.7072 11.9586 39.7295C11.4106 40.0102 10.9756 41.0991 10.7012 41.6413C10.3509 42.3336 10.1675 43.084 9.93987 43.8199C9.47103 45.3355 9.14655 46.9069 8.57249 48.4081C7.47529 51.2776 6.77007 54.3696 5.77923 57.2952ZM75.4411 34.9452C75.6784 36.6603 76.1761 38.3976 76.1952 40.1333C76.1994 40.5152 76.1347 40.9393 76.2143 41.3158C76.2993 41.7178 76.5757 42.0732 76.7353 42.4552C76.9887 43.0617 77.6302 44.3047 77.0115 44.8186C76.999 44.3309 76.5527 43.7117 76.3279 43.2852C75.9891 42.6427 75.544 42.0553 75.1767 41.4287C74.4079 40.1172 73.5464 38.8338 72.5557 37.6776C71.5907 36.5514 70.4785 35.5524 69.4552 34.48C69.1477 34.1578 66.6813 31.0565 66.5833 31.0999C67.3483 34.0502 68.6488 36.6171 70.4286 39.0873C71.3012 40.2983 72.3485 41.0951 73.4108 42.121C74.2954 42.9754 75.9626 43.8889 75.6568 45.2887C77.0396 45.1558 78.4133 44.9434 79.8087 44.9434C79.5792 43.1773 79.4035 41.4392 78.9939 39.7021C78.5288 37.7297 78.2137 35.6983 77.8202 33.7084C77.4186 31.6769 76.7373 29.7101 76.3135 27.6825C75.9077 25.7409 75.559 23.8027 75.2615 21.8394C75.0157 22.9273 75.1064 24.1221 75.0191 25.232C74.93 26.366 74.9386 27.4791 74.9683 28.6198C75.0233 30.7384 75.2491 32.8315 75.4411 34.9452ZM81.4332 24.8441C81.4409 23.9372 81.6166 23.0426 81.6708 22.1379C81.6875 21.8603 81.964 19.9665 81.7061 19.8677C81.4941 20.33 81.4447 20.9215 81.2521 21.4066C81.0597 21.8911 80.8024 22.3527 80.6177 22.8407C80.2178 23.8977 80.0798 25.0938 80.0368 26.2176C79.9393 28.7595 79.8889 31.2956 80.0598 33.8375C80.133 34.9271 80.1892 36.0185 80.1691 37.1101C80.1471 38.3113 79.9632 39.354 80.1865 40.5453C80.4077 41.7251 80.5466 42.9 80.6203 44.097C80.6719 44.9371 80.6927 44.8777 81.4943 44.8186C82.0729 44.7759 82.6573 44.8215 83.2368 44.795C82.9659 41.5206 82.9216 38.2395 82.4888 34.9777C82.2679 33.3137 82.262 31.6256 81.9877 29.9677C81.8514 29.1441 81.6227 28.3372 81.4913 27.5127C81.3502 26.6274 81.4197 25.7362 81.4332 24.8441ZM22.8185 22.7835C24.3616 22.9172 26.003 23.3785 27.5847 23.0739C27.324 22.9683 26.6417 22.8226 26.9487 22.4058C27.261 21.982 27.7871 22.5196 28.0985 22.4641C28.2905 22.4298 28.7147 21.6272 28.8331 21.461C29.1017 21.0834 29.1341 21.0176 29.617 20.9208C30.0849 20.8272 30.191 20.9285 30.2503 20.4634C30.3183 19.9284 30.1332 19.327 30.1516 18.78C30.191 17.6024 30.5709 16.5697 30.9245 15.4618C29.4222 15.7886 27.9533 16.1762 26.4172 16.3868C25.7606 16.4769 24.739 16.6846 24.1425 16.2382C23.9873 16.1221 24.0122 15.9654 23.8852 15.8309C23.6723 15.6052 23.2774 15.3717 22.9755 15.3074C21.1175 14.9118 20.9363 17.5606 21.8674 18.5517C22.1006 18.8001 22.4251 18.9227 22.6639 19.1503C22.9826 19.4538 23.0088 19.7735 23.0553 20.2368C23.1425 21.1056 23.024 21.9777 22.6534 22.7724L22.8185 22.7835ZM45.3658 35.288C45.9143 35.3921 46.4868 35.3683 47.0367 35.4571C47.2321 35.4887 47.8179 35.5988 47.9896 35.4846C48.252 35.3101 48.3452 34.6705 48.4692 34.3726C48.6874 33.8486 48.996 33.3916 49.204 32.858C50.0541 30.6788 50.8468 28.4909 51.8749 26.3861C51.4808 26.2837 51.1782 26.2796 50.7811 26.2267C50.3674 26.1716 49.9924 25.927 49.5977 25.8218C49.2226 25.7219 48.8296 25.7474 48.4579 25.6312C48.2532 25.5673 48.0775 25.4251 47.8756 25.3754C47.5539 25.2963 47.1784 25.25 46.987 25.4612C46.7909 25.6779 46.7221 26.2719 46.6153 26.5517C46.3311 27.2972 46.0009 28.0166 45.7629 28.7792C45.548 29.467 45.3439 30.1475 45.1548 30.8416C44.955 31.5743 44.5613 32.1783 44.3214 32.8782C44.139 33.411 43.9668 33.9557 43.9396 34.5238C43.9131 35.0781 43.8324 35.1134 44.3867 35.2019C44.6665 35.2466 45.1026 35.4128 45.3658 35.288ZM81.4544 61.2309C81.5973 61.2974 81.732 61.2886 81.8584 61.2043C80.6198 60.6811 79.415 59.9556 78.1229 59.5967C76.9109 59.2601 75.7328 58.8579 74.5651 58.4434C73.6163 58.1066 72.7632 57.8443 71.9054 57.2515C71.3847 56.8917 70.9222 56.4871 70.5644 55.9612C70.166 55.3757 70.0774 54.5425 69.646 54.0153C69.0637 54.6548 68.3796 55.1391 67.6907 55.6472C67.4523 55.823 66.8806 56.2063 66.7991 56.4784C66.6962 56.8217 66.9718 57.1501 67.1081 57.4975C67.4572 58.3872 67.6278 59.2765 67.8172 60.2015C67.8931 60.5723 68.057 61.1296 68.3615 61.2849C68.6388 61.4261 69.4419 61.3234 69.787 61.2972C71.5872 61.1608 73.3556 61.0211 75.1667 61.1454C77.2162 61.2859 79.4103 61.383 81.4544 61.2309ZM85.0502 44.7437C85.3773 44.7448 85.697 44.7039 86.0229 44.7039C85.8348 43.8253 86.2747 42.6884 86.4306 41.8114C86.6051 40.8304 86.738 39.816 86.8543 38.8271C87.0996 36.7442 87.2107 34.6866 87.2139 32.5884C87.2169 30.5581 87.5865 28.7028 88.1042 26.7511C88.6601 24.655 89.5705 22.77 90.3232 20.7485C89.4975 21.185 89.0405 22.2062 88.6067 22.987C88.0583 23.9742 87.693 25.0673 87.469 26.1755C87.037 28.3135 86.5631 30.4579 86.0646 32.5922C85.5455 34.8146 85.2403 37.0574 84.6456 39.2616C84.3556 40.3366 83.9613 41.659 83.9394 42.7675C83.9303 43.2261 83.7921 44.1864 84 44.5846C84.1943 44.9572 84.624 44.7817 85.0502 44.7437ZM35.6622 41.9863C35.645 42.2145 35.6287 42.4316 35.5881 42.6571C36.0413 42.6527 36.6153 42.1825 37.004 41.9714C37.4775 41.7142 37.9516 41.4306 38.4147 41.1721C39.3088 40.6729 40.3238 40.344 41.2784 39.934C42.375 39.4629 43.383 38.8937 44.4317 38.3266C44.798 38.1285 47.4307 36.9873 47.3866 36.6756C46.8086 36.6563 46.2306 36.6371 45.6525 36.6179C45.157 36.6014 44.3895 36.7134 43.9149 36.5602C43.6551 36.4762 43.3633 36.1672 43.2651 35.9252C43.1681 35.6857 43.3863 34.5843 43.2594 34.5141C42.6125 35.1746 42.2058 36.0524 41.6274 36.765C40.9883 37.5525 40.1624 38.0123 39.2521 38.4308C38.247 38.893 37.2066 39.2509 36.1793 39.647C35.7461 39.814 35.7547 39.9096 35.717 40.3846C35.6747 40.9155 35.6793 41.454 35.6622 41.9863ZM87.8958 61.9605C88.9854 62.0774 90.102 62.0108 91.2002 62.102C91.5997 62.1351 92.1537 62.1845 91.7517 62.7208C91.4985 63.0585 90.6876 62.9502 90.3198 62.9736C89.3322 63.0364 88.2866 63.0027 87.2968 62.988C87.0884 62.9851 86.8581 62.9231 86.6475 62.937C86.4043 62.953 86.1132 63.1279 85.8916 63.1266C85.755 63.1258 85.706 62.9817 85.5883 62.9685C85.3317 62.9397 85.0751 62.9186 84.8164 62.9187C80.9041 62.9195 77.0456 62.8409 73.143 62.8367C71.277 62.8347 69.3809 62.8025 67.5156 62.7149C67.1239 62.6964 64.8932 62.7766 64.955 62.0713C64.9867 61.708 65.7148 61.6568 65.9805 61.6182C66.1773 61.5897 66.3816 61.5942 66.5789 61.5836C67.1029 61.5555 67.3325 61.6816 67.2219 61.1082C66.8026 58.9333 66.0512 57.1358 64.4459 55.572C63.1332 54.2933 61.5526 53.1334 60.0657 52.0656C58.2604 50.769 56.7959 49.4054 55.724 47.4213C55.0981 46.2627 54.5741 45.0782 54.2525 43.7971C54.1368 43.3363 54.1341 42.8121 53.9923 42.3678C53.8832 42.0257 53.6346 41.7863 53.4882 41.432C51.692 44.432 49.3114 46.942 47.1286 49.647C46.0856 50.9393 44.8959 52.1667 43.6497 53.291C43.2799 53.6246 42.9349 53.973 42.5897 54.332C42.301 54.6325 41.8426 54.8996 41.5988 55.233C41.365 55.5528 41.4226 55.5375 41.7785 55.7915C42.249 56.1271 42.7676 56.406 43.2455 56.7333C44.0094 57.2565 44.8433 57.6986 45.5263 58.3282C46.265 59.0092 46.9104 59.798 47.5561 60.5659C47.9865 61.0777 48.5512 61.7344 48.6594 62.3815C48.6952 62.5956 48.8314 63.1251 48.6517 63.2819C48.4982 63.4159 48.5136 63.365 48.323 63.2833C48.0732 63.1762 47.9998 62.9305 47.6947 62.8134C46.914 62.5138 45.9693 62.6167 45.157 62.613C44.3444 62.6094 43.525 62.7006 42.7128 62.6973C40.8581 62.6897 39.0428 62.8399 37.1886 62.9205C35.2193 63.006 33.2258 62.8006 31.263 62.8297C29.8088 62.8513 28.3158 62.7426 26.8213 62.8234C26.0526 62.8648 25.2977 62.7687 24.5482 62.7579C23.5669 62.7438 22.5591 62.8773 21.5694 62.8963C19.9449 62.9277 18.3403 62.9275 16.706 62.9665C13.1905 63.0507 9.69393 63.1376 6.17635 63.1933C5.70714 63.2007 5.19346 63.1847 4.72978 63.2375C4.23763 63.2937 4.49171 63.3983 4.15403 63.5755C3.20868 64.0714 3.427 62.2331 3.44965 61.8716C3.57117 59.9341 4.06303 58.0338 4.65413 56.1944C5.2149 54.4499 5.67016 52.6239 6.14508 50.8417C6.66494 48.8909 7.34226 47.0201 7.95733 45.0886C8.58756 43.1093 9.10068 41.0529 10.2453 39.2984C10.5061 38.8989 10.7755 38.4689 11.1949 38.217C11.665 37.9345 11.6853 38.0995 11.6849 37.5826C11.6846 37.0958 11.7146 36.4454 11.5997 35.9809C11.4959 35.5612 11.5119 35.8101 11.2781 35.5086C11.0879 35.2634 10.8889 35.0959 10.7524 34.7982C9.91394 35.6483 7.99468 35.1997 7.18461 34.5875C6.19311 33.8382 5.4379 32.5741 5.16117 31.3702C4.93892 30.4034 5.21163 28.5605 6.28167 28.0956C6.80331 27.869 8.71928 27.6976 8.79596 26.959C8.83546 26.5777 8.16114 26.0416 8.00554 25.7137C7.7172 25.1063 7.44028 24.2984 7.36014 23.6326C7.20362 22.333 7.79359 20.8798 8.73342 20.0019C10.4575 18.3915 13.491 17.5651 15.7087 18.5868C15.24 16.7966 14.9571 15.2521 15.1931 13.3899C15.3965 11.7856 16.343 10.888 17.6455 10.0889C19.8682 8.72502 22.8907 8.18672 25.4321 8.58328C26.0097 8.67344 26.5639 8.86676 27.0986 9.02057C27.8755 9.24403 28.8055 9.16961 29.539 9.53269C30.0708 9.79584 30.4747 10.3201 30.9417 10.6701C31.487 11.0788 31.9402 11.6887 32.319 12.2527C33.1293 13.4589 32.8127 15.6975 32.1345 16.9082C31.9891 17.1679 31.8095 17.3865 31.5689 17.5637C31.3183 17.7482 30.9365 17.8056 30.8074 18.0448C30.4767 18.6575 30.7957 19.9839 30.8398 20.6462C30.8912 21.4152 30.5024 21.9928 29.6304 22.0541C29.126 22.0897 29.1099 21.797 28.8684 22.3992C28.7118 22.7895 28.5696 23.2147 28.3437 23.5725C27.878 24.3099 27.025 24.2379 26.2479 24.218C25.3485 24.1948 24.4625 24.0527 23.5625 23.963C23.8002 24.7245 24.4508 25.3156 24.8571 25.9941C25.4065 26.9117 25.7372 27.6724 25.8265 28.7415C25.895 29.5629 25.7471 30.2116 25.185 30.8229C24.9524 31.0759 24.7461 31.0884 24.8039 31.3803C24.8391 31.5583 25.147 31.8521 25.256 31.9942C25.5442 32.3702 25.8789 32.7153 26.1326 33.1168C27.1088 34.6617 27.3972 37.0167 27.3996 38.8151C27.3997 38.8976 27.4437 39.0729 27.4073 39.1582C27.3803 39.2212 27.1755 39.4207 27.1725 39.4378C27.1324 39.6691 27.3579 40.0654 27.7116 40.1047C28.0832 40.1458 28.7637 39.8357 29.1093 39.7339C29.6624 39.5708 30.2262 39.4504 30.7781 39.2829C31.6694 39.0124 32.5566 38.7967 33.4627 38.5848C33.8722 38.4891 34.284 38.4094 34.6947 38.3199C35.1626 38.218 35.38 38.0211 35.6216 38.4972C35.8287 38.9057 35.6999 38.9798 36.2018 38.7739C36.7001 38.5693 37.187 38.3158 37.6736 38.085C38.5317 37.6779 39.5536 37.3151 40.2938 36.7141C41.5285 35.7116 41.9858 34.115 43.1675 33.0513C43.4966 32.755 43.6929 32.7498 43.9009 32.3395C44.1236 31.9003 44.2385 31.3371 44.3555 30.8647C44.5606 30.0375 44.7066 29.2074 44.8926 28.381C45.1243 27.3514 45.6251 26.4189 45.9904 25.4369C46.1328 25.0543 46.2066 24.5679 46.4362 24.2241C46.4971 24.1329 46.6134 24.0815 46.6608 24.006C46.8242 23.747 46.8225 23.6758 46.8648 23.3642C47.0628 21.908 47.9321 22.674 48.8819 23.008C49.2821 23.1487 51.1825 24.0612 50.4568 24.668C51.3219 24.919 52.7073 24.7826 52.6957 26.0223C52.6897 26.6575 52.3098 27.3369 52.1059 27.9315C51.9248 28.4594 51.7497 28.9894 51.5657 29.5164C51.1627 30.671 50.6737 31.7911 50.2805 32.9492C50.1012 33.477 49.9533 34.0172 49.7037 34.5153C49.4836 34.9548 48.9506 35.4392 48.8628 35.9197C51.168 34.9362 53.3005 33.5144 55.8806 33.605C57.0104 33.6446 58.0357 34.1195 58.6597 35.1129C59.442 36.358 59.9567 37.7521 60.7212 39.0087C63.5027 43.5799 66.8201 47.7328 69.8736 52.1148C70.1081 52.4516 70.4097 52.77 70.4911 53.1861C70.5441 53.4576 70.4412 53.7292 70.5048 53.99C70.6369 54.5321 71.3043 55.2088 71.7569 55.5203C72.6243 56.1174 74.0345 56.9596 75.117 56.885C74.4376 55.2523 74.4467 53.4634 74.4782 51.7218C74.5083 50.0675 74.6871 48.4265 74.8993 46.7892C74.9473 46.4188 74.9892 46.0754 75.0956 45.7164C75.2178 45.3045 75.3856 45.3435 75.0196 44.9732C74.4564 44.4031 73.7865 43.934 73.2187 43.3568C71.9907 42.1085 70.7321 41.1301 69.7656 39.6394C68.8465 38.2216 67.8768 36.7627 67.1964 35.2101C66.4959 33.6117 66.2159 31.9048 65.8682 30.2121C65.7271 29.5252 65.2126 28.7584 65.316 28.0411C65.4467 27.1346 65.867 27.7947 66.0381 28.2826C66.5603 29.7717 67.7831 31.1046 68.7958 32.3022C69.89 33.596 71.2283 34.6785 72.3704 35.9347C73.6141 37.3028 74.466 38.8751 75.572 40.3355C75.572 38.5231 74.9532 36.6775 74.7001 34.8846C74.4774 33.3065 74.4074 31.7234 74.2666 30.1384C73.9469 26.5381 74.2232 22.8317 74.6719 19.2571C74.8852 17.5594 74.7642 15.9018 74.7707 14.1983C74.7727 13.6562 74.5483 12.4066 74.8343 11.9255C75.3821 11.0041 75.7016 13.019 75.7293 13.3194C75.8949 15.109 75.5979 16.8787 75.7496 18.6606C75.9082 20.5214 76.2524 22.33 76.5452 24.1693C76.8625 26.1608 77.379 28.1074 77.8734 30.0607C78.3926 32.1116 78.8293 34.2053 79.4065 36.2398C79.5622 35.6003 79.3438 34.8146 79.3006 34.1633C79.239 33.2313 79.1187 32.299 79.1084 31.3645C79.0917 29.8752 79.0801 28.3582 79.1643 26.8758C79.2474 25.4146 79.2223 23.8835 79.6704 22.4758C79.8831 21.8076 80.1951 21.1558 80.5003 20.5264C80.8768 19.7503 81.0099 18.9978 81.2184 18.1724C81.397 17.4655 81.6584 16.7772 81.7774 16.0561C81.8513 15.6077 82.0578 14.284 82.5712 15.2869C82.8692 15.869 82.7404 16.732 82.7488 17.3573C82.7594 18.1591 82.6367 18.9386 82.6179 19.737C82.5813 21.3034 82.555 22.8679 82.4381 24.4317C82.3156 26.0724 82.4226 27.5427 82.7347 29.1593C83.0763 30.9289 83.1763 32.7022 83.3533 34.4934C83.4446 35.4183 83.5985 36.338 83.6729 37.2641C83.7122 37.7546 83.5105 39.161 83.862 39.5103C83.8959 38.6608 84.1394 37.8106 84.3239 36.9828C84.5425 36.0022 84.6308 34.9713 84.7919 33.9766C85.0528 32.365 85.5591 30.8261 85.894 29.2326C86.5844 25.9478 87.1581 21.7262 90.0517 19.5761C90.4303 19.2948 90.8463 19.0872 91.2556 18.8557C91.4873 18.7246 91.8315 18.3855 92.0966 18.3264C92.386 18.2618 92.5067 18.3119 92.624 18.6477C92.7875 19.1156 92.4884 19.3342 92.2092 19.6742C91.2428 20.8504 90.8299 22.3582 90.2332 23.7376C88.8668 26.8964 88.2622 30.228 88.2552 33.6424C88.2516 35.4299 88.1283 37.1538 87.9377 38.9304C87.7326 40.8424 87.4625 42.8645 86.8816 44.7038C87.4642 44.8344 88.0963 44.6397 88.2544 45.3169C88.2933 45.4833 88.223 45.68 88.266 45.8965C88.3078 46.107 88.4082 46.3163 88.4677 46.5233C88.5905 46.9514 88.6555 47.3738 88.7152 47.8134C88.9461 49.5124 89.3427 51.1283 89.3849 52.851C89.4238 54.4433 89.112 56.0566 88.8248 57.6183C88.5354 59.1913 87.7055 60.5322 87.0522 61.9547C87.3334 61.9547 87.6145 61.9576 87.8958 61.9605Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M50.9171 58.3449C50.6072 58.4325 49.1113 58.5978 49.1116 59.0672C49.1118 59.3487 50.6057 59.3432 50.8701 59.3738C50.8858 59.0309 50.9015 58.6879 50.9171 58.3449ZM54.2191 61.584C55.0811 61.7479 56.2512 61.5174 56.8024 60.7574C57.0599 60.4023 57.182 59.8622 57.2659 59.4384C57.346 59.0346 57.5931 58.0268 57.4249 57.6482C57.2185 57.1833 55.2378 57.6692 54.6611 57.7225C53.6548 57.8154 52.6142 57.8263 51.6073 57.7607C51.6073 58.8004 51.5541 59.8137 52.1656 60.7086C52.6068 61.3543 53.4353 61.5067 54.2191 61.584ZM54.0458 62.8682C53.1092 62.5254 52.1258 62.7482 51.5159 61.7426C51.3611 61.4875 51.2308 61.2132 51.1372 60.9299C51.0914 60.8057 51.0559 60.6786 51.0306 60.5484C51.0782 60.2681 50.9755 60.1891 50.7226 60.3112C50.2261 60.2147 49.6817 60.5555 49.1588 60.455C47.8905 60.2114 48.1209 58.3946 48.972 57.7657C49.1402 57.6414 49.3081 57.6068 49.5006 57.5454C49.9249 57.4102 50.1545 57.5612 50.5425 57.5228C50.8562 57.4918 50.9424 57.163 51.2794 57.0181C51.5001 56.9234 51.8064 56.9307 52.0384 56.9212C53.2524 56.8713 54.4703 56.8717 55.6921 56.7926C56.2619 56.7557 56.8772 56.846 57.4354 56.7486C57.6968 56.7029 57.6593 56.529 57.9068 56.6816C58.163 56.8396 58.0524 57.424 58.0394 57.657C57.9646 59.0044 57.8844 60.4495 57.1626 61.6275C56.5022 62.7053 55.2027 62.8156 54.0458 62.8682Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.6005 35.6992C11.5995 35.9812 11.5986 36.2632 11.5977 36.5445C11.5985 36.2623 11.5994 35.9807 11.6005 35.6992Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M51.6791 24.9325C51.5312 24.9197 51.3833 24.907 51.2354 24.8942C51.3835 24.9046 51.5401 24.817 51.6791 24.9325Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.83069 27.9766C6.73399 28.1044 6.60227 28.0168 6.4873 28.0324C6.60189 28.0137 6.71629 27.9952 6.83069 27.9766Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7894 18.1815C13.6666 18.1839 13.5437 18.1863 13.4209 18.1888C13.5424 18.1172 13.6649 18.0965 13.7894 18.1815Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.4657 8.72363C21.3407 8.7388 21.2157 8.75396 21.0908 8.76904C21.2158 8.75387 21.3407 8.7388 21.4657 8.72363Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.4394 18.2666C12.3111 18.2797 12.1828 18.2928 12.0547 18.3059C12.1829 18.2928 12.3112 18.2797 12.4394 18.2666Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.22949 35.1309C8.30336 35.132 8.37713 35.133 8.44987 35.1341C8.37572 35.133 8.30261 35.132 8.22949 35.1309Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M24.6121 8.47097C24.4982 8.47097 24.3843 8.47106 24.2705 8.47106C24.3844 8.3928 24.4983 8.39476 24.6121 8.47097Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M55.0295 33.6562C54.9047 33.6594 54.7799 33.6625 54.6553 33.6657C54.7778 33.579 54.9027 33.5769 55.0295 33.6562Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.8184 22.7832C23.0207 22.8008 23.223 22.8184 23.4251 22.8358C23.2228 22.8183 23.0206 22.8007 22.8184 22.7832Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M35.6758 41.5664C35.6711 41.7067 35.6665 41.8471 35.6621 41.9867C35.6668 41.8462 35.6713 41.7064 35.6758 41.5664Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M30.1475 19.2149C30.1489 19.0695 30.1503 18.9241 30.1518 18.7793C30.1504 18.9249 30.149 19.0699 30.1475 19.2149Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26.8652 23.1385C27.0056 23.0693 27.147 23.0577 27.2899 23.131C27.1482 23.1335 27.0068 23.136 26.8652 23.1385Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.9883 42.8604C13.999 42.9889 14.0097 43.1174 14.0203 43.2456C14.0095 43.117 13.9989 42.9887 13.9883 42.8604Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M47.0371 35.4566C47.1772 35.4057 47.3167 35.3791 47.4543 35.4642C47.3152 35.4616 47.1761 35.4592 47.0371 35.4566Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.897 27.9473C13.8854 28.0485 13.8738 28.1498 13.8623 28.2504C13.8739 28.149 13.8854 28.0482 13.897 27.9473Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.77925 57.2949C5.77204 57.3935 5.76493 57.492 5.75781 57.5899C5.76521 57.4912 5.77223 57.393 5.77925 57.2949Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M35.6289 42.4336C35.6522 42.5077 35.6755 42.582 35.6988 42.6562C35.5432 42.6938 35.5199 42.6196 35.6289 42.4336Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M44.9854 35.2897C45.1121 35.2891 45.2389 35.2886 45.3656 35.2881C45.2391 35.3482 45.1124 35.3895 44.9854 35.2897Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.0586 43.4697C14.0629 43.5821 14.0672 43.6945 14.0713 43.8065C14.0669 43.694 14.0627 43.5819 14.0586 43.4697Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.9697 26.502C15.9762 26.6076 15.9827 26.7132 15.9895 26.8182C15.983 26.7124 15.9764 26.6072 15.9697 26.502Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M24.0127 22.9678C24.1323 22.9834 24.252 22.999 24.3715 23.0146C24.2519 22.9989 24.1322 22.9834 24.0127 22.9678Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.4551 32.2266C13.4567 32.3267 13.4583 32.427 13.4601 32.5267C13.4585 32.4263 13.4569 32.3265 13.4551 32.2266Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M53.8412 57.7842C53.7613 57.7855 53.6816 57.7867 53.6025 57.7884C53.6826 57.7874 53.7619 57.7858 53.8412 57.7842Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M31.5647 53.2087C31.7258 54.119 30.3111 55.0093 30.1989 53.7152C30.1579 53.242 30.4743 52.9093 30.8287 52.62C31.3316 52.2095 31.6125 52.6026 31.5647 53.2087Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.9701 42.1025C16.3034 42.2389 18.8497 43.0687 17.527 43.486C17.1769 43.5965 16.6477 43.613 16.3442 43.4183C15.9791 43.1841 15.6108 42.4929 15.9701 42.1025Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.5971 29.7746C17.4614 29.6743 18.2577 31.0938 17.1922 31.0477C16.4165 31.0141 15.3734 29.7746 16.5971 29.7746Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.6892 33.2549C20.4109 33.8846 19.0732 35.2938 18.5421 34.7484C18.2709 34.4698 18.521 33.8696 18.7448 33.6365C18.9746 33.3973 19.3833 33.3523 19.6892 33.2549Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.8372 49.5793C21.4112 49.647 19.5375 50.2592 19.9283 49.1471C20.0773 48.7231 20.493 48.8489 20.8729 48.8684C21.4854 48.8996 21.8372 48.8703 21.8372 49.5793Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.6033 52.4434C21.2411 52.7846 20.3088 54.6942 19.7801 54.2879C19.0466 53.7241 20.0498 52.6149 20.6033 52.4434Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23.3855 50.9084C23.6957 50.7818 25.1577 52.1881 24.6011 52.5793C24.3159 52.7798 23.7754 52.4361 23.6035 52.2288C23.281 51.8401 23.2518 51.3606 23.3855 50.9084Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.9495 39.4131C15.2665 39.4651 15.8138 39.4816 15.8343 39.927C15.8522 40.3186 15.3614 40.4454 15.0159 40.4761C14.6573 40.5079 14.1827 40.4067 14.1758 39.956C14.1686 39.4696 14.9383 39.4989 14.9495 39.4131Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.7667 58.7969C23.1043 59.0018 24.679 59.7397 24.004 60.2728C23.7514 60.4723 22.9857 60.0602 22.8133 59.8508C22.6077 59.6009 22.4067 59.0153 22.7667 58.7969Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M27.1436 53.4427C27.0948 52.6282 28.469 52.304 28.1841 53.4601C28.1038 53.7861 28.0261 54.2808 27.623 54.2997C27.1467 54.3221 27.1295 53.7585 27.1436 53.4427Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.8994 39.2795C22.9089 39.8974 21.725 40.4422 21.7159 39.4629C21.7077 38.5877 22.9436 38.3316 22.8994 39.2795Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.1172 36.0615C22.4089 36.1555 22.7966 36.2039 22.8223 36.5745C22.8495 36.9668 22.4852 37.1414 22.1573 37.1194C21.8884 37.1013 21.4906 36.9023 21.4417 36.6106C21.3701 36.1824 21.788 36.1544 22.1172 36.0615Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.6934 47.3733C16.6884 46.8635 17.7102 46.2508 17.8983 46.8423C17.9585 47.0316 17.477 47.8804 17.3168 47.944C16.893 48.1122 16.8338 47.7202 16.6934 47.3733Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M25.0655 55.8587C24.7202 56.1677 23.6845 57.0358 23.7619 55.8705C23.8114 55.126 25.1565 55.1649 25.0655 55.8587Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M41.9395 59.1899C42.0527 58.6999 43.673 59.55 43.1323 60.1689C42.9508 60.3766 42.4763 60.1886 42.2938 60.0655C41.9327 59.8218 41.9249 59.5969 41.9395 59.1899Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M32.9111 48.7012C32.9743 48.4828 33.0445 48.0965 33.2529 47.9571C33.63 47.7049 33.9583 48.0854 33.9584 48.4863C33.9585 49.2343 33.1071 49.4702 32.9111 48.7012Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8953 57.4463C29.316 57.5427 30.2527 58.5654 29.7095 58.9826C29.1866 59.3841 28.4912 57.7518 28.8953 57.4463Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M29.2966 49.7061C29.8375 49.7492 30.581 50.6252 29.7402 50.7644C29.0826 50.8734 28.3177 49.9206 29.2966 49.7061Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M34.193 53.7364C34.3286 53.2794 35.6702 53.769 35.5948 54.2721C35.5547 54.5396 35.0062 54.6024 34.7179 54.5317C34.2934 54.4276 34.1832 54.1491 34.193 53.7364Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.38 28.2161C18.3897 27.6254 19.5248 27.3846 19.608 27.9799C19.6832 28.5178 18.3658 29.09 18.38 28.2161Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M33.8184 59.8238C33.9002 59.5268 33.9355 59.1693 34.3065 59.1301C34.7313 59.0853 34.7188 59.4111 34.6689 59.7487C34.5329 60.6671 34.0139 60.713 33.8184 59.8238Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.8925 35.2439C15.3007 35.3774 14.2169 34.2377 14.8794 33.9932C15.3461 33.8206 15.8925 34.9 15.8925 35.2439Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23.4406 44.0968C23.1394 44.2387 23.0701 44.3247 22.8387 44.092C22.6373 43.8893 22.6462 43.3246 22.8191 43.1138C23.4813 42.3064 23.4658 43.7701 23.4406 44.0968Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M25.897 42.46C26.2111 42.4999 27.1444 43.3852 26.6584 43.737C26.0629 44.168 25.726 42.8178 25.897 42.46Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M32.693 42.693C32.4647 43.5722 31.8948 42.9806 31.9271 42.3154C31.979 41.2498 32.5695 42.1778 32.693 42.693Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M36.1579 56.8125C36.5441 56.9723 37.0684 58.4488 36.5167 58.528C35.8971 58.6169 36.1034 57.1199 36.1579 56.8125Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M31.3344 55.9829C31.7763 55.8338 31.9383 56.7661 31.6814 56.9393C31.1162 57.3203 31.2354 56.2029 31.3344 55.9829Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M27.1439 53.4424C27.1383 53.5661 27.1328 53.6899 27.127 53.8129C27.1325 53.689 27.1381 53.5657 27.1439 53.4424Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M41.9397 59.1895C41.9351 59.3164 41.9306 59.4432 41.9258 59.5695C41.9302 59.4424 41.935 59.3159 41.9397 59.1895Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M34.1934 53.7363C34.191 53.844 34.1884 53.9516 34.1855 54.0587C34.188 53.9507 34.1908 53.8435 34.1934 53.7363Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.404 17.9841C21.9566 17.8667 21.8728 17.2379 21.9447 16.8518C22.0262 16.6656 22.1077 16.4796 22.1893 16.2935C22.1574 16.2247 22.1255 16.1559 22.0937 16.0871C22.1346 15.7038 22.03 15.5373 22.4705 15.6925C23.2887 15.981 23.4195 17.9545 22.404 17.9841Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M29.0265 16.768C29.3951 16.739 30.0645 17.1682 29.6976 17.5835C29.4703 17.8408 28.7213 17.7191 28.4157 17.7728C28.0105 17.844 27.5878 17.9415 27.807 17.3345C27.9792 16.8578 28.5941 16.7555 29.0265 16.768Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.6388 19.623C28.2644 19.3228 28.4315 17.9553 29.0012 18.2013C29.5874 18.4546 28.9512 19.4257 28.6388 19.623Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.9447 16.8516C21.9447 16.9955 21.9446 17.1394 21.9443 17.2827C21.8662 17.1385 21.8687 16.995 21.9447 16.8516Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.4043 17.9839C22.4806 17.9818 22.557 17.9795 22.6323 17.9775C22.5557 17.98 22.48 17.9819 22.4043 17.9839Z"
                    fill="black"
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M68.6307 57.3659C68.5956 57.9879 67.9277 57.5281 67.9751 57.1119C68.0611 56.3568 68.4881 57.1031 68.6307 57.3659Z"
                    fill="black"
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={[styles.WhatText, dynamicStyles.TextColor]}>
            What’s Up
          </Text>
          {showSection ? (
            <View style={[styles.InstagramContainer]}>
              <View style={[styles.ProfileSetUp, dynamicStyles.DivContainer]}>
                <View style={styles.ProfileTexting}>
                  <Text style={[styles.SetUpText, dynamicStyles.TextColor]}>
                    Complete your profile set up
                  </Text>
                  <Text style={[styles.SetUpSubText, dynamicStyles.TextColor]}>
                    To personalize your experience and let you take full
                    advantage of everything we offer, we encourage you to
                    complete your profile settings. A well-rounded profile lets
                    you showcase your expertise, interests, and goals.
                  </Text>
                  <View style={{paddingTop: 10}} />
                  <TouchableOpacity
                    style={[styles.GotoButton, dynamicStyles.Button]}
                    onPress={() => navigation.navigate('Settings')}>
                    <Svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        d="M3.33331 4.16667H13.3333M13.3333 4.16667C13.3333 5.08714 14.0795 5.83333 15 5.83333C15.9205 5.83333 16.6666 5.08714 16.6666 4.16667C16.6666 3.24619 15.9205 2.5 15 2.5C14.0795 2.5 13.3333 3.24619 13.3333 4.16667ZM6.66665 10H16.6666M6.66665 10C6.66665 10.9205 5.92045 11.6667 4.99998 11.6667C4.07951 11.6667 3.33331 10.9205 3.33331 10C3.33331 9.07953 4.07951 8.33333 4.99998 8.33333C5.92045 8.33333 6.66665 9.07953 6.66665 10ZM3.33331 15.8333H13.3333M13.3333 15.8333C13.3333 16.7538 14.0795 17.5 15 17.5C15.9205 17.5 16.6666 16.7538 16.6666 15.8333C16.6666 14.9129 15.9205 14.1667 15 14.1667C14.0795 14.1667 13.3333 14.9129 13.3333 15.8333Z"
                        stroke="#FF6DFB"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </Svg>

                    <Text style={[styles.GotoText2, dynamicStyles.TextColor]}>
                      {' '}
                      Go to settings
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.IconAA} onPress={toggleSection}>
                  <Svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M18 6L6 18M18 18L6 6.00001"
                      stroke={strokeColor}
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {showSection1 ? (
            <View style={styles.InstagramContainer}>
              <View style={[styles.ProfileSetUp, dynamicStyles.DivContainer]}>
                <View style={styles.ProfileTexting}>
                  <Text style={[styles.SetUpText, dynamicStyles.TextColor]}>
                    Link your Social Media Accounts
                  </Text>
                  <Text style={[styles.SetUpSubText, dynamicStyles.TextColor]}>
                    You need to link your social media accounts to Trendit³
                    before you can start earning. Click the button below to link
                    your social media accounts now.
                  </Text>
                  <View style={{paddingTop: 10}} />

                  <TouchableOpacity
                    style={[styles.GotoButton3, dynamicStyles.Button]}
                    onPress={() => setIsModal1Visible(true)}>
                    <Text style={[styles.GotoText2, dynamicStyles.TextColor]}>
                      {' '}
                      Link Your Account
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.IconAA}
                  onPress={toggleSection1}>
                  <Svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M18 6L6 18M18 18L6 6.00001"
                      stroke={strokeColor}
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </Svg>
                </TouchableOpacity>
                {/* </View> */}
              </View>
            </View>
          ) : (
            <View style={{paddingBottom: 20}} />
          )}
        </View>
      </ScrollView>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isModal1Visible}
        onRequestClose={() => setIsModal1Visible(false)}>
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
                  onPress={() => setIsModal1Visible(false)}>
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

                <View style={styles.InstagramContainer}>
                  <View
                    style={[styles.ProfileSetUp2, dynamicStyles.DivContainer]}>
                    <>
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
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 15,
                                  fontFamily: 'Manrope-Bold',
                                }}>
                                Instagram
                              </Text>
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
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 15,
                                  fontFamily: 'Manrope-Bold',
                                }}>
                                Facebook
                              </Text>
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
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 15,
                                  fontFamily: 'Manrope-Bold',
                                }}>
                                Twitter
                              </Text>
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
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 15,
                                  fontFamily: 'Manrope-Bold',
                                }}>
                                Tiktok
                              </Text>
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
                    </>

                    {userSocials.length > 0 && (
                      <>
                        {isProfileAvailable('instagram') && (
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
                                      <Stop
                                        offset="0.128"
                                        stop-color="#3771C8"
                                      />
                                      <Stop
                                        offset="1"
                                        stop-color="#6600FF"
                                        stop-opacity="0"
                                      />
                                    </RadialGradient>
                                  </Defs>
                                </Svg>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Instagram
                                </Text>
                              </View>
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
                        )}
                        <View style={{paddingTop: 10}} />
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
                          {isProfileAvailable('facebook') && (
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
                                    d="M47 24.0898C47 11.1112 36.4786 0.589844 23.5 0.589844C10.5214 0.589844 0 11.1112 0 24.0898C0 35.8193 8.59366 45.5415 19.8281 47.3044V30.8828H13.8613V24.0898H19.8281V18.9125C19.8281 13.0228 23.3366 9.76953 28.7045 9.76953C31.2756 9.76953 33.9648 10.2285 33.9648 10.2285V16.0117H31.0016C28.0823 16.0117 27.1719 17.8232 27.1719 19.6818V24.0898H33.6895L32.6476 30.8828H27.1719V47.3044C38.4063 45.5415 47 35.8195 47 24.0898Z"
                                    fill="#1877F2"
                                  />
                                  <Path
                                    d="M32.6476 30.8828L33.6895 24.0898H27.1719V19.6818C27.1719 17.8231 28.0823 16.0117 31.0016 16.0117H33.9648V10.2285C33.9648 10.2285 31.2756 9.76953 28.7043 9.76953C23.3366 9.76953 19.8281 13.0228 19.8281 18.9125V24.0898H13.8613V30.8828H19.8281V47.3044C21.0428 47.4947 22.2705 47.5902 23.5 47.5898C24.7295 47.5902 25.9572 47.4948 27.1719 47.3044V30.8828H32.6476Z"
                                    fill="white"
                                  />
                                </Svg>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Facebook
                                </Text>
                              </View>
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
                          )}
                        </View>
                        <View style={{paddingTop: 10}} />
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
                          {isProfileAvailable('twitter') && (
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
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Twitter
                                </Text>
                              </View>
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
                          )}
                        </View>

                        <View style={{paddingTop: 10}} />
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
                          {isProfileAvailable('tiktok') && (
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
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontFamily: 'Manrope-Bold',
                                  }}>
                                  Tiktok
                                </Text>
                              </View>
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
                          )}
                        </View>
                        <View style={{paddingTop: 10}} />
                      </>
                    )}
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </>
        </View>
      </Modal>
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
                    paddingVertical: 30,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 24,
                      fontFamily: 'Manrope-ExtraBold',
                      paddingBottom: 10,
                      paddingTop: 20,
                    }}>
                    Fund Wallet
                  </Text>
                  <Text
                    style={{
                      color: '#b1b1b1',
                      fontSize: 12,
                      fontWeight: 400,
                      fontFamily: 'Manrope-Regular',
                      textAlign: 'center',
                      paddingHorizontal: 20,
                    }}>
                    Please enter the amount which you like to fund your wallet
                    with
                  </Text>
                </View>
                <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
                  <Text style={{color: '#fff', paddingBottom: 5}}>Amount</Text>
                  <TextInput
                    placeholder="₦ Amount"
                    style={{
                      backgroundColor: '#fff',
                      color: '#000',
                      padding: 10,
                      borderRadius: 10,
                    }}
                    keyboardType="numeric"
                    placeholderTextColor={'#000'}
                    value={amount}
                    selectionColor={'#000'}
                    onChangeText={setAmount}
                  />
                  <Text
                    style={{fontSize: 10, paddingTop: 10, paddingBottom: 10}}>
                    You can choose your preferred method of payment such as Card
                    payment, Bank transfer or USSD, simply by clicking on th
                    “Change Payment” button.
                  </Text>
                </View>
                <View style={{paddingHorizontal: 10, paddingBottom: 30}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#CB29BE',
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '90%',
                      borderRadius: 110,
                      alignSelf: 'center',
                    }}
                    onPress={handleCreditWallet}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Manrope-Regular',
                        fontSize: 14,
                      }}>
                      Fund Wallet
                    </Text>
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
                    disabled={isLoading}>
                    {isLoading ? (
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
                    disabled={isLoading}>
                    {isLoading ? (
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
                    disabled={isLoading}>
                    {isLoading ? (
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
                    disabled={isLoading}>
                    {isLoading ? (
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    width: '100%',
  },

  walletBalanceContainer: {
    backgroundColor: '#EEFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 230,
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
  WalletBalance: {
    fontSize: 14,
    paddingBottom: 10,
    fontFamily: 'Manrope-Medium',
    color: '#000',
  },
  WalletAmount: {
    fontFamily: 'Manrope-Regular',
    fontSize: 40,
    color: '#000',
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
  advert: {
    backgroundColor: '#EEFFFF',
    height: 180,
    width: '45%',
    borderRadius: 4,
    position: 'relative',
  },
  advertText: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 16,
    padding: 5,
    paddingTop: 50,
    paddingLeft: 10,
    color: '#000',
  },
  advertSubText: {
    fontFamily: 'Manrope-Regular',
    padding: 5,
    fontSize: 13,
    paddingLeft: 10,
    color: '#000',
  },
  AdvertImage: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    width: 80,
    height: 80,
  },
  AdvertImage1: {
    position: 'absolute',
    right: 30,
    top: 20,
    width: 14,
    height: 13,
  },
  task: {
    backgroundColor: '#FFEEEE',
    height: 180,
    width: '45%',
    borderRadius: 4,
    position: 'relative',
  },
  TaskImage: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    width: 60,
    height: 60,
  },
  WhatText: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'Manrope-Medium',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ProfileSetUp: {
    backgroundColor: '#171717',
    flexDirection: 'row',
    paddingVertical: 30,
    width: '100%',
  },
  ProfileSetUp2: {
    backgroundColor: '#171717',
    paddingVertical: 30,
    paddingHorizontal: 10,
    width: '100%',
    height: 'auto',
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
    width: '100%',
  },
  IconAA: {
    // paddingLeft: 30,
  },
  ProfileTexting: {
    width: '92%',
    paddingBottom: 20,
    justifyContent: 'center',
    color: '#000',
    padding: 10,
  },
  GotoButton: {
    width: '50%',
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
    width: 'auto',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 1,
    padding: 2,
  },
  GotoButton3: {
    width: '50%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    gap: 1,
  },
  GotoText: {
    color: '#fff',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
  },
  GotoText2: {
    color: '#fff',
    fontFamily: 'Manrope-ExtraBold',
  },
  InstagramContainer: {
    width: '91%',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingBottom: 20,
  },
});

export default Home;
