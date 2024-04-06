/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Headers from "../Components/Header";
// import SettingsPic from '../../assets/SVG/3BB.svg';
// import Instagram from '../../assets/SVG/InstagramSmall.svg';
// import Cross from '../../assets/SVG/close cross.svg';
// import Right from '../../assets/SVG/right.svg';
// import Plus from '../../assets/SVG/plus.svg';
// import Withdraw from '../../assets/SVG/external link.svg';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [hasFetchedBalance, setHasFetchedBalance] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          'https://api.trendit3.com/api/show_balance',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userData.accessToken}`, // Add the access token to the headers
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
              console.log('Balance Stored');
            })
            .catch(error => {
              console.error('Error storing user data:', error);
            });
          setHasFetchedBalance(true);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error during balance fetch:', error);
      }
    };

    if (userData && userData.accessToken && isFocused) {
      fetchBalance();
    }
  }, [userData, isFocused]);
  // Inside your component
  useEffect(() => {
    // Your code to run on screen focus
    AsyncStorage.getItem('userdatafiles1')
      .then(data => {
        const userData = JSON.parse(data);
        setUserData(userData);
        console.log('Here I am', userData);

        if (!loaded || !userData) {
          navigation.navigate('SignIn');
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasFetchedBalance && isFocused) {
      AsyncStorage.getItem('userbalance')
        .then(data => {
          const userBalance = JSON.parse(data);
          setUserBalance(userBalance);
          console.log('Balance', userBalance);
        })
        .catch(error => {
          console.error('Error retrieving user data:', error);
        });
    }
  }, [hasFetchedBalance, isFocused]);

  const logout = async () => {
    try {
      const response = await fetch('https://api.trendit3.com/api/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`, // Add the access token to the headers
        },
        credentials: 'include', // This is required to include the cookie in the request
      });

      const data = await response.json();

      if (response.ok) {
        // return response.data;
        console.log('Successful', response);
        // Clear the access token
        await AsyncStorage.removeItem('userbalance');
        await AsyncStorage.removeItem('userdata1');
        await AsyncStorage.removeItem('userdata');
        await AsyncStorage.removeItem('userdata2');
        await AsyncStorage.removeItem('userdatas');
        await AsyncStorage.removeItem('userdatafiles1');
        console.log('Token cleared successfully');
        navigation.navigate('SignIn');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      return null;
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.AppContainer}>
          <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
            <View style={styles.walletBalanceContainer}>
              <Text style={styles.WalletBalance}>Wallet bal:</Text>
              <Text style={styles.WalletAmount}>₦{userBalance?.balance}</Text>
              <View style={styles.WalletButtonsContainer}>
                <TouchableOpacity
                  style={styles.fundButton}
                  onPress={() => navigation.navigate('Credit')}>
                  {/* <Plus /> */}
                  <Text style={styles.fundText}>Fund</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.withdrawButton}>
                  {/* <Withdraw /> */}
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
              {/* <Right style={styles.AdvertImage1} /> */}
              <Text style={styles.advertText}>Create an Advert</Text>
              <Text style={styles.advertSubText}>
                Get real people to post your ads on their social media account.
              </Text>
              <Image
                source={require('../../assets/AdvertImage.png')}
                style={styles.AdvertImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.task}
              onPress={() => navigation.navigate('Tabs', {screen: 'EarnPage'})}>
              {/* <Right style={styles.AdvertImage1} /> */}
              <Text style={styles.advertText}>Engage a task</Text>
              <Text style={styles.advertSubText}>
                Monetize Your Influence! Earn by Posting Ads on Your Social
                Media.
              </Text>
              <Image
                source={require('../../assets/TaskImage.png')}
                style={styles.TaskImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.WhatText}>What’s Up</Text>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            <View style={styles.ProfileSetUp}>
              <View style={styles.ProfileTexting}>
                <Text style={styles.SetUpText}>
                  Complete your profile set up
                </Text>
                <Text style={styles.SetUpSubText}>
                  You need to link your Facebook Account to Hawkit before you
                  can start earning with your Facebook Account. Click the button
                  below to link your Facebook account now.
                </Text>
                <View style={{paddingTop: 10}} />
                <TouchableOpacity style={styles.GotoButton}>
                  {/* <SettingsPic /> */}
                  <Text style={styles.GotoText}> Go to settings</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.IconAA}>{/* <Cross /> */}</View>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            <View style={styles.ProfileSetUp}>
              <View style={styles.ProfileTexting}>
                <Text style={styles.SetUpText}>
                  Link Your Instagram Account
                </Text>
                <Text style={styles.SetUpSubText}>
                  You need to link your Facebook Account to Hawkit before you
                  can start earning with your Facebook Account. Click the button
                  below to link your Facebook account now.
                </Text>
                <View style={{paddingTop: 10}} />
                <TouchableOpacity style={styles.GotoButton2}>
                  {/* <Instagram size={10} style={{height: 5, width: 5}} /> */}
                  <Text style={styles.GotoText}> Link Instagram account</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.IconAA}>{/* <Cross /> */}</View>
            </View>
          </View>
          <TouchableOpacity
            style={{backgroundColor: '#fff', width: 100, height: 50}}
            onPress={async () => {
              const result = await logout();
              if (result) {
                console.log('Successful', data);
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
                    fontSize: 20,
                  },
                  text2Style: {
                    color: 'green',
                    fontSize: 20,
                    fontFamily: 'CamptonBold',
                  },
                });

                // console.log("Wallet Balance", data.wallet);
                navigation.navigate('SignIn');
              } else {
                // Show an error message
              }
            }}>
            <Text>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{backgroundColor: '#fff', width: 100, height: 50}}
            onPress={() => {
              AsyncStorage.removeItem('userdata1');
              AsyncStorage.removeItem('userdata');
              AsyncStorage.removeItem('userdata2');
              AsyncStorage.removeItem('userdatas');
              AsyncStorage.removeItem('userdatafiles1');
              console.log('Token cleared successfully');
              navigation.navigate('SignIn');
            }}>
            <Text>Clear Token</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },

  walletBalanceContainer: {
    backgroundColor: '#EEFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 230,
    borderRadius: 4,
  },
  WalletButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 20,
  },
  fundButton: {
    width: 109,
    backgroundColor: '#FFFFFF',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 10,
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
    fontFamily: 'CamptonBold',
  },
  withdrawText: {
    fontSize: 12.8,
    fontFamily: 'CamptonBold',
  },
  WalletBalance: {
    fontSize: 14,
    paddingBottom: 10,
    fontFamily: 'CamptonMedium',
  },
  WalletAmount: {
    fontFamily: 'CamptonBook',
    fontSize: 40,
  },
  fundIcon: {
    height: 15,
    width: 15,
    tintColor: '#000000',
  },
  TwoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 10,
  },
  advert: {
    backgroundColor: '#EEFFFF',
    height: 180,
    width: 180,
    borderRadius: 4,
    position: 'relative',
  },
  advertText: {
    fontFamily: 'CamptonBold',
    fontSize: 16,
    padding: 5,
    paddingTop: 50,
    paddingLeft: 10,
  },
  advertSubText: {
    fontFamily: 'CamptonBook',
    padding: 5,
    fontSize: 13,
    paddingLeft: 10,
  },
  AdvertImage: {
    position: 'absolute',
    right: 1,
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
    width: 180,
    borderRadius: 4,
    position: 'relative',
  },
  TaskImage: {
    position: 'absolute',
    right: 1,
    bottom: 0,
    width: 60,
    height: 60,
  },
  WhatText: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'CamptonMedium',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ProfileSetUp: {
    backgroundColor: '#171717',
    flexDirection: 'row',
    paddingVertical: 30,
  },
  SetUpText: {
    color: '#fff',
    fontFamily: 'CamptonBold',
    fontSize: 17,
    paddingBottom: 10,
  },
  SetUpSubText: {
    color: '#fff',
    fontFamily: 'CamptonBook',
    fontSize: 13,
  },
  IconAA: {
    paddingLeft: 30,
  },
  ProfileTexting: {
    width: 300,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  GotoButton: {
    width: 150,
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
    width: 230,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 1,
  },
  GotoText: {
    color: '#fff',
    fontFamily: 'CamptonBold',
  },
});
