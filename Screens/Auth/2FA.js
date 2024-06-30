/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {ApiLink} from '../../enums/apiLink';
import {OtpInput} from 'react-native-otp-entry';

const TwoFA = () => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {Token} = route.params;

  const verifyEmail = async () => {
    setIsLoading(true);
    console.log(Token, 'hehehehehe');
    try {
      const response = await axios.post(`${ApiLink.ENDPOINT_1}/verify-2fa`, {
        entered_code: otp,
        two_fa_token: Token,
      });
      console.log('Verify email response:', response.data);
      if (response.data.status_code === 200) {
        AsyncStorage.setItem(
          'userdatafiles1',
          JSON.stringify({
            userdata: response.data.user_data,
          }),
        )
          .then(() => {})
          .catch(error => {});
        AsyncStorage.setItem(
          'accesstoken',
          JSON.stringify({
            accessToken: response.data.access_token,
          }),
        )
          .then(() => {})
          .catch(error => {
            console.error('Error storing Access Token:', error);
          });
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
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Tabs',
              params: {screen: 'Home'},
            },
          ],
        });
        console.log(response.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying email:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.toString(),
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

  useEffect(() => {
    if (otp.length === 6) {
      verifyEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#000', position: 'relative'}}>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
          }}>
          <StatusBar hidden />
          <Text
            style={{
              fontFamily: 'Manrope-ExtraBold',
              color: '#fff',
              top: 30,
              right: 30,
              position: 'absolute',
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            Go Back
          </Text>

          <Text
            style={{
              fontFamily: 'Manrope-ExtraBold',
              fontSize: 32,
              color: '#fff',
            }}>
            2FA CHECK
          </Text>
          <Text
            style={{
              fontFamily: 'Manrope-Regular',
              fontSize: 15,
              color: '#b1b1b1',
              marginTop: 10,
              textAlign: 'center',
            }}>
            A code has been sent to your prefered method, please enter it below
            to verify your Trendit account.
          </Text>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 22,
              width: '90%',
            }}>
            <OtpInput
              numberOfDigits={6}
              onTextChange={text => {
                setOtp(text);
              }}
              focusColor="#CB29BE"
              focusStickBlinkingDuration={400}
              theme={{
                pinCodeContainerStyle: {
                  backgroundColor: '#000',
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                },
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TwoFA;
