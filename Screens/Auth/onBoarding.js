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
      if (response.status_code === 200 || response.status_code === 201) {
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
          fontFamily: 'Campton Bold',
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
          <View style={{width: '20%', justifyContent: 'center'}}>
            {isCheckingUsername ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              usernameValid !== null &&
              (usernameValid ? (
                <Svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    opacity="0.5"
                    d="M9.59236 3.20031C9.34886 3.40782 9.2271 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522L7.48007 4.07523C6.67869 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.67869 4.07523 7.48007L4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.2271 3.40781 9.34887 3.20028 9.59239L3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076L3.20031 14.4076C3.4078 14.6511 3.51159 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199L4.07523 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.27799 19.8288 6.67867 19.8608 7.48 19.9248L7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248L16.52 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.52L19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008L19.9248 7.48C19.8608 6.67867 19.8288 6.27799 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07523L16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027L9.59236 3.20031Z"
                    fill="white"
                  />
                  <Path
                    d="M16.3736 9.86298C16.6914 9.54515 16.6914 9.02984 16.3736 8.71201C16.0557 8.39417 15.5404 8.39417 15.2226 8.71201L10.3723 13.5623L8.77753 11.9674C8.4597 11.6496 7.94439 11.6496 7.62656 11.9674C7.30873 12.2853 7.30873 12.8006 7.62656 13.1184L9.79685 15.2887C10.1147 15.6065 10.63 15.6065 10.9478 15.2887L16.3736 9.86298Z"
                    fill="green"
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
                  : 'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1z'
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
    fontFamily: 'Campton Bold',
    position: 'absolute',
    top: 50,
    right: 10,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Campton Bold',
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
    fontFamily: 'CamptonBook',
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
    fontFamily: 'CamptonBook',
  },
  textInput: {
    padding: 12,
    borderRadius: 5,
    color: 'white',
    fontFamily: 'CamptonLight',
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
    fontFamily: 'CamptonLight',
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
    fontFamily: 'CamptonMedium',
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
    fontFamily: 'CamptonMedium',
    fontSize: 10,
  },
});
export default OnboardingSignUp;
