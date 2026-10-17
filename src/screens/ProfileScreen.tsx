import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { USER_ALEX_MORGAN, USER_MAYA_LIN, MOCK_CAMPAIGNS } from '../constants/mockData';
import { Colors, Radii, Shadows } from '../constants/theme';
import { ImpactCertificateModal } from './ImpactCertificateModal';
import { ApiService } from '../services/api';

interface ProfileScreenProps {
  onStartCampaignPress: () => void;
  onExplorePress: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onStartCampaignPress,
  onExplorePress,
}) => {
  // Role switcher: 'backed' (Alex Morgan) vs 'my_campaigns' (Maya Lin)
  const [roleMode, setRoleMode] = useState<'backed' | 'my_campaigns'>('backed');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await ApiService.getDashboard();
        if (data) setDashboardData(data);
      } catch {}
    };
    fetchDashboard();
  }, []);

  const baseUser = roleMode === 'backed' ? USER_ALEX_MORGAN : USER_MAYA_LIN;
  const currentUser = {
    ...baseUser,
    streakDays: dashboardData?.streak_count || baseUser.streakDays,
    totalDonated: dashboardData?.total_donated || baseUser.totalDonated,
    totalImpressionsAchieved: dashboardData?.total_impressions_achieved || baseUser.totalImpressionsAchieved,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentPadding}
      showsVerticalScrollIndicator={false}
    >
      {/* Role Intent Switcher Pill */}
      <View style={styles.roleToggleContainer}>
        <TouchableOpacity
          style={[styles.rolePill, roleMode === 'backed' && styles.rolePillActive]}
          onPress={() => setRoleMode('backed')}
          activeOpacity={0.8}
        >
          <Feather
            name="heart"
            size={13}
            color={roleMode === 'backed' ? '#FFFFFF' : Colors.textSecondary}
          />
          <Text
            style={[styles.rolePillText, roleMode === 'backed' && styles.rolePillTextActive]}
          >
            Backed Campaigns
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rolePill, roleMode === 'my_campaigns' && styles.rolePillActive]}
          onPress={() => setRoleMode('my_campaigns')}
          activeOpacity={0.8}
        >
          <Feather
            name="layers"
            size={13}
            color={roleMode === 'my_campaigns' ? '#FFFFFF' : Colors.textSecondary}
          />
          <Text
            style={[
              styles.rolePillText,
              roleMode === 'my_campaigns' && styles.rolePillTextActive,
            ]}
          >
            My Campaigns
          </Text>
        </TouchableOpacity>
      </View>

      {/* User Header Profile Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.userTopRow}>
          <Image source={{ uri: currentUser.avatar }} style={styles.profileAvatar} />
          <View style={styles.userMeta}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <MaterialIcons name="verified" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.userRoleTitle}>{currentUser.roleTitle}</Text>
            <Text style={styles.userLocation}>{currentUser.location}</Text>
          </View>
        </View>

        <Text style={styles.userBio}>{currentUser.bio}</Text>

        {/* 3-Day Amplification Streak Tracker */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.streakLeft}>
              <View style={styles.flameCircle}>
                <Ionicons name="flame" size={20} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.streakTitle}>
                  {currentUser.streakDays}-Day Amplification Streak!
                </Text>
                <Text style={styles.streakSub}>
                  Amplifying daily maintains multiplier bonuses
                </Text>
              </View>
            </View>
            <View style={styles.streakMultiplierTag}>
              <Text style={styles.streakMultiplierText}>1.5x Multiplier</Text>
            </View>
          </View>

          {/* 7-Day Stepper Dots */}
          <View style={styles.streakWeekRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
              const isFilled = idx < currentUser.streakDays % 7;
              return (
                <View key={idx} style={styles.dayDotCol}>
                  <View style={[styles.dayDot, isFilled && styles.dayDotFilled]}>
                    {isFilled && <Feather name="check" size={10} color="#FFFFFF" />}
                  </View>
                  <Text style={[styles.dayText, isFilled && styles.dayTextFilled]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Impact Portfolio Section */}
      <View style={styles.portfolioSection}>
        <View style={styles.portfolioHeader}>
          <Text style={styles.sectionTitle}>Impact Portfolio</Text>
          <TouchableOpacity
            style={styles.certificatePill}
            onPress={() => setShowCertificate(true)}
            activeOpacity={0.8}
          >
            <Feather name="award" size={13} color={Colors.primary} />
            <Text style={styles.certificatePillText}>Official Certificate</Text>
          </TouchableOpacity>
        </View>

        {/* Portfolio Stats 2x2 Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              ~{(currentUser.totalImpressionsAchieved / 1000).toFixed(1)}k
            </Text>
            <Text style={styles.statLabel}>Cumulative Reach</Text>
            <Text style={styles.statFormula}>Targeted civic devices</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>${currentUser.totalDonated}</Text>
            <Text style={styles.statLabel}>Direct Escrow Funds</Text>
            <Text style={styles.statFormula}>100% to audited causes</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser.campaignsAmplifiedCount}</Text>
            <Text style={styles.statLabel}>
              {roleMode === 'backed' ? 'Campaigns Backed' : 'Active Projects'}
            </Text>
            <Text style={styles.statFormula}>3-stage verified</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser.activeRipplesCount}</Text>
            <Text style={styles.statLabel}>Active Broadcasts</Text>
            <Text style={styles.statFormula}>Live now across meta/ads</Text>
          </View>
        </View>
      </View>

      {/* Badges & Rewards */}
      <View style={styles.badgesSection}>
        <Text style={styles.sectionTitle}>Earned Civic Badges</Text>
        <View style={styles.badgesRow}>
          {currentUser.badges.map((b, idx) => (
            <View key={idx} style={styles.badgeCard}>
              <View style={styles.badgeIconRing}>
                <Feather name={b.icon as any} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.badgeCardName}>{b.name}</Text>
              <Text style={styles.badgeCardDesc}>{b.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Dynamic Content depending on Role Mode */}
      {roleMode === 'backed' ? (
        <View style={styles.backedListSection}>
          <Text style={styles.sectionTitle}>Backed Campaigns Feed</Text>
          {MOCK_CAMPAIGNS.slice(0, 2).map((camp) => (
            <View key={camp.id} style={styles.miniCampaignCard}>
              <Image source={{ uri: camp.coverImage }} style={styles.miniCover} />
              <View style={styles.miniContent}>
                <Text style={styles.miniTitle} numberOfLines={1}>
                  {camp.title}
                </Text>
                <Text style={styles.miniReach}>You mobilized 675 citizens</Text>
                <View style={styles.miniStatusRow}>
                  <View style={styles.miniActiveDot} />
                  <Text style={styles.miniActiveText}>Broadcasting in Boston Basin</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.organizerSection}>
          <View style={styles.organizerHeader}>
            <Text style={styles.sectionTitle}>Campaign Ad Ops Telemetry</Text>
            <TouchableOpacity
              style={styles.newCampaignPill}
              onPress={onStartCampaignPress}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={13} color="#FFFFFF" />
              <Text style={styles.newCampaignPillText}>New Campaign</Text>
            </TouchableOpacity>
          </View>

          {/* Organizer Campaign Performance Card */}
          <View style={styles.adOpsCard}>
            <View style={styles.adOpsHeader}>
              <Text style={styles.adOpsTitle}>Clean Rivers Initiative</Text>
              <View style={styles.liveBroadcastTag}>
                <Text style={styles.liveBroadcastTagText}>LIVE BROADCAST</Text>
              </View>
            </View>

            <View style={styles.adOpsMetricsRow}>
              <View style={styles.adOpsMetric}>
                <Text style={styles.adOpsMetricVal}>421.2k</Text>
                <Text style={styles.adOpsMetricLbl}>Delivered</Text>
              </View>
              <View style={styles.adOpsMetric}>
                <Text style={styles.adOpsMetricVal}>3.8%</Text>
                <Text style={styles.adOpsMetricLbl}>Click-Through (CTR)</Text>
              </View>
              <View style={styles.adOpsMetric}>
                <Text style={styles.adOpsMetricVal}>$4,400</Text>
                <Text style={styles.adOpsMetricLbl}>Ad Reserve Left</Text>
              </View>
            </View>

            <View style={styles.adOpsFooter}>
              <Text style={styles.adOpsChannels}>
                Channels: Meta Graph • Instagram • 1 Digital Billboard
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Impact Certificate Modal */}
      <ImpactCertificateModal
        visible={showCertificate}
        onClose={() => setShowCertificate(false)}
        userName={currentUser.name}
        totalImpressions={currentUser.totalImpressionsAchieved}
        totalDonated={currentUser.totalDonated}
      />
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
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.pill,
    padding: 3,
    marginBottom: 16,
  },
  rolePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: Radii.pill,
  },
  rolePillActive: {
    backgroundColor: Colors.primary,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  rolePillTextActive: {
    color: '#FFFFFF',
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    ...Shadows.card,
  },
  userTopRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userMeta: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userRoleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  userLocation: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userBio: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  streakCard: {
    backgroundColor: '#FAF8FF',
    borderRadius: Radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  flameCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  streakSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  streakMultiplierTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  streakMultiplierText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  streakWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  dayDotCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotFilled: {
    backgroundColor: Colors.amber,
  },
  dayText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  dayTextFilled: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  portfolioSection: {
    marginBottom: 16,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  certificatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  certificatePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.subtle,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  statFormula: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgesSection: {
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  badgeIconRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeCardName: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  badgeCardDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  backedListSection: {
    marginTop: 4,
  },
  miniCampaignCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  miniCover: {
    width: 60,
    height: 60,
    borderRadius: Radii.sm,
  },
  miniContent: {
    flex: 1,
  },
  miniTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  miniReach: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  miniStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  miniActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  miniActiveText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  organizerSection: {
    marginTop: 4,
  },
  organizerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newCampaignPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
  },
  newCampaignPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  adOpsCard: {
    backgroundColor: '#1E2238',
    borderRadius: Radii.lg,
    padding: 14,
    marginTop: 8,
  },
  adOpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adOpsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveBroadcastTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  liveBroadcastTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34D399',
  },
  adOpsMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#131728',
    borderRadius: Radii.md,
    padding: 10,
    marginBottom: 10,
  },
  adOpsMetric: {
    alignItems: 'center',
  },
  adOpsMetricVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FBBF24',
  },
  adOpsMetricLbl: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
  },
  adOpsFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
  },
  adOpsChannels: {
    fontSize: 10,
    color: '#CBD5E1',
  },
});
