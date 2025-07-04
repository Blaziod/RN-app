/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Svg, Path} from 'react-native-svg';
import queryString from 'query-string';
import axios from 'axios';
import {ApiLink} from '../../enums/apiLink';

const SignIn = () => {
  const [email_username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [ggToken, setGgToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accesstoken');
      if (token) {
        try {
          const response = await axios.get(`${ApiLink.ENDPOINT_1}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
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
          }
        } catch (error) {
        } finally {
        }
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
      }
    };

    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiLink.ENDPOINT_1}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email_username, password}),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data, 'Login');
        if (!data.two_fa_token) {
          setEmail('');
          setPassword('');
          AsyncStorage.setItem(
            'userdatafiles1',
            JSON.stringify({
              // accessToken: data.access_token,
              userdata: data.user_data,
            }),
          )
            .then(() => {
              console.log(data.user_data);
              // console.log(data.access_token);
              console.log('User data stored successfully');
            })
            .catch(error => {
              console.error('Error storing user data:', error);
            });
          AsyncStorage.setItem(
            'accesstoken',
            JSON.stringify({
              accessToken: data.access_token,
            }),
          )
            .then(() => {
              // console.log(data.user_data);
              console.log('access token here', data.access_token);
              console.log('Access Token stored successfully');
            })
            .catch(error => {
              console.error('Error storing Access Token:', error);
            });
          console.log('Success signing in:', data);
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
        } else {
          navigation.navigate('2FA', {Token: data.two_fa_token});
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
            setGgToken(access_token); // Update state to trigger the user profile fetch
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

  const handleGoogleSignIn = async () => {
    console.log('Signing in with Google');
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiLink.ENDPOINT_1}/app/gg_login`, {
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
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome Back </Text>
            {/* <Text style={styles.welcomeText2}>Trendit </Text> */}
            <Text style={styles.tagline}>
              Turn Daily Social Tasks into Paychecks!{' '}
            </Text>
            <Text style={styles.tagline}>Get Paid for your Engagements.</Text>
          </View>

          <View>
            <TextInput
              style={[styles.textInput, isFocused2 && styles.focused]}
              placeholder="Enter a valid email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setEmail}
              value={email_username}
              onFocus={() => setIsFocused2(true)}
              onBlur={() => setIsFocused2(false)}
            />
            <View style={[styles.textInput2, isFocused && styles.focused]}>
              <TextInput
                placeholder="Enter a password"
                placeholderTextColor="#888"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
                style={{
                  width: '85%',
                  color: 'white',
                  fontFamily: 'Manrope-Light',
                }}
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
                onPress={() => setIsPasswordVisible(prevState => !prevState)}>
                <Path
                  d={
                    isPasswordVisible
                      ? 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'
                      : 'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
                  }
                />
              </Svg>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Manrope-ExtraBold',
                  alignSelf: 'flex-end',
                  paddingRight: 10,
                  paddingVertical: 10,
                }}>
                Forgot password ?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleSignUp}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonLabel}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.socialLogins}>
            <Text style={styles.orText}>OR SIGN IN WITH</Text>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleGoogleSignIn()}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Image
                    source={require('../../assets/google-icon.png')}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>
                    Sign In with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          alignSelf: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 50,
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
            fontFamily: 'Manrope-Regular',
          }}>
          Don&apos;t have an account?
        </Text>
        <View onPress={() => navigation.navigate('SignUp')}>
          <Text
            style={{
              color: '#CB29BE',
              fontSize: 14,
              fontFamily: 'Manrope-ExtraBold',
            }}
            onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </View>
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
            fontFamily: 'Manrope-Regular',
          }}>
          By signing up, you agree to our
        </Text>
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontFamily: 'Manrope-ExtraBold',
            }}>
            Terms and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#000000',
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#8E60CF3B',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
  },
  eyeIcon: {
    marginRight: 10,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    paddingTop: 10,
  },
  focused: {
    borderColor: '#CB29BE',
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
    fontFamily: 'Manrope-Bold',
  },
  welcomeText2: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
  },
  tagline: {
    fontSize: 16,
    color: '#B1B1B1',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Manrope-Regular',
  },
  formContainer: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: '94%',
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Manrope-Light',
    borderWidth: 2,
  },
  textInput2: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    width: '94%',
    color: 'white',
    fontFamily: 'Manrope-Light',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'Manrope-Light',
  },
  socialLogins: {
    marginTop: 20,
    width: '90%',
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
    // paddingHorizontal: 10,
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

export default SignIn;
