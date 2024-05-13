/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Image, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '../Components/Contexts/colorTheme';

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
import Transactions from '../Screens/Transactions';
import Advertise1FB from '../Screens/Advertise/advertise1FB';
import Advertise1TK from '../Screens/Advertise/advertise1TK';
import Advertise1YT from '../Screens/Advertise/advertise1YT';
import Advertise1X from '../Screens/Advertise/advertise1X';
import Advertise1WA from '../Screens/Advertise/advertise1WA';
import Advertise1AM from '../Screens/Advertise/advertise1AM';
import Advertise1AP from '../Screens/Advertise/advertise1AP';
import Advertise1LS from '../Screens/Advertise/advertise1LS';
import Advertise1FS from '../Screens/Advertise/advertise1FS';
import Advertise1GP from '../Screens/Advertise/advertise1GP';
import Advertise1SP from '../Screens/Advertise/advertise1SP';
import ComingSoon from '../Screens/ComingSoon/comingSoon';

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
      <MoreStack.Screen name="Transact" component={Transactions} />
      <MoreStack.Screen name="ComingSoon" component={ComingSoon} />
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
      <AdvertiseStack.Screen name="Advertise1FB" component={Advertise1FB} />
      <AdvertiseStack.Screen name="Advertise1TK" component={Advertise1TK} />
      <AdvertiseStack.Screen name="Advertise1YT" component={Advertise1YT} />
      <AdvertiseStack.Screen name="Advertise1X" component={Advertise1X} />
      <AdvertiseStack.Screen name="Advertise1WA" component={Advertise1WA} />
      <AdvertiseStack.Screen name="Advertise1AM" component={Advertise1AM} />
      <AdvertiseStack.Screen name="Advertise1AP" component={Advertise1AP} />
      <AdvertiseStack.Screen name="Advertise1LS" component={Advertise1LS} />
      <AdvertiseStack.Screen name="Advertise1FS" component={Advertise1FS} />
      <AdvertiseStack.Screen name="Advertise1GP" component={Advertise1GP} />
      <AdvertiseStack.Screen name="Advertise1SP" component={Advertise1SP} />
    </AdvertiseStack.Navigator>
  );
}

const TabNavigation = () => {
  const {theme} = useTheme();
  const tabBarStyle = {
    backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF', // Dark or light background
    height: 75,
  };

  const iconTintColor = focused =>
    focused ? '#FF6DFB' : theme === 'dark' ? '#B1B1B1' : '#000000';
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: tabBarStyle,
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
                  tintColor: iconTintColor(focused),
                }}
              />
              <Text
                style={{
                  color: iconTintColor(focused),
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
                  tintColor: iconTintColor(focused),
                }}
              />
              <Text
                style={{
                  color: iconTintColor(focused),
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
                  tintColor: iconTintColor(focused),
                }}
              />
              <Text
                style={{
                  fontFamily: 'CamptonLight',
                  color: iconTintColor(focused),
                }}>
                Advertise
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Resell"
        component={ComingSoon}
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
                  tintColor: iconTintColor(focused),
                }}
              />
              <Text
                style={{
                  color: iconTintColor(focused),
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
                  tintColor: iconTintColor(focused),
                }}
              />
              <Text
                style={{
                  color: iconTintColor(focused),
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
