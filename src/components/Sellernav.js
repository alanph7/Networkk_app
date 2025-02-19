import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SellerNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuPosition] = useState(new Animated.Value(-250));
  const navigation = useNavigation();

  const toggleMenu = () => {
    Animated.timing(menuPosition, {
      toValue: isExpanded ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'authToken',
        'userEmail',
        'userType',
        'userId'
      ]);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const NavButton = ({ icon, title, route }) => (
    <TouchableOpacity
      style={styles.navButton}
      onPress={() => {
        navigation.navigate(route);
        if (isExpanded) toggleMenu();
      }}
    >
      <Icon name={icon} size={20} color="#9ca3af" />
      <Text style={styles.navText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        onPress={toggleMenu}
        style={styles.menuButton}
      >
        <Icon 
          name="menu" 
          size={24} 
          color="#0284c7"
        />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateX: menuPosition }],
          }
        ]}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={toggleMenu}
            style={styles.closeButton}
          >
            <Icon name="x" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>
              <Text style={styles.titleBold}>Service</Text>{' '}
              <Text style={styles.titleLight}>Provider</Text>
            </Text>

            <View style={styles.navContainer}>
              <NavButton icon="layout" title="Dashboard" route="SellerDashboard" />
              <NavButton icon="calendar" title="Bookings" route="SellerBookings" />
              <NavButton icon="clock" title="Availability" route="SellerAvailability" />
              <NavButton icon="user" title="Profile" route="SellerDetails" />
              <NavButton icon="settings" title="Settings" route="SellerSettings" />
              <NavButton icon="star" title="Reviews" route="SellerReviews" />
              <NavButton icon="file-text" title="Documents" route="SellerDocuments" />
              
              <TouchableOpacity
                style={[styles.navButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Icon name="log-out" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1001,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1001,
  },
  content: {
    padding: 16,
    paddingTop: 60,
    flex: 1,
  },
  title: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  titleBold: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  titleLight: {
    fontSize: 20,
    fontWeight: '300',
    color: 'white',
  },
  navContainer: {
    flex: 1,
    gap: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
  },
});

export default SellerNav;