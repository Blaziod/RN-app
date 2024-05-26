/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const InReviewTwitterMenu = () => {
  const navigation = useNavigation();
  const [fetching, setFectching] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [userAccessToken, setUserAccessToken] = useState(null);

  const fetchUserAccessToken = () => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        // eslint-disable-next-line no-shadow
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        console.log('AccessToken Loading');

        if (!userAccessToken) {
          navigation.navigate('SignIn');
          console.log('AccessToken Not found', userAccessToken);
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

  const fetchPendingTasks = async () => {
    setFectching(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          'https://api.trendit3.com/api/performed-tasks?status=in_review',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAccessToken.accessToken}`,
            },
          },
        );
        const data = await response.json();

        if (response.ok && data.performed_tasks.length > 0) {
          setPendingTasks(data.performed_tasks);
          console.log('Successful Tasks fetch:', data);
          setFectching(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: data.message,
            style: {
              borderLeftColor: 'pink',
              backgroundColor: 'yellow',
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            text1Style: {
              color: 'red',
              fontSize: 12,
            },
            text2Style: {
              color: 'green',
              fontSize: 12,
              fontFamily: 'Campton Bold',
            },
          });
        } else {
          if (response.status === 401) {
            console.log('401 Unauthorized: Access token is invalid or expired');
            await AsyncStorage.removeItem('userbalance');
            await AsyncStorage.removeItem('userdata1');
            await AsyncStorage.removeItem('userdata');
            await AsyncStorage.removeItem('userdata2');
            await AsyncStorage.removeItem('userdatas');
            await AsyncStorage.removeItem('userdatafiles1');
            await AsyncStorage.removeItem('accesstoken');
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: response.data.message,
              style: {
                borderLeftColor: 'pink',
                backgroundColor: 'yellow',
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              },
              text1Style: {
                color: 'red',
                fontSize: 12,
              },
              text2Style: {
                color: 'green',
                fontSize: 12,
                fontFamily: 'Campton Bold',
              },
            });
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignIn',
                },
              ],
            });
          }
          setFectching(false);
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error during Tasks fetch:', error);
        setFectching(false);
        Toast.show({
          type: 'success',

          text2: error.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 12,
          },
          text2Style: {
            color: 'green',
            fontSize: 12,
            fontFamily: 'Campton Bold',
          },
        });
      }
    }
  };

  useEffect(() => {
    fetchPendingTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  return (
    <>
      {fetching ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View>
          {pendingTasks.map((task, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: '100%',
                borderRadius: 10,
                backgroundColor: 'rgba(47, 47, 47, 0.42)',
                justifyContent: 'center',
                alignSelf: 'center',
                padding: 10,
                marginBottom: 10, // Add space between items
              }}
              onPress={() => navigation.navigate('Earn2X')}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#323232',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                    width: '30%',
                    borderRadius: 4,
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                  <Text
                    style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>
                    In Review
                  </Text>
                </View>
              </View>

              <Text style={{fontSize: 12, color: '#fff'}}>{task.caption}</Text>
              <Text style={{fontSize: 10, color: '#fff'}}>{task.key}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  gap: 7,
                  paddingRight: 50,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Campton Bold',
                    fontSize: 12,
                  }}>
                  ₦110 per task
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

export default InReviewTwitterMenu;
