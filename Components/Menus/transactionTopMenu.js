/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Svg, Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import queryString from 'query-string';
import {useTheme} from '../../Components/Contexts/colorTheme';
import {ApiLink} from '../../enums/apiLink';

const TransactionTopMenu = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [amount, setAmount] = useState('');
  const [txRef, setTxRef] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const homeScreenUrl = 'https://blaziod.github.io';
  const deviceHeight = Dimensions.get('window').height;
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [hasFetchedBalance, setHasFetchedBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          AsyncStorage.setItem(
            'userbalance',
            JSON.stringify({
              balance: data.balance,
            }),
          )
            .then(() => {
              console.log(data.balance);
              setUserBalance(data.balance);
              console.log('Balance Stored');
            })
            .catch(error => {
              console.error('Error storing user balance:', error);
            });
          setHasFetchedBalance(true);
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

  const fetchUserBalance = () => {
    // Yo

    AsyncStorage.getItem('userbalance')
      .then(data => {
        const userBalance = JSON.parse(data);
        // setUserBalance(userBalance);
        console.log('Balance', userBalance);
      })
      .catch(error => {
        console.error('Error retrieving user balance:', error);
      });
  };
  useEffect(() => {
    if (hasFetchedBalance && isFocused) {
      fetchUserBalance();
    }
  }, [hasFetchedBalance, isFocused]);

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

  return (
    <ScrollView>
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
                      fontFamily: 'Campton Bold',
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
                      fontFamily: 'CamptonBook',
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
                        fontFamily: 'CamptonBook',
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
                    fontFamily: 'CamptonBook',
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
                    fontFamily: 'CamptonBook',
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
                    fontFamily: 'CamptonBook',
                  },
                  dynamicStyles.TextColor,
                ]}>
                All time
              </Text>
            </View>
          </View>
          <Text style={styles.WalletAmount}>
            {userData?.userdata?.wallet?.currency_symbol}{' '}
            {isLoading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              userBalance
            )}
          </Text>
          <View style={styles.WalletButtonsContainer}>
            <TouchableOpacity
              style={[styles.fundButton]}
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

              <Text style={[styles.fundText]}>Fund</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('Withdraw')}>
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

              <Text style={[styles.withdrawText]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
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
    fontFamily: 'Campton Bold',
  },
  withdrawText: {
    fontSize: 12.8,
    fontFamily: 'Campton Bold',
    color: '#000',
  },
  WalletAmount: {
    fontFamily: 'CamptonBook',
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

export default TransactionTopMenu;
