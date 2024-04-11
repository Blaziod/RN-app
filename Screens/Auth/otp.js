/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React, {useState, useRef, createRef, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerifyEmailScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userEmail, setUserEmail] = useState('');

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {signupToken} = route.params;
  const inputRefs = useRef(otp.map(() => createRef()));

  // Add a new state variable for user data
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    if (otp.join('').length === 6) {
      verifyEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (index === otp.length && value) {
      verifyEmail();
    }
  };

  const verifyEmail = async () => {
    setIsLoading(true);
    if (!signupToken) {
      console.error('Signup token is not set');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://api.trendit3.com/api/verify-email',
        {
          entered_code: otp.join(''),
          signup_token: signupToken,
        },
      );
      if (response.data.status === 'success') {
        console.log('Verify Email Successful:', response.data);

        // Update the user data state variable
        setUserData(response.data.user_data.user_id);

        navigation.navigate('Onboard', {
          userId: response.data.user_data.id,
        });
      } else {
        console.error('Error signing up:', response.data);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const resendCode = async () => {
    try {
      const response = await axios.post(
        'https://api.trendit3.com/api/resend-code',
        {
          signup_token: signupToken,
        },
      );
      if (response.data.status === 'success') {
        console.log('Success Resending Code:', response.data);
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
            fontFamily: 'CamptonBold',
          },
        });
      } else {
        // handle error
        console.error('Error signing up:', response.data);
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
            fontFamily: 'CamptonBold',
          },
        });
      }
    } catch (error) {
      // handle error
      console.error('Error signing up:', error);
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
          fontFamily: 'CamptonBold',
        },
      });
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
            <ActivityIndicator size="large" color="#fff" /> // Render a loading indicator if isLoading is true
          ) : (
            <View style={styles.contentContainer}>
              <View>
                <View style={styles.header}>
                  <Text style={styles.headerText}>Confirm your email</Text>
                  <Text style={styles.subHeaderText}>
                    We have sent an email with a code to {userEmail}, please
                    enter it
                  </Text>
                  <Text style={styles.subHeaderText2}>
                    below to create your Trendit account.
                  </Text>
                </View>
                <View style={styles.codeInputContainer}>
                  <View style={styles.codeRow}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        style={styles.codeDigit}
                        maxLength={1}
                        value={digit}
                        onChangeText={text => handleOtpChange(text, index)}
                        keyboardType="numeric"
                        placeholder="-"
                        placeholderTextColor="#9CA3AF"
                        ref={ref => (inputRefs.current[index] = ref)} // Assign the ref
                      />
                    ))}
                  </View>
                  <View style={styles.resendCodeContainer}>
                    <Text style={styles.resendCodeText}>
                      Didn’t receive a code?
                    </Text>
                    <TouchableOpacity
                      style={styles.resendCodeButton}
                      onPress={resendCode}>
                      <Text style={styles.resendCodeButtonText}>
                        Send new code
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
    // justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 180,
    position: 'relative',
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: '60%',
  },
  headerText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 32,
    paddingBottom: 25,
    fontFamily: 'CamptonSemiBold',
  },
  subHeaderText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 18.72,
    fontFamily: 'CamptonLight',
  },
  subHeaderText2: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 18.72,
    paddingBottom: 20,
    fontFamily: 'CamptonLight',
  },
  codeInputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  codeDigit: {
    flex: 1,
    height: 43,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  codeDigitText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: 'normal',
    letterSpacing: 12,
  },
  resendCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
  },
  resendCodeText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12.83,
    fontFamily: 'CamptonLight',
    fontWeight: 'normal',
  },
  resendCodeButton: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1,
    fontFamily: 'CamptonSemiBold',
  },
  resendCodeButtonText: {
    textAlign: 'center',
    color: '#FF6DFB',
    fontSize: 12.83,
    marginLeft: 10,
    fontFamily: 'CamptonSemiBold',
  },

  goBackButton: {
    right: 15,
    top: 60,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 6,
  },
  goBackButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12.83,
    fontFamily: 'CamptonBold',
  },
});

export default VerifyEmailScreen;
