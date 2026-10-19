import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MOCK_ACTIVITY_EVENTS } from '../constants/mockData';
import { ActivityEvent } from '../types';
import { Colors, Radii, Shadows } from '../constants/theme';
import { ApiService } from '../services/api';

interface ActivityScreenProps {
  onEventPress?: (event: ActivityEvent) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ onEventPress }) => {
  const [events, setEvents] = useState<ActivityEvent[]>(MOCK_ACTIVITY_EVENTS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ripples' | 'matches' | 'field'>(
    'all'
  );

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [liveEvents, notifs] = await Promise.all([
          ApiService.getActivity(),
          ApiService.getNotificationStream(),
        ]);

        const notifEvents: ActivityEvent[] = (notifs || []).map((n: any) => ({
          id: n.id,
          type: n.notification_type === 'MATCH_BONUS' ? 'match_bonus' : 'amplification',
          title: n.title,
          subtitle: n.message,
          timestamp: 'Just now',
          icon: n.notification_type === 'MATCH_BONUS' ? 'gift' : 'radio',
          iconBg: n.notification_type === 'MATCH_BONUS' ? '#10B981' : '#4F46E5',
          badgeText: n.notification_type === 'MATCH_BONUS' ? 'Corporate Match' : 'Broadcast Milestone',
        }));

        setEvents([...notifEvents, ...liveEvents]);
      } catch {}
    };
    fetchActivities();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (selectedFilter === 'ripples') return e.type === 'amplification';
    if (selectedFilter === 'matches') return e.type === 'match_bonus';
    if (selectedFilter === 'field') return e.type === 'field_update';
    return true;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentPadding}
      showsVerticalScrollIndicator={false}
    >
      {/* Live Daily Impact Widget */}
      <View style={styles.dailyWidgetContainer}>
        <View style={styles.widgetHeaderRow}>
          <View style={styles.widgetPulseRow}>
            <View style={styles.livePulseDot} />
            <Text style={styles.widgetBadgeText}>LIVE DAILY CIVIC IMPACT</Text>
          </View>
          <Text style={styles.widgetDate}>Today • Boston Metro</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricBig}>4,820</Text>
            <Text style={styles.metricLabel}>Citizens Reached Today</Text>
            <View style={styles.trendRow}>
              <Feather name="arrow-up-right" size={11} color={Colors.success} />
              <Text style={styles.trendText}>+18% vs yesterday</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricBig}>18</Text>
            <Text style={styles.metricLabel}>Active Broadcast Ripples</Text>
            <View style={styles.trendRow}>
              <Feather name="radio" size={11} color={Colors.primary} />
              <Text style={[styles.trendText, { color: Colors.primary }]}>6 running live</Text>
            </View>
          </View>
        </View>

        {/* Milestone Progress Bar */}
        <View style={styles.milestoneBarContainer}>
          <View style={styles.milestoneLabels}>
            <Text style={styles.milestoneTitle}>Citywide Target: 10,000 Impressions</Text>
            <Text style={styles.milestonePercent}>48%</Text>
          </View>
          <View style={styles.milestoneTrack}>
            <View style={[styles.milestoneFill, { width: '48%' }]} />
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        {[
          { id: 'all', label: 'All Ripples' },
          { id: 'ripples', label: 'Broadcasts' },
          { id: 'matches', label: 'Match Pools' },
          { id: 'field', label: 'Field Updates' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, selectedFilter === tab.id && styles.tabButtonActive]}
            onPress={() => setSelectedFilter(tab.id as any)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                selectedFilter === tab.id && styles.tabButtonTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stream of Real-Time Notification Cards */}
      <View style={styles.streamList}>
        {filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => onEventPress && onEventPress(event)}
            activeOpacity={0.88}
          >
            <View style={styles.eventTopRow}>
              <View style={[styles.eventIconBox, { backgroundColor: event.iconBg }]}>
                <Feather name={event.icon as any} size={16} color="#FFFFFF" />
              </View>

              <View style={styles.eventHeadingBox}>
                <View style={styles.titleWithBadge}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.badgeText && (
                    <View style={styles.eventBadge}>
                      <Text style={styles.eventBadgeText}>{event.badgeText}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.eventTimestamp}>{event.timestamp}</Text>
              </View>
            </View>

            <Text style={styles.eventSubtitle}>{event.subtitle}</Text>

            {event.avatar && (
              <View style={styles.creatorTagline}>
                <Image source={{ uri: event.avatar }} style={styles.fieldAvatar} />
                <Text style={styles.fieldNote}>Verified Field Log from Project Lead</Text>
              </View>
            )}

            {event.reachCount && (
              <View style={styles.reachCounterRow}>
                <Feather name="users" size={13} color={Colors.primary} />
                <Text style={styles.reachCounterText}>
                  {event.reachCount} local households received this push notification
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  dailyWidgetContainer: {
    backgroundColor: '#1E2238',
    borderRadius: Radii.xl,
    padding: 18,
    marginBottom: 16,
    ...Shadows.elevated,
  },
  widgetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  widgetPulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  widgetBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  widgetDate: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#131728',
    borderRadius: Radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricBig: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '700',
  },
  milestoneBarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Radii.md,
    padding: 10,
  },
  milestoneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  milestoneTitle: {
    fontSize: 11,
    color: '#E0E7FF',
    fontWeight: '600',
  },
  milestonePercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
  },
  milestoneTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  milestoneFill: {
    height: '100%',
    backgroundColor: Colors.amber,
    borderRadius: 3,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  streamList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  eventTopRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  eventIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventHeadingBox: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  eventBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  eventBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  eventTimestamp: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  eventSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  creatorTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: Radii.md,
    marginTop: 10,
  },
  fieldAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  fieldNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  reachCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  reachCounterText: {
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
