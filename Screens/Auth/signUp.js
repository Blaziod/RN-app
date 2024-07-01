/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import queryString from 'query-string';
import axios from 'axios';
import {ApiLink} from '../../enums/apiLink';
import Google from '../../assets/SVG/googleicon.svg';
import Facebook from '../../assets/SVG/facebook.svg';
import TikTok from '../../assets/SVG/tiktok.svg';
import Divider from '../../assets/SVG/divider.svg';
import LogoSvg from '../../customSvg/logo';
import StyledText from '../../Components/Styledtext';
import tw from '../../lib/tailwind';
import Button from '../../Components/Button';
import TextInput from '../../Components/TextInput';
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [referral, setReferral] = useState('');
  const [signupToken, setSignupToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [ggToken, setGgToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accesstoken');
      if (token) {
        console.log('Token found:', token);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Tabs',
              params: {screen: 'Home', signInToken: token},
            },
          ],
        });
      } else {
        console.log('No token found');
        // No need to navigate here, as you're already on the SignIn screen
      }
    };

    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiLink.ENDPOINT_1}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, referrer_code: referral}),
      });

      if (response.ok) {
        const data = await response.json();
        setSignupToken(data.signup_token);
        setEmail('');
        setReferral('');
        navigation.navigate('VerifyEmail', {signupToken: data.signup_token});
        console.log('Success signing up:', data);
        await AsyncStorage.setItem('userEmail', email); // Store the email
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
        console.error('Error signing up:', errorData);
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
            fontFamily: 'Manrope-ExtraBold',
          },
        });
      }
    } catch (error) {
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
          fontFamily: 'Manrope-ExtraBold',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${ApiLink.ENDPOINT_1}/profile`, {
        headers: {
          Authorization: `Bearer ${ggToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        Alert.alert('Login Successful');
        console.log(response.data);
        AsyncStorage.setItem(
          'userdatafiles1',
          JSON.stringify({
            userdata: response.data.user_profile,
          }),
        )
          .then(() => {
            console.log(response.data.user_profile);
            console.log('User data stored successfully');
          })
          .catch(error => {
            console.error('Error storing user data:', error);
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
              params: {screen: 'Home', signInToken: ggToken},
            },
          ],
        });
      } else if (response.status === 401) {
        console.error('Unauthorized: Access token is invalid or expired.');
        await AsyncStorage.removeItem('userbalance');
        await AsyncStorage.removeItem('userdata1');
        await AsyncStorage.removeItem('userdata');
        await AsyncStorage.removeItem('userdata2');
        await AsyncStorage.removeItem('userdatas');
        await AsyncStorage.removeItem('userdatafiles1');
        await AsyncStorage.removeItem('accesstoken');

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
            fontFamily: 'Manrope-ExtraBold',
          },
        });
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error Else');
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
            fontFamily: 'Manrope-ExtraBold',
          },
        });
      }
    } catch (error) {
      Alert.alert('Error', error.toString());
      console.error(error);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ggToken !== null) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleUrl = async event => {
      try {
        const parsed = queryString.parseUrl(event.url);

        if (parsed.query) {
          if (parsed.query.access_token) {
            const {access_token} = parsed.query;
            await AsyncStorage.setItem(
              'accesstoken',
              JSON.stringify({accessToken: access_token}),
            );
            console.log('Token stored successfully:', access_token);
            setGgToken(access_token);
          } else if (parsed.query.error) {
            console.error(
              'Error received from authorization:',
              parsed.query.error,
            );
            handleAuthorizationError(parsed.query.error);
          } else {
            console.error('No access token or error information received.');
            handleAuthorizationError('No access token received');
          }
        }
      } catch (error) {
        console.error('Error handling the URL:', error);
        handleAuthorizationError('Failed to process the authorization data');
      }
    };

    // Helper function to handle errors and show user feedback
    const handleAuthorizationError = errorMessage => {
      Toast.show({
        type: 'error',
        text1: 'Authorization Error',
        text2: errorMessage,
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
    };

    // Listen for incoming links
    Linking.getInitialURL().then(url => {
      if (url) {
        handleUrl({url});
      }
    });

    const subscription = Linking.addEventListener('url', handleUrl);

    // Clean up the listener on unmount
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Fetch user profile when the token is set
    if (ggToken) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ggToken]);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiLink.ENDPOINT_1}/app/gg_signup`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success signing in:', data);
        // Open the authorization URL
        if (data.authorization_url) {
          Linking.openURL(data.authorization_url);
        }
      } else {
        const errorData = await response.json();
        console.error('Error signing in:', errorData);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorData.message,
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
      }
    } catch (error) {
      console.error('Error signing in:', error);
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
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* <View style={{width: WIDTH - 25, justifyContent: 'center'}}> */}
        <View style={tw`p-10 flex justify-center items-center`}>
          <LogoSvg width={100} height={100} />

          <StyledText style={tw`font-bold text-2xl mt-28`}>
            Create an account
          </StyledText>
          <StyledText style={tw`font-normal text-base mt-2 text-center`}>
            Turn Daily Social Tasks into Paychecks! Get Paid for your
            Engagements.
          </StyledText>

          <View style={tw`flex items-center w-full mt-8 gap-y-4`}>
            <TextInput
              containerStyle={tw`w-full`}
              placeholder="Enter a valid email"
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              containerStyle={tw`w-full`}
              // style={[styles.textInput, isFocused1 && styles.focused]}
              placeholder="Referral code/Username(Optional)"
              // placeholderTextColor="#888"
              // autoCapitalize="none"
              // autoCorrect={false}
              onChangeText={setReferral}
              value={referral}
            />
            <Button
              onPress={handleSignUp}
              disabled={isLoading}
              loading={isLoading}>
              <Text style={tw`text-white font-semibold text-base`}>
                Get Started
              </Text>
            </Button>
            <View
              style={tw`flex flex-row justify-center items-center w-full py-6`}>
              <Divider />
              <StyledText style={tw`text-center mx-3`}>Or</StyledText>
              <Divider />
            </View>
          </View>

          <View style={tw`w-full flex-col gap-y-3`}>
            <Button
              style={tw`bg-white border-border-gray border-[1px]`}
              onPress={() => handleGoogleSignUp()}>
              <View
                style={tw`flex flex-row items-center justify-between gap-x-2`}>
                <Google style={tw`w-6 h-6 `} />
                <StyledText style={tw` text-[#344054] font-bold text-base`}>
                  Sign up with Google
                </StyledText>
              </View>
            </Button>
            <Button
              style={tw`bg-white border-border-gray border-[1px]`}
              onPress={() => handleGoogleSignUp()}>
              <View
                style={tw`flex flex-row items-center justify-between gap-x-2`}>
                <Facebook style={tw`w-6 h-6 `} />
                <StyledText style={tw` text-[#344054] font-bold text-base`}>
                  Sign up with Facebook
                </StyledText>
              </View>
            </Button>
            <Button
              style={tw`bg-white border-border-gray border-[1px]`}
              onPress={() => handleGoogleSignUp()}>
              <View
                style={tw`flex flex-row items-center justify-between gap-x-2`}>
                <TikTok style={tw`w-6 h-6 `} />
                <StyledText style={tw` text-[#344054] font-bold text-base`}>
                  Sign up with Tiktok
                </StyledText>
              </View>
            </Button>
          </View>
          <View
            style={tw`flex flex-row justify-center items-center gap-x-2 mt-8`}>
            <StyledText>Already have an account?</StyledText>
            <StyledText style={tw`text-primary font-bold text-sm`}>
              Log in
            </StyledText>
          </View>
        </View>

        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertical alignment
    // alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  scrollView: {
    // paddingHorizontal: 9,
    paddingVertical: 30,
    justifyContent: 'center',
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'RedHatDisplay',
  },
  welcomeText2: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'RedHatDisplay',
  },
  focused: {
    borderColor: '#CB29BE',
  },
  tagline: {
    fontSize: 16,
    color: '#B1B1B1',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'RedHatDisplay-',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    color: 'white',
    fontFamily: 'Manrope-Light',
    borderWidth: 2,
  },
  continueButton: {
    backgroundColor: '#CB29BE',
    padding: 12,
    borderRadius: 70,
    alignItems: 'center',
    width: '75%',
    marginTop: 5,
  },
  socialLogins: {
    marginTop: 20,
    width: '95%',
    alignSelf: 'center',
  },
  orText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#B1B1B1',
    fontFamily: 'Manrope-Light',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 8,
    marginRight: 10,
    width: 'auto',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Manrope-ExtraBold',
  },
});

export default SignUp;
