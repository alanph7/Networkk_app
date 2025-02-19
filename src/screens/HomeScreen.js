import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../components/nav'; // Add this import

const HomeScreen = () => {
    const navigation = useNavigation();

    const ServiceItem = ({ icon, title, description }) => (
        <View style={styles.serviceItem}>
            <Icon name={icon} size={30} color="#000" />
            <Text style={styles.serviceTitle}>{title}</Text>
            <Text style={styles.serviceDescription}>{description}</Text>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <Navbar />
            <ScrollView style={styles.container}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.mainTitle}>Find Skilled Workers and Offer Your Services</Text>
                    <Text style={styles.subtitle}>
                        Networkk connects you with skilled workers in your area
                    </Text>
                    
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity 
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.primaryButtonText}>Get Started</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Learn More</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Steps */}
                    <View style={styles.stepsContainer}>
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
                                <Icon name="check-circle" size={24} color="#000" />
                                <View style={styles.stepTextContainer}>
                                    <Text style={styles.stepTitle}>{item.step}</Text>
                                    <Text style={styles.stepDescription}>{item.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Services Section */}
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>Our Services</Text>
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
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
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
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
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
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#000',
    },
    secondaryButtonText: {
        color: '#000',
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
    },
    stepTextContainer: {
        marginLeft: 15,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    stepDescription: {
        color: '#666',
        fontSize: 16,
    },
    servicesSection: {
        padding: 20,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    servicesGrid: {
        flexDirection: 'column',
        gap: 20,
    },
    serviceItem: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    serviceDescription: {
        textAlign: 'center',
        color: '#666',
    },
});

export default HomeScreen;
