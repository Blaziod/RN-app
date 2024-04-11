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
  // Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const SignIn = () => {
  const [email_username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  // const [signInToken, setSignInToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const WIDTH = Dimensions.get('window').width;

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userdatafiles1');
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
      const response = await fetch('https://api.trendit3.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email_username, password}),
      });

      if (response.ok) {
        const data = await response.json();
        setEmail('');
        setPassword('');
        AsyncStorage.setItem(
          'userdatafiles1',
          JSON.stringify({
            accessToken: data.access_token,
            userdata: data.user_data,
          }),
        )
          .then(() => {
            console.log(data.user_data);
            console.log(data.access_token);
            console.log('User data stored successfully');
          })
          .catch(error => {
            console.error('Error storing user data:', error);
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
            fontFamily: 'Campton Bold',
          },
        });
        navigation.navigate('Tabs', {screen: 'Home'});
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
            fontFamily: 'Campton Bold',
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
          fontFamily: 'Campton Bold',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ...rest of the component...

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        {/* <View style={{width: WIDTH - 25, justifyContent: 'center'}}> */}
        <View>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to </Text>
            <Text style={styles.welcomeText2}>Trendit </Text>
            <Text style={styles.tagline}>Earn money by connecting</Text>
            <Text style={styles.tagline}>
              businesses to their potential customers.
            </Text>
          </View>

          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Enter a valid email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setEmail}
              value={email_username}
            />
            <View>
              <TextInput
                style={styles.textInput2}
                placeholder="Enter a password"
                placeholderTextColor="#888"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(prevState => !prevState)}
              />
            </View>
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
            <Text style={styles.orText}>OR SIGN UP WITH</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('../../assets/google-icon.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('../../assets/facebook-icon.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('../../assets/tiktok-icon.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>TikTok</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                paddingTop: 10,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'CamptonBook',
                }}>
                Don&apos;t have an account?
              </Text>
              <View onPress={() => navigation.navigate('SignUp')}>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 14,
                    fontFamily: 'CamptonBook',
                  }}
                  onPress={() => navigation.navigate('SignUp')}>
                  Sign Up
                </Text>
              </View>
              {/* </View> */}
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginLeft: -40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
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
    fontFamily: 'CamptonSemiBold',
  },
  welcomeText2: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'CamptonSemiBold',
  },
  tagline: {
    fontSize: 16,
    color: '#B1B1B1',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'CamptonBook',
  },
  formContainer: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textInput: {
    backgroundColor: '#8E60CF3B',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: '94%',
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'CamptonLight',
  },
  textInput2: {
    backgroundColor: '#8E60CF3B',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: '94%',
    color: 'white',
    fontFamily: 'CamptonLight',
    alignSelf: 'center',
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
    fontFamily: 'CamptonLight',
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
    fontFamily: 'CamptonLight',
  },
  buttonRow: {
    flexDirection: 'row',
    // paddingHorizontal: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E60CF3B',
    padding: 8,
    marginRight: 10,
    width: '100%',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Campton Bold',
  },
});

export default SignIn;
