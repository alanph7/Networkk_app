import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userType, setUserType] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const email = await AsyncStorage.getItem('userEmail');
            const type = await AsyncStorage.getItem('userType');
            
            setIsAuthenticated(!!token);
            setUserEmail(email);
            setUserType(type);
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userType');
            setIsAuthenticated(false);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View style={styles.navbar}>
            <View style={styles.navContainer}>
                <TouchableOpacity 
                    style={styles.logoButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.logoText}>Networkk</Text>
                </TouchableOpacity>

                

                <View style={styles.authContainer}>
                    {!isAuthenticated ? (
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity 
                                style={styles.loginButton}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.loginButtonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.signInButton}
                                onPress={() => navigation.navigate('SellerLogin')}
                            >
                                <Text style={styles.signInText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            style={styles.userButton}
                            onPress={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <View style={styles.userAvatar}>
                                <Text style={styles.userInitial}>
                                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                                </Text>
                                <View style={[
                                    styles.userType,
                                    { backgroundColor: userType === 'seller' ? '#22c55e' : '#3b82f6' }
                                ]}>
                                    <Text style={styles.userTypeText}>
                                        {userType === 'seller' ? 'S' : 'U'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isMenuOpen && isAuthenticated && (
                <View style={styles.menuDropdown}>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => {
                            // Navigate based on user type
                            if (userType === 'seller') {
                                navigation.navigate('SellerDetails');
                            } else {
                                navigation.navigate('UserDetails');
                            }
                            setIsMenuOpen(false);
                        }}
                    >
                        <Text>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.menuItem, styles.menuItemLast]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.signOutText}>Sign out</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 50,
    },
    navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        height: 60,
    },
    logoButton: {
        marginRight: 16,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 40,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    authContainer: {
        marginLeft: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loginButton: {
        backgroundColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#4f46e5',
    },
    loginButtonText: {
        color: '#4f46e5',
        fontSize: 16,
        fontWeight: '500',
    },
    signInButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
    },
    signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    userButton: {
        padding: 4,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userType: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userTypeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    menuDropdown: {
        position: 'absolute',
        top: 60,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: 200,
        zIndex: 50,
    },
    menuItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    signOutText: {
        color: '#dc2626',
    },
});

export default Navbar;