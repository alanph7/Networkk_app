import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../utils/axios';

export const loginUser = async (email, password) => {
    try {
       const response = await axiosInstance.post('/users/signin', { email, password });
       const { token } = response.data;
       await AsyncStorage.setItem('authToken', token); // Save token
       return response.data;
    } catch (error) {
       console.error('Login Error:', error.message);
       throw error;
    }
 };
 
 export const logoutUser = async () => {
    try {
       await AsyncStorage.removeItem('authToken'); // Remove token
    } catch (error) {
       console.error('Logout Error:', error.message);
       throw error;
    }
 };

export const signupUser = async (email, password) => {
    try {
        const response = await axiosInstance.post('/users/signup', { email, password });
        const { token } = response.data;
        await AsyncStorage.setItem('authToken', token); // Save token
        return response.data;
    } catch (error) {
        console.error('Signup Error:', error.message);
        throw error;
    }
};

export const loginServiceProvider = async (email, password) => {
    try {
        const response = await axiosInstance.post('/serviceProviders/signin', { email, password });
        const { token } = response.data;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userType', 'seller');
        await AsyncStorage.setItem('userEmail', email);
        return response.data;
    } catch (error) {
        console.error('Service Provider Login Error:', error.message);
        throw error;
    }
};

export const signupServiceProvider = async (email, password) => {
    try {
        const response = await axiosInstance.post('/serviceProviders/signup', { email, password });
        const { token } = response.data;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userType', 'seller');
        await AsyncStorage.setItem('userEmail', email);
        return response.data;
    } catch (error) {
        console.error('Service Provider Signup Error:', error.message);
        throw error;
    }
};