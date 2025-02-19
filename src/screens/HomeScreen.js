import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Navbar from '../components/nav'; // Add this import

const HomeScreen = () => {
    const navigation = useNavigation();

    const ServiceItem = ({ icon, title, description }) => (
        <Animatable.View animation="fadeInUp" duration={2000} style={styles.serviceItem}>
            <Icon name={icon} size={30} color="#000000" />
            <Text style={styles.serviceTitle}>{title}</Text>
            <Text style={styles.serviceDescription}>{description}</Text>
        </Animatable.View>
    );

    return (
        <View style={styles.mainContainer}>
            <Navbar />
            <ScrollView style={styles.container}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Animatable.Text animation="fadeInDown" duration={2000} style={styles.mainTitle}>
                        Find Skilled Workers and Offer Your Services
                    </Animatable.Text>
                    <Animatable.Text animation="fadeInUp" duration={2000} style={styles.subtitle}>
                        Networkk connects you with skilled workers in your area
                    </Animatable.Text>
                    
                    <Animatable.View animation="fadeInUp" duration={2500} style={styles.buttonGroup}>
                        <TouchableOpacity 
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.primaryButtonText}>Get Started</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Learn More</Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    {/* Steps */}
                    <Animatable.View animation="fadeInUp" duration={3000} style={styles.stepsContainer}>
                        {[
                            {
                                step: "Step 1",
                                desc: "Search for skilled workers in your area"
                            },
                            {
                                step: "Step 2",
                                desc: "Signup and choose the skilled person"
                            },
                            {
                                step: "Step 3",
                                desc: "Connect with skilled workers"
                            },
                            {
                                step: "Step 4",
                                desc: "Get the job done and leave a review"
                            }
                        ].map((item, index) => (
                            <View key={index} style={styles.stepItem}>
                                <Icon name="check-circle" size={24} color="#000000" />
                                <View style={styles.stepTextContainer}>
                                    <Text style={styles.stepTitle}>{item.step}</Text>
                                    <Text style={styles.stepDescription}>{item.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </Animatable.View>
                </View>

                {/* Services Section */}
                <View style={styles.servicesSection}>
                    <Animatable.Text animation="fadeInDown" duration={2000} style={styles.sectionTitle}>
                        Our Services
                    </Animatable.Text>
                    <View style={styles.servicesGrid}>
                        <ServiceItem 
                            icon="hammer" 
                            title="Carpentry Work" 
                            description="Professional carpentry services for your needs"
                        />
                        <ServiceItem 
                            icon="lightning-bolt" 
                            title="Electrical Work" 
                            description="Expert electrical installation and repairs"
                        />
                        <ServiceItem 
                            icon="home-repair" 
                            title="Home Repairs" 
                            description="Complete home maintenance solutions"
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    heroSection: {
        padding: 20,
        paddingTop: 40,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000000',
    },
    subtitle: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#000000',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginRight: 10,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#000000',
    },
    secondaryButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepsContainer: {
        marginTop: 20,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 5,
    },
    stepTextContainer: {
        marginLeft: 15,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000000',
    },
    stepDescription: {
        color: '#444',
        fontSize: 16,
        lineHeight: 22,
    },
    servicesSection: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#000000',
    },
    servicesGrid: {
        flexDirection: 'column',
        gap: 20,
    },
    serviceItem: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#000000',
    },
    serviceDescription: {
        textAlign: 'center',
        color: '#444',
        lineHeight: 22,
    },
});

export default HomeScreen;
