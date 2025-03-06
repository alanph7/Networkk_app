import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { 
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign
} from '@expo/vector-icons';
import axiosInstance from '../../utils/axios';

const { width } = Dimensions.get('window');

export default function ServiceDetails() {
  const route = useRoute();
  const { serviceId } = route.params;
  const navigation = useNavigation();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/services/${serviceId}`);
        setService(response.data);
        setImages(JSON.parse(response.data.demoPics || '[]'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    // Cleanup on unmount
    return () => clearInterval(autoSlide);
  }, [images.length]);

  const handleBookNow = () => {
    navigation.navigate('UserBooking', {
      basePrice: service.basePrice,
      serviceId: service.serviceId,
      serviceTitle: service.title,
      serviceProviderId: service.serviceProvider.serviceProviderId,
    });
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <FontAwesome
            key={i}
            name="star"
            size={16}
            color={i < rating ? '#FFD700' : '#E0E0E0'}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0369a1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Service not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{service.title}</Text>
        
        {/* Provider brief info */}
        <View style={styles.providerBrief}>
          <View style={styles.profilePicContainer}>
            {service.serviceProvider.profilePicture ? (
              <Image
                source={{ uri: service.serviceProvider.profilePicture }}
                style={styles.profilePic}
              />
            ) : (
              <View style={styles.profilePicPlaceholder}>
                <Text style={styles.profilePicPlaceholderText}>
                  {service.serviceProvider.fname?.[0] || 'U'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>
              {service.serviceProvider.fname} {service.serviceProvider.lname}
            </Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" style={{ marginRight: 4 }} />
              <Text style={styles.ratingText}>{service.avgRating || 0}</Text>
              <Text style={styles.reviewCountText}>({service.reviewCount || 0})</Text>
            </View>
          </View>
        </View>

        {/* Image slider */}
        <View style={styles.imageSlider}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={[
                styles.slideImage,
                { opacity: currentImageIndex === index ? 1 : 0 }
              ]}
              onError={(e) => {
                // Handle image loading error
                // In React Native, we would need to implement error handling differently
              }}
            />
          ))}

          {/* Navigation buttons */}
          <View style={styles.sliderNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentImageIndex(prev => 
                prev === 0 ? images.length - 1 : prev - 1
              )}
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentImageIndex(prev => 
                prev === images.length - 1 ? 0 : prev + 1
              )}
            >
              <AntDesign name="right" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Indicators */}
          <View style={styles.indicators}>
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* About Service */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About This Service</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>
        </View>

        {/* About Provider */}
        <View style={styles.providerContainer}>
          <Text style={styles.sectionTitle}>About The Provider</Text>
          <View style={styles.providerProfileContainer}>
            <View style={styles.providerProfilePicContainer}>
              {service.serviceProvider.profilePicture ? (
                <Image
                  source={{ uri: service.serviceProvider.profilePicture }}
                  style={styles.providerProfilePic}
                />
              ) : (
                <View style={styles.providerProfilePicPlaceholder}>
                  <Text style={styles.providerProfilePicPlaceholderText}>
                    {service.serviceProvider.fname?.[0] || 'U'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.providerDetailInfo}>
              <Text style={styles.providerFullName}>
                {service.serviceProvider.fname} {service.serviceProvider.lname}
              </Text>
              <Text style={styles.providerEmail}>{service.serviceProvider.email}</Text>
              <Text style={styles.providerLocality}>{service.serviceProvider.locality}</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Me</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {service.Reviews?.map((review) => (
            <View key={review.reviewId} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerPicPlaceholder}>
                  <Text style={styles.reviewerPicPlaceholderText}>
                    {review.user?.fname?.[0]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.reviewerName}>{review.user?.fname}</Text>
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Booking Section - Fixed at bottom */}
      <View style={styles.bookingContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>Rs {service.basePrice}</Text>
          <Text style={styles.priceDescription}>
            {service.description.substring(0, 50)}...
          </Text>
        </View>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <MaterialIcons name="check" size={18} color="#0369a1" />
            <Text style={styles.featureText}>Available</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="check" size={18} color="#0369a1" />
            <Text style={styles.featureText}>{service.category}</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="check" size={18} color="#0369a1" />
            <Text style={styles.featureText}>{service.locality}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now (Rs {service.basePrice})</Text>
        </TouchableOpacity>
        <Text style={styles.bookingDisclaimer}>You won't be charged yet</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
  },
  providerBrief: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  profilePicPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0369a1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicPlaceholderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  providerInfo: {},
  providerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  reviewCountText: {
    color: '#666',
  },
  imageSlider: {
    height: 300,
    position: 'relative',
    marginBottom: 16,
  },
  slideImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sliderNavigation: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    top: '50%',
    paddingHorizontal: 10,
    zIndex: 10,
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
    transform: [{ scale: 1.25 }],
  },
  sectionContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    color: '#444',
    lineHeight: 22,
  },
  providerContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  providerProfileContainer: {
    flexDirection: 'row',
  },
  providerProfilePicContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
  },
  providerProfilePic: {
    width: '100%',
    height: '100%',
  },
  providerProfilePicPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0369a1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerProfilePicPlaceholderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  providerDetailInfo: {
    flex: 1,
  },
  providerFullName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerEmail: {
    color: '#666',
    marginBottom: 2,
  },
  providerLocality: {
    color: '#666',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#0369a1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewsContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 120, // Extra space for the booking section
    borderRadius: 8,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerPicPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0369a1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerPicPlaceholderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewerName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    color: '#444',
  },
  bookingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceRow: {
    marginBottom: 10,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  priceDescription: {
    color: '#666',
    fontSize: 14,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: '#444',
  },
  bookButton: {
    backgroundColor: '#0369a1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookingDisclaimer: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  }
});