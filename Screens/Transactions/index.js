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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Headers from '../../Components/Headers/Headers';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import TransactionsCustomSwitch from '../../Components/CustomSwitches/transactionsCustomSwitch';
import TransactionMenu from '../../Components/Menus/transactionMenu';
import TransactionsTopCustomSwitch from '../../Components/CustomSwitches/transactionTopCustomSwitch';
import TransactionTopMenu from '../../Components/Menus/transactionTopMenu';
import {useTheme} from '../../Components/Contexts/colorTheme';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Wait');
      resolve();
    }, timeout);
  });
};

const Transactions = () => {
  const [transactionMenu, setTransactionMenu] = useState(1);
  const [transactionTopMenu, setTransactionTopMenu] = useState(1);

  const onSelectSwitch = value => {
    setTransactionMenu(value);
  };

  const onSelectTopSwitch = value => {
    setTransactionTopMenu(value);
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
  const {theme} = useTheme();

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF', // Dynamic background color
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
      backgroundColor: theme === 'dark' ? '#FFF' : '#CB29BE', // Dynamic background color
    },
    Btext: {
      color: theme === 'dark' ? '#FF6DFB' : '#FFF', // Dynamic text color
    },
  });

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

  return (
    <SafeAreaView style={[styles.AppContainer, dynamicStyles.AppContainer]}>
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
            <TransactionsTopCustomSwitch
              selectionMode={1}
              option1="Overview"
              option2="Earned"
              option3="Orders"
              option4="Export"
              onSelectSwitch={onSelectTopSwitch}
            />
            {transactionTopMenu === 1 && (
              <View style={{paddingVertical: 15}}>
                <TransactionTopMenu />
              </View>
            )}
            {transactionTopMenu === 2 && (
              <View style={{paddingVertical: 15}}>
                <TransactionTopMenu />
              </View>
            )}
            {transactionTopMenu === 3 && (
              <View style={{paddingVertical: 15}}>
                <TransactionTopMenu />
              </View>
            )}
            {transactionTopMenu === 4 && (
              <View style={{paddingVertical: 15}}>
                <TransactionTopMenu />
              </View>
            )}
            <View style={{paddingBottom: 10}} />

            <Text
              style={[
                {
                  color: '#fff',
                  fontSize: 25,
                  fontFamily: 'Campton Bold',
                  paddingVertical: 20,
                  paddingLeft: 20,
                },
                dynamicStyles.TextColor,
              ]}>
              Transaction History
            </Text>
            <TransactionsCustomSwitch
              selectionMode={1}
              option1="All"
              option2="Earned"
              option5="Orders"
              option3="Orders"
              option4="Orders"
              onSelectSwitch={onSelectSwitch}
            />
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
});

export default Transactions;
