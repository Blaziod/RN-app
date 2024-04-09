/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigation from './Navigation/tabNavigation';
import Toast from 'react-native-toast-message';

//Screens
import SignIn from './Screens/Auth/signIn';
import Test1 from './Screens/test1';
import Test2 from './Screens/test2';
import Test3 from './Screens/Test3';
import SignUp from './Screens/Auth/signUp';
import VerifyEmailScreen from './Screens/Auth/otp';
import OnboardingSignUp from './Screens/Auth/onBoarding';
import ContinueSignUp from './Screens/Auth/continueSignUp';
// import SplashScreen from 'react-native-splash-screen';/

const Stack = createNativeStackNavigator();
function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="SignIn">
      <Stack.Screen name="Tabs" component={TabNavigation} />
      <Stack.Screen name="Test1" component={Test1} />
      <Stack.Screen name="Test2" component={Test2} />
      <Stack.Screen name="Test3" component={Test3} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="Onboard" component={OnboardingSignUp} />
      <Stack.Screen name="Onboard2" component={ContinueSignUp} />
    </Stack.Navigator>
  );
}
const config = {
  screens: {
    Test1: 'a',
    Test2: 'b',
  },
};
const App = () => {
  return (
    <NavigationContainer
      linking={{
        prefixes: ['trendit://app'],
        config,
      }}>
      <StackNavigator />
      <Toast />
    </NavigationContainer>
  );
};
export default App;
