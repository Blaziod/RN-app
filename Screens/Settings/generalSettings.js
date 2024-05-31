/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import {Svg, Path, G} from 'react-native-svg';
import {launchImageLibrary} from 'react-native-image-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../Components/Contexts/colorTheme';
import {useNavigation} from '@react-navigation/native';
import {ApiLink} from '../../enums/apiLink';

const GeneralSettings = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNummber] = useState('');
  const [gender, setGender] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [lga, setLga] = useState([]);
  const [selectedLga, setSelectedLga] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const {theme} = useTheme();
  useEffect(() => {
    fetch(`${ApiLink.ENDPOINT_1}/countries`)
      .then(response => response.json())
      .then(data => {
        setCountries(data.countries);
        console.log(data.countries);
      })

      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry !== null) {
      // setIsLoading(true);
      axios
        .post(`${ApiLink.ENDPOINT_1}/states`, {
          country: selectedCountry,
        })
        .then(response => {
          setState(response.data.states || []);
          // setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching states:', error);
          // setIsLoading(false);
        });
    }
  }, [selectedCountry]);
  useEffect(() => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        console.log('AccessToken Loading', userAccessToken);

        if (!userAccessToken) {
          // navigation.navigate('SignIn');
          console.log('AccessToken Not found', userAccessToken);
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
  }, []);
  useEffect(() => {
    if (selectedState !== null) {
      // setIsLoading(true);
      axios
        .post(`${ApiLink.ENDPOINT_1}/states/lga`, {
          state: selectedState,
        })
        .then(response => {
          setLga(response.data.state_lga || []);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching LGAs:', error);
          // setIsLoading(false);
        });
    }
  }, [selectedState]);

  const requestMediaLibraryPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (result === RESULTS.GRANTED) {
        console.log('You can access the media library');
      } else {
        console.log('Media library access denied');
      }
    } catch (error) {
      console.error('Failed to request permission ', error);
    }
  };

  AsyncStorage.getItem('userdatafiles1')
    .then(data => {
      const userData = JSON.parse(data);
      setUserData(userData);
    })
    .catch(error => {
      console.error('Error retrieving user data:', error);
    });

  if (!userData) {
    return <ActivityIndicator />;
  }

  const chooseImage = () => {
    requestMediaLibraryPermission();
    let options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let image = response.assets[0];
        let source = {uri: image.uri};
        setFilePath(source);

        console.log(response);
        const url = `${ApiLink.ENDPOINT_1}/profile/edit`;
        // Create a new FormData object
        console.log('starting Image Upload');
        let formData = new FormData();
        formData.append('access_token', userAccessToken?.accessToken);
        formData.append('profile_picture', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });
        console.log('formData:', formData);
        console.log('url:', response.uri);
        console.log('type:', response.type);
        try {
          fetch(url, {
            method: 'post',
            headers: {
              Authorization: `Bearer ${userAccessToken?.accessToken}`,
            },
            body: formData,
          })
            .then(response => {
              if (response.status === 200 || response.status === 201) {
                return response.json();
              } else {
                if (response.status === 401) {
                  console.log(
                    '401 Unauthorized: Access token is invalid or expired',
                  );
                  AsyncStorage.removeItem('userbalance');
                  AsyncStorage.removeItem('userdata1');
                  AsyncStorage.removeItem('userdata');
                  AsyncStorage.removeItem('userdata2');
                  AsyncStorage.removeItem('userdatas');
                  AsyncStorage.removeItem('userdatafiles1');
                  AsyncStorage.removeItem('accesstoken');
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'SignIn',
                      },
                    ],
                  });
                }
                setIsLoading(false);
                throw new Error(response.message);
              }
            })
            .then(data => {
              console.log(data);
              AsyncStorage.setItem(
                'userdatafiles1',
                JSON.stringify({
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
            })
            .catch(error => {
              console.error('Error for Catch:', error.response);
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
            })
            .finally(() => {
              setIsLoading(false); // Move this inside finally block
            });
        } catch (error) {
          console.error('Error Main :', error);
        }
      }
    });
  };

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
      color: theme === 'dark' ? '#FF6DFB' : '#FFF', // Dynamic text color
    },
  });

  const handleContinue = () => {
    setIsLoading(true);
    console.log('Profile Editing Started');
    const url = `${ApiLink.ENDPOINT_1}/profile/edit`;
    const formData = new FormData();
    formData.append('access_token', userAccessToken?.accessToken);
    formData.append('gender', gender);
    formData.append('country', selectedCountry);
    formData.append('state', selectedState);
    formData.append('local_government', selectedLga);
    formData.append('firstname', firstName);
    formData.append('lastname', lastName);
    formData.append('username', username);

    try {
      fetch(url, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${userAccessToken?.accessToken}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          AsyncStorage.setItem(
            'userdatafiles1',
            JSON.stringify({
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
        })
        .catch(error => {
          console.error('Error for Catch:', error.response);
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
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error Main :', error);
    }
  };

  return (
    <View>
      <Text style={[styles.Header, dynamicStyles.TextColor]}>Profile</Text>
      <View style={[{paddingVertical: 20}]}>
        <TouchableOpacity
          style={{
            width: 66,
            height: 66,
            backgroundColor: 'rgba(203, 41, 190, 0.38)',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            //   paddingVertical: 10,
          }}
          onPress={() => chooseImage()}>
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
        </TouchableOpacity>
        <Text
          style={[
            {color: '#b1b1b1', fontSize: 11, fontFamily: 'CamptonBook'},
            dynamicStyles.TextColor,
          ]}>
          Upload Photo
        </Text>
      </View>
      <Text style={[styles.label, dynamicStyles.TextColor]}>Full Name</Text>
      <View style={[styles.nameInputContainer]}>
        <TouchableOpacity style={styles.nameInput}>
          <TextInput
            placeholder={userData?.userdata?.firstname}
            placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
            onChangeText={setFirstName}
            style={styles.textInput}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nameInput2}>
          <TextInput
            placeholder={userData?.userdata?.lastname}
            placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
            onChangeText={setLastName}
            style={styles.textInput}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.label, dynamicStyles.TextColor]}>Email address</Text>
      <TouchableOpacity style={styles.input}>
        <TextInput
          placeholder={userData?.userdata?.email}
          onChangeText={setEmail}
          style={styles.textInput}
          placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
        />
      </TouchableOpacity>
      <Text style={[styles.label, dynamicStyles.TextColor]}>Phone Number</Text>
      <TouchableOpacity style={styles.input}>
        <TextInput
          placeholder="Phone Number"
          keyboardType="numeric"
          onChangeText={setNummber}
          style={styles.textInput}
          placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
        />
      </TouchableOpacity>
      <Text style={[styles.label, dynamicStyles.TextColor]}>Username</Text>
      <TouchableOpacity style={styles.input}>
        <TextInput
          placeholder={userData?.userdata?.username}
          onChangeText={setUsername}
          style={styles.textInput}
          placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
        />
      </TouchableOpacity>
      <Text style={[styles.Header2, dynamicStyles.TextColor]}>Update</Text>

      <Text style={[styles.label, dynamicStyles.TextColor]}>Select Gender</Text>
      <TouchableOpacity
        style={{
          height: 40,
          color: theme === 'dark' ? '#FFFFFF' : '#000000',
          backgroundColor: 'rgba(177, 177, 177, 0.2)',
          marginBottom: 20,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <Picker
          selectedValue={gender}
          onValueChange={itemValue => setGender(itemValue)}
          style={{
            height: '100%',
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
            width: '100%',
          }}>
          {gender === '' && <Picker.Item label="Select" value={''} />}
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </TouchableOpacity>
      <Text style={[styles.label, dynamicStyles.TextColor]}>Birthday</Text>
      <View style={{flexDirection: 'row', gap: 5, width: '100%'}}>
        <TouchableOpacity
          style={{
            height: 40,
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
            backgroundColor: 'rgba(177, 177, 177, 0.2)',
            marginBottom: 20,
            borderRadius: 5,
            width: '33%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Picker
            selectedValue={day}
            onValueChange={itemValue => setDay(itemValue)}
            style={{
              height: '100%',
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
              width: '100%',
            }}>
            {[...Array(31)].map((_, i) => (
              <Picker.Item label={`${i + 1}`} value={i + 1} key={i + 1} />
            ))}
          </Picker>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 40,
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
            backgroundColor: 'rgba(177, 177, 177, 0.2)',
            marginBottom: 20,
            borderRadius: 5,
            width: '32%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Picker
            selectedValue={month}
            onValueChange={itemValue => setMonth(itemValue)}
            style={{
              height: '100%',
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
              width: '100%',
            }}>
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((month, index) => (
              <Picker.Item label={month} value={month} key={index} />
            ))}
          </Picker>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 40,
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
            backgroundColor: 'rgba(177, 177, 177, 0.2)',
            marginBottom: 20,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: '32%',
          }}>
          <Picker
            selectedValue={year}
            onValueChange={itemValue => setYear(itemValue)}
            style={{
              height: '100%',
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
              width: '100%',
            }}>
            {[...Array(new Date().getFullYear() - 1949)].map((_, i) => (
              <Picker.Item
                label={`${i + 1950}`}
                value={i + 1950}
                key={i + 1950}
              />
            ))}
          </Picker>
        </TouchableOpacity>
      </View>
      <Text style={[styles.label, dynamicStyles.TextColor]}>
        Select Country
      </Text>
      <TouchableOpacity
        style={{
          height: 40,
          color: theme === 'dark' ? '#FFFFFF' : '#000000',
          backgroundColor: 'rgba(177, 177, 177, 0.2)',
          marginBottom: 20,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <Picker
          selectedValue={selectedCountry}
          onValueChange={itemValue => {
            setSelectedCountry(itemValue); // Update selected country
            setLga(null); // Reset selected LGA to null
          }}
          style={{
            height: '100%',
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
            width: '100%',
          }}>
          {selectedCountry === null && (
            <Picker.Item label="Select" value={null} />
          )}
          {Array.isArray(countries) &&
            countries.map((item, index) => (
              <Picker.Item label={item.name} value={item.name} key={index} />
            ))}
        </Picker>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          gap: 5,
          width: '100%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.subCountry}>
          <Text style={[styles.label, dynamicStyles.TextColor]}>State</Text>
          <TouchableOpacity
            style={{
              height: 40,
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
              backgroundColor: 'rgba(177, 177, 177, 0.2)',
              marginBottom: 20,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              alignSelf: 'center',
            }}>
            <Picker
              selectedValue={selectedState}
              onValueChange={itemValue => {
                setSelectedState(itemValue); // Update selected country
                setSelectedLga(); // Reset selected LGA to null
              }}
              style={{
                height: '100%',
                color: theme === 'dark' ? '#FFFFFF' : '#000000',
                width: '100%',
              }}>
              {state === null && <Picker.Item label="Select" value={null} />}
              {Array.isArray(state) &&
                state.map((item, index) => (
                  <Picker.Item
                    label={item.name}
                    value={item.name}
                    key={index}
                  />
                ))}
            </Picker>
          </TouchableOpacity>
        </View>
        <View style={styles.subCountry}>
          {selectedCountry === 'Nigeria' && ( // Conditionally render the LGA picker only for Nigeria
            <>
              <Text style={[styles.label, dynamicStyles.TextColor]}>LGA</Text>
              <TouchableOpacity
                style={{
                  height: 40,
                  color: theme === 'dark' ? '#FFFFFF' : '#000000',
                  backgroundColor: 'rgba(177, 177, 177, 0.2)',
                  marginBottom: 20,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <Picker
                  selectedValue={selectedLga}
                  onValueChange={itemValue => setSelectedLga(itemValue)}
                  style={{
                    height: '100%',
                    color: theme === 'dark' ? '#FFFFFF' : '#000000',
                    width: '100%',
                  }}>
                  {Array.isArray(lga) &&
                    lga.map((item, index) => (
                      <Picker.Item label={item} value={item} key={index} />
                    ))}
                </Picker>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 40,
        }}>
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
          onPress={() => handleContinue()}>
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
              style={{color: 'fff', fontSize: 14, fontFamily: 'Campton Bold'}}>
              Update
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}>
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <G id="Essentials/information/octagon">
              <Path
                id="Icon"
                d="M7.06274 2.93726L7.76985 3.64437L7.76985 3.64437L7.06274 2.93726ZM2.93726 7.06274L2.23015 6.35563L2.23015 6.35564L2.93726 7.06274ZM2.93726 16.9373L3.64437 16.2302H3.64437L2.93726 16.9373ZM7.06274 21.0627L6.35563 21.7698H6.35564L7.06274 21.0627ZM21.0627 7.06274L21.7698 6.35564L21.0627 7.06274ZM16.9373 2.93726L16.2302 3.64437V3.64437L16.9373 2.93726ZM21.9447 8.36154L22.9171 8.12809V8.12809L21.9447 8.36154ZM21.7053 7.78343L22.5579 7.26093V7.26093L21.7053 7.78343ZM21.7053 16.2166L22.5579 16.7391V16.7391L21.7053 16.2166ZM21.9447 15.6385L22.9171 15.8719L22.9171 15.8719L21.9447 15.6385ZM15.6385 21.9447L15.8719 22.9171L15.8719 22.9171L15.6385 21.9447ZM16.2166 21.7053L16.7391 22.5579H16.7391L16.2166 21.7053ZM7.78343 21.7053L7.26093 22.5579H7.26093L7.78343 21.7053ZM8.36154 21.9447L8.12809 22.9171H8.12809L8.36154 21.9447ZM2.05526 15.6385L1.08289 15.8719L1.08289 15.8719L2.05526 15.6385ZM2.29472 16.2166L3.14736 15.6941L3.14736 15.6941L2.29472 16.2166ZM2.29472 7.78343L3.14736 8.30593L3.14736 8.30593L2.29472 7.78343ZM2.05526 8.36154L3.02763 8.59498V8.59498L2.05526 8.36154ZM8.36154 2.05526L8.59498 3.02763H8.59498L8.36154 2.05526ZM7.78343 2.29472L8.30593 3.14736V3.14736L7.78343 2.29472ZM15.6385 2.05526L15.8719 1.08289L15.8719 1.08289L15.6385 2.05526ZM16.2166 2.29472L15.6941 3.14736L15.6941 3.14736L16.2166 2.29472ZM11 16.01C11 16.5623 11.4477 17.01 12 17.01C12.5523 17.01 13 16.5623 13 16.01H11ZM13 11.01C13 10.4577 12.5523 10.01 12 10.01C11.4477 10.01 11 10.4577 11 11.01H13ZM11 8.01001C11 8.56229 11.4477 9.01001 12 9.01001C12.5523 9.01001 13 8.56229 13 8.01001H11ZM13 8.00001C13 7.44772 12.5523 7.00001 12 7.00001C11.4477 7.00001 11 7.44772 11 8.00001H13ZM14.6745 1H9.32548V3H14.6745V1ZM6.35564 2.23015L2.23015 6.35563L3.64437 7.76985L7.76985 3.64437L6.35564 2.23015ZM1 9.32548V14.6745H3V9.32548H1ZM2.23015 17.6444L6.35563 21.7698L7.76985 20.3556L3.64437 16.2302L2.23015 17.6444ZM9.32548 23H14.6745V21H9.32548V23ZM17.6444 21.7698L21.7698 17.6444L20.3556 16.2302L16.2302 20.3556L17.6444 21.7698ZM23 14.6745V9.32548H21V14.6745H23ZM21.7698 6.35564L17.6444 2.23015L16.2302 3.64437L20.3556 7.76985L21.7698 6.35564ZM23 9.32548C23 8.8839 23.0064 8.50012 22.9171 8.12809L20.9724 8.59498C20.9936 8.6833 21 8.7887 21 9.32548H23ZM20.3556 7.76985C20.7352 8.14941 20.8052 8.22848 20.8526 8.30593L22.5579 7.26093C22.358 6.93471 22.0821 6.66788 21.7698 6.35564L20.3556 7.76985ZM22.9171 8.12809C22.8436 7.82198 22.7224 7.52935 22.5579 7.26093L20.8526 8.30593C20.9075 8.3954 20.9479 8.49295 20.9724 8.59498L22.9171 8.12809ZM21.7698 17.6444C22.0821 17.3321 22.358 17.0653 22.5579 16.7391L20.8526 15.6941C20.8052 15.7715 20.7352 15.8506 20.3556 16.2302L21.7698 17.6444ZM21 14.6745C21 15.2113 20.9936 15.3167 20.9724 15.405L22.9171 15.8719C23.0064 15.4999 23 15.1161 23 14.6745H21ZM22.5579 16.7391C22.7224 16.4707 22.8436 16.178 22.9171 15.8719L20.9724 15.405C20.9479 15.5071 20.9075 15.6046 20.8526 15.6941L22.5579 16.7391ZM14.6745 23C15.1161 23 15.4999 23.0064 15.8719 22.9171L15.405 20.9724C15.3167 20.9936 15.2113 21 14.6745 21V23ZM16.2302 20.3556C15.8506 20.7352 15.7715 20.8052 15.6941 20.8526L16.7391 22.5579C17.0653 22.358 17.3321 22.0821 17.6444 21.7698L16.2302 20.3556ZM15.8719 22.9171C16.178 22.8436 16.4707 22.7224 16.7391 22.5579L15.6941 20.8526C15.6046 20.9075 15.5071 20.9479 15.405 20.9724L15.8719 22.9171ZM6.35564 21.7698C6.66788 22.0821 6.93471 22.358 7.26093 22.5579L8.30593 20.8526C8.22848 20.8052 8.14941 20.7352 7.76985 20.3556L6.35564 21.7698ZM9.32548 21C8.7887 21 8.6833 20.9936 8.59498 20.9724L8.12809 22.9171C8.50012 23.0064 8.8839 23 9.32548 23V21ZM7.26093 22.5579C7.52935 22.7224 7.82198 22.8436 8.12809 22.9171L8.59498 20.9724C8.49295 20.9479 8.3954 20.9075 8.30593 20.8526L7.26093 22.5579ZM1 14.6745C1 15.1161 0.993573 15.4999 1.08289 15.8719L3.02763 15.405C3.00643 15.3167 3 15.2113 3 14.6745H1ZM3.64437 16.2302C3.2648 15.8506 3.19482 15.7715 3.14736 15.6941L1.44208 16.7391C1.64199 17.0653 1.91791 17.3321 2.23015 17.6444L3.64437 16.2302ZM1.08289 15.8719C1.15638 16.178 1.27759 16.4707 1.44208 16.7391L3.14736 15.6941C3.09253 15.6046 3.05213 15.5071 3.02763 15.405L1.08289 15.8719ZM2.23015 6.35564C1.91791 6.66788 1.64199 6.93471 1.44208 7.26093L3.14736 8.30593C3.19482 8.22849 3.26481 8.14941 3.64437 7.76985L2.23015 6.35564ZM3 9.32548C3 8.7887 3.00643 8.6833 3.02763 8.59498L1.08289 8.12809C0.993573 8.50012 1 8.8839 1 9.32548H3ZM1.44208 7.26093C1.27759 7.52935 1.15638 7.82198 1.08289 8.12809L3.02763 8.59498C3.05213 8.49295 3.09253 8.3954 3.14736 8.30593L1.44208 7.26093ZM9.32548 1C8.8839 1 8.50012 0.993573 8.12809 1.08289L8.59498 3.02763C8.6833 3.00643 8.7887 3 9.32548 3V1ZM7.76985 3.64437C8.14941 3.2648 8.22849 3.19482 8.30593 3.14736L7.26093 1.44208C6.93471 1.64199 6.66788 1.91791 6.35563 2.23015L7.76985 3.64437ZM8.12809 1.08289C7.82198 1.15638 7.52935 1.27759 7.26093 1.44208L8.30593 3.14736C8.3954 3.09253 8.49295 3.05213 8.59498 3.02763L8.12809 1.08289ZM14.6745 3C15.2113 3 15.3167 3.00643 15.405 3.02763L15.8719 1.08289C15.4999 0.993573 15.1161 1 14.6745 1V3ZM17.6444 2.23015C17.3321 1.91791 17.0653 1.64199 16.7391 1.44208L15.6941 3.14736C15.7715 3.19482 15.8506 3.2648 16.2302 3.64437L17.6444 2.23015ZM15.405 3.02763C15.5071 3.05213 15.6046 3.09253 15.6941 3.14736L16.7391 1.44208C16.4707 1.27759 16.178 1.15638 15.8719 1.08289L15.405 3.02763ZM13 16.01V11.01H11V16.01H13ZM13 8.01001V8.00001H11V8.01001H13Z"
                fill="#FF3D00"
              />
            </G>
          </Svg>

          <Text style={styles.Header3}> Delete account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 14,
    fontFamily: 'Campton Bold',
    color: '#fff',
  },
  Header2: {
    fontSize: 14,
    fontFamily: 'Campton Bold',
    color: '#fff',
    paddingVertical: 20,
  },
  Header3: {
    fontSize: 14,
    fontFamily: 'Campton Bold',
    color: '#FF3D00',
  },
  subCountry: {width: '50%'},
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
    height: 40,
    marginBottom: 10,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: '50%',
  },
  nameInput2: {
    height: 40,
    marginBottom: 10,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: '50%',
  },
  input: {
    height: 40,
    marginBottom: 10,
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    borderRadius: 5,
    width: '98%',
    alignSelf: 'center',
  },
});

export default GeneralSettings;
