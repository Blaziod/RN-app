/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
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

const OnboardingSignUp = ({navigation, route}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {userId} = route.params;
  const userIdNumber = Number(userId);
  const [isLoading, setIsLoading] = useState(false);
  // const WIDTH = Dimensions.get('window').width;
  // eslint-disable-next-line no-shadow
  const validatePassword = password => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };

  const handleContinue = () => {
    setIsLoading(true);
    if (!validatePassword(password)) {
      // eslint-disable-next-line no-alert
      alert(
        'Password must be at least 8 characters, contain letters and numbers',
      );
      setIsLoading(false);
      return;
    }

    fetch('https://api.trendit3.com/api/complete-registration', {
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
    })
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        setFirstName('');
        setLastName('');
        setUsername('');
        AsyncStorage.setItem(
          'userdatafiles1',
          JSON.stringify({
            // accessToken: data.access_token,
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
        AsyncStorage.setItem(
          'accesstoken',
          JSON.stringify({
            accessToken: data.access_token,
          }),
        )
          .then(() => {
            console.log(data.user_data);
            console.log(data.access_token);
            console.log('Access Token stored successfully');
          })
          .catch(error => {
            console.error('Error storing Access Token:', error);
          });

        console.log('Successful', data);
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
        navigation.navigate('Onboard2');
      })
      .catch(error => {
        setIsLoading(false);
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
      });
  };

  return (
    <View style={styles.container}>
      {/* <View style={{width: WIDTH - 25, justifyContent: 'center'}}> */}
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
        <TouchableOpacity style={styles.input}>
          <TextInput
            placeholder="Username"
            onChangeText={setUsername}
            style={styles.textInput}
            placeholderTextColor="#888"
          />
        </TouchableOpacity>
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
        <Text style={styles.passwordHint}>
          (minimum 8 characters, with a letter and a number)
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      {/* </View> */}
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
    // width: '98%',
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
  passwordHint: {
    color: '#fff',
    paddingLeft: 8,
    fontFamily: 'CamptonMedium',
    fontSize: 10,
  },
});

export default OnboardingSignUp;
