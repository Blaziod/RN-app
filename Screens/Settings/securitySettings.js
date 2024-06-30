/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import axios from 'axios'; // Make sure to install axios if you haven't already
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../Components/Contexts/colorTheme';
import {Svg, Path} from 'react-native-svg';
import {ApiLink} from '../../enums/apiLink';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Headers from '../../Components/Headers/Headers';

const SecuritySettings = () => {
  const navigation = useNavigation();
  const [isEmailEnabled, setEmailEnabled] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const fetchUserAccessToken = () => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        // eslint-disable-next-line no-shadow
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);

        if (!userAccessToken) {
          navigation.navigate('SignIn');
        }
      })
      .catch(error => {
        console.error('Error retrieving user token:', error);
      });
  };
  useEffect(() => {
    fetchUserAccessToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {theme} = useTheme();

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#171717' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
    },
    TextColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamic text color
    },
    Button: {
      backgroundColor: theme === 'dark' ? '#FFF' : '#CB29BE', // Dynamic background color
    },
    Btext: {
      color: theme === 'dark' ? '#FFD0FE' : '#FFF', // Dynamic text color
    },
  });

  const validatePassword = password => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Error',
        'Password must contain at least 8 characters including numbers',
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${ApiLink.ENDPOINT_1}/settings/password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setConfirmPassword('');
      setNewPassword('');
      setOldPassword('');
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
      console.log(response.data);
    } catch (error) {
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
  const strokeColor = theme === 'dark' ? '#b1b1b1' : '#000';

  return (
    <ScrollView style={[dynamicStyles.AppContainer]}>
      <Headers />
      <View style={{padding: 10}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingVertical: 10,
            paddingBottom: 20,
          }}
          onPress={() => navigation.navigate('Settings')}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none">
            <Path
              d="M16.3332 7L10.1581 13.175C9.7025 13.6307 9.7025 14.3693 10.1581 14.825L16.3332 21"
              stroke={strokeColor}
              stroke-width="2"
              stroke-linecap="round"
            />
          </Svg>
          <Text
            style={[
              {
                color: '#fff',
                fontFamily: 'Manrope-Bold',
                fontSize: 20,
              },
              dynamicStyles.TextColor,
            ]}>
            Security
          </Text>
        </TouchableOpacity>

        <View style={styles.InputBox}>
          <Text style={[styles.InputLabel, dynamicStyles.TextColor]}>
            Current Password
          </Text>
          <View style={[styles.Inputr, dynamicStyles.DivContainer]}>
            <TextInput
              placeholder="Enter your current password"
              placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
              secureTextEntry={!isOldPasswordVisible}
              onChangeText={setOldPassword}
              value={oldPassword}
              style={{
                width: '80%',
                color: theme === 'dark' ? '#FFFFFF' : '#000000',
              }}
            />
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              width="20"
              height="20"
              fill={strokeColor}
              style={styles.eyeIcon}
              onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}>
              <Path
                d={
                  isOldPasswordVisible
                    ? 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'
                    : 'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
                }
              />
            </Svg>
          </View>
        </View>
        <View style={styles.InputBox}>
          <Text style={[styles.InputLabel, dynamicStyles.TextColor]}>
            New Password
          </Text>
          <View style={[styles.Inputr, dynamicStyles.DivContainer]}>
            <TextInput
              placeholder="Enter your new password"
              placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
              secureTextEntry={!isNewPasswordVisible}
              onChangeText={setNewPassword}
              value={newPassword}
              style={{
                width: '80%',
                color: theme === 'dark' ? '#FFFFFF' : '#000000',
              }}
            />
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              width="20"
              height="20"
              fill={strokeColor}
              style={styles.eyeIcon}
              onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
              <Path
                d={
                  isNewPasswordVisible
                    ? 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'
                    : 'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
                }
              />
            </Svg>
          </View>
        </View>
        <View style={styles.InputBox}>
          <Text style={[styles.InputLabel, dynamicStyles.TextColor]}>
            Confirm Password
          </Text>
          <View style={[styles.Inputr, dynamicStyles.DivContainer]}>
            <TextInput
              placeholder="Confirm your new password"
              placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
              secureTextEntry={!isConfirmPasswordVisible}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              style={{
                width: '80%',
                color: theme === 'dark' ? '#FFFFFF' : '#000000',
              }}
            />
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              width="20"
              height="20"
              fill={strokeColor}
              style={styles.eyeIcon}
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }>
              <Path
                d={
                  isConfirmPasswordVisible
                    ? 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'
                    : 'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
                }
              />
            </Svg>
          </View>
        </View>
        <View style={{paddingTop: 15}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              backgroundColor: '#FF6DFB',
              height: 40,
              padding: 4,
              borderRadius: 10,
              width: '50%',
              justifyContent: 'center',
            }}
            onPress={handleUpdate}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <Path
                d="M3 21H21"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <Path
                d="M7 17V13L17 3L21 7L11 17H7Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <Path
                d="M14 6L18 10"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Svg>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Manrope-ExtraBold',
                }}>
                Update
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={[styles.Header2, dynamicStyles.TextColor]}>
          2 Factor Authentication
        </Text>

        <View>
          <View style={[styles.row, dynamicStyles.DivContainer]}>
            <TextInput
              style={[styles.Input2]}
              placeholder="Email"
              placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
              editable={isEmailEnabled}
            />
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEmailEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={newValue => {
                setEmailEnabled(newValue);
              }}
              value={isEmailEnabled}
            />
          </View>

          <View style={[{paddingTop: 5, paddingBottom: 50}]}>
            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#1C1C1C',
                  padding: 10,
                  height: 50,
                },
                dynamicStyles.DivContainer,
              ]}>
              <Text
                style={[
                  {
                    color: '#b1b1b1',
                    fontSize: 13,
                    fontFamily: 'Manrope-Medium',
                  },
                  dynamicStyles.TextColor,
                ]}>
                Google Auth App
              </Text>
              <Text
                style={[
                  {
                    color: '#FFD0FE',
                    fontSize: 13,
                    fontFamily: 'Manrope-Medium',
                  },
                ]}>
                Activate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 14,
    fontFamily: 'Manrope-ExtraBold',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
    marginTop: 5,
  },
  Header2: {
    fontSize: 14,
    fontFamily: 'Manrope-ExtraBold',
    color: '#fff',
    paddingVertical: 20,
  },
  InputBox: {
    marginTop: 20,
  },
  InputLabel: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
    color: '#fff',
  },
  Input: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  Inputr: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  Input2: {
    color: '#fff',
    marginTop: 5,
    padding: 10,
  },
});

export default SecuritySettings;
