import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const WelcomePage = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Logo and Title Section */}
      <View style={styles.logoContainer}>
        <Animatable.Text
          animation="fadeInDown"
          duration={2000}
          style={styles.logoText}
        >
          Networkk
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInUp"
          duration={2000}
          style={styles.subtitle}
        >
          Connecting Skilled Workers with Opportunities
        </Animatable.Text>
      </View>

      {/* Dummy Content - Informative Text */}
      <Animatable.View animation="fadeInUp" duration={2500} style={styles.content}>
        <Text style={styles.sectionTitle}>Blue Collar Jobs</Text>
        <Text style={styles.sectionText}>
          Networkk is the platform for skilled professionals in various blue-collar jobs, 
          including plumbing, carpentry, electrical work, and more.
        </Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={3000} style={styles.content}>
        <Text style={styles.sectionTitle}>Why Networkk?</Text>
        <Text style={styles.sectionText}>
          Our platform brings job opportunities directly to skilled workers and ensures a seamless 
          connection with clients who need quality service.
        </Text>
      </Animatable.View>

      {/* Bottom Section */}
      <Animatable.View animation="fadeInUp" duration={3500} style={styles.content}>
        <Text style={styles.sectionTitle}>Join Us!</Text>
        <Text style={styles.sectionText}>
          Become a part of Networkk and take advantage of countless opportunities, growing your career 
          and enhancing your skills in the marketplace for skilled trades.
        </Text>
      </Animatable.View>

      {/* Join Us Button at Bottom */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.joinButton} onPress={() => navigation.navigate('SellerLoginSignup')}>
          <Text style={styles.joinButtonText}>Join Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#3E8E41',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    marginVertical: 30,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  footerContainer: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#3E8E41',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default WelcomePage;
