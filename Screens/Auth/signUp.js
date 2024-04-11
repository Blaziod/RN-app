/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  // Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [referral, setReferral] = useState('');
  const [signupToken, setSignupToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
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
      const response = await fetch('https://api.trendit3.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
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
            fontFamily: 'CamptonBold',
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
          fontFamily: 'CamptonBold',
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
        <View>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to </Text>
            <Text style={styles.welcomeText2}>Trendit </Text>
            <Text style={styles.tagline}>Earn money by connecting</Text>
            <Text style={styles.tagline}>
              businesses to their potential customers.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter a valid email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Referral code/Username(Optional)"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setReferral}
              value={referral}
            />
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleSignUp}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonLabel}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.socialLogins}>
            <Text style={styles.orText}>OR SIGN UP WITH</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('../assets/google-icon.png')}
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
              }}
              onPress={() => navigation.navigate('SignIn')}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'CamptonBook',
                }}>
                Already have an account?
              </Text>
              <View onPress={() => navigation.navigate('SignIn')}>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 14,
                    fontFamily: 'CamptonBook',
                  }}
                  onPress={() => navigation.navigate('SignIn')}>
                  Sign In
                </Text>
              </View>
            </View>
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
    backgroundColor: '#000000',
    width: '100%',
  },
  scrollView: {
    // paddingHorizontal: 9,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center', // Center horizontally for logo
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
  },
  textInput: {
    backgroundColor: '#8E60CF3B',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: '92%',
    color: 'white',
    fontFamily: 'CamptonLight',
  },
  continueButton: {
    backgroundColor: '#CB29BE',
    padding: 12,
    borderRadius: 70,
    alignItems: 'center',
    width: '75%',
    marginTop: 5,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'CamptonLight',
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
    fontFamily: 'CamptonLight',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E60CF3B',
    padding: 8,
    marginRight: 10,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'CamptonBold',
  },
});

export default SignUp;
