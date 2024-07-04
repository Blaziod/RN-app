/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from "@react-navigation/native";
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {ApiLink} from '../../enums/apiLink';
import {launchImageLibrary} from 'react-native-image-picker';
import {Svg, Path} from 'react-native-svg';
import CheckBox from '@react-native-community/checkbox';

const ContinueSignUp = () => {
  const [userData, setUserData] = useState(null);
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
  const navigation = useNavigation();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  useEffect(() => {
    fetch(`${ApiLink.ENDPOINT_1}/countries`)
      .then(response => response.json())
      .then(data => {
        if (data.countries && data.countries.length > 0) {
          setCountries(data.countries.slice(1)); // Skip the first element
        }
        console.log(data.countries.slice(1));
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
          if (response.data.states && response.data.states.length > 0) {
            setState(response.data.states.slice(1));
          }
        })
        .catch(error => {
          console.error('Error fetching states:', error);
          // setIsLoading(false);
        });
    }
  }, [selectedCountry]);

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

  AsyncStorage.getItem('userdatafiles1')
    .then(data => {
      const userData = JSON.parse(data);
      setUserData(userData);
    })
    .catch(error => {
      console.error('Error retrieving user data:', error);
    });

  if (!userData) {
    return (
      <View>
        <Text style={{color: '#000', fontSize: 30}}>HELLO</Text>
      </View>
    );
  }

  const handleContinue = () => {
    setIsLoading(true);
    const url = `${ApiLink.ENDPOINT_1}/profile/update`;
    const formData = new FormData();
    formData.append('gender', gender);
    formData.append('country', selectedCountry);
    formData.append('state', selectedState);
    formData.append('local_government', selectedLga);
    formData.append('user_id', userData?.userdata?.id);
    formData.append('profile_picture', {
      name: 'image.jpg', // You might need to handle the name dynamically
      type: 'image/jpeg', // Adjust the MIME type according to your image type
      uri: uploadedImage.uri,
    });
    console.log('start', userData?.userdata?.id);

    try {
      // setIsLoading(true);
      fetch(url, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${userData?.userdata?.id}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
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
          setIsModalVisible(true);
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
              fontFamily: 'Manrope-ExtraBold',
            },
          });
        })
        .finally(() => {
          setIsLoading(false); // Move this inside finally block
        });
    } catch (error) {
      console.error('Error Main :', error);
    }
  };
  const openImagePicker = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri}; // Adjusted for the typical response structure
        setUploadedImage(source); // Assuming setUploadedImage is a state setter function
        console.log('Image picked:', source);
        console.log('Imaging', uploadedImage);

        console.log(response);
        const url = `${ApiLink.ENDPOINT_1}/profile/update`;
        // Create a new FormData object
        console.log('starting Image Upload');
        let formData = new FormData();
        formData.append('user_id', userData?.userdata?.id);
        formData.append('screenshot', {
          name: 'image.jpg', // You might need to handle the name dynamically
          type: 'image/jpeg', // Adjust the MIME type according to your image type
          uri: response.assets[0].uri,
        });
        console.log('url:', response.assets[0].uri);
        console.log('type:', uploadedImage?.type);
        try {
          fetch(url, {
            method: 'post',
            headers: {
              Authorization: `Bearer ${userData?.userdata?.id}`,
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
            })
            .catch(error => {
              console.error('Error for Catch:', error);
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

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: '#000000',
          }}>
          <View>
            <View>
              <TouchableOpacity>
                <Text style={styles.goBackText}>Go back</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.heading}>Welcome onboard!</Text>
            <Text style={styles.subText}>
              Hi , we are excited to have you onboard! Finish up your profile
              set up.
            </Text>
            <View style={[{paddingVertical: 20}]}>
              <TouchableOpacity
                style={{
                  width: 66,
                  height: 66,
                  backgroundColor: 'rgba(203, 41, 190, 0.38)',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                onPress={() => openImagePicker()}>
                {uploadedImage ? (
                  <Image
                    source={uploadedImage}
                    style={{width: '100%', height: '100%'}}
                  />
                ) : (
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
                )}
              </TouchableOpacity>
              <Text
                style={[
                  {
                    color: '#b1b1b1',
                    fontSize: 11,
                    fontFamily: 'Manrope-Regular',
                    alignSelf: 'center',
                  },
                ]}>
                Upload Photo
              </Text>
            </View>
            <Text style={styles.label}>Select Gender</Text>
            <TouchableOpacity
              style={{
                height: 50,
                color: '#fff',
                backgroundColor: 'rgba(177, 177, 177, 0.2)',
                marginBottom: 20,
                borderRadius: 5,
              }}>
              <Picker
                selectedValue={gender}
                onValueChange={itemValue => setGender(itemValue)}
                style={{
                  height: 50,
                  color: '#fff',
                }}>
                {gender === '' && <Picker.Item label="Select" value={''} />}
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </TouchableOpacity>
            <Text style={styles.label}>Birthday</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              {/* <TouchableOpacity
                style={{
                  // height: 50,
                  color: "#fff",
                  backgroundColor: "rgba(177, 177, 177, 0.2)",
                  marginBottom: 20,
                  borderRadius: 5,
                }}
              > */}
              <Picker
                selectedValue={day}
                onValueChange={itemValue => setDay(itemValue)}
                style={{
                  height: 50,
                  color: '#fff',
                  width: 110,
                  backgroundColor: 'rgba(177, 177, 177, 0.2)',
                  marginBottom: 20,
                  borderRadius: 5,
                }}>
                {[...Array(31)].map((_, i) => (
                  <Picker.Item label={`${i + 1}`} value={i + 1} key={i + 1} />
                ))}
              </Picker>
              {/* </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={{
                  // height: 50,
                  color: "#fff",
                  backgroundColor: "rgba(177, 177, 177, 0.2)",
                  marginBottom: 20,
                  borderRadius: 5,
                }}
              > */}
              <Picker
                selectedValue={month}
                onValueChange={itemValue => setMonth(itemValue)}
                style={{
                  height: 50,
                  color: '#fff',
                  width: 120,
                  backgroundColor: 'rgba(177, 177, 177, 0.2)',
                  marginBottom: 20,
                  borderRadius: 5,
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
              {/* </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={{
                  // height: 50,
                  color: "#fff",
                  backgroundColor: "rgba(177, 177, 177, 0.2)",
                  marginBottom: 20,
                  borderRadius: 5,
                }}
              > */}
              <Picker
                selectedValue={year}
                onValueChange={itemValue => setYear(itemValue)}
                style={{
                  height: 50,
                  color: '#fff',
                  width: 120,
                  backgroundColor: 'rgba(177, 177, 177, 0.2)',
                  marginBottom: 20,
                  borderRadius: 5,
                }}>
                {[...Array(new Date().getFullYear() - 1949)].map((_, i) => (
                  <Picker.Item
                    label={`${i + 1950}`}
                    value={i + 1950}
                    key={i + 1950}
                  />
                ))}
              </Picker>
              {/* </TouchableOpacity> */}
            </View>
            <Text style={styles.label}>Select Country</Text>

            <Picker
              selectedValue={selectedCountry}
              onValueChange={itemValue => {
                setSelectedCountry(itemValue); // Update selected country
                setLga(null); // Reset selected LGA to null
              }}
              style={{
                height: 50,
                color: '#fff',
                backgroundColor: 'rgba(177, 177, 177, 0.2)',
                marginBottom: 20,
              }}>
              {selectedCountry === null && (
                <Picker.Item label="Select" value={null} />
              )}
              {Array.isArray(countries) &&
                countries.map((item, index) => (
                  <Picker.Item
                    label={item.name}
                    value={item.name}
                    key={index}
                  />
                ))}
            </Picker>
            {/* </TouchableOpacity> */}
            <View style={{flexDirection: 'row', gap: 20}}>
              <View
                style={{
                  marginBottom: 20,
                  borderRadius: 5,
                  width: 170,
                }}>
                <Text style={styles.label}>State</Text>
                {/* <TouchableOpacity
                  style={{
                    // height: 50,
                    color: "#fff",
                    backgroundColor: "rgba(177, 177, 177, 0.2)",

                    borderRadius: 5,
                  }}
                > */}
                <Picker
                  selectedValue={selectedState}
                  onValueChange={itemValue => {
                    setSelectedState(itemValue); // Update selected country
                    setSelectedLga(); // Reset selected LGA to null
                  }}
                  style={{
                    height: 50,
                    color: '#fff',

                    backgroundColor: 'rgba(177, 177, 177, 0.2)',

                    borderRadius: 5,
                  }}>
                  {state === null && (
                    <Picker.Item label="Select" value={null} />
                  )}
                  {Array.isArray(state) &&
                    state.map((item, index) => (
                      <Picker.Item
                        label={item.name}
                        value={item.name}
                        key={index}
                      />
                    ))}
                </Picker>
                {/* </TouchableOpacity> */}
              </View>
              <View
                style={{
                  borderRadius: 5,
                  width: 180,
                }}>
                {selectedCountry === 'Nigeria' && ( // Conditionally render the LGA picker only for Nigeria
                  <>
                    <Text style={styles.label}>LGA</Text>
                    <Picker
                      selectedValue={selectedLga}
                      onValueChange={itemValue => setSelectedLga(itemValue)}
                      style={{
                        height: 50,
                        color: '#fff',
                        backgroundColor: 'rgba(177, 177, 177, 0.2)',
                        marginBottom: 20,
                        borderRadius: 5,
                      }}>
                      {Array.isArray(lga) &&
                        lga.map((item, index) => (
                          <Picker.Item label={item} value={item} key={index} />
                        ))}
                    </Picker>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingTop: 20,
                alignSelf: 'center',
                paddingBottom: 100,
              }}
              onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
              <Text
                style={{
                  color: 'grey',
                  fontFamily: 'Manrope-Regular',
                  fontSize: 13,
                }}
                onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
                I will do this later
              </Text>
              <Text
                style={{
                  color: '#FF6DFB',
                  fontFamily: 'Manrope-Regular',
                  fontSize: 14,
                  paddingBottom: 100,
                }}
                onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
                Skip
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            padding: 20,
            justifyContent: 'flex-end',
          }}>
          <>
            <SafeAreaView>
              <View
                style={{
                  backgroundColor: '#121212',
                  width: '100%',
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  maxHeight: deviceHeight * 0.7,
                  position: 'relative',
                }}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    position: 'absolute',
                    top: -10,
                    alignSelf: 'center',
                  }}
                  onPress={() => setIsModalVisible(false)}>
                  <View
                    style={{
                      backgroundColor: '#FF6DFB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      position: 'absolute',
                      top: -20,
                      alignSelf: 'center',
                    }}>
                    <Svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        d="M18 6L6 18M18 18L6 6.00001"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </Svg>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFE8FE',
                    paddingTop: 20,
                  }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="186"
                    height="135"
                    viewBox="0 0 186 135"
                    fill="none">
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M49.2802 48.6577C49.0596 52.2473 48.8389 55.8369 48.6191 59.4273C50.0359 59.0201 59.0511 56.3755 58.4946 59.057C58.0953 60.9799 55.5606 63.0604 54.2689 64.3996C53.0802 65.6328 51.8569 66.8331 50.6015 67.999C52.9081 67.1189 55.2346 66.2847 57.5767 65.5047C59.3491 64.9152 61.1347 64.3388 62.9515 63.8963C63.6257 63.7321 65.4459 63.0621 66.0831 63.5186C67.7567 64.7198 58.6757 73.5649 57.4318 74.812C59.1902 73.9959 60.9914 73.2553 62.8239 72.6198C64.146 72.1609 68.2317 70.4063 69.4023 71.9047C70.6553 73.5074 67.5517 77.1873 66.6914 78.354C65.4574 80.0257 64.1213 81.63 62.7194 83.1637C68.547 88.3831 75.3962 93.0277 82.6851 95.9153C88.0286 98.032 93.2784 98.5714 98.9183 97.4096C104.711 96.2158 110.267 93.9267 115.549 91.3093C118.651 89.7723 121.712 88.1088 124.628 86.2401C123.426 84.7828 122.259 83.2942 121.125 81.7835C119.506 79.6258 117.517 77.2686 116.594 74.7004C115.691 72.1863 119.08 72.6773 120.705 72.8136C123.059 73.0115 125.406 73.431 127.712 73.9327C126.081 72.8021 124.48 71.6256 122.911 70.4112C120.865 68.8283 118.138 67.0392 116.799 64.7625C115.622 62.7599 118.206 63.2657 119.4 63.5276C122.249 64.1532 125.019 65.2198 127.736 66.2592C129.726 67.0212 131.703 67.8184 133.661 68.6583C132.446 67.6049 131.271 66.5006 130.142 65.3561C128.624 63.8183 126.579 61.9397 125.898 59.8214C124.512 55.5077 133.832 58.7615 135.423 59.4273C135.13 54.9584 134.836 50.4894 134.543 46.0205C122.202 49.294 109.861 52.5683 97.5204 55.8427C96.1868 56.1965 94.5173 56.9675 93.1269 57.0085C91.8665 57.0455 90.3452 56.4806 89.1169 56.2466L66.7845 51.9928C60.9494 50.8811 55.1152 49.7694 49.2802 48.6577Z"
                      fill="#FF5678"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M181.916 202.366C180.584 203.126 179.023 203.713 177.543 204.106C176.674 204.338 175.237 205.052 174.474 204.398C174.107 204.083 174.023 203.369 173.806 202.955C173.465 202.3 172.977 201.734 172.522 201.155C171.417 199.752 170.267 198.398 169.064 197.078C168.494 196.452 167.453 194.992 166.448 195.088C165.195 195.208 165.226 196.936 165.54 197.819C166.539 200.629 169.563 203.079 171.538 205.197C171.036 205.967 168.278 205.876 167.512 205.695C166.342 205.42 166.224 204.59 165.69 203.64C164.442 201.421 161.909 200.179 159.827 198.874C159.068 198.397 157.455 197.079 156.466 197.411C155.528 197.726 155.569 198.92 155.867 199.699C156.319 200.877 157.602 201.695 158.55 202.439C159.816 203.432 160.972 204.512 162.027 205.727C160.507 205.851 158.993 206.064 157.478 206.189C155.644 206.339 154.116 205.337 152.429 204.768C150.861 204.24 149.298 203.793 147.756 203.185C146.025 202.501 144.211 202.263 142.465 201.664C135.612 199.31 128.897 196.351 122.292 193.367C119.145 191.945 116.063 190.522 112.784 189.41C110.394 188.598 106.639 186.983 106.068 184.144C105.766 182.645 106.865 181.032 107.027 179.534C107.217 177.772 107.067 175.833 106.529 174.141C106.054 172.652 105.268 171.272 104.648 169.842C103.925 168.175 104.572 168.202 105.975 168.012C107.654 167.786 109.614 166.843 111.193 166.229C113.01 165.521 114.813 164.534 116.479 163.517C117.985 162.598 119.296 161.414 120.494 160.127C121.714 158.817 122.504 157.266 123.683 155.926C128.036 161.263 132.173 166.681 136.797 171.787C138.981 174.197 141.354 176.19 144.044 178.022C145.167 178.788 146.282 179.662 147.505 180.266C149.035 181.024 150.746 181.494 152.319 182.185C158.349 184.834 164.105 187.73 169.731 191.148C172.454 192.802 174.737 194.698 177.135 196.773C177.881 197.418 183.991 201.182 181.916 202.366ZM111.171 158.645C110.196 159.085 109.268 159.657 108.228 159.939C108.523 158.152 110.196 155.454 112.342 155.751C113.162 155.864 113.781 156.499 113.42 157.374C113.093 158.169 111.865 158.331 111.171 158.645ZM43.3348 110.144C42.2301 110.753 41.2002 111.107 40.5523 109.802C41.0323 109.706 43.2122 109.416 43.3348 110.144ZM41.4949 106.455C40.6413 106.196 41.3245 105.925 41.6176 105.613C41.8465 105.371 42.6047 104.52 42.8697 104.38C44.0412 103.762 44.9459 106.063 45.5065 106.81C44.1803 106.693 42.7858 106.845 41.4949 106.455ZM50.6237 114.424C49.0061 114.696 49.1855 112.678 49.2341 111.655C49.5749 112.071 51.8857 114.21 50.6237 114.424ZM55.987 110.937C54.0146 111.268 52.7106 107.87 53.0646 106.383C53.3757 105.074 54.9045 104.342 56.122 104.149C57.3017 103.962 58.944 104.217 59.2947 105.574C59.6043 106.773 57.3025 110.715 55.987 110.937ZM102.691 162.241C101.274 162.676 99.8839 162.731 98.4589 163.157C96.8421 163.641 95.3455 163.598 93.7254 163.928C93.066 164.061 91.2878 165.019 90.6449 164.804C90.0085 164.593 89.0865 162.622 88.7201 162.11C91.5874 160.922 94.0324 159.388 95.9217 156.885C97.4241 154.895 99.0352 151.912 98.0901 149.343C97.024 146.447 93.35 145.818 90.9 147.027C89.7409 147.6 88.5917 148.311 87.636 149.183C86.5435 150.18 86.1138 151.268 85.4058 152.497C84.6905 153.741 84.1883 153.05 83.4729 151.994C82.8612 151.091 82.9411 150.179 82.1771 149.288C81.7878 148.834 81.1843 148.396 80.981 147.809C80.8517 147.437 81.1234 146.778 80.8789 146.485C80.5348 146.073 80.1166 146.557 79.8285 146.189C79.6194 145.922 79.6877 145.314 79.472 144.98C79.2843 144.79 79.076 144.628 78.8455 144.494C78.5656 144.356 78.5146 144.183 78.6916 143.976C78.4693 143.565 78.6842 143.427 78.2075 142.927C77.465 142.149 76.7883 141.403 76.2598 140.484C76.0178 140.063 76.0416 139.44 75.742 139.075C75.3295 138.576 74.6438 138.651 74.2898 138.033C73.9745 137.481 74.1853 136.517 73.665 136.016C73.3908 135.938 73.1167 135.862 72.8418 135.786C72.6351 135.586 72.5149 135.344 72.4812 135.058C72.1922 134.615 72.1346 134.093 71.7699 133.625C71.0718 132.73 70.1325 131.901 69.5159 130.957C68.868 129.964 69.2113 129.797 70.3375 129.441C71.3534 129.12 72.2803 128.823 73.2221 128.277C77.5737 125.752 81.6997 119.054 74.792 117.007C72.2284 116.248 70.1226 114.206 67.28 115.009C66.0485 115.357 64.8795 116.098 63.96 116.977C63.3253 117.585 62.7367 119.21 61.9571 119.521C60.5551 120.081 61.1478 118.682 60.7502 118.04C60.56 117.733 59.7953 117.38 59.5121 117.101C59.1787 116.774 58.8576 116.36 58.6263 115.956C58.1982 115.205 57.9356 114.787 57.3174 114.174C57.0844 113.943 55.9203 112.75 56.9699 112.906C56.5452 111.615 57.1651 111.42 58.0229 110.477C59.0297 109.368 60.0686 107.829 60.0743 106.276C60.0867 103.296 56.5435 101.96 54.3183 103.73C53.8656 104.09 51.1876 107.565 51.7359 105.349C52.0314 104.153 54.7662 101.032 56.0348 101.84C54.6139 99.7754 51.349 104.79 50.5875 105.815C49.938 104.624 49.8927 103.693 48.8184 102.771C47.9449 104.168 48.4067 102.641 48.2141 102.33C47.7976 101.66 48.0264 102.427 47.8 102.188C47.5193 101.892 47.0764 101.658 46.7776 101.265C46.2655 101.958 46.4697 101.212 46.3133 100.954C45.9461 100.348 46.0877 99.9971 45.4588 99.4708C45.0011 99.0882 44.0996 98.4937 43.4839 98.4396C42.7734 98.3772 42.5767 98.6481 41.8522 98.4478C40.9319 98.1924 39.7728 97.8 40.2189 99.3353C40.5425 100.451 41.858 101.086 42.1461 102.225C42.4367 103.373 41.2982 104.53 40.7466 105.47C40.037 106.678 39.4575 106.579 38.1732 106.851C37.3516 107.025 36.2559 107.397 36.9598 108.39C37.4628 109.099 38.6416 108.95 39.3052 109.37C40.2354 109.96 40.2222 111.412 41.411 111.665C42.7191 111.942 43.4682 110.491 44.5713 110.139C45.3559 109.891 47.786 109.919 48.4035 110.506C49.2448 111.305 48.5179 112.834 48.7295 113.828C49.0439 115.302 50.0441 115.392 51.3094 115.439C52.8662 115.497 53.4136 116.988 54.2517 118.17C56.2126 120.94 57.9175 123.893 59.927 126.625C60.8161 127.835 62.1176 128.912 62.8461 130.225C63.7451 131.846 62.4963 132.781 61.4195 133.946C60.0118 135.467 58.9605 137.198 57.7388 138.86C56.6538 140.338 55.3054 139.97 53.5717 139.97C53.9578 139.176 54.4229 138.681 55.3737 138.777C54.3792 137.566 53.584 138.951 52.9394 139.718C52.0067 140.827 50.7908 141.094 49.5922 141.824C49.1682 142.081 46.8591 143.754 47.5605 144.324C47.6403 144.389 51.4626 141.883 51.898 141.653C51.898 142.578 51.6947 143.539 51.8248 144.46C51.9203 145.135 52.3961 145.838 52.2948 146.54C52.103 147.865 50.3858 148.908 49.649 149.94C49.0941 150.717 49.2283 151.33 48.9451 152.164C48.6883 152.924 48.8233 152.694 48.182 152.929C46.8747 153.408 44.6759 153.149 43.4929 152.469C42.7586 152.047 42.1955 151.38 41.5987 150.791C41.1492 150.348 40.0189 149.591 39.8946 148.97C39.6797 147.902 41.8069 145.916 42.2284 144.815C43.4172 141.704 41.378 139.287 38.2053 139.111C39.1833 138.358 40.3951 138.925 41.4258 139.212C39.6641 136.777 36.6544 138.781 35.1594 140.435C34.1386 137.861 33.6455 135.146 33.0223 132.461C32.5967 130.633 30.979 127.371 31.701 125.49C32.0492 124.58 33.0346 124.073 33.7155 123.442C34.4893 122.724 35.152 121.868 35.7184 120.98C37.0512 118.89 37.8209 116.251 35.9859 114.191C36.5432 114.1 37.1014 114.009 37.6587 113.917C36.7515 113.067 35.3207 113.481 34.1435 113.23C33.396 113.07 31.2466 113.173 30.7485 112.752C30.1484 112.245 30.5329 109.913 30.5543 109.223C30.6037 107.611 30.7387 106.06 30.9173 104.456C31.0869 102.942 31.0523 101.306 31.3668 99.8181C31.6212 98.6112 32.4353 98.2433 33.3755 97.5315C35.6204 95.8303 37.4504 93.7613 36.684 90.8293C36.9557 90.7858 37.2273 90.7431 37.499 90.7004C36.6206 90.0666 35.4829 90.2973 34.5057 89.9623C35.4039 87.4433 37.3887 83.0163 40.6116 82.7773C40.7219 83.9038 40.6462 85.2429 41.4085 86.1748C42.2754 87.2356 43.7983 87.3423 44.9731 86.7816C46.0391 86.2717 47.0402 85.1912 47.5317 84.1238C47.8642 83.4013 47.8041 82.1796 48.3878 81.6073C49.1707 80.8389 54.5661 81.3027 54.4015 82.5992C54.3035 83.3611 52.8612 84.6419 52.4578 85.3176C51.7194 86.5541 51.1292 87.8908 50.8575 89.3112C50.4467 91.4673 50.6846 94.313 52.881 95.4469C55.3787 96.7367 58.4221 95.0971 60.4703 93.68C61.5957 92.9024 62.6848 92.0444 63.7122 91.1429C64.2596 90.6635 64.8095 90.1692 65.2919 89.624C65.6476 89.2209 65.9324 88.5714 66.3712 88.2701C67.4068 87.5574 68.4218 88.766 69.2978 89.3769C70.7261 90.3712 72.1461 91.3154 73.679 92.143C76.7883 93.8228 79.6309 96.047 82.3805 98.2556C85.1457 100.478 87.9974 102.763 90.2374 105.532C88.8807 106.363 89.1227 106.58 88.5185 108.064C88.0904 109.117 87.5001 110.014 87.4326 111.185C87.3149 113.204 88.6148 114.925 90.5889 115.373C91.6928 115.623 92.7449 115.423 93.7673 114.973C94.5626 114.623 95.3545 113.762 96.1852 113.548C97.7287 113.151 98.9644 116.058 99.8296 117.083C103.672 121.632 107.735 126 111.354 130.734C111.755 131.259 112.945 132.284 113.042 132.978C113.181 133.975 111.607 134.925 110.955 135.497C110.612 135.796 106.979 139.204 108.199 139.745C108.547 139.9 109.565 137.809 109.819 137.63C110.773 136.961 110.052 138.273 109.995 138.937C109.853 140.585 110.988 141.484 112.585 141.274C114.289 141.052 115.806 139.711 116.861 138.444C118.182 139.97 120.247 142.276 120.629 144.315C120.873 145.617 119.743 148.803 121.853 149.068C122.174 149.109 123.34 148.247 123.557 148.737C123.739 149.145 122.479 149.843 122.297 149.978C121.521 150.556 121.052 151.175 120.425 151.875C119.689 152.697 118.684 153.389 117.856 154.175C116.984 155.005 115.258 157.257 114.108 156.169C113.53 155.622 113.682 154.907 112.755 154.586C111.912 154.294 110.844 154.665 110.059 154.989C109.176 155.353 106.27 156.684 105.947 157.78C105.502 159.292 107.905 157.475 108.332 157.209C107.845 158.442 107.575 160.227 106.335 160.946C105.304 161.543 103.821 161.895 102.691 162.241ZM86.2142 152.917C87.0391 150.273 91.9036 145.56 94.9783 147.034C91.3948 147.783 88.5514 150.228 86.2142 152.917ZM88.0336 160.487C86.8341 159.821 86.8992 157.886 86.4802 156.753C86.2398 156.104 85.7598 155.629 85.9006 154.908C86.0661 154.064 87.147 153.124 87.7232 152.514C89.5343 150.596 92.721 147.974 95.6361 148.414C99.3472 148.974 96.8314 153.94 95.5677 155.651C94.491 157.109 90.3419 161.769 88.0336 160.487ZM79.3773 157.253C75.3649 156.987 71.3657 156.629 67.4076 155.895C66.004 155.634 64.8285 155.673 65.6311 154.064C65.8962 153.533 67.4949 150.206 67.8563 150.302C68.0703 150.358 68.0209 152.645 68.0835 152.907C68.3675 154.084 69.1628 155.181 70.5046 155.106C72.6993 154.985 74.1136 152.155 75.2694 150.637C76.1948 151.878 76.8649 153.257 77.7959 154.477C78.2405 155.06 79.789 156.417 79.3773 157.253ZM55.852 141.549C55.1786 143.09 53.8244 144.554 52.8834 145.95C52.3508 144.826 51.9763 142.247 53.2391 141.416C53.7174 141.102 56.2776 140.576 55.852 141.549ZM69.7687 146.136C69.9539 145.543 70.1597 144.955 70.3885 144.378C70.7812 145.609 70.9813 145.646 69.7687 146.136ZM73.204 147.398C73.6905 148.221 74.503 149.031 74.3754 150.063C74.2791 150.847 73.5687 151.65 73.0616 152.196C72.2227 153.099 70.363 154.831 69.1471 153.633C68.1312 152.631 68.4852 149.877 68.9578 148.751C69.6328 147.141 72.0424 145.437 73.204 147.398ZM70.8207 145.711C71.0998 145.6 70.5137 143.804 71.0578 143.625C71.5328 144.704 71.9798 144.996 70.8207 145.711ZM63.1532 121.534C62.9721 120.87 62.5572 120.898 62.707 120.079C62.805 119.542 63.2331 118.968 63.5574 118.542C64.2036 117.694 65.0565 116.994 65.9793 116.465C67.9263 115.347 70.6009 114.883 72.3445 116.632C70.7145 116.889 65.7175 118.493 65.6854 120.716C67.4982 120.368 68.924 118.553 70.7417 117.98C72.2334 117.511 73.8518 117.544 75.3361 118.039C79.3996 119.397 77.7103 122.898 75.4168 125.173C74.0552 126.523 72.4227 127.531 70.638 128.226C69.8123 128.549 69.306 128.584 68.4935 128.422C68.342 128.392 68.1642 128.11 67.9814 128.05C67.5286 127.901 67.6604 128.408 67.2866 128.18C66.9614 127.982 66.2666 126.701 66.0452 126.334C65.6928 125.75 65.5282 125.183 65.096 124.65C64.663 124.116 64.4522 123.402 64.0513 122.919C63.8587 122.687 63.3318 122.696 63.1902 122.47C62.9779 122.129 63.2479 121.882 63.1532 121.534ZM56.9131 147.647C57.8368 146.047 59.4166 144.689 60.6391 143.291C60.714 145.589 59.0609 147.163 56.9131 147.647ZM58.1612 148.386C60.0686 147.717 61.119 146.116 61.3133 144.175C61.5603 141.717 63.1087 140.427 64.0406 138.217C64.3979 137.372 64.8145 134.586 66.2 135.383C66.6758 135.657 66.9573 136.685 67.2051 137.15C67.8044 138.274 68.4852 139.364 69.1208 140.467C69.6386 141.365 70.4141 142.269 70.186 143.351C69.9868 144.294 69.3455 145.299 68.9709 146.188C68.0852 148.288 66.9211 150.224 65.9489 152.278C65.5562 153.106 65.0919 155.069 63.8941 155.059C62.9466 155.051 63.0528 154.018 62.4279 153.663C61.6401 153.216 60.7444 154.067 60.0974 154.419C60.8424 153.165 62.1456 152.454 63.6101 152.691C61.8566 150.949 60.6712 153.298 59.1663 153.822C57.7405 154.318 55.2107 151.98 54.0096 151.317C54.469 150.541 54.8839 149.593 55.6742 149.082C56.4233 148.599 57.3429 148.673 58.1612 148.386ZM42.6557 164.298C42.864 163.295 43.4542 162.703 43.8288 161.792C44.2626 162.896 43.2468 163.547 42.6557 164.298ZM72.9562 170.45C72.8541 173.826 72.5775 177.193 72.4779 180.57C72.4318 182.128 72.1552 183.614 71.9716 185.153C71.816 186.455 71.895 187.733 71.0735 188.845C69.7777 190.599 67.2578 191.103 65.3018 191.753C63.8653 192.23 62.4131 192.662 60.9939 193.192C59.7179 193.669 58.6888 194.392 57.4754 194.958C56.3904 195.466 55.2181 195.766 54.1372 196.306C53.0193 196.865 52.136 197.547 50.9876 198.044C49.6136 198.64 48.4808 199.7 47.2583 200.541C46.1824 201.281 45.0439 201.853 44.1186 202.784C43.2501 203.658 42.1519 204.041 41.1681 204.817C40.1276 205.638 39.0393 206.172 37.89 206.815C35.5356 208.134 32.3596 210.386 29.5269 209.106C30.3378 208.073 31.9957 207.082 32.1217 205.66C32.2855 203.809 30.6687 204.49 29.7327 205.082C28.3151 205.977 27.5306 207.059 26.4513 208.252C25.1893 209.647 23.5955 208.709 22.0512 208.316C23.1074 207.369 24.1545 206.412 25.2082 205.463C26.0981 204.662 27.4589 203.796 28.0006 202.688C28.3883 201.896 28.3694 200.81 27.4351 200.399C26.3896 199.939 25.2074 200.909 24.4328 201.486C22.378 203.019 21.0238 204.963 19.6745 207.097C18.9567 208.232 18.6257 208.145 17.3053 207.918C15.9059 207.678 14.5062 207.422 13.0952 207.253C14.9644 205.339 17.0534 203.265 18.5294 201.026C19.0077 200.301 19.6317 198.388 18.1746 198.212C17.5744 198.14 16.3783 199.364 15.9154 199.694C13.8912 201.136 11.9451 202.956 10.6035 205.062C10.1605 205.757 10.0214 206.531 9.1638 206.588C8.04264 206.664 5.95906 205.597 4.87742 205.267C6.94471 202.669 8.9975 200.052 11.4127 197.761C13.6318 195.655 15.8454 194.126 18.4405 192.511C21.2222 190.78 23.8129 188.787 26.3665 186.743C28.8115 184.785 31.3651 182.938 33.615 180.752C38.1098 176.387 42.1132 171.365 45.4283 166.057C46.2038 164.814 46.934 163.539 47.5654 162.217C48.1581 160.976 48.4314 159.492 49.2316 158.363C49.5082 157.973 49.8976 157.683 50.1438 157.276C50.3767 156.892 50.2977 156.429 50.6517 156.089C51.4716 155.305 52.9641 155.778 53.7306 156.328C54.9621 157.212 55.959 158.285 57.3132 159.026C58.6749 159.77 60.1484 160.312 61.6566 160.677C65.1816 161.532 68.6754 162.233 72.2663 162.752C71.8967 164.118 72.8047 164.333 73.1052 165.563C73.4699 167.054 73.0023 168.93 72.9562 170.45ZM39.017 147.667C38.2177 146.484 37.5048 145.246 36.7194 144.054C36.2411 143.328 35.6484 142.549 36.0567 141.662C36.7458 140.166 39.1751 139.899 40.4931 140.552C43.4904 142.035 40.7063 146.274 39.017 147.667ZM31.0836 120.593C30.8078 118.279 31.6953 116.638 33.7945 115.424C35.2911 114.56 36.4955 115.741 36.2913 117.318C35.981 119.719 33.4067 122.39 31.4425 123.643C31.3141 122.627 31.2054 121.609 31.0836 120.593ZM30.7634 113.973C31.3833 113.483 33.0412 114.108 33.7591 114.151C32.772 115.011 31.785 115.87 30.7988 116.73C30.7337 116.14 30.192 114.425 30.7634 113.973ZM34.0933 91.6274C39.087 90.9804 33.3384 96.3229 31.892 97.1604C32.1274 96.0232 32.7053 91.808 34.0933 91.6274ZM47.3876 82.274C46.7167 85.0122 41.504 87.9992 41.4497 83.5138C41.4291 81.8422 42.3708 81.9776 43.7456 81.8175C44.5293 81.7256 47.7704 80.7083 47.3876 82.274ZM29.382 86.5147C28.7967 88.046 28.3274 89.6166 27.7545 91.1495C27.5001 91.8285 27.2013 92.2949 26.7279 92.8335C26.3311 93.2826 25.8602 93.3967 25.8759 94.1069C26.3723 94.0117 26.76 93.7169 27.1617 93.432C27.0638 94.8417 26.5649 96.3582 26.3229 97.763C26.0331 99.4478 25.7919 101.133 25.7022 102.841C25.5079 106.556 25.5062 110.256 25.5877 113.973C25.6297 115.867 25.6487 117.762 25.7507 119.653C25.8026 120.595 25.8602 121.54 25.9763 122.475C26.024 122.852 26.299 123.656 26.1294 124.01C25.4618 125.399 22.508 121.583 21.2246 122.143C21.409 121.086 20.9834 121.317 20.2722 120.797C19.9281 120.545 19.7041 120.117 19.3444 119.893C19.2357 119.775 19.1164 119.672 18.9863 119.581C18.8373 119.379 18.6809 119.4 18.5162 119.645C17.0706 118.783 16.6977 116.948 15.9215 115.712C15.5223 115.077 15.1368 114.978 15.0687 114.1C15.0097 113.335 15.1251 112.555 15.094 111.786C15.0587 110.92 15.0078 109.965 14.764 109.125C14.4809 108.151 14.0915 108.23 13.3331 107.711C13.5668 107.609 13.7208 107.438 13.7954 107.198C13.5532 107.241 12.8172 107.54 12.6344 107.325C12.2748 106.902 13.1233 106.846 13.3464 106.677C12.3947 106.256 12.5997 105.91 12.9431 105.138C13.0403 104.92 13.1331 104.593 13.2157 104.409C13.3963 104.007 13.5001 104.262 13.5597 103.762C13.6165 103.285 13.1927 102.348 13.0679 101.84C12.8584 100.989 12.7427 100.252 12.9307 99.3649C13.0831 98.6465 13.4929 97.9962 13.5215 97.2573C13.5296 97.0495 13.2125 96.9806 13.2082 96.7811C13.2021 96.4879 13.4761 96.359 13.5474 96.0889C13.7293 95.396 13.6473 94.6644 13.9585 94.0067C14.2387 93.4172 14.8045 92.6537 15.2049 92.1389C15.4825 91.7817 16.1634 91.3794 16.2375 90.9081C16.2869 90.5961 15.7999 90.6323 15.8216 90.3966C15.8511 90.0789 16.119 89.9754 16.1923 89.739C16.3948 89.0895 16.4458 88.4655 16.9694 87.968C17.6296 87.3415 17.9161 87.6043 17.9433 86.5714C17.9564 86.0673 17.5522 85.9893 17.7687 85.408C17.8865 85.0927 18.2339 84.9063 18.4553 84.683C19.1155 84.0196 19.5601 83.4309 20.0293 82.6115C20.4442 81.8873 21.1069 81.4661 21.5325 80.8405C22.0866 80.0252 21.2584 79.6212 22.3821 79.3913C22.2224 78.8856 22.0528 78.4767 22.4735 78.0481C22.7386 77.778 23.412 77.943 23.6466 77.631C23.9158 77.2722 23.5173 76.4216 23.9232 76.1893C24.2533 75.9996 24.7472 76.5826 25.265 76.2944C25.6602 76.0743 26.2562 74.8592 26.1294 74.4134C27.1502 74.9856 26.8958 74.5915 27.384 73.8567C27.4935 73.6917 27.8261 73.6555 27.9199 73.4889C28.1085 73.1572 28.0657 72.8181 28.3373 72.548C28.7901 72.098 29.531 72.2138 30.0299 71.8928C30.4415 71.6276 30.4193 71.341 30.7477 71.0906C31.0293 70.8771 31.4903 70.8361 31.7628 70.6144C32.2979 70.1801 32.3028 69.7219 32.9721 69.3475C33.764 68.905 34.4654 68.529 35.1857 67.9419C35.6558 67.5593 36.1012 66.8811 36.6511 66.6291C37.4109 66.2801 38.0028 66.2555 38.747 65.7571C39.2838 65.3975 39.7917 64.8031 40.3194 64.5001C40.717 64.271 40.9969 64.3203 41.4982 64.1791C42.4005 63.9237 42.6203 63.0756 43.3571 62.7307C43.8625 62.4935 44.5985 62.7102 45.1534 62.5862C46.8813 62.1995 48.5879 61.3653 50.3207 60.9031C52.4373 60.3399 54.5678 59.8456 56.6999 59.348C54.7407 61.9951 52.2446 64.3843 49.714 66.487C48.8834 67.1775 44.331 70.3246 46.7842 71.6686C47.7696 72.208 49.9091 70.4658 50.7052 70.0397C52.3064 69.1825 53.9652 68.4953 55.6421 67.8023C58.3546 66.68 61.8871 64.6857 64.9009 64.8458C63.0659 67.0905 60.7757 68.8919 58.6773 70.8747C56.7485 72.6966 53.8425 74.4052 54.7522 77.3872C52.0429 76.7008 49.6103 75.888 46.794 76.0686C45.532 76.1491 44.27 75.9972 43.0146 76.1737C41.6489 76.3658 40.363 76.8215 39.0508 77.2213C38.0127 77.5374 36.8651 77.5629 35.9102 78.0884C35.4483 78.3429 34.8778 78.7058 34.4629 79.0211C33.9097 79.4414 33.7846 79.7198 33.3499 80.274C31.8015 82.2519 30.3024 84.1058 29.382 86.5147ZM20.9102 123.94C20.8254 123.598 20.7488 123.285 20.6517 122.894C21.5136 123.424 21.5136 123.424 20.9102 123.94ZM14.3944 113.04C14.2881 113.186 13.8416 113.233 13.7119 113.107C13.5504 112.95 13.9748 112.337 14.043 112.208C14.2112 112.337 14.5983 112.758 14.3944 113.04ZM12.5485 109.073C12.6627 108.655 12.7771 108.237 12.8912 107.819C13.0313 108.207 13.6632 108.634 13.6772 109.004C13.6859 109.249 12.6734 109.127 12.5485 109.073ZM12.9149 109.646C13.9041 110.295 14.0076 111.061 14.0371 112.182C12.8533 111.791 13.0232 110.648 12.9149 109.646ZM30.118 65.4213C30.0183 65.6906 29.5944 66.5305 29.284 65.9427C29.1844 65.7546 29.9113 65.4985 30.118 65.4213ZM29.8339 64.5058C30.0784 64.2866 30.5716 64.56 30.8482 64.3819C31.0416 64.2579 30.9774 64.1314 31.0688 64.0575C31.0869 64.0428 31.3503 63.5107 31.4582 63.39C31.6491 63.1782 32.0649 63.0452 32.297 62.8539C32.9449 62.3186 33.3104 61.6149 33.7179 60.899C34.2044 60.0435 34.3592 59.9449 35.1437 59.5533C35.6846 59.2832 36.1036 58.9531 36.5441 58.4942C37.0512 57.9662 37.0133 57.5877 37.4298 57.0105C37.6357 56.7256 37.9312 56.6903 38.1716 56.4604C38.4581 56.1854 38.6046 55.8003 38.8697 55.5228C38.9849 55.4029 39.3529 55.4038 39.4221 55.3003C39.511 55.1706 39.5801 54.65 39.6633 54.5548C39.8213 54.7683 39.9802 54.9817 40.1383 55.1952C40.7639 54.0991 41.22 53.1935 42.2655 52.4636C43.3628 51.6976 44.3112 50.5768 45.4456 49.8913C45.7008 49.7369 46.2203 49.672 46.4154 49.4454C46.7447 49.0604 46.459 48.7188 46.6994 48.392C46.9719 48.0226 47.5004 48.3214 47.847 48.1621C48.2857 47.9602 48.4109 47.3707 48.9756 47.4355C47.1184 49.6261 47.1423 53.0342 47.0435 55.7708C47.0007 56.9498 47.7457 57.5434 46.6459 58.4088C45.7107 59.1452 44.3919 58.9268 43.2863 59.4104C41.8983 60.0188 40.4132 60.3423 38.9964 60.8727C37.5311 61.4212 36.3531 62.381 34.9429 63.0156C33.6998 63.5756 32.8502 64.3712 31.7134 65.0625C31.2902 65.3195 30.6349 65.6922 30.1311 65.3852C29.815 65.1931 29.4223 64.877 29.8339 64.5058ZM50.8089 46.1391C50.8904 45.8271 52.4751 45.0093 52.8653 44.7425C53.4507 44.3418 54.3167 43.3623 54.9703 43.7515C55.1967 42.8475 56.08 41.8418 56.8605 41.6496C57.7257 41.437 59.2116 40.6964 60.0628 40.0511C60.3114 39.8622 60.3937 39.5864 60.6868 39.409C61.1964 39.1011 61.7019 39.2694 62.1925 38.8491C62.2682 38.785 62.9474 37.6668 62.9746 37.6774C63.0091 37.7973 63.0404 37.918 63.0684 38.0403C63.5838 37.7554 64.0431 37.5288 64.3642 37.1651C64.4374 37.0822 63.9649 36.8679 64.1139 36.7045C64.2967 36.505 64.7042 36.7283 64.8886 36.5386C64.3148 39.3786 64.742 43.0347 67.6324 44.4748C64.1954 44.8451 60.8383 43.8147 57.3585 44.4478C55.6923 44.7507 53.9997 45.2483 52.4842 46.0118C51.5564 46.4798 50.3693 48.1564 49.4448 47.3427C49.812 46.855 50.371 46.5521 50.8089 46.1391ZM67.4875 37.9673C68.7725 36.3991 70.7219 35.7792 72.6862 36.3408C74.9846 36.9976 74.0149 38.5995 73.6683 40.3778C73.0048 39.4082 71.5674 38.4459 70.3441 38.4172C68.6096 38.3761 69.2648 39.8171 70.3062 40.3335C71.2537 40.8023 72.878 40.9329 73.5555 41.7859C74.2157 42.616 73.963 43.974 74.0692 44.9527C73.5563 44.8763 73.0434 44.8008 72.5297 44.7244C72.9603 42.4395 71.0652 42.3295 69.2986 41.6849C67.513 41.0347 66.0246 39.7506 67.4875 37.9673ZM73.2443 32.3406V34.4614C72.5298 34.055 71.8152 33.6486 71.0998 33.2421C71.8152 32.9417 72.5298 32.6411 73.2443 32.3406ZM78.9904 49.2837C81.377 49.9282 83.747 50.6105 86.0414 51.4997C86.8745 51.8232 87.7874 51.9373 88.6041 52.3027C89.3812 52.6492 89.4981 52.613 89.2215 53.2928C88.4468 55.196 86.6119 54.8676 85.0041 54.5761C82.4875 54.1205 80.0228 53.4883 77.5374 52.8938C75.1081 52.3133 72.6277 51.9324 70.2354 51.2041C67.7797 50.4578 65.3874 49.7509 62.8618 49.2574C62.125 49.1137 56.2949 48.5801 56.3394 47.9725C60.011 47.4971 63.7912 47.9659 67.4793 48.0152C71.313 48.0669 75.2727 48.2787 78.9904 49.2837ZM75.7502 41.9206C75.7963 40.6127 75.8144 39.2998 75.9774 37.9985C77.0698 39.3425 78.0561 39.7456 79.4325 38.4853C80.7513 37.2792 81.0452 36.6503 82.7163 37.7842C84.1661 38.7678 85.5367 38.7226 87.0753 37.8613C88.0138 37.3367 89.522 35.1905 90.509 35.6322C90.9791 35.8432 91.324 36.6913 91.7982 37.0042C92.3942 37.395 93.3105 37.6659 94.0044 37.8178C95.6443 38.1758 96.6207 37.1249 97.6497 36C99.1422 34.3694 99.0986 35.3169 100.482 36.4475C102.026 37.7086 103.316 37.092 104.714 36.0165C105.565 38.5026 105.884 41.2186 106.124 43.8262C106.205 44.7064 106.508 45.9568 105.716 46.5792C105.157 47.0176 103.97 47.0349 103.296 47.2779C100.891 48.1449 98.5791 49.3757 96.5663 50.9504C95.7826 51.5646 95.0993 52.3158 94.0283 52.1762C93.0067 52.0432 92.0147 51.191 91.1931 50.6286C90.3024 50.0177 89.401 49.3247 88.3596 48.9848C87.7496 48.7861 86.7724 48.8576 86.2389 48.493C85.247 47.8132 86.4143 46.0324 86.1673 44.8369C85.9805 43.9288 85.456 42.0355 84.2023 42.5684C82.336 43.3599 83.4219 46.4503 84.4484 47.415C82.3484 47.0431 80.0244 46.5004 77.9993 45.8107C76.4351 45.2778 75.6942 43.5175 75.7502 41.9206ZM110.961 48.2952C115.271 47.0882 119.304 46.2746 123.79 46.0554C125.774 45.9577 127.697 46.0192 129.66 46.0373C130.79 46.0471 131.651 45.1391 130.748 44.0931C129.499 42.6456 125.687 43.1973 123.998 43.1316C119.471 42.9576 115.32 43.4707 111.033 44.9584C111.486 44.1259 112.575 44.0175 113.322 43.5873C114.238 43.0585 114.86 42.1882 115.251 41.2219C116.269 38.7087 115.244 36.34 114.18 34.0443C116.271 34.6059 118.435 35.8342 120.538 36.1462C120.979 36.211 121.261 36.1692 121.652 36.3293C121.89 36.427 121.966 36.7669 122.263 36.8408C122.407 36.8769 122.751 36.5534 122.913 36.5994C123.553 36.78 123.047 36.8276 123.452 37.0896C123.773 37.2965 123.747 37.5633 124.336 37.4656C124.598 37.4221 124.881 37.019 125.019 37.0083C125.195 36.9943 125.154 36.7808 125.422 36.8432C125.911 36.9566 125.867 37.5838 126.03 37.8925C126.204 38.221 125.957 38.6586 126.484 38.8384C126.878 38.973 126.977 38.5576 127.312 38.588C127.516 38.606 127.938 38.8983 128.117 39.0757C128.696 39.6496 129.488 40.2826 130.267 40.6554C130.19 40.579 130.633 40.3943 130.527 40.3507C130.456 40.322 130.921 40.4337 130.915 40.432C131.363 40.5338 131.601 41.2219 131.828 41.4723C132.246 41.9321 132.894 42.4173 133.48 42.6201C134.492 42.9715 134.461 42.552 134.83 43.7507C135.549 42.6234 135.825 44.5118 136.718 44.7195C137.18 44.8271 137.126 44.63 137.546 44.8714C137.834 45.0364 138.026 45.543 138.244 45.7869C138.337 45.4346 138.43 45.0824 138.523 44.7302C139.166 45.9437 140.553 47.869 142.074 47.5209C142.074 47.8518 141.938 48.2484 142.194 48.5308C142.374 48.7287 142.665 48.5037 142.805 48.6187C142.928 48.7188 143.222 49.1187 143.316 49.1844C143.501 49.3133 143.837 49.4077 143.998 49.5366C144.14 49.6507 144.21 50.1934 144.367 50.3888C144.662 50.7575 145.173 50.8305 145.414 51.2723C145.469 50.8371 145.524 50.4011 145.58 49.9652C146.059 50.3338 146.1 50.6204 146.218 51.1606C146.385 51.9299 146.162 51.7493 146.695 52.0736C147.218 52.393 147.49 52.3577 147.969 52.9111C148.439 53.4538 148.444 53.7888 149.121 53.2231C149.248 53.6418 149.288 54.1829 149.625 54.5031C149.878 54.7453 150.931 54.756 151.032 55.3282C149.054 53.6648 150.356 56.1911 151.033 55.3323C151.176 56.2519 151.851 56.5491 152.622 57.2035C153.341 57.8135 153.459 57.7692 153.704 58.7947C153.698 58.7725 154.065 58.9991 154.092 59.0443C153.391 59.1436 154.477 59.9244 154.661 60.0673C154.795 60.1707 154.969 59.922 155.192 60.0911C155.446 60.284 155.653 60.7217 155.86 60.986C156.421 61.7028 156.837 62.3186 157.427 62.9015C158.065 63.5304 158.375 64.3252 158.987 65.06C159.666 65.8762 160.034 66.8146 160.601 67.7013C161.141 68.5437 161.858 69.2203 162.483 69.9921C163.48 71.2203 163.818 73.9249 165.676 73.9955C165.567 74.1079 165.718 74.9462 165.736 75.1006C165.824 75.8625 165.766 76.5949 166.217 77.2837C166.321 76.4972 166.733 76.801 167.092 77.214C167.688 77.9012 167.165 77.7279 167.196 78.425C167.235 79.269 167.331 78.6163 167.654 79.3536C167.906 79.9308 168.045 80.3052 168.18 80.9464C167.131 81.0293 166.65 80.1746 166.262 79.3462C166.1 78.9997 166.044 78.4299 165.758 78.1598C165.452 77.8716 165.032 77.8486 164.719 77.5268C164.116 76.9093 163.855 75.9454 163.145 75.3444C162.343 74.6646 162.165 74.3436 161.502 73.5316C160.769 72.6333 159.756 72.002 158.987 71.1333C158.215 70.263 158.278 70.7376 157.31 70.4231C156.281 70.0873 154.616 66.8606 153.319 68.1028C153.371 67.29 152.149 66.5256 151.531 66.2309C151.265 66.1036 150.954 66.2185 150.687 66.028C150.397 65.8203 150.376 65.4213 150.084 65.1733C150.085 65.1733 149.636 65.2817 149.546 65.2357C149.361 65.1422 149.359 64.8113 149.196 64.7029C148.744 64.4016 148.205 64.0863 147.726 63.8293C146.559 63.2061 145.529 62.4384 144.404 61.688C143.441 61.0443 142.273 59.8834 141.16 59.5443C140.187 59.2479 139.575 59.3989 138.778 58.8062C138.344 58.4827 138.472 58.3743 137.775 58.174C137.11 57.9827 136.737 58.0812 136.386 57.3784C135.77 56.1501 136.159 53.7526 136.04 52.3749C135.913 50.9135 135.763 49.4151 135.381 47.9938C134.929 46.3132 134.331 45.4346 132.524 45.8304C128.942 46.6153 125.404 47.3625 121.806 48.0513C114.637 49.4241 107.591 51.6647 100.58 53.6541C100.046 53.806 97.066 54.4858 97.6752 52.9505C97.9551 52.2419 99.8411 51.9775 100.473 51.755C103.937 50.5325 107.419 49.2862 110.961 48.2952ZM109.757 45.1686C109.233 45.3673 108.71 45.566 108.186 45.7655V44.3139C108.71 44.5988 109.233 44.8837 109.757 45.1686ZM107.581 37.4927C108.036 37.8638 108.961 36.9713 109.348 36.7907C110.009 36.482 110.85 36.2168 111.589 36.28C112.949 36.3974 113.945 37.7341 113.696 39.0888C113.274 41.382 109.998 42.4658 108.192 43.3623C108.133 42.5495 107.87 41.5725 108.441 40.8705C108.937 40.2604 109.899 40.3039 110.357 39.6553C111.51 38.0239 108.387 37.8761 107.689 39.1734C107.414 38.3441 107.139 37.5157 106.863 36.6864C107.528 36.5772 107.236 37.2119 107.581 37.4927ZM110.803 33.0057C110.153 33.4244 109.503 33.844 108.853 34.2627C108.531 32.8119 109.629 32.6214 110.803 33.0057ZM170.033 83.4851C169.181 83.8907 168.969 82.9227 168.357 82.8816C169.079 82.4382 169.079 82.4382 170.033 83.4851ZM173.495 104.606C173.601 105.996 173.518 107.403 173.703 108.787C173.845 109.841 174.273 110.821 174.318 111.886C174.419 114.219 173.629 116.595 172.032 118.306C170.523 119.924 168.363 121.316 166.325 121.996C165.407 122.302 164.449 122.981 163.556 123.233C162.569 123.511 161.632 122.906 160.818 123.99C160.276 119.338 160.673 114.478 160.63 109.797C160.587 105.106 160.637 100.413 159.841 95.7728C159.132 91.6397 157.735 86.9909 155.159 83.6099C154.113 82.2371 152.825 81.1123 151.466 80.0597C150.762 79.5137 150.056 78.9299 149.271 78.4989C148.062 77.8347 147.033 77.9266 145.72 77.737C143.838 77.4668 142.091 77.2378 140.202 77.7657C138.445 78.2575 136.51 78.8174 134.936 79.6713C133.368 80.5228 131.547 80.8733 129.919 81.6361C128.812 82.1542 126.512 83.8866 125.283 83.5746C124.094 83.2724 122.333 81.26 121.574 80.3594C120.604 79.2074 119.801 77.8716 118.94 76.6326C118.638 76.1975 118.022 75.5251 117.943 74.9659C117.806 73.9963 118.197 74.3132 119.126 74.4216C121.515 74.7007 123.762 75.1433 126.053 75.8929C127.192 76.2656 129.42 77.7755 130.561 76.8708C132.301 75.4898 129.657 73.1161 128.688 72.3189C127.038 70.9601 125.12 69.951 123.361 68.7432C121.492 67.46 119.021 66.0946 117.819 64.1183C121.33 65.152 124.838 66.3359 128.247 67.6685C129.807 68.2785 131.349 68.9222 132.815 69.7334C133.637 70.1883 135.3 71.4198 136.291 70.8295C138.445 69.5479 133.497 65.8244 132.783 65.0633C131.674 63.881 130.588 62.7094 129.369 61.6371C128.545 60.9129 127.254 60.4047 126.872 59.3365C128.237 59.8292 129.34 60.7947 130.618 61.4499C131.288 61.7939 131.898 61.9918 132.638 62.0969C133.425 62.2094 133.519 62.3342 134.14 62.647C134.624 62.89 135.12 63.216 135.663 63.381C136.05 63.4992 136.726 63.5198 137.064 63.7382C137.237 63.9845 137.415 64.2259 137.6 64.464C137.806 64.5239 138.009 64.5937 138.209 64.6725C138.509 64.9394 138.687 65.3072 138.978 65.5822C141.095 67.5782 143.927 69.0068 146.302 70.6793C148.546 72.2614 150.93 73.6925 153.087 75.4191C155.569 77.4061 158.144 79.5424 160.256 81.9251C161.449 83.2724 162.43 84.7987 163.432 86.2881C164.158 87.3661 165.214 88.2611 165.84 89.3728C167.208 91.7973 168.343 94.4181 169.815 96.8024C171.315 99.2327 173.27 101.647 173.495 104.606ZM153.319 118.672C153.728 116.989 156.035 115.025 157.51 114.283C156.767 116.116 154.787 117.366 153.319 118.672ZM157.124 124.54C155.866 127.142 150.335 127.44 151.086 123.589C151.453 121.703 153.014 120.545 154.354 119.31C154.973 118.74 156.489 116.7 157.448 117.028C157.403 118.495 157.316 119.969 157.32 121.436C157.321 122.416 157.569 123.619 157.124 124.54ZM155.526 94.5527C156.036 95.6956 156.544 96.6472 155.597 97.6694C155.17 98.1308 153.778 99.1399 153.148 98.9158C151.126 98.1973 154.981 95.0667 155.526 94.5527ZM143.298 84.3858C143.785 84.3595 144.258 84.4317 144.739 84.4022C145.218 84.3726 145.269 84.2872 145.713 84.348C145.76 84.4161 145.807 84.4843 145.854 84.5516C145.915 85.0081 146.155 85.0574 146.574 84.701C147.157 84.8299 147.536 84.9162 148.095 85.2306C146.589 86.3127 144.757 87.5714 142.911 87.9343C139.995 88.5082 140.8 84.5229 143.298 84.3858ZM98.5816 108.721C98.2786 109.328 97.4085 107.813 97.1936 107.53C97.5945 107.529 98.887 108.11 98.5816 108.721ZM122.018 92.753C124.284 91.4344 126.976 90.2767 129.411 89.2956C129.838 91.3515 127.751 94.0051 126.465 95.4124C125.425 96.5503 124.172 97.7302 122.763 98.3846C121.238 99.0923 119.573 98.7819 119.647 96.795C119.674 96.0692 119.84 94.9017 120.136 94.2375C120.519 93.3828 121.241 93.2046 122.018 92.753ZM91.3833 55.3553C91.7208 55.3356 95.385 54.8635 95.3652 55.3175C95.3076 56.6846 91.7513 55.6115 91.3833 55.3553ZM65.4722 81.7354C67.4076 79.3544 70.5318 76.7845 70.5779 73.4577C70.6454 68.561 65.1956 71.0044 62.4551 71.208C63.904 69.7884 71.1846 63.8342 66.8783 61.7192C65.6402 61.1116 63.8809 61.7053 62.6387 62.0238C60.4349 62.5887 58.3859 63.5674 56.2208 64.248C57.7677 62.6068 60.4407 60.7405 60.3534 58.2536C60.2464 55.2272 57.7545 55.9588 55.5993 56.403C54.7711 56.5737 51.0724 58.0409 50.3776 57.045C50.1232 56.6797 50.5348 56.2166 50.622 55.8915C50.776 55.3167 50.7282 55.1164 50.7332 54.5285C50.7439 53.3438 51.5334 51.8232 50.8896 50.7213C50.7422 50.9718 50.6163 51.232 50.5117 51.503C50.2993 50.8617 50.4418 50.1811 50.2294 49.5399C55.6091 50.9118 61.082 51.6631 66.4955 52.8339C69.236 53.4267 71.8152 54.4472 74.5936 54.9062C77.395 55.3693 80.1479 56.0778 82.9551 56.5196C85.5161 56.9227 87.9694 57.5935 90.5057 58.1074C92.9779 58.6091 95.5134 57.5106 97.9263 56.9539C103.332 55.7075 108.734 54.4308 114.146 53.2214C120.39 51.8256 126.887 50.6318 132.865 48.3042C132.981 51.4069 133.23 54.5039 133.61 57.5853C130.97 56.3414 127.052 54.719 124.383 56.9457C123.315 57.8357 122.986 59.3743 123.408 60.6822C123.868 62.1059 125.276 62.7669 126.204 63.8392C123.378 63.1166 116.087 58.0229 114.788 63.1716C113.872 66.8072 118.343 69.1562 120.53 71.2031C118.359 70.7786 115.451 69.0487 114.176 71.8295C113.074 74.2344 114.402 76.8502 115.761 78.8339C116.497 79.9078 117.326 80.9193 118.109 81.9604C118.523 82.5113 118.928 83.0696 119.362 83.6041C119.799 84.1403 120.622 84.701 120.928 85.2782C121.544 86.4417 120.301 86.5131 119.335 86.9326C118.128 87.4581 117.093 88.3391 115.989 89.0411C113.462 90.6495 111.254 92.143 108.269 92.6578C105.195 93.1865 102.236 93.7391 99.2023 94.4772C96.1786 95.2129 93.7105 95.9198 90.6193 94.969C89.21 94.5355 88.0624 94.1496 86.5674 94.2317C84.9975 94.3171 84.0796 94.2358 82.7888 93.2662C77.2345 89.0953 71.2052 85.6732 65.4722 81.7354ZM55.4585 77.5481C57.6055 76.4742 59.7664 75.3953 61.9842 74.4725C63.82 73.7081 66.6066 72.8181 68.6161 73.1531C68.0498 74.6039 67.0158 75.7935 65.9077 76.8625C64.9273 77.8067 63.7023 79.2329 62.5152 79.8922C61.4384 80.4907 60.1846 79.5424 59.1219 79.145C57.9545 78.7091 56.3476 78.5054 55.4585 77.5481ZM55.9985 82.9654C57.0679 82.5228 59.3672 84.0097 60.3402 84.3964C62.2518 85.1567 64.1748 85.9507 65.86 87.1494C63.8027 89.5206 61.4722 91.6881 58.7028 93.2112C56.881 94.2128 53.8104 95.3623 52.0923 93.5429C49.933 91.2571 52.5286 86.5985 54.0574 84.6403C54.1076 84.9753 54.1586 85.3103 54.2097 85.6452C54.697 84.8669 55.0691 83.3504 55.9985 82.9654ZM95.2714 103.257C93.9369 103.537 93.4833 103.284 92.6025 102.264C92.0065 101.574 91.4212 100.858 90.7502 100.238C90.0645 99.6046 88.3719 98.0783 90.5288 98.9576C92.4938 99.7582 94.1781 100.159 96.3408 99.8444C98.8129 99.4864 101.118 98.4437 103.556 97.9165C102.219 99.0824 100.893 100.26 99.5538 101.422C98.1395 102.651 97.0693 102.88 95.2714 103.257ZM95.5768 112.635C92.6519 114.829 86.7642 114.591 88.7457 109.763C89.047 109.03 89.4676 108.34 89.955 107.715C90.118 107.506 90.4069 107.074 90.6383 106.934C91.2853 106.543 91.1059 106.496 91.7282 107.148C92.2641 107.711 96.4577 112.308 95.5768 112.635ZM94.7099 104.245C94.9775 104.158 96.1061 103.505 96.3638 103.867C96.6239 104.232 94.4103 105.497 94.7099 104.245ZM116.002 137.713C115.344 139.281 110.081 141.552 111.062 138.39C111.496 136.988 111.905 135.928 113.544 135.822C114.489 135.761 116.581 136.331 116.002 137.713ZM125.442 116.452C126.309 115.195 129.169 113.494 130.391 115.369C130.98 116.273 129.551 116.737 128.688 116.504C128.224 116.379 127.845 116.103 127.341 116.082C126.692 116.055 126.059 116.562 125.442 116.452ZM127.739 117.701C127.15 118.296 123.597 121.277 123.021 120.817C124.181 119.164 125.513 117.316 127.739 117.701ZM121.936 147.866C120.702 147.936 121.318 146.082 121.438 145.341C121.736 145.857 123.306 147.789 121.936 147.866ZM125.071 144.544C124.672 143.836 123.596 142.782 123.84 141.871C124.026 141.174 125.704 140.237 126.407 140.637C127.341 141.168 125.988 144.662 125.071 144.544ZM154.348 137.119C153.82 138.932 153.273 138.464 151.618 138.815C149.957 139.167 148.81 140.573 147.348 141.327C147.856 140.257 148.171 138.952 149.021 138.084C149.217 137.883 150.423 137.488 149.736 137.023C149.136 136.617 148.273 137.935 148.016 138.294C146.749 140.062 145.864 142.219 145.133 144.253C144.773 145.252 144.486 146.269 144.315 147.318C144.164 148.253 144.327 149.231 144.173 150.141C143.923 151.607 141.926 151.614 140.725 151.993C139.638 152.335 138.555 152.706 137.426 152.89C136.448 153.05 135.432 152.759 134.483 152.951C133.457 153.16 132.995 153.767 131.828 153.629C130.877 153.518 129.986 153.082 129.021 153.037C128.119 152.997 127.218 153.308 126.321 153.055C125.415 152.799 125.459 152.7 125.665 151.813C125.794 152.053 125.923 152.292 126.052 152.531C126.413 152.249 126.663 151.389 126.884 150.985C127.227 150.359 127.506 150.142 127.379 149.363C127.192 148.212 126.151 147.393 125.915 146.298C125.668 145.156 126.516 144.222 127.017 143.269C127.701 141.963 127.692 140.995 127.118 139.645C127.551 139.759 127.983 139.873 128.416 139.987C127.823 138.704 125.812 139.224 124.804 139.604C124.297 139.795 123.494 140.546 122.948 140.526C122.199 140.5 121.808 139.518 121.486 138.977C120.554 137.412 119.491 135.867 118.388 134.414C118.085 134.015 117.688 133.758 117.793 133.302C117.882 132.916 118.751 132.368 119.033 132.129C120.09 131.239 121.436 130.744 122.429 129.806C123.93 128.388 125.661 127.372 127.195 125.982C128.794 124.535 130.441 123.206 132.107 121.837C133.794 120.452 135.255 118.819 136.931 117.419C137.365 118.203 138.206 121.011 139.167 121.228C140.289 121.481 140.255 120.159 140.2 119.363C140.12 118.228 139.489 117.127 139.418 116.044C139.343 114.886 140.46 114.369 141.303 113.699C142.605 112.664 145.488 110.308 143.939 108.368C142.604 106.698 138.263 109.901 137.067 110.864C136.05 111.682 135.265 112.423 134.119 113.068C133.314 113.522 131.964 115.267 131.009 115.106C129.875 114.915 129.431 113.678 128.042 113.719C126.686 113.759 125.533 114.733 124.692 115.712C122.789 117.923 122.136 120.882 120.402 123.187C119.548 124.323 118.439 125.261 117.512 126.337C116.494 127.517 116.278 128.876 115.274 130.032C112.401 126.216 109.271 122.604 106.242 118.913C104.729 117.07 103.248 115.205 101.767 113.337C101.213 112.636 100.587 111.979 100.078 111.244C99.3826 110.236 99.5077 109.427 99.2344 108.304C99.1134 107.806 98.5462 107.209 98.6985 106.733C98.9026 106.093 100.337 105.592 100.854 105.33C102.965 104.261 104.881 102.925 106.85 101.619C110.497 99.2015 114.186 96.9346 118.064 94.8697C117.997 95.7597 117.416 96.6817 117.806 97.5742C117.988 97.0602 118.276 94.7728 118.963 94.6743C118.831 94.6931 118.94 97.6078 119.046 98.0241C119.364 99.2663 120.284 100.115 121.602 100.107C124.111 100.091 126.361 97.3697 127.753 95.5667C128.697 94.3458 129.602 92.9262 129.934 91.3983C130.233 90.0271 129.905 89.0731 131.334 88.376C134.269 86.9474 137.227 85.7832 140.366 85.0254C140.225 86.3735 139.833 88.0337 141.063 89.0033C142.419 90.074 144.195 89.1199 145.473 88.4122C146.738 87.7102 148.689 85.7832 150.176 86.3431C151.638 86.8941 152.655 88.7217 153.473 89.936C154.195 91.0058 154.979 91.7768 154.144 92.9698C153.208 94.3064 152.599 95.6102 151.849 97.0619C151.56 97.6202 151.285 97.9839 151.49 98.5561C151.555 98.7417 152.307 99.846 152.511 100.004C153.813 101.015 155.571 99.0931 156.501 98.364C156.829 101.505 156.902 104.633 157.035 107.784C157.131 110.092 158.028 112.364 156.128 114.051C154.229 115.737 152.644 117.469 151.486 119.752C150.868 120.972 150.313 122.224 149.645 123.419C149.198 124.218 148.255 125.388 148.832 126.327C149.44 125.752 149.622 124.876 150.129 124.227C150.432 125.574 150.739 127.069 152.168 127.64C153.813 128.298 155.448 127.16 156.905 126.527C156.382 130.13 155.364 133.63 154.348 137.119ZM152.666 141.259C151.537 143.664 150.518 146.565 148.434 148.336C147.975 148.725 146.031 150.243 145.291 149.989C144.662 149.773 145.008 148.508 145.118 147.965C145.673 145.212 146.634 143.48 148.872 141.724C149.799 140.998 150.989 140.068 152.183 139.889C153.47 139.695 153.1 140.335 152.666 141.259ZM184.507 198.356C181.581 194.387 177.444 191.304 173.535 188.323C171.764 186.973 169.813 185.96 168.024 184.61C166.001 183.083 163.947 181.61 161.681 180.458C157.386 178.276 152.7 176.756 148.646 174.175C146.67 172.916 144.507 171.7 142.648 170.287C141.832 169.667 141.111 168.873 140.373 168.163C139.688 167.502 138.216 166.543 137.943 165.576C139.084 165.39 139.733 164.286 140.751 164.174C141.086 164.137 143.187 164.691 142.9 163.675C143.662 163.656 143.751 163.644 144.39 163.478C144.655 163.409 144.968 163.517 145.235 163.423C145.645 163.278 145.924 162.863 146.337 162.703C146.631 162.589 147.722 162.716 147.887 162.575C148.339 162.19 147.859 162.225 147.589 161.744C148.467 161.721 149.07 162.164 149.95 161.694C150.218 161.551 150.444 161.221 150.704 161.05C151.164 160.746 151.331 161.217 151.646 160.587C151.941 161.455 151.933 161.215 152.645 160.96C153.353 160.705 153.865 160.521 154.672 160.458C156.599 160.305 158.534 160.539 160.453 160.402C161.155 160.352 161.754 160.194 162.452 160.285C163.067 160.365 162.881 160.791 163.392 160.217C163.51 160.084 163.127 159.719 163.311 159.528C163.392 159.443 163.656 159.502 163.756 159.459C164.654 159.069 164.657 159.614 164.817 160.325C165.343 160.202 165.88 160.091 166.336 159.783C166.106 159.578 165.719 159.351 165.942 158.976C166.701 159.262 167.197 159.13 166.818 159.96C167.581 160.212 167.724 159.884 168.409 159.813C168.815 159.77 169.382 160.021 169.719 159.698C170.088 159.345 169.506 158.962 170.184 158.659C170.323 158.73 170.425 158.836 170.493 158.978C170.859 159.088 170.793 159.232 170.295 159.409C171.629 160.098 171.315 159.328 171.875 158.514C172.004 158.326 172.584 157.743 172.847 158.024C173.247 158.451 172.431 158.587 172.605 159.012C172.909 159.749 173.968 158.804 174.293 158.432C174.539 158.15 174.639 157.61 174.905 157.399C175.273 157.106 175.802 157.558 176.263 157.478C178.369 157.109 180.358 154.286 178.771 152.396C178.345 151.889 177.984 151.99 177.476 151.669C176.974 151.353 176.693 150.804 176.289 150.352C175.369 149.319 174.243 148.545 172.956 148.05C169.972 146.902 166.756 146.065 163.622 145.449C162.171 145.163 160.626 144.727 159.14 144.73C158.265 144.732 156.946 145.411 156.128 145.085C154.537 144.453 156.873 141.218 157.258 140.172C158.391 137.102 159.245 133.827 159.805 130.604C159.914 129.973 159.872 129.156 160.1 128.555C160.362 127.864 160.418 127.962 160.978 127.905C161.99 127.803 163.096 128.332 164.149 128.15C165.317 127.947 166.579 128.041 167.757 127.681C168.299 127.516 168.802 127.336 169.158 126.88C169.27 126.737 169.145 126.613 169.217 126.513C169.238 126.481 169.642 126.048 169.655 126.022C169.651 125.798 169.67 125.576 169.713 125.356C170.122 125.694 169.921 126.403 170.609 126.419C170.732 125.663 170.733 125.511 171.23 125.086C171.193 125.119 171.606 124.769 171.552 124.806C171.578 124.671 171.627 124.545 171.701 124.429C171.934 124.317 172.18 124.257 172.438 124.251C172.977 123.699 172.753 123.405 172.753 122.662C173.187 122.887 173.621 123.112 174.056 123.337C174.16 121.137 175.504 119.933 176.396 118.15C176.777 117.391 177.164 116.797 177.255 115.881C177.308 115.352 177.171 114.886 177.39 114.387C177.589 113.936 178.034 113.692 178.221 113.199C178.588 112.231 178.314 110.994 178.334 109.988C178.362 108.593 178.502 107.202 178.547 105.807C178.637 103.069 178.361 100.255 177.95 97.5487C177.754 96.2548 177.425 94.9986 177.167 93.7177C176.954 92.6652 176.446 91.6775 176.264 90.6988C176.19 90.2915 176.306 89.9262 176.183 89.4762C176.021 88.8843 175.75 88.303 175.548 87.7217C175.077 86.3645 174.611 85.0098 174.082 83.6731C173.056 81.0835 171.854 78.572 170.713 76.0325C169.615 73.5899 168.706 71.0717 167.284 68.7917C165.884 66.5453 164.375 64.3367 162.832 62.1872C161.224 59.9482 159.191 58.0237 157.632 55.7642C154.704 51.521 150.62 48.025 146.348 45.1374C137.532 39.1799 128.004 33.2315 117.433 31.1887C115.839 30.8808 114.225 30.6674 112.601 30.6271C111.594 30.6025 109.925 31.0886 108.971 30.7478C107.902 30.3677 108 29.1714 107.733 28.2321C107.388 27.026 106.613 26.2354 105.732 25.3831C104.804 24.4849 103.963 23.4364 102.806 22.8264C101.634 22.2079 100.252 21.9765 98.9528 21.7896C97.7937 21.6223 96.0609 21.7786 95.0022 21.2749C94.0374 20.8157 94.514 20.3379 95.4171 20.731C95.4829 20.3337 95.5365 20.0772 95.7925 19.7701C95.9201 19.6159 96.526 19.3994 96.5408 19.2554C96.5573 19.0869 96.0493 18.6068 95.9769 18.3894C95.8205 17.9212 95.9094 17.2729 96.0946 16.8336C97.0059 17.6408 97.2693 17.9982 98.2869 17.2266C98.7158 16.9008 98.8475 16.7572 99.3447 16.5929C99.4797 16.5482 99.7827 16.6861 99.9004 16.6087C100.35 16.3136 99.9358 16.3833 100.15 16.0345C100.096 16.1225 100.473 15.1955 100.455 15.3894C100.501 14.8957 100.648 15.0474 100.349 14.4408C99.7637 13.2541 98.272 13.2056 99.0319 11.8513C99.3315 11.3185 99.5941 11.3715 99.6789 10.599C99.7242 10.1836 99.6674 9.70735 99.6658 9.28484C99.6625 8.4207 99.8255 7.81575 99.0129 7.37576C98.2325 6.95259 97.5122 7.41681 97.1961 6.36735C96.8635 5.26608 97.1977 3.85422 96.0016 3.10009C95.1273 2.54917 93.8645 3.0202 92.898 2.75073C91.9299 2.48086 91.04 1.49315 90.0571 2.25154C89.359 2.79048 88.9885 4.11564 87.673 3.39903C87.0795 3.07587 86.7526 1.99078 86.3781 1.38222C85.7812 0.412323 85.3029 0.0619007 84.385 1.00659C83.8195 1.58929 82.6258 3.00756 82.5534 3.81415C82.4735 4.70449 83.2523 5.0765 82.2743 5.6032C81.3012 6.12727 80.7554 5.74295 79.9651 6.80669C79.1822 7.86198 79.7881 8.445 78.8809 9.45472C77.7465 10.7167 77.1423 11.2616 77.1579 12.962C77.1694 14.1283 76.1355 15.1358 76.7389 16.2422C77.4148 17.4822 79.3864 17.9979 80.5826 18.5026C80.1833 19.2379 79.6358 19.7093 80.1018 20.4664C80.5233 21.1519 81.717 21.2942 82.4562 21.1697C82.9534 21.0863 82.9715 21.1613 83.3634 20.8125C83.6194 20.5841 83.2679 20.2991 83.7964 20.1726C84.3579 20.0374 85.256 21.136 85.6215 21.4108C84.8057 22.4664 82.5649 22.6637 81.3794 23.1991C80.6566 23.5251 79.9931 24.0079 79.2571 24.3002C78.5895 24.5645 77.7778 24.503 77.1727 24.9127C76.1273 25.6196 75.6926 27.3717 75.0521 28.4021C74.3277 29.568 73.6246 30.1099 72.2334 30.3513C70.498 30.6534 69.101 30.7749 67.4826 31.5278C65.506 32.4482 63.5582 33.4195 61.6171 34.4121C58.4863 36.0115 55.5787 37.6536 52.6711 39.5888C49.6301 41.6135 46.6714 43.7269 43.7374 45.8419C40.8347 47.9339 38.398 50.5079 35.8764 53.0383C33.8381 55.0835 32.0501 57.2913 30.02 59.3357C27.6228 61.7504 25.8602 64.7981 23.6375 67.359C22.4216 68.7605 21.2584 70.1382 20.4953 71.7885C19.877 73.1268 18.8019 74.4396 18.084 75.8436C17.167 77.6384 16.2993 79.4045 15.2692 81.1394C14.8467 81.852 14.3444 82.4629 13.8986 83.1427C13.3273 84.013 13.361 84.8538 13.2073 85.8579C13.0469 85.6124 12.8867 85.3677 12.7261 85.1231C12.4353 85.7569 12.0835 86.3801 11.8316 87.0287C11.6708 87.4425 11.696 88.0295 11.5346 88.3916C11.3319 88.8465 11.0852 88.7857 10.8326 89.1642C10.5625 89.569 10.4757 90.1125 10.1909 90.5469C8.96046 92.4238 8.48711 94.8048 7.85487 96.9461C7.0067 99.8181 7.14055 103.12 7.18657 106.082C7.23555 109.21 7.40711 112.338 7.87882 115.434C8.30616 118.237 9.21986 120.926 10.6504 123.384C11.8967 125.526 13.6156 126.774 15.8171 127.871C16.8278 128.375 17.7663 128.219 18.8274 128.299C19.9898 128.388 20.7826 128.702 22.0125 128.426C22.6027 128.293 22.8818 127.864 23.351 127.721C23.6408 127.633 23.7972 127.778 24.0755 127.744C24.4739 127.696 25.3029 127.501 25.7351 127.548C27.0794 127.694 26.8539 129.72 26.9864 130.756C27.1897 132.349 27.3387 133.961 27.6137 135.545C28.1916 138.877 29.438 141.989 30.1748 145.263C26.76 145.678 23.831 146.314 20.6303 147.602C17.4189 148.894 14.1729 149.334 10.7937 149.976C7.63243 150.577 4.59176 151.701 2.06141 153.735C0.875391 154.688 -0.356736 155.804 0.514156 157.375C1.07123 158.379 2.075 158.634 2.94169 159.217C3.11679 158.996 2.61034 158.528 2.51764 158.399C3.2462 158.548 3.22381 158.887 3.75586 159.182C4.22082 159.44 4.60148 159.431 5.11056 159.613C6.3533 160.058 6.96389 161.169 8.19239 161.481C8.57889 161.579 9.08435 161.813 9.47959 161.88C9.95426 161.96 10.3096 161.753 10.7908 161.841C11.0506 162.01 11.3314 162.133 11.6331 162.206C11.831 162.115 12.0265 162.018 12.219 161.916C12.9103 161.988 13.3374 162.421 13.8989 162.777C13.9365 162.328 13.8824 161.862 14.3085 161.57C14.4748 162.006 14.206 162.282 14.6599 162.582C15.2351 162.963 15.9906 162.488 16.5051 162.247C16.6508 163.698 20.0194 163.612 21.0872 163.591C22.5657 163.563 24.0425 162.978 25.5334 163.304C26.2949 163.47 27.1066 163.644 27.8648 163.86C28.7761 164.121 29.8792 164.352 30.7774 164.681C31.1338 164.81 31.5718 165.228 31.9513 165.2C32.2542 165.177 32.3349 164.732 32.6872 164.745C33.0857 164.76 33.2199 165.203 33.5648 165.336C34.081 165.534 34.5551 165.156 35.0458 165.347C35.222 165.416 35.4615 165.711 35.6871 165.807C36.0295 165.952 36.7079 165.954 37.089 166.025C37.6291 166.125 38.1131 166.057 38.5766 166.09C38.9504 166.117 38.9421 166.368 39.1208 166.383C39.3257 166.402 39.6822 165.699 39.958 165.597C40.3589 165.447 41.0866 165.804 41.4958 165.867C38.533 169.871 34.9602 173.41 31.0877 176.508C26.9107 179.852 22.6332 183.19 18.154 186.122C14.0873 188.784 10.1504 191.087 6.99723 194.845C4.33854 198.013 0.10625 201.404 0.758656 205.997C1.41065 210.586 6.40879 212.454 10.4137 213.33C15.4507 214.432 20.636 213.988 25.6865 214.608C27.8401 214.873 30.2332 214.731 32.4016 214.506C34.9626 214.24 37.1574 212.574 39.3587 211.369C43.3184 209.202 46.7043 206.302 50.6048 204.068C55.489 201.269 60.3213 198.304 65.6756 196.429C68.1658 195.557 70.7302 194.562 72.7397 192.769C73.0385 192.502 73.2616 192.099 73.5991 191.879C74.1737 191.506 74.3277 191.885 74.6611 191.772C74.9171 191.685 75.1657 191.408 75.3872 191.325C75.9494 191.116 76.1997 191.202 76.8286 191.202C76.2894 190.891 75.7947 190.092 76.3553 189.44C77.3143 188.323 77.4798 190.107 77.8404 190.521C78.1458 190.13 78.0289 189.781 77.9507 189.336C78.2092 189.506 78.4669 189.676 78.7253 189.846C78.5475 188.985 78.7171 188.193 79.174 187.442C79.5963 186.751 79.7001 186.848 79.8169 185.89C81.1267 187.083 81.3827 184.188 81.5013 183.133C81.6149 182.11 81.5021 181.375 82.1771 180.48C82.9024 179.518 84.0039 178.912 84.9243 178.165C86.3773 176.985 87.976 175.496 89.9854 176.628C91.5718 177.521 92.4354 179.71 93.9238 180.835C94.8268 181.517 95.7793 181.586 96.3548 182.644C96.8199 183.5 96.9713 184.523 97.4109 185.402C98.4746 187.531 100.007 189.968 101.754 191.601C103.381 193.121 105.47 193.113 107.373 194.056C109.258 194.989 111.216 196.001 113.21 196.677C115.389 197.416 117.739 197.731 119.86 198.626C120.951 199.086 121.927 199.779 123.027 200.22C124.214 200.696 125.465 201.031 126.668 201.467C131.434 203.192 136.098 205.309 141.105 206.266C143.326 206.69 145.381 207.843 147.618 208.085C148.578 208.189 149.361 208.321 150.299 208.56C151.773 208.936 151.461 209.135 152.003 210.36C152.896 212.376 155.076 211.182 156.757 211.232C159.446 211.313 162.095 210.88 164.781 210.859C169.478 210.823 174.001 210.295 178.544 208.758C183.106 207.215 188.298 203.494 184.507 198.356Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M130.216 40.8516C130.28 40.9156 130.432 40.955 130.216 40.8516V40.8516Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M47.4831 126.711C48.5039 125.681 52.8439 125.889 53.1716 127.732C53.5379 129.791 49.6597 132.899 48.2405 133.77C46.4137 134.892 44.1844 135.102 44.5079 132.286C44.7533 130.159 46.0309 128.179 47.4831 126.711ZM51.0674 124.589C51.1999 125.159 50.2244 124.965 49.9561 124.831C49.8293 124.571 50.9357 124.017 51.0674 124.589ZM43.5826 128.364C44.4487 128.441 45.4407 127.057 46.0935 126.585C46.3824 127.03 44.4791 129.475 44.2692 130.033C43.7465 131.427 43.455 133.188 44.1688 134.579C46.2524 138.642 51.586 132.839 52.9197 130.813C53.8532 129.395 54.4986 127.637 53.1806 126.248C52.7114 125.753 51.9359 125.616 51.4996 125.145C50.9258 124.527 51.3778 123.729 50.2236 123.864C49.4275 123.956 48.4718 124.673 47.6979 124.932C46.7652 125.245 45.9264 125.568 45.1122 126.146C44.9286 126.277 42.5133 128.268 43.5826 128.364Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M104.768 129.728C104.224 132.519 101.449 135.383 98.5294 135.495C95.6218 135.605 94.68 132.567 95.1937 130.147C95.6317 128.082 97.4214 124.496 99.9742 124.891C101.982 125.201 105.234 127.334 104.768 129.728ZM102.916 125.062C101.072 123.639 98.5253 122.981 96.3891 124.109C95.6885 124.479 92.892 126.111 93.7424 127.216C94.89 126.329 95.8811 125.099 97.372 124.805C97.1209 125.956 95.6893 126.993 95.1847 128.116C94.5944 129.426 94.2717 130.927 94.3689 132.368C94.5409 134.932 96.2631 136.925 98.9304 136.572C101.372 136.249 103.506 134.384 104.672 132.286C106.227 129.484 105.35 126.938 102.916 125.062Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M85.796 136.072C84.483 138.011 82.4817 139.834 80.1676 140.431C77.1719 141.206 78.0132 138.738 78.9089 136.967C79.7 135.401 81.0583 132.706 83.1263 132.721C83.8277 132.725 85.135 133.064 85.7499 133.438C86.9625 134.176 86.4867 135.054 85.796 136.072ZM82.9995 131.815C83.4704 131.292 85.5564 129.048 85.8363 130.796C86.4348 130.104 85.9623 129.53 85.1959 129.456C84.2706 129.369 83.2596 130.395 82.592 130.906C81.218 131.955 80.1602 133.03 79.2497 134.502C78.2462 136.125 75.686 139.792 77.926 141.402C80.3479 143.142 83.8721 139.928 85.3877 138.27C86.3575 137.21 87.6417 135.654 87.2729 134.099C86.8201 132.189 84.5925 131.989 82.9995 131.815Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M72.669 100.586C71.314 102.128 68.562 104.373 66.294 104.109C64.2252 103.867 65.0328 101.553 65.7655 100.433C66.8645 98.749 68.3381 97.1685 70.4669 97.0765C71.3856 97.0371 72.576 97.0552 73.2881 97.7489C74.2595 98.6964 73.3844 99.772 72.669 100.586ZM72.525 96.3047C70.9378 95.7579 70.3146 95.5494 68.7719 96.4188C67.5329 97.1167 66.4347 98.1028 65.5844 99.2227C64.3125 100.9 63.0291 104.671 66.2956 105.143C69.8791 105.661 78.402 98.3302 72.525 96.3047Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M77.4083 105.928C76.3777 106.977 75.091 107.833 73.6223 108.126C74.2439 106.744 75.631 103.724 77.2758 103.303C78.0332 103.109 78.8976 103.364 78.835 104.224C78.7905 104.846 77.815 105.513 77.4083 105.928ZM78.7354 102.274C77.8817 101.847 78.1509 101.556 77.1581 101.891C76.3752 102.154 75.3881 102.612 74.737 103.138C74.3813 103.426 73.2749 104.445 73.4099 104.964C73.6553 105.906 74.4809 104.461 74.6983 104.184C75.0696 104.486 73.1679 107.2 73.0551 107.646C72.6336 109.309 73.9426 109.485 75.2251 108.941C76.9556 108.207 82.0793 103.944 78.7354 102.274Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M84.9869 122.731C85.3672 121.952 85.8035 121.694 86.5757 121.354C86.0604 121.838 85.5343 122.286 84.9869 122.731ZM85.5442 120.813C84.9968 121.359 83.743 122.194 83.9192 123.134C84.0797 123.992 84.7366 123.942 85.3326 123.675C86.5823 123.115 87.2788 120.662 88.586 120.432C87.1355 119.516 86.7972 119.558 85.5442 120.813Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M85.7363 72.0978C85.8063 74.7104 85.8672 77.3221 85.9249 79.9347C85.9454 80.8526 85.7256 82.1613 86.0022 83.0407C86.1241 83.4282 87.2272 85.1072 87.6191 85.2156C88.9889 85.5958 88.4991 82.172 88.509 81.3288C88.5427 78.4847 88.4999 75.6365 88.4884 72.7924C88.4826 71.326 88.8975 59.035 86.9901 59.0949C86.6608 59.1056 85.8516 60.5112 85.7298 60.7929C85.3461 61.6771 85.4877 62.9892 85.4968 63.9317C85.5223 66.6527 85.6639 69.3777 85.7363 72.0978Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M97.2873 79.7129C97.3951 80.4346 97.3383 81.6391 98.1541 82.0135C98.8638 82.3395 99.1354 81.9519 99.4005 81.3468C100.011 79.9543 99.7907 77.8262 99.7792 76.3869C99.757 73.5338 99.4351 70.693 99.212 67.8513C99.114 66.6042 99.3174 65.3513 99.161 64.0466C99.0926 63.4744 99.0243 61.1705 97.9599 61.2781C96.9967 61.3741 97.084 63.7888 97.0313 64.4112C96.595 69.5895 96.5192 74.5437 97.2873 79.7129Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M142.726 139.176C142.318 141.256 135.661 148.498 133.984 144.448C132.99 142.045 135.146 139.429 136.827 138.038C137.867 137.177 139.166 136.332 140.585 136.593C141.788 136.814 142.984 137.856 142.726 139.176ZM139.288 135.446C138.818 135.557 134.888 138.309 134.852 138.272C134.511 137.931 136.99 134.247 137.244 133.925C139.346 131.271 140.74 133.28 142.055 135.367C141.775 134.12 141.005 132.312 139.719 131.785C138.094 131.119 136.827 132.762 136.045 133.942C134.941 135.611 134.331 137.423 133.717 139.306C133.425 140.204 133.091 141.019 132.596 141.828C132.106 142.628 131.25 143.509 131.377 144.52C132.073 144.135 132.442 143.379 132.88 142.758C133.368 142.956 133.201 144.51 133.3 144.906C133.549 145.899 134.231 146.677 135.285 146.848C137.248 147.167 139.368 145.356 140.681 144.125C142.065 142.829 143.554 141.052 143.542 139.056C143.529 136.972 141.473 134.931 139.288 135.446Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M144.612 102.03C143.498 103.73 141.543 105.768 139.475 106.163C137.957 106.452 136.955 105.33 137.565 103.816C138.08 102.535 139.835 101.727 140.986 101.164C141.899 100.718 146.154 99.6772 144.612 102.03ZM143.792 99.2487C141.51 99.1633 139.67 100.808 137.968 102.121C138.352 100.612 139.221 98.972 140.446 97.99C142.111 96.6542 143.691 97.4834 145.445 98.1517C145.012 96.7904 143.07 96.3011 141.832 96.4932C140.268 96.7363 139.143 98.068 138.352 99.3562C137.408 100.893 137.086 102.704 135.975 104.145C135.466 104.805 132.317 107.274 133.03 108.283C134.207 107.038 135.383 105.793 136.559 104.548C136.864 106.02 137.2 107.695 139.084 107.552C140.589 107.438 142.305 106.162 143.405 105.187C144.826 103.929 147.623 99.3932 143.792 99.2487Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M111.822 113.765C110.855 114.209 108.727 114.81 108.187 113.479C107.435 111.63 109.852 108.386 111.003 107.153C111.71 106.395 112.19 106.003 113.176 106.493C113.964 106.886 115.12 107.999 115.422 108.855C116.071 110.692 113.335 113.071 111.822 113.765ZM114.04 104.882C114.828 105.06 114.924 106.056 113.94 105.674C113.202 105.386 113.031 104.656 114.04 104.882ZM115.029 106.286C114.735 105.392 115.333 103.99 113.885 103.925C113.065 103.889 111.562 104.721 110.845 105.058C109.852 105.527 108.918 106.242 108.4 107.249C107.92 108.182 108.263 108.428 108.995 107.653C109.084 107.714 107.339 112.201 107.324 112.651C107.256 114.706 108.715 116.059 110.764 115.695C112.647 115.36 114.344 113.824 115.38 112.275C115.904 111.491 116.335 110.593 116.374 109.632C116.434 108.158 115.449 107.566 115.029 106.286Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M126.756 102.191C125.107 101.44 123.266 104.007 124.061 105.533C125.103 107.533 130.188 103.755 126.756 102.191ZM124.79 105.061C124.447 104.453 126.776 103.557 127.144 103.542C126.96 103.877 125.26 105.895 124.79 105.061Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.5668 100.722C14.4747 100.072 13.0139 101.016 13.0225 101.434C13.264 100.952 14.7585 102.076 14.5668 100.722Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M94.4579 51.6216C96.3176 51.4853 93.9483 42.1312 92.5925 42.958C91.1238 43.8546 92.7513 51.7464 94.4579 51.6216Z"
                      fill="black"
                    />
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M97.9321 47.2544C99.6741 47.5032 99.3975 43.5145 98.4606 42.8002C96.7302 41.4824 95.8164 46.9522 97.9321 47.2544Z"
                      fill="black"
                    />
                  </Svg>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 30,
                      fontFamily: 'Manrope-ExtraBold',
                      paddingBottom: 10,
                      paddingTop: 20,
                    }}>
                    All Set!
                  </Text>
                  <Text
                    style={{
                      color: '#B1B1B1',
                      fontSize: 12,
                      fontWeight: 400,
                      fontFamily: 'Manrope-Regular',
                      textAlign: 'center',
                      paddingBottom: 10,
                    }}>
                    One more question. Your answer will help us tailor how your
                    dashboard will look like.
                  </Text>
                </View>
                <View style={[styles.row]}>
                  <CheckBox
                    value={isChecked1}
                    onValueChange={setIsChecked1}
                    tintColors={{true: '#FF6DFB', false: 'grey'}}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      fontFamily: 'Manrope-Bold',
                    }}>
                    I came to Advertise
                  </Text>
                </View>
                <View style={[styles.row2]}>
                  <CheckBox
                    value={isChecked2}
                    onValueChange={setIsChecked2}
                    tintColors={{true: '#FF6DFB', false: 'grey'}}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      fontFamily: 'Manrope-Bold',
                    }}>
                    I came to Earn
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingBottom: 30,
                    paddingTop: 20,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#CB29BE',
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      borderRadius: 110,
                    }}
                    onPress={() =>
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Tabs',
                            params: {screen: 'Home'},
                          },
                        ],
                      })
                    }>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'Manrope-Regular',
                          fontSize: 14,
                        }}>
                        Confirm
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    padding: 20,
    backgroundColor: '#000000',
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
    paddingHorizontal: 20,
    fontFamily: 'Manrope-Regular',
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
    fontFamily: 'Manrope-Regular',
  },
  textInput: {
    padding: 12,
    borderRadius: 5,
    color: 'white',
    fontFamily: 'Manrope-Light',
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
    fontFamily: 'Manrope-Medium',
    fontSize: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 10,
    height: 50,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    marginTop: 5,
    padding: 10,
    height: 50,
  },
});

export default ContinueSignUp;
