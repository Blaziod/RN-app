/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '../Components/Contexts/colorTheme';
import {Svg, Path, G, Rect, ClipPath, Defs} from 'react-native-svg';

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
import Earn1WA from '../Screens/Earn/earn1WA';
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
import Earn1X from '../Screens/Earn/earn1X';
import Earn2WB from '../Screens/Earn/earn2WB';
import Earn2X from '../Screens/Earn/earn2X';
import Earn1TK from '../Screens/Earn/earn1TK';
import Earn2TK from '../Screens/Earn/earn2TK';
import Earn1TR from '../Screens/Earn/earn1TR';
import History from '../Screens/Advertise/history';
import GeneralSettings from '../Screens/Settings/generalSettings';
import BankSettings from '../Screens/Settings/bankDetails';
import PreferencesSettings from '../Screens/Settings/preferences';
import SecuritySettings from '../Screens/Settings/securitySettings';
import NotificationSettings from '../Screens/Settings/notificationSettings';
import Earn1FS from '../Screens/Earn/earn1FS';
import Earn2FS from '../Screens/Earn/earn2FS';
import Earn1LS from '../Screens/Earn/earn1LS';
import Earn1CM from '../Screens/Earn/earn1CM';
import Advertise1TR from '../Screens/Advertise/advertise1TR';

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
      <MoreStack.Screen name="Account" component={GeneralSettings} />
      <MoreStack.Screen name="Security" component={SecuritySettings} />
      <MoreStack.Screen name="Bank" component={BankSettings} />
      <MoreStack.Screen name="Notification" component={NotificationSettings} />
      <MoreStack.Screen name="Preference" component={PreferencesSettings} />
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
      <EarnStack.Screen name="Earn1X" component={Earn1X} />
      <EarnStack.Screen name="Earn1TK" component={Earn1TK} />
      <EarnStack.Screen name="Earn1TR" component={Earn1TR} />
      <EarnStack.Screen name="Earn1WA" component={Earn1WA} />
      <EarnStack.Screen name="Earn1FS" component={Earn1FS} />
      <EarnStack.Screen name="Earn1LS" component={Earn1LS} />
      <EarnStack.Screen name="Earn1CM" component={Earn1CM} />
      <EarnStack.Screen name="Earn2WB" component={Earn2WB} />
      <EarnStack.Screen name="Earn2FS" component={Earn2FS} />
      <EarnStack.Screen name="Earn2X" component={Earn2X} />
      <EarnStack.Screen name="Earn2TK" component={Earn2TK} />
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
      <AdvertiseStack.Screen name="Advertise1TR" component={Advertise1TR} />
      <AdvertiseStack.Screen name="History" component={History} />
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
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none">
                <G clip-path="url(#clip0_7190_30179)">
                  <Path
                    d="M1.60156 10.5256L11.1008 3.49031C11.9835 2.83656 13.2196 2.83656 14.1023 3.49031L23.6016 10.5256M5.26823 7.81001V18.6724C5.26823 19.9579 6.36264 21 7.71267 21H17.4905C18.8405 21 19.9349 19.9579 19.9349 18.6724V7.81001"
                    stroke={iconTintColor(focused)}
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_7190_30179">
                    <Rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.601562)"
                    />
                  </ClipPath>
                </Defs>
              </Svg>

              <Text
                style={{
                  color: iconTintColor(focused),
                  fontFamily: 'Manrope-Light',
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
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none">
                <Path
                  d="M6.98482 20.564L7.43881 19.673L6.98482 20.564ZM5.23676 18.816L6.12776 18.362L5.23676 18.816ZM20.3648 18.816L19.4738 18.362L20.3648 18.816ZM18.6167 20.564L18.1628 19.673L18.6167 20.564ZM20.5278 10.0545L20.0738 10.9455L20.5278 10.0545ZM20.7463 10.273L19.8553 10.727L20.7463 10.273ZM5.07379 10.0545L5.52778 10.9455L5.07379 10.0545ZM4.85528 10.273L5.74628 10.727L4.85528 10.273ZM4.80078 6C4.2485 6 3.80078 6.44772 3.80078 7C3.80078 7.55228 4.2485 8 4.80078 8V6ZM20.8008 8C21.3531 8 21.8008 7.55228 21.8008 7C21.8008 6.44772 21.3531 6 20.8008 6V8ZM20.8008 12C20.2485 12 19.8008 12.4477 19.8008 13C19.8008 13.5523 20.2485 14 20.8008 14V12ZM22.8008 14C23.3531 14 23.8008 13.5523 23.8008 13C23.8008 12.4477 23.3531 12 22.8008 12V14ZM2.80078 12C2.2485 12 1.80078 12.4477 1.80078 13C1.80078 13.5523 2.2485 14 2.80078 14V12ZM4.80078 14C5.35307 14 5.80078 13.5523 5.80078 13C5.80078 12.4477 5.35307 12 4.80078 12V14ZM5.60078 11H20.0008V9H5.60078V11ZM19.8008 10.8V14.6H21.8008V10.8H19.8008ZM14.4008 20H11.2008V22H14.4008V20ZM5.80078 14.6V10.8H3.80078V14.6H5.80078ZM11.2008 20C10.0642 20 9.27186 19.9992 8.65502 19.9488C8.04985 19.8994 7.70217 19.8072 7.43881 19.673L6.53083 21.455C7.12312 21.7568 7.76331 21.8826 8.49216 21.9422C9.20933 22.0008 10.0972 22 11.2008 22V20ZM3.80078 14.6C3.80078 15.7036 3.8 16.5914 3.8586 17.3086C3.91815 18.0375 4.04396 18.6777 4.34575 19.27L6.12776 18.362C5.99358 18.0986 5.9014 17.7509 5.85196 17.1458C5.80156 16.5289 5.80078 15.7366 5.80078 14.6H3.80078ZM7.43881 19.673C6.87432 19.3854 6.41538 18.9265 6.12776 18.362L4.34575 19.27C4.82512 20.2108 5.59002 20.9757 6.53083 21.455L7.43881 19.673ZM19.8008 14.6C19.8008 15.7366 19.8 16.5289 19.7496 17.1458C19.7002 17.7509 19.608 18.0986 19.4738 18.362L21.2558 19.27C21.5576 18.6777 21.6834 18.0375 21.743 17.3086C21.8016 16.5914 21.8008 15.7036 21.8008 14.6H19.8008ZM14.4008 22C15.5044 22 16.3922 22.0008 17.1094 21.9422C17.8383 21.8826 18.4784 21.7568 19.0707 21.455L18.1628 19.673C17.8994 19.8072 17.5517 19.8994 16.9465 19.9488C16.3297 19.9992 15.5374 20 14.4008 20V22ZM19.4738 18.362C19.1862 18.9265 18.7272 19.3854 18.1628 19.673L19.0707 21.455C20.0115 20.9757 20.7764 20.2108 21.2558 19.27L19.4738 18.362ZM20.0008 11C20.0731 11 20.1258 11 20.1705 11.0007C20.2152 11.0014 20.2376 11.0027 20.2477 11.0035C20.2575 11.0043 20.2413 11.0036 20.2105 10.9964C20.1764 10.9883 20.1281 10.9732 20.0738 10.9455L20.9818 9.16349C20.7638 9.05244 20.5558 9.022 20.4106 9.01013C20.2771 8.99922 20.1243 9 20.0008 9V11ZM21.8008 10.8C21.8008 10.6765 21.8016 10.5237 21.7906 10.3902C21.7788 10.245 21.7483 10.037 21.6373 9.81901L19.8553 10.727C19.8276 10.6727 19.8124 10.6243 19.8044 10.5903C19.7971 10.5595 19.7965 10.5433 19.7973 10.553C19.7981 10.5632 19.7994 10.5855 19.8001 10.6303C19.8008 10.675 19.8008 10.7277 19.8008 10.8H21.8008ZM20.0738 10.9455C19.9797 10.8976 19.9032 10.8211 19.8553 10.727L21.6373 9.81901C21.4935 9.53677 21.264 9.3073 20.9818 9.16349L20.0738 10.9455ZM5.60078 9C5.47727 9 5.32449 8.99922 5.19095 9.01013C5.04573 9.022 4.83774 9.05244 4.6198 9.16349L5.52778 10.9455C5.47345 10.9732 5.42513 10.9884 5.3911 10.9964C5.36024 11.0036 5.34404 11.0043 5.35381 11.0035C5.36398 11.0027 5.38632 11.0014 5.43106 11.0007C5.47577 11 5.52849 11 5.60078 11V9ZM5.80078 10.8C5.80078 10.7277 5.80081 10.675 5.80151 10.6303C5.80221 10.5855 5.80344 10.5632 5.80427 10.553C5.80507 10.5433 5.80441 10.5595 5.79715 10.5903C5.78913 10.6243 5.77397 10.6727 5.74628 10.727L3.96427 9.81901C3.85322 10.037 3.82278 10.245 3.81091 10.3902C3.8 10.5237 3.80078 10.6765 3.80078 10.8H5.80078ZM4.6198 9.16349C4.33755 9.3073 4.10808 9.53677 3.96427 9.81901L5.74628 10.727C5.69835 10.8211 5.62186 10.8976 5.52778 10.9455L4.6198 9.16349ZM4.80078 8H20.8008V6H4.80078V8ZM9.80078 7C9.80078 5.34315 11.1439 4 12.8008 4V2C10.0394 2 7.80078 4.23858 7.80078 7H9.80078ZM12.8008 4C14.4576 4 15.8008 5.34315 15.8008 7H17.8008C17.8008 4.23858 15.5622 2 12.8008 2V4ZM20.8008 14H22.8008V12H20.8008V14ZM2.80078 14H4.80078V12H2.80078V14Z"
                  fill={iconTintColor(focused)}
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </Svg>
              <Text
                style={{
                  color: iconTintColor(focused),
                  fontFamily: 'Manrope-Light',
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
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <Path
                  d="M21 8.51821V12.0511M5.7 14.2591V18.0128C5.7 18.2178 5.7 18.3204 5.70867 18.4067C5.79284 19.2454 6.46897 19.9089 7.32357 19.9915C7.41157 20 7.51605 20 7.725 20C7.93395 20 8.03843 20 8.12643 19.9915C8.98103 19.9089 9.65716 19.2454 9.74133 18.4067C9.75 18.3204 9.75 18.2178 9.75 18.0128V14.2591M5.7 14.2591C4.86131 14.2591 4.44196 14.2591 4.11117 14.1246C3.67012 13.9454 3.31971 13.6015 3.13702 13.1687C3 12.844 3 12.4325 3 11.6095L3 10.5496C3 9.06566 3 8.32369 3.29428 7.7569C3.55314 7.25834 3.96619 6.85299 4.47422 6.59896C5.05179 6.31017 5.80786 6.31017 7.32 6.31017H9.75M5.7 14.2591H9.75M9.75 14.2591H10.425C12.0148 14.2591 13.9595 15.0954 15.4599 15.898C16.3351 16.3663 16.7728 16.6004 17.0594 16.5659C17.3252 16.534 17.5262 16.4169 17.682 16.2032C17.85 15.9727 17.85 15.5115 17.85 14.5892V5.9801C17.85 5.05776 17.85 4.5966 17.682 4.36611C17.5262 4.15239 17.3252 4.03527 17.0594 4.00332C16.7728 3.96887 16.3351 4.20299 15.4599 4.67123C13.9595 5.47386 12.0148 6.31017 10.425 6.31017H9.75M9.75 14.2591V6.31017"
                  stroke={iconTintColor(focused)}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
              <Text
                style={{
                  fontFamily: 'Manrope-Light',
                  color: iconTintColor(focused),
                }}>
                Advertise
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
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none">
                <Path
                  d="M12.0271 11.6249H12.7771M12.0271 12.3749H12.7771M12.0271 4.62494H12.7771M12.0271 5.37494H12.7771M12.0271 18.6249H12.7771M12.0271 19.3749H12.7771M5.0271 11.6249H5.7771M5.0271 12.3749H5.7771M5.0271 4.62494H5.7771M5.0271 5.37494H5.7771M5.0271 18.6249H5.7771M5.0271 19.3749H5.7771M19.0271 11.6249H19.7771M19.0271 12.3749H19.7771M19.0271 4.62494H19.7771M19.0271 5.37494H19.7771M19.0271 18.6249H19.7771M19.0271 19.3749H19.7771M13.4023 12C13.4023 12.5523 12.9546 13 12.4023 13C11.8501 13 11.4023 12.5523 11.4023 12C11.4023 11.4477 11.8501 11 12.4023 11C12.9546 11 13.4023 11.4477 13.4023 12ZM13.4023 5C13.4023 5.55228 12.9546 6 12.4023 6C11.8501 6 11.4023 5.55228 11.4023 5C11.4023 4.44772 11.8501 4 12.4023 4C12.9546 4 13.4023 4.44772 13.4023 5ZM13.4023 19C13.4023 19.5523 12.9546 20 12.4023 20C11.8501 20 11.4023 19.5523 11.4023 19C11.4023 18.4477 11.8501 18 12.4023 18C12.9546 18 13.4023 18.4477 13.4023 19ZM6.40234 12C6.40234 12.5523 5.95463 13 5.40234 13C4.85006 13 4.40234 12.5523 4.40234 12C4.40234 11.4477 4.85006 11 5.40234 11C5.95463 11 6.40234 11.4477 6.40234 12ZM6.40234 5C6.40234 5.55228 5.95463 6 5.40234 6C4.85006 6 4.40234 5.55228 4.40234 5C4.40234 4.44772 4.85006 4 5.40234 4C5.95463 4 6.40234 4.44772 6.40234 5ZM6.40234 19C6.40234 19.5523 5.95463 20 5.40234 20C4.85006 20 4.40234 19.5523 4.40234 19C4.40234 18.4477 4.85006 18 5.40234 18C5.95463 18 6.40234 18.4477 6.40234 19ZM20.4023 12C20.4023 12.5523 19.9546 13 19.4023 13C18.8501 13 18.4023 12.5523 18.4023 12C18.4023 11.4477 18.8501 11 19.4023 11C19.9546 11 20.4023 11.4477 20.4023 12ZM20.4023 5C20.4023 5.55228 19.9546 6 19.4023 6C18.8501 6 18.4023 5.55228 18.4023 5C18.4023 4.44772 18.8501 4 19.4023 4C19.9546 4 20.4023 4.44772 20.4023 5ZM20.4023 19C20.4023 19.5523 19.9546 20 19.4023 20C18.8501 20 18.4023 19.5523 18.4023 19C18.4023 18.4477 18.8501 18 19.4023 18C19.9546 18 20.4023 18.4477 20.4023 19Z"
                  stroke={iconTintColor(focused)}
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </Svg>
              <Text
                style={{
                  color: iconTintColor(focused),
                  fontFamily: 'Manrope-Light',
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
