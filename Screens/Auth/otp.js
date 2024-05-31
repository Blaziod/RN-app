/* eslint-disable prettier/prettier */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {ApiLink} from '../../enums/apiLink';

const VerifyEmailScreen = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [userEmail, setUserEmail] = useState('');
  const [lastAttemptedOTP, setLastAttemptedOTP] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {signupToken} = route.params;
  const inputRefs = useRef(otp.map(() => React.createRef()));

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };
    fetchEmail();
    const intervalId = setInterval(checkClipboardForOTP, 9000); // Check clipboard every 3 seconds
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkClipboardForOTP = async () => {
    const clipboardContent = await Clipboard.getString();
    if (
      clipboardContent &&
      clipboardContent.length === 6 &&
      /^\d+$/.test(clipboardContent) &&
      clipboardContent !== lastAttemptedOTP
    ) {
      const newOtp = clipboardContent.split('');
      setOtp(newOtp);
      applyOTPToInputs(newOtp);
    }
  };

  const applyOTPToInputs = newOtp => {
    newOtp.forEach((digit, index) => {
      if (inputRefs.current[index]?.current) {
        inputRefs.current[index].current.setNativeProps({text: digit});
      }
    });
    if (newOtp.join('').length === 6) {
      verifyEmail(newOtp.join(''));
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.current?.focus();
    }
    if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

  const verifyEmail = async otpString => {
    setLastAttemptedOTP(otpString); // Save the OTP attempted to prevent re-attempts with the same OTP
    setIsLoading(true);
    try {
      const response = await axios.post(`${ApiLink.ENDPOINT_1}/verify-email`, {
        entered_code: otpString,
        signup_token: signupToken,
      });
      console.log('Verify email response:', response.data);
      if (response.data.status_code === 201) {
        navigation.navigate('Onboard', {userId: response.data.user_data.id});
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
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
          fontFamily: 'Campton Bold',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View style={styles.contentContainer}>
              <Text style={styles.headerText}>Confirm your email</Text>
              <Text style={styles.subHeaderText}>
                We have sent an email with a code to {userEmail}, please enter
                it below to verify your account.
              </Text>
              <View style={styles.codeInputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={styles.codeDigit}
                    maxLength={1}
                    onChangeText={text => handleOtpChange(text, index)}
                    keyboardType="numeric"
                    ref={inputRefs.current[index]}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  goBackButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  goBackButtonText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subHeaderText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeDigit: {
    width: 40,
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default VerifyEmailScreen;
