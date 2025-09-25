import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- UPDATED USER DATA WITH INDIAN CONTEXT ---
const USER_DATA = {
  name: 'Ananya Desai',
  email: 'ananya.desai@example.com',
  joinDate: 'June 2025',
  totalReports: 15,
  resolvedReports: 9,
  points: 410,
  level: 'Samudra Rakshak', // Hindi for 'Ocean Guardian'
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
};

// --- UPDATED USER REPORTS WITH INDIAN CONTEXT ---
const USER_REPORTS = [
    {
        id: '1',
        type: 'Plastic Debris',
        location: 'Juhu Beach, Mumbai',
        date: '5 hours ago',
        status: 'under-review',
        image: 'https://cdn.britannica.com/81/155881-050-38801D86/waste-beach-land-pollution-soil-water-health.jpg',
    },
    {
        id: '2',
        type: 'Tarball Deposition',
        location: 'Baga Beach, Goa',
        date: '1 week ago',
        status: 'resolved',
        image: 'https://www.greenpeace.org.uk/wp-content/uploads/2024/06/sewage-outflow-scaled-1.jpeg',
    },
    {
        id: '3',
        type: 'Industrial Effluent',
        location: 'Ennore Creek, Chennai',
        date: '3 weeks ago',
        status: 'resolved',
        image: 'https://i.guim.co.uk/img/media/27974093ba1227c5e6ba29794f15a8c72266c447/0_68_2048_1229/master/2048.jpg?width=700&quality=85&auto=format&fit=max&s=15a4881cd784cc6047b23e5972c9b343',
    }
    ];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved': return '#10B981';
    case 'under-review': return '#F59E0B';
    case 'pending': return '#6B7280';
    default: return '#6B7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'resolved': return 'Resolved';
    case 'under-review': return 'Under Review';
    case 'pending': return 'Pending';
    default: return status;
  }
};

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('reports');

  const StatCard = ({ iconName, value, label, color = '#0EA5E9' }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={iconName} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image source={{ uri: USER_DATA.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{USER_DATA.name}</Text>
              <Text style={styles.email}>{USER_DATA.email}</Text>
              <View style={styles.levelBadge}>
                <Ionicons name="ribbon-outline" size={14} color="#F59E0B" />
                <Text style={styles.levelText}>{USER_DATA.level}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={16} color="#0EA5E9" />
            </TouchableOpacity>
          </View>

          <View style={styles.joinInfo}>
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text style={styles.joinText}>Member since {USER_DATA.joinDate}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              iconName="stats-chart-outline"
              value={USER_DATA.totalReports}
              label="Total Reports"
              color="#0EA5E9"
            />
            <StatCard
              iconName="checkmark-circle-outline"
              value={USER_DATA.resolvedReports}
              label="Resolved"
              color="#10B981"
            />
            <StatCard
              iconName="star-outline"
              value={USER_DATA.points}
              label="Points Earned"
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
            onPress={() => setActiveTab('reports')}
          >
            <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
              My Reports
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'reports' && (
          <View style={styles.reportsContainer}>
            {USER_REPORTS.map((report) => (
              <View key={report.id} style={styles.reportCard}>
                <Image source={{ uri: report.image }} style={styles.reportImage} />
                <View style={styles.reportContent}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportType}>{report.type}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(report.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                        {getStatusText(report.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reportLocation}>
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text style={styles.reportLocationText}>{report.location}</Text>
                  </View>
                  <Text style={styles.reportDate}>{report.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'achievements' && (
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="ribbon-outline" size={24} color="#F59E0B" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>First Reporter</Text>
                <Text style={styles.achievementDesc}>Submitted your first hazard report</Text>
              </View>
              <Text style={styles.achievementPoints}>+50 pts</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="checkmark-done-outline" size={24} color="#10B981" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Problem Solver</Text>
                <Text style={styles.achievementDesc}>5 of your reports were resolved</Text>
              </View>
              <Text style={styles.achievementPoints}>+100 pts</Text>
            </View>

            <View style={[styles.achievementCard, styles.achievementCardLocked]}>
              <View style={[styles.achievementIcon, styles.achievementIconLocked]}>
                <Ionicons name="shield-outline" size={24} color="#9CA3AF" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={[styles.achievementTitle, styles.achievementTitleLocked]}>Ocean Hero</Text>
                <Text style={styles.achievementDesc}>Submit 25 hazard reports (15/25)</Text>
              </View>
              <Text style={styles.achievementPoints}>+250 pts</Text>
            </View>
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="settings-outline" size={20} color="#64748b" />
              <Text style={styles.settingText}>Settings</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={[styles.settingText, { color: '#EF4444' }]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
  },
  joinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  joinText: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#1e293b',
  },
  reportsContainer: {
    paddingHorizontal: 20,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  reportImage: {
    width: 80,
    height: '100%',
    resizeMode: 'cover',
  },
  reportContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  reportLocationText: {
    fontSize: 13,
    color: '#64748b',
  },
  reportDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementIconLocked: {
    backgroundColor: '#F3F4F6',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#9CA3AF',
  },
  achievementDesc: {
    fontSize: 13,
    color: '#64748b',
  },
  achievementPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
});

