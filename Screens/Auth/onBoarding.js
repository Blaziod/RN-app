/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Svg, Path} from 'react-native-svg';
import {ApiLink} from '../../enums/apiLink';
import {debounce} from 'lodash';

const OnboardingSignUp = ({navigation, route}) => {
  // const debouncedCheckUsername = debounce(checkUsernameAvailability, 300);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {userId} = route.params;
  const userIdNumber = Number(userId);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameValid, setUsernameValid] = useState(null);

  // eslint-disable-next-line no-shadow
  const validatePassword = password => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckUsername = useCallback(
    // eslint-disable-next-line no-shadow
    debounce(async username => {
      if (username.length < 3) {
        setIsCheckingUsername(false);
        setUsernameValid(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const response = await fetch(`${ApiLink.ENDPOINT_1}/check-username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username: username}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Convert the response body to JSON
        console.log(data, 'username');
        setIsCheckingUsername(false);

        if (data.status === 'success' && data.message.includes('available')) {
          console.log('Username is available.');
          setUsernameValid(true);
          Toast.show({
            type: 'success',
            text1: 'Username available',
            text2: data.message,
          });
        } else if (data.status_code === 409) {
          console.log('Username is taken.');
          setUsernameValid(false);
          Toast.show({
            type: 'error',
            text1: 'Username taken',
            text2: 'Please choose another username.',
          });
        }
      } catch (error) {
        setIsCheckingUsername(false);
        setUsernameValid(false);
        console.error('Error checking username:', error);
        Toast.show({
          type: 'error',
          text1: 'Username taken',
          text2: 'Please choose another username.',
        });
      }
    }, 5000),
    [],
  );

  useEffect(() => {
    debouncedCheckUsername(username);
  }, [username, debouncedCheckUsername]);

  const handleContinue = async () => {
    setIsLoading(true);
    if (!validatePassword(password)) {
      // eslint-disable-next-line no-alert
      alert(
        'Password must be at least 8 characters, contain letters and numbers',
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${ApiLink.ENDPOINT_1}/complete-registration`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
            user_id: userIdNumber,
          }),
        },
      );

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        await AsyncStorage.setItem(
          'userdatafiles1',
          JSON.stringify({userdata: data.user_data}),
        );
        await AsyncStorage.setItem(
          'accesstoken',
          JSON.stringify({accessToken: data.access_token}),
        );
        navigation.navigate('Onboard2');
      } else {
        throw new Error(data.message || 'Failed to complete registration');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
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
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Tell us about you</Text>
        <Text style={styles.subText}>
          We need to know a few things to set up your account.
        </Text>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.nameInputContainer}>
          <TouchableOpacity style={styles.nameInput}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#888"
              onChangeText={setFirstName}
              style={styles.textInput}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nameInput2}>
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#888"
              onChangeText={setLastName}
              style={styles.textInput}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Username</Text>
        <View style={styles.uinput}>
          <TextInput
            placeholder="Username"
            onChangeText={text => {
              setUsername(text);
            }}
            value={username}
            style={styles.textInput}
            placeholderTextColor="#888"
          />
          <View style={{width: '10%', justifyContent: 'center'}}>
            {isCheckingUsername ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              usernameValid !== null &&
              (usernameValid ? (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  shape-rendering="geometricPrecision"
                  text-rendering="geometricPrecision"
                  image-rendering="optimizeQuality"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  width="30px"
                  height="30px"
                  viewBox="0 0 512 512">
                  <Path
                    fill="#3AAF3C"
                    d="M256 0c141.39 0 256 114.61 256 256S397.39 512 256 512 0 397.39 0 256 114.61 0 256 0z"
                  />
                  <Path
                    fill="#0DA10D"
                    fill-rule="nonzero"
                    d="M391.27 143.23h19.23c-81.87 90.92-145.34 165.89-202.18 275.52-29.59-63.26-55.96-106.93-114.96-147.42l22.03-4.98c44.09 36.07 67.31 76.16 92.93 130.95 52.31-100.9 110.24-172.44 182.95-254.07z"
                  />
                  <Path
                    fill="#fff"
                    fill-rule="nonzero"
                    d="M158.04 235.26c19.67 11.33 32.46 20.75 47.71 37.55 39.53-63.63 82.44-98.89 138.24-148.93l5.45-2.11h61.06c-81.87 90.93-145.34 165.9-202.18 275.53-29.59-63.26-55.96-106.93-114.96-147.43l64.68-14.61z"
                  />
                </Svg>
              ) : (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="red"
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24">
                  <Path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                </Svg>
              ))
            )}
          </View>
        </View>
        <Text style={styles.label}>Create a password</Text>
        <View style={styles.textInput2}>
          <TextInput
            placeholder="Enter a password"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword}
            value={password}
            style={{width: '85%'}}
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
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: '100%',
    alignItems: 'center',
  },
  goBackText: {
    color: '#fff',
    fontFamily: 'Manrope-ExtraBold',
    position: 'absolute',
    top: 50,
    right: 10,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Manrope-ExtraBold',
    marginBottom: 10,
    color: '#fff',
    alignSelf: 'center',
    paddingTop: 150,
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#B1B1B1',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
  },
  button: {
    backgroundColor: '#CB29BE',
    height: 45,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 100,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
  },
  textInput: {
    padding: 12,
    borderRadius: 5,
    color: 'white',
    fontFamily: 'Manrope-Light',
    width: '80%',
  },
  eyeIcon: {
    marginRight: 10,
  },
  textInput2: {
    padding: 1,
    borderRadius: 5,
    width: '98%',
    color: 'white',
    fontFamily: 'Manrope-Light',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    paddingLeft: 8,
    fontFamily: 'Manrope-Medium',
    fontSize: 13,
  },
  nameInputContainer: {
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    width: '97%',
    alignSelf: 'center',
  },
  nameInput: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: '50%',
  },
  nameInput2: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: '50%',
  },
  input: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: '98%',
    alignSelf: 'center',
  },
  uinput: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: '98%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passwordHint: {
    color: '#fff',
    paddingLeft: 8,
    fontFamily: 'Manrope-Medium',
    fontSize: 10,
  },
});
export default OnboardingSignUp;
