/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../Components/Contexts/colorTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {ApiLink} from '../../enums/apiLink';
import {useNavigation} from '@react-navigation/native';
import {Svg, Path} from 'react-native-svg';

const TransactionMenu = () => {
  const {theme} = useTheme();
  const [fetching, setFectching] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  const fetchUserAccessToken = () => {
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        // eslint-disable-next-line no-shadow
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        if (!userAccessToken) {
          navigation.navigate('SignIn');
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

  const fetchUserData = () => {
    AsyncStorage.getItem('userdatafiles1')
      .then(data => {
        // eslint-disable-next-line no-shadow
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

  const fetchUsersTransactions = async () => {
    setFectching(true);
    if (userAccessToken) {
      try {
        const response = await fetch(`${ApiLink.ENDPOINT_1}/transactions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('HERE!!!', data);
          setTransactions(data.transactions_history);
          setFectching(false);
        } else {
          setFectching(false);
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error during Transactions fetch:', error);
        setFectching(false);
      }
    }
  };

  useEffect(() => {
    fetchUsersTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  const getTransactionIcon = type => {
    switch (type) {
      case 'payment':
        return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <Path
              d="M12.7137 5.28809L5.81939 12.1824M11.653 12.7127H6.03906C5.62485 12.7127 5.28906 12.3769 5.28906 11.9627V6.34875"
              stroke="#B1B1B1"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </Svg>
        );
      case 'debit-wallet':
        return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <Path
              d="M5.28906 12.7127L12.1834 5.81842M6.34972 5.28809H11.9637C12.3779 5.28809 12.7137 5.62387 12.7137 6.03809V11.652"
              stroke="#B1B1B1"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </Svg>
        );
      default:
        return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <Path
              d="M9 14.2499L9 4.49989M4.5 8.24989L8.46967 4.28022C8.76256 3.98732 9.23744 3.98732 9.53033 4.28022L13.5 8.24989"
              stroke="#B1B1B1"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </Svg>
        );
    }
  };
  const getTransactionSign = type => {
    switch (type) {
      case 'payment':
        return <Text>+</Text>;

      default:
        return <Text>-</Text>;
    }
  };

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#1e1e1e' : 'rgba(177, 177, 177, 0.20)',
    },
    TextColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    Button: {
      backgroundColor: theme === 'dark' ? '#FFF' : '#CB29BE',
    },
    Btext: {
      color: theme === 'dark' ? '#FF6DFB' : '#FFF',
    },
  });

  return (
    <ScrollView>
      <View style={[styles.Container1, dynamicStyles.AppContainer]}>
        {fetching ? (
          <>
            <Text
              style={{
                fontFamily: 'Manrope-Regular',
                fontSize: 15,
                color: '#FF6DFB',
                alignSelf: 'center',
                paddingBottom: 12,
              }}>
              Please wait while it loads ....
            </Text>
            <ActivityIndicator size={60} color="#FF6DFB" />
          </>
        ) : (
          transactions.map(transaction => (
            <View style={[styles.box]} key={transaction.id}>
              <View style={[styles.Advert1, dynamicStyles.DivContainer]}>
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.10)',
                    padding: 3,
                    borderRadius: 3,
                  }}>
                  {getTransactionIcon(transaction.transaction_type)}
                </View>
                <View style={styles.Check}>
                  <Text
                    style={[
                      {fontFamily: 'Manrope-Regular', fontSize: 10},
                      dynamicStyles.TextColor,
                    ]}>
                    {transaction.status.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      {fontFamily: 'Manrope-Regular', fontSize: 10},
                      dynamicStyles.TextColor,
                    ]}>
                    {new Date(transaction.created_at).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.Check1}>
                  <Text
                    style={[
                      {fontFamily: 'Manrope-Regular', fontSize: 13},
                      dynamicStyles.TextColor,
                    ]}>
                    {transaction.description}
                  </Text>
                </View>
                <View style={styles.Check}>
                  <Text
                    style={[
                      {fontFamily: 'Manrope-Regular', fontSize: 13},
                      dynamicStyles.TextColor,
                    ]}>
                    {getTransactionSign(transaction.transaction_type)}{' '}
                    {userData?.userdata?.wallet?.currency_symbol}
                    {transaction.amount}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Advert1: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#1e1e1e',
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  Container1: {
    paddingVertical: 5,
    width: '100%',
  },
  Check: {
    width: '20%',
  },
  Check1: {
    width: '40%',
  },
  box: {
    paddingTop: 10,
  },
});

export default TransactionMenu;
