/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Image, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

//Screens
import Home from '../Screens/Home/home';
// import SignIn from '../Screens/Auth/signIn';
import Earn from '../Screens/Earn/earn';
import More from '../Screens/More/more';
import Refer from '../Screens/More/refer';
import Advertise from '../Screens/Advertise/advertise';
import Settings from '../Screens/Settings';
import Earn1IG from '../Screens/Earn/earn1';
import Earn2IG from '../Screens/Earn/earn2';
import Earn3IG from '../Screens/Earn/earn3';
import Earn1FB from '../Screens/Earn/earn1FB';
import Earn2FB from '../Screens/Earn/earn2FB';
import Earn3FB from '../Screens/Earn/earn3FB';
import Advertise1 from '../Screens/Advertise/advertise1';

const Tab = createBottomTabNavigator();
const MoreStack = createStackNavigator();
const EarnStack = createStackNavigator();
const AdvertiseStack = createStackNavigator();

function MoreStackScreen() {
  return (
    <MoreStack.Navigator screenOptions={{headerShown: false}}>
      <MoreStack.Screen name="MorePage" component={More} />
      <MoreStack.Screen name="Refer" component={Refer} />
      <MoreStack.Screen name="Settings" component={Settings} />
    </MoreStack.Navigator>
  );
}

function EarnStackScreen() {
  return (
    <EarnStack.Navigator screenOptions={{headerShown: false}}>
      <EarnStack.Screen name="Earn" component={Earn} />
      <EarnStack.Screen name="Earn1IG" component={Earn1IG} />
      <EarnStack.Screen name="Earn2IG" component={Earn2IG} />
      <EarnStack.Screen name="Earn3IG" component={Earn3IG} />
      <EarnStack.Screen name="Earn1FB" component={Earn1FB} />
      <EarnStack.Screen name="Earn2FB" component={Earn2FB} />
      <EarnStack.Screen name="Earn3FB" component={Earn3FB} />
    </EarnStack.Navigator>
  );
}

function AdvertiseStackScreen() {
  return (
    <AdvertiseStack.Navigator screenOptions={{headerShown: false}}>
      <AdvertiseStack.Screen name="Advertise" component={Advertise} />
      <AdvertiseStack.Screen name="Advertise1" component={Advertise1} />
    </AdvertiseStack.Navigator>
  );
}

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
        component={EarnStackScreen}
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
        component={AdvertiseStackScreen}
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
        name="More"
        component={MoreStackScreen}
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
