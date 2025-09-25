import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- UPDATED DUMMY DATA WITH INDIAN CONTEXT ---
const DUMMY_HAZARDS = [
  {
    id: '1',
    type: 'Oil Spill',
    location: 'Off the coast of Mumbai Port, Maharashtra',
    description: 'Visible oil slick reported by local fishermen near the shipping lanes. Coast Guard has been alerted.',
    reporter: 'Rajesh Kumar',
    timestamp: '2 hours ago',
    image: 'https://i.guim.co.uk/img/media/27974093ba1227c5e6ba29794f15a8c72266c447/0_68_2048_1229/master/2048.jpg?width=700&quality=85&auto=format&fit=max&s=15a4881cd784cc6047b23e5972c9b343',
    severity: 'high',
    coordinates: { lat: 18.9647, lng: 72.8258 },
  },
  {
    id: '2',
    type: 'Plastic Debris',
    location: 'Juhu Beach, Mumbai',
    description: 'Large accumulation of plastic bottles and single-use plastics after the recent high tide. Community cleanup scheduled.',
    reporter: 'Ananya Desai',
    timestamp: '5 hours ago',
    image: 'https://cdn.britannica.com/81/155881-050-38801D86/waste-beach-land-pollution-soil-water-health.jpg',
    severity: 'medium',
    coordinates: { lat: 19.0886, lng: 72.8265 },
  },
  {
    id: '3',
    type: 'Algal Bloom',
    location: 'Vembanad Lake, Kerala',
    description: 'Water has turned a reddish-brown, and dead fish are washing ashore. Suspected harmful algal bloom.',
    reporter: 'Suresh Menon',
    timestamp: '1 day ago',
    image: 'https://oceanservice.noaa.gov/education/tutorial-coastal/harmful-algal-blooms/habs02_fishkill-960.jpg',
    severity: 'high',
    coordinates: { lat: 9.7331, lng: 76.3335 },
  },
  {
    id: '4',
    type: 'Hide Tides',
    location: 'Candolim Beach, Goa',
    description: 'High tides between 6 A.M to 8:30 AM causing flooding of beach shacks and nearby roads.',
    reporter: 'Priya Fernandes',
    timestamp: '2 days ago',
    image: 'https://images.mid-day.com/images/images/2024/may/HighTideAtulKamble_d.jpg',
    severity: 'medium',
    coordinates: { lat: 15.5173, lng: 73.7649 },
  },
  {
    id: '5',
    type: 'Sewage Outflow',
    location: 'Near Hooghly River estuary, WB',
    description: 'Untreated sewage creating a foul smell and discolored water flowing into the Bay of Bengal.',
    reporter: 'Amit Banerjee',
    timestamp: '3 days ago',
    image: 'https://www.greenpeace.org.uk/wp-content/uploads/2024/06/sewage-outflow-scaled-1.jpeg',
    severity: 'high',
    coordinates: { lat: 21.7588, lng: 88.0063 },
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return '#EF4444';
    case 'medium': return '#F97316';
    case 'low': return '#10B981';
    default: return '#6B7280';
  }
};

const getHazardIcon = (type: string) => {
  switch (type) {
    case 'Oil Spill': return '🛢️';
    case 'Sewage Outflow': return '☣️';
    case 'Plastic Debris': return '🗑️';
    case 'Algal Bloom': return '🌊';
    case 'Tarball Deposition': return '⚫';
    default: return '⚠️';
  }
};

export default function CommunityScreen() {
  const [hazards, setHazards] = useState(DUMMY_HAZARDS);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredHazards = hazards.filter(hazard =>
    hazard.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hazard.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHazardItem = ({ item }) => (
    <TouchableOpacity style={styles.hazardCard}>
      <Image source={{ uri: item.image }} style={styles.hazardImage} />
      
      <View style={styles.hazardContent}>
        <View style={styles.hazardHeader}>
          <View style={styles.hazardTypeContainer}>
            <Text style={styles.hazardIcon}>{getHazardIcon(item.type)}</Text>
            <Text style={styles.hazardType}>{item.type}</Text>
          </View>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
            <Ionicons name="warning-outline" size={12} color="#fff" />
            <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>

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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
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
    padding: 20,
    paddingTop: 0,
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
});
