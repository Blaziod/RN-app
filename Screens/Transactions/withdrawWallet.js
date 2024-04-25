/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Headers from '../../Components/Headers/Headers';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import TransactionsCustomSwitch from '../../Components/CustomSwitches/transactionsCustomSwitch';
import TransactionMenu from '../../Components/Menus/transactionMenu';
import {Svg, Path} from 'react-native-svg';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Wait');
      resolve();
    }, timeout);
  });
};

const WithdrawWallet = () => {
  const [transactionMenu, setTransactionMenu] = useState(1);
  const [amount, setAmount] = useState('');
  const homeScreenUrl = 'facebook.com';
  const [isFocused1, setIsFocused1] = useState(false);

  const onSelectSwitch = value => {
    setTransactionMenu(value);
  };

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [hasFetchedBalance, setHasFetchedBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance();
    fetchUserData();
    fetchUserAccessToken();
    fetchUserBalance();
    wait(4000).then(() => setRefreshing(false));
    console.log('Waittt');
  };
  const fetchBalance = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          'https://api.trendit3.com/api/show_balance',
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
    if (hasFetchedBalance && isFocused) {
      AsyncStorage.getItem('userbalance')
        .then(data => {
          const userBalance = JSON.parse(data);
          // setUserBalance(userBalance);
          console.log('Balance', userBalance);
        })
        .catch(error => {
          console.error('Error retrieving user balance:', error);
        });
    }
  };
  useEffect(() => {
    if (hasFetchedBalance && isFocused) {
      fetchUserBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFetchedBalance, isFocused]);
  const handleCreditWallet = async () => {
    const userToken = userAccessToken?.accessToken;
    console.log('Testing', userToken);
    if (isNaN(amount) || amount === '') {
      Alert.alert('Error', 'Please enter a valid amount.');
      console.log(homeScreenUrl);
      return;
    }

    try {
      if (!homeScreenUrl) {
        Alert.alert('Error', 'Callback URL is not defined.');
        return;
      }
      const response = await axios.post(
        'https://api.trendit3.com/api/payment/credit-wallet',

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
        Alert.alert('Payment initialized', 'Redirecting to payment page...');
        console.log(response.data);
        const url = response.data.authorization_url; // replace with the actual URL you want to redirect to
        if (await Linking.canOpenURL(url)) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open the URL.');
        }
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing the request.');
      console.error(error.response.data); // log the server's response
    }
  };

  return (
    <SafeAreaView style={styles.AppContainer}>
      <ScrollView
        scrollEnabled={true}
        // contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Headers />
          <View style={{paddingBottom: 20}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'cnter',
                paddingBottom: 5,
                alignItems: 'center',
                paddingLeft: 10,
              }}
              onPress={() => navigation.goBack()}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <Path
                  d="M18.9998 12H5.99985M10.9998 6L5.70696 11.2929C5.31643 11.6834 5.31643 12.3166 5.70696 12.7071L10.9998 18"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </Svg>
              <Text
                style={{
                  color: '#FFD0FE',
                  fontSize: 14,
                  fontFamily: 'CamptonBook',
                }}>
                Go back
              </Text>
            </TouchableOpacity>
            <View style={styles.walletBalanceContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'cnter',
                  paddingBottom: 5,
                }}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none">
                  <Path
                    d="M3.39598 13.1877L3.62298 12.7422H3.62298L3.39598 13.1877ZM2.81329 12.605L3.2588 12.378H3.2588L2.81329 12.605ZM12.6066 13.1877L12.3796 12.7422H12.3796L12.6066 13.1877ZM13.1893 12.605L12.7438 12.378V12.378L13.1893 12.605ZM12.6066 4.14502L12.3796 4.59052L12.3796 4.59052L12.6066 4.14502ZM13.1893 4.72771L12.7438 4.9547L13.1893 4.72771ZM3.39598 4.14502L3.16899 3.69951H3.16899L3.39598 4.14502ZM2.81329 4.72771L2.36779 4.50071H2.36779L2.81329 4.72771ZM10.3653 9.92703L10.5923 9.48153L10.3653 9.92703ZM10.074 9.63569L10.5195 9.40869L10.074 9.63569ZM14.5953 9.63569L14.1498 9.40869L14.5953 9.63569ZM14.304 9.92703L14.077 9.48153L14.304 9.92703ZM14.304 7.40569L14.077 7.85119L14.304 7.40569ZM14.5953 7.69703L14.1498 7.92403L14.5953 7.69703ZM10.3653 7.40569L10.5923 7.85119L10.3653 7.40569ZM10.074 7.69703L10.5195 7.92403L10.074 7.69703ZM3.81561 3.53545C3.55922 3.63801 3.43451 3.929 3.53706 4.18539C3.63962 4.44178 3.93061 4.56649 4.187 4.46393L3.81561 3.53545ZM9.75371 1.69873L9.56801 1.23449V1.23449L9.75371 1.69873ZM10.168 3.99969C10.168 4.27584 10.3918 4.49969 10.668 4.49969C10.9441 4.49969 11.168 4.27584 11.168 3.99969H10.168ZM4.8013 4.49969H11.2013V3.49969H4.8013V4.49969ZM11.2013 12.833H4.8013V13.833H11.2013V12.833ZM3.16797 11.1997V6.13303H2.16797V11.1997H3.16797ZM12.8346 6.13303V7.49969H13.8346V6.13303H12.8346ZM12.8346 10.1247V11.1997H13.8346V10.1247H12.8346ZM4.8013 12.833C4.41968 12.833 4.16354 12.8326 3.96629 12.8165C3.77487 12.8009 3.68335 12.773 3.62298 12.7422L3.16899 13.6332C3.39383 13.7478 3.6316 13.7925 3.88486 13.8132C4.13227 13.8334 4.43618 13.833 4.8013 13.833V12.833ZM2.16797 11.1997C2.16797 11.5648 2.16758 11.8687 2.18779 12.1161C2.20849 12.3694 2.25323 12.6072 2.36779 12.832L3.2588 12.378C3.22803 12.3176 3.20011 12.2261 3.18447 12.0347C3.16836 11.8375 3.16797 11.5813 3.16797 11.1997H2.16797ZM3.62298 12.7422C3.46617 12.6623 3.33869 12.5348 3.2588 12.378L2.36779 12.832C2.54356 13.177 2.82402 13.4574 3.16899 13.6332L3.62298 12.7422ZM11.2013 13.833C11.5664 13.833 11.8703 13.8334 12.1177 13.8132C12.371 13.7925 12.6088 13.7478 12.8336 13.6332L12.3796 12.7422C12.3193 12.773 12.2277 12.8009 12.0363 12.8165C11.8391 12.8326 11.5829 12.833 11.2013 12.833V13.833ZM12.8346 11.1997C12.8346 11.5813 12.8342 11.8375 12.8181 12.0347C12.8025 12.2261 12.7746 12.3176 12.7438 12.378L13.6348 12.832C13.7494 12.6072 13.7941 12.3694 13.8148 12.1161C13.835 11.8687 13.8346 11.5648 13.8346 11.1997H12.8346ZM12.8336 13.6332C13.1786 13.4574 13.459 13.177 13.6348 12.832L12.7438 12.378C12.6639 12.5348 12.5364 12.6623 12.3796 12.7422L12.8336 13.6332ZM11.2013 4.49969C11.5829 4.49969 11.8391 4.50008 12.0363 4.5162C12.2277 4.53184 12.3193 4.55976 12.3796 4.59052L12.8336 3.69951C12.6088 3.58495 12.371 3.54021 12.1177 3.51952C11.8703 3.4993 11.5664 3.49969 11.2013 3.49969V4.49969ZM13.8346 6.13303C13.8346 5.76791 13.835 5.464 13.8148 5.21658C13.7941 4.96332 13.7494 4.72555 13.6348 4.50071L12.7438 4.9547C12.7746 5.01507 12.8025 5.1066 12.8181 5.29801C12.8342 5.49526 12.8346 5.75141 12.8346 6.13303H13.8346ZM12.3796 4.59052C12.5364 4.67042 12.6639 4.7979 12.7438 4.9547L13.6348 4.50071C13.459 4.15575 13.1786 3.87528 12.8336 3.69951L12.3796 4.59052ZM4.8013 3.49969C4.43618 3.49969 4.13228 3.4993 3.88486 3.51952C3.6316 3.54021 3.39383 3.58495 3.16899 3.69951L3.62298 4.59052C3.68335 4.55976 3.77487 4.53184 3.96629 4.5162C4.16354 4.50008 4.41968 4.49969 4.8013 4.49969V3.49969ZM3.16797 6.13303C3.16797 5.75141 3.16836 5.49526 3.18447 5.29801C3.20011 5.1066 3.22803 5.01507 3.2588 4.9547L2.36779 4.50071C2.25323 4.72555 2.20849 4.96332 2.18779 5.21658C2.16758 5.464 2.16797 5.76791 2.16797 6.13303H3.16797ZM3.16899 3.69951C2.82402 3.87528 2.54356 4.15575 2.36779 4.50071L3.2588 4.9547C3.33869 4.7979 3.46617 4.67042 3.62298 4.59052L3.16899 3.69951ZM11.068 7.83303H13.6013V6.83303H11.068V7.83303ZM14.168 8.39969V8.93303H15.168V8.39969H14.168ZM13.6013 9.49969H11.068V10.4997H13.6013V9.49969ZM10.5013 8.93303V8.39969H9.5013V8.93303H10.5013ZM11.068 9.49969C10.873 9.49969 10.7569 9.4993 10.6708 9.49227C10.5906 9.48571 10.5814 9.47596 10.5923 9.48153L10.1383 10.3725C10.2919 10.4508 10.4473 10.4773 10.5894 10.4889C10.7256 10.5001 10.8895 10.4997 11.068 10.4997V9.49969ZM9.5013 8.93303C9.5013 9.11146 9.50091 9.27536 9.51205 9.41161C9.52365 9.5537 9.55023 9.70914 9.62846 9.86268L10.5195 9.40869C10.525 9.41962 10.5153 9.41042 10.5087 9.33018C10.5017 9.24409 10.5013 9.12796 10.5013 8.93303H9.5013ZM10.5923 9.48153C10.5609 9.46555 10.5354 9.44005 10.5195 9.40869L9.62846 9.86268C9.74031 10.0822 9.91879 10.2607 10.1383 10.3725L10.5923 9.48153ZM14.168 8.93303C14.168 9.12796 14.1676 9.24409 14.1605 9.33018C14.154 9.41042 14.1442 9.41962 14.1498 9.40869L15.0408 9.86268C15.119 9.70914 15.1456 9.5537 15.1572 9.41161C15.1684 9.27536 15.168 9.11146 15.168 8.93303H14.168ZM13.6013 10.4997C13.7797 10.4997 13.9436 10.5001 14.0799 10.4889C14.222 10.4773 14.3774 10.4508 14.531 10.3725L14.077 9.48153C14.0879 9.47596 14.0787 9.48571 13.9985 9.49227C13.9124 9.4993 13.7962 9.49969 13.6013 9.49969V10.4997ZM14.1498 9.40869C14.1338 9.44005 14.1083 9.46555 14.077 9.48153L14.531 10.3725C14.7505 10.2607 14.929 10.0822 15.0408 9.86268L14.1498 9.40869ZM13.6013 7.83303C13.7962 7.83303 13.9124 7.83342 13.9985 7.84045C14.0787 7.84701 14.0879 7.85676 14.077 7.85119L14.531 6.96019C14.3774 6.88195 14.222 6.85538 14.0799 6.84377C13.9436 6.83264 13.7797 6.83303 13.6013 6.83303V7.83303ZM15.168 8.39969C15.168 8.22126 15.1684 8.05736 15.1572 7.92111C15.1456 7.77902 15.119 7.62358 15.0408 7.47004L14.1498 7.92403C14.1442 7.9131 14.154 7.9223 14.1605 8.00254C14.1676 8.08863 14.168 8.20476 14.168 8.39969H15.168ZM14.077 7.85119C14.1083 7.86717 14.1338 7.89267 14.1498 7.92403L15.0408 7.47004C14.929 7.25051 14.7505 7.07204 14.531 6.96019L14.077 7.85119ZM11.068 6.83303C10.8895 6.83303 10.7256 6.83264 10.5894 6.84377C10.4473 6.85538 10.2919 6.88195 10.1383 6.96019L10.5923 7.85119C10.5814 7.85676 10.5906 7.84701 10.6708 7.84045C10.7569 7.83342 10.873 7.83303 11.068 7.83303V6.83303ZM10.5013 8.39969C10.5013 8.20476 10.5017 8.08863 10.5087 8.00254C10.5153 7.9223 10.525 7.9131 10.5195 7.92403L9.62846 7.47004C9.55023 7.62358 9.52365 7.77902 9.51205 7.92111C9.50091 8.05736 9.5013 8.22126 9.5013 8.39969H10.5013ZM10.1383 6.96019C9.91879 7.07204 9.74031 7.25051 9.62846 7.47004L10.5195 7.92403C10.5354 7.89267 10.5609 7.86717 10.5923 7.85119L10.1383 6.96019ZM4.187 4.46393L9.9394 2.16297L9.56801 1.23449L3.81561 3.53545L4.187 4.46393ZM10.168 2.31771V3.99969H11.168V2.31771H10.168ZM9.9394 2.16297C10.0489 2.11918 10.168 2.1998 10.168 2.31771H11.168C11.168 1.49234 10.3344 0.927955 9.56801 1.23449L9.9394 2.16297Z"
                    fill="white"
                  />
                </Svg>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: 'CamptonBook',
                  }}>
                  Withdraw Earnings
                </Text>
              </View>
              <Text
                style={{
                  color: '#b1b1b1',
                  fontSize: 12,
                  fontFamily: 'CamptonBook',
                }}>
                Wallet balance
              </Text>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.WalletAmount}>
                  {userData?.userdata?.wallet?.currency_code}:{' '}
                  {isLoading ? (
                    <ActivityIndicator
                      size="medium"
                      color="#FFD0FE"
                      style={{alignSelf: 'center'}}
                    />
                  ) : (
                    userBalance
                  )}
                </Text>
              </View>
              <View style={styles.WalletButtonsContainer}>
                <TextInput
                  style={[
                    {
                      backgroundColor: '#fff',
                      height: 30,
                      alignSelf: 'center',
                      width: '35%',
                      borderRadius: 5,
                      padding: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#000',
                      borderWidth: 2,
                    },
                    isFocused1 && styles.focused,
                  ]}
                  placeholder="₦ Amount"
                  placeholderTextColor={'#000'}
                  keyboardType="numeric"
                  onChangeText={setAmount}
                  onFocus={() => setIsFocused1(true)}
                  onBlur={() => setIsFocused1(false)}
                />
                {isLoading ? (
                  <ActivityIndicator
                    size="medium"
                    color="#FFD0FE"
                    style={{alignSelf: 'center'}}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.withdrawButton}
                    onPress={handleCreditWallet}>
                    <Text style={styles.withdrawText}>Withdraw</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text
              style={{
                color: '#b1b1b1',
                paddingLeft: 20,
                fontFamily: 'CamptonBook',
                fontSize: 14,
                paddingTop: 10,
              }}>
              You can withdraw your earnings from your Trendit wallet into any
              banking platforms you prefer.
            </Text>
            <View style={{paddingBottom: 10}} />

            <Text
              style={{
                color: '#fff',
                fontSize: 25,
                fontFamily: 'CamptonMedium',
                paddingVertical: 10,
                paddingLeft: 20,
              }}>
              Withdrawal History
            </Text>
            <View
              style={{
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <TransactionsCustomSwitch
                selectionMode={1}
                option1="All"
                option2="Earned"
                option5="Orders"
                onSelectSwitch={onSelectSwitch}
              />
            </View>
            {transactionMenu === 1 && (
              <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
                <TransactionMenu />
              </View>
            )}
            {transactionMenu === 2 && (
              <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
                <TransactionMenu />
              </View>
            )}
            {transactionMenu === 3 && (
              <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
                <TransactionMenu />
              </View>
            )}
            {transactionMenu === 4 && (
              <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
                <TransactionMenu />
              </View>
            )}
            {transactionMenu === 5 && (
              <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
                <TransactionMenu />
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
    backgroundColor: '#121212',
    width: '100%',
  },

  walletBalanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    // alignItems: 'center',
    height: 'auto',
    paddingVertical: 20,
    borderRadius: 4,
    width: '91%',
    alignSelf: 'center',
    paddingHorizontal: 20,
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
    width: '35%',
    backgroundColor: '#CB29BE',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  fundText: {
    fontSize: 12.8,
    color: '#000',
    fontFamily: 'Campton Bold',
  },
  withdrawText: {
    fontSize: 13,
    fontFamily: 'CamptonBook',
    color: '#fff',
  },
  WalletAmount: {
    fontFamily: 'CamptonBook',
    fontSize: 40,
    color: '#FFD0FE',
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
  focused: {
    borderColor: '#CB29BE',
  },
});

export default WithdrawWallet;
