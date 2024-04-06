/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Image, Text} from 'react-native';

//Screens
import Home from '../Screens/Home/home';
import SignIn from '../Screens/Auth/signIn';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: '#000000', height: 75},
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/NavigationIcons/home.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FF6DFB' : '#B1B1B1',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FF6DFB' : '#B1B1B1',
                  fontFamily: 'CamptonLight',
                }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="EarnPage"
        component={SignIn}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/NavigationIcons/earn.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FF6DFB' : '#B1B1B1',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FF6DFB' : '#B1B1B1',
                  fontFamily: 'CamptonLight',
                }}>
                Earn
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AdvertisePage"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/NavigationIcons/advertise.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FF6DFB' : '#B1B1B1',
                }}
              />
              <Text
                style={{
                  fontFamily: 'CamptonLight',
                  color: focused ? '#FF6DFB' : '#B1B1B1',
                }}>
                Advertise
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Resell"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/NavigationIcons/sell.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FF6DFB' : '#B1B1B1',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FF6DFB' : '#B1B1B1',
                  fontFamily: 'CamptonLight',
                }}>
                Resell
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Refer"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/NavigationIcons/more.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FF6DFB' : '#B1B1B1',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FF6DFB' : '#B1B1B1',
                  fontFamily: 'CamptonLight',
                }}>
                More
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
