/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
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
import Clipboard from '@react-native-clipboard/clipboard';
import {Svg, Path} from 'react-native-svg';
import {ApiLink} from '../../enums/apiLink';

const ResetOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [clipboardContent, setClipboardContent] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {ResetToken} = route.params;
  const inputRefs = useRef(otp.map(() => createRef()));

  // Add a new state variable for user data
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchClipboardContent = async () => {
      const content = await Clipboard.getString();
      setClipboardContent(content);
    };

    fetchClipboardContent();
  }, []);

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
  };

  const handleLongPress = async () => {
    const content = await Clipboard.getString();
    setClipboardContent(content);
  };
  useEffect(() => {
    if (clipboardContent.length === 6) {
      const newOtp = clipboardContent.split('');
      setOtp(newOtp);
    }
  }, [clipboardContent]);
  const verifyEmail = async () => {
    setIsLoading(true);
    if (!ResetToken) {
      console.error('Signup token is not set');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${ApiLink.ENDPOINT_1}/reset-password`,
        {
          entered_code: otp.join(''),
          reset_token: ResetToken,
          new_password: password,
        },
      );
      if (response.data.status === 'success') {
        console.log('Verify Email Successful:', response.data);
        setIsLoading(false);
        navigation.navigate('SignIn');
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
        console.error('Error signing up:', response.data);
        setIsLoading(false);
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
      setIsLoading(false);
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
          fontFamily: 'Campton Bold',
        },
      });
    }
    setIsLoading(false);
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
          <View style={styles.contentContainer}>
            <View>
              <View style={styles.header}>
                <Text style={styles.headerText}>Reset Your Password</Text>
                <Text style={styles.subHeaderText}>
                  We have sent an email with a code to your email, please enter
                  it
                </Text>
                <Text style={styles.subHeaderText2}>
                  below to reset your password.
                </Text>
              </View>
              <View style={styles.codeInputContainer}>
                <View style={{paddingVertical: 10}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                      fontSize: 12,
                    }}>
                    Enter the OTP sent to you
                  </Text>
                </View>
                <View style={styles.codeRow}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      style={styles.codeDigit}
                      maxLength={1}
                      value={digit}
                      onLongPress={handleLongPress}
                      onChangeText={text => handleOtpChange(text, index)}
                      keyboardType="numeric"
                      placeholder="-"
                      placeholderTextColor="#9CA3AF"
                      ref={ref => (inputRefs.current[index] = ref)} // Assign the ref
                    />
                  ))}
                </View>
                <View style={{paddingVertical: 10}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                      fontSize: 12,
                    }}>
                    Enter your new Password
                  </Text>
                </View>
                <View style={[styles.textInput2, isFocused && styles.focused]}>
                  <TextInput
                    placeholder="Enter a password"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!isPasswordVisible}
                    onChangeText={setPassword}
                    value={password}
                    style={{width: '85%'}}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    width="20"
                    height="20"
                    fill="#fff"
                    style={styles.eyeIcon}
                    onPress={() =>
                      setIsPasswordVisible(prevState => !prevState)
                    }>
                    <Path
                      d={
                        isPasswordVisible
                          ? 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'
                          : 'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
                      }
                    />
                  </Svg>
                </View>
                <TouchableOpacity
                  style={{
                    width: '70%',
                    height: 40,
                    borderRadius: 100,
                    alignSelf: 'center',
                    alignItems: 'center',
                    backgroundColor: '#CB29BE',
                    justifyContent: 'center',
                  }}
                  onPress={() => verifyEmail()}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" /> // Render a loading indicator if isLoading is true
                  ) : (
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'Campton Bold',
                      }}>
                      Continue
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  focused: {
    borderColor: '#CB29BE',
  },
  textInput2: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    width: '94%',
    color: 'white',
    fontFamily: 'CamptonLight',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
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
    fontFamily: 'Campton Bold',
  },
});

export default ResetOtp;
