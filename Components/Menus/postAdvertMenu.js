/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  Svg,
  Path,
  Stop,
  Defs,
  LinearGradient,
  RadialGradient,
  G,
  Rect,
  ClipPath,
} from 'react-native-svg';
import {useTheme} from '../../Components/Contexts/colorTheme';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import queryString from 'query-string';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiLink} from '../../enums/apiLink';

const PostAdvertMenu = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [txRef, setTxRef] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const homeScreenUrl = 'https://blaziod.github.io';
  const {theme} = useTheme();
  const [isLoading1, setIsLoading1] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [membership, setMembership] = useState(false);

  const fetchUserAccessToken = () => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        // eslint-disable-next-line no-shadow
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

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#1E1E1E' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
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
        fetchMembershipStatus();
        Alert.alert('Payment Verified');
        // eslint-disable-next-line no-lone-blocks
        {
          membership
            ? navigation.reset({
                index: 0,
                routes: [{name: 'Earn'}],
              })
            : Alert.alert('Payment Not Verified');
        }
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
            fontFamily: 'Campton Bold',
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
            fontFamily: 'Campton Bold',
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
          fontFamily: 'Campton Bold',
        },
      });
    } finally {
      setIsLoading1(false);
    }
  };

  const handleMembershipPayment = async () => {
    const userToken = userAccessToken?.accessToken;
    console.log('Testing', userToken);
    setIsLoading1(true);
    try {
      if (!homeScreenUrl) {
        Alert.alert('Error', 'Callback URL is not defined.');
        return;
      }
      const response = await axios.post(
        `${ApiLink.ENDPOINT_1}/payment/membership-fee`,

        {amount: Number(1000)},
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
            fontFamily: 'Campton Bold',
          },
        });
        console.log(response.data);
        const url = response.data.authorization_url;
        console.log('URL:', url); // replace with the actual URL you want to redirect to

        Linking.openURL(url);
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
          fontFamily: 'Campton Bold',
        },
      });
    } finally {
      setIsLoading1(false);
    }
  };

  const fetchMembershipStatus = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          `${ApiLink.ENDPOINT_1}/payment/membership-fee`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAccessToken.accessToken}`, // Add the access token to the headers
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log('Membership Status:', data);
          AsyncStorage.setItem(
            'membershipstatus',
            JSON.stringify({
              status: data,
            }),
          )
            .then(() => {
              setMembership(data.membership_status);
              console.log('here', membership);
              console.log('Status Stored', data);
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
        console.error('Error during balance fetch:', error);
      }
    } else {
      console.log('No access token found');
    }
  };

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <View style={styles.Container}>
            <View style={[styles.Advert1, dynamicStyles.DivContainer]}>
              <Svg
                width="47"
                height="48"
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

              <View style={styles.Check}>
                <Text
                  style={[
                    {color: '#fff', fontFamily: 'CamptonMedium'},
                    dynamicStyles.TextColor,
                  ]}>
                  {' '}
                  Post Adverts on Your FaceBook Page
                </Text>
                <Text
                  style={[
                    {
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      paddingTop: 10,
                      fontSize: 12,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Post adverts of various businesses and top brands on your
                  Facebook Page and earn ₦110 per advert past. The more you
                  post, the more you earn. Note that your Facebook account must
                  have at least 500 Active Followers to be eligible for this
                  task.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    <View style={styles.wallet}>
                      <Svg
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M3.60683 14.6021L3.83382 14.1566L3.60683 14.6021ZM2.98772 13.983L3.43322 13.756H3.43322L2.98772 13.983ZM13.3931 14.6021L13.1661 14.1566L13.1661 14.1566L13.3931 14.6021ZM14.0122 13.983L13.5667 13.756V13.756L14.0122 13.983ZM13.3931 4.99429L13.1661 5.43979L13.1661 5.43979L13.3931 4.99429ZM14.0122 5.6134L13.5667 5.84039L14.0122 5.6134ZM3.60683 4.99429L3.37983 4.54879L3.60683 4.99429ZM2.98772 5.6134L2.54222 5.3864L2.98772 5.6134ZM11.0117 11.1377L11.2387 10.6922L11.0117 11.1377ZM10.7022 10.8281L11.1477 10.6011L10.7022 10.8281ZM15.5061 10.8281L15.0606 10.6011L15.5061 10.8281ZM15.1966 11.1377L14.9696 10.6922L15.1966 11.1377ZM15.1966 8.45875L14.9696 8.90426L15.1966 8.45875ZM15.5061 8.76831L15.0606 8.9953L15.5061 8.76831ZM11.0117 8.45875L11.2387 8.90426L11.0117 8.45875ZM10.7022 8.76831L11.1477 8.9953L10.7022 8.76831ZM4.06428 4.37565C3.80789 4.4782 3.68318 4.76919 3.78574 5.02558C3.8883 5.28197 4.17928 5.40668 4.43567 5.30412L4.06428 4.37565ZM10.3619 2.39511L10.1762 1.93087L10.1762 1.93087L10.3619 2.39511ZM10.8333 4.83988C10.8333 5.11603 11.0572 5.33988 11.3333 5.33988C11.6095 5.33988 11.8333 5.11603 11.8333 4.83988H10.8333ZM5.09998 5.33988H11.9V4.33988H5.09998V5.33988ZM11.9 14.2565H5.09998V15.2565H11.9V14.2565ZM3.33331 12.4899V7.10655H2.33331V12.4899H3.33331ZM13.6666 7.10655V8.55863H14.6666V7.10655H13.6666ZM13.6666 11.3477V12.4899H14.6666V11.3477H13.6666ZM5.09998 14.2565C4.69503 14.2565 4.42138 14.2562 4.21023 14.2389C4.00492 14.2221 3.90311 14.1919 3.83382 14.1566L3.37983 15.0476C3.61359 15.1667 3.86165 15.2138 4.1288 15.2356C4.39012 15.2569 4.71153 15.2565 5.09998 15.2565V14.2565ZM2.33331 12.4899C2.33331 12.8783 2.33292 13.1997 2.35427 13.4611C2.3761 13.7282 2.42311 13.9763 2.54222 14.21L3.43322 13.756C3.39792 13.6868 3.36773 13.5849 3.35095 13.3796C3.3337 13.1685 3.33331 12.8948 3.33331 12.4899H2.33331ZM3.83382 14.1566C3.66134 14.0688 3.52111 13.9285 3.43322 13.756L2.54222 14.21C2.72597 14.5707 3.01919 14.8639 3.37983 15.0476L3.83382 14.1566ZM11.9 15.2565C12.2884 15.2565 12.6098 15.2569 12.8712 15.2356C13.1383 15.2138 13.3864 15.1667 13.6201 15.0476L13.1661 14.1566C13.0969 14.1919 12.995 14.2221 12.7897 14.2389C12.5786 14.2562 12.3049 14.2565 11.9 14.2565V15.2565ZM13.6666 12.4899C13.6666 12.8948 13.6663 13.1685 13.649 13.3796C13.6322 13.5849 13.602 13.6868 13.5667 13.756L14.4577 14.21C14.5768 13.9763 14.6239 13.7282 14.6457 13.4611C14.667 13.1997 14.6666 12.8783 14.6666 12.4899H13.6666ZM13.6201 15.0476C13.9808 14.8639 14.274 14.5707 14.4577 14.21L13.5667 13.756C13.4789 13.9285 13.3386 14.0688 13.1661 14.1566L13.6201 15.0476ZM11.9 5.33988C12.3049 5.33988 12.5786 5.34027 12.7897 5.35752C12.995 5.3743 13.0969 5.40449 13.1661 5.43979L13.6201 4.54879C13.3864 4.42968 13.1383 4.38267 12.8712 4.36084C12.6098 4.33949 12.2884 4.33988 11.9 4.33988V5.33988ZM14.6666 7.10655C14.6666 6.7181 14.667 6.39669 14.6457 6.13537C14.6239 5.86822 14.5768 5.62016 14.4577 5.3864L13.5667 5.84039C13.602 5.90968 13.6322 6.01149 13.649 6.2168C13.6663 6.42795 13.6666 6.7016 13.6666 7.10655H14.6666ZM13.1661 5.43979C13.3386 5.52768 13.4789 5.66791 13.5667 5.84039L14.4577 5.3864C14.274 5.02576 13.9808 4.73254 13.6201 4.54879L13.1661 5.43979ZM5.09998 4.33988C4.71153 4.33988 4.39012 4.33949 4.1288 4.36084C3.86165 4.38267 3.61359 4.42968 3.37983 4.54879L3.83382 5.43979C3.90311 5.40449 4.00492 5.3743 4.21023 5.35752C4.42138 5.34027 4.69503 5.33988 5.09998 5.33988V4.33988ZM3.33331 7.10655C3.33331 6.7016 3.3337 6.42795 3.35095 6.2168C3.36773 6.01149 3.39792 5.90968 3.43322 5.84039L2.54222 5.3864C2.42311 5.62016 2.3761 5.86822 2.35427 6.13537C2.33292 6.39669 2.33331 6.7181 2.33331 7.10655H3.33331ZM3.37983 4.54879C3.01919 4.73254 2.72597 5.02576 2.54222 5.3864L3.43322 5.84039C3.52111 5.66791 3.66134 5.52768 3.83382 5.43979L3.37983 4.54879ZM11.7583 8.88155H14.45V7.88155H11.7583V8.88155ZM15.0833 9.51488V10.0815H16.0833V9.51488H15.0833ZM14.45 10.7149H11.7583V11.7149H14.45V10.7149ZM11.125 10.0815V9.51488H10.125V10.0815H11.125ZM11.7583 10.7149C11.5517 10.7149 11.4268 10.7145 11.3338 10.7069C11.2466 10.6998 11.2323 10.6889 11.2387 10.6922L10.7847 11.5832C10.9427 11.6637 11.1033 11.6914 11.2524 11.7036C11.3956 11.7153 11.5682 11.7149 11.7583 11.7149V10.7149ZM10.125 10.0815C10.125 10.2717 10.1246 10.4443 10.1363 10.5875C10.1485 10.7365 10.1762 10.8971 10.2567 11.0551L11.1477 10.6011C11.151 10.6076 11.1401 10.5933 11.133 10.5061C11.1254 10.413 11.125 10.2882 11.125 10.0815H10.125ZM11.2387 10.6922C11.1995 10.6722 11.1677 10.6403 11.1477 10.6011L10.2567 11.0551C10.3725 11.2825 10.5574 11.4673 10.7847 11.5832L11.2387 10.6922ZM15.0833 10.0815C15.0833 10.2882 15.0829 10.413 15.0753 10.5061C15.0682 10.5933 15.0573 10.6076 15.0606 10.6011L15.9516 11.0551C16.0321 10.8971 16.0598 10.7365 16.072 10.5875C16.0837 10.4443 16.0833 10.2717 16.0833 10.0815H15.0833ZM14.45 11.7149C14.6401 11.7149 14.8127 11.7153 14.9559 11.7036C15.105 11.6914 15.2656 11.6637 15.4236 11.5832L14.9696 10.6922C14.976 10.6889 14.9617 10.6998 14.8745 10.7069C14.7815 10.7145 14.6566 10.7149 14.45 10.7149V11.7149ZM15.0606 10.6011C15.0406 10.6403 15.0088 10.6722 14.9696 10.6922L15.4236 11.5832C15.6509 11.4673 15.8358 11.2825 15.9516 11.0551L15.0606 10.6011ZM14.45 8.88155C14.6566 8.88155 14.7815 8.88194 14.8745 8.88954C14.9617 8.89666 14.976 8.90756 14.9696 8.90426L15.4236 8.01325C15.2656 7.93275 15.105 7.90504 14.9559 7.89286C14.8127 7.88116 14.6401 7.88155 14.45 7.88155V8.88155ZM16.0833 9.51488C16.0833 9.32478 16.0837 9.15213 16.072 9.00893C16.0598 8.8599 16.0321 8.69931 15.9516 8.54131L15.0606 8.9953C15.0573 8.98883 15.0682 9.00317 15.0753 9.09037C15.0829 9.1834 15.0833 9.30828 15.0833 9.51488H16.0833ZM14.9696 8.90426C15.0088 8.92423 15.0406 8.9561 15.0606 8.9953L15.9516 8.54131C15.8358 8.31395 15.6509 8.1291 15.4236 8.01325L14.9696 8.90426ZM11.7583 7.88155C11.5682 7.88155 11.3956 7.88116 11.2524 7.89286C11.1033 7.90504 10.9427 7.93275 10.7847 8.01325L11.2387 8.90426C11.2323 8.90756 11.2466 8.89666 11.3338 8.88954C11.4268 8.88194 11.5517 8.88155 11.7583 8.88155V7.88155ZM11.125 9.51488C11.125 9.30828 11.1254 9.1834 11.133 9.09037C11.1401 9.00317 11.151 8.98883 11.1477 8.9953L10.2567 8.54131C10.1762 8.69931 10.1485 8.8599 10.1363 9.00894C10.1246 9.15213 10.125 9.32478 10.125 9.51488H11.125ZM10.7847 8.01325C10.5574 8.1291 10.3725 8.31395 10.2567 8.54131L11.1477 8.9953C11.1677 8.9561 11.1995 8.92423 11.2387 8.90426L10.7847 8.01325ZM4.43567 5.30412L10.5476 2.85935L10.1762 1.93087L4.06428 4.37565L4.43567 5.30412ZM10.8333 3.05278V4.83988H11.8333V3.05278H10.8333ZM10.5476 2.85935C10.6845 2.80461 10.8333 2.90539 10.8333 3.05278H11.8333C11.8333 2.19793 10.9699 1.61339 10.1762 1.93087L10.5476 2.85935Z"
                          fill="#B1B1B1"
                        />
                      </Svg>
                    </View>

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
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'Campton Bold',
                        fontSize: 12,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    ₦110 per Advert Post
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      height: 35,
                      backgroundColor: '#FF6DFB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 109,
                      borderTopRightRadius: 4,
                      borderTopLeftRadius: 4,
                    }}
                    onPress={() => setModalVisible(true)}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonMedium',
                        fontSize: 10,
                      }}>
                      Generate Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.Container1}>
            <View style={[styles.Advert1, dynamicStyles.DivContainer]}>
              <Svg
                width="47"
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

              <View style={styles.Check}>
                <Text
                  style={[
                    {color: '#fff', fontFamily: 'CamptonMedium'},
                    dynamicStyles.TextColor,
                  ]}>
                  {' '}
                  Post Adverts on Your Tiktok Account
                </Text>
                <Text
                  style={[
                    {
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      paddingTop: 10,
                      fontSize: 12,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Post adverts of various businesses and top brands on your
                  Tiktok Page and earn ₦110 per advert past. The more you post,
                  the more you earn. Note that your Tiktok account must have at
                  least 500 Active Followers to be eligible for this task.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    <View style={styles.wallet}>
                      <Svg
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M3.60683 14.6021L3.83382 14.1566L3.60683 14.6021ZM2.98772 13.983L3.43322 13.756H3.43322L2.98772 13.983ZM13.3931 14.6021L13.1661 14.1566L13.1661 14.1566L13.3931 14.6021ZM14.0122 13.983L13.5667 13.756V13.756L14.0122 13.983ZM13.3931 4.99429L13.1661 5.43979L13.1661 5.43979L13.3931 4.99429ZM14.0122 5.6134L13.5667 5.84039L14.0122 5.6134ZM3.60683 4.99429L3.37983 4.54879L3.60683 4.99429ZM2.98772 5.6134L2.54222 5.3864L2.98772 5.6134ZM11.0117 11.1377L11.2387 10.6922L11.0117 11.1377ZM10.7022 10.8281L11.1477 10.6011L10.7022 10.8281ZM15.5061 10.8281L15.0606 10.6011L15.5061 10.8281ZM15.1966 11.1377L14.9696 10.6922L15.1966 11.1377ZM15.1966 8.45875L14.9696 8.90426L15.1966 8.45875ZM15.5061 8.76831L15.0606 8.9953L15.5061 8.76831ZM11.0117 8.45875L11.2387 8.90426L11.0117 8.45875ZM10.7022 8.76831L11.1477 8.9953L10.7022 8.76831ZM4.06428 4.37565C3.80789 4.4782 3.68318 4.76919 3.78574 5.02558C3.8883 5.28197 4.17928 5.40668 4.43567 5.30412L4.06428 4.37565ZM10.3619 2.39511L10.1762 1.93087L10.1762 1.93087L10.3619 2.39511ZM10.8333 4.83988C10.8333 5.11603 11.0572 5.33988 11.3333 5.33988C11.6095 5.33988 11.8333 5.11603 11.8333 4.83988H10.8333ZM5.09998 5.33988H11.9V4.33988H5.09998V5.33988ZM11.9 14.2565H5.09998V15.2565H11.9V14.2565ZM3.33331 12.4899V7.10655H2.33331V12.4899H3.33331ZM13.6666 7.10655V8.55863H14.6666V7.10655H13.6666ZM13.6666 11.3477V12.4899H14.6666V11.3477H13.6666ZM5.09998 14.2565C4.69503 14.2565 4.42138 14.2562 4.21023 14.2389C4.00492 14.2221 3.90311 14.1919 3.83382 14.1566L3.37983 15.0476C3.61359 15.1667 3.86165 15.2138 4.1288 15.2356C4.39012 15.2569 4.71153 15.2565 5.09998 15.2565V14.2565ZM2.33331 12.4899C2.33331 12.8783 2.33292 13.1997 2.35427 13.4611C2.3761 13.7282 2.42311 13.9763 2.54222 14.21L3.43322 13.756C3.39792 13.6868 3.36773 13.5849 3.35095 13.3796C3.3337 13.1685 3.33331 12.8948 3.33331 12.4899H2.33331ZM3.83382 14.1566C3.66134 14.0688 3.52111 13.9285 3.43322 13.756L2.54222 14.21C2.72597 14.5707 3.01919 14.8639 3.37983 15.0476L3.83382 14.1566ZM11.9 15.2565C12.2884 15.2565 12.6098 15.2569 12.8712 15.2356C13.1383 15.2138 13.3864 15.1667 13.6201 15.0476L13.1661 14.1566C13.0969 14.1919 12.995 14.2221 12.7897 14.2389C12.5786 14.2562 12.3049 14.2565 11.9 14.2565V15.2565ZM13.6666 12.4899C13.6666 12.8948 13.6663 13.1685 13.649 13.3796C13.6322 13.5849 13.602 13.6868 13.5667 13.756L14.4577 14.21C14.5768 13.9763 14.6239 13.7282 14.6457 13.4611C14.667 13.1997 14.6666 12.8783 14.6666 12.4899H13.6666ZM13.6201 15.0476C13.9808 14.8639 14.274 14.5707 14.4577 14.21L13.5667 13.756C13.4789 13.9285 13.3386 14.0688 13.1661 14.1566L13.6201 15.0476ZM11.9 5.33988C12.3049 5.33988 12.5786 5.34027 12.7897 5.35752C12.995 5.3743 13.0969 5.40449 13.1661 5.43979L13.6201 4.54879C13.3864 4.42968 13.1383 4.38267 12.8712 4.36084C12.6098 4.33949 12.2884 4.33988 11.9 4.33988V5.33988ZM14.6666 7.10655C14.6666 6.7181 14.667 6.39669 14.6457 6.13537C14.6239 5.86822 14.5768 5.62016 14.4577 5.3864L13.5667 5.84039C13.602 5.90968 13.6322 6.01149 13.649 6.2168C13.6663 6.42795 13.6666 6.7016 13.6666 7.10655H14.6666ZM13.1661 5.43979C13.3386 5.52768 13.4789 5.66791 13.5667 5.84039L14.4577 5.3864C14.274 5.02576 13.9808 4.73254 13.6201 4.54879L13.1661 5.43979ZM5.09998 4.33988C4.71153 4.33988 4.39012 4.33949 4.1288 4.36084C3.86165 4.38267 3.61359 4.42968 3.37983 4.54879L3.83382 5.43979C3.90311 5.40449 4.00492 5.3743 4.21023 5.35752C4.42138 5.34027 4.69503 5.33988 5.09998 5.33988V4.33988ZM3.33331 7.10655C3.33331 6.7016 3.3337 6.42795 3.35095 6.2168C3.36773 6.01149 3.39792 5.90968 3.43322 5.84039L2.54222 5.3864C2.42311 5.62016 2.3761 5.86822 2.35427 6.13537C2.33292 6.39669 2.33331 6.7181 2.33331 7.10655H3.33331ZM3.37983 4.54879C3.01919 4.73254 2.72597 5.02576 2.54222 5.3864L3.43322 5.84039C3.52111 5.66791 3.66134 5.52768 3.83382 5.43979L3.37983 4.54879ZM11.7583 8.88155H14.45V7.88155H11.7583V8.88155ZM15.0833 9.51488V10.0815H16.0833V9.51488H15.0833ZM14.45 10.7149H11.7583V11.7149H14.45V10.7149ZM11.125 10.0815V9.51488H10.125V10.0815H11.125ZM11.7583 10.7149C11.5517 10.7149 11.4268 10.7145 11.3338 10.7069C11.2466 10.6998 11.2323 10.6889 11.2387 10.6922L10.7847 11.5832C10.9427 11.6637 11.1033 11.6914 11.2524 11.7036C11.3956 11.7153 11.5682 11.7149 11.7583 11.7149V10.7149ZM10.125 10.0815C10.125 10.2717 10.1246 10.4443 10.1363 10.5875C10.1485 10.7365 10.1762 10.8971 10.2567 11.0551L11.1477 10.6011C11.151 10.6076 11.1401 10.5933 11.133 10.5061C11.1254 10.413 11.125 10.2882 11.125 10.0815H10.125ZM11.2387 10.6922C11.1995 10.6722 11.1677 10.6403 11.1477 10.6011L10.2567 11.0551C10.3725 11.2825 10.5574 11.4673 10.7847 11.5832L11.2387 10.6922ZM15.0833 10.0815C15.0833 10.2882 15.0829 10.413 15.0753 10.5061C15.0682 10.5933 15.0573 10.6076 15.0606 10.6011L15.9516 11.0551C16.0321 10.8971 16.0598 10.7365 16.072 10.5875C16.0837 10.4443 16.0833 10.2717 16.0833 10.0815H15.0833ZM14.45 11.7149C14.6401 11.7149 14.8127 11.7153 14.9559 11.7036C15.105 11.6914 15.2656 11.6637 15.4236 11.5832L14.9696 10.6922C14.976 10.6889 14.9617 10.6998 14.8745 10.7069C14.7815 10.7145 14.6566 10.7149 14.45 10.7149V11.7149ZM15.0606 10.6011C15.0406 10.6403 15.0088 10.6722 14.9696 10.6922L15.4236 11.5832C15.6509 11.4673 15.8358 11.2825 15.9516 11.0551L15.0606 10.6011ZM14.45 8.88155C14.6566 8.88155 14.7815 8.88194 14.8745 8.88954C14.9617 8.89666 14.976 8.90756 14.9696 8.90426L15.4236 8.01325C15.2656 7.93275 15.105 7.90504 14.9559 7.89286C14.8127 7.88116 14.6401 7.88155 14.45 7.88155V8.88155ZM16.0833 9.51488C16.0833 9.32478 16.0837 9.15213 16.072 9.00893C16.0598 8.8599 16.0321 8.69931 15.9516 8.54131L15.0606 8.9953C15.0573 8.98883 15.0682 9.00317 15.0753 9.09037C15.0829 9.1834 15.0833 9.30828 15.0833 9.51488H16.0833ZM14.9696 8.90426C15.0088 8.92423 15.0406 8.9561 15.0606 8.9953L15.9516 8.54131C15.8358 8.31395 15.6509 8.1291 15.4236 8.01325L14.9696 8.90426ZM11.7583 7.88155C11.5682 7.88155 11.3956 7.88116 11.2524 7.89286C11.1033 7.90504 10.9427 7.93275 10.7847 8.01325L11.2387 8.90426C11.2323 8.90756 11.2466 8.89666 11.3338 8.88954C11.4268 8.88194 11.5517 8.88155 11.7583 8.88155V7.88155ZM11.125 9.51488C11.125 9.30828 11.1254 9.1834 11.133 9.09037C11.1401 9.00317 11.151 8.98883 11.1477 8.9953L10.2567 8.54131C10.1762 8.69931 10.1485 8.8599 10.1363 9.00894C10.1246 9.15213 10.125 9.32478 10.125 9.51488H11.125ZM10.7847 8.01325C10.5574 8.1291 10.3725 8.31395 10.2567 8.54131L11.1477 8.9953C11.1677 8.9561 11.1995 8.92423 11.2387 8.90426L10.7847 8.01325ZM4.43567 5.30412L10.5476 2.85935L10.1762 1.93087L4.06428 4.37565L4.43567 5.30412ZM10.8333 3.05278V4.83988H11.8333V3.05278H10.8333ZM10.5476 2.85935C10.6845 2.80461 10.8333 2.90539 10.8333 3.05278H11.8333C11.8333 2.19793 10.9699 1.61339 10.1762 1.93087L10.5476 2.85935Z"
                          fill="#B1B1B1"
                        />
                      </Svg>
                    </View>

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
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'Campton Bold',
                        fontSize: 12,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    ₦110 per Advert Post
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      height: 35,
                      backgroundColor: '#FF6DFB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 109,
                      borderTopRightRadius: 4,
                      borderTopLeftRadius: 4,
                    }}
                    onPress={() => setModalVisible(true)}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonMedium',
                        fontSize: 10,
                      }}>
                      Generate Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.Container1}>
            <View style={[styles.Advert1, dynamicStyles.DivContainer]}>
              <Svg
                width="47"
                height="47"
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
                    <Stop offset="1" stop-color="#6600FF" stop-opacity="0" />
                  </RadialGradient>
                </Defs>
              </Svg>

              <View style={styles.Check}>
                <Text
                  style={[
                    {color: '#fff', fontFamily: 'CamptonMedium'},
                    dynamicStyles.TextColor,
                  ]}>
                  {' '}
                  Post Adverts on Your Instagram Page
                </Text>
                <Text
                  style={[
                    {
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      paddingTop: 10,
                      fontSize: 12,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Post adverts of various businesses and top brands on your
                  Instagram Page and earn ₦110 per advert . The more you post,
                  the more you earn. Note that your Instagram account must have
                  at least 500 Active Followers to be eligible for this task.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    <View style={styles.wallet}>
                      <Svg
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M3.60683 14.6021L3.83382 14.1566L3.60683 14.6021ZM2.98772 13.983L3.43322 13.756H3.43322L2.98772 13.983ZM13.3931 14.6021L13.1661 14.1566L13.1661 14.1566L13.3931 14.6021ZM14.0122 13.983L13.5667 13.756V13.756L14.0122 13.983ZM13.3931 4.99429L13.1661 5.43979L13.1661 5.43979L13.3931 4.99429ZM14.0122 5.6134L13.5667 5.84039L14.0122 5.6134ZM3.60683 4.99429L3.37983 4.54879L3.60683 4.99429ZM2.98772 5.6134L2.54222 5.3864L2.98772 5.6134ZM11.0117 11.1377L11.2387 10.6922L11.0117 11.1377ZM10.7022 10.8281L11.1477 10.6011L10.7022 10.8281ZM15.5061 10.8281L15.0606 10.6011L15.5061 10.8281ZM15.1966 11.1377L14.9696 10.6922L15.1966 11.1377ZM15.1966 8.45875L14.9696 8.90426L15.1966 8.45875ZM15.5061 8.76831L15.0606 8.9953L15.5061 8.76831ZM11.0117 8.45875L11.2387 8.90426L11.0117 8.45875ZM10.7022 8.76831L11.1477 8.9953L10.7022 8.76831ZM4.06428 4.37565C3.80789 4.4782 3.68318 4.76919 3.78574 5.02558C3.8883 5.28197 4.17928 5.40668 4.43567 5.30412L4.06428 4.37565ZM10.3619 2.39511L10.1762 1.93087L10.1762 1.93087L10.3619 2.39511ZM10.8333 4.83988C10.8333 5.11603 11.0572 5.33988 11.3333 5.33988C11.6095 5.33988 11.8333 5.11603 11.8333 4.83988H10.8333ZM5.09998 5.33988H11.9V4.33988H5.09998V5.33988ZM11.9 14.2565H5.09998V15.2565H11.9V14.2565ZM3.33331 12.4899V7.10655H2.33331V12.4899H3.33331ZM13.6666 7.10655V8.55863H14.6666V7.10655H13.6666ZM13.6666 11.3477V12.4899H14.6666V11.3477H13.6666ZM5.09998 14.2565C4.69503 14.2565 4.42138 14.2562 4.21023 14.2389C4.00492 14.2221 3.90311 14.1919 3.83382 14.1566L3.37983 15.0476C3.61359 15.1667 3.86165 15.2138 4.1288 15.2356C4.39012 15.2569 4.71153 15.2565 5.09998 15.2565V14.2565ZM2.33331 12.4899C2.33331 12.8783 2.33292 13.1997 2.35427 13.4611C2.3761 13.7282 2.42311 13.9763 2.54222 14.21L3.43322 13.756C3.39792 13.6868 3.36773 13.5849 3.35095 13.3796C3.3337 13.1685 3.33331 12.8948 3.33331 12.4899H2.33331ZM3.83382 14.1566C3.66134 14.0688 3.52111 13.9285 3.43322 13.756L2.54222 14.21C2.72597 14.5707 3.01919 14.8639 3.37983 15.0476L3.83382 14.1566ZM11.9 15.2565C12.2884 15.2565 12.6098 15.2569 12.8712 15.2356C13.1383 15.2138 13.3864 15.1667 13.6201 15.0476L13.1661 14.1566C13.0969 14.1919 12.995 14.2221 12.7897 14.2389C12.5786 14.2562 12.3049 14.2565 11.9 14.2565V15.2565ZM13.6666 12.4899C13.6666 12.8948 13.6663 13.1685 13.649 13.3796C13.6322 13.5849 13.602 13.6868 13.5667 13.756L14.4577 14.21C14.5768 13.9763 14.6239 13.7282 14.6457 13.4611C14.667 13.1997 14.6666 12.8783 14.6666 12.4899H13.6666ZM13.6201 15.0476C13.9808 14.8639 14.274 14.5707 14.4577 14.21L13.5667 13.756C13.4789 13.9285 13.3386 14.0688 13.1661 14.1566L13.6201 15.0476ZM11.9 5.33988C12.3049 5.33988 12.5786 5.34027 12.7897 5.35752C12.995 5.3743 13.0969 5.40449 13.1661 5.43979L13.6201 4.54879C13.3864 4.42968 13.1383 4.38267 12.8712 4.36084C12.6098 4.33949 12.2884 4.33988 11.9 4.33988V5.33988ZM14.6666 7.10655C14.6666 6.7181 14.667 6.39669 14.6457 6.13537C14.6239 5.86822 14.5768 5.62016 14.4577 5.3864L13.5667 5.84039C13.602 5.90968 13.6322 6.01149 13.649 6.2168C13.6663 6.42795 13.6666 6.7016 13.6666 7.10655H14.6666ZM13.1661 5.43979C13.3386 5.52768 13.4789 5.66791 13.5667 5.84039L14.4577 5.3864C14.274 5.02576 13.9808 4.73254 13.6201 4.54879L13.1661 5.43979ZM5.09998 4.33988C4.71153 4.33988 4.39012 4.33949 4.1288 4.36084C3.86165 4.38267 3.61359 4.42968 3.37983 4.54879L3.83382 5.43979C3.90311 5.40449 4.00492 5.3743 4.21023 5.35752C4.42138 5.34027 4.69503 5.33988 5.09998 5.33988V4.33988ZM3.33331 7.10655C3.33331 6.7016 3.3337 6.42795 3.35095 6.2168C3.36773 6.01149 3.39792 5.90968 3.43322 5.84039L2.54222 5.3864C2.42311 5.62016 2.3761 5.86822 2.35427 6.13537C2.33292 6.39669 2.33331 6.7181 2.33331 7.10655H3.33331ZM3.37983 4.54879C3.01919 4.73254 2.72597 5.02576 2.54222 5.3864L3.43322 5.84039C3.52111 5.66791 3.66134 5.52768 3.83382 5.43979L3.37983 4.54879ZM11.7583 8.88155H14.45V7.88155H11.7583V8.88155ZM15.0833 9.51488V10.0815H16.0833V9.51488H15.0833ZM14.45 10.7149H11.7583V11.7149H14.45V10.7149ZM11.125 10.0815V9.51488H10.125V10.0815H11.125ZM11.7583 10.7149C11.5517 10.7149 11.4268 10.7145 11.3338 10.7069C11.2466 10.6998 11.2323 10.6889 11.2387 10.6922L10.7847 11.5832C10.9427 11.6637 11.1033 11.6914 11.2524 11.7036C11.3956 11.7153 11.5682 11.7149 11.7583 11.7149V10.7149ZM10.125 10.0815C10.125 10.2717 10.1246 10.4443 10.1363 10.5875C10.1485 10.7365 10.1762 10.8971 10.2567 11.0551L11.1477 10.6011C11.151 10.6076 11.1401 10.5933 11.133 10.5061C11.1254 10.413 11.125 10.2882 11.125 10.0815H10.125ZM11.2387 10.6922C11.1995 10.6722 11.1677 10.6403 11.1477 10.6011L10.2567 11.0551C10.3725 11.2825 10.5574 11.4673 10.7847 11.5832L11.2387 10.6922ZM15.0833 10.0815C15.0833 10.2882 15.0829 10.413 15.0753 10.5061C15.0682 10.5933 15.0573 10.6076 15.0606 10.6011L15.9516 11.0551C16.0321 10.8971 16.0598 10.7365 16.072 10.5875C16.0837 10.4443 16.0833 10.2717 16.0833 10.0815H15.0833ZM14.45 11.7149C14.6401 11.7149 14.8127 11.7153 14.9559 11.7036C15.105 11.6914 15.2656 11.6637 15.4236 11.5832L14.9696 10.6922C14.976 10.6889 14.9617 10.6998 14.8745 10.7069C14.7815 10.7145 14.6566 10.7149 14.45 10.7149V11.7149ZM15.0606 10.6011C15.0406 10.6403 15.0088 10.6722 14.9696 10.6922L15.4236 11.5832C15.6509 11.4673 15.8358 11.2825 15.9516 11.0551L15.0606 10.6011ZM14.45 8.88155C14.6566 8.88155 14.7815 8.88194 14.8745 8.88954C14.9617 8.89666 14.976 8.90756 14.9696 8.90426L15.4236 8.01325C15.2656 7.93275 15.105 7.90504 14.9559 7.89286C14.8127 7.88116 14.6401 7.88155 14.45 7.88155V8.88155ZM16.0833 9.51488C16.0833 9.32478 16.0837 9.15213 16.072 9.00893C16.0598 8.8599 16.0321 8.69931 15.9516 8.54131L15.0606 8.9953C15.0573 8.98883 15.0682 9.00317 15.0753 9.09037C15.0829 9.1834 15.0833 9.30828 15.0833 9.51488H16.0833ZM14.9696 8.90426C15.0088 8.92423 15.0406 8.9561 15.0606 8.9953L15.9516 8.54131C15.8358 8.31395 15.6509 8.1291 15.4236 8.01325L14.9696 8.90426ZM11.7583 7.88155C11.5682 7.88155 11.3956 7.88116 11.2524 7.89286C11.1033 7.90504 10.9427 7.93275 10.7847 8.01325L11.2387 8.90426C11.2323 8.90756 11.2466 8.89666 11.3338 8.88954C11.4268 8.88194 11.5517 8.88155 11.7583 8.88155V7.88155ZM11.125 9.51488C11.125 9.30828 11.1254 9.1834 11.133 9.09037C11.1401 9.00317 11.151 8.98883 11.1477 8.9953L10.2567 8.54131C10.1762 8.69931 10.1485 8.8599 10.1363 9.00894C10.1246 9.15213 10.125 9.32478 10.125 9.51488H11.125ZM10.7847 8.01325C10.5574 8.1291 10.3725 8.31395 10.2567 8.54131L11.1477 8.9953C11.1677 8.9561 11.1995 8.92423 11.2387 8.90426L10.7847 8.01325ZM4.43567 5.30412L10.5476 2.85935L10.1762 1.93087L4.06428 4.37565L4.43567 5.30412ZM10.8333 3.05278V4.83988H11.8333V3.05278H10.8333ZM10.5476 2.85935C10.6845 2.80461 10.8333 2.90539 10.8333 3.05278H11.8333C11.8333 2.19793 10.9699 1.61339 10.1762 1.93087L10.5476 2.85935Z"
                          fill="#B1B1B1"
                        />
                      </Svg>
                    </View>

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
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'Campton Bold',
                        fontSize: 12,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    ₦110 per Advert Post
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      height: 35,
                      backgroundColor: '#FF6DFB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 109,
                      borderTopRightRadius: 4,
                      borderTopLeftRadius: 4,
                    }}
                    onPress={() => setModalVisible(true)}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonMedium',
                        fontSize: 10,
                      }}>
                      Generate Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.Container1}>
            <View style={[styles.Advert1, dynamicStyles.DivContainer]}>
              <Svg
                width="47"
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

              <View style={styles.Check}>
                <Text
                  style={[
                    {color: '#fff', fontFamily: 'CamptonMedium'},
                    dynamicStyles.TextColor,
                  ]}>
                  {' '}
                  Post Adverts on Your Whatsapp Status
                </Text>
                <Text
                  style={[
                    {
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      paddingTop: 10,
                      fontSize: 12,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Post adverts of various businesses and top brands on your
                  WhatsApp status and earn ₦60 per advert past. The more you
                  post, the more you earn.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    <View style={styles.wallet}>
                      <Svg
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M3.60683 14.6021L3.83382 14.1566L3.60683 14.6021ZM2.98772 13.983L3.43322 13.756H3.43322L2.98772 13.983ZM13.3931 14.6021L13.1661 14.1566L13.1661 14.1566L13.3931 14.6021ZM14.0122 13.983L13.5667 13.756V13.756L14.0122 13.983ZM13.3931 4.99429L13.1661 5.43979L13.1661 5.43979L13.3931 4.99429ZM14.0122 5.6134L13.5667 5.84039L14.0122 5.6134ZM3.60683 4.99429L3.37983 4.54879L3.60683 4.99429ZM2.98772 5.6134L2.54222 5.3864L2.98772 5.6134ZM11.0117 11.1377L11.2387 10.6922L11.0117 11.1377ZM10.7022 10.8281L11.1477 10.6011L10.7022 10.8281ZM15.5061 10.8281L15.0606 10.6011L15.5061 10.8281ZM15.1966 11.1377L14.9696 10.6922L15.1966 11.1377ZM15.1966 8.45875L14.9696 8.90426L15.1966 8.45875ZM15.5061 8.76831L15.0606 8.9953L15.5061 8.76831ZM11.0117 8.45875L11.2387 8.90426L11.0117 8.45875ZM10.7022 8.76831L11.1477 8.9953L10.7022 8.76831ZM4.06428 4.37565C3.80789 4.4782 3.68318 4.76919 3.78574 5.02558C3.8883 5.28197 4.17928 5.40668 4.43567 5.30412L4.06428 4.37565ZM10.3619 2.39511L10.1762 1.93087L10.1762 1.93087L10.3619 2.39511ZM10.8333 4.83988C10.8333 5.11603 11.0572 5.33988 11.3333 5.33988C11.6095 5.33988 11.8333 5.11603 11.8333 4.83988H10.8333ZM5.09998 5.33988H11.9V4.33988H5.09998V5.33988ZM11.9 14.2565H5.09998V15.2565H11.9V14.2565ZM3.33331 12.4899V7.10655H2.33331V12.4899H3.33331ZM13.6666 7.10655V8.55863H14.6666V7.10655H13.6666ZM13.6666 11.3477V12.4899H14.6666V11.3477H13.6666ZM5.09998 14.2565C4.69503 14.2565 4.42138 14.2562 4.21023 14.2389C4.00492 14.2221 3.90311 14.1919 3.83382 14.1566L3.37983 15.0476C3.61359 15.1667 3.86165 15.2138 4.1288 15.2356C4.39012 15.2569 4.71153 15.2565 5.09998 15.2565V14.2565ZM2.33331 12.4899C2.33331 12.8783 2.33292 13.1997 2.35427 13.4611C2.3761 13.7282 2.42311 13.9763 2.54222 14.21L3.43322 13.756C3.39792 13.6868 3.36773 13.5849 3.35095 13.3796C3.3337 13.1685 3.33331 12.8948 3.33331 12.4899H2.33331ZM3.83382 14.1566C3.66134 14.0688 3.52111 13.9285 3.43322 13.756L2.54222 14.21C2.72597 14.5707 3.01919 14.8639 3.37983 15.0476L3.83382 14.1566ZM11.9 15.2565C12.2884 15.2565 12.6098 15.2569 12.8712 15.2356C13.1383 15.2138 13.3864 15.1667 13.6201 15.0476L13.1661 14.1566C13.0969 14.1919 12.995 14.2221 12.7897 14.2389C12.5786 14.2562 12.3049 14.2565 11.9 14.2565V15.2565ZM13.6666 12.4899C13.6666 12.8948 13.6663 13.1685 13.649 13.3796C13.6322 13.5849 13.602 13.6868 13.5667 13.756L14.4577 14.21C14.5768 13.9763 14.6239 13.7282 14.6457 13.4611C14.667 13.1997 14.6666 12.8783 14.6666 12.4899H13.6666ZM13.6201 15.0476C13.9808 14.8639 14.274 14.5707 14.4577 14.21L13.5667 13.756C13.4789 13.9285 13.3386 14.0688 13.1661 14.1566L13.6201 15.0476ZM11.9 5.33988C12.3049 5.33988 12.5786 5.34027 12.7897 5.35752C12.995 5.3743 13.0969 5.40449 13.1661 5.43979L13.6201 4.54879C13.3864 4.42968 13.1383 4.38267 12.8712 4.36084C12.6098 4.33949 12.2884 4.33988 11.9 4.33988V5.33988ZM14.6666 7.10655C14.6666 6.7181 14.667 6.39669 14.6457 6.13537C14.6239 5.86822 14.5768 5.62016 14.4577 5.3864L13.5667 5.84039C13.602 5.90968 13.6322 6.01149 13.649 6.2168C13.6663 6.42795 13.6666 6.7016 13.6666 7.10655H14.6666ZM13.1661 5.43979C13.3386 5.52768 13.4789 5.66791 13.5667 5.84039L14.4577 5.3864C14.274 5.02576 13.9808 4.73254 13.6201 4.54879L13.1661 5.43979ZM5.09998 4.33988C4.71153 4.33988 4.39012 4.33949 4.1288 4.36084C3.86165 4.38267 3.61359 4.42968 3.37983 4.54879L3.83382 5.43979C3.90311 5.40449 4.00492 5.3743 4.21023 5.35752C4.42138 5.34027 4.69503 5.33988 5.09998 5.33988V4.33988ZM3.33331 7.10655C3.33331 6.7016 3.3337 6.42795 3.35095 6.2168C3.36773 6.01149 3.39792 5.90968 3.43322 5.84039L2.54222 5.3864C2.42311 5.62016 2.3761 5.86822 2.35427 6.13537C2.33292 6.39669 2.33331 6.7181 2.33331 7.10655H3.33331ZM3.37983 4.54879C3.01919 4.73254 2.72597 5.02576 2.54222 5.3864L3.43322 5.84039C3.52111 5.66791 3.66134 5.52768 3.83382 5.43979L3.37983 4.54879ZM11.7583 8.88155H14.45V7.88155H11.7583V8.88155ZM15.0833 9.51488V10.0815H16.0833V9.51488H15.0833ZM14.45 10.7149H11.7583V11.7149H14.45V10.7149ZM11.125 10.0815V9.51488H10.125V10.0815H11.125ZM11.7583 10.7149C11.5517 10.7149 11.4268 10.7145 11.3338 10.7069C11.2466 10.6998 11.2323 10.6889 11.2387 10.6922L10.7847 11.5832C10.9427 11.6637 11.1033 11.6914 11.2524 11.7036C11.3956 11.7153 11.5682 11.7149 11.7583 11.7149V10.7149ZM10.125 10.0815C10.125 10.2717 10.1246 10.4443 10.1363 10.5875C10.1485 10.7365 10.1762 10.8971 10.2567 11.0551L11.1477 10.6011C11.151 10.6076 11.1401 10.5933 11.133 10.5061C11.1254 10.413 11.125 10.2882 11.125 10.0815H10.125ZM11.2387 10.6922C11.1995 10.6722 11.1677 10.6403 11.1477 10.6011L10.2567 11.0551C10.3725 11.2825 10.5574 11.4673 10.7847 11.5832L11.2387 10.6922ZM15.0833 10.0815C15.0833 10.2882 15.0829 10.413 15.0753 10.5061C15.0682 10.5933 15.0573 10.6076 15.0606 10.6011L15.9516 11.0551C16.0321 10.8971 16.0598 10.7365 16.072 10.5875C16.0837 10.4443 16.0833 10.2717 16.0833 10.0815H15.0833ZM14.45 11.7149C14.6401 11.7149 14.8127 11.7153 14.9559 11.7036C15.105 11.6914 15.2656 11.6637 15.4236 11.5832L14.9696 10.6922C14.976 10.6889 14.9617 10.6998 14.8745 10.7069C14.7815 10.7145 14.6566 10.7149 14.45 10.7149V11.7149ZM15.0606 10.6011C15.0406 10.6403 15.0088 10.6722 14.9696 10.6922L15.4236 11.5832C15.6509 11.4673 15.8358 11.2825 15.9516 11.0551L15.0606 10.6011ZM14.45 8.88155C14.6566 8.88155 14.7815 8.88194 14.8745 8.88954C14.9617 8.89666 14.976 8.90756 14.9696 8.90426L15.4236 8.01325C15.2656 7.93275 15.105 7.90504 14.9559 7.89286C14.8127 7.88116 14.6401 7.88155 14.45 7.88155V8.88155ZM16.0833 9.51488C16.0833 9.32478 16.0837 9.15213 16.072 9.00893C16.0598 8.8599 16.0321 8.69931 15.9516 8.54131L15.0606 8.9953C15.0573 8.98883 15.0682 9.00317 15.0753 9.09037C15.0829 9.1834 15.0833 9.30828 15.0833 9.51488H16.0833ZM14.9696 8.90426C15.0088 8.92423 15.0406 8.9561 15.0606 8.9953L15.9516 8.54131C15.8358 8.31395 15.6509 8.1291 15.4236 8.01325L14.9696 8.90426ZM11.7583 7.88155C11.5682 7.88155 11.3956 7.88116 11.2524 7.89286C11.1033 7.90504 10.9427 7.93275 10.7847 8.01325L11.2387 8.90426C11.2323 8.90756 11.2466 8.89666 11.3338 8.88954C11.4268 8.88194 11.5517 8.88155 11.7583 8.88155V7.88155ZM11.125 9.51488C11.125 9.30828 11.1254 9.1834 11.133 9.09037C11.1401 9.00317 11.151 8.98883 11.1477 8.9953L10.2567 8.54131C10.1762 8.69931 10.1485 8.8599 10.1363 9.00894C10.1246 9.15213 10.125 9.32478 10.125 9.51488H11.125ZM10.7847 8.01325C10.5574 8.1291 10.3725 8.31395 10.2567 8.54131L11.1477 8.9953C11.1677 8.9561 11.1995 8.92423 11.2387 8.90426L10.7847 8.01325ZM4.43567 5.30412L10.5476 2.85935L10.1762 1.93087L4.06428 4.37565L4.43567 5.30412ZM10.8333 3.05278V4.83988H11.8333V3.05278H10.8333ZM10.5476 2.85935C10.6845 2.80461 10.8333 2.90539 10.8333 3.05278H11.8333C11.8333 2.19793 10.9699 1.61339 10.1762 1.93087L10.5476 2.85935Z"
                          fill="#B1B1B1"
                        />
                      </Svg>
                    </View>

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
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'Campton Bold',
                        fontSize: 12,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    ₦60 per Advert Post
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      height: 35,
                      backgroundColor: '#FF6DFB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 109,
                      borderTopRightRadius: 4,
                      borderTopLeftRadius: 4,
                    }}
                    onPress={() => setModalVisible(true)}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonMedium',
                        fontSize: 10,
                      }}>
                      Generate Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.Container1}>
            <View style={[styles.Advert1, dynamicStyles.DivContainer]}>
              <Svg
                width="47"
                height="47"
                viewBox="0 0 47 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Path
                  d="M37.0145 2.25781H44.2211L28.4761 20.2549L47 44.7399H32.4966L21.1382 29.8879L8.13883 44.7399H0.92825L17.7699 25.4895L0 2.25977H14.8716L25.1391 15.8349L37.0145 2.25781ZM34.4863 40.4277H38.4793L12.7018 6.34485H8.41692L34.4863 40.4277Z"
                  fill="white"
                />
              </Svg>

              <View style={styles.Check}>
                <Text
                  style={[
                    {color: '#fff', fontFamily: 'CamptonMedium'},
                    dynamicStyles.TextColor,
                  ]}>
                  {' '}
                  Post Adverts on Your X account
                </Text>
                <Text
                  style={[
                    {
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      paddingTop: 10,
                      fontSize: 12,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Post adverts of various businesses and top brands on your
                  Twitter page and earn ₦110 per advert past. The more you post,
                  the more you earn. Note that your Twitter page must have at
                  least 500 Active Followers to be eligible for this task.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    <View style={styles.wallet}>
                      <Svg
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M3.60683 14.6021L3.83382 14.1566L3.60683 14.6021ZM2.98772 13.983L3.43322 13.756H3.43322L2.98772 13.983ZM13.3931 14.6021L13.1661 14.1566L13.1661 14.1566L13.3931 14.6021ZM14.0122 13.983L13.5667 13.756V13.756L14.0122 13.983ZM13.3931 4.99429L13.1661 5.43979L13.1661 5.43979L13.3931 4.99429ZM14.0122 5.6134L13.5667 5.84039L14.0122 5.6134ZM3.60683 4.99429L3.37983 4.54879L3.60683 4.99429ZM2.98772 5.6134L2.54222 5.3864L2.98772 5.6134ZM11.0117 11.1377L11.2387 10.6922L11.0117 11.1377ZM10.7022 10.8281L11.1477 10.6011L10.7022 10.8281ZM15.5061 10.8281L15.0606 10.6011L15.5061 10.8281ZM15.1966 11.1377L14.9696 10.6922L15.1966 11.1377ZM15.1966 8.45875L14.9696 8.90426L15.1966 8.45875ZM15.5061 8.76831L15.0606 8.9953L15.5061 8.76831ZM11.0117 8.45875L11.2387 8.90426L11.0117 8.45875ZM10.7022 8.76831L11.1477 8.9953L10.7022 8.76831ZM4.06428 4.37565C3.80789 4.4782 3.68318 4.76919 3.78574 5.02558C3.8883 5.28197 4.17928 5.40668 4.43567 5.30412L4.06428 4.37565ZM10.3619 2.39511L10.1762 1.93087L10.1762 1.93087L10.3619 2.39511ZM10.8333 4.83988C10.8333 5.11603 11.0572 5.33988 11.3333 5.33988C11.6095 5.33988 11.8333 5.11603 11.8333 4.83988H10.8333ZM5.09998 5.33988H11.9V4.33988H5.09998V5.33988ZM11.9 14.2565H5.09998V15.2565H11.9V14.2565ZM3.33331 12.4899V7.10655H2.33331V12.4899H3.33331ZM13.6666 7.10655V8.55863H14.6666V7.10655H13.6666ZM13.6666 11.3477V12.4899H14.6666V11.3477H13.6666ZM5.09998 14.2565C4.69503 14.2565 4.42138 14.2562 4.21023 14.2389C4.00492 14.2221 3.90311 14.1919 3.83382 14.1566L3.37983 15.0476C3.61359 15.1667 3.86165 15.2138 4.1288 15.2356C4.39012 15.2569 4.71153 15.2565 5.09998 15.2565V14.2565ZM2.33331 12.4899C2.33331 12.8783 2.33292 13.1997 2.35427 13.4611C2.3761 13.7282 2.42311 13.9763 2.54222 14.21L3.43322 13.756C3.39792 13.6868 3.36773 13.5849 3.35095 13.3796C3.3337 13.1685 3.33331 12.8948 3.33331 12.4899H2.33331ZM3.83382 14.1566C3.66134 14.0688 3.52111 13.9285 3.43322 13.756L2.54222 14.21C2.72597 14.5707 3.01919 14.8639 3.37983 15.0476L3.83382 14.1566ZM11.9 15.2565C12.2884 15.2565 12.6098 15.2569 12.8712 15.2356C13.1383 15.2138 13.3864 15.1667 13.6201 15.0476L13.1661 14.1566C13.0969 14.1919 12.995 14.2221 12.7897 14.2389C12.5786 14.2562 12.3049 14.2565 11.9 14.2565V15.2565ZM13.6666 12.4899C13.6666 12.8948 13.6663 13.1685 13.649 13.3796C13.6322 13.5849 13.602 13.6868 13.5667 13.756L14.4577 14.21C14.5768 13.9763 14.6239 13.7282 14.6457 13.4611C14.667 13.1997 14.6666 12.8783 14.6666 12.4899H13.6666ZM13.6201 15.0476C13.9808 14.8639 14.274 14.5707 14.4577 14.21L13.5667 13.756C13.4789 13.9285 13.3386 14.0688 13.1661 14.1566L13.6201 15.0476ZM11.9 5.33988C12.3049 5.33988 12.5786 5.34027 12.7897 5.35752C12.995 5.3743 13.0969 5.40449 13.1661 5.43979L13.6201 4.54879C13.3864 4.42968 13.1383 4.38267 12.8712 4.36084C12.6098 4.33949 12.2884 4.33988 11.9 4.33988V5.33988ZM14.6666 7.10655C14.6666 6.7181 14.667 6.39669 14.6457 6.13537C14.6239 5.86822 14.5768 5.62016 14.4577 5.3864L13.5667 5.84039C13.602 5.90968 13.6322 6.01149 13.649 6.2168C13.6663 6.42795 13.6666 6.7016 13.6666 7.10655H14.6666ZM13.1661 5.43979C13.3386 5.52768 13.4789 5.66791 13.5667 5.84039L14.4577 5.3864C14.274 5.02576 13.9808 4.73254 13.6201 4.54879L13.1661 5.43979ZM5.09998 4.33988C4.71153 4.33988 4.39012 4.33949 4.1288 4.36084C3.86165 4.38267 3.61359 4.42968 3.37983 4.54879L3.83382 5.43979C3.90311 5.40449 4.00492 5.3743 4.21023 5.35752C4.42138 5.34027 4.69503 5.33988 5.09998 5.33988V4.33988ZM3.33331 7.10655C3.33331 6.7016 3.3337 6.42795 3.35095 6.2168C3.36773 6.01149 3.39792 5.90968 3.43322 5.84039L2.54222 5.3864C2.42311 5.62016 2.3761 5.86822 2.35427 6.13537C2.33292 6.39669 2.33331 6.7181 2.33331 7.10655H3.33331ZM3.37983 4.54879C3.01919 4.73254 2.72597 5.02576 2.54222 5.3864L3.43322 5.84039C3.52111 5.66791 3.66134 5.52768 3.83382 5.43979L3.37983 4.54879ZM11.7583 8.88155H14.45V7.88155H11.7583V8.88155ZM15.0833 9.51488V10.0815H16.0833V9.51488H15.0833ZM14.45 10.7149H11.7583V11.7149H14.45V10.7149ZM11.125 10.0815V9.51488H10.125V10.0815H11.125ZM11.7583 10.7149C11.5517 10.7149 11.4268 10.7145 11.3338 10.7069C11.2466 10.6998 11.2323 10.6889 11.2387 10.6922L10.7847 11.5832C10.9427 11.6637 11.1033 11.6914 11.2524 11.7036C11.3956 11.7153 11.5682 11.7149 11.7583 11.7149V10.7149ZM10.125 10.0815C10.125 10.2717 10.1246 10.4443 10.1363 10.5875C10.1485 10.7365 10.1762 10.8971 10.2567 11.0551L11.1477 10.6011C11.151 10.6076 11.1401 10.5933 11.133 10.5061C11.1254 10.413 11.125 10.2882 11.125 10.0815H10.125ZM11.2387 10.6922C11.1995 10.6722 11.1677 10.6403 11.1477 10.6011L10.2567 11.0551C10.3725 11.2825 10.5574 11.4673 10.7847 11.5832L11.2387 10.6922ZM15.0833 10.0815C15.0833 10.2882 15.0829 10.413 15.0753 10.5061C15.0682 10.5933 15.0573 10.6076 15.0606 10.6011L15.9516 11.0551C16.0321 10.8971 16.0598 10.7365 16.072 10.5875C16.0837 10.4443 16.0833 10.2717 16.0833 10.0815H15.0833ZM14.45 11.7149C14.6401 11.7149 14.8127 11.7153 14.9559 11.7036C15.105 11.6914 15.2656 11.6637 15.4236 11.5832L14.9696 10.6922C14.976 10.6889 14.9617 10.6998 14.8745 10.7069C14.7815 10.7145 14.6566 10.7149 14.45 10.7149V11.7149ZM15.0606 10.6011C15.0406 10.6403 15.0088 10.6722 14.9696 10.6922L15.4236 11.5832C15.6509 11.4673 15.8358 11.2825 15.9516 11.0551L15.0606 10.6011ZM14.45 8.88155C14.6566 8.88155 14.7815 8.88194 14.8745 8.88954C14.9617 8.89666 14.976 8.90756 14.9696 8.90426L15.4236 8.01325C15.2656 7.93275 15.105 7.90504 14.9559 7.89286C14.8127 7.88116 14.6401 7.88155 14.45 7.88155V8.88155ZM16.0833 9.51488C16.0833 9.32478 16.0837 9.15213 16.072 9.00893C16.0598 8.8599 16.0321 8.69931 15.9516 8.54131L15.0606 8.9953C15.0573 8.98883 15.0682 9.00317 15.0753 9.09037C15.0829 9.1834 15.0833 9.30828 15.0833 9.51488H16.0833ZM14.9696 8.90426C15.0088 8.92423 15.0406 8.9561 15.0606 8.9953L15.9516 8.54131C15.8358 8.31395 15.6509 8.1291 15.4236 8.01325L14.9696 8.90426ZM11.7583 7.88155C11.5682 7.88155 11.3956 7.88116 11.2524 7.89286C11.1033 7.90504 10.9427 7.93275 10.7847 8.01325L11.2387 8.90426C11.2323 8.90756 11.2466 8.89666 11.3338 8.88954C11.4268 8.88194 11.5517 8.88155 11.7583 8.88155V7.88155ZM11.125 9.51488C11.125 9.30828 11.1254 9.1834 11.133 9.09037C11.1401 9.00317 11.151 8.98883 11.1477 8.9953L10.2567 8.54131C10.1762 8.69931 10.1485 8.8599 10.1363 9.00894C10.1246 9.15213 10.125 9.32478 10.125 9.51488H11.125ZM10.7847 8.01325C10.5574 8.1291 10.3725 8.31395 10.2567 8.54131L11.1477 8.9953C11.1677 8.9561 11.1995 8.92423 11.2387 8.90426L10.7847 8.01325ZM4.43567 5.30412L10.5476 2.85935L10.1762 1.93087L4.06428 4.37565L4.43567 5.30412ZM10.8333 3.05278V4.83988H11.8333V3.05278H10.8333ZM10.5476 2.85935C10.6845 2.80461 10.8333 2.90539 10.8333 3.05278H11.8333C11.8333 2.19793 10.9699 1.61339 10.1762 1.93087L10.5476 2.85935Z"
                          fill="#B1B1B1"
                        />
                      </Svg>
                    </View>

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
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'Campton Bold',
                        fontSize: 12,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    ₦110 per Advert Post
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      height: 35,
                      backgroundColor: '#FF6DFB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 109,
                      borderTopRightRadius: 4,
                      borderTopLeftRadius: 4,
                    }}
                    onPress={() => setModalVisible(true)}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonMedium',
                        fontSize: 10,
                      }}>
                      Generate Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.Container1}>
              <View style={[styles.Advert1, dynamicStyles.DivContainer]}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="47"
                  height="48"
                  viewBox="0 0 47 48"
                  fill="none">
                  <Path
                    d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                    fill="white"
                  />
                  <Path
                    d="M33.293 4.50652H13.7096C11.1127 4.50652 8.62218 5.53813 6.78588 7.37443C4.94959 9.21072 3.91797 11.7013 3.91797 14.2982V33.8815C3.91797 36.4784 4.94959 38.969 6.78588 40.8053C8.62218 42.6416 11.1127 43.6732 13.7096 43.6732H33.293C35.8899 43.6732 38.3804 42.6416 40.2167 40.8053C42.053 38.969 43.0846 36.4784 43.0846 33.8815V14.2982C43.0846 11.7013 42.053 9.21072 40.2167 7.37443C38.3804 5.53813 35.8899 4.50652 33.293 4.50652ZM14.728 29.0444C15.0366 30.075 15.513 31.0476 16.138 31.9232C17.0301 33.1555 18.2618 34.1014 19.6826 34.6453C20.5579 34.9703 21.4744 35.1818 22.4046 35.2719C23.3172 35.3601 24.2337 35.3601 25.1463 35.2719C26.2109 35.1903 27.2523 34.9183 28.2209 34.469C29.3171 33.9357 30.2554 33.1257 30.943 32.119C31.3566 31.5279 31.6298 30.8502 31.7418 30.1375C31.8538 29.4248 31.8016 28.696 31.5892 28.0065C31.3306 27.1347 30.7767 26.38 30.0226 25.8719L29.6309 25.5978C29.6309 25.774 29.6309 25.9307 29.533 26.0873C29.3959 26.9686 29.1021 27.8146 28.6713 28.594C28.29 29.2923 27.7521 29.8926 27.0997 30.348C26.4473 30.8033 25.6982 31.1012 24.9113 31.2182C23.8762 31.4209 22.8071 31.3671 21.7976 31.0615C20.96 30.8305 20.1973 30.385 19.5846 29.769C18.913 29.0857 18.4921 28.1954 18.3901 27.2428C18.292 26.4365 18.4238 25.619 18.7703 24.8844C19.1167 24.1498 19.6638 23.5282 20.3484 23.0911C21.0603 22.6185 21.8592 22.2923 22.6984 22.1315C23.5268 21.9944 24.3649 21.9357 25.2051 21.9553C25.8609 21.9725 26.515 22.0314 27.1634 22.1315H27.2809C27.1938 21.5957 27.0149 21.079 26.7521 20.604C26.5625 20.2873 26.31 20.0127 26.0103 19.7971C25.7105 19.5816 25.3699 19.4297 25.0092 19.3507C24.1478 19.0862 23.2269 19.0862 22.3655 19.3507C21.7447 19.5702 21.2052 19.9732 20.8184 20.5061V20.6432L18.8601 19.2919V19.1548C19.6761 17.972 20.9183 17.1509 22.3263 16.8636C23.5272 16.6017 24.7754 16.6557 25.9492 17.0203C26.6074 17.2218 27.2167 17.5572 27.7391 18.0054C28.2614 18.4536 28.6855 19.005 28.9846 19.6248C29.3293 20.3279 29.5623 21.0818 29.6701 21.8573C29.7273 22.194 29.76 22.5343 29.768 22.8757L30.3555 23.1498C31.274 23.6376 32.0861 24.3033 32.7446 25.1082C33.4222 25.9444 33.8668 26.9431 34.0371 28.0065C34.1762 28.6488 34.2232 29.3088 34.1742 29.9648C34.0741 31.5953 33.4332 33.1458 32.353 34.3711C30.9875 35.9854 29.1299 37.1068 27.0655 37.5632C26.1564 37.7535 25.2325 37.8649 24.3042 37.8961C23.4609 37.9316 22.616 37.8988 21.778 37.7982C20.4186 37.6388 19.0951 37.255 17.8613 36.6623C16.2715 35.8568 14.9209 34.648 13.9446 33.1569C13.2217 32.032 12.6737 30.8038 12.3192 29.5144C12.0568 28.5451 11.8668 27.5561 11.7513 26.5573V24.0898C11.7513 23.2673 11.7513 22.4448 11.8884 21.6223C11.9689 20.6919 12.1195 19.7689 12.3388 18.8611C12.6379 17.7175 13.0996 16.6227 13.7096 15.6103C14.9328 13.4277 16.9321 11.7849 19.3105 11.0082C20.1639 10.7185 21.0424 10.5087 21.9346 10.3815C23.0538 10.2542 24.1838 10.2542 25.303 10.3815C26.6554 10.5048 27.9784 10.8488 29.2196 11.3998C31.0108 12.1899 32.5346 13.4824 33.6063 15.1207C34.3578 16.3031 34.9133 17.5993 35.2513 18.959L32.9405 19.5857V19.429C32.6804 18.5014 32.2985 17.6124 31.8046 16.7853C30.8005 15.154 29.2437 13.9378 27.418 13.3582C26.4568 13.032 25.455 12.8409 24.4413 12.7903C23.6918 12.7313 22.9388 12.7313 22.1892 12.7903C21.0325 12.9035 19.9052 13.2218 18.8601 13.7303C17.5093 14.4357 16.3983 15.5262 15.668 16.8636C15.1623 17.7798 14.7867 18.7618 14.5517 19.7815C14.345 20.6108 14.2074 21.4558 14.1405 22.3078C14.0913 23.123 14.0913 23.9405 14.1405 24.7557C14.1499 26.2047 14.3474 27.6463 14.728 29.0444Z"
                    fill="white"
                  />
                  <Path
                    d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
                    fill="white"
                  />
                </Svg>
                <View style={styles.Check}>
                  <Text
                    style={[
                      {color: '#fff', fontFamily: 'CamptonMedium'},
                      dynamicStyles.TextColor,
                    ]}>
                    {' '}
                    Post Adverts on Your Threads Account
                  </Text>
                  <Text
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'CamptonBook',
                        paddingTop: 10,
                        fontSize: 12,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    Promote advertisements for different businesses and top
                    brands on your Threads page and earn ₦110 for each post. The
                    more you share, the more you earn. Ensure that your Threads
                    account has at least 500 active followers to
                    qualify for this task.
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10,
                      gap: 7,
                      paddingRight: 50,
                    }}>
                    <View style={{flexDirection: 'row', gap: 3}}>
                      <View style={styles.wallet}>
                        <Svg
                          width="17"
                          height="18"
                          viewBox="0 0 17 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <Path
                            d="M3.60683 14.6021L3.83382 14.1566L3.60683 14.6021ZM2.98772 13.983L3.43322 13.756H3.43322L2.98772 13.983ZM13.3931 14.6021L13.1661 14.1566L13.1661 14.1566L13.3931 14.6021ZM14.0122 13.983L13.5667 13.756V13.756L14.0122 13.983ZM13.3931 4.99429L13.1661 5.43979L13.1661 5.43979L13.3931 4.99429ZM14.0122 5.6134L13.5667 5.84039L14.0122 5.6134ZM3.60683 4.99429L3.37983 4.54879L3.60683 4.99429ZM2.98772 5.6134L2.54222 5.3864L2.98772 5.6134ZM11.0117 11.1377L11.2387 10.6922L11.0117 11.1377ZM10.7022 10.8281L11.1477 10.6011L10.7022 10.8281ZM15.5061 10.8281L15.0606 10.6011L15.5061 10.8281ZM15.1966 11.1377L14.9696 10.6922L15.1966 11.1377ZM15.1966 8.45875L14.9696 8.90426L15.1966 8.45875ZM15.5061 8.76831L15.0606 8.9953L15.5061 8.76831ZM11.0117 8.45875L11.2387 8.90426L11.0117 8.45875ZM10.7022 8.76831L11.1477 8.9953L10.7022 8.76831ZM4.06428 4.37565C3.80789 4.4782 3.68318 4.76919 3.78574 5.02558C3.8883 5.28197 4.17928 5.40668 4.43567 5.30412L4.06428 4.37565ZM10.3619 2.39511L10.1762 1.93087L10.1762 1.93087L10.3619 2.39511ZM10.8333 4.83988C10.8333 5.11603 11.0572 5.33988 11.3333 5.33988C11.6095 5.33988 11.8333 5.11603 11.8333 4.83988H10.8333ZM5.09998 5.33988H11.9V4.33988H5.09998V5.33988ZM11.9 14.2565H5.09998V15.2565H11.9V14.2565ZM3.33331 12.4899V7.10655H2.33331V12.4899H3.33331ZM13.6666 7.10655V8.55863H14.6666V7.10655H13.6666ZM13.6666 11.3477V12.4899H14.6666V11.3477H13.6666ZM5.09998 14.2565C4.69503 14.2565 4.42138 14.2562 4.21023 14.2389C4.00492 14.2221 3.90311 14.1919 3.83382 14.1566L3.37983 15.0476C3.61359 15.1667 3.86165 15.2138 4.1288 15.2356C4.39012 15.2569 4.71153 15.2565 5.09998 15.2565V14.2565ZM2.33331 12.4899C2.33331 12.8783 2.33292 13.1997 2.35427 13.4611C2.3761 13.7282 2.42311 13.9763 2.54222 14.21L3.43322 13.756C3.39792 13.6868 3.36773 13.5849 3.35095 13.3796C3.3337 13.1685 3.33331 12.8948 3.33331 12.4899H2.33331ZM3.83382 14.1566C3.66134 14.0688 3.52111 13.9285 3.43322 13.756L2.54222 14.21C2.72597 14.5707 3.01919 14.8639 3.37983 15.0476L3.83382 14.1566ZM11.9 15.2565C12.2884 15.2565 12.6098 15.2569 12.8712 15.2356C13.1383 15.2138 13.3864 15.1667 13.6201 15.0476L13.1661 14.1566C13.0969 14.1919 12.995 14.2221 12.7897 14.2389C12.5786 14.2562 12.3049 14.2565 11.9 14.2565V15.2565ZM13.6666 12.4899C13.6666 12.8948 13.6663 13.1685 13.649 13.3796C13.6322 13.5849 13.602 13.6868 13.5667 13.756L14.4577 14.21C14.5768 13.9763 14.6239 13.7282 14.6457 13.4611C14.667 13.1997 14.6666 12.8783 14.6666 12.4899H13.6666ZM13.6201 15.0476C13.9808 14.8639 14.274 14.5707 14.4577 14.21L13.5667 13.756C13.4789 13.9285 13.3386 14.0688 13.1661 14.1566L13.6201 15.0476ZM11.9 5.33988C12.3049 5.33988 12.5786 5.34027 12.7897 5.35752C12.995 5.3743 13.0969 5.40449 13.1661 5.43979L13.6201 4.54879C13.3864 4.42968 13.1383 4.38267 12.8712 4.36084C12.6098 4.33949 12.2884 4.33988 11.9 4.33988V5.33988ZM14.6666 7.10655C14.6666 6.7181 14.667 6.39669 14.6457 6.13537C14.6239 5.86822 14.5768 5.62016 14.4577 5.3864L13.5667 5.84039C13.602 5.90968 13.6322 6.01149 13.649 6.2168C13.6663 6.42795 13.6666 6.7016 13.6666 7.10655H14.6666ZM13.1661 5.43979C13.3386 5.52768 13.4789 5.66791 13.5667 5.84039L14.4577 5.3864C14.274 5.02576 13.9808 4.73254 13.6201 4.54879L13.1661 5.43979ZM5.09998 4.33988C4.71153 4.33988 4.39012 4.33949 4.1288 4.36084C3.86165 4.38267 3.61359 4.42968 3.37983 4.54879L3.83382 5.43979C3.90311 5.40449 4.00492 5.3743 4.21023 5.35752C4.42138 5.34027 4.69503 5.33988 5.09998 5.33988V4.33988ZM3.33331 7.10655C3.33331 6.7016 3.3337 6.42795 3.35095 6.2168C3.36773 6.01149 3.39792 5.90968 3.43322 5.84039L2.54222 5.3864C2.42311 5.62016 2.3761 5.86822 2.35427 6.13537C2.33292 6.39669 2.33331 6.7181 2.33331 7.10655H3.33331ZM3.37983 4.54879C3.01919 4.73254 2.72597 5.02576 2.54222 5.3864L3.43322 5.84039C3.52111 5.66791 3.66134 5.52768 3.83382 5.43979L3.37983 4.54879ZM11.7583 8.88155H14.45V7.88155H11.7583V8.88155ZM15.0833 9.51488V10.0815H16.0833V9.51488H15.0833ZM14.45 10.7149H11.7583V11.7149H14.45V10.7149ZM11.125 10.0815V9.51488H10.125V10.0815H11.125ZM11.7583 10.7149C11.5517 10.7149 11.4268 10.7145 11.3338 10.7069C11.2466 10.6998 11.2323 10.6889 11.2387 10.6922L10.7847 11.5832C10.9427 11.6637 11.1033 11.6914 11.2524 11.7036C11.3956 11.7153 11.5682 11.7149 11.7583 11.7149V10.7149ZM10.125 10.0815C10.125 10.2717 10.1246 10.4443 10.1363 10.5875C10.1485 10.7365 10.1762 10.8971 10.2567 11.0551L11.1477 10.6011C11.151 10.6076 11.1401 10.5933 11.133 10.5061C11.1254 10.413 11.125 10.2882 11.125 10.0815H10.125ZM11.2387 10.6922C11.1995 10.6722 11.1677 10.6403 11.1477 10.6011L10.2567 11.0551C10.3725 11.2825 10.5574 11.4673 10.7847 11.5832L11.2387 10.6922ZM15.0833 10.0815C15.0833 10.2882 15.0829 10.413 15.0753 10.5061C15.0682 10.5933 15.0573 10.6076 15.0606 10.6011L15.9516 11.0551C16.0321 10.8971 16.0598 10.7365 16.072 10.5875C16.0837 10.4443 16.0833 10.2717 16.0833 10.0815H15.0833ZM14.45 11.7149C14.6401 11.7149 14.8127 11.7153 14.9559 11.7036C15.105 11.6914 15.2656 11.6637 15.4236 11.5832L14.9696 10.6922C14.976 10.6889 14.9617 10.6998 14.8745 10.7069C14.7815 10.7145 14.6566 10.7149 14.45 10.7149V11.7149ZM15.0606 10.6011C15.0406 10.6403 15.0088 10.6722 14.9696 10.6922L15.4236 11.5832C15.6509 11.4673 15.8358 11.2825 15.9516 11.0551L15.0606 10.6011ZM14.45 8.88155C14.6566 8.88155 14.7815 8.88194 14.8745 8.88954C14.9617 8.89666 14.976 8.90756 14.9696 8.90426L15.4236 8.01325C15.2656 7.93275 15.105 7.90504 14.9559 7.89286C14.8127 7.88116 14.6401 7.88155 14.45 7.88155V8.88155ZM16.0833 9.51488C16.0833 9.32478 16.0837 9.15213 16.072 9.00893C16.0598 8.8599 16.0321 8.69931 15.9516 8.54131L15.0606 8.9953C15.0573 8.98883 15.0682 9.00317 15.0753 9.09037C15.0829 9.1834 15.0833 9.30828 15.0833 9.51488H16.0833ZM14.9696 8.90426C15.0088 8.92423 15.0406 8.9561 15.0606 8.9953L15.9516 8.54131C15.8358 8.31395 15.6509 8.1291 15.4236 8.01325L14.9696 8.90426ZM11.7583 7.88155C11.5682 7.88155 11.3956 7.88116 11.2524 7.89286C11.1033 7.90504 10.9427 7.93275 10.7847 8.01325L11.2387 8.90426C11.2323 8.90756 11.2466 8.89666 11.3338 8.88954C11.4268 8.88194 11.5517 8.88155 11.7583 8.88155V7.88155ZM11.125 9.51488C11.125 9.30828 11.1254 9.1834 11.133 9.09037C11.1401 9.00317 11.151 8.98883 11.1477 8.9953L10.2567 8.54131C10.1762 8.69931 10.1485 8.8599 10.1363 9.00894C10.1246 9.15213 10.125 9.32478 10.125 9.51488H11.125ZM10.7847 8.01325C10.5574 8.1291 10.3725 8.31395 10.2567 8.54131L11.1477 8.9953C11.1677 8.9561 11.1995 8.92423 11.2387 8.90426L10.7847 8.01325ZM4.43567 5.30412L10.5476 2.85935L10.1762 1.93087L4.06428 4.37565L4.43567 5.30412ZM10.8333 3.05278V4.83988H11.8333V3.05278H10.8333ZM10.5476 2.85935C10.6845 2.80461 10.8333 2.90539 10.8333 3.05278H11.8333C11.8333 2.19793 10.9699 1.61339 10.1762 1.93087L10.5476 2.85935Z"
                            fill="#B1B1B1"
                          />
                        </Svg>
                      </View>

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
                      style={[
                        {
                          color: '#fff',
                          fontFamily: 'Campton Bold',
                          fontSize: 12,
                        },
                        dynamicStyles.TextColor,
                      ]}>
                      ₦110 per Advert Post
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{
                        height: 35,
                        backgroundColor: '#FF6DFB',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 109,
                        borderTopRightRadius: 4,
                        borderTopLeftRadius: 4,
                      }}
                      onPress={() => setModalVisible(true)}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'CamptonMedium',
                          fontSize: 10,
                        }}>
                        Generate Task
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    position: 'absolute',
                    top: 0,
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setModalVisible(false)}>
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
                <View style={{alignSelf: 'center'}}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="46"
                    height="47"
                    viewBox="0 0 46 47"
                    fill="none">
                    <Path
                      d="M30.6653 17.75V13.9167C30.6653 9.68248 27.2328 6.25 22.9986 6.25C21.0542 6.25 19.2789 6.9738 17.9274 8.16667M15.7154 40.75H30.282C32.4289 40.75 33.5023 40.75 34.3223 40.3322C35.0436 39.9647 35.63 39.3783 35.9976 38.657C36.4154 37.837 36.4154 36.7635 36.4154 34.6167V23.8833C36.4154 21.7365 36.4154 20.663 35.9976 19.843C35.63 19.1217 35.0436 18.5353 34.3223 18.1678C33.5023 17.75 32.4289 17.75 30.282 17.75H15.7154C13.5685 17.75 12.4951 17.75 11.6751 18.1678C10.9538 18.5353 10.3674 19.1217 9.99984 19.843C9.58203 20.663 9.58203 21.7365 9.58203 23.8833V34.6167C9.58203 36.7635 9.58203 37.837 9.99984 38.657C10.3674 39.3783 10.9538 39.9647 11.6751 40.3322C12.4951 40.75 13.5685 40.75 15.7154 40.75Z"
                      stroke="#FFD0FE"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </Svg>
                </View>
                <View>
                  <Text style={styles.modalText}>Become a Member Today!</Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    paddingBottom: 30,
                    color: '#fff',
                  }}>
                  To be able to earn daily through advert task , engagement task
                  or to create an advert on Trendit³ you need to pay for the
                  membership activation fee which is ₦1,000. To make payment
                  click on the button below
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModal1Visible(true);
                    setModalVisible(false);
                  }}
                  style={{
                    backgroundColor: '#CB29BE',
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80%',
                    borderRadius: 110,
                    alignSelf: 'center',
                  }}>
                  <Text style={{color: '#fff'}}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modal1Visible}
            onRequestClose={() => {
              setModal1Visible(!modal1Visible);
            }}>
            <ScrollView>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      position: 'absolute',
                      top: 0,
                      alignSelf: 'flex-end',
                    }}
                    onPress={() => setModal1Visible(false)}>
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
                      flexDirection: 'row',
                      gap: 5,
                      alignContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none">
                      <G clip-path="url(#clip0_4535_37461)">
                        <Path
                          d="M7.9987 9.66659C10.2999 9.66659 12.1654 7.80111 12.1654 5.49992C12.1654 3.19873 10.2999 1.33325 7.9987 1.33325C5.69751 1.33325 3.83203 3.19873 3.83203 5.49992C3.83203 7.80111 5.69751 9.66659 7.9987 9.66659ZM7.9987 9.66659C4.3168 9.66659 1.33203 11.9052 1.33203 14.6666M7.9987 9.66659C11.6806 9.66659 14.6654 11.9052 14.6654 14.6666"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </G>
                      <Defs>
                        <ClipPath id="clip0_4535_37461">
                          <Rect width="16" height="16" fill="white" />
                        </ClipPath>
                      </Defs>
                    </Svg>
                    <Text style={{textAlign: 'center', color: '#fff'}}>
                      Become a Member Today!
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'center',
                      paddingBottom: 20,
                      paddingTop: 10,
                      color: '#fff',
                    }}>
                    Turn your social media accounts into a daily surce of income
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingTop: 10,
                      color: '#fff',
                    }}>
                    Do you know you can earn daily income by performing social
                    media task such as likes, follows, comments, subscribe,
                    share, retweet and others. that is one of the so many
                    benefit of becoming a member of Trendit³
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingTop: 10,
                      color: '#fff',
                    }}>
                    When you activate your account with a one-time membership
                    fee of ₦1000, you get an access to enjoy the benefits listed
                    below:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingTop: 10,
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                    }}>
                    Earn on Your Terms:{' '}
                  </Text>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Short & Simple Tasks: Unlike time-consuming gigs, our
                      tasks are quick and easy to complete – perfect for fitting
                      into your busy schedule. Like posts, follow accounts,
                      share content – it's that simple
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Real Money Rewards: Earn real money for your completed
                      tasks. Redeem your earnings through convenient payment
                      methods.
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingTop: 10,
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                    }}>
                    Boost Your Social Media Presence:
                  </Text>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Expand your social circle and explore engaging content by
                      following recommended accounts.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Increase Brand Awareness: By completing tasks like liking
                      posts, you can subtly promote your own social media
                      profiles or favorite brands.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Stay Current with Trends: Engaging with the latest viral
                      content keeps you in the loop and helps you build a more
                      relevant online presence.
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingTop: 10,
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                    }}>
                    More than Just Earnings:
                  </Text>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Interactive Community: Connect with other app users, share
                      experiences, and learn from each other.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Safe & Secure Environment: We prioritize user safety and
                      security. All tasks comply with social media platform
                      guidelines.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      –
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingTop: 10,
                        color: '#fff',
                      }}>
                      Fun & Rewarding: Make money while enjoying the social
                      media experience – it's a win-win!
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingTop: 15,
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                    }}>
                    Referral Bonuses:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingTop: 2,
                      color: '#fff',
                    }}>
                    Earn an Instant Referral Commission of ₦500 when you refer
                    someone to become a Member on Trendit³. The more you refer,
                    the more you earn.
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      paddingTop: 15,
                      paddingBottom: 15,
                      color: '#fff',
                    }}>
                    Ready to start earning and take control of your social media
                    experience? Join Trendit³ today!
                  </Text>
                  <View style={{paddingTop: 20}} />
                  <View
                    style={[
                      {
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(177, 177, 177, 0.30)',
                        height: 80,
                        width: '100%',
                        paddingHorizontal: 15,
                        flexDirection: 'row',
                      },
                    ]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={[
                          {
                            color: '#fff',
                            fontFamily: 'CamptonBook',
                            fontSize: 13,
                          },
                        ]}>
                        Membership Fee
                      </Text>
                      <Text
                        style={[
                          {
                            color: '#fff',
                            fontFamily: 'CamptonBook',
                            fontSize: 30,
                          },
                        ]}>
                        ₦1,000
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
                      onPress={() => handleMembershipPayment()}>
                      {isLoading1 ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text
                          style={{
                            fontFamily: 'CamptonBook',
                            color: '#fff',
                            fontSize: 13,
                          }}>
                          Submit and Pay
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Advert1: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 100,
    borderRadius: 10,
  },

  Container1: {
    paddingVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    paddingTop: 30,
  },
});

export default PostAdvertMenu;
