/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigation from './Navigation/tabNavigation';
import Toast from 'react-native-toast-message';
import {ThemeProvider} from './Components/Contexts/colorTheme';

//Screens
import SignIn from './Screens/Auth/signIn';
import Test1 from './Screens/test1';
import Test2 from './Screens/test2';
import Test3 from './Screens/Test3';
import SignUp from './Screens/Auth/signUp';
import VerifyEmailScreen from './Screens/Auth/otp';
import OnboardingSignUp from './Screens/Auth/onBoarding';
import ContinueSignUp from './Screens/Auth/continueSignUp';
import ResetPassword from './Screens/Auth/resetPassword';
import ResetOtp from './Screens/Auth/reset-otp';
import SplashScreen from './Screens/Splash/splashScreen';

const Stack = createNativeStackNavigator();
function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen name="Tabs" component={TabNavigation} />
      <Stack.Screen name="Test1" component={Test1} />
      <Stack.Screen name="Test2" component={Test2} />
      <Stack.Screen name="Test3" component={Test3} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="Onboard" component={OnboardingSignUp} />
      <Stack.Screen name="Onboard2" component={ContinueSignUp} />
      <Stack.Screen name="Reset" component={ResetPassword} />
      <Stack.Screen name="ResetOtp" component={ResetOtp} />
    </Stack.Navigator>
  );
}
const config = {
  screens: {
    Test1: 'a',
    Test2: 'b',
    SignIn: 'home',
  },
};
const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer
        linking={{
          prefixes: ['trendit://app', 'https://blaziod.github.io'],
          config,
        }}>
        <StackNavigator />
        <Toast />
      </NavigationContainer>
    </ThemeProvider>
  );
};
export default App;
