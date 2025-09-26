import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import { SafeAreaView } from 'react-native-safe-area-context';

// API URL for fetching reports
const API_URL = 'https://sih-backend-1-hiow.onrender.com/api/reports/getall';

// --- HELPER FUNCTIONS ---

// Maps the backend status to a severity level and color
const getSeverityInfo = (status) => {
  switch (status) {
    case 'resolved':
      return { level: 'low', color: '#10B981' };
    case 'in_progress':
      return { level: 'medium', color: '#F97316' };
    case 'pending':
    default:
      return { level: 'high', color: '#EF4444' };
  }
};

// Maps the backend hazardType to an icon
const getHazardIcon = (type) => {
  const typeLower = type.toLowerCase();
  if (typeLower.includes('oil')) return '🛢️';
  if (typeLower.includes('sewage')) return '☣️';
  if (typeLower.includes('plastic') || typeLower.includes('debris')) return '🗑️';
  if (typeLower.includes('algal')) return '🌿';
  if (typeLower.includes('tide')) return '🌊';
  return '⚠️'; // Default for "other" or unknown types
};

// Converts ISO date strings to a "time ago" format
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};


export default function CommunityScreen() {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- DATA FETCHING ---
  const fetchHazards = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      if (json.success && Array.isArray(json.data)) {
        // Transform the API data to match the component's expected structure
        const formattedData = json.data.map(item => ({
          id: item._id,
          type: item.hazardType.charAt(0).toUpperCase() + item.hazardType.slice(1),
          location: `Lat: ${item.latitude.toFixed(4)}, Lng: ${item.longitude.toFixed(4)}`,
          description: item.description,
          reporter: 'Community User', // API does not provide a name, so we use a placeholder
          timestamp: formatTimeAgo(item.createdAt),
          image: item.mediaUrl || 'https://images.unsplash.com/photo-1593968568932-b0b3826625a5?q=80&w=2940&auto=format&fit=crop', // A default image if none is provided
          severity: getSeverityInfo(item.status).level,
          coordinates: { lat: item.latitude, lng: item.longitude },
        }));
        setHazards(formattedData);
      } else {
        console.error("API did not return successful data:", json);
      }
    } catch (error) {
      console.error("Failed to fetch hazards:", error);
      // Optionally, set an error state here to show an error message in the UI
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHazards();
  }, [fetchHazards]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHazards();
  };

  const filteredHazards = hazards.filter(hazard =>
    hazard.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hazard.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHazardItem = ({ item }) => {
    const severityInfo = getSeverityInfo(item.severity === 'high' ? 'pending' : item.severity);

    return (
        <TouchableOpacity style={styles.hazardCard}>
            <Image source={{ uri: item.image }} style={styles.hazardImage} />
            <View style={styles.hazardContent}>
                <View style={styles.hazardHeader}>
                    <View style={styles.hazardTypeContainer}>
                        <Text style={styles.hazardIcon}>{getHazardIcon(item.type)}</Text>
                        <Text style={styles.hazardType}>{item.type}</Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: severityInfo.color }]}>
                        <Ionicons name="warning-outline" size={12} color="#fff" />
                        <Text style={styles.severityText}>{severityInfo.level.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text style={styles.locationText}>{item.location}</Text>
                </View>

                {/* --- THIS IS THE MODIFIED PART --- */}
                <Hyperlink
                  linkDefault={true} // This makes links open in the browser
                  linkStyle={styles.linkStyle} // Apply a blue, underlined style
                >
                  <Text style={styles.description}>{item.description}</Text>
                </Hyperlink>
                {/* ---------------------------------- */}

                <View style={styles.hazardFooter}>
                    <Text style={styles.reporter}>Reported by {item.reporter}</Text>
                    <View style={styles.timeContainer}>
                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Fetching Reports...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Feed</Text>
        <Text style={styles.subtitle}>Live Hazard Reports from India</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hazards or locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#0EA5E9" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHazards}
        renderItem={renderHazardItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0EA5E9"]} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No reports found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}


// --- STYLES (Mostly unchanged) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  hazardCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  hazardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: '#e2e8f0' // Placeholder color
  },
  hazardContent: {
    padding: 16,
  },
  hazardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hazardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  hazardIcon: {
    fontSize: 20,
  },
  hazardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flexShrink: 1,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  hazardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reporter: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  linkStyle: {
    color: '#007BFF', // A standard blue link color
    textDecorationLine: 'underline',
  },
});