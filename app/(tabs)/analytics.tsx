import { ChartBar as BarChart3, Filter, MapPin, TrendingUp, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- UPDATED DATA WITH INDIAN CONTEXT ---
const ANALYTICS_DATA = {
  totalHazards: 278,
  highPriority: 41,
  resolved: 152,
  socialPosts: 519,
  topHazards: [
    { type: 'Plastic Debris', count: 88, percentage: 32, color: '#3b82f6' },
    { type: 'Sewage Outflow', count: 65, percentage: 23, color: '#a16207' },
    { type: 'Tarball Deposition', count: 52, percentage: 19, color: '#1f2937' },
    { type: 'Algal Bloom', count: 43, percentage: 15, color: '#dc2626' },
    { type: 'Other', count: 30, percentage: 11, color: '#6b7280' },
  ],
  monthlyTrend: [
    { month: 'Jan', reports: 22, resolved: 14 },
    { month: 'Feb', reports: 29, resolved: 21 },
    { month: 'Mar', reports: 35, resolved: 25 },
    { month: 'Apr', reports: 42, resolved: 30 },
    { month: 'May', reports: 51, resolved: 34 },
    { month: 'Jun', reports: 48, resolved: 28 },
  ],
  socialMediaPosts: [
    {
      id: '1',
      platform: 'Twitter',
      content: 'Massive plastic pile-up at Juhu Beach after high tide. Urgent cleanup needed! #Mumbai #SaveJuhuBeach #MarinePollution',
      location: 'Mumbai, Maharashtra',
      timestamp: '3h ago',
      engagement: 258,
    },
    {
      id: '2',
      platform: 'Instagram',
      content: 'Sad to see industrial waste flowing into the sea near Ennore Port. The smell is unbearable. Authorities must act. #Chennai #Ennore',
      location: 'Chennai, Tamil Nadu',
      timestamp: '5h ago',
      engagement: 172,
    },
    {
      id: '3',
      platform: 'Twitter',
      content: 'Reports of an unusual red-brown tide along the coast of Goa. Is this an algal bloom? #Goa #RedTide #ArabianSea',
      location: 'Goa',
      timestamp: '8h ago',
      engagement: 310,
    },
    {
      id: '4',
      platform: 'Facebook',
      content: 'Significant tarball deposition on Puri Beach this morning. Tourists and locals are advised to be careful. #Puri #Odisha #BayOfBengal',
      location: 'Puri, Odisha',
      timestamp: '1d ago',
      engagement: 95,
    },
  ]
};

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const StatCard = ({ title, value, subtitle, icon: Icon, color = '#0EA5E9' }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const BarChart = ({ data, maxValue }) => (
    <View style={styles.barChart}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={styles.bar}>
            <View
              style={[
                styles.barFill,
                {
                  height: `${(item.count / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }
              ]}
            />
          </View>
          <Text style={styles.barLabel}>{item.type.split(' ')[0]}</Text>
          <Text style={styles.barValue}>{item.count}</Text>
        </View>
      ))}
    </View>
  );

  const LineChart = ({ data }) => (
    <View style={styles.lineChart}>
      <View style={styles.lineChartHeader}>
        <Text style={styles.chartTitle}>Monthly Reports</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#0EA5E9' }]} />
            <Text style={styles.legendText}>Reports</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Resolved</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.lineChartContent}>
        {data.map((item, index) => (
          <View key={index} style={styles.lineChartBar}>
            <View style={styles.lineChartBars}>
              <View
                style={[
                  styles.lineChartBarFill,
                  {
                    height: `${(item.reports / 60) * 100}%`, // Adjusted max value for scale
                    backgroundColor: '#0EA5E9',
                  }
                ]}
              />
              <View
                style={[
                  styles.lineChartBarFill,
                  {
                    height: `${(item.resolved / 60) * 100}%`, // Adjusted max value for scale
                    backgroundColor: '#10B981',
                  }
                ]}
              />
            </View>
            <Text style={styles.lineChartLabel}>{item.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Insights from Indian coastlines</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {['7d', '30d', '90d', '1y'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Hazards"
              value={ANALYTICS_DATA.totalHazards}
              subtitle="+15% this month"
              icon={BarChart3}
              color="#0EA5E9"
            />
            <StatCard
              title="High Priority"
              value={ANALYTICS_DATA.highPriority}
              subtitle="Needs attention"
              icon={TrendingUp}
              color="#EF4444"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Resolved"
              value={ANALYTICS_DATA.resolved}
              subtitle="55% resolution rate"
              icon={MapPin}
              color="#10B981"
            />
            <StatCard
              title="Social Posts"
              value={ANALYTICS_DATA.socialPosts}
              subtitle="Monitored mentions"
              icon={Users}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Hazard Types Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Top Hazard Types</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <BarChart 
            data={ANALYTICS_DATA.topHazards} 
            maxValue={Math.max(...ANALYTICS_DATA.topHazards.map(h => h.count))}
          />
        </View>

        {/* Monthly Trend */}
        <View style={styles.chartCard}>
          <LineChart data={ANALYTICS_DATA.monthlyTrend} />
        </View>

        {/* Social Media Monitoring */}
        <View style={styles.socialCard}>
          <View style={styles.socialHeader}>
            <Text style={styles.chartTitle}>Social Media Monitoring</Text>
            <Text style={styles.socialSubtitle}>Recent mentions from India</Text>
          </View>
          
          {ANALYTICS_DATA.socialMediaPosts.map((post) => (
            <View key={post.id} style={styles.socialPost}>
              <View style={styles.socialPostHeader}>
                <View style={[styles.platformBadge, post.platform === 'Twitter' ? styles.twitterBadge : styles.instagramBadge]}>
                  <Text style={[styles.platformText, post.platform === 'Twitter' ? styles.twitterText : styles.instagramText]}>{post.platform}</Text>
                </View>
                <Text style={styles.socialTimestamp}>{post.timestamp}</Text>
              </View>
              
              <Text style={styles.socialContent}>{post.content}</Text>
              
              <View style={styles.socialFooter}>
                <View style={styles.socialLocation}>
                  <MapPin size={12} color="#6B7280" />
                  <Text style={styles.socialLocationText}>{post.location}</Text>
                </View>
                <Text style={styles.socialEngagement}>{post.engagement} interactions</Text>
              </View>
            </View>
          ))}
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  periodButtonActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  filterButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  bar: {
    width: 32,
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 8,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  lineChart: {
    marginBottom: 8,
  },
  lineChartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lineChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  lineChartBar: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  lineChartBars: {
    flexDirection: 'row',
    gap: 2,
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  lineChartBarFill: {
    width: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  lineChartLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  socialCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  socialHeader: {
    marginBottom: 16,
  },
  socialSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  socialPost: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  socialPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  twitterBadge: { backgroundColor: '#e0f2fe' },
  instagramBadge: { backgroundColor: '#fdf4ff' },
  platformText: {
    fontSize: 12,
    fontWeight: '500',
  },
  twitterText: { color: '#0ea5e9' },
  instagramText: { color: '#d946ef' },
  socialTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  socialContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  socialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialLocationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  socialEngagement: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
