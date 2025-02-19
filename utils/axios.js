import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.10.166.164:3002'; // Replace with your local IP address

// Create an Axios instance
const axiosInstance = axios.create({
   baseURL: API_BASE_URL,
   withCredentials: true,
});

// Interceptor to include Authorization header
axiosInstance.interceptors.request.use(
   async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);
;

export default axiosInstance;