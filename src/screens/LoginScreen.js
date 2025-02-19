import React, { useState } from 'react';
import { 
   View, 
   Text, 
   TextInput, 
   TouchableOpacity, 
   StyleSheet, 
   Alert,
   KeyboardAvoidingView,
   Platform,
   ScrollView
} from 'react-native';
import { loginUser, signupUser } from '../services/authServices';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
   const [isLogin, setIsLogin] = useState(true);
   const [formData, setFormData] = useState({
      email: '',
      password: '',
      rememberMe: false
   });

   const navigation = useNavigation();

   const handleChange = (name, value) => {
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleSubmit = async () => {
      try {
         const data = isLogin 
            ? await loginUser(formData.email, formData.password)
            : await signupUser(formData.email, formData.password);
         
         Alert.alert(
            'Success', 
            isLogin 
               ? `Welcome${data.fname ? ` ${data.fname}` : ''}!`
               : 'Account created successfully!',
            [{ 
               text: 'OK', 
               onPress: () => {
                  // For both login and signup, navigate to Home
                  navigation.navigate('Home');
               }
            }]
         );
      } catch (error) {
         Alert.alert(
            isLogin ? 'Login Failed' : 'Signup Failed',
            error.response?.data?.message || 
               (isLogin ? 'Please check your credentials.' : 'Could not create account.'),
            [{ text: 'OK' }]
         );
      }
   };

   return (
      <KeyboardAvoidingView 
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         style={styles.container}
      >
         <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>
               {isLogin ? "Sign in to your account" : "Create your account"}
            </Text>
            
            <Text style={styles.subtitle}>
               {isLogin ? "New to our platform? " : "Already have an account? "}
               <Text
                  style={styles.linkText}
                  onPress={() => setIsLogin(!isLogin)}
               >
                  {isLogin ? "Join now" : "Sign in"}
               </Text>
            </Text>

            <View style={styles.formContainer}>
               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email address</Text>
                  <TextInput
                     style={styles.input}
                     placeholder="Enter your email"
                     value={formData.email}
                     onChangeText={(text) => handleChange('email', text)}
                     keyboardType="email-address"
                     autoCapitalize="none"
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                     style={styles.input}
                     placeholder="Enter your password"
                     value={formData.password}
                     onChangeText={(text) => handleChange('password', text)}
                     secureTextEntry
                  />
               </View>

               {isLogin && (
                  <View style={styles.rememberContainer}>
                     <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => handleChange('rememberMe', !formData.rememberMe)}
                     >
                        <View style={[styles.checkbox, formData.rememberMe && styles.checkboxChecked]} />
                        <Text style={styles.checkboxLabel}>Remember me</Text>
                     </TouchableOpacity>

                     <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.linkText}>Forgot password?</Text>
                     </TouchableOpacity>
                  </View>
               )}

               <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
               >
                  <Text style={styles.submitButtonText}>
                     {isLogin ? "Sign in" : "Create Account"}
                  </Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </KeyboardAvoidingView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f9fafb'
   },
   scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 16
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#111827',
      marginBottom: 8
   },
   subtitle: {
      fontSize: 14,
      textAlign: 'center',
      color: '#6b7280',
      marginBottom: 24
   },
   formContainer: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2
   },
   inputGroup: {
      marginBottom: 16
   },
   label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
      marginBottom: 8
   },
   input: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 6,
      padding: 12,
      fontSize: 16,
      color: '#111827',
      backgroundColor: 'white'
   },
   rememberContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
   },
   checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center'
   },
   checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: '#d1d5db',
      borderRadius: 4,
      marginRight: 8
   },
   checkboxChecked: {
      backgroundColor: '#0369a1',
      borderColor: '#0369a1'
   },
   checkboxLabel: {
      fontSize: 14,
      color: '#374151'
   },
   linkText: {
      color: '#0369a1',
      fontWeight: '500'
   },
   submitButton: {
      backgroundColor: '#0369a1',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center'
   },
   submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500'
   }
});

export default LoginScreen;
