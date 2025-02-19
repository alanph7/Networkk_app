import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SellerLogin from './src/screens/SellerLogin';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import UserDetailsForm from './src/User/UserDetails'; // Add this import
import SellerDetailsForm from './src/Seller/SellerDetails'; // Add this import

const Stack = createStackNavigator();

export default function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [isLoading, setIsLoading] = useState(true); // Add a loading state

   useEffect(() => {
      const checkAuth = async () => {
         try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
               console.log('Token found:', token);
               setIsAuthenticated(true);
            } else {
               console.log('No token found');
               setIsAuthenticated(false);
            }
         } catch (error) {
            console.error('Error fetching token:', error);
            setIsAuthenticated(false); // Fallback to unauthenticated state
         } finally {
            setIsLoading(false); // Stop loading regardless of the result
         }
      };
      checkAuth();
   }, []);

   if (isLoading) {
      return (
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
         </View>
      );
   }

   return (
      <NavigationContainer>
         <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
               name="Home" 
               component={HomeScreen}
               options={{ headerShown: true }}
            />
            <Stack.Screen 
               name="Login" 
               component={LoginScreen}
               options={{ headerShown: true }}
            />
            {/* Add the UserDetails screen */}
            <Stack.Screen 
               name="UserDetails" 
               component={UserDetailsForm}
               options={{ 
                  headerShown: true,
                  title: 'Profile'
               }}
            />
            <Stack.Screen 
               name="SellerLogin" 
               component={SellerLogin}
               options={{ 
                  headerShown: true,
                  title: 'Service Provider Login'
               }}
            />
            <Stack.Screen 
               name="SellerDetails" 
               component={SellerDetailsForm}
               options={{ 
                  headerShown: true,
                  title: 'Service Provider Profile'
               }}
            />
         </Stack.Navigator>
      </NavigationContainer>
   );
}

const styles = StyleSheet.create({
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
   },
});
