import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Check, ChevronDown, MapPin, Upload, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';

interface HazardType {
  id: string;
  name: string;
  icon: string;
}

const HAZARD_TYPES: HazardType[] = [
  { id: 'flood', name: 'Flood', icon: '🌊' },            // water wave
  { id: 'Broken Buildings', name: 'Broken Buildings', icon: '🏚️' }, // collapsed house
  { id: 'oil_spill', name: 'Oil Spill', icon: '🛢️' },   // oil drum
  { id: 'ocean_trash', name: 'Ocean Trash', icon: '🗑️' }, // trash bin
  { id: 'other', name: 'Other', icon: '⚠️' },           // warning
];


export default function ReportScreen() {
  const [selectedHazard, setSelectedHazard] = useState<HazardType | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showHazardPicker, setShowHazardPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { token } = useAuth();
  const { location: currentLocation } = useLocation();

  const handleSubmit = async () => {
    if (!selectedHazard || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Location Error', 'Unable to get your current location. Please ensure location services are enabled.');
      return;
    }

    if (!token) {
      Alert.alert('Authentication Error', 'Please log in to submit a report.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('hazardType', selectedHazard.id); // Use the enum value (id) instead of name
      formData.append('description', description);
      formData.append('latitude', currentLocation.latitude.toString());
      formData.append('longitude', currentLocation.longitude.toString());
      // Include userId in body per request
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        if (parsed?.id) {
          formData.append('userId', parsed.id);
        }
      } catch {}
      
      if (selectedImage) {
        formData.append('media', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'report_image.jpg',
        } as any);
      }

      const response = await fetch('https://sih-backend-1-hiow.onrender.com/api/reports/report', {
        method: 'POST',
        // No Authorization header (per instruction), let fetch set multipart boundary
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Report submit failed', response.status, text);
        Alert.alert('Error', text || `Failed with status ${response.status}`);
        return; // Avoid reading body twice
      }

      const data = await response.json();
      console.log("Response from Report: ", data);

      if (data.success) {
        Alert.alert('Success', 'Hazard report submitted successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedHazard(null);
              setLocation('');
              setDescription('');
              setSelectedImage(null);
            }
          }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const getCurrentLocation = () => {
    if (currentLocation) {
      setLocation(`Lat: ${currentLocation.latitude.toFixed(4)}, Lng: ${currentLocation.longitude.toFixed(4)}`);
    } else {
      Alert.alert('Location Error', 'Unable to get your current location. Please ensure location services are enabled.');
    }
  };

  // Auto-fill location when component mounts
  React.useEffect(() => {
    if (currentLocation && !location) {
      setLocation(`Lat: ${currentLocation.latitude.toFixed(4)}, Lng: ${currentLocation.longitude.toFixed(4)}`);
    }
  }, [currentLocation, location]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Report Hazard</Text>
        <Text style={styles.subtitle}>Help protect our oceans</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Hazard Type Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Hazard Type *</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => {
                console.log('Opening hazard picker');
                setShowHazardPicker(true);
              }}
            >
              <View style={styles.pickerContent}>
                {selectedHazard ? (
                  <>
                    <Text style={styles.hazardIcon}>{selectedHazard.icon}</Text>
                    <Text style={styles.pickerText}>{selectedHazard.name}</Text>
                  </>
                ) : (
                  <Text style={styles.placeholderText}>Select hazard type</Text>
                )}
              </View>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.subLabel}>Your current location coordinates are automatically included</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={styles.locationInput}
                placeholder="Optional: Add location description (e.g., 'Near Marina Beach')"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <MapPin size={18} color="#0EA5E9" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the hazard in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Media Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Photo/Video</Text>
            <Text style={styles.subLabel}>Help others see the hazard</Text>
            
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
                <Upload size={24} color="#0EA5E9" />
                <Text style={styles.uploadText}>Upload Photo</Text>
                <Text style={styles.uploadSubtext}>Tap to select from gallery</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <>
                <Check size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By submitting this report, you confirm that the information provided is accurate 
            and you consent to sharing this data with relevant authorities and the community.
          </Text>
        </View>
      </ScrollView>

      {/* Hazard Type Picker Modal */}
      <Modal
        visible={showHazardPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          console.log('Modal close requested');
          setShowHazardPicker(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowHazardPicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Hazard Type</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    console.log('Close button pressed');
                    setShowHazardPicker(false);
                  }}
                >
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.hazardList} showsVerticalScrollIndicator={false}>
                {HAZARD_TYPES.map((hazard) => (
                  <TouchableOpacity
                    key={hazard.id}
                    style={[
                      styles.hazardOption,
                      selectedHazard?.id === hazard.id && styles.hazardOptionSelected
                    ]}
                    onPress={() => {
                      console.log('Hazard selected:', hazard.name);
                      setSelectedHazard(hazard);
                      setShowHazardPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.hazardOptionContent}>
                      <Text style={styles.hazardIcon}>{hazard.icon}</Text>
                      <Text style={styles.hazardName}>{hazard.name}</Text>
                    </View>
                    {selectedHazard?.id === hazard.id && (
                      <Check size={20} color="#0EA5E9" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  scrollContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hazardIcon: {
    fontSize: 18,
  },
  pickerText: {
    fontSize: 16,
    color: '#1e293b',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  locationInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  locationButton: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    minHeight: 100,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  hazardList: {
    flex: 1,
  },
  hazardOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 60,
  },
  hazardOptionSelected: {
    backgroundColor: '#f0f9ff',
  },
  hazardOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hazardName: {
    fontSize: 16,
    color: '#1e293b',
  },
});