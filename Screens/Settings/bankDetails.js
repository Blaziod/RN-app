/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiLink} from '../../enums/apiLink';
import {useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import {debounce} from 'lodash';
import {useTheme} from '../../Components/Contexts/colorTheme';
import Headers from '../../Components/Headers/Headers';

const BankSettings = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  const [userAccessToken, setUserAccessToken] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [IsLoading, setIsLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [banks, setBanks] = useState('');
  const [fetching, setFetching] = useState(false);

  const {theme} = useTheme();
  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
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
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        console.log('AccessToken Loading', userAccessToken);

        if (!userAccessToken) {
          console.log('AccessToken Not found', userAccessToken);
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      if (userAccessToken) {
        try {
          const response = await axios.get(`${ApiLink.ENDPOINT_1}/banks`, {
            headers: {
              Authorization: `Bearer ${userAccessToken?.accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status >= 200 && response.status < 300) {
            console.log(response.data, 'Banks');
            const banks = response.data.supported_banks.map(bank => ({
              label: bank.name,
              value: bank.name,
            }));
            setItems(banks);
            setLoading(false);
          } else if (response.status === 401) {
            console.error('Unauthorized: Access token is invalid or expired.');
            await AsyncStorage.removeItem('userbalance');
            await AsyncStorage.removeItem('userdata1');
            await AsyncStorage.removeItem('userdata');
            await AsyncStorage.removeItem('userdata2');
            await AsyncStorage.removeItem('userdatas');
            await AsyncStorage.removeItem('userdatafiles1');
            await AsyncStorage.removeItem('accesstoken');
            navigation.navigate('SignIn');
          } else {
          }
        } catch (error) {
          console.error('Error Main :', error);
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
        }
      } else {
        console.log('No token found');
        setLoading(false);
      }
    };

    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  const checkUserBank = async () => {
    setIsLoading(true);
    if (userAccessToken) {
      try {
        const response = await axios.get(`${ApiLink.ENDPOINT_1}/profile/bank`, {
          headers: {
            Authorization: `Bearer ${userAccessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status >= 200 && response.status < 300) {
          setIsLoading(false);
          console.log(response.data, 'User Bank Fetched');
          setBanks(response.data);
          setLoading(false);
        } else if (response.status === 401) {
          setIsLoading(false);
          console.error('Unauthorized: Access token is invalid or expired.');
          await AsyncStorage.removeItem('userbalance');
          await AsyncStorage.removeItem('userdata1');
          await AsyncStorage.removeItem('userdata');
          await AsyncStorage.removeItem('userdata2');
          await AsyncStorage.removeItem('userdatas');
          await AsyncStorage.removeItem('userdatafiles1');
          await AsyncStorage.removeItem('accesstoken');
          navigation.navigate('SignIn');
        } else {
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error Main :', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No token found');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserBank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  const validateAccountNumber = useCallback(number => {
    const regex = /^\d{10}$/;
    return regex.test(number);
  }, []);

  const verifyAccountNumber = useCallback(async () => {
    if (validateAccountNumber(accountNumber)) {
      try {
        setFetching(true);
        const response = await axios.post(
          `${ApiLink.ENDPOINT_1}/banks/verify/account`,
          {
            account_no: accountNumber,
            bank_name: value,
          },
          {
            headers: {
              Authorization: `Bearer ${userAccessToken?.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status >= 200 && response.status < 300) {
          setFetching(false);
          console.log(response.data);
          setAccountName(response.data.account_info.account_name);
          Toast.show({
            type: 'success',
            text1: 'Account Verified',
            text2: response.data.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Verification Failed',
            text2: response.data.message,
          });
          setFetching(false);
        }
      } catch (error) {
        console.error('Verification Error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
        });
        setFetching(false);
      }
    } else {
      setAccountName('');

      setFetching(false);
    }
  }, [accountNumber, value, userAccessToken, validateAccountNumber]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedVerifyAccountNumber = useCallback(
    debounce(() => {
      verifyAccountNumber();
    }, 3000),
    [accountNumber, verifyAccountNumber],
  );

  useEffect(() => {
    if (accountNumber.length === 10) {
      debouncedVerifyAccountNumber();
    }
  }, [accountNumber, debouncedVerifyAccountNumber]);

  const addUserBank = async () => {
    setGenerating(true);
    if (debouncedVerifyAccountNumber) {
      if (userAccessToken) {
        try {
          const response = await axios.post(
            `${ApiLink.ENDPOINT_1}/profile/bank`,
            {
              account_no: accountNumber,
              bank_name: value,
              account_name: accountName,
            },
            {
              headers: {
                Authorization: `Bearer ${userAccessToken?.accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          );

          if (response.status >= 200 && response.status < 300) {
            setGenerating(false);
            setIsModalVisible(false);
            checkUserBank();
            setAccountNumber('');
            setItems([]);
            setAccountName('');
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
            setGenerating(false);
            console.error('Unauthorized: Access token is invalid or expired.');
            await AsyncStorage.removeItem('userbalance');
            await AsyncStorage.removeItem('userdata1');
            await AsyncStorage.removeItem('userdata');
            await AsyncStorage.removeItem('userdata2');
            await AsyncStorage.removeItem('userdatas');
            await AsyncStorage.removeItem('userdatafiles1');
            await AsyncStorage.removeItem('accesstoken');
            navigation.navigate('SignIn');
          } else {
            setGenerating(false);
          }
        } catch (error) {
          setGenerating(false);
          console.error('Error Main :', error);
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
          setGenerating(false);
        }
      } else {
        console.log('No token found');
        setLoading(false);
        setGenerating(false);
      }
    }
  };

  const strokeColor = theme === 'dark' ? '#b1b1b1' : '#000';
  return (
    <ScrollView style={[dynamicStyles.AppContainer]}>
      <Headers />
      <>
        {IsLoading ? (
          <ActivityIndicator size="large" color="#CB29BE" />
        ) : (
          <View style={{padding: 10}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                paddingVertical: 10,
                paddingBottom: 20,
              }}
              onPress={() => navigation.navigate('Settings')}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill={strokeColor}>
                <Path
                  d="M16.3332 7L10.1581 13.175C9.7025 13.6307 9.7025 14.3693 10.1581 14.825L16.3332 21"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </Svg>
              <Text
                style={[
                  {
                    color: '#fff',
                    fontFamily: 'Manrope-Bold',
                    fontSize: 20,
                  },
                  dynamicStyles.TextColor,
                ]}>
                Bank Details
              </Text>
            </TouchableOpacity>
            {banks?.bank_details === null && (
              <View>
                <View
                  style={[
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      paddingHorizontal: 15,
                      paddingVertical: 50,
                    },
                    dynamicStyles.DivContainer,
                  ]}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 20,
                    }}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none">
                      <Path
                        d="M18.0016 44H30.0016M10.0016 18C10.0016 10.268 16.2696 4 24.0016 4C31.7336 4 38.0016 10.268 38.0016 18V23.1556C38.0016 26.3144 38.9366 29.4025 40.6888 32.0308L41.668 33.4996C41.836 33.7516 41.7184 34.0944 41.4311 34.1902C30.1174 37.9614 17.8858 37.9614 6.5721 34.1902C6.28478 34.0944 6.16718 33.7516 6.33517 33.4996L7.31441 32.0308C9.0666 29.4025 10.0016 26.3144 10.0016 23.1556V18Z"
                        stroke="#FF6DFB"
                        stroke-width="3"
                        stroke-linecap="round"
                      />
                    </Svg>
                  </View>

                  <Text
                    style={[
                      {
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'Manrope-Regular',
                        textAlign: 'center',
                        paddingBottom: 20,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    You have not added your account details. please update your
                    bank account.
                  </Text>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      alignItems: 'center',
                      backgroundColor: '#CB29BE',
                      height: 40,
                      padding: 4,
                      borderRadius: 100,
                      width: '80%',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                    onPress={() => setIsModalVisible(true)}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none">
                      <Path
                        d="M9.25 3V15M15.25 9L3.25 9"
                        stroke="white"
                        stroke-linecap="round"
                      />
                    </Svg>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'Manrope-ExtraBold',
                        alignSelf: 'center',
                      }}>
                      Add Bank
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {banks.bank_details !== null && (
              <View
                style={[
                  {
                    paddingVertical: 10,
                  },
                  dynamicStyles.AppContainer,
                ]}>
                <TouchableOpacity
                  style={[
                    {
                      height: 'auto',
                      backgroundColor: '#fafafa',
                      borderRadius: 5,
                      padding: 5,
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                    },
                    dynamicStyles.DivContainer,
                  ]}>
                  <Text
                    style={[
                      {
                        color: '#000',
                        fontSize: 17,
                        fontFamily: 'Manrope-ExtraBold',
                        paddingVertical: 5,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    {banks?.bank_details?.account_name}
                  </Text>

                  <Text
                    style={[
                      {
                        color: '#000',
                        fontSize: 12,
                        fontFamily: 'Manrope-Regular',
                        paddingVertical: 5,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    Account No: {banks?.bank_details?.account_no}
                  </Text>
                  <Text
                    style={[
                      {
                        color: '#000',
                        fontSize: 12,
                        fontFamily: 'Manrope-Regular',
                        paddingVertical: 5,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    Bank Name: {banks?.bank_details?.bank_name}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 15,
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      alignItems: 'center',
                      backgroundColor: '#CB29BE',
                      height: 40,
                      padding: 4,
                      borderRadius: 30,
                      width: '50%',
                      justifyContent: 'center',
                    }}
                    onPress={() => setIsModalVisible(true)}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none">
                      <Path
                        d="M3 21H21"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <Path
                        d="M7 17V13L17 3L21 7L11 17H7Z"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <Path
                        d="M14 6L18 10"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </Svg>

                    <Text
                      style={[
                        {
                          color: '#fff',
                          fontSize: 14,
                          fontFamily: 'Manrope-ExtraBold',
                        },
                      ]}>
                      Update Bank
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
                          paddingHorizontal: 10,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            fontFamily: 'Manrope-ExtraBold',
                            paddingTop: 20,
                          }}>
                          Select Bank
                        </Text>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 10,
                          }}>
                          <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            searchable={true}
                            placeholder="Select a bank"
                            searchPlaceholder="Search..."
                            containerStyle={{height: 40}}
                            style={{backgroundColor: '#fafafa'}}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            loading={loading}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            fontFamily: 'Manrope-ExtraBold',
                            paddingVertical: 5,
                          }}>
                          Account Number
                        </Text>
                        <View
                          style={{
                            paddingVertical: 10,
                          }}>
                          <TextInput
                            placeholder="Input Account Number"
                            style={{
                              height: 45,
                              backgroundColor: '#fafafa',
                              borderRadius: 5,
                              padding: 5,
                              color: '#000',
                            }}
                            placeholderTextColor="#000"
                            value={accountNumber}
                            onChangeText={text => {
                              setAccountNumber(text);
                              if (text.length === 10) {
                                debouncedVerifyAccountNumber();
                              }
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            fontFamily: 'Manrope-ExtraBold',
                            paddingVertical: 5,
                          }}>
                          Account Name
                        </Text>
                        <View
                          style={{
                            paddingVertical: 10,
                          }}>
                          <TouchableOpacity
                            style={{
                              height: 45,
                              backgroundColor: '#fafafa',
                              borderRadius: 5,
                              padding: 5,
                              justifyContent: 'center',
                            }}>
                            {fetching ? (
                              <ActivityIndicator size="small" color="#000" />
                            ) : (
                              <Text
                                style={{
                                  color: '#000',
                                  fontSize: 12,
                                  fontFamily: 'Manrope-ExtraBold',
                                  paddingVertical: 5,
                                }}>
                                {accountName ||
                                  'Account name will be displayed here'}
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{paddingHorizontal: 10, paddingVertical: 10}}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#CB29BE',
                              height: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                              borderRadius: 110,
                            }}
                            onPress={() => addUserBank()}>
                            {generating ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Text
                                style={{
                                  color: '#fff',
                                  fontFamily: 'Manrope-Regular',
                                  fontSize: 14,
                                }}>
                                Confirm
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </SafeAreaView>
                </>
              </View>
            </Modal>
          </View>
        )}
      </>
    </ScrollView>
  );
};

export default BankSettings;
