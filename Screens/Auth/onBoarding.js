/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingSignUp = ({navigation, route}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {userId} = route.params;
  const userIdNumber = Number(userId);
  const [isLoading, setIsLoading] = useState(false);
  const WIDTH = Dimensions.get('window').width;
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
      <View style={{width: WIDTH - 25, justifyContent: 'center'}}>
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
            <TouchableOpacity style={styles.nameInput}>
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
          <TouchableOpacity style={styles.input}>
            <TextInput
              placeholder="Enter a Password"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.textInput}
              placeholderTextColor="#888"
            />
          </TouchableOpacity>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
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
    paddingHorizontal: 20,
    fontFamily: 'CamptonBook',
  },
  button: {
    backgroundColor: '#CB29BE',
    height: 45,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 100,
    width: 300,
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
    gap: 10,
    justifyContent: 'center',
  },
  nameInput: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: 180,
  },
  input: {
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
  },
  passwordHint: {
    color: '#fff',
    paddingLeft: 8,
    fontFamily: 'CamptonMedium',
    fontSize: 10,
  },
});

export default OnboardingSignUp;
