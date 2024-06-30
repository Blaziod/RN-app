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

const VerifyEmailScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {signupToken} = route.params;

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };
    fetchEmail();
  }, []);

  const verifyEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${ApiLink.ENDPOINT_1}/verify-email`, {
        entered_code: otp,
        signup_token: signupToken,
      });
      console.log('Verify email response:', response.data);
      if (response.data.status_code === 201) {
        navigation.navigate('Onboard', {userId: response.data.user_data.id});
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
            Confirm your email
          </Text>
          <Text
            style={{
              fontFamily: 'Manrope-Regular',
              fontSize: 15,
              color: '#b1b1b1',
              marginTop: 10,
              textAlign: 'center',
            }}>
            We have sent an email with a code to {userEmail}, please enter it
            below to create your Trendit3 account.
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

export default VerifyEmailScreen;
