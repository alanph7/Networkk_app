import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import axiosInstance from "../../utils/axios";
import Icon from 'react-native-vector-icons/Feather';
import UserNav from '../components/Usernav';

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    username: "",
    aadhaar: "",
    address: "",     // Add these
    locality: "",    // new
    latitude: "",    // fields
    longitude: "",   // here
  });

  const [originalData, setOriginalData] = useState({
    fname: "",
    lname: "",
    phone: "",
    username: "",
    aadhaar: "",
    address: "",     // Add these
    locality: "",    // new
    latitude: "",    // fields
    longitude: "",   // here
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/d/me');
        const userData = response.data;
        const formattedData = {
          fname: userData.fname || "",
          lname: userData.lname || "",
          phone: userData.phone || "",
          username: userData.username || "",
          aadhaar: userData.aadhaar || "",
          address: userData.address || "",     // Add these
          locality: userData.locality || "",   // new
          latitude: userData.latitude || "",   // fields
          longitude: userData.longitude || "", // here
        };
        setFormData(formattedData);
        setOriginalData(formattedData); // Store original data
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fname) newErrors.fname = "First name is required.";
    if (!formData.lname) newErrors.lname = "Last name is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.aadhaar) newErrors.aadhaar = "Aadhaar is required.";
    if (formData.aadhaar && formData.aadhaar.length !== 12)
      newErrors.aadhaar = "Aadhaar must be 12 digits.";
    
    // Optional: Add validation for latitude and longitude
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = "Invalid latitude value";
    }
    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = "Invalid longitude value";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axiosInstance.put("/users/profile", formData);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.error || "Failed to update profile");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(originalData); // Reset to original data
    setErrors({}); // Clear any validation errors
    setMessage(""); // Clear any messages
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <UserNav />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Profile Settings</Text>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditClick}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Message Display */}
            {message ? (
              <View style={[
                styles.messageContainer,
                message.includes("success") ? styles.successMessage : styles.errorMessage
              ]}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            ) : null}

            {/* Personal Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="user" size={20} color="#9ca3af" />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>

              <View style={styles.formGrid}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput,
                      errors.fname && styles.errorInput
                    ]}
                    value={formData.fname}
                    onChangeText={(value) => handleInputChange('fname', value)}
                    editable={isEditing}
                  />
                  {errors.fname && (
                    <Text style={styles.errorText}>{errors.fname}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={formData.lname}
                    onChangeText={(value) => handleInputChange('lname', value)}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    editable={isEditing}
                  />
                </View>
              </View>
            </View>

            {/* Contact Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="phone" size={20} color="#9ca3af" />
                <Text style={styles.sectionTitle}>Contact Information</Text>
              </View>

              <View style={styles.formGrid}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    editable={isEditing}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Aadhaar Number</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={formData.aadhaar}
                    onChangeText={(value) => handleInputChange('aadhaar', value)}
                    editable={isEditing}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                </View>
              </View>
            </View>

            {/* Location Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="map-pin" size={20} color="#9ca3af" />
                <Text style={styles.sectionTitle}>Location Details</Text>
              </View>

              <View style={styles.formGrid}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                    editable={isEditing}
                    multiline
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Locality</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={formData.locality}
                    onChangeText={(value) => handleInputChange('locality', value)}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Latitude</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={String(formData.latitude || '')}
                    onChangeText={(value) => handleInputChange('latitude', value)}
                    editable={isEditing}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Longitude</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.readOnlyInput
                    ]}
                    value={String(formData.longitude || '')}
                    onChangeText={(value) => handleInputChange('longitude', value)}
                    editable={isEditing}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            {isEditing && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelClick}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  editButton: {
    backgroundColor: '#0284c7',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  formGrid: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  readOnlyInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0284c7',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  messageContainer: {
    padding: 16,
    borderRadius: 6,
    marginBottom: 16,
  },
  successMessage: {
    backgroundColor: '#ecfdf5',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
  },
  messageText: {
    fontSize: 14,
    color: '#047857',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetailsForm;