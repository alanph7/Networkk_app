import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SellerLoginSignupScreen from './src/screens/SellerLoginSignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SellerLoginSignup">
        <Stack.Screen
          name="SellerLoginSignup"
          component={SellerLoginSignupScreen}
          options={{ headerShown: false }} // Hide header for this screen
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for LoginScreen
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }} // Hide header for SignupScreen
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
