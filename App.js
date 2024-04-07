/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigation from './Navigation/tabNavigation';

//Screens
import SignIn from './Screens/Auth/signIn';
import Test1 from './Screens/test1';
import Test2 from './Screens/test2';
import Test3 from './Screens/Test3';
// import Home from './Screens/Home/home';

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
    </NavigationContainer>
  );
};
export default App;
