/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Path, Svg} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

const ResetPassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://api.trendit3.com/api/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email_username: email}),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setEmail('');
        setIsModalVisible(true);
        // navigation.navigate('V', {signupToken: data.signup_token});
        console.log('Success signing up:', data);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '80%',
            alignSelf: 'center',
          },
        });
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorData.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '80%',
            alignSelf: 'center',
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
      console.error('Error:', error);
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        // alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
      }}>
      <View>
        <Text
          style={{
            color: '#fff',
            fontFamily: 'CamptonSemiBold',
            fontSize: 60,
            textAlign: 'center',
          }}>
          Reset Your Password
        </Text>
        <Text
          style={{
            color: '#b1b1b1',
            fontFamily: 'CamptonLight',
            fontSize: 15,
            textAlign: 'center',
          }}>
          Please enter your Trendit email address,
        </Text>
        <Text
          style={{
            color: '#b1b1b1',
            fontFamily: 'CamptonLight',
            fontSize: 15,
            textAlign: 'center',
          }}>
          as instructions would be sent to
        </Text>
        <Text
          style={{
            color: '#b1b1b1',
            fontFamily: 'CamptonLight',
            fontSize: 15,
            textAlign: 'center',
          }}>
          help reset tour password
        </Text>
        <View>
          <TextInput
            style={[styles.textInput, isFocused && styles.focused]}
            placeholder="Enter your email address"
            placeholderTextColor="#B1B1B1"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setEmail}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={email}
          />
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleResetPassword}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonLabel}>Continue</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignSelf: 'center', paddingTop: 20}}
          onPress={() => navigation.navigate('SignIn')}>
          <Text
            style={{fontFamily: 'CamptonBook', color: '#FF6DFB', fontSize: 16}}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          paddingTop: 10,
          alignSelf: 'center',
          bottom: 10,
          position: 'absolute',
        }}>
        <Text
          style={{
            color: '#b1b1b1',
            fontSize: 14,
            fontFamily: 'CamptonBook',
          }}>
          By signing up, you agree to our
        </Text>
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontFamily: 'Campton Bold',
            }}>
            Terms and Privacy Policy
          </Text>
        </View>
      </View>
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
                    alignSelf: 'flex-end',
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
                      alignSelf: 'flex-end',
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
                    alignItems: 'center',
                    paddingHorizontal: 30,
                    paddingVertical: 30,
                  }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="49"
                    viewBox="0 0 48 49"
                    fill="none">
                    <Path
                      d="M6 10.5L21.5442 22.59C22.9887 23.7134 25.0113 23.7134 26.4558 22.59L42 10.5M10.4 40.5H37.6C39.8402 40.5 40.9603 40.5 41.816 40.064C42.5686 39.6805 43.1805 39.0686 43.564 38.316C44 37.4603 44 36.3402 44 34.1V14.9C44 12.6598 44 11.5397 43.564 10.684C43.1805 9.93139 42.5686 9.31947 41.816 8.93597C40.9603 8.5 39.8402 8.5 37.6 8.5H10.4C8.15979 8.5 7.03968 8.5 6.18404 8.93597C5.43139 9.31947 4.81947 9.93139 4.43597 10.684C4 11.5397 4 12.6598 4 14.9V34.1C4 36.3402 4 37.4603 4.43597 38.316C4.81947 39.0686 5.43139 39.6805 6.18404 40.064C7.03968 40.5 8.15979 40.5 10.4 40.5Z"
                      stroke="#CB29BE"
                      stroke-width="10"
                    />
                  </Svg>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 24,
                      fontFamily: 'Campton Bold',
                      paddingBottom: 10,
                      paddingTop: 20,
                    }}>
                    Verify Your Account
                  </Text>
                  <Text
                    style={{
                      color: '#b1b1b1',
                      fontSize: 12,
                      fontWeight: 400,
                      fontFamily: 'CamptonBook',
                      textAlign: 'center',
                      paddingHorizontal: 20,
                    }}>
                    A message has been sent to this email address verify to
                    reset password
                  </Text>
                </View>
                <View style={{paddingHorizontal: 10, paddingBottom: 30}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#CB29BE',
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      borderRadius: 110,
                    }}
                    onPress={() => {
                      Linking.openURL('mailto:');
                      navigation.reset({
                        index: 0,
                        routes: [{name: 'SignIn'}],
                      });
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonBook',
                        fontSize: 14,
                      }}>
                      Open Email App
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
    width: '95%',
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'CamptonLight',
    borderWidth: 2,
  },
  continueButton: {
    backgroundColor: '#CB29BE',
    padding: 15,
    borderRadius: 70,
    alignItems: 'center',
    width: '80%',
    marginTop: 5,
    alignSelf: 'center',
  },
  focused: {
    borderColor: '#CB29BE',
  },
});

export default ResetPassword;
