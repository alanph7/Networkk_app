import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Switch,
  Modal,
  Platform,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import axiosInstance from '../../utils/axios';
import { haversineDistance } from '../components/Haversine';
import * as Location from 'expo-location';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

// Native date picker component
const NativeDatePicker = ({ visible, onClose, onSelect, selectedDate }) => {
    const [date, setDate] = useState(selectedDate || new Date());
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Generate next 90 days for picker
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
      return dates;
    };
  
    const dates = generateDates();
  
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={dates}
              keyExtractor={(item) => item.toISOString()}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.dateItem,
                    dayjs(date).format('YYYY-MM-DD') === dayjs(item).format('YYYY-MM-DD') && 
                    styles.dateItemSelected
                  ]}
                  onPress={() => {
                    setDate(item);
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={[
                    styles.dateText,
                    dayjs(date).format('YYYY-MM-DD') === dayjs(item).format('YYYY-MM-DD') && 
                    styles.dateTextSelected
                  ]}>
                    {`${item.getDate()} ${months[item.getMonth()]} ${item.getFullYear()}`}
                  </Text>
                </Pressable>
              )}
              style={styles.dateList}
            />
          </View>
        </View>
      </Modal>
    );
  };

export default function SearchScreen() {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [filters, setFilters] = useState({
    date: null,
    type: '',
    sortBy: 'rating',
    sortOrder: 'desc',
    minPrice: '',
    maxPrice: '',
    maxDistance: 50,
    minRating: '',
    name: '',
    isOpen: true
  });

  const [filteredProviders, setFilteredProviders] = useState([]);
  const [originalProviders, setOriginalProviders] = useState([]);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get('/services');
        const acceptedServices = response.data.filter(service => 
          service.status === 'accepted' && service.isOpen
        );
        setOriginalProviders(response.data.filter(service => service.status === 'accepted'));
        setFilteredProviders(acceptedServices);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('Failed to load services');
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          setIsLoadingLocation(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        setIsLoadingLocation(false);
      } catch (error) {
        setLocationError('Error getting location');
        setIsLoadingLocation(false);
      }
    };

    getLocation();
  }, []);

  const applyFilters = () => {
    let results = [...originalProviders];
    
    results = results.filter(provider => 
      provider.status === 'accepted' && 
      (filters.isOpen ? provider.isOpen : true)
    );

    if (filters.date) {
      const selectedDate = filters.date;
      results = results.filter(provider => {
        if (!provider.holidays) return true;
        let holidayDates;
        try {
          holidayDates = Array.isArray(provider.holidays) 
            ? provider.holidays 
            : JSON.parse(provider.holidays);
        } catch (e) {
          console.error('Error parsing holidays:', e);
          return true;
        }
        return !holidayDates.includes(selectedDate);
      });
    }

    if (filters.type) {
      results = results.filter(provider => 
        provider.category?.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    if (filters.minPrice) {
      results = results.filter(provider => 
        provider.basePrice >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      results = results.filter(provider => 
        provider.basePrice <= parseInt(filters.maxPrice)
      );
    }

    if (filters.name) {
      results = results.filter(provider =>
        provider.serviceProvider.fname.toLowerCase().includes(filters.name.toLowerCase()) ||
        provider.serviceProvider.lname.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (userLocation && filters.maxDistance) {
      results = results.filter(provider => {
        if (!provider.serviceProvider.latitude || !provider.serviceProvider.longitude) {
          return false;
        }
        
        const distance = haversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(provider.serviceProvider.latitude),
          parseFloat(provider.serviceProvider.longitude)
        );
        
        return distance <= filters.maxDistance;
      });
    }

    if (filters.sortBy === 'price') {
      results.sort((a, b) => {
        return filters.sortOrder === 'asc' 
          ? a.basePrice - b.basePrice
          : b.basePrice - a.basePrice;
      });
    } else if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.avgRating - a.avgRating);
    }

    setFilteredProviders(results);
  };

  const renderServiceCard = ({ item: provider }) => {
    const cardOpacity = provider.isOpen ? 1 : 0.5;

    return (
      <TouchableOpacity 
        style={[styles.card, { opacity: cardOpacity }]}
        onPress={() => provider.isOpen && navigation.navigate('ServiceDetail', { serviceId: provider.serviceId })}
        disabled={!provider.isOpen}
      >
        <Image
          source={{ 
            uri: (() => {
              try {
                const pics = JSON.parse(provider.demoPics || '[]');
                // return pics[0] ;
                // console.log('pics:', pics);
                if (Array.isArray(pics) && pics.length > 0 && pics[0]) {
                    // Add error handling for Minio URLs
                    const imageUrl = pics[0];
                    return imageUrl;
                  }
              } catch (error) {
                console.log('Error parsing demoPics:', error);
                return `https://picsum.photos/seed/${provider.serviceId}/300/200`;
              }
            })()
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.providerName}>
            {provider.serviceProvider.fname} {provider.serviceProvider.lname}
          </Text>
          <Text style={styles.category}>{provider.category}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {provider.description || "No description available"}
          </Text>

          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{provider.avgRating}</Text>
            <Text style={styles.separator}>|</Text>
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.location}>{provider.locality}</Text>
          </View>

          {userLocation && provider.serviceProvider.latitude && provider.serviceProvider.longitude && (
            <Text style={styles.distance}>
              Distance: {haversineDistance(
                userLocation.latitude,
                userLocation.longitude,
                parseFloat(provider.serviceProvider.latitude),
                parseFloat(provider.serviceProvider.longitude)
              ).toFixed(1)} km
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.price}>Rs {provider.basePrice}</Text>
            <Text style={[styles.status, { color: provider.isOpen ? '#22C55E' : '#EF4444' }]}>
              {provider.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        {!provider.isOpen && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Currently Unavailable</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleDateSelect = (selectedDate) => {
    setFilters(prev => ({
      ...prev,
      date: dayjs(selectedDate).format('YYYY-MM-DD')
    }));
  };

//   useEffect(() => {
//     applyFilters();
//   }, [filters]);


useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300); // Add a debounce delay
  
    return () => clearTimeout(timeoutId);
  }, [
    filters.date,
    filters.type,
    filters.sortBy,
    filters.sortOrder,
    filters.minPrice,
    filters.maxPrice,
    filters.maxDistance,
    filters.minRating,
    filters.name,
    filters.isOpen,
    userLocation // Add userLocation as a dependency if needed
  ]);

  if (isLoadingLocation) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text>Loading your location...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="What service are you looking for?"
          value={filters.type}
          onChangeText={(text) => setFilters(prev => ({ ...prev, type: text }))}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          
          <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {filters.date ? dayjs(filters.date).format('DD MMM YYYY') : 'Select Date'}
        </Text>
      </TouchableOpacity>

      <NativeDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        selectedDate={filters.date ? new Date(filters.date) : new Date()}
      />

          <View style={styles.priceContainer}>
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min"
                value={filters.minPrice}
                onChangeText={(text) => setFilters(prev => ({ ...prev, minPrice: text }))}
                keyboardType="numeric"
              />
              <Text>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max"
                value={filters.maxPrice}
                onChangeText={(text) => setFilters(prev => ({ ...prev, maxPrice: text }))}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.filterLabel}>Show only open services</Text>
            <Switch
              value={filters.isOpen}
              onValueChange={(value) => setFilters(prev => ({ ...prev, isOpen: value }))}
              trackColor={{ false: "#767577", true: "#0EA5E9" }}
            />
          </View>

          <View style={styles.distanceContainer}>
            <Text style={styles.filterLabel}>Distance: {filters.maxDistance}km</Text>
            <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          value={filters.maxDistance}
          onValueChange={(value) => { 
            setFilters(prev => ({ 
            ...prev, 
            maxDistance: Math.round(value) 
          }));
        }}
        onSlidingComplete={(value) => {
            // Apply filters only when sliding is complete
            setFilters(prev => ({ 
              ...prev, 
              maxDistance: Math.round(value) 
            }));
          }}
          minimumTrackTintColor="#0EA5E9"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#0EA5E9"
        />

<View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>1km</Text>
          <Text style={styles.sliderLabel}>50km</Text>
        </View>
          </View>

          <View style={styles.sortContainer}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  filters.sortBy === 'rating' && styles.sortButtonActive
                ]}
                onPress={() => setFilters(prev => ({ ...prev, sortBy: 'rating' }))}
              >
                <Text style={filters.sortBy === 'rating' ? styles.sortButtonTextActive : styles.sortButtonText}>
                  Rating
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  filters.sortBy === 'price' && styles.sortButtonActive
                ]}
                onPress={() => setFilters(prev => ({ ...prev, sortBy: 'price' }))}
              >
                <Text style={filters.sortBy === 'price' ? styles.sortButtonTextActive : styles.sortButtonText}>
                  Price
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={filteredProviders}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.serviceId.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

// Replace the existing styles object with these enhanced styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    searchContainer: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    searchInput: {
      flex: 1,
      height: 46,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingHorizontal: 16,
      marginRight: 12,
      fontSize: 16,
      color: '#1F2937',
    },
    filterButton: {
      width: 46,
      height: 46,
      backgroundColor: '#0EA5E9',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#0EA5E9',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    filtersContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    dateButton: {
      padding: 16,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    dateButtonText: {
      fontSize: 16,
      color: '#374151',
      textAlign: 'center',
      fontWeight: '500',
    },
    filterLabel: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 10,
      color: '#374151',
      letterSpacing: 0.3,
    },
    priceInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    priceInput: {
      flex: 1,
      height: 46,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 15,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 16,
      backgroundColor: '#F3F4F6',
      padding: 16,
      borderRadius: 12,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      backgroundColor: '#F3F4F6',
    },
    cardContent: {
      padding: 16,
    },
    providerName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4,
    },
    category: {
      fontSize: 14,
      color: '#0EA5E9',
      fontWeight: '500',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20,
      marginBottom: 12,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 4,
    },
    rating: {
      fontSize: 14,
      color: '#1F2937',
      marginLeft: 4,
      fontWeight: '500',
    },
    separator: {
      color: '#D1D5DB',
      marginHorizontal: 8,
    },
    location: {
      fontSize: 14,
      color: '#6B7280',
      marginLeft: 4,
    },
    distance: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    price: {
      fontSize: 18,
      fontWeight: '600',
      color: '#059669',
    },
    status: {
      fontSize: 14,
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: 'white',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1F2937',
    },
    sortContainer: {
      marginTop: 16,
    },
    sortButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    sortButton: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    sortButtonActive: {
      backgroundColor: '#0EA5E9',
      borderColor: '#0EA5E9',
    },
    sortButtonText: {
      color: '#374151',
      fontWeight: '500',
    },
    sortButtonTextActive: {
      color: '#fff',
      fontWeight: '500',
    },
    distanceContainer: {
        padding: 16,
        backgroundColor: '#fff',
      },
      slider: {
        height: 40,
        width: '100%',
      },
      sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      },
      sliderLabel: {
        fontSize: 12,
        color: '#6B7280',
      },
      filterLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#374151',
      },
  });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: '#EF4444',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginRight: 8,
//   },
//   filterButton: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#0EA5E9',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   filtersContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   dateButton: {
//     padding: 12,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   priceContainer: {
//     marginBottom: 12,
//   },
//   filterLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//     color: '#374151',
//   },
//   priceInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   priceInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginHorizontal: 4,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '70%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     color: '#6B7280',
//   },
//   dateList: {
//     padding: 10,
//   },
//   dateItem: {
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 2,
//   },
//   dateItemSelected: {
//     backgroundColor: '#0EA5E9',
//   },
//   dateText: {
//     fontSize: 16,
//     color: '#1F2937',
//   },
//   dateTextSelected: {
//     color: 'white',
//   },
//   dateButton: {
//     padding: 15,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginVertical: 8,
//   },
//   dateButtonText: {
//     fontSize: 16,
//     color: '#374151',
//     textAlign: 'center',
//   },
// });