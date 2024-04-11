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
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from "@react-navigation/native";
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

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

  useEffect(() => {
    fetch('https://api.trendit3.com/api/countries')
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
        .post('https://api.trendit3.com/api/states', {
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
    if (selectedState !== null) {
      // setIsLoading(true);
      axios
        .post('https://api.trendit3.com/api/states/lga', {
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
    const url = 'https://api.trendit3.com/api/profile/update';
    const formData = new FormData();
    formData.append('gender', gender);
    formData.append('country', selectedCountry);
    formData.append('state', selectedState);
    formData.append('local_government', selectedLga);
    formData.append('user_id', userData?.userdata?.id);
    console.log('start', userData?.userdata?.id);

    setIsLoading(true);
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
              fontFamily: 'CamptonBold',
            },
          });
          navigation.navigate('Tabs', {screen: 'Home'});
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
              fontFamily: 'CamptonBold',
            },
          });
        });
    } catch (error) {
      console.error('Error Main :', error);
    } finally {
      setIsLoading(false);
    }
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
                    {/* </TouchableOpacity> */}
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
                  fontFamily: 'CamptonBook',
                  fontSize: 13,
                }}
                onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
                I will do this later
              </Text>
              <Text
                style={{
                  color: '#FF6DFB',
                  fontFamily: 'CamptonBook',
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
    fontFamily: 'CamptonBold',
    position: 'absolute',
    top: 50,
    right: 10,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'CamptonBold',
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

export default ContinueSignUp;
